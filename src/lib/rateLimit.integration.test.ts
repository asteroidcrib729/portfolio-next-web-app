// @vitest-environment node
import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { getPrisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";

describe.skipIf(process.env.RUN_DATABASE_TESTS !== "1")("PostgreSQL rate limiting", () => {
  const keys: string[] = [];
  function options(maxRequests: number) {
    const identifier = randomUUID();
    keys.push(`db-test:${identifier}`);
    return { identifier, scope: "db-test", maxRequests, windowMs: 60_000 };
  }

  afterAll(async () => {
    await getPrisma().rateLimitBucket.deleteMany({ where: { key: { in: keys } } });
    await getPrisma().$disconnect();
  });

  it("enforces the quota across concurrent first requests", async () => {
    const input = options(3);
    const results = await Promise.all(Array.from({ length: 12 }, () => checkRateLimit(input)));
    expect(results.filter((result) => result.allowed)).toHaveLength(3);
    expect(results.every((result) => result.source === "database")).toBe(true);
    expect(
      results.filter((result) => !result.allowed).every((result) => result.retryAfterSeconds > 0),
    ).toBe(true);
  });

  it("starts a new quota window after expiry", async () => {
    const input = options(1);
    expect((await checkRateLimit(input)).allowed).toBe(true);
    expect((await checkRateLimit(input)).allowed).toBe(false);
    await getPrisma().rateLimitBucket.update({
      where: { key: keys.at(-1)! },
      data: { expiresAt: new Date(0) },
    });
    expect((await checkRateLimit(input)).allowed).toBe(true);
  });
});
