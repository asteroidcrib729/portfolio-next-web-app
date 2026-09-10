import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const requestLog = new Map<string, number[]>();

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

function isRateLimited(identifier: string) {
  const now = Date.now();
  const recentRequests = (requestLog.get(identifier) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW_MS
  );

  if (recentRequests.length >= MAX_REQUESTS) return true;

  requestLog.set(identifier, [...recentRequests, now]);
  return false;
}

export async function POST(request: NextRequest) {
  const identifier = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";

  if (isRateLimited(identifier)) {
    return NextResponse.json(
      { message: "Too many messages were sent. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const website = clean(payload.website, 200);
  if (website) {
    return NextResponse.json({ message: "Message accepted." });
  }

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
    return NextResponse.json(
      { message: "Please complete every field with valid contact details." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return NextResponse.json(
      { message: "Direct delivery is not configured on this deployment." },
      { status: 503 }
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
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
  });

  if (!response.ok) {
    return NextResponse.json(
      { message: "Delivery failed. Please use the direct email link instead." },
      { status: 502 }
    );
  }

  return NextResponse.json({ message: "Message sent." });
}
