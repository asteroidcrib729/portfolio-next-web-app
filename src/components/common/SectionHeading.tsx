import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <div
      className={cn(
        "mb-12 sm:mb-16",
        isCentered ? "text-center mx-auto max-w-2xl" : "text-left max-w-2xl",
        className
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "mb-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
            "bg-accent/10 text-accent border border-accent/20"
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          {eyebrow}
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base sm:text-lg text-foreground/70 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

