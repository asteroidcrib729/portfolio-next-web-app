"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { loginToStudio, type StudioActionState } from "@/app/studio/actions";

const initialState: StudioActionState = {};

export function StudioLoginForm() {
  const [state, action, pending] = useActionState(loginToStudio, initialState);

  return (
    <form action={action} className="mt-8 space-y-5">
      <div>
        <label htmlFor="password" className="text-sm font-semibold text-foreground">
          Editorial password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={16}
          aria-invalid={Boolean(state.message) || undefined}
          aria-describedby={state.message ? "studio-login-error" : undefined}
          className="mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-4 text-foreground shadow-sm"
        />
      </div>
      {state.message ? (
        <p
          id="studio-login-error"
          role="alert"
          className="rounded-xl border border-border bg-muted px-4 py-3 text-sm"
        >
          {state.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-foreground px-5 font-semibold text-background transition-opacity disabled:opacity-60"
      >
        <LogIn aria-hidden="true" className="h-4 w-4" />
        {pending ? "Signing in..." : "Enter the studio"}
      </button>
    </form>
  );
}
