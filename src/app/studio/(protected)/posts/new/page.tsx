import type { Metadata } from "next";
import { Container } from "@/components/common/Container";
import { PostEditor } from "@/components/studio/PostEditor";
import { requireStudioSession } from "@/lib/studioAuth";

export const metadata: Metadata = { title: "New Article" };

export default async function NewPostPage() {
  await requireStudioSession();
  return (
    <main id="main-content" tabIndex={-1} className="py-12 sm:py-16">
      <Container>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">New draft</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Compose an article</h1>
        <p className="mt-4 mb-10 max-w-2xl leading-7 text-muted-foreground">
          Write in Markdown, control every indexable field, and preview the search presentation
          before publishing.
        </p>
        <PostEditor
          post={{
            canonicalUrl: "",
            content: "",
            excerpt: "",
            focusKeyword: "",
            noIndex: false,
            seoDescription: "",
            seoTitle: "",
            slug: "",
            socialImageAlt: "",
            socialImageUrl: "",
            status: "DRAFT",
            tags: "",
            title: "",
          }}
        />
      </Container>
    </main>
  );
}
