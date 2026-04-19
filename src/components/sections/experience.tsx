import { experience } from "@/data/experience";
import { Reveal } from "@/components/reveal";
import { SplitText } from "@/components/split-text";

export function Experience() {
  return (
    <section
      id="experience"
      className="relative py-28 md:py-40 bg-cream-deep/50"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-12 mb-16">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
              02 · Work
            </p>
          </div>
          <div className="md:col-span-8">
            <SplitText
              as="h2"
              text="Places I've built things."
              className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-tight"
              stagger={0.045}
            />
          </div>
        </div>

        <ol className="relative">
          {experience.map((exp, i) => (
            <Reveal key={exp.company} delay={i * 0.05}>
              <li className="group grid gap-6 md:grid-cols-12 py-10 border-t border-rule first:border-t-0">
                <div className="md:col-span-2">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
                    {exp.period}
                  </p>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted mt-1">
                    {exp.location}
                  </p>
                </div>
                <div className="md:col-span-5">
                  <h3 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight">
                    {exp.company}
                  </h3>
                  <p className="mt-2 text-ink-muted">{exp.role}</p>
                </div>
                <div className="md:col-span-5 space-y-4">
                  <p className="text-ink-soft leading-relaxed">{exp.body}</p>
                  <ul className="space-y-1.5 text-sm text-ink-muted">
                    {exp.highlights.map((h) => (
                      <li key={h} className="flex gap-2">
                        <span className="text-terracotta">·</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
