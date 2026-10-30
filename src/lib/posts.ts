import { cache } from "react";
import { PostStatus, type Post } from "@/generated/prisma/client";
import { getPrisma, hasDatabaseConfiguration } from "@/lib/prisma";

export async function listPublishedPosts() {
  if (!hasDatabaseConfiguration()) return [];

  return getPrisma().post.findMany({
    where: {
      status: PostStatus.PUBLISHED,
      publishedAt: { lte: new Date() },
    },
    orderBy: { publishedAt: "desc" },
  });
}

export const getPublishedPost = cache(async (slug: string) => {
  if (!hasDatabaseConfiguration()) return null;

  return getPrisma().post.findFirst({
    where: {
      slug,
      status: PostStatus.PUBLISHED,
      publishedAt: { lte: new Date() },
    },
  });
});

export function getPostSeo(post: Post) {
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
  };
}
