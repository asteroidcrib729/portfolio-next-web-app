import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/common/Container";
import { Icons } from "@/components/common/Icons";
import { siteConfig, socialLinks } from "@/data/siteConfig";
import { ArrowUpRight, Mail } from "lucide-react";

function getSocialIcon(icon: string) {
  switch (icon) {
    case "github":
      return <Icons.gitHub className="h-4 w-4" />;
    case "linkedin":
      return <Icons.linkedIn className="h-4 w-4" />;
    case "twitter":
      return <Icons.twitter className="h-4 w-4" />;
    case "mail":
      return <Mail className="h-4 w-4" />;
    default:
      return <ArrowUpRight className="h-4 w-4" />;
  }
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-accent/20 selection:text-accent">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <Container className="flex flex-col items-start justify-center">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-medium text-muted-foreground shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{siteConfig.status}</span>
            </div>

            {/* Headline */}
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Hi, I&apos;m{" "}
              <span className="text-accent">{siteConfig.name}</span>
            </h1>

            <p className="mt-4 text-xl font-medium text-foreground/90 sm:text-2xl">
              {siteConfig.title}
            </p>

            <p className="mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed sm:text-lg">
              {siteConfig.tagline} {siteConfig.bio}
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="#projects"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-foreground px-6 text-sm font-semibold text-background transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                View Projects
              </Link>
              <Link
                href="#contact"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-6 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Get in Touch
              </Link>
            </div>

            {/* Social Icons */}
            <div className="mt-10 flex items-center space-x-5">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="rounded-lg border border-border bg-card p-2 text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
                >
                  {getSocialIcon(link.icon)}
                </a>
              ))}
            </div>
          </Container>
        </section>

        {/* Placeholder Anchor Sections */}
        <section id="about" className="border-t border-border/40 py-16">
          <Container>
            <h2 className="text-2xl font-bold tracking-tight">About Me</h2>
            <p className="mt-2 text-muted-foreground">Detailed background and technical experience coming in next phase.</p>
          </Container>
        </section>

        <section id="skills" className="border-t border-border/40 py-16">
          <Container>
            <h2 className="text-2xl font-bold tracking-tight">Skills & Technologies</h2>
            <p className="mt-2 text-muted-foreground">Interactive skill badges and tech stack categorization coming in next phase.</p>
          </Container>
        </section>

        <section id="projects" className="border-t border-border/40 py-16">
          <Container>
            <h2 className="text-2xl font-bold tracking-tight">Featured Projects</h2>
            <p className="mt-2 text-muted-foreground">Project cards, live demos, and case studies coming in next phase.</p>
          </Container>
        </section>

        <section id="experience" className="border-t border-border/40 py-16">
          <Container>
            <h2 className="text-2xl font-bold tracking-tight">Experience</h2>
            <p className="mt-2 text-muted-foreground">Career journey and engineering milestones coming in next phase.</p>
          </Container>
        </section>

        <section id="contact" className="border-t border-border/40 py-16">
          <Container>
            <h2 className="text-2xl font-bold tracking-tight">Get in Touch</h2>
            <p className="mt-2 text-muted-foreground">Direct contact channels and message form coming in next phase.</p>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
