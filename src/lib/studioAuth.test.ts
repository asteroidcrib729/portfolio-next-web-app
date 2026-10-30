import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import {
  createStudioSession,
  destroyStudioSession,
  hasStudioSession,
  verifyStudioPassword,
} from "@/lib/studioAuth";

const cookieJar = vi.hoisted(() => ({ get: vi.fn(), set: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: async () => cookieJar }));

describe("editorial session security", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.stubEnv(
      "EDITORIAL_STUDIO_SESSION_SECRET",
      "a-test-session-secret-with-at-least-32-characters",
    );
    vi.stubEnv("EDITORIAL_STUDIO_PASSWORD", "a-long-editorial-test-password");
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  it("accepts the configured password and refuses missing or incorrect passwords", () => {
    expect(verifyStudioPassword("a-long-editorial-test-password")).toBe(true);
    expect(verifyStudioPassword("wrong-password")).toBe(false);
    vi.stubEnv("EDITORIAL_STUDIO_PASSWORD", "");
    expect(verifyStudioPassword("")).toBe(false);
  });

  it("verifies signed sessions and rejects tampering, extra segments, and expiry", async () => {
    await createStudioSession();
    const token = cookieJar.set.mock.calls[0][1] as string;
    cookieJar.get.mockReturnValue({ value: token });
    expect(await hasStudioSession()).toBe(true);
    cookieJar.get.mockReturnValue({ value: `${token}.extra` });
    expect(await hasStudioSession()).toBe(false);
    cookieJar.get.mockReturnValue({ value: `tampered.${token.split(".")[1]}` });
    expect(await hasStudioSession()).toBe(false);
    cookieJar.get.mockReturnValue({ value: token });
    vi.advanceTimersByTime(8 * 60 * 60 * 1_000);
    expect(await hasStudioSession()).toBe(false);
  });

  it("expires the same scoped cookie on logout", async () => {
    await destroyStudioSession();
    expect(cookieJar.set).toHaveBeenCalledWith(
      "portfolio_editorial_session",
      "",
      expect.objectContaining({
        path: "/studio",
        maxAge: 0,
        httpOnly: true,
        sameSite: "strict",
      }),
    );
  });
});
