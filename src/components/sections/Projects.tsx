import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Icons } from "@/components/common/Icons";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";
import { projects } from "@/data/siteConfig";

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            id="projects-title"
            eyebrow="Selected systems"
            title="Work that demonstrates the decisions behind the pixels."
            description="Not a gallery of screenshots—a set of software case studies showing how architecture, interaction, and quality reinforce one another."
            align="left"
          />
        </Reveal>

        <div className="space-y-5">
          {projects.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.07}>
              <article className="group relative overflow-hidden rounded-[1.75rem] border border-border bg-card/80 p-6 transition-[transform,border-color] hover:-translate-y-1 hover:border-accent/45 sm:p-8 lg:p-10">
                <div
                  aria-hidden="true"
                  className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-accent/8 blur-3xl transition-transform duration-500 group-hover:scale-125"
                />

                <div className="relative grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
                  <div>
                    <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      <span className="text-accent">0{index + 1}</span>
                      <span aria-hidden="true" className="h-px w-8 bg-border" />
                      {project.category}
                      {project.featured ? (
                        <span className="rounded-full border border-accent/25 bg-accent/8 px-2 py-1 text-accent">
                          Featured
                        </span>
                      ) : null}
                    </div>
                    <h3 className="text-balance mt-5 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
                      {project.title}
                    </h3>
                    <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
                      {project.description}
                    </p>

                    <div className="mt-7 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg border border-border bg-muted/55 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-background/65 p-5 sm:p-6">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                        Engineering notes
                      </p>
                      <ul className="mt-5 space-y-4">
                        {project.highlights?.map((highlight) => (
                          <li key={highlight} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                            <CheckCircle2
                              aria-hidden="true"
                              className="mt-1 h-4 w-4 shrink-0 text-accent"
                            />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {project.demoUrl || project.githubUrl ? (
                      <div className="mt-8 flex flex-wrap gap-3 border-t border-border/70 pt-5">
                        {project.demoUrl ? (
                          <a
                            href={project.demoUrl}
                            target={project.demoUrl.startsWith("http") ? "_blank" : undefined}
                            rel={project.demoUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-foreground px-4 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                          >
                            View live interface
                            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                            {project.demoUrl.startsWith("http") ? (
                              <span className="sr-only">(opens in a new tab)</span>
                            ) : null}
                          </a>
                        ) : null}
                        {project.githubUrl ? (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                          >
                            <Icons.gitHub aria-hidden="true" className="h-4 w-4" />
                            Source
                            <span className="sr-only">(opens in a new tab)</span>
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
