import type { ComponentType, SVGProps } from "react";
import { ExternalLink, Mail } from "lucide-react";
import { Icons } from "@/components/common/Icons";
import { cn } from "@/lib/utils";
import type { SocialLink } from "@/types";

interface SocialAnchorProps {
  link: SocialLink;
  className?: string;
  showLabel?: boolean;
}

const iconMap: Record<
  SocialLink["icon"],
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  github: Icons.gitHub,
  linkedin: Icons.linkedIn,
  twitter: Icons.twitter,
  mail: Mail,
  external: ExternalLink,
};

export function SocialAnchor({
  link,
  className,
  showLabel = false,
}: SocialAnchorProps) {
  const Icon = iconMap[link.icon];
  const opensNewContext = /^https?:\/\//.test(link.href);

  return (
    <a
      href={link.href}
      target={opensNewContext ? "_blank" : undefined}
      rel={opensNewContext ? "noopener noreferrer" : undefined}
      aria-label={showLabel ? undefined : link.label}
      className={cn(
        "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl border border-border bg-card/80 px-3 text-sm font-medium text-muted-foreground transition-[color,border-color,background-color,transform] hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      <Icon aria-hidden="true" focusable="false" className="h-4 w-4" />
      {showLabel ? <span>{link.label}</span> : null}
    </a>
  );
}
