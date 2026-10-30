import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/common/Container";
import { MarkdownArticle } from "@/components/blog/MarkdownArticle";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { siteConfig } from "@/data/siteConfig";
import { getPostSeo, getPublishedPost } from "@/lib/posts";
import { createBlogPostStructuredData, serializeJsonLd } from "@/lib/seo";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return {};

  const seo = getPostSeo(post);
  const path = `/blog/${post.slug}`;
  const images = post.socialImageUrl
    ? [{ url: post.socialImageUrl, alt: post.socialImageAlt || post.title }]
    : [{ url: "/opengraph-image", alt: `${siteConfig.name} portfolio` }];

  return {
    title: seo.title,
    description: seo.description,
    keywords: post.tags,
    alternates: { canonical: post.canonicalUrl || path },
    robots: post.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      url: post.canonicalUrl || path,
      title: seo.title,
      description: seo.description,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [siteConfig.name],
      tags: post.tags,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: images.map((image) => image.url),
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const structuredData = createBlogPostStructuredData(post);
  const readingMinutes = Math.max(1, Math.ceil(post.content.trim().split(/\s+/).length / 220));

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 py-12 outline-none sm:py-20">
        <Container className="max-w-4xl">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
          />
          <Link
            href="/blog"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-accent"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" /> All articles
          </Link>

          <article className="mt-10">
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-accent">
              <time dateTime={post.publishedAt?.toISOString()}>
                {post.publishedAt?.toLocaleDateString("en-US", { dateStyle: "long" })}
              </time>
              <span aria-hidden="true">·</span>
              <span>{readingMinutes} min read</span>
            </div>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
              {post.title}
            </h1>
            <p className="mt-6 text-xl leading-8 text-muted-foreground">{post.excerpt}</p>
            {post.tags.length ? (
              <div className="mt-7 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-muted px-3 py-1 font-mono text-[11px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
            <div className="my-10 h-px bg-border" />
            <MarkdownArticle content={post.content} />
          </article>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
