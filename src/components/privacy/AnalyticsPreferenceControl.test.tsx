import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AnalyticsPreferenceControl } from "@/components/privacy/AnalyticsPreferenceControl";
import { filterAnalyticsEvent } from "@/components/privacy/PrivacyAwareAnalytics";
import { ANALYTICS_PREFERENCE_KEY } from "@/lib/analyticsPreference";

describe("AnalyticsPreferenceControl", () => {
  afterEach(() => vi.restoreAllMocks());

  it("defaults analytics on and persists an explicit reversible opt-out", () => {
    render(<AnalyticsPreferenceControl />);

    const disabled = screen.getByRole("button", { name: "Disable analytics" });
    const enabled = screen.getByRole("button", { name: "Enable analytics" });
    expect(enabled).toHaveAttribute("aria-pressed", "true");
    expect(window.localStorage.getItem(ANALYTICS_PREFERENCE_KEY)).toBeNull();

    fireEvent.click(disabled);
    expect(window.localStorage.getItem(ANALYTICS_PREFERENCE_KEY)).toBe("denied");
    expect(disabled).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(enabled);
    expect(window.localStorage.getItem(ANALYTICS_PREFERENCE_KEY)).toBe("granted");
    expect(enabled).toHaveAttribute("aria-pressed", "true");
  });

  it("blocks events immediately after opting out and respects saved opt-outs", () => {
    const event = { type: "pageview" as const, url: "https://portfolio.example/" };
    expect(filterAnalyticsEvent(event)).toEqual(event);

    window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, "granted");
    expect(filterAnalyticsEvent(event)).toEqual(event);

    window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, "denied");
    expect(filterAnalyticsEvent(event)).toBeNull();
    render(<AnalyticsPreferenceControl />);
    expect(screen.getByRole("button", { name: "Disable analytics" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("drops private routes, invalid URLs, and query strings and fragments", () => {
    const event = {
      type: "pageview" as const,
      url: "https://portfolio.example/blog?email=private#token",
    };
    expect(filterAnalyticsEvent(event)?.url).toBe("https://portfolio.example/blog");
    for (const url of [
      "https://portfolio.example/studio",
      "https://portfolio.example/studio/preview/1",
      "https://portfolio.example/api/contact",
      "invalid",
    ]) {
      expect(filterAnalyticsEvent({ ...event, url })).toBeNull();
    }
  });

  it("fails closed when storage is unavailable", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Blocked");
    });
    render(<AnalyticsPreferenceControl />);
    fireEvent.click(screen.getByRole("button", { name: "Enable analytics" }));
    expect(screen.getByRole("status")).toHaveTextContent("analytics disabled");
    expect(
      filterAnalyticsEvent({ type: "pageview", url: "https://portfolio.example/" }),
    ).toBeNull();
  });

  it.each(["globalPrivacyControl", "doNotTrack"])("honors %s over a stored opt-in", (signal) => {
    Object.defineProperty(navigator, signal, { configurable: true, get: () => undefined });
    vi.spyOn(navigator, signal as "doNotTrack", "get").mockReturnValue(
      signal === "doNotTrack" ? "1" : (true as unknown as string),
    );
    window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, "granted");
    expect(
      filterAnalyticsEvent({ type: "pageview", url: "https://portfolio.example/" }),
    ).toBeNull();
  });
});
