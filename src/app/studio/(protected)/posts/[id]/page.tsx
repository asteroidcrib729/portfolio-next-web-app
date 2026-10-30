import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/common/Container";
import { PostEditor } from "@/components/studio/PostEditor";
import { getPrisma } from "@/lib/prisma";
import { requireStudioSession } from "@/lib/studioAuth";

export const metadata: Metadata = { title: "Edit Article" };
export const runtime = "nodejs";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireStudioSession();
  const { id } = await params;
  const post = await getPrisma().post.findUnique({ where: { id } });
  if (!post) notFound();
  const { saved } = await searchParams;

  return (
    <main id="main-content" tabIndex={-1} className="py-12 sm:py-16">
      <Container>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Editing</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">{post.title}</h1>
        <p className="mt-4 mb-10 text-muted-foreground">
          Last updated{" "}
          {post.updatedAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
        </p>
        <PostEditor
          post={{
            id: post.id,
            canonicalUrl: post.canonicalUrl ?? "",
            content: post.content,
            excerpt: post.excerpt,
            focusKeyword: post.focusKeyword ?? "",
            noIndex: post.noIndex,
            seoDescription: post.seoDescription ?? "",
            seoTitle: post.seoTitle ?? "",
            slug: post.slug,
            socialImageAlt: post.socialImageAlt ?? "",
            socialImageUrl: post.socialImageUrl ?? "",
            status: post.status,
            tags: post.tags.join(", "),
            title: post.title,
          }}
        />
        {saved === "1" ? (
          <p role="status" className="mt-6 text-sm text-muted-foreground">
            Post saved.
          </p>
        ) : null}
      </Container>
    </main>
  );
}
