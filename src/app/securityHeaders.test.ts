import nextConfig, { securityHeaders } from "../../next.config";
import { describe, expect, it } from "vitest";

describe("security headers", () => {
  it("enforces the browser defense-in-depth policy", async () => {
    const headers = Object.fromEntries(securityHeaders.map(({ key, value }) => [key, value]));
    const configured = await nextConfig.headers?.();

    expect(nextConfig.poweredByHeader).toBe(false);
    expect(configured?.[0]?.source).toBe("/(.*)");
    expect(headers["Content-Security-Policy"]).toContain("frame-ancestors 'none'");
    expect(headers["Content-Security-Policy"]).toContain("object-src 'none'");
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["Permissions-Policy"]).toContain("camera=()");
  });
});
