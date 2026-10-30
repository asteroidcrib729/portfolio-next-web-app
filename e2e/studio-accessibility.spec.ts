import { expect, test, type Locator, type Page } from "@playwright/test";
import axe from "axe-core";
import { getPrisma } from "../src/lib/prisma";

declare global {
  interface Window {
    axe: typeof axe;
  }
}

// This is repeatable keyboard/semantic evidence, not an NVDA/VoiceOver audio test.
async function tabTo(page: Page, target: Locator) {
  for (let count = 0; count < 60; count++) {
    if (await target.evaluate((element) => element === document.activeElement)) return;
    await page.keyboard.press("Tab");
  }
  await expect(target).toBeFocused();
}

test("reviews the studio with keyboard-only input and accessible errors", async ({
  page,
}, testInfo) => {
  test.skip(process.env.RUN_EDITORIAL_E2E !== "1", "Requires the isolated Preview database.");
  test.skip(
    testInfo.project.name !== "chromium",
    "Desktop Chromium keyboard traversal; engine semantics covered separately.",
  );
  test.setTimeout(120_000);
  const slug = `keyboard-review-${Date.now()}`;
  await page.setExtraHTTPHeaders({ "x-vercel-forwarded-for": slug });
  const password = page.getByLabel("Editorial password");
  await page.goto("/studio/login");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await tabTo(page, password);
  await page.keyboard.type("deliberately-wrong-password");
  await tabTo(page, page.getByRole("button", { name: "Enter the studio" }));
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main").getByRole("alert")).toContainText("not valid");
  await expect(password).toHaveAttribute("aria-describedby", "studio-login-error");
  await tabTo(page, password);
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.type(process.env.EDITORIAL_STUDIO_PASSWORD!);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/studio$/);

  try {
    await tabTo(page, page.getByRole("link", { name: "New post", exact: true }));
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { name: "Compose an article" })).toBeVisible();
    await tabTo(page, page.getByLabel("Title", { exact: true }));
    await page.keyboard.type("a");
    await page.keyboard.press("Tab");
    await expect(page.getByLabel("URL slug")).toBeFocused();
    await page.keyboard.press("ControlOrMeta+A");
    await page.keyboard.type(slug);
    await page.keyboard.press("Tab");
    await expect(page.getByLabel("Excerpt", { exact: true })).toBeFocused();
    await page.keyboard.type("A temporary draft for reviewing the editorial keyboard workflow.");
    await page.keyboard.press("Tab");
    await expect(page.getByLabel("Article body (Markdown)")).toBeFocused();
    await page.keyboard.type(
      "## Keyboard review\n\nThis temporary article checks native keyboard traversal, error descriptions, focus restoration, preview access, and safe deletion.",
    );
    await page.keyboard.press("Tab");
    await expect(page.getByLabel("Status", { exact: true })).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowUp");
    await expect(page.getByLabel("Status", { exact: true })).toHaveValue("DRAFT");
    await tabTo(
      page,
      page.getByRole("checkbox", { name: "Prevent search engines from indexing this post" }),
    );
    await page.keyboard.press("Space");
    await expect(
      page.getByRole("checkbox", { name: "Prevent search engines from indexing this post" }),
    ).toBeChecked();
    await tabTo(page, page.getByRole("button", { name: "Save post" }));
    await page.keyboard.press("Enter");
    await expect(page.getByLabel("Title", { exact: true })).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel("Title", { exact: true })).toBeFocused();
    await expect(page.getByLabel("Title", { exact: true })).toHaveAttribute(
      "aria-describedby",
      "title-error",
    );
    await page.keyboard.press("ControlOrMeta+A");
    await page.keyboard.type("Keyboard workflow review");
    await tabTo(page, page.getByRole("button", { name: "Save post" }));
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/studio\/posts\/.+\?saved=1$/);
    await expect(page.getByRole("status")).toContainText("Post saved");
    await testInfo.attach("editor-accessibility-tree", {
      body: await page.locator("body").ariaSnapshot(),
      contentType: "text/plain",
    });
    await tabTo(page, page.getByRole("region", { name: "Markdown preview" }));
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Shift+Tab");
    await expect(page.getByRole("link", { name: "Preview", exact: true })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("heading", { name: "Keyboard workflow review", level: 1 }),
    ).toBeVisible();
    await tabTo(page, page.getByRole("link", { name: "Return to editor" }));
    await page.keyboard.press("Enter");
    await tabTo(
      page,
      page.getByRole("checkbox", { name: "I confirm that I want to delete this post." }),
    );
    await page.keyboard.press("Space");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Delete post" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/studio$/);
    await tabTo(page, page.getByRole("button", { name: "Sign out" }));
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/studio\/login$/);
  } finally {
    await getPrisma().post.deleteMany({ where: { slug } });
  }
});

test("exposes studio landmarks, labels and descriptions without axe violations", async ({
  page,
}, testInfo) => {
  test.skip(process.env.RUN_EDITORIAL_E2E !== "1", "Requires the isolated Preview database.");
  test.setTimeout(120_000);
  await page.setExtraHTTPHeaders({
    "x-vercel-forwarded-for": `semantics-${Date.now()}-${testInfo.project.name}`,
  });
  async function inspect(name: string) {
    await page.evaluate(axe.source);
    const violations = await page.evaluate(async () =>
      (
        await window.axe.run(document, {
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] },
        })
      ).violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) })),
    );
    expect(violations).toEqual([]);
    await testInfo.attach(`${name}-accessibility-tree`, {
      body: await page.locator("body").ariaSnapshot(),
      contentType: "text/plain",
    });
    await page.screenshot({ path: testInfo.outputPath(`${name}.png`), fullPage: true });
  }
  await page.goto("/studio/login");
  await inspect("login");
  await page.getByLabel("Editorial password").fill(process.env.EDITORIAL_STUDIO_PASSWORD!);
  await page.getByRole("button", { name: "Enter the studio" }).click();
  await expect(page).toHaveURL(/\/studio$/);
  await inspect("dashboard");
  await page.goto("/studio/posts/new");
  await inspect("new-post-light");
  await page.evaluate(() => document.documentElement.classList.add("dark"));
  await inspect("new-post-dark");
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/studio\/login$/);
});
