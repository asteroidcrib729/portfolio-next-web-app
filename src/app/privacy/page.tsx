import type { Metadata } from "next";
import Link from "next/link";
import { AnalyticsPreferenceControl } from "@/components/privacy/AnalyticsPreferenceControl";
import { Container } from "@/components/common/Container";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { siteConfig } from "@/data/siteConfig";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${siteConfig.name}'s portfolio handles contact details, analytics, and browser preferences.`,
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    title: "Information this site handles",
    paragraphs: [
      "If you use the contact form, the site handles your name, email address, subject, message, and limited request metadata needed to prevent abuse. Please do not include sensitive information that is not necessary for the enquiry.",
      "If you explicitly enable analytics below, Vercel Web Analytics receives limited usage and device metadata for aggregate traffic measurement. The site does not use advertising pixels, session replay, or cross-site behavioral profiles.",
    ],
  },
  {
    title: "Why it is handled",
    paragraphs: [
      "Contact details are used to deliver and respond to your enquiry, protect the form from misuse, and maintain the security of the service. Depending on applicable law, this processing is based on taking steps at your request and/or the legitimate interest in communicating securely about professional work.",
      "Optional analytics is processed only after you enable it on this browser. You may withdraw that choice at any time with the control on this page. If the analytics script was already loaded in the current page, a withdrawal blocks subsequent events even though the downloaded script may remain until the page closes.",
    ],
  },
  {
    title: "Providers and transfers",
    paragraphs: [
      "Vercel hosts the site and supplies optional Web Analytics. Resend delivers contact messages to the configured mailbox. A production deployment may use Upstash Redis to retain a pseudonymous rate-limit counter for ten minutes. The mailbox provider necessarily receives delivered email.",
      "These providers may process information in countries other than your own under their published terms and data-processing arrangements. The site does not sell personal information or share it for targeted advertising.",
    ],
  },
  {
    title: "Retention and deletion",
    paragraphs: [
      "Routine contact enquiries are retained for no longer than 12 months after the last substantive exchange, unless a shorter period is sufficient or a longer period is reasonably required for an active engagement, security investigation, legal obligation, or dispute. Rate-limit identifiers are HMAC-pseudonymized and expire after ten minutes.",
      "Vercel documents that its Web Analytics visitor hash is discarded after 24 hours. Aggregate analytics retention is governed by the active Vercel account settings. Browser preferences remain on your device until you change them or clear site storage.",
    ],
  },
  {
    title: "Your choices and requests",
    paragraphs: [
      `You may ask to access, correct, or delete an identifiable contact message by emailing ${siteConfig.email} with the subject “Privacy request.” Identity may need to be confirmed before acting on a request. Applicable rights vary by jurisdiction.`,
      "You can keep analytics disabled using the control below. Theme and analytics choices can also be removed by clearing this site's browser storage.",
    ],
  },
  {
    title: "Children and policy changes",
    paragraphs: [
      "This professional portfolio is not directed to children, and it does not knowingly request children's personal information. If you believe a child supplied information, use the privacy contact so it can be removed.",
      "Material changes to this notice will be reflected here with a revised effective date. This notice describes the portfolio as deployed; third-party services maintain their own notices and terms.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 py-20 outline-none sm:py-28">
        <Container className="max-w-4xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Privacy and choices
          </p>
          <h1 className="text-balance mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">
            Clear information, minimal collection, real control.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            This notice explains the limited personal information handled by this
            portfolio and the choices available to you. Effective 21 September 2026.
          </p>

          <div className="mt-12">
            <AnalyticsPreferenceControl />
          </div>

          <div className="mt-12 space-y-10">
            {sections.map((section) => (
              <section key={section.title} aria-labelledby={section.title.toLowerCase().replaceAll(" ", "-")}>
                <h2
                  id={section.title.toLowerCase().replaceAll(" ", "-")}
                  className="text-2xl font-semibold tracking-tight"
                >
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4 text-base leading-7 text-muted-foreground">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="mt-12 rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Contact about privacy</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Email{" "}
              <a className="font-medium text-accent underline underline-offset-4" href={`mailto:${siteConfig.email}?subject=Privacy%20request`}>
                {siteConfig.email}
              </a>{" "}
              or return to the{" "}
              <Link className="font-medium text-accent underline underline-offset-4" href="/#contact">
                contact section
              </Link>
              .
            </p>
          </aside>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
