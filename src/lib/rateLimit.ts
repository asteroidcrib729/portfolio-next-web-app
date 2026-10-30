import { createHmac } from "node:crypto";
import { getPrisma, hasDatabaseConfiguration } from "@/lib/prisma";

const MAX_LOCAL_IDENTIFIERS = 1_000;
const localRequestLog = new Map<string, number[]>();
let lastDatabasePrune = 0;

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
  source: "database" | "local";
}

interface RateLimitOptions {
  identifier: string;
  maxRequests: number;
  scope: string;
  windowMs: number;
}

export function pseudonymizeIdentifier(identifier: string, salt: string) {
  return createHmac("sha256", salt).update(identifier).digest("hex");
}

function pruneLocalLog(now: number, windowMs: number) {
  for (const [key, timestamps] of localRequestLog) {
    const recent = timestamps.filter((timestamp) => now - timestamp < windowMs);
    if (recent.length === 0) localRequestLog.delete(key);
    else localRequestLog.set(key, recent);
  }

  while (localRequestLog.size > MAX_LOCAL_IDENTIFIERS) {
    const oldestKey = localRequestLog.keys().next().value;
    if (typeof oldestKey !== "string") break;
    localRequestLog.delete(oldestKey);
  }
}

function checkLocalRateLimit({
  identifier,
  maxRequests,
  scope,
  windowMs,
}: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  pruneLocalLog(now, windowMs);

  const key = `${scope}:${identifier}`;
  const recent = localRequestLog.get(key) ?? [];
  if (recent.length >= maxRequests) {
    const retryAfterMilliseconds = windowMs - (now - recent[0]);
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMilliseconds / 1_000)),
      source: "local",
    };
  }

  localRequestLog.delete(key);
  localRequestLog.set(key, [...recent, now]);
  return { allowed: true, retryAfterSeconds: 0, source: "local" };
}

async function checkDatabaseRateLimit({
  identifier,
  maxRequests,
  scope,
  windowMs,
}: RateLimitOptions): Promise<RateLimitResult> {
  const prisma = getPrisma();
  const now = new Date();
  const key = `${scope}:${identifier}`;

  if (Date.now() - lastDatabasePrune > 60 * 60 * 1_000) {
    lastDatabasePrune = Date.now();
    void prisma.rateLimitBucket.deleteMany({ where: { expiresAt: { lt: now } } }).catch(() => {});
  }

  // One parameterized upsert serializes competing requests at the row lock.
  // Count saturates one past the quota so the returned row identifies denials.
  const [bucket] = await prisma.$queryRaw<{ count: number; expiresAt: Date }[]>`
    INSERT INTO "RateLimitBucket" ("key", "count", "windowStartedAt", "expiresAt")
    VALUES (${key}, 1, CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP + (${windowMs}::double precision * INTERVAL '1 millisecond'))
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE WHEN "RateLimitBucket"."expiresAt" <= CURRENT_TIMESTAMP THEN 1
        ELSE LEAST("RateLimitBucket"."count" + 1, ${maxRequests + 1}) END,
      "windowStartedAt" = CASE WHEN "RateLimitBucket"."expiresAt" <= CURRENT_TIMESTAMP
        THEN CURRENT_TIMESTAMP ELSE "RateLimitBucket"."windowStartedAt" END,
      "expiresAt" = CASE WHEN "RateLimitBucket"."expiresAt" <= CURRENT_TIMESTAMP
        THEN CURRENT_TIMESTAMP + (${windowMs}::double precision * INTERVAL '1 millisecond')
        ELSE "RateLimitBucket"."expiresAt" END
    RETURNING "count", "expiresAt"
  `;
  const allowed = bucket.count <= maxRequests;
  return {
    allowed,
    retryAfterSeconds: allowed
      ? 0
      : Math.max(1, Math.ceil((bucket.expiresAt.getTime() - Date.now()) / 1_000)),
    source: "database",
  };
}

export async function checkRateLimit(options: RateLimitOptions) {
  if (hasDatabaseConfiguration()) return checkDatabaseRateLimit(options);
  if (process.env.NODE_ENV === "production") {
    throw new Error("Database-backed rate limiting is not configured.");
  }
  return checkLocalRateLimit(options);
}

export function resetRateLimitsForTests() {
  if (process.env.NODE_ENV === "test") localRequestLog.clear();
}
