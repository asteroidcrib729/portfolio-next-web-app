"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import {
  ANALYTICS_PREFERENCE_KEY,
  useAnalyticsPreference,
} from "@/lib/analyticsPreference";

export function filterAnalyticsEvent(event: BeforeSendEvent) {
  return window.localStorage.getItem(ANALYTICS_PREFERENCE_KEY) === "granted"
    ? event
    : null;
}

export function PrivacyAwareAnalytics() {
  const preference = useAnalyticsPreference();

  return preference === "granted" ? <Analytics beforeSend={filterAnalyticsEvent} /> : null;
}
