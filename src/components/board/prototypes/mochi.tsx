"use client";

import { useEffect, useRef, useState } from "react";
import type { CardActivity } from "../use-card-activity";
import { ProjectFrame } from "../project-frame";
import { FocusModal } from "../focus-modal";
import { cn } from "@/lib/cn";

// Mint-family brand seeds — the core of Mochi's V3 color approach.
// primary = brand, secondary = same hue desat, accent = +15° hue boosted.
const SEEDS = [
  { name: "Matcha", primary: "#4CAF77", accent: "#4CAF9E", label: "mint fresh" },
  { name: "Sakura", primary: "#E91E63", accent: "#E9891E", label: "playful warm" },
  { name: "Yuzu", primary: "#F59E0B", accent: "#F5D80B", label: "citrus bright" },
  { name: "Nori", primary: "#0EA5E9", accent: "#0EE9A5", label: "calm water" },
  { name: "Wasabi", primary: "#84CC16", accent: "#C3CC16", label: "earthy crisp" },
];

// 11-step OKLCH scale for a given seed (approximated with simple LCH lightness ramp)
function scale(hex: string): string[] {
  // Tiny OKLCH-ish ramp — we keep hue, vary lightness. For a portfolio toy.
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

// Adorable mochi mascot with blinking eyes
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
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden
    >
      {/* Body — soft squishy rice cake */}
      <defs>
        <radialGradient id="mochi-body" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f0e8df" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="58" rx="36" ry="32" fill="url(#mochi-body)" stroke="#3d2f23" strokeWidth="1.5" />
      {/* Eyes — blinking */}
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
      {/* Blush — optional */}
      {blushing && (
        <>
          <circle cx="32" cy="63" r="4" fill="#FFB6C1" opacity="0.6" />
          <circle cx="68" cy="63" r="4" fill="#FFB6C1" opacity="0.6" />
        </>
      )}
      {/* Mouth — tiny smile */}
      <path
        d="M 44 67 Q 50 71 56 67"
        stroke="#3d2f23"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Thinking bubble */}
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

  // Cycle seeds when active
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
        tagline: "AI design-system generator. Prompt → tokens → code → Figma.",
      }}
      innerClassName="bg-[#fdfbf5]"
      onOpen={onOpen}
      tape="top-left"
    >
      {/* Soft mint glow */}
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-40 blur-3xl transition-colors duration-700"
        style={{ background: seed.primary + "80" }}
      />

      {/* Mochi mascot + palette preview */}
      <div className="absolute inset-4 flex items-center gap-4">
        <div className="relative shrink-0">
          <Mascot
            blushing
            thinking={activity === "active"}
            className="w-24 h-24"
          />
          {/* tiny "generating" pulse under feet */}
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
          {/* Token swatches — 11-step scale */}
          <div className="flex gap-[2px] rounded-sm overflow-hidden">
            {palette.map((c, i) => (
              <div
                key={i}
                className="h-5 flex-1 transition-colors duration-700"
                style={{ background: c }}
              />
            ))}
          </div>
          {/* Token chips */}
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

      {/* Bottom stripe */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-[#3d2f23aa]">
        <span>Prompt → OKLCH → Code</span>
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

const TYPING_STEPS = [
  "A warm, friendly design system for a kids' reading app",
  "A zen-minimal system for a meditation app",
  "A bold fintech system for a crypto wallet",
  "A playful system for a food delivery startup",
];

const STAGES = ["prompt", "thinking", "tokens", "components", "export"] as const;
type Stage = (typeof STAGES)[number];

function MochiFocus() {
  const [seedIdx, setSeedIdx] = useState(0);
  const seed = SEEDS[seedIdx];
  const palette = scale(seed.primary);
  const [typed, setTyped] = useState("");
  const [promptIdx, setPromptIdx] = useState(0);
  const [stage, setStage] = useState<Stage>("prompt");
  const stageIdx = STAGES.indexOf(stage);
  const advanceTimer = useRef<number | null>(null);

  // Typing animation
  useEffect(() => {
    if (stage !== "prompt") return;
    const target = TYPING_STEPS[promptIdx];
    if (typed.length < target.length) {
      const id = setTimeout(
        () => setTyped(target.slice(0, typed.length + 1)),
        40 + Math.random() * 60,
      );
      return () => clearTimeout(id);
    } else {
      const id = setTimeout(() => setStage("thinking"), 900);
      return () => clearTimeout(id);
    }
  }, [typed, stage, promptIdx]);

  // Stage progression
  useEffect(() => {
    if (stage === "prompt") return;
    const delays: Record<Stage, number> = {
      prompt: 0,
      thinking: 1400,
      tokens: 2200,
      components: 2600,
      export: 3200,
    };
    const next: Record<Stage, Stage | null> = {
      prompt: "thinking",
      thinking: "tokens",
      tokens: "components",
      components: "export",
      export: null,
    };
    const id = window.setTimeout(() => {
      const n = next[stage];
      if (n) setStage(n);
      else {
        // restart with next seed + prompt
        setSeedIdx((i) => (i + 1) % SEEDS.length);
        setPromptIdx((i) => (i + 1) % TYPING_STEPS.length);
        setTyped("");
        setStage("prompt");
      }
    }, delays[stage]);
    advanceTimer.current = id;
    return () => clearTimeout(id);
  }, [stage]);

  return (
    <div
      className="w-[min(1100px,95vw)] h-[min(680px,90vh)] grid grid-cols-[340px_1fr] bg-[#fdfbf5]"
      style={{ fontFamily: "'Quicksand', ui-sans-serif, system-ui" }}
    >
      {/* Sidebar — stages */}
      <aside className="p-6 border-r border-[#3d2f2315] bg-[#f5f0e4] flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center text-white font-bold"
            style={{ background: seed.primary }}
          >
            <Mascot className="w-7 h-7" />
          </div>
          <div>
            <p className="font-bold text-lg leading-none text-[#2a1f17]">mochi</p>
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6b5a4a]">
              v1.0 · alpha
            </p>
          </div>
        </div>
        <p className="text-xs text-[#6b5a4a] leading-relaxed mt-2">
          Describe what you're building. Mochi generates tokens, components,
          docs, and a Figma file.
        </p>

        <div className="mt-6 space-y-3 flex-1">
          {STAGES.map((s, i) => {
            const active = stage === s;
            const done = i < stageIdx;
            return (
              <div
                key={s}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                  active && "bg-white shadow-sm",
                )}
                style={{
                  borderLeft: active
                    ? `3px solid ${seed.primary}`
                    : "3px solid transparent",
                }}
              >
                <div
                  className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 transition-colors"
                  style={{
                    background: done
                      ? seed.primary
                      : active
                        ? seed.primary
                        : "#d7cdbb",
                  }}
                >
                  {done ? "✓" : i + 1}
                </div>
                <div className="flex-1">
                  <p
                    className={cn(
                      "text-sm font-semibold capitalize",
                      active ? "text-[#2a1f17]" : "text-[#6b5a4a]",
                    )}
                  >
                    {s}
                  </p>
                  <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#a89883]">
                    {s === "prompt" && "describe the brand"}
                    {s === "thinking" && "picking seeds & type"}
                    {s === "tokens" && "generating OKLCH scales"}
                    {s === "components" && "rendering live preview"}
                    {s === "export" && "ZIP + Figma"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="mt-4 p-3 rounded-xl text-xs text-white leading-relaxed"
          style={{ background: seed.primary }}
        >
          Zero shadcn. Zero generic AI feel. Every system custom-tuned.
        </div>
      </aside>

      {/* Main — live preview */}
      <section className="p-8 overflow-hidden relative">
        {/* Prompt input */}
        <div className="mb-5">
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6b5a4a] mb-2">
            Your prompt
          </p>
          <div
            className="p-4 bg-white border-2 rounded-2xl shadow-sm"
            style={{ borderColor: seed.primary + "33" }}
          >
            <p className="text-base text-[#2a1f17] leading-relaxed font-medium">
              {typed}
              {stage === "prompt" && (
                <span className="inline-block w-[2px] h-[1.1em] bg-[#2a1f17] align-middle ml-0.5 animate-pulse" />
              )}
            </p>
          </div>
        </div>

        {/* Thinking */}
        {(stage === "thinking" || stage === "tokens" || stage === "components" || stage === "export") && (
          <div className="mb-5 flex items-center gap-3 text-sm">
            <Mascot thinking className="w-10 h-10" />
            <p className="text-[#6b5a4a]">
              {stage === "thinking" && (
                <>
                  hmm… picking a seed color… vibing with{" "}
                  <span className="font-semibold text-[#2a1f17]">
                    {seed.name}
                  </span>
                  .
                </>
              )}
              {stage === "tokens" && "OKLCH scale time. 11 steps, chroma tapered, brand family generating…"}
              {stage === "components" && "rendering components with your tokens…"}
              {stage === "export" && "packaged. React + Vue + Figma ready ✨"}
            </p>
          </div>
        )}

        {/* Tokens panel */}
        {(stage === "tokens" ||
          stage === "components" ||
          stage === "export") && (
          <div className="mb-5 grid grid-cols-3 gap-4">
            <TokenBlock label="Primary" color={seed.primary} scale={palette} />
            <TokenBlock
              label="Accent"
              color={seed.accent}
              scale={scale(seed.accent)}
            />
            <TokenBlock label="Neutral" color="#6b5a4a" scale={scale("#6b5a4a")} />
          </div>
        )}

        {/* Components preview */}
        {(stage === "components" || stage === "export") && (
          <div
            className="p-5 rounded-2xl bg-white border-2 shadow-sm space-y-4"
            style={{ borderColor: seed.primary + "22" }}
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6b5a4a]">
                Live components
              </p>
              {stage === "export" && (
                <a
                  className="text-[10px] font-mono uppercase tracking-[0.22em] font-semibold"
                  style={{ color: seed.primary }}
                >
                  downloaded ✓
                </a>
              )}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Button primary */}
              <button
                className="px-4 py-2.5 rounded-xl text-white text-sm font-semibold shadow-sm transition-transform hover:scale-105"
                style={{ background: seed.primary }}
              >
                Get started
              </button>
              {/* Button ghost */}
              <button
                className="px-4 py-2.5 rounded-xl text-sm font-semibold border-2"
                style={{ borderColor: seed.primary, color: seed.primary }}
              >
                Learn more
              </button>
              {/* Badge */}
              <span
                className="px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: seed.primary + "22",
                  color: seed.primary,
                }}
              >
                ● New
              </span>
              {/* Toast-like */}
              <span
                className="px-3 py-1.5 rounded-full text-xs text-white font-medium flex items-center gap-2"
                style={{ background: seed.accent }}
              >
                ✨ Tokens generated
              </span>
            </div>

            {/* Card mock */}
            <div
              className="rounded-xl p-4 flex items-center gap-3 border-2"
              style={{
                background: seed.primary + "0d",
                borderColor: seed.primary + "22",
              }}
            >
              <Mascot className="w-12 h-12" />
              <div className="flex-1">
                <p className="text-sm font-bold text-[#2a1f17]">
                  Hi, I'm {seed.name}
                </p>
                <p className="text-xs text-[#6b5a4a]">
                  Your new design system is ready. Import tokens and ship.
                </p>
              </div>
              <button
                className="text-xs font-semibold px-3 py-1.5 rounded-full text-white"
                style={{ background: seed.primary }}
              >
                Use →
              </button>
            </div>
          </div>
        )}
      </section>
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
