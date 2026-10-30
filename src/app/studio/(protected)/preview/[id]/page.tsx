import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/common/Container";
import { MarkdownArticle } from "@/components/blog/MarkdownArticle";
import { getPrisma } from "@/lib/prisma";
import { requireStudioSession } from "@/lib/studioAuth";

export const metadata: Metadata = { title: "Article Preview" };
export const runtime = "nodejs";

export default async function StudioPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  await requireStudioSession();
  const { id } = await params;
  const post = await getPrisma().post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <main id="main-content" tabIndex={-1} className="py-12 sm:py-20">
      <Container className="max-w-4xl">
        <Link
          href={`/studio/posts/${post.id}`}
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-accent"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Return to editor
        </Link>
        <div className="mt-8 rounded-2xl border border-amber-400/70 bg-amber-100/60 px-4 py-3 text-sm font-medium text-amber-950 dark:bg-amber-950/30 dark:text-amber-100">
          Private preview · {post.status.toLowerCase()}
        </div>
        <article className="mt-12">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            {post.tags.join(" · ") || "Engineering journal"}
          </p>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            {post.title}
          </h1>
          <p className="mt-6 text-xl leading-8 text-muted-foreground">{post.excerpt}</p>
          <MarkdownArticle content={post.content} className="mt-12" />
        </article>
      </Container>
    </main>
  );
}
