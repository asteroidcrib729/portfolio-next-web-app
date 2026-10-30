import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "portfolio_editorial_session";
const SESSION_DURATION_SECONDS = 8 * 60 * 60;

export async function requireStudioSession() {
  if (!(await hasStudioSession())) redirect("/studio/login");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function getSessionSecret() {
  const secret = process.env.EDITORIAL_STUDIO_SESSION_SECRET?.trim();
  if (!secret || secret.length < 32) {
    throw new Error("EDITORIAL_STUDIO_SESSION_SECRET must contain at least 32 characters.");
  }
  return secret;
}

function sign(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

export function verifyStudioPassword(candidate: string) {
  const configuredPassword = process.env.EDITORIAL_STUDIO_PASSWORD?.trim();
  if (!configuredPassword || configuredPassword.length < 16) return false;
  return safeEqual(candidate, configuredPassword);
}

export async function createStudioSession() {
  const expiresAt = Math.floor(Date.now() / 1_000) + SESSION_DURATION_SECONDS;
  const payload = Buffer.from(JSON.stringify({ expiresAt, version: 1 })).toString("base64url");
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    maxAge: SESSION_DURATION_SECONDS,
    path: "/studio",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function destroyStudioSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/studio",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function hasStudioSession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;

  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra !== undefined) return false;

  try {
    if (!safeEqual(signature, sign(payload))) return false;
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      expiresAt?: unknown;
      version?: unknown;
    };
    return (
      session.version === 1 &&
      typeof session.expiresAt === "number" &&
      session.expiresAt > Math.floor(Date.now() / 1_000)
    );
  } catch {
    return false;
  }
}
