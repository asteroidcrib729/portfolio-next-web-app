import Link from "next/link";
import { ArrowUpRight, FileText, Plus } from "lucide-react";
import { Container } from "@/components/common/Container";
import { getPrisma } from "@/lib/prisma";
import { requireStudioSession } from "@/lib/studioAuth";

export const runtime = "nodejs";

export default async function StudioDashboardPage() {
  await requireStudioSession();
  const posts = await getPrisma().post.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <main id="main-content" tabIndex={-1} className="py-14 sm:py-20">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Publishing workspace
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Articles and SEO
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
              Manage drafts, publishing state, search metadata, social previews, and canonical URLs
              from one private workspace.
            </p>
          </div>
          <Link
            href="/studio/posts/new"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-foreground px-5 font-semibold text-background"
          >
            <Plus aria-hidden="true" className="h-4 w-4" /> Create an article
          </Link>
        </div>

        <section className="mt-10 overflow-hidden rounded-3xl border border-border bg-card surface-shadow">
          {posts.length ? (
            <div className="divide-y divide-border">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-border bg-muted px-3 py-1 font-mono text-[11px] font-semibold tracking-wide">
                        {post.status.toLowerCase()}
                      </span>
                      <time
                        className="text-xs text-muted-foreground"
                        dateTime={post.updatedAt.toISOString()}
                      >
                        Updated{" "}
                        {post.updatedAt.toLocaleDateString("en-US", { dateStyle: "medium" })}
                      </time>
                    </div>
                    <h2 className="mt-3 text-xl font-semibold tracking-tight">{post.title}</h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {post.status === "PUBLISHED" ? (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Read ${post.title} (opens in a new tab)`}
                        className="inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-muted-foreground hover:text-accent"
                      >
                        Live <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                      </Link>
                    ) : null}
                    <Link
                      href={`/studio/posts/${post.id}`}
                      aria-label={`Edit ${post.title}`}
                      className="inline-flex min-h-11 items-center rounded-xl border border-border bg-background px-4 text-sm font-semibold"
                    >
                      Edit
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <FileText aria-hidden="true" className="mx-auto h-10 w-10 text-accent" />
              <h2 className="mt-5 text-2xl font-semibold">No articles yet</h2>
              <p className="mt-3 text-muted-foreground">
                Create the first draft to begin building the editorial archive.
              </p>
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}
