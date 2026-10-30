import { describe, expect, it } from "vitest";
import { createSlug, normalizeTags, postInputSchema } from "@/lib/editorial";

const validPost = {
  title: "Designing an accessible editorial system",
  slug: "designing-an-accessible-editorial-system",
  excerpt:
    "A practical account of building an editorial workflow with durable accessibility and SEO controls.",
  content:
    "## Start with the reader\n\nA useful editorial system protects the reader experience while giving the author enough structure to publish consistently.",
  status: "DRAFT" as const,
  tags: "Next.js, Accessibility",
  focusKeyword: "accessible editorial system",
  seoTitle: "Accessible Editorial Systems",
  seoDescription:
    "Build an accessible editorial system with intentional metadata and publishing controls.",
  canonicalUrl: "",
  socialImageUrl: "https://example.test/editorial.png",
  socialImageAlt: "Editorial studio interface",
  noIndex: false,
};

describe("editorial content validation", () => {
  it("creates stable URL slugs from human titles", () => {
    expect(createSlug("  Résumé-led SEO & Writing  ")).toBe("resume-led-seo-writing");
  });

  it("deduplicates and bounds editorial tags", () => {
    expect(normalizeTags("Next.js, SEO, Next.js, Accessibility")).toEqual([
      "Next.js",
      "SEO",
      "Accessibility",
    ]);
  });

  it("accepts a complete post and rejects unsafe metadata", () => {
    expect(postInputSchema.safeParse(validPost).success).toBe(true);
    expect(
      postInputSchema.safeParse({
        ...validPost,
        slug: "Invalid Slug",
        canonicalUrl: "javascript:alert(1)",
      }).success,
    ).toBe(false);
  });
});
