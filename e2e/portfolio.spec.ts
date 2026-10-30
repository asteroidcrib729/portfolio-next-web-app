import { expect, test } from "@playwright/test";

test("exposes a keyboard-accessible, responsive portfolio", async ({
  page,
  isMobile,
  browserName,
}) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await expect(page).toHaveTitle(/Faraz Hussain/);
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("button", { name: /Switch to (?:light|dark) mode/ })).toBeEnabled({
    timeout: 15_000,
  });

  const skipLink = page.getByRole("link", { name: "Skip to main content" });
  if (browserName === "webkit") {
    // Safari/WebKit follows the operating system's full-keyboard-access preference.
    await skipLink.focus();
  } else {
    await page.keyboard.press("Tab");
  }
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);

  if (isMobile) {
    const trigger = page.getByRole("button", { name: "Open navigation menu" });
    await trigger.click();
    await expect(page.getByRole("dialog", { name: "Primary navigation" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
  }
});

test("defaults analytics on with a persistent reversible opt-out", async ({ page }) => {
  const analyticsRequests: string[] = [];
  page.on("request", (request) => {
    if (/\/_vercel\/insights|va\.vercel-scripts\.com/.test(request.url())) {
      analyticsRequests.push(request.url());
    }
  });

  await page.goto("/privacy");
  await expect(page.getByText("Current setting: analytics enabled.")).toBeVisible();
  await expect.poll(() => analyticsRequests.length, { timeout: 10_000 }).toBeGreaterThan(0);

  await page.getByRole("button", { name: "Disable analytics" }).click();
  await expect(page.getByText("Current setting: analytics disabled.")).toBeVisible();
  analyticsRequests.length = 0;
  await page.reload();
  await expect(page.getByText("Current setting: analytics disabled.")).toBeVisible();
  expect(analyticsRequests).toHaveLength(0);
  await page.getByRole("button", { name: "Enable analytics" }).click();
  await expect(page.getByText("Current setting: analytics enabled.")).toBeVisible();
});

test("publishes recruiter-facing journal and resume routes", async ({ page, request }) => {
  await page.goto("/blog");
  await expect(page.getByRole("heading", { name: /Notes from building the web/i })).toBeVisible();

  await page.goto("/resume");
  await expect(page.getByRole("heading", { name: /software engineering resume/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Open PDF/i })).toHaveAttribute("target", "_blank");
  await expect(page.getByRole("link", { name: /Download PDF/i })).toHaveAttribute("download");
  await expect(page.locator("iframe[title*='resume']")).toHaveAttribute(
    "src",
    /faraz-hussain-resume\.pdf/,
  );

  const pdf = await request.get("/resume/faraz-hussain-resume.pdf");
  expect(pdf.ok()).toBe(true);
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
  expect(pdf.headers()["x-frame-options"]).toBe("SAMEORIGIN");
  expect(pdf.headers()["content-disposition"]).toContain("inline");
});

test("keeps the editorial studio private and non-indexable", async ({ page }) => {
  await page.goto("/studio");
  await expect(page).toHaveURL(/\/studio\/login$/);
  await expect(page.getByRole("heading", { name: "Editorial Studio" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});
