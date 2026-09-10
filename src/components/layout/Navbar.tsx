import Link from "next/link";
import { Container } from "@/components/common/Container";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { MobileNav } from "@/components/layout/MobileNav";
import { navLinks, siteConfig } from "@/data/siteConfig";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/82 backdrop-blur-xl transition-colors duration-200">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          aria-label={`${siteConfig.name}, home`}
          className="group flex items-center space-x-2.5 font-mono text-base font-bold tracking-tight text-foreground transition-colors hover:text-accent"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-sm font-semibold text-accent-foreground transition-transform group-hover:-rotate-3 group-hover:scale-105">
            {siteConfig.shortName}
          </span>
          <span className="hidden sm:inline-block font-semibold">{siteConfig.name}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Primary" className="hidden items-center space-x-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative py-2 text-sm font-medium text-muted-foreground transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:scale-x-0 after:bg-accent after:transition-transform hover:text-accent hover:after:origin-left hover:after:scale-x-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
