import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Braces, Check, Sparkles } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Reveal } from "@/components/common/Reveal";
import { SocialAnchor } from "@/components/common/SocialAnchor";
import { siteConfig, socialLinks } from "@/data/siteConfig";

const systemSignals = [
  "Server-first composition",
  "Keyboard-safe interaction",
  "Motion-aware experience",
];

export function Hero() {
  const emailLink = socialLinks.find((link) => link.icon === "mail");

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden border-b border-border/70 py-20 sm:py-28 lg:min-h-[calc(100svh-4rem)] lg:py-24"
    >
      <div aria-hidden="true" className="grid-fade absolute inset-0 -z-20" />
      <div
        aria-hidden="true"
        className="absolute -right-32 top-12 -z-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl sm:h-[30rem] sm:w-[30rem]"
      />

      <Container className="grid items-center gap-16 lg:grid-cols-[1.12fr_0.88fr] lg:gap-12">
        <div>
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/8 px-3.5 py-2 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              </span>
              {siteConfig.status}
            </div>
          </Reveal>

          <Reveal delay={0.07}>
            <p className="mt-7 font-mono text-sm font-medium text-muted-foreground">
              Hi, I&apos;m <span className="text-foreground">{siteConfig.name}</span>.
            </p>
            <h1
              id="hero-title"
              className="text-balance mt-4 max-w-4xl text-5xl font-semibold leading-[0.96] tracking-[-0.065em] text-foreground sm:text-6xl lg:text-7xl xl:text-[5.25rem]"
            >
              Systems that feel as good as they perform
            </h1>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              {siteConfig.tagline}
            </p>
          </Reveal>

          <Reveal
            delay={0.21}
            className="mt-9 flex flex-wrap items-center gap-3 lg:flex-nowrap"
          >
            <Link
              href="#projects"
              className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-foreground px-5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Explore the work
              <ArrowDownRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
              />
            </Link>
            <Link
              href="#contact"
              className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-border bg-card/80 px-5 text-sm font-semibold text-foreground transition-[transform,border-color] hover:-translate-y-0.5 hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Start a conversation
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
            {emailLink ? (
              <SocialAnchor
                link={emailLink}
                showLabel
                openInNewTab
                className="h-12 shrink-0"
              />
            ) : null}
          </Reveal>
        </div>

        <Reveal delay={0.18} className="relative mx-auto w-full max-w-xl lg:mx-0">
          <div
            aria-hidden="true"
            className="absolute -inset-8 -z-10 rounded-full bg-accent/10 blur-3xl"
          />
          <div className="surface-shadow overflow-hidden rounded-[1.75rem] border border-border bg-card/90 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-border/80 px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                interface.tsx
              </span>
            </div>

            <div className="p-5 sm:p-7">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="font-mono text-xs text-accent">QUALITY_SIGNAL</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                    Craft is in the system.
                  </p>
                </div>
                <div className="rounded-2xl border border-accent/20 bg-accent/10 p-3 text-accent">
                  <Braces aria-hidden="true" className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-7 space-y-3">
                {systemSignals.map((signal, index) => (
                  <div
                    key={signal}
                    className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/50 px-4 py-3"
                  >
                    <span className="flex items-center gap-3 text-sm font-medium text-foreground">
                      <Check aria-hidden="true" className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      {signal}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-7 grid grid-cols-3 gap-2 border-t border-border/70 pt-5 text-center">
                {[
                  ["React", "19"],
                  ["Next", "16"],
                  ["Types", "Strict"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="font-mono text-sm font-semibold text-foreground">{value}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute -bottom-5 -left-4 flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground shadow-xl sm:-left-8">
            <Sparkles aria-hidden="true" className="h-4 w-4 text-accent" />
            Details are the product
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
