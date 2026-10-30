import { expect, test } from "@playwright/test";
import { getPrisma } from "../src/lib/prisma";

test("persists an editorial draft, publishes SEO, archives, and signs out", async ({
  page,
  request,
}, testInfo) => {
  test.skip(
    process.env.RUN_EDITORIAL_E2E !== "1",
    "Requires the isolated Preview database and studio secrets.",
  );
  test.setTimeout(120_000);
  const slug = `editorial-verification-${Date.now()}-${testInfo.project.name}`;
  await page.setExtraHTTPHeaders({ "x-vercel-forwarded-for": `test-${slug}` });
  let editorUrl: string | undefined;
  async function save() {
    await Promise.all([
      page.waitForResponse(
        (response) =>
          response.request().method() === "POST" && response.url().includes("/studio/posts/"),
      ),
      page.getByRole("button", { name: "Save post" }).click(),
    ]);
    await expect(page.getByRole("button", { name: "Save post" })).toBeEnabled();
  }

  await page.goto("/studio/login");
  await page.getByLabel("Editorial password").fill(process.env.EDITORIAL_STUDIO_PASSWORD!);
  await page.getByRole("button", { name: "Enter the studio" }).click();
  await expect(page).toHaveURL(/\/studio$/);

  try {
    await page.goto("/studio/posts/new");
    await page.getByLabel("Title", { exact: true }).fill("Editorial workflow verification");
    await page.getByLabel("URL slug").fill(slug);
    await page
      .getByLabel("Excerpt", { exact: true })
      .fill(
        "A temporary article validating isolated preview publishing, metadata, and editorial access controls.",
      );
    await page
      .getByLabel("Article body (Markdown)")
      .fill(
        "## A complete publishing workflow\n\nThis temporary article exercises the real PostgreSQL-backed editorial workflow, from private draft to published article and archival.",
      );
    await page.getByLabel("SEO title", { exact: true }).fill("Verified editorial search title");
    await page
      .getByLabel("Meta description", { exact: true })
      .fill("A verified description for the editorial integration test.");
    await save();
    await expect(page).toHaveURL(/\/studio\/posts\/.+\?saved=1$/);
    editorUrl = page.url();
    expect((await request.get(`/blog/${slug}`)).status()).toBe(404);
    await page.getByRole("link", { name: "Preview", exact: true }).click();
    await expect(page).toHaveURL(/\/studio\/preview\//);
    await expect(
      page.getByRole("heading", { name: "Editorial workflow verification", level: 1 }),
    ).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await page.goto(editorUrl);
    await page.getByLabel("Status", { exact: true }).selectOption("PUBLISHED");
    await save();
    await page.goto(`/blog/${slug}`);
    await expect(page).toHaveTitle(/Verified editorial search title/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      "A verified description for the editorial integration test.",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      new RegExp(`/blog/${slug}$`),
    );
    expect(await page.locator('script[type="application/ld+json"]').allTextContents()).toEqual(
      expect.arrayContaining([expect.stringContaining('"@type":"BlogPosting"')]),
    );
    expect(await (await request.get("/sitemap.xml")).text()).toContain(`/blog/${slug}`);
    expect(await (await request.get("/rss.xml")).text()).toContain(`/blog/${slug}`);
    await page.goto(editorUrl);
    await page.getByLabel("Prevent search engines from indexing this post").check();
    await save();
    await page.goto(`/blog/${slug}`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    expect(await (await request.get("/sitemap.xml")).text()).not.toContain(`/blog/${slug}`);
    await page.goto(editorUrl);
    await page.getByLabel("Status", { exact: true }).selectOption("ARCHIVED");
    await save();
    expect((await request.get(`/blog/${slug}`)).status()).toBe(404);
    await page.goto(editorUrl);
    const dimensions = await page.evaluate(() => ({
      width: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.width);
    await page.getByLabel("I confirm that I want to delete this post.").check();
    await page.getByRole("button", { name: "Delete post" }).click();
    await expect(page).toHaveURL(/\/studio$/);
    await page.goto("/studio");
    await expect(page.getByRole("heading", { name: "Articles and SEO" })).toBeVisible();
    await page.getByRole("button", { name: "Sign out" }).click({ noWaitAfter: true });
    await expect(page).toHaveURL(/\/studio\/login$/);
    await page.goto("/studio");
    await expect(page).toHaveURL(/\/studio\/login$/);
  } catch (error) {
    await page.screenshot({ path: testInfo.outputPath("failure.png"), fullPage: true });
    throw error;
  } finally {
    // Limit cleanup to this test's unique slug, even when a browser assertion fails.
    await getPrisma().post.deleteMany({ where: { slug } });
  }
});
