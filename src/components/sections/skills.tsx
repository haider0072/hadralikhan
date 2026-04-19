import { skillGroups } from "@/data/skills";
import { Reveal } from "@/components/reveal";
import { SplitText } from "@/components/split-text";

export function Skills() {
  return (
    <section className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-12 mb-12">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
              05 — Toolkit
            </p>
          </div>
          <div className="md:col-span-8">
            <SplitText
              as="h2"
              text="The things I reach for."
              className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-tight"
              stagger={0.05}
            />
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g, i) => (
            <Reveal key={g.label} delay={i * 0.05}>
              <div className="border-t border-rule pt-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted mb-4">
                  {g.label}
                </p>
                <ul className="font-serif text-2xl md:text-3xl leading-[1.25] tracking-tight">
                  {g.items.map((s) => (
                    <li key={s} className="inline">
                      <span>{s}</span>
                      <span className="text-terracotta/60">
                        {" · "}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
