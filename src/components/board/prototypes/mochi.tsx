"use client";

import { useEffect, useRef, useState } from "react";
import type { CardActivity } from "../use-card-activity";
import { ProjectFrame } from "../project-frame";
import { FocusModal } from "../focus-modal";
import { ClaudeLogo, FigmaLogo, GithubLogo } from "../tool-logos";
import { cn } from "@/lib/cn";

const SEEDS = [
  { name: "Matcha", primary: "#4CAF77", accent: "#4CAF9E", label: "mint fresh" },
  { name: "Sakura", primary: "#E91E63", accent: "#E9891E", label: "playful warm" },
  { name: "Yuzu", primary: "#F59E0B", accent: "#F5D80B", label: "citrus bright" },
  { name: "Nori", primary: "#0EA5E9", accent: "#0EE9A5", label: "calm water" },
  { name: "Wasabi", primary: "#84CC16", accent: "#C3CC16", label: "earthy crisp" },
];

function scale(hex: string): string[] {
  const steps = 11;
  return Array.from({ length: steps }).map((_, i) => {
    const t = i / (steps - 1);
    const alpha = Math.round(0.12 + t * 0.88 * 255)
      .toString(16)
      .padStart(2, "0");
    return `${hex}${alpha}`;
  });
}

export function MochiPrototype({ activity }: { activity: CardActivity }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <MochiPeek activity={activity} onOpen={() => setOpen(true)} />
      <FocusModal open={open} onClose={() => setOpen(false)} projectKey="Mochi">
        <MochiFocus />
      </FocusModal>
    </>
  );
}

function Mascot({
  blushing = false,
  thinking = false,
  className,
}: {
  blushing?: boolean;
  thinking?: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <radialGradient id="mochi-body" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f0e8df" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="58" rx="36" ry="32" fill="url(#mochi-body)" stroke="#3d2f23" strokeWidth="1.5" />
      <g>
        <ellipse cx="38" cy="54" rx="3" ry="4" fill="#3d2f23">
          <animate
            attributeName="ry"
            values="4;0.3;4;4;4"
            keyTimes="0;0.05;0.1;0.8;1"
            dur="4s"
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse cx="62" cy="54" rx="3" ry="4" fill="#3d2f23">
          <animate
            attributeName="ry"
            values="4;0.3;4;4;4"
            keyTimes="0;0.05;0.1;0.8;1"
            dur="4s"
            repeatCount="indefinite"
          />
        </ellipse>
      </g>
      {blushing && (
        <>
          <circle cx="32" cy="63" r="4" fill="#FFB6C1" opacity="0.6" />
          <circle cx="68" cy="63" r="4" fill="#FFB6C1" opacity="0.6" />
        </>
      )}
      <path
        d="M 44 67 Q 50 71 56 67"
        stroke="#3d2f23"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {thinking && (
        <g opacity="0.85">
          <circle cx="80" cy="30" r="4" fill="#4CAF77" />
          <circle cx="74" cy="22" r="2.5" fill="#4CAF77" />
          <circle cx="70" cy="18" r="1.8" fill="#4CAF77" />
        </g>
      )}
    </svg>
  );
}

function MochiPeek({
  activity,
  onOpen,
}: {
  activity: CardActivity;
  onOpen: () => void;
}) {
  const [seedIdx, setSeedIdx] = useState(0);
  const seed = SEEDS[seedIdx];
  const palette = scale(seed.primary);

  useEffect(() => {
    if (activity === "idle") return;
    const id = setInterval(() => {
      setSeedIdx((i) => (i + 1) % SEEDS.length);
    }, 2800);
    return () => clearInterval(id);
  }, [activity]);

  return (
    <ProjectFrame
      meta={{
        year: "2026",
        title: "Mochi",
        tagline:
          "One prompt → a full production-grade design system. Tokens, React + Vue, Figma, done.",
      }}
      innerClassName="bg-[#fdfbf5]"
      onOpen={onOpen}
      tape="top-left"
    >
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-40 blur-3xl transition-colors duration-700"
        style={{ background: seed.primary + "80" }}
      />

      <div className="absolute inset-4 flex items-center gap-4">
        <div className="relative shrink-0">
          <Mascot blushing thinking={activity === "active"} className="w-24 h-24" />
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-2 w-16 rounded-full blur-md opacity-40 transition-colors duration-700"
            style={{ background: seed.primary }}
          />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full transition-colors duration-700"
              style={{ background: seed.primary }}
            />
            <span
              className="font-mono text-[10px] uppercase tracking-[0.22em] transition-colors duration-700"
              style={{ color: "#3d2f23aa" }}
            >
              {seed.name} · {seed.label}
            </span>
          </div>
          <div className="flex gap-[2px] rounded-sm overflow-hidden">
            {palette.map((c, i) => (
              <div
                key={i}
                className="h-5 flex-1 transition-colors duration-700"
                style={{ background: c }}
              />
            ))}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {["primary", "accent", "neutral"].map((label, i) => (
              <div
                key={label}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1.5 border transition-colors duration-700"
                style={{
                  background: i === 0 ? seed.primary + "22" : "#ffffffcc",
                  borderColor: i === 0 ? seed.primary + "55" : "#3d2f2322",
                  color: i === 0 ? "#1a3d2a" : "#3d2f23",
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background:
                      i === 0 ? seed.primary : i === 1 ? seed.accent : "#a89883",
                  }}
                />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-[#3d2f23aa]">
        <span>Prompt → OKLCH → React + Vue + Figma</span>
        <span className="flex items-center gap-1">
          <span
            className="h-1.5 w-1.5 rounded-full animate-pulse"
            style={{ background: seed.primary }}
          />
          live
        </span>
      </div>
    </ProjectFrame>
  );
}

type MochiTab = "generate" | "components" | "code" | "figma";

function MochiFocus() {
  const [seedIdx, setSeedIdx] = useState(0);
  const seed = SEEDS[seedIdx];
  const [tab, setTab] = useState<MochiTab>("generate");

  return (
    <div
      className="w-[min(1240px,96vw)] h-[min(780px,92vh)] grid grid-cols-[360px_1fr] bg-[#fdfbf5] overflow-hidden"
      style={{ fontFamily: "'Quicksand', ui-sans-serif, system-ui" }}
    >
      {/* Sidebar — case study */}
      <aside className="p-7 bg-[#f5f0e4] border-r border-[#3d2f2315] overflow-y-auto">
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center transition-colors"
            style={{ background: seed.primary }}
          >
            <Mascot className="w-7 h-7" />
          </div>
          <div>
            <p className="font-bold text-base leading-none text-[#2a1f17]">mochi</p>
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6b5a4a] mt-1">
              2026 · Design tool
            </p>
          </div>
        </div>

        <p className="mt-5 text-[13px] leading-relaxed text-[#6b5a4a]">
          I work in Claude Code every day. My own projects felt intentional
          because I set design guidelines before prompting. Everyone
          else&apos;s AI-built apps kept looking the same: generic,
          shadcn-default, no soul. Mochi is the tool I wanted. One prompt,
          one complete design system. Tokens, components, and a Figma file
          you can actually use.
        </p>

        <div className="mt-6">
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6b5a4a] mb-2">
            My role
          </p>
          <p className="text-[13px] leading-relaxed text-[#6b5a4a]">
            Solo. System design, the generator, the component library, the
            Figma plugin. Everything from the empty repo to the published
            build.
          </p>
        </div>

        <div className="mt-6">
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6b5a4a] mb-3">
            Built with
          </p>
          <div className="inline-flex items-center gap-2 rounded-md border border-[#3d2f2322] bg-white px-3 py-1.5">
            <ClaudeLogo size={14} className="text-[#2a1f17]" />
            <span className="text-[11px] font-semibold text-[#2a1f17]">Claude Code</span>
            <span className="text-[9px] text-[#a89883] ml-1">from scratch</span>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6b5a4a] mb-2">
            What it taught me
          </p>
          <p className="text-[13px] leading-relaxed text-[#6b5a4a]">
            OKLCH is worth the pain. Six tokens done right beat fifty that
            nobody uses. And Claude writes its best code when you&apos;ve
            already decided the shape of the output before you prompt.
          </p>
        </div>

        <div className="mt-6">
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6b5a4a] mb-2">
            Stack
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[
              "Next.js",
              "TypeScript",
              "OKLCH / culori",
              "Zod",
              "Claude SDK",
              "Figma API",
            ].map((s) => (
              <span
                key={s}
                className="text-[10px] px-2 py-0.5 rounded border border-[#3d2f2322] text-[#6b5a4a] bg-white"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div
          className="mt-6 p-3 rounded-xl text-xs text-white leading-relaxed transition-colors"
          style={{ background: seed.primary }}
        >
          Zero shadcn. Zero generic AI feel. Every system custom-tuned, with
          a brand family that hangs together.
        </div>

        <div className="mt-6 space-y-2">
          <a
            href="https://mochi-plum.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between rounded-xl text-white px-4 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: seed.primary }}
          >
            <span>Open live app</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href="https://github.com/haider0072/mochi"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-xl border border-[#3d2f2322] px-4 py-2.5 text-xs text-[#6b5a4a] hover:bg-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <GithubLogo size={14} />
              View on GitHub
            </span>
            <span>↗</span>
          </a>
        </div>
      </aside>

      {/* Main — tabbed */}
      <section className="flex flex-col overflow-hidden">
        <nav className="h-14 border-b border-[#3d2f2315] flex items-center px-6 gap-1 shrink-0">
          <MochiTabBtn id="generate" tab={tab} setTab={setTab} seed={seed}>
            Generate
          </MochiTabBtn>
          <MochiTabBtn id="components" tab={tab} setTab={setTab} seed={seed}>
            Components
          </MochiTabBtn>
          <MochiTabBtn id="code" tab={tab} setTab={setTab} seed={seed}>
            Code
          </MochiTabBtn>
          <MochiTabBtn id="figma" tab={tab} setTab={setTab} seed={seed}>
            Figma
          </MochiTabBtn>
          <div className="ml-auto flex items-center gap-2 mr-14">
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6b5a4a]">
              Seed
            </p>
            <div className="flex gap-1">
              {SEEDS.map((s, i) => (
                <button
                  key={s.name}
                  onClick={() => setSeedIdx(i)}
                  className={cn(
                    "h-5 w-5 rounded-full transition-all",
                    seedIdx === i
                      ? "ring-2 ring-offset-2 ring-offset-[#fdfbf5] scale-110"
                      : "opacity-70 hover:opacity-100",
                  )}
                  style={{
                    background: s.primary,
                    boxShadow:
                      seedIdx === i
                        ? `0 0 0 2px ${s.primary}`
                        : undefined,
                  }}
                  title={s.name}
                />
              ))}
            </div>
          </div>
        </nav>

        <div className="flex-1 overflow-y-auto">
          {tab === "generate" && <GenerateTab seed={seed} setSeedIdx={setSeedIdx} />}
          {tab === "components" && <ComponentsTab seed={seed} />}
          {tab === "code" && <CodeTab seed={seed} />}
          {tab === "figma" && <FigmaTab seed={seed} />}
        </div>
      </section>
    </div>
  );
}

function MochiTabBtn({
  id,
  tab,
  setTab,
  seed,
  children,
}: {
  id: MochiTab;
  tab: MochiTab;
  setTab: (t: MochiTab) => void;
  seed: (typeof SEEDS)[number];
  children: React.ReactNode;
}) {
  const active = tab === id;
  return (
    <button
      onClick={() => setTab(id)}
      className={cn(
        "h-9 px-3.5 rounded-md text-xs font-medium transition-colors",
        active
          ? "text-white"
          : "text-[#6b5a4a] hover:text-[#2a1f17] hover:bg-[#3d2f2308]",
      )}
      style={active ? { background: seed.primary } : undefined}
    >
      {children}
    </button>
  );
}

// ---------- Tabs ----------

const TYPING_STEPS = [
  "A warm, friendly design system for a kids' reading app",
  "A zen-minimal system for a meditation app",
  "A bold fintech system for a crypto wallet",
];

function GenerateTab({
  seed,
  setSeedIdx,
}: {
  seed: (typeof SEEDS)[number];
  setSeedIdx: (i: number) => void;
}) {
  const [typed, setTyped] = useState("");
  const [promptIdx, setPromptIdx] = useState(0);
  const [stage, setStage] = useState<"prompt" | "thinking" | "done">("prompt");
  const palette = scale(seed.primary);

  useEffect(() => {
    if (stage !== "prompt") return;
    const target = TYPING_STEPS[promptIdx];
    if (typed.length < target.length) {
      const id = setTimeout(
        () => setTyped(target.slice(0, typed.length + 1)),
        40 + Math.random() * 50,
      );
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setStage("thinking"), 700);
    return () => clearTimeout(id);
  }, [typed, stage, promptIdx]);

  useEffect(() => {
    if (stage === "thinking") {
      const id = setTimeout(() => setStage("done"), 1400);
      return () => clearTimeout(id);
    }
    if (stage === "done") {
      const id = setTimeout(() => {
        setSeedIdx(Math.floor(Math.random() * 5));
        setPromptIdx((i) => (i + 1) % TYPING_STEPS.length);
        setTyped("");
        setStage("prompt");
      }, 3200);
      return () => clearTimeout(id);
    }
  }, [stage, setSeedIdx]);

  return (
    <div className="p-8 space-y-5">
      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6b5a4a] mb-2">
          Your prompt
        </p>
        <div
          className="p-4 bg-white border-2 rounded-2xl shadow-sm"
          style={{ borderColor: seed.primary + "33" }}
        >
          <p className="text-base text-[#2a1f17] leading-relaxed font-medium min-h-[1.5em]">
            {typed}
            {stage === "prompt" && (
              <span className="inline-block w-[2px] h-[1.1em] bg-[#2a1f17] align-middle ml-0.5 animate-pulse" />
            )}
          </p>
        </div>
      </div>

      {(stage === "thinking" || stage === "done") && (
        <div className="flex items-center gap-3 text-sm">
          <Mascot thinking className="w-10 h-10 shrink-0" />
          <p className="text-[#6b5a4a]">
            {stage === "thinking" ? (
              <>Hmm, picking a seed… {seed.name}. OKLCH scale time.</>
            ) : (
              <>
                Done. Primary <span className="font-semibold text-[#2a1f17]">{seed.primary}</span>, 11 steps, chroma tapered. Brand family generated ✨
              </>
            )}
          </p>
        </div>
      )}

      {stage === "done" && (
        <div className="grid grid-cols-3 gap-4 animate-[fadeIn_0.5s_ease-out]">
          <TokenBlock label="Primary" color={seed.primary} scale={palette} />
          <TokenBlock label="Accent" color={seed.accent} scale={scale(seed.accent)} />
          <TokenBlock label="Neutral" color="#6b5a4a" scale={scale("#6b5a4a")} />
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}

function TokenBlock({
  label,
  color,
  scale,
}: {
  label: string;
  color: string;
  scale: string[];
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6b5a4a]">
          {label}
        </p>
        <span className="text-[10px] font-mono text-[#a89883]">
          {color.toUpperCase()}
        </span>
      </div>
      <div className="flex gap-[2px] rounded-md overflow-hidden">
        {scale.map((c, i) => (
          <div
            key={i}
            className="h-8 flex-1 transition-colors"
            style={{ background: c }}
            title={`${label}-${i * 100}`}
          />
        ))}
      </div>
      <p className="text-[9px] font-mono text-[#a89883] mt-1">50–950 · 11 steps</p>
    </div>
  );
}

function ComponentsTab({ seed }: { seed: (typeof SEEDS)[number] }) {
  return (
    <div className="p-8 space-y-6">
      <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6b5a4a]">
        Live components · using your tokens
      </p>

      {/* Buttons */}
      <div className="rounded-2xl bg-white border border-[#3d2f2315] p-5">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6b5a4a] mb-3">
          Button · 4 variants × 3 sizes
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            className="px-4 py-2.5 rounded-xl text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
            style={{ background: seed.primary }}
          >
            Primary
          </button>
          <button
            className="px-4 py-2.5 rounded-xl text-sm font-semibold border-2"
            style={{ borderColor: seed.primary, color: seed.primary }}
          >
            Secondary
          </button>
          <button
            className="px-4 py-2.5 rounded-xl text-sm font-semibold"
            style={{ color: seed.primary }}
          >
            Ghost
          </button>
          <button
            className="px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
            style={{ background: "#e11d48" }}
          >
            Danger
          </button>
        </div>
      </div>

      {/* Input + Badge */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white border border-[#3d2f2315] p-5">
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6b5a4a] mb-3">
            Input
          </p>
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-[#2a1f17]">Email</span>
            <input
              type="text"
              placeholder="you@example.com"
              className="w-full px-3 py-2 rounded-lg border-2 outline-none text-sm"
              style={{
                borderColor: seed.primary + "44",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = seed.primary)}
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = seed.primary + "44")
              }
            />
            <span className="text-[10px] text-[#a89883]">We won't spam, promise.</span>
          </label>
        </div>
        <div className="rounded-2xl bg-white border border-[#3d2f2315] p-5">
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6b5a4a] mb-3">
            Badge
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { text: "● New", bg: seed.primary + "22", color: seed.primary },
              { text: "Warning", bg: "#f59e0b22", color: "#b45309" },
              { text: "Success", bg: "#22c55e22", color: "#15803d" },
              { text: "Pro", bg: seed.accent + "30", color: "#3d2f23" },
            ].map((b) => (
              <span
                key={b.text}
                className="px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{ background: b.bg, color: b.color }}
              >
                {b.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="rounded-2xl bg-white border border-[#3d2f2315] p-5">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6b5a4a] mb-3">
          Card
        </p>
        <div
          className="rounded-xl p-4 flex items-center gap-3 border-2"
          style={{
            background: seed.primary + "0d",
            borderColor: seed.primary + "22",
          }}
        >
          <Mascot className="w-12 h-12 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#2a1f17]">Hi, I'm {seed.name}</p>
            <p className="text-xs text-[#6b5a4a]">
              Your new design system is ready. Drop these tokens into your
              project and keep shipping.
            </p>
          </div>
          <button
            className="text-xs font-semibold px-3 py-1.5 rounded-full text-white shrink-0"
            style={{ background: seed.primary }}
          >
            Use →
          </button>
        </div>
      </div>

      {/* Modal preview */}
      <div className="rounded-2xl bg-white border border-[#3d2f2315] p-5">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6b5a4a] mb-3">
          Modal · preview
        </p>
        <div className="rounded-xl bg-[#3d2f23] p-6 relative overflow-hidden">
          <div className="bg-white rounded-xl p-5 max-w-sm">
            <p className="font-bold text-[#2a1f17] mb-1">Confirm action</p>
            <p className="text-xs text-[#6b5a4a] mb-4">
              This will overwrite the current theme tokens with your new
              generation. Continue?
            </p>
            <div className="flex gap-2 justify-end">
              <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#6b5a4a] hover:bg-[#3d2f230a]">
                Cancel
              </button>
              <button
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                style={{ background: seed.primary }}
              >
                Overwrite
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CodeTab({ seed }: { seed: (typeof SEEDS)[number] }) {
  const [framework, setFramework] = useState<"react" | "vue" | "css">("react");

  const code = {
    react: `// Button.tsx (generated)
import { cn } from '@/lib/cn';

export function Button({ children, variant = 'primary' }) {
  return (
    <button
      className={cn(
        'px-4 py-2.5 rounded-xl text-sm font-semibold',
        variant === 'primary' && 'bg-primary text-white',
        variant === 'secondary' && 'border-2 border-primary text-primary',
      )}
    >
      {children}
    </button>
  );
}`,
    vue: `<!-- Button.vue (generated) -->
<template>
  <button
    :class="[
      'px-4 py-2.5 rounded-xl text-sm font-semibold',
      variant === 'primary' && 'bg-primary text-white',
      variant === 'secondary' && 'border-2 border-primary text-primary',
    ]"
  >
    <slot />
  </button>
</template>`,
    css: `/* tokens.css (generated) */
:root {
  --primary-500: ${seed.primary};
  --primary-600: ${seed.primary}dd;
  --accent-500: ${seed.accent};
  --radius-md: 0.75rem;
  --spacing-md: 1rem;
  --font-body: 'Quicksand', ui-sans-serif;
}`,
  };

  return (
    <div className="p-8 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6b5a4a]">
          Production code · ready to paste
        </p>
        <div className="flex gap-1 bg-white border border-[#3d2f2315] rounded-lg p-0.5">
          {(["react", "vue", "css"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFramework(f)}
              className={cn(
                "px-3 py-1 rounded-md text-[11px] font-semibold transition-colors",
                framework === f
                  ? "text-white"
                  : "text-[#6b5a4a] hover:bg-[#3d2f2308]",
              )}
              style={
                framework === f ? { background: seed.primary } : undefined
              }
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-[#1a1410] text-[#f4ece0] p-5 overflow-x-auto">
        <pre
          className="text-[12px] leading-relaxed"
          style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
        >
          {code[framework]}
        </pre>
      </div>

      <div className="flex items-center gap-3 text-xs text-[#6b5a4a]">
        <button
          className="px-3 py-1.5 rounded-md text-white text-xs font-semibold"
          style={{ background: seed.primary }}
        >
          Copy code
        </button>
        <button className="px-3 py-1.5 rounded-md border border-[#3d2f2322] text-xs font-semibold">
          Download ZIP
        </button>
        <span>Fully typed · zero runtime deps beyond React/Vue.</span>
      </div>
    </div>
  );
}

function FigmaTab({ seed }: { seed: (typeof SEEDS)[number] }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s >= 3 ? 0 : s + 1)), 1400);
    return () => clearInterval(id);
  }, []);

  const steps = [
    "Opening Mochi plugin in Figma…",
    "Pushing color tokens · 33 variables",
    "Pushing typography tokens · 6 text styles",
    "Components published to library ✓",
  ];

  return (
    <div className="p-8">
      <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6b5a4a] mb-3">
        Figma plugin · export your tokens
      </p>
      <h3 className="font-serif text-2xl tracking-tight text-[#2a1f17] mb-5">
        One click. Mochi to Figma.
      </h3>

      <div className="rounded-2xl bg-white border border-[#3d2f2315] overflow-hidden">
        {/* Faux Figma header */}
        <div className="bg-[#2a2a2a] text-white px-4 py-2 flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="flex items-center gap-2 text-xs font-mono opacity-80 ml-2">
            <FigmaLogo size={12} />
            figma.com · Mochi plugin
          </span>
        </div>

        <div className="p-6 bg-[#f8f8f8]">
          <div className="rounded-xl bg-white p-5 border border-[#e5e5e5]">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="h-8 w-8 rounded-md flex items-center justify-center"
                style={{ background: seed.primary }}
              >
                <Mascot className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2a1f17]">Mochi</p>
                <p className="text-[10px] text-[#6b5a4a]">
                  Push design system to Figma
                </p>
              </div>
              <span
                className="ml-auto text-[10px] px-2 py-1 rounded-full text-white font-semibold"
                style={{ background: seed.primary }}
              >
                connected
              </span>
            </div>

            <div className="space-y-2">
              {steps.map((s, i) => (
                <div
                  key={s}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg text-xs transition-colors",
                    i === step && "bg-[#f0f0f0]",
                    i < step && "opacity-60",
                  )}
                >
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full flex items-center justify-center shrink-0",
                      i < step
                        ? "text-white"
                        : i === step
                          ? "text-white"
                          : "border-2 border-[#d4d4d4]",
                    )}
                    style={
                      i <= step
                        ? { background: seed.primary }
                        : undefined
                    }
                  >
                    {i < step && "✓"}
                    {i === step && (
                      <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                    )}
                  </div>
                  <span className="text-[#2a1f17]">{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2">
            {scale(seed.primary)
              .slice(2, 10)
              .map((c, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-md border border-[#e5e5e5]"
                  style={{ background: c }}
                />
              ))}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-[#6b5a4a] mt-4">
        Tokens land as Figma variables, components as a published library, so
        your designers and engineers share a single source of truth.
      </p>
    </div>
  );
}
