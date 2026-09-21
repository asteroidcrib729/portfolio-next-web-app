"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";
import { skillCategories } from "@/data/siteConfig";

const allCategory = "All systems";

export function Skills() {
  const [activeCategory, setActiveCategory] = useState(allCategory);
  const shouldReduceMotion = useReducedMotion();
  const visibleCategories =
    activeCategory === allCategory
      ? skillCategories
      : skillCategories.filter((group) => group.category === activeCategory);

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="border-y border-border/70 bg-card/35 py-24 sm:py-32"
    >
      <Container>
        <SectionHeading
          id="skills-title"
          eyebrow="Capabilities"
          title="A full-stack toolkit for production-oriented products."
          description="From accessible interfaces and resilient APIs to data systems and cloud platforms, this stack supports the complete path from product idea to maintained software."
          align="left"
        />

        <div
          role="group"
          aria-label="Filter skills by category"
          className="flex flex-wrap gap-2"
        >
          {[allCategory, ...skillCategories.map((group) => group.category)].map(
            (category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "min-h-11 rounded-xl border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    isActive
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border bg-background/70 text-muted-foreground hover:border-accent/40 hover:text-foreground"
                  )}
                >
                  {category}
                </button>
              );
            }
          )}
        </div>

        <div className="mt-10" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeCategory}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.24 }}
              className="grid gap-4 lg:grid-cols-2"
            >
              {visibleCategories.map((group) => (
                <article
                  key={group.category}
                  className="rounded-2xl border border-border bg-background/75 p-5 sm:p-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-base font-semibold text-foreground">
                      {group.category}
                    </h3>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      {group.items.length} tools
                    </span>
                  </div>
                  <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                    {group.items.map((skill) => (
                      <li
                        key={skill.name}
                        className="flex min-h-14 items-center justify-between gap-3 rounded-xl border border-border/70 bg-card px-3.5 py-2.5"
                      >
                        <span className="text-sm font-medium text-foreground">
                          {skill.name}
                        </span>
                        {skill.level ? (
                          <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                            {skill.level}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
