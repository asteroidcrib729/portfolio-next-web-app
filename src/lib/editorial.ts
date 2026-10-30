import { z } from "zod";
import { PostStatus } from "@/generated/prisma/enums";

const optionalUrl = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => {
    if (value === "") return true;
    if (!URL.canParse(value)) return false;
    const protocol = new URL(value).protocol;
    return protocol === "https:" || protocol === "http:";
  }, "Enter a valid HTTP or HTTPS URL.");

export const postInputSchema = z.object({
  id: z.string().trim().optional(),
  title: z.string().trim().min(5).max(120),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  excerpt: z.string().trim().min(30).max(320),
  content: z.string().trim().min(80).max(100_000),
  status: z.enum(PostStatus),
  tags: z.string().trim().max(300),
  focusKeyword: z.string().trim().max(120),
  seoTitle: z.string().trim().max(70),
  seoDescription: z.string().trim().max(170),
  canonicalUrl: optionalUrl,
  socialImageUrl: optionalUrl,
  socialImageAlt: z.string().trim().max(180),
  noIndex: z.boolean(),
});

export type PostInput = z.infer<typeof postInputSchema>;

export function createSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);
}

export function parsePostForm(formData: FormData) {
  return postInputSchema.safeParse({
    id: String(formData.get("id") ?? "").trim() || undefined,
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    status: formData.get("status"),
    tags: formData.get("tags"),
    focusKeyword: formData.get("focusKeyword"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    canonicalUrl: formData.get("canonicalUrl"),
    socialImageUrl: formData.get("socialImageUrl"),
    socialImageAlt: formData.get("socialImageAlt"),
    noIndex: formData.get("noIndex") === "on",
  });
}

export function normalizeTags(value: string) {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 12),
    ),
  );
}
