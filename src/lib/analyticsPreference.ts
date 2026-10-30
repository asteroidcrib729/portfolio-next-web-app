"use client";

import * as React from "react";

export const ANALYTICS_PREFERENCE_KEY = "portfolio-analytics-preference";
export const ANALYTICS_PREFERENCE_EVENT = "portfolio-analytics-preference-change";

export type AnalyticsPreference = "granted" | "denied" | "unset";

export function getAnalyticsPreference(): Exclude<AnalyticsPreference, "unset"> {
  // Privacy signals override even a previously stored opt-in.
  const browser = window.navigator as Navigator & { globalPrivacyControl?: boolean };
  if (browser.globalPrivacyControl || browser.doNotTrack === "1") return "denied";

  try {
    const value = window.localStorage.getItem(ANALYTICS_PREFERENCE_KEY);
    return value === "denied" ? "denied" : "granted";
  } catch {
    // Do not collect if the browser cannot reliably retain an opt-out.
    return "denied";
  }
}

function getServerSnapshot(): AnalyticsPreference {
  return "unset";
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(ANALYTICS_PREFERENCE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(ANALYTICS_PREFERENCE_EVENT, onStoreChange);
  };
}

export function useAnalyticsPreference() {
  return React.useSyncExternalStore(subscribe, getAnalyticsPreference, getServerSnapshot);
}

export function setAnalyticsPreference(preference: Exclude<AnalyticsPreference, "unset">) {
  try {
    window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, preference);
  } catch {
    // Reads fail closed as well; the control remains disabled instead of crashing.
  }
  window.dispatchEvent(new Event(ANALYTICS_PREFERENCE_EVENT));
}
