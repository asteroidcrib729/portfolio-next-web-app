import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { siteConfig } from "@/data/siteConfig";
import {
  getGoogleSiteVerification,
  indexingRobots,
  portfolioStructuredData,
  serializeJsonLd,
} from "@/lib/seo";

describe("search indexing metadata", () => {
  it("explicitly permits indexing and rich previews", () => {
    expect(indexingRobots).toMatchObject({
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    });
  });

  it("publishes a crawlable host and absolute sitemap", async () => {
    const policy = robots();
    const entries = await sitemap();

    expect(policy).toMatchObject({
      rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/studio/"] },
      host: siteConfig.url,
      sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
    });
    expect(entries).toHaveLength(5);
    expect(entries.every((entry) => entry.url.startsWith(siteConfig.url))).toBe(true);
  });

  it("normalizes an optional Search Console verification token", () => {
    expect(getGoogleSiteVerification("  verification-token  ")).toEqual({
      google: "verification-token",
    });
    expect(getGoogleSiteVerification("  ")).toBeUndefined();
  });

  it("describes the portfolio as a profile page without unsafe script content", () => {
    const graph = portfolioStructuredData["@graph"];
    const profilePage = graph.find((entry) => entry["@type"] === "ProfilePage");

    expect(profilePage).toMatchObject({
      url: new URL("/", siteConfig.url).toString(),
      mainEntity: {
        "@type": "Person",
        name: siteConfig.name,
        jobTitle: siteConfig.title,
      },
    });
    expect(serializeJsonLd({ value: "</script>" })).toContain("\\u003c/script>");
  });

  it("offers an owner-first site name and introductory search description", () => {
    expect(
      portfolioStructuredData["@graph"].find((entry) => entry["@type"] === "WebSite"),
    ).toMatchObject({
      name: "Faraz Hussain",
      alternateName: expect.arrayContaining(["Faraz Hussain Portfolio"]),
      url: new URL("/", siteConfig.url).toString(),
    });
    expect(siteConfig.description).toMatch(/^I'm Faraz Hussain, a full-stack software engineer/);
    expect(siteConfig.description.length).toBeLessThanOrEqual(160);
  });
});
