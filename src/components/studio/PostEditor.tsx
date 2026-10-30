"use client";

import {
  useActionState,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { Eye, Save, Trash2 } from "lucide-react";
import { deletePost, savePost, type StudioActionState } from "@/app/studio/actions";
import { MarkdownArticle } from "@/components/blog/MarkdownArticle";

export interface EditorPost {
  canonicalUrl: string;
  content: string;
  excerpt: string;
  focusKeyword: string;
  id?: string;
  noIndex: boolean;
  seoDescription: string;
  seoTitle: string;
  slug: string;
  socialImageAlt: string;
  socialImageUrl: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  tags: string;
  title: string;
}

interface PostEditorProps {
  post: EditorPost;
}

const initialState: StudioActionState = {};
const subscribeToHydration = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);
}

function FieldError({ name, errors }: { name: string; errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <p id={`${name}-error`} className="mt-2 text-sm font-medium text-red-700 dark:text-red-300">
      {errors[0]}
    </p>
  );
}

export function PostEditor({ post }: PostEditorProps) {
  const hydrated = useSyncExternalStore(subscribeToHydration, clientReady, serverReady);
  const [state, action, pending] = useActionState(savePost, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (state.message) {
      const firstInvalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      (firstInvalid ?? summaryRef.current)?.focus();
    }
  }, [state]);

  function fieldAccessibility(name: string, hintId?: string) {
    const invalid = Boolean(state.errors?.[name]?.length);
    return {
      "aria-invalid": invalid || undefined,
      "aria-describedby":
        [hintId, invalid ? `${name}-error` : undefined].filter(Boolean).join(" ") || undefined,
    };
  }
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [slugWasEdited, setSlugWasEdited] = useState(Boolean(post.id));
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [content, setContent] = useState(post.content);
  const deferredContent = useDeferredValue(content);
  const [seoTitle, setSeoTitle] = useState(post.seoTitle);
  const [seoDescription, setSeoDescription] = useState(post.seoDescription);

  const inputClass =
    "mt-2 min-h-12 w-full min-w-0 rounded-xl border border-border bg-background px-4 text-foreground shadow-sm";
  const labelClass = "text-sm font-semibold text-foreground";

  return (
    <div className="grid min-w-0 grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <form
        ref={formRef}
        action={action}
        aria-label="Article editor"
        aria-busy={!hydrated || pending}
        className="min-w-0 space-y-8"
      >
        {post.id ? <input type="hidden" name="id" value={post.id} /> : null}

        <fieldset disabled={!hydrated} className="min-w-0 space-y-8">
          <legend className="sr-only">Article content and SEO</legend>

          {state.message ? (
            <p
              ref={summaryRef}
              tabIndex={-1}
              role="alert"
              className="rounded-xl border border-border bg-muted px-4 py-3 text-sm"
            >
              {state.message}
            </p>
          ) : null}

          <section className="space-y-6 rounded-3xl border border-border bg-card p-6 surface-shadow">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Content</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Story and publishing</h2>
            </div>

            <div>
              <label htmlFor="title" className={labelClass}>
                Title
              </label>
              <input
                id="title"
                {...fieldAccessibility("title")}
                name="title"
                value={title}
                onChange={(event) => {
                  const value = event.target.value;
                  setTitle(value);
                  if (!slugWasEdited) setSlug(slugify(value));
                }}
                required
                maxLength={120}
                className={inputClass}
              />
              <FieldError name="title" errors={state.errors?.title} />
            </div>

            <div>
              <label htmlFor="slug" className={labelClass}>
                URL slug
              </label>
              <input
                id="slug"
                {...fieldAccessibility("slug", "slug-hint")}
                name="slug"
                value={slug}
                onChange={(event) => {
                  setSlugWasEdited(true);
                  setSlug(slugify(event.target.value));
                }}
                required
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                maxLength={160}
                className={`${inputClass} font-mono`}
              />
              <p id="slug-hint" className="mt-2 break-all text-xs text-muted-foreground">
                /blog/{slug || "your-post-slug"}
              </p>
              <FieldError name="slug" errors={state.errors?.slug} />
            </div>

            <div>
              <label htmlFor="excerpt" className={labelClass}>
                Excerpt
              </label>
              <textarea
                id="excerpt"
                {...fieldAccessibility("excerpt", "excerpt-hint")}
                name="excerpt"
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                required
                minLength={30}
                maxLength={320}
                rows={4}
                className={`${inputClass} py-3`}
              />
              <p id="excerpt-hint" className="mt-2 text-xs text-muted-foreground">
                {excerpt.length}/320 characters
              </p>
              <FieldError name="excerpt" errors={state.errors?.excerpt} />
            </div>

            <div>
              <label htmlFor="content" className={labelClass}>
                Article body (Markdown)
              </label>
              <textarea
                id="content"
                {...fieldAccessibility("content", "content-hint")}
                name="content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                required
                minLength={80}
                rows={24}
                className={`${inputClass} min-h-[34rem] py-4 font-mono text-sm leading-6`}
              />
              <p id="content-hint" className="mt-2 text-xs text-muted-foreground">
                {content.trim() ? content.trim().split(/\s+/).length : 0} words
              </p>
              <FieldError name="content" errors={state.errors?.content} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="status" className={labelClass}>
                  Status
                </label>
                <select
                  id="status"
                  {...fieldAccessibility("status")}
                  name="status"
                  defaultValue={post.status}
                  className={inputClass}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
                <FieldError name="status" errors={state.errors?.status} />
              </div>
              <div>
                <label htmlFor="tags" className={labelClass}>
                  Tags
                </label>
                <input
                  id="tags"
                  {...fieldAccessibility("tags")}
                  name="tags"
                  defaultValue={post.tags}
                  placeholder="Next.js, Accessibility, SEO"
                  maxLength={300}
                  className={inputClass}
                />
                <FieldError name="tags" errors={state.errors?.tags} />
              </div>
            </div>
          </section>

          <section className="space-y-6 rounded-3xl border border-border bg-card p-6 surface-shadow">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
                On-page SEO
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Search and social presentation
              </h2>
            </div>

            <div>
              <label htmlFor="focusKeyword" className={labelClass}>
                Focus keyword
              </label>
              <input
                id="focusKeyword"
                {...fieldAccessibility("focusKeyword")}
                name="focusKeyword"
                defaultValue={post.focusKeyword}
                maxLength={120}
                className={inputClass}
              />
              <FieldError name="focusKeyword" errors={state.errors?.focusKeyword} />
            </div>

            <div>
              <label htmlFor="seoTitle" className={labelClass}>
                SEO title
              </label>
              <input
                id="seoTitle"
                {...fieldAccessibility("seoTitle", "seoTitle-hint")}
                name="seoTitle"
                value={seoTitle}
                onChange={(event) => setSeoTitle(event.target.value)}
                maxLength={70}
                placeholder={title || "Defaults to the article title"}
                className={inputClass}
              />
              <p id="seoTitle-hint" className="mt-2 text-xs text-muted-foreground">
                {seoTitle.length}/70 characters
              </p>
              <FieldError name="seoTitle" errors={state.errors?.seoTitle} />
            </div>

            <div>
              <label htmlFor="seoDescription" className={labelClass}>
                Meta description
              </label>
              <textarea
                id="seoDescription"
                {...fieldAccessibility("seoDescription", "seoDescription-hint")}
                name="seoDescription"
                value={seoDescription}
                onChange={(event) => setSeoDescription(event.target.value)}
                maxLength={170}
                rows={4}
                placeholder="Defaults to the article excerpt"
                className={`${inputClass} py-3`}
              />
              <p id="seoDescription-hint" className="mt-2 text-xs text-muted-foreground">
                {seoDescription.length}/170 characters
              </p>
              <FieldError name="seoDescription" errors={state.errors?.seoDescription} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="canonicalUrl" className={labelClass}>
                  Canonical URL override
                </label>
                <input
                  id="canonicalUrl"
                  {...fieldAccessibility("canonicalUrl")}
                  name="canonicalUrl"
                  type="url"
                  defaultValue={post.canonicalUrl}
                  className={inputClass}
                />
                <FieldError name="canonicalUrl" errors={state.errors?.canonicalUrl} />
              </div>
              <div>
                <label htmlFor="socialImageUrl" className={labelClass}>
                  Social image URL
                </label>
                <input
                  id="socialImageUrl"
                  {...fieldAccessibility("socialImageUrl")}
                  name="socialImageUrl"
                  type="url"
                  defaultValue={post.socialImageUrl}
                  className={inputClass}
                />
                <FieldError name="socialImageUrl" errors={state.errors?.socialImageUrl} />
              </div>
            </div>

            <div>
              <label htmlFor="socialImageAlt" className={labelClass}>
                Social image alternative text
              </label>
              <input
                id="socialImageAlt"
                {...fieldAccessibility("socialImageAlt")}
                name="socialImageAlt"
                defaultValue={post.socialImageAlt}
                maxLength={180}
                className={inputClass}
              />
              <FieldError name="socialImageAlt" errors={state.errors?.socialImageAlt} />
            </div>

            <label className="flex min-h-12 items-center gap-3 rounded-xl border border-border bg-background px-4">
              <input
                name="noIndex"
                type="checkbox"
                defaultChecked={post.noIndex}
                className="h-5 w-5 accent-[var(--accent)]"
              />
              <span className="text-sm font-medium">
                Prevent search engines from indexing this post
              </span>
            </label>
          </section>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-foreground px-6 font-semibold text-background disabled:opacity-60"
            >
              <Save aria-hidden="true" className="h-4 w-4" />
              {pending ? "Saving..." : "Save post"}
            </button>
            {post.id ? (
              <Link
                href={`/studio/preview/${post.id}`}
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-border bg-card px-5 font-semibold"
              >
                <Eye aria-hidden="true" className="h-4 w-4" /> Preview
              </Link>
            ) : null}
          </div>
        </fieldset>
      </form>

      <aside className="min-w-0 space-y-5 xl:sticky xl:top-24 xl:self-start">
        <section className="rounded-3xl border border-border bg-card p-5 surface-shadow">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
            Search preview
          </p>
          <p className="mt-4 truncate text-sm text-muted-foreground">
            faraz-hussain-portfolio.vercel.app › blog › {slug || "post"}
          </p>
          <h2 className="mt-2 text-xl font-semibold text-accent">
            {seoTitle || title || "Article title"}
          </h2>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {seoDescription || excerpt || "Your search description appears here."}
          </p>
        </section>

        <section
          tabIndex={0}
          aria-labelledby="markdown-preview-title"
          className="max-h-[36rem] overflow-y-auto rounded-3xl border border-border bg-card p-5 surface-shadow"
        >
          <p
            id="markdown-preview-title"
            className="font-mono text-xs uppercase tracking-[0.18em] text-accent"
          >
            Markdown preview
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">
            {title || "Untitled article"}
          </h2>
          <MarkdownArticle
            content={deferredContent || "Start writing to preview the article."}
            className="mt-5 text-sm leading-7"
          />
        </section>

        {post.id ? (
          <form
            action={deletePost}
            className="rounded-3xl border border-red-300/70 bg-card p-5 dark:border-red-900"
          >
            <input type="hidden" name="id" value={post.id} />
            <p className="text-sm text-muted-foreground">Deleting a post is permanent.</p>
            <label className="mt-3 flex items-center gap-3 text-sm">
              <input name="confirmDelete" type="checkbox" required className="h-5 w-5" />I confirm
              that I want to delete this post.
            </label>
            <button
              type="submit"
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-red-500 px-4 font-semibold text-red-700 dark:text-red-300"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" /> Delete post
            </button>
          </form>
        ) : null}
      </aside>
    </div>
  );
}
