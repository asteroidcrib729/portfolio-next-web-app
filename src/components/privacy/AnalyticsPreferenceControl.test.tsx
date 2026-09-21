import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnalyticsPreferenceControl } from "@/components/privacy/AnalyticsPreferenceControl";
import { filterAnalyticsEvent } from "@/components/privacy/PrivacyAwareAnalytics";
import { ANALYTICS_PREFERENCE_KEY } from "@/lib/analyticsPreference";

describe("AnalyticsPreferenceControl", () => {
  it("defaults analytics off and persists an explicit reversible choice", () => {
    render(<AnalyticsPreferenceControl />);

    const disabled = screen.getByRole("button", { name: "Keep analytics off" });
    const enabled = screen.getByRole("button", { name: "Enable analytics" });
    expect(disabled).toHaveAttribute("aria-pressed", "true");
    expect(window.localStorage.getItem(ANALYTICS_PREFERENCE_KEY)).toBeNull();

    fireEvent.click(enabled);
    expect(window.localStorage.getItem(ANALYTICS_PREFERENCE_KEY)).toBe("granted");
    expect(enabled).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(disabled);
    expect(window.localStorage.getItem(ANALYTICS_PREFERENCE_KEY)).toBe("denied");
    expect(disabled).toHaveAttribute("aria-pressed", "true");
  });

  it("blocks events before consent and immediately after withdrawal", () => {
    const event = { type: "pageview" as const, url: "https://portfolio.example/" };
    expect(filterAnalyticsEvent(event)).toBeNull();

    window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, "granted");
    expect(filterAnalyticsEvent(event)).toBe(event);

    window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, "denied");
    expect(filterAnalyticsEvent(event)).toBeNull();
  });
});
