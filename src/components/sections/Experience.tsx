import { Container } from "@/components/common/Container";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";
import { experiences } from "@/data/siteConfig";

export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="border-y border-border/70 bg-card/35 py-24 sm:py-32"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <Reveal>
            <SectionHeading
              id="experience-title"
              eyebrow="Working method"
              title="A repeatable path from idea to exceptional product."
              description="Strong software engineering is not a final coat of polish. It is a sequence of deliberate decisions from content model and service boundary to release gate."
              align="left"
              className="lg:sticky lg:top-28"
            />
          </Reveal>

          <ol className="relative border-l border-border pl-7 sm:pl-10">
            {experiences.map((experience, index) => (
              <li key={experience.id} className="relative pb-12 last:pb-0">
                <span
                  aria-hidden="true"
                  className="absolute -left-[2.05rem] top-1 flex h-4 w-4 items-center justify-center rounded-full border-4 border-background bg-accent sm:-left-[2.7rem]"
                />
                <Reveal delay={index * 0.08}>
                  <article className="rounded-2xl border border-border bg-background/75 p-5 sm:p-7">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                          {experience.company}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                          {experience.role}
                        </h3>
                      </div>
                      <p className="shrink-0 font-mono text-xs text-muted-foreground">
                        {experience.period}
                      </p>
                    </div>

                    <ul className="mt-5 space-y-3">
                      {experience.description.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                          <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {experience.technologies?.map((technology) => (
                        <span
                          key={technology}
                          className="rounded-lg bg-muted px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                        >
                          {technology}
                        </span>
                      ))}
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
