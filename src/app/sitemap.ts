import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/siteConfig";
import { listPublishedPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date("2026-10-29T00:00:00.000Z");
  const staticEntries = [
    ["/", 1],
    ["/blog", 0.8],
    ["/resume", 0.7],
    ["/privacy", 0.5],
    ["/quality", 0.6],
  ].map(([path, priority]) => ({
    url: new URL(String(path), siteConfig.url).toString(),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: Number(priority),
  }));
  const posts = await listPublishedPosts();
  const postEntries = posts
    .filter((post) => !post.noIndex)
    .map((post) => ({
      url: new URL(`/blog/${post.slug}`, siteConfig.url).toString(),
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [...staticEntries, ...postEntries];
}
