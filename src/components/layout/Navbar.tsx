import Link from "next/link";
import { Container } from "@/components/common/Container";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { MobileNav } from "@/components/layout/MobileNav";
import { navLinks, siteConfig } from "@/data/siteConfig";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md transition-colors duration-200">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="group flex items-center space-x-2 font-mono text-base font-bold tracking-tight text-foreground transition-colors hover:text-accent"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent font-semibold transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
            {siteConfig.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
          <span className="hidden sm:inline-block font-semibold">{siteConfig.name}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:text-accent"
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

