import { siteConfig } from "@/data/siteConfig";
import { listPublishedPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function escapeXml(value: string) {
  return value.replace(
    /[<>&'"]/g,
    (character) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[character] ?? character,
  );
}

export async function GET() {
  const posts = await listPublishedPosts();
  const blogUrl = new URL("/blog", siteConfig.url).toString();
  const items = posts
    .map((post) => {
      const url = new URL(`/blog/${post.slug}`, siteConfig.url).toString();
      return `<item><title>${escapeXml(post.title)}</title><link>${url}</link><guid>${url}</guid><description>${escapeXml(post.excerpt)}</description><pubDate>${post.publishedAt?.toUTCString() ?? ""}</pubDate></item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(`${siteConfig.name} Engineering Journal`)}</title><link>${blogUrl}</link><description>${escapeXml(siteConfig.bio)}</description><language>en</language>${items}</channel></rss>`;

  return new Response(xml, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
