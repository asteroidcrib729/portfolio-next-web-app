import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/siteConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-21T00:00:00.000Z");

  return [
    ["/", 1],
    ["/privacy", 0.5],
    ["/quality", 0.6],
  ].map(([path, priority]) => ({
    url: new URL(String(path), siteConfig.url).toString(),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: Number(priority),
  }));
}
