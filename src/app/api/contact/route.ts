import { NextRequest, NextResponse } from "next/server";
import { checkContactRateLimit } from "@/lib/contactRateLimit";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_LENGTH = 10_000;

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown;
}

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character] ?? character
  );
}

function json(message: string, status = 200, headers?: HeadersInit) {
  return NextResponse.json(
    { message },
    {
      status,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        ...headers,
      },
    }
  );
}

function getRequestIdentifier(request: NextRequest) {
  return (
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "local"
  );
}

export async function POST(request: NextRequest) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json("The contact endpoint accepts JSON requests only.", 415);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_LENGTH) return json("The request body is too large.", 413);

  let payload: ContactPayload;
  try {
    const rawBody = await request.text();
    if (rawBody.length > MAX_BODY_LENGTH) return json("The request body is too large.", 413);
    payload = JSON.parse(rawBody) as ContactPayload;
  } catch {
    return json("Invalid request body.", 400);
  }

  const website = clean(payload.website, 200);
  if (website) return json("Message accepted.");

  const name = clean(payload.name, 80);
  const email = clean(payload.email, 160);
  const subject = clean(payload.subject, 120);
  const message = clean(payload.message, 3000);

  if (
    name.length < 2 ||
    !EMAIL_PATTERN.test(email) ||
    subject.length < 3 ||
    message.length < 20
  ) {
    return json("Please complete every field with valid contact details.", 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return json("Direct delivery is not configured on this deployment.", 503);
  }

  let rateLimit;
  try {
    rateLimit = await checkContactRateLimit(getRequestIdentifier(request));
  } catch {
    return json("Direct delivery is temporarily unavailable. Please use email instead.", 503);
  }

  if (!rateLimit.allowed) {
    return json("Too many messages were sent. Please try again in a few minutes.", 429, {
      "Retry-After": String(rateLimit.retryAfterSeconds),
    });
  }

  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio enquiry: ${subject}`,
        text: `${message}\n\nFrom: ${name} <${email}>`,
        html: `<p>${escapeHtml(message).replace(/\n/g, "<br />")}</p><hr /><p>From: ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>`,
      }),
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    return json("Delivery failed. Please use the direct email link instead.", 502);
  }

  if (!response.ok) {
    return json("Delivery failed. Please use the direct email link instead.", 502);
  }

  return json("Message sent.");
}
