import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { listPublishedPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Engineering Journal",
  description:
    "Articles by Faraz Hussain about full-stack engineering, frontend architecture, accessibility, performance, and product-quality web development.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "/blog",
    title: "Engineering Journal - Faraz Hussain",
    description: "Practical notes on building accessible, durable, product-quality software.",
  },
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function BlogIndexPage() {
  const posts = await listPublishedPosts();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 py-16 outline-none sm:py-24">
        <Container>
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Engineering journal
            </p>
            <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight sm:text-7xl">
              Notes from building the web with intent.
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              I write about frontend systems, full-stack decisions, accessibility, performance, and
              the product thinking behind durable software.
            </p>
          </div>

          {posts.length ? (
            <section aria-label="Published articles" className="mt-14 grid gap-5 lg:grid-cols-2">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group rounded-3xl border border-border bg-card p-6 surface-shadow transition-transform duration-300 hover:-translate-y-1 sm:p-8"
                >
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <time dateTime={post.publishedAt?.toISOString()}>
                      {post.publishedAt?.toLocaleDateString("en-US", { dateStyle: "long" })}
                    </time>
                    <span aria-hidden="true">·</span>
                    <span>
                      {Math.max(1, Math.ceil(post.content.trim().split(/\s+/).length / 220))} min
                      read
                    </span>
                  </div>
                  <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="transition-colors group-hover:text-accent"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-4 line-clamp-3 leading-7 text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-muted px-3 py-1 font-mono text-[11px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                    Read article <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  </span>
                </article>
              ))}
            </section>
          ) : (
            <section className="mt-14 rounded-3xl border border-border bg-card px-6 py-16 text-center surface-shadow">
              <BookOpen aria-hidden="true" className="mx-auto h-10 w-10 text-accent" />
              <h2 className="mt-5 text-2xl font-semibold">The first article is being prepared.</h2>
              <p className="mx-auto mt-3 max-w-xl leading-7 text-muted-foreground">
                The editorial system is ready; published writing will appear here as it leaves the
                studio.
              </p>
            </section>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
