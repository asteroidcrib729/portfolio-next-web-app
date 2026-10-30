import nextConfig, { resumePdfHeaders, securityHeaders } from "../../next.config";
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

  it("allows the public resume to render only inside the same origin", async () => {
    const headers = Object.fromEntries(resumePdfHeaders.map(({ key, value }) => [key, value]));
    const configured = await nextConfig.headers?.();

    expect(configured?.[1]?.source).toBe("/resume/faraz-hussain-resume.pdf");
    expect(headers["Content-Security-Policy"]).toContain("frame-ancestors 'self'");
    expect(headers["X-Frame-Options"]).toBe("SAMEORIGIN");
    expect(headers["Content-Disposition"]).toContain("inline");
  });
});
