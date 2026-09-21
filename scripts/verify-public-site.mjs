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

if (failures.length > 0) {
  console.error("Public release verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Public release verified: ${safeFinalUrl}`);
