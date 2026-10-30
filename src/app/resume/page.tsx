import type { Metadata } from "next";
import Link from "next/link";
import { Download, ExternalLink } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

const resumePath = "/resume/faraz-hussain-resume.pdf";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "View or download Faraz Hussain's software engineering resume, including full-stack skills, technologies, and professional background.",
  alternates: { canonical: "/resume" },
  openGraph: {
    type: "profile",
    url: "/resume",
    title: "Faraz Hussain — Software Engineering Resume",
    description:
      "Full-stack engineering experience, technical capabilities, and professional background.",
  },
};

export default function ResumePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 py-12 outline-none sm:py-16">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                Professional profile
              </p>
              <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
                My software engineering resume
              </h1>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                Review my full-stack experience, technical toolkit, and professional background
                directly in the browser or keep a PDF copy.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={resumePath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-border bg-card px-5 font-semibold"
              >
                Open PDF <ExternalLink aria-hidden="true" className="h-4 w-4" />
                <span className="sr-only"> (opens in a new tab)</span>
              </Link>
              <a
                href={resumePath}
                download="Faraz-Hussain-Resume.pdf"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-foreground px-5 font-semibold text-background"
              >
                Download PDF <Download aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </div>

          <section
            aria-label="Resume PDF preview"
            className="mt-10 overflow-hidden rounded-3xl border border-border bg-card surface-shadow"
          >
            <iframe
              src={`${resumePath}#view=FitH&toolbar=1`}
              title="Faraz Hussain software engineering resume"
              className="h-[75vh] min-h-[42rem] w-full bg-white"
            />
            <p className="border-t border-border p-5 text-sm leading-6 text-muted-foreground">
              Inline PDF viewing depends on your browser. If the preview is unavailable,{" "}
              <a
                className="font-semibold text-accent underline underline-offset-4"
                href={resumePath}
              >
                open the resume PDF directly
              </a>{" "}
              or use the download button above.
            </p>
          </section>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
