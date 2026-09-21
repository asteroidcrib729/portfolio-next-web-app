import type { Metadata } from "next";
import { siteConfig, socialLinks } from "@/data/siteConfig";

export const indexingRobots: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export function getGoogleSiteVerification(
  token = process.env.GOOGLE_SITE_VERIFICATION
): Metadata["verification"] {
  const normalizedToken = token?.trim();
  return normalizedToken ? { google: normalizedToken } : undefined;
}

const siteUrl = new URL("/", siteConfig.url).toString();
const personId = new URL("/#person", siteUrl).toString();
const websiteId = new URL("/#website", siteUrl).toString();
const profilePageId = new URL("/#profile-page", siteUrl).toString();
const publicProfiles = socialLinks
  .map((link) => link.href)
  .filter((href) => href.startsWith("https://"));

const person = {
  "@type": "Person",
  "@id": personId,
  name: siteConfig.name,
  url: siteUrl,
  jobTitle: siteConfig.title,
  description: siteConfig.bio,
  knowsAbout: siteConfig.keywords,
  ...(publicProfiles.length > 0 ? { sameAs: publicProfiles } : {}),
};

export const portfolioStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: siteUrl,
      name: `${siteConfig.name} Portfolio`,
      description: siteConfig.bio,
      inLanguage: "en",
      author: { "@id": personId },
    },
    {
      "@type": "ProfilePage",
      "@id": profilePageId,
      url: siteUrl,
      name: `${siteConfig.name} - ${siteConfig.title}`,
      description: siteConfig.bio,
      dateModified: "2026-09-21T00:00:00+05:00",
      inLanguage: "en",
      isPartOf: { "@id": websiteId },
      mainEntity: person,
    },
  ],
};

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
