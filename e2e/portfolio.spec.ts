import { expect, test } from "@playwright/test";

test("exposes a keyboard-accessible, responsive portfolio", async ({
  page,
  isMobile,
  browserName,
}) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Faraz Hussain/);
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

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

test("keeps analytics disabled until the visitor opts in", async ({ page }) => {
  const analyticsRequests: string[] = [];
  page.on("request", (request) => {
    if (/\/_vercel\/insights|va\.vercel-scripts\.com/.test(request.url())) {
      analyticsRequests.push(request.url());
    }
  });

  await page.goto("/privacy");
  await expect(page.getByText("Current setting: analytics disabled.")).toBeVisible();
  expect(analyticsRequests).toHaveLength(0);

  await page.getByRole("button", { name: "Enable analytics" }).click();
  await expect(page.getByText("Current setting: analytics enabled.")).toBeVisible();
  await expect
    .poll(() => analyticsRequests.length, { timeout: 10_000 })
    .toBeGreaterThan(0);

  await page.getByRole("button", { name: "Keep analytics off" }).click();
  await expect(page.getByText("Current setting: analytics disabled.")).toBeVisible();
});
