const rawUrl = process.argv[2] ?? process.env.PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL;

if (!rawUrl) {
  console.error("Provide an HTTPS URL as an argument or PUBLIC_SITE_URL environment variable.");
  process.exit(1);
}

let siteUrl;
try {
  siteUrl = new URL(rawUrl);
} catch {
  console.error(`Invalid public site URL: ${rawUrl}`);
  process.exit(1);
}

if (siteUrl.protocol !== "https:") {
  console.error("The public release URL must use HTTPS.");
  process.exit(1);
}

const response = await fetch(siteUrl, {
  redirect: "follow",
  headers: { "User-Agent": "portfolio-public-release-check/1.0" },
  signal: AbortSignal.timeout(15_000),
});
const html = await response.text();
const finalUrl = new URL(response.url);
const safeFinalUrl = `${finalUrl.origin}${finalUrl.pathname}`;
const robotsHeader = response.headers.get("x-robots-tag") ?? "";

const failures = [];
if (!response.ok) failures.push(`expected HTTP 2xx, received ${response.status}`);
if (finalUrl.hostname === "vercel.com" || /\/sso-api\b/.test(finalUrl.pathname)) {
  failures.push(`redirected to Vercel authentication at ${safeFinalUrl}`);
}
if (/\bnoindex\b/i.test(robotsHeader)) failures.push(`received X-Robots-Tag: ${robotsHeader}`);
if (!/<main\b[^>]*id=["']main-content["']/i.test(html)) {
  failures.push("portfolio main-content marker was not found");
}
if (!/Faraz Hussain/i.test(html)) failures.push("portfolio owner marker was not found");

const paths = [
  "/blog",
  "/privacy",
  "/resume",
  "/rss.xml",
  "/sitemap.xml",
  "/robots.txt",
  "/studio",
  "/resume/faraz-hussain-resume.pdf",
];
for (const path of paths) {
  const result = await fetch(new URL(path, siteUrl.origin), {
    headers: { "User-Agent": "portfolio-public-release-check/1.0" },
    redirect: "follow",
    signal: AbortSignal.timeout(20_000),
  });
  const resolved = new URL(result.url);
  if (!result.ok || resolved.origin !== siteUrl.origin) {
    failures.push(`${path}: expected same-origin HTTP 2xx; received ${result.status}`);
    continue;
  }
  if (path.endsWith(".pdf")) {
    const bytes = new Uint8Array(await result.arrayBuffer());
    if (
      !result.headers.get("content-type")?.includes("application/pdf") ||
      new TextDecoder().decode(bytes.slice(0, 5)) !== "%PDF-"
    )
      failures.push(`${path}: expected a real PDF`);
    if (result.headers.get("x-frame-options") !== "SAMEORIGIN")
      failures.push(`${path}: expected SAMEORIGIN framing`);
    continue;
  }
  const body = await result.text();
  if (
    path === "/studio" &&
    (resolved.pathname !== "/studio/login" || !/name="robots"[^>]*content="[^"]*noindex/.test(body))
  )
    failures.push("studio must redirect to a noindex login page");
  if (path === "/rss.xml" && !body.includes("<rss")) failures.push("RSS feed marker missing");
  if (
    path === "/sitemap.xml" &&
    (!body.includes(`${siteUrl.origin}/blog`) || !body.includes(`${siteUrl.origin}/resume`))
  )
    failures.push("sitemap is missing journal/resume URLs");
  if (path === "/robots.txt" && !body.includes(`Sitemap: ${siteUrl.origin}/sitemap.xml`))
    failures.push("canonical sitemap discovery missing");
}

if (!html.includes('"@type":"WebSite"') || !html.includes('"name":"Faraz Hussain"'))
  failures.push("owner WebSite structured data missing");
if (!/name="description"[^>]*content="I(?:&#x27;|&#39;|&apos;|')m Faraz Hussain/.test(html))
  failures.push("introductory search description missing");

if (failures.length > 0) {
  console.error("Public release verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Public release verified: ${safeFinalUrl}`);
