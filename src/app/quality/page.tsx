import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, CircleDotDashed } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Quality Evidence",
  description: "Dated engineering evidence, release gates, and honest limitations for this portfolio.",
  alternates: { canonical: "/quality" },
};

const verifiedChecks = [
  "ESLint and strict TypeScript compilation",
  "Vitest component, route, privacy-control, contrast, and accessibility checks",
  "Next.js production compilation and static route generation",
  "Keyboard focus, named controls, reduced motion, and 390-pixel reflow inspection",
  "npm advisory scan and high-confidence secret-pattern scan",
  "Enforced security headers and privacy-preserving contact validation",
];

const limitations = [
  "Automated checks support accessibility work but do not certify WCAG conformance.",
  "Performance claims require measurements from the final public production URL.",
  "Live email delivery, provider retention, and public Vercel access require deployed account configuration.",
  "Legal applicability depends on the owner, audience, activity, and jurisdiction.",
];

export default function QualityPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 py-20 outline-none sm:py-28">
        <Container className="max-w-4xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Evidence over assumption
          </p>
          <h1 className="text-balance mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">
            Quality claims with visible boundaries.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            This page records what the project verifies, what it targets, and what
            still depends on production evidence. Last reviewed 21 September 2026.
          </p>

          <section aria-labelledby="verified-title" className="mt-12 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 id="verified-title" className="text-2xl font-semibold">Automated and inspected</h2>
            <ul className="mt-6 space-y-4">
              {verifiedChecks.map((check) => (
                <li key={check} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  {check}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="limits-title" className="mt-6 rounded-2xl border border-border bg-background p-6 sm:p-8">
            <h2 id="limits-title" className="text-2xl font-semibold">Explicit limitations</h2>
            <ul className="mt-6 space-y-4">
              {limitations.map((limitation) => (
                <li key={limitation} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                  <CircleDotDashed aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  {limitation}
                </li>
              ))}
            </ul>
          </section>

          <p className="mt-10 text-sm leading-6 text-muted-foreground">
            For the implementation details, inspect the project source and quality
            workflow. To report a problem, use the{" "}
            <Link className="font-medium text-accent underline underline-offset-4" href="/#contact">
              contact section
            </Link>
            .
          </p>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
