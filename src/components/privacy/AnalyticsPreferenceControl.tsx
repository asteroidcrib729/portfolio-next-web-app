"use client";

import { BarChart3, ShieldCheck } from "lucide-react";
import {
  setAnalyticsPreference,
  useAnalyticsPreference,
} from "@/lib/analyticsPreference";
import { cn } from "@/lib/utils";

export function AnalyticsPreferenceControl() {
  const preference = useAnalyticsPreference();
  const enabled = preference === "granted";

  return (
    <section
      aria-labelledby="analytics-preference-title"
      className="rounded-2xl border border-border bg-card p-5 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-accent/10 p-2.5 text-accent">
          {enabled ? (
            <BarChart3 aria-hidden="true" className="h-5 w-5" />
          ) : (
            <ShieldCheck aria-hidden="true" className="h-5 w-5" />
          )}
        </div>
        <div>
          <h2 id="analytics-preference-title" className="text-lg font-semibold">
            Privacy-friendly analytics
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Analytics is off unless you choose to enable it. You can change this
            preference at any time; disabling it blocks future analytics events on
            this browser.
          </p>
        </div>
      </div>

      <div role="group" aria-label="Analytics preference" className="mt-5 flex flex-wrap gap-3">
        {[
          { value: "denied" as const, label: "Keep analytics off" },
          { value: "granted" as const, label: "Enable analytics" },
        ].map((option) => {
          const selected = option.value === (preference === "unset" ? "denied" : preference);

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => setAnalyticsPreference(option.value)}
              className={cn(
                "min-h-11 rounded-xl border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                selected
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-background text-foreground hover:border-accent"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <p role="status" aria-live="polite" className="mt-4 text-xs text-muted-foreground">
        Current setting: {enabled ? "analytics enabled" : "analytics disabled"}.
      </p>
    </section>
  );
}
