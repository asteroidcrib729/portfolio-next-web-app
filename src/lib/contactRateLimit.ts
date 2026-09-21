import { createHmac } from "node:crypto";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const MAX_LOCAL_IDENTIFIERS = 1_000;
const localRequestLog = new Map<string, number[]>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
  source: "distributed" | "local";
}

function pseudonymizeIdentifier(identifier: string, salt: string) {
  return createHmac("sha256", salt).update(identifier).digest("hex");
}

function pruneLocalLog(now: number) {
  for (const [key, timestamps] of localRequestLog) {
    const recent = timestamps.filter((timestamp) => now - timestamp < WINDOW_MS);
    if (recent.length === 0) localRequestLog.delete(key);
    else localRequestLog.set(key, recent);
  }

  while (localRequestLog.size > MAX_LOCAL_IDENTIFIERS) {
    const oldestKey = localRequestLog.keys().next().value;
    if (typeof oldestKey !== "string") break;
    localRequestLog.delete(oldestKey);
  }
}

function checkLocalRateLimit(identifier: string): RateLimitResult {
  const now = Date.now();
  pruneLocalLog(now);

  const recent = localRequestLog.get(identifier) ?? [];
  if (recent.length >= MAX_REQUESTS) {
    const retryAfterMilliseconds = WINDOW_MS - (now - recent[0]);
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMilliseconds / 1_000)),
      source: "local",
    };
  }

  localRequestLog.delete(identifier);
  localRequestLog.set(identifier, [...recent, now]);
  return { allowed: true, retryAfterSeconds: 0, source: "local" };
}

async function checkDistributedRateLimit(
  identifier: string,
  url: string,
  token: string
): Promise<RateLimitResult> {
  const script = [
    "local current = redis.call('INCR', KEYS[1])",
    "if current == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end",
    "return {current, redis.call('PTTL', KEYS[1])}",
  ].join("; ");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      "EVAL",
      script,
      "1",
      `portfolio:contact:${identifier}`,
      String(WINDOW_MS),
    ]),
    cache: "no-store",
    signal: AbortSignal.timeout(2_500),
  });

  if (!response.ok) throw new Error("The distributed rate-limit service was unavailable.");

  const payload = (await response.json()) as { result?: [number, number] };
  const count = payload.result?.[0];
  const remainingMilliseconds = payload.result?.[1];
  if (typeof count !== "number" || typeof remainingMilliseconds !== "number") {
    throw new Error("The distributed rate-limit service returned an invalid response.");
  }

  return {
    allowed: count <= MAX_REQUESTS,
    retryAfterSeconds: count <= MAX_REQUESTS ? 0 : Math.max(1, Math.ceil(remainingMilliseconds / 1_000)),
    source: "distributed",
  };
}

export async function checkContactRateLimit(identifier: string) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const salt = process.env.CONTACT_RATE_LIMIT_SALT;

  if (url && token && salt) {
    return checkDistributedRateLimit(pseudonymizeIdentifier(identifier, salt), url, token);
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Distributed contact rate limiting is not configured.");
  }

  return checkLocalRateLimit(pseudonymizeIdentifier(identifier, salt ?? "local-development"));
}

export function resetContactRateLimitForTests() {
  if (process.env.NODE_ENV === "test") localRequestLog.clear();
}
