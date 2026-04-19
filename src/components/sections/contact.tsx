"use client";

import { site } from "@/data/site";
import { SplitText } from "@/components/split-text";
import { Reveal } from "@/components/reveal";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function Contact() {
  const bg = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bg.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: el.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" className="relative overflow-hidden py-32 md:py-48">
      <div
        ref={bg}
        className="absolute -z-10 inset-x-0 -top-20 h-[130%] bg-gradient-to-br from-terracotta/15 via-ochre/10 to-cream"
      />

      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
          06 — Let's talk
        </p>

        <SplitText
          as="h2"
          text="Got an unreasonable idea?"
          className="mt-8 font-serif text-5xl md:text-8xl leading-[0.98] tracking-tight"
          stagger={0.05}
        />
        <SplitText
          as="h2"
          text="Bring it over."
          className="font-serif italic text-5xl md:text-8xl leading-[0.98] tracking-tight text-terracotta mt-2"
          stagger={0.05}
          delay={0.15}
        />

        <Reveal delay={0.2}>
          <div className="mt-14 flex flex-wrap items-center gap-4">
            <a
              href={site.socials.email}
              className="group inline-flex items-center gap-3 rounded-full bg-ink text-cream px-7 py-4 text-base font-medium hover:bg-terracotta transition-colors"
            >
              <span>{site.email}</span>
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 rounded-full border border-ink/20 px-7 py-4 text-base font-medium hover:bg-ink hover:text-cream transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={site.socials.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 rounded-full border border-ink/20 px-7 py-4 text-base font-medium hover:bg-ink hover:text-cream transition-colors"
            >
              GitHub
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="mt-12 max-w-xl text-ink-soft text-lg leading-relaxed">
            Reply within a day or two, usually the same. I like weird briefs,
            early-stage product bets, and anything where design and engineering
            have to sit in the same room.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
