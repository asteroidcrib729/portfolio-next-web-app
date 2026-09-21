"use client";

import * as React from "react";

export const ANALYTICS_PREFERENCE_KEY = "portfolio-analytics-preference";
export const ANALYTICS_PREFERENCE_EVENT = "portfolio-analytics-preference-change";

export type AnalyticsPreference = "granted" | "denied" | "unset";

function getPreferenceSnapshot(): AnalyticsPreference {
  const value = window.localStorage.getItem(ANALYTICS_PREFERENCE_KEY);
  return value === "granted" || value === "denied" ? value : "unset";
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
  return React.useSyncExternalStore(subscribe, getPreferenceSnapshot, getServerSnapshot);
}

export function setAnalyticsPreference(preference: Exclude<AnalyticsPreference, "unset">) {
  window.localStorage.setItem(ANALYTICS_PREFERENCE_KEY, preference);
  window.dispatchEvent(new Event(ANALYTICS_PREFERENCE_EVENT));
}
