"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { usePathname } from "next/navigation";
import { getAnalyticsPreference, useAnalyticsPreference } from "@/lib/analyticsPreference";

function isPrivatePath(path: string) {
  return /^\/(studio|api)(\/|$)/.test(path);
}

export function filterAnalyticsEvent(event: BeforeSendEvent) {
  if (getAnalyticsPreference() !== "granted" || isPrivatePath(window.location.pathname))
    return null;
  try {
    const url = new URL(event.url);
    if (isPrivatePath(url.pathname)) return null;
    url.search = "";
    url.hash = "";
    return { ...event, url: url.toString() };
  } catch {
    return null;
  }
}

export function PrivacyAwareAnalytics() {
  const preference = useAnalyticsPreference();
  const pathname = usePathname();

  return preference === "granted" && !isPrivatePath(pathname) ? (
    <Analytics beforeSend={filterAnalyticsEvent} />
  ) : null;
}
