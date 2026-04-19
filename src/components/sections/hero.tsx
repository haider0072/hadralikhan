"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "@/components/split-text";
import { site } from "@/data/site";

const LanternCanvas = dynamic(
  () => import("@/components/lantern-canvas").then((m) => m.LanternCanvas),
  { ssr: false },
);

export function Hero() {
  const scroll = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scroll.current;
    if (!el) return;
    const tl = gsap.to(el, {
      y: 10,
      opacity: 0.5,
      duration: 1.3,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-paper to-cream" />
        <div className="absolute top-1/3 right-[-10%] w-[60%] h-[60%] rounded-full bg-terracotta/10 blur-[120px]" />
        <div className="absolute bottom-0 left-[-10%] w-[50%] h-[50%] rounded-full bg-ochre/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-10 pt-32 md:pt-40 pb-24 grid gap-10 md:gap-0 md:grid-cols-12 items-center">
        <div className="md:col-span-7 relative">
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-ink-muted mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-terracotta animate-pulse" />
            <span>Available · Q2 2026</span>
          </div>

          <SplitText
            as="h1"
            text="Designs products. Ships systems."
            className="font-serif text-[clamp(2.5rem,7vw,6.2rem)] leading-[0.95] tracking-tight text-ink"
            stagger={0.06}
          />
          <SplitText
            as="h1"
            text="Occasionally, a little magic."
            className="font-serif italic text-[clamp(2.5rem,7vw,6.2rem)] leading-[0.95] tracking-tight text-terracotta mt-2"
            stagger={0.06}
            delay={0.15}
          />

          <p className="mt-10 max-w-xl text-lg md:text-xl leading-relaxed text-ink-soft">
            {site.tagline}
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="group inline-flex items-center gap-3 rounded-full bg-ink text-cream px-6 py-3 text-sm font-medium hover:bg-terracotta transition-colors"
            >
              <span>See the work</span>
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 rounded-full border border-ink/20 px-6 py-3 text-sm font-medium hover:bg-ink hover:text-cream transition-colors"
            >
              Say hello
            </a>
          </div>
        </div>

        <div className="md:col-span-5 relative">
          <div className="relative aspect-square w-full max-w-[480px] mx-auto">
            <div className="absolute inset-0">
              <LanternCanvas />
            </div>
            <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
              <span className="block">Fig. 01</span>
              <span className="block">Warmth, suspended</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center">
        <div ref={scroll} className="flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-muted">
            Scroll
          </span>
          <span className="block h-10 w-px bg-ink-muted/40" />
        </div>
      </div>
    </section>
  );
}
