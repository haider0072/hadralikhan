import { other } from "@/data/projects";
import { Reveal } from "@/components/reveal";
import { SplitText } from "@/components/split-text";

export function OtherProjects() {
  return (
    <section className="relative py-28 md:py-40 bg-cream-deep/50">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-12 mb-12">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
              04 · Also
            </p>
          </div>
          <div className="md:col-span-8">
            <SplitText
              as="h2"
              text="Smaller experiments."
              className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-tight"
              stagger={0.05}
            />
          </div>
        </div>

        <ul className="divide-y divide-rule border-t border-b border-rule">
          {other.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.03} y={16}>
              <li className="group">
                <div className="grid gap-4 md:grid-cols-12 items-baseline py-6 md:py-8 px-2 md:px-4 transition-colors hover:bg-paper/60">
                  <span className="font-mono text-xs text-ink-muted md:col-span-1">
                    /{String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl md:col-span-3 tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-ink-soft md:col-span-5 text-sm md:text-base">
                    {p.tagline}
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted md:col-span-2">
                    {p.stack.slice(0, 2).join(" · ")}
                  </p>
                  <span className="font-mono text-xs text-ink-muted md:col-span-1 md:text-right">
                    {p.year}
                  </span>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
