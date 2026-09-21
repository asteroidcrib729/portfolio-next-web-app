// @vitest-environment node

import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/contact/route";
import { resetContactRateLimitForTests } from "@/lib/contactRateLimit";

const validPayload = {
  name: "Project Lead",
  email: "lead@example.test",
  subject: "Software collaboration",
  message: "I would like to discuss a product engineering engagement.",
  website: "",
};

function createRequest(
  body: object | string,
  ip = "203.0.113.10",
  contentType = "application/json"
) {
  return new NextRequest("http://localhost/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": contentType,
      "x-forwarded-for": ip,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("contact route", () => {
  beforeEach(() => {
    resetContactRateLimitForTests();
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("CONTACT_TO_EMAIL", "owner@example.test");
    vi.stubEnv("CONTACT_FROM_EMAIL", "Portfolio <portfolio@example.test>");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("rejects unsupported, malformed, oversized, and incomplete submissions", async () => {
    expect((await POST(createRequest(validPayload, undefined, "text/plain"))).status).toBe(415);
    expect((await POST(createRequest("{"))).status).toBe(400);
    expect((await POST(createRequest({ message: "x".repeat(10_001) }))).status).toBe(413);
    expect((await POST(createRequest({ name: "A", email: "invalid" }))).status).toBe(400);
  });

  it("accepts honeypot traffic without charging the delivery quota", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("{}", { status: 200 }));
    const ip = "203.0.113.20";

    for (let index = 0; index < 8; index += 1) {
      const response = await POST(createRequest({ ...validPayload, website: "bot.example" }, ip));
      expect(response.status).toBe(200);
    }

    expect((await POST(createRequest(validPayload, ip))).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("requests the documented fallback when delivery is unconfigured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const response = await POST(createRequest(validPayload));

    expect(response.status).toBe(503);
    expect(response.headers.get("cache-control")).toContain("no-store");
  });

  it("escapes HTML and sends valid messages through Resend", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("{}", { status: 200 }));
    const response = await POST(
      createRequest({
        ...validPayload,
        name: "<Faraz & team>",
        message: "This message contains <script>alert('x')</script> safely.",
      })
    );

    expect(response.status).toBe(200);
    const request = fetchMock.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(String(request.body)) as { html: string; text: string };
    expect(body.html).toContain("&lt;script&gt;");
    expect(body.html).not.toContain("<script>");
    expect(body.text).toContain("<script>");
  });

  it("returns a safe failure when Resend rejects delivery", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { status: 500 }));
    expect((await POST(createRequest(validPayload))).status).toBe(502);
  });

  it("enforces the local test limiter and publishes retry timing", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { status: 200 }));
    const ip = "203.0.113.99";

    for (let index = 0; index < 5; index += 1) {
      expect((await POST(createRequest(validPayload, ip))).status).toBe(200);
    }

    const blocked = await POST(createRequest(validPayload, ip));
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers.get("retry-after"))).toBeGreaterThan(0);
  });
});
