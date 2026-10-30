import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut, Plus } from "lucide-react";
import { logoutFromStudio } from "@/app/studio/actions";
import { Container } from "@/components/common/Container";
import { SignatureLogo } from "@/components/common/SignatureLogo";
import { hasStudioSession } from "@/lib/studioAuth";

export const metadata: Metadata = {
  title: { default: "Editorial Studio", template: "%s — Editorial Studio" },
  robots: { index: false, follow: false, noarchive: true },
};

export const dynamic = "force-dynamic";

export default async function ProtectedStudioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!(await hasStudioSession())) redirect("/studio/login");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <Container className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-2">
          <Link href="/studio" className="flex items-center gap-3 font-semibold">
            <SignatureLogo className="h-11 w-14" />
            <span>Editorial Studio</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/studio/posts/new"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold"
            >
              <Plus aria-hidden="true" className="h-4 w-4" /> New post
            </Link>
            <form action={logoutFromStudio}>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-muted-foreground hover:text-foreground"
              >
                <LogOut aria-hidden="true" className="h-4 w-4" /> Sign out
              </button>
            </form>
          </div>
        </Container>
      </header>
      {children}
    </div>
  );
}
