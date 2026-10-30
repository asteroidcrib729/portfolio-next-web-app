import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignatureLogo } from "@/components/common/SignatureLogo";
import { StudioLoginForm } from "@/components/studio/StudioLoginForm";
import { hasStudioSession } from "@/lib/studioAuth";

export const metadata: Metadata = {
  title: "Editorial Studio Sign In",
  robots: { index: false, follow: false, noarchive: true },
};

export const dynamic = "force-dynamic";

export default async function StudioLoginPage() {
  if (await hasStudioSession()) redirect("/studio");

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="grid min-h-screen place-items-center px-5 py-16"
    >
      <section className="w-full max-w-md rounded-3xl border border-border bg-card p-7 surface-shadow sm:p-9">
        <Link href="/" aria-label="Return to portfolio" className="inline-flex text-foreground">
          <SignatureLogo className="h-14 w-20" />
        </Link>
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Private workspace
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Editorial Studio</h1>
        <p className="mt-4 leading-7 text-muted-foreground">
          Sign in to write, preview, optimize, and publish portfolio articles.
        </p>
        <StudioLoginForm />
      </section>
    </main>
  );
}
