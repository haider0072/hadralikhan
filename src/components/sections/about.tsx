import { site } from "@/data/site";
import { Reveal } from "@/components/reveal";
import { SplitText } from "@/components/split-text";

export function About() {
  return (
    <section id="about" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4 md:sticky md:top-32 self-start">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
            01 — About
          </p>
          <SplitText
            as="h2"
            text="A maker from Karachi."
            className="mt-6 font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight"
            stagger={0.05}
          />
        </div>
        <div className="md:col-span-8 md:col-start-6 space-y-8 font-serif text-xl md:text-2xl leading-[1.55] text-ink-soft">
          {site.about.map((p, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p>
                {i === 0 ? (
                  <>
                    <span className="float-left font-serif text-6xl md:text-7xl leading-[0.8] mr-3 mt-1 text-terracotta">
                      {p.charAt(0)}
                    </span>
                    {p.slice(1)}
                  </>
                ) : (
                  p
                )}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
