import type { Metadata } from "next";
import { site } from "@/data/site";
import { seo } from "@/data/seo";
import { Reveal } from "@/components/reveal";
import { SplitText } from "@/components/split-text";

export const metadata: Metadata = {
  title: "Work with me · selective project window",
  description: `Selective project work for product teams. ${site.name}, designer who codes. Framer, Webflow, Next.js, design systems, AI features.`,
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: undefined },
  openGraph: undefined,
  twitter: undefined,
};

const tiers = [
  {
    eyebrow: "01 · Site",
    title: "Framer or Webflow site",
    timeline: "7 to 14 days",
    priceFrom: "$2,500",
    blurb:
      "Landing page or full marketing site. Designed and built end-to-end. CMS where it makes sense. Fast load, clean motion, no template smell.",
    bullets: [
      "Brand-aligned design from your existing identity or a fresh pass",
      "Built directly in Framer or Webflow, no proxy stacks",
      "Lighthouse and Core Web Vitals tuned",
      "Hand-off includes editor training so your team can keep shipping",
    ],
  },
  {
    eyebrow: "02 · System",
    title: "Design system + frontend",
    timeline: "2 to 4 weeks",
    priceFrom: "$5,000",
    blurb:
      "Tokens, components, Figma library, and the matching React or Vue implementation. The kind of system that survives a hiring spike.",
    bullets: [
      "Token architecture in OKLCH with light and dark modes",
      "Component library, documented and ready for a new hire's first PR",
      "Frontend implementation in React, Next.js, or Vue",
      "Figma library wired to code via Code Connect",
    ],
  },
  {
    eyebrow: "03 · Product",
    title: "Custom build or AI feature",
    timeline: "2 to 6 weeks",
    priceFrom: "$7,500",
    blurb:
      "Next.js app, mobile MVP, or an AI feature dropped into your product. Designed and shipped end-to-end with AI as a pair.",
    bullets: [
      "Full-stack scope: Next.js, NestJS, Flutter, Python, depending on fit",
      "AI feature work: chat layers, RAG, agents, MCP integration",
      "Solo or embedded with your team for the engagement window",
      "Ship-ready output, not a prototype that needs a second team to finish",
    ],
  },
];

const process = [
  {
    step: "01",
    title: "Discovery call",
    body:
      "Thirty minutes to understand the actual problem, not just the brief. I'll send a written scope within a day if there's a fit.",
  },
  {
    step: "02",
    title: "Scope and deposit",
    body:
      "Fixed-price for project work, weekly for retainers. 50% deposit on signature, 50% on delivery. Milestone splits for larger scopes.",
  },
  {
    step: "03",
    title: "Ship in milestones",
    body:
      "Daily updates in your channel of choice. Working software at the end of every milestone, not at the end of the project.",
  },
];

const recent = [
  {
    name: "Mochi",
    blurb:
      "Design-system generator. Prompt to OKLCH tokens, components, and a Figma file. Solo build with TypeScript and AI.",
    href: "https://mochi-plum.vercel.app",
  },
  {
    name: "FlowCraft",
    blurb:
      "AI creative platform with node-based workflows. Sprite sheets, generation flows, video gen. Next.js, React Flow, OpenRouter.",
    href: "https://flowcraft-mu.vercel.app",
  },
  {
    name: "Audora",
    blurb:
      "Pro music player. FLAC, MP3, WAV with YouTube integration, equalizer, and synced lyrics. Built on Web Audio API.",
    href: `${seo.url}/work/audora`,
  },
];

export default function WorkWithMePage() {
  return (
    <main className="bg-cream text-ink">
      <Hero />
      <Tiers />
      <Process />
      <RecentWork />
      <Bring />
      <CTA />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-40 pb-24 md:pt-56 md:pb-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cream via-cream to-ochre/10" />
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
          Selective window · May 2026
        </p>

        <SplitText
          as="h1"
          text="Open for a few"
          className="mt-8 font-serif text-5xl md:text-8xl leading-[0.98] tracking-tight"
          stagger={0.05}
        />
        <SplitText
          as="h1"
          text="serious projects."
          className="font-serif italic text-5xl md:text-8xl leading-[0.98] tracking-tight text-terracotta mt-2"
          stagger={0.05}
          delay={0.15}
        />

        <Reveal delay={0.2}>
          <p className="mt-12 max-w-2xl text-ink-soft text-lg md:text-xl leading-relaxed">
            Product designer who codes. Four years of shipping software end-to-end,
            currently leading design and AI features at a 70k-user hiring SaaS.
            Outside that, I take on a few projects a quarter for product teams
            that move fast and care about craft.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-12 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${site.email}?subject=Project%20enquiry`}
              className="inline-flex items-center gap-3 rounded-full bg-ink text-cream px-7 py-4 text-base font-medium hover:bg-terracotta transition-colors"
            >
              <span>Start a conversation</span>
              <span>→</span>
            </a>
            <a
              href="#tiers"
              className="inline-flex items-center gap-3 rounded-full border border-ink/20 px-7 py-4 text-base font-medium hover:bg-ink hover:text-cream transition-colors"
            >
              See engagement types
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Tiers() {
  return (
    <section id="tiers" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
          Engagements
        </p>
        <Reveal>
          <h2 className="mt-8 font-serif text-4xl md:text-6xl leading-[1.02] tracking-tight max-w-3xl">
            Three shapes that
            <span className="italic text-terracotta"> usually fit</span>.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-ink-soft text-base md:text-lg leading-relaxed">
            Pick the closest match. Anything outside this we can shape on a call.
            Pricing is a starting point, not a ceiling, and depends on scope.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {tiers.map((t, i) => (
            <Reveal key={t.title} delay={0.1 + i * 0.08}>
              <div className="group relative h-full rounded-2xl border border-ink/10 bg-cream/50 p-8 hover:border-terracotta/40 hover:bg-cream transition-colors">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                  {t.eyebrow}
                </p>
                <h3 className="mt-4 font-serif text-2xl md:text-3xl leading-tight">
                  {t.title}
                </h3>
                <div className="mt-3 flex items-baseline gap-3 text-sm text-ink-soft">
                  <span className="font-mono">{t.timeline}</span>
                  <span className="opacity-30">·</span>
                  <span className="font-mono">from {t.priceFrom}</span>
                </div>
                <p className="mt-6 text-ink-soft text-[15px] leading-relaxed">
                  {t.blurb}
                </p>
                <ul className="mt-6 space-y-3 text-[14px] text-ink-soft leading-relaxed">
                  {t.bullets.map((b) => (
                    <li key={b} className="flex gap-3">
                      <span className="mt-[7px] block h-[5px] w-[5px] flex-none rounded-full bg-terracotta/70" />
                      <span>{b}</span>
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

function Process() {
  return (
    <section className="relative py-24 md:py-32 bg-ink/[0.03]">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
          How it runs
        </p>
        <Reveal>
          <h2 className="mt-8 font-serif text-4xl md:text-6xl leading-[1.02] tracking-tight max-w-3xl">
            Short calls, written scope,
            <span className="italic text-terracotta"> milestone delivery</span>.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {process.map((p, i) => (
            <Reveal key={p.step} delay={0.1 + i * 0.08}>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                  {p.step}
                </p>
                <h3 className="mt-4 font-serif text-2xl md:text-3xl leading-tight">
                  {p.title}
                </h3>
                <p className="mt-4 text-ink-soft text-[15px] leading-relaxed">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecentWork() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
          Recent
        </p>
        <Reveal>
          <h2 className="mt-8 font-serif text-4xl md:text-6xl leading-[1.02] tracking-tight max-w-3xl">
            Things I ship for
            <span className="italic text-terracotta"> myself</span>.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-ink-soft text-base md:text-lg leading-relaxed">
            Side projects double as the proof. Solo builds, real users, no slide
            deck between idea and shipped.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {recent.map((r, i) => (
            <Reveal key={r.name} delay={0.1 + i * 0.08}>
              <a
                href={r.href}
                target="_blank"
                rel="noreferrer"
                className="group block rounded-2xl border border-ink/10 bg-cream/50 p-8 hover:border-terracotta/40 hover:bg-cream transition-colors"
              >
                <h3 className="font-serif text-2xl md:text-3xl leading-tight">
                  {r.name}
                </h3>
                <p className="mt-4 text-ink-soft text-[15px] leading-relaxed">
                  {r.blurb}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-mono text-terracotta">
                  See it live
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Bring() {
  return (
    <section className="relative py-24 md:py-32 bg-ink/[0.03]">
      <div className="mx-auto max-w-7xl px-6 md:px-10 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
            What I bring
          </p>
        </div>
        <div className="md:col-span-8 space-y-6 text-ink-soft text-lg leading-relaxed">
          <Reveal>
            <p>
              I take ambiguous problems and ship the whole thing, not a slice.
              Design, frontend, backend, mobile, and AI features all land in
              the same set of hands.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p>
              That hybrid started as a coping mechanism for tiny teams. It
              became the way I work because AI made the syntax layer cheap
              and the bottleneck moved to taste, judgment, and shipping speed.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p>
              Currently in Karachi (UTC+5). Comfortable real-time overlap with
              US East-Coast mornings, all of Europe and the UK, and APAC. Most
              calls are recorded and shared back so the work is asynchronous
              by default.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative overflow-hidden py-32 md:py-48">
      <div className="absolute -z-10 inset-x-0 -top-20 h-[130%] bg-gradient-to-br from-terracotta/15 via-ochre/10 to-cream" />
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
          Get in touch
        </p>
        <SplitText
          as="h2"
          text="Tell me what you're"
          className="mt-8 font-serif text-5xl md:text-8xl leading-[0.98] tracking-tight"
          stagger={0.05}
        />
        <SplitText
          as="h2"
          text="shipping next."
          className="font-serif italic text-5xl md:text-8xl leading-[0.98] tracking-tight text-terracotta mt-2"
          stagger={0.05}
          delay={0.15}
        />

        <Reveal delay={0.2}>
          <div className="mt-14 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${site.email}?subject=Project%20enquiry`}
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
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="mt-12 max-w-xl text-ink-soft text-lg leading-relaxed">
            One reply within a day, usually faster. If a project is the right
            fit you'll have a written scope by the next morning.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
