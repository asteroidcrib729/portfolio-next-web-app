"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma, PostStatus } from "@/generated/prisma/client";
import { normalizeTags, parsePostForm } from "@/lib/editorial";
import { getPrisma } from "@/lib/prisma";
import { checkRateLimit, pseudonymizeIdentifier } from "@/lib/rateLimit";
import {
  createStudioSession,
  destroyStudioSession,
  requireStudioSession,
  verifyStudioPassword,
} from "@/lib/studioAuth";

export interface StudioActionState {
  errors?: Record<string, string[]>;
  message?: string;
}

const emptyState: StudioActionState = {};

export async function loginToStudio(
  _previousState: StudioActionState = emptyState,
  formData: FormData,
): Promise<StudioActionState> {
  void _previousState;
  const requestHeaders = await headers();
  const identifier =
    requestHeaders.get("x-vercel-forwarded-for") ??
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "local";
  const salt = process.env.RATE_LIMIT_SALT?.trim();
  if (!salt && process.env.NODE_ENV === "production") {
    return { message: "The editorial studio is temporarily unavailable." };
  }

  try {
    const rateLimit = await checkRateLimit({
      identifier: pseudonymizeIdentifier(identifier, salt ?? "local-studio-login"),
      maxRequests: 8,
      scope: "studio-login",
      windowMs: 15 * 60 * 1_000,
    });
    if (!rateLimit.allowed) {
      return { message: "Too many sign-in attempts. Please wait before trying again." };
    }
  } catch {
    return { message: "The editorial studio is temporarily unavailable." };
  }

  const password = String(formData.get("password") ?? "");
  if (!verifyStudioPassword(password)) {
    return { message: "The supplied editorial password is not valid." };
  }

  await createStudioSession();
  redirect("/studio");
}

export async function logoutFromStudio() {
  await destroyStudioSession();
  redirect("/studio/login");
}

export async function savePost(
  _previousState: StudioActionState = emptyState,
  formData: FormData,
): Promise<StudioActionState> {
  void _previousState;
  await requireStudioSession();
  const parsed = parsePostForm(formData);

  if (!parsed.success) {
    return {
      message: "Review the highlighted editorial fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const input = parsed.data;
  const data = {
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    content: input.content,
    status: input.status,
    tags: normalizeTags(input.tags),
    focusKeyword: input.focusKeyword || null,
    seoTitle: input.seoTitle || null,
    seoDescription: input.seoDescription || null,
    canonicalUrl: input.canonicalUrl || null,
    socialImageUrl: input.socialImageUrl || null,
    socialImageAlt: input.socialImageAlt || null,
    noIndex: input.noIndex,
  };

  try {
    const prisma = getPrisma();
    const existing = input.id
      ? await prisma.post.findUnique({ where: { id: input.id }, select: { publishedAt: true } })
      : null;
    const publishedAt =
      input.status === PostStatus.PUBLISHED ? (existing?.publishedAt ?? new Date()) : null;
    const post = input.id
      ? await prisma.post.update({ where: { id: input.id }, data: { ...data, publishedAt } })
      : await prisma.post.create({ data: { ...data, publishedAt } });

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/sitemap.xml");
    revalidatePath("/rss.xml");
    redirect(`/studio/posts/${post.id}?saved=1`);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { message: "That slug is already assigned to another post." };
    }
    throw error;
  }
}

export async function deletePost(formData: FormData) {
  await requireStudioSession();
  if (formData.get("confirmDelete") !== "on") return;
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const deleted = await getPrisma().post.delete({ where: { id } });
  revalidatePath("/blog");
  revalidatePath(`/blog/${deleted.slug}`);
  revalidatePath("/sitemap.xml");
  revalidatePath("/rss.xml");
  redirect("/studio");
}
