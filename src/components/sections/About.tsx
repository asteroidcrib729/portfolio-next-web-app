import { Container } from "@/components/common/Container";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";
import { siteConfig, stats } from "@/data/siteConfig";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            id="about-title"
            eyebrow="The point of view"
            title="Engineering is only impressive when the experience is effortless."
            description="I build interfaces that make complex systems feel clear, trustworthy, and genuinely enjoyable to use."
            align="left"
          />
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20">
          <Reveal className="space-y-5 text-base leading-8 text-muted-foreground sm:text-lg">
            {siteConfig.aboutParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>

          <div className="grid gap-3 sm:grid-cols-2">
            {stats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 0.06}>
                <article className="group h-full rounded-2xl border border-border bg-card/75 p-5 transition-[transform,border-color,background-color] hover:-translate-y-1 hover:border-accent/40 hover:bg-card">
                  <p className="font-mono text-3xl font-semibold tracking-tight text-accent">
                    {stat.value}
                  </p>
                  <h3 className="mt-4 text-sm font-semibold text-foreground">{stat.label}</h3>
                  {stat.description ? (
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {stat.description}
                    </p>
                  ) : null}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
