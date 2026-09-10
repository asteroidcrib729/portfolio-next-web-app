import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { Container } from "@/components/common/Container";
import { SocialAnchor } from "@/components/common/SocialAnchor";
import { siteConfig, socialLinks } from "@/data/siteConfig";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/70 bg-card/35 py-8">
      <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">
            © {currentYear} {siteConfig.name}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Designed with intent. Engineered with evidence.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {socialLinks.map((link) => (
            <SocialAnchor key={link.label} link={link} />
          ))}
          <Link
            href="#home"
            aria-label="Back to top"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card/80 text-muted-foreground transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ArrowUp aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </footer>
  );
}
