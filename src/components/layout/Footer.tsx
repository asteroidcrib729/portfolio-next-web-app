import { Container } from "@/components/common/Container";
import { siteConfig, socialLinks } from "@/data/siteConfig";
import { Icons } from "@/components/common/Icons";
import { Mail, ExternalLink } from "lucide-react";

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
      return <ExternalLink className="h-4 w-4" />;
  }
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/60 bg-card/30 py-8 transition-colors duration-200">
      <Container className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <p className="text-xs text-muted-foreground">
          © {currentYear} {siteConfig.name}. Designed & built with Next.js, React & Tailwind CSS.
        </p>

        <div className="flex items-center space-x-4">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="text-muted-foreground transition-colors hover:text-accent"
            >
              {getSocialIcon(link.icon)}
            </a>
          ))}
        </div>
      </Container>
    </footer>
  );
}

