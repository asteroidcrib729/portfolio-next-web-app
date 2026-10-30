import { checkRateLimit, pseudonymizeIdentifier, resetRateLimitsForTests } from "@/lib/rateLimit";

const WINDOW_MS = 10 * 60 * 1_000;
const MAX_REQUESTS = 5;

export async function checkContactRateLimit(identifier: string) {
  const salt = process.env.RATE_LIMIT_SALT;

  if (!salt && process.env.NODE_ENV === "production") {
    throw new Error("RATE_LIMIT_SALT is not configured.");
  }

  return checkRateLimit({
    identifier: pseudonymizeIdentifier(identifier, salt ?? "local-development"),
    maxRequests: MAX_REQUESTS,
    scope: "contact",
    windowMs: WINDOW_MS,
  });
}

export function resetContactRateLimitForTests() {
  resetRateLimitsForTests();
}
