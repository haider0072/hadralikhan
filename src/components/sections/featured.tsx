"use client";

import { featured } from "@/data/projects";
import { Reveal } from "@/components/reveal";
import { SplitText } from "@/components/split-text";
import { cn } from "@/lib/cn";

const accentBg: Record<string, string> = {
  terracotta: "bg-terracotta/15",
  ochre: "bg-ochre/15",
  sage: "bg-sage/15",
};
const accentDot: Record<string, string> = {
  terracotta: "bg-terracotta",
  ochre: "bg-ochre",
  sage: "bg-sage",
};

export function Featured() {
  return (
    <section id="projects" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-12 mb-16">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
              03 — Selected work
            </p>
          </div>
          <div className="md:col-span-8">
            <SplitText
              as="h2"
              text="Things I've made along the way."
              className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-tight"
              stagger={0.04}
            />
          </div>
        </div>

        <div className="space-y-24 md:space-y-32">
          {featured.map((p, i) => (
            <Reveal key={p.slug}>
              <article
                className={cn(
                  "grid gap-8 md:grid-cols-12 items-center",
                  i % 2 === 1 ? "md:[&>.art]:order-2" : "",
                )}
              >
                <div
                  className={cn(
                    "art md:col-span-7 relative aspect-[4/3] rounded-sm overflow-hidden border border-rule",
                    accentBg[p.accent ?? "terracotta"],
                  )}
                >
                  <ProjectArt slug={p.slug} accent={p.accent ?? "terracotta"} />
                  <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
                    Fig. 0{i + 2}
                  </span>
                  <span className="absolute top-4 right-4 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
                    {p.year}
                  </span>
                </div>
                <div className="md:col-span-5 md:px-4">
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        accentDot[p.accent ?? "terracotta"],
                      )}
                    />
                    <span>{p.role}</span>
                  </div>
                  <h3 className="mt-4 font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-4 text-ink-soft text-lg leading-relaxed">
                    {p.tagline}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                    {p.stack.map((s) => (
                      <li
                        key={s}
                        className="border border-rule rounded-full px-3 py-1"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                  {p.href && (
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group mt-8 inline-flex items-center gap-3 text-sm font-medium border-b border-ink/30 pb-1 hover:border-terracotta hover:text-terracotta transition-colors"
                    >
                      <span>View project</span>
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </a>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectArt({
  slug,
  accent,
}: {
  slug: string;
  accent: "terracotta" | "ochre" | "sage";
}) {
  const stroke =
    accent === "terracotta"
      ? "#c4623d"
      : accent === "ochre"
        ? "#b88a3e"
        : "#7a8268";
  const ink = "#2a1f17";

  if (slug === "mochi") {
    return (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <rect width="400" height="300" fill="transparent" />
        {Array.from({ length: 8 }).map((_, r) =>
          Array.from({ length: 12 }).map((_, c) => (
            <circle
              key={`${r}-${c}`}
              cx={40 + c * 28}
              cy={40 + r * 28}
              r={r === c ? 10 : 3.5}
              fill={r === 3 && c === 6 ? stroke : ink}
              opacity={r === 3 && c === 6 ? 1 : 0.35}
            />
          )),
        )}
      </svg>
    );
  }
  if (slug === "audora") {
    return (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {Array.from({ length: 48 }).map((_, i) => {
          const h = Math.round((20 + Math.abs(Math.sin(i * 0.6)) * 160) * 100) / 100;
          return (
            <rect
              key={i}
              x={Math.round((20 + i * 7.8) * 100) / 100}
              y={Math.round((150 - h / 2) * 100) / 100}
              width="3"
              height={h}
              fill={i === 24 ? stroke : ink}
              opacity={i === 24 ? 1 : 0.55}
            />
          );
        })}
      </svg>
    );
  }
  if (slug === "flowcraft") {
    return (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {Array.from({ length: 4 }).map((_, r) =>
          Array.from({ length: 6 }).map((_, c) => (
            <g key={`${r}-${c}`}>
              <rect
                x={30 + c * 58}
                y={40 + r * 58}
                width="50"
                height="50"
                fill="none"
                stroke={ink}
                strokeWidth={0.8}
                opacity={0.4}
              />
              <circle
                cx={55 + c * 58}
                cy={65 + r * 58}
                r={10 + ((c + r) % 3) * 2}
                fill={r === 1 && c === 3 ? stroke : ink}
                opacity={r === 1 && c === 3 ? 1 : 0.7}
              />
            </g>
          )),
        )}
      </svg>
    );
  }
  if (slug === "ember") {
    return (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <circle cx="200" cy="150" r="90" fill="none" stroke={ink} opacity="0.5" />
        <circle cx="200" cy="150" r="60" fill="none" stroke={ink} opacity="0.6" />
        <circle cx="200" cy="150" r="30" fill={stroke} />
        <path
          d="M 200 80 L 200 220 M 130 150 L 270 150"
          stroke={ink}
          strokeWidth="0.8"
          opacity="0.4"
        />
      </svg>
    );
  }
  // trading-bot default
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      <polyline
        points="20,220 60,180 100,200 140,140 180,160 220,100 260,130 300,80 340,110 380,60"
        fill="none"
        stroke={stroke}
        strokeWidth="2"
      />
      {[20, 60, 100, 140, 180, 220, 260, 300, 340, 380].map((x, i) => {
        const ys = [220, 180, 200, 140, 160, 100, 130, 80, 110, 60];
        return (
          <circle key={i} cx={x} cy={ys[i]} r="3" fill={ink} opacity="0.7" />
        );
      })}
      <line
        x1="20"
        y1="250"
        x2="380"
        y2="250"
        stroke={ink}
        strokeWidth="0.5"
        opacity="0.3"
      />
    </svg>
  );
}
