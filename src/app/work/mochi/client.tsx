"use client";

import { useMemo, useState } from "react";
import {
  STEPS,
  generateOklchScale,
  generateBrandFamily,
  isValidHex,
  readableOn,
} from "@/lib/mochi/oklch";

// Mochi surface tokens, pulled from the real app (src/app/globals.css
// and tailwind mint/sand scales). These keep the page feeling like
// it is Mochi, not "a page about Mochi".
const SURF = {
  paper: "#fdfbf5", // sand-50
  surface: "#f5f0e4", // sand-100
  ink: "#2a1f17", // sand-900
  inkSoft: "#6b5a4a", // sand-500
  muted: "#a89883", // sand-400
  border: "#3d2f2322",
  divider: "#3d2f2315",
  mint: "#4CAF77",
  mintDeep: "#2a6b49",
  mintSoft: "#d8f0e3",
};

const SEEDS = [
  { name: "Matcha", hex: "#4CAF77" },
  { name: "Sakura", hex: "#E91E63" },
  { name: "Yuzu", hex: "#F59E0B" },
  { name: "Nori", hex: "#0EA5E9" },
  { name: "Wasabi", hex: "#84CC16" },
  { name: "Lavender", hex: "#8B5CF6" },
];

export function MochiCaseStudy() {
  const [seedIdx, setSeedIdx] = useState(0);
  const [customHex, setCustomHex] = useState(SEEDS[0].hex);
  const seed =
    isValidHex(customHex) && !SEEDS.find((s) => s.hex === customHex)
      ? { name: "Custom", hex: customHex }
      : SEEDS[seedIdx];

  const family = useMemo(() => generateBrandFamily(seed.hex), [seed.hex]);
  const primaryScale = useMemo(() => generateOklchScale(family.primary), [
    family.primary,
  ]);
  const secondaryScale = useMemo(
    () => generateOklchScale(family.secondary),
    [family.secondary]
  );
  const accentScale = useMemo(() => generateOklchScale(family.accent), [
    family.accent,
  ]);

  return (
    <div className="pt-14 pb-12">
      <Hero />
      <Opinion />
      <Demo
        seedIdx={seedIdx}
        setSeedIdx={(i) => {
          setSeedIdx(i);
          setCustomHex(SEEDS[i].hex);
        }}
        customHex={customHex}
        setCustomHex={setCustomHex}
        seed={seed}
        primaryScale={primaryScale}
        secondaryScale={secondaryScale}
        accentScale={accentScale}
        family={family}
      />
      <Components scale={primaryScale} accent={family.accent} seedName={seed.name} />
      <TokenOutput
        primary={primaryScale}
        secondary={secondaryScale}
        accent={accentScale}
      />
      <TechStack />
      <Outcome />
    </div>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="max-w-[1080px] mx-auto px-6 pt-10 pb-14 grid grid-cols-[1.2fr_1fr] gap-12 items-end">
      <div>
        <p
          className="text-[11px] font-mono uppercase tracking-[0.22em]"
          style={{ color: SURF.inkSoft }}
        >
          2026 · solo build · 4 weeks
        </p>
        <h1
          className="mt-4 text-[72px] leading-[0.95] font-semibold tracking-tight"
          style={{ color: SURF.ink, fontFamily: "var(--font-fraunces)" }}
        >
          Design systems,
          <br />
          <span style={{ color: SURF.mint, fontStyle: "italic" }}>
            made with love.
          </span>
        </h1>
        <p
          className="mt-6 text-[17px] leading-relaxed max-w-[520px]"
          style={{ color: SURF.inkSoft, fontFamily: "var(--font-inter)" }}
        >
          Mochi is a design-system generator. One prompt, one complete
          production-grade system — coded tokens, React + Vue components,
          and a Figma file you can actually use. Every palette is
          perceptually uniform, nothing is shadcn-default.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="https://mochi-plum.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="h-11 px-5 rounded-full text-[13px] font-semibold text-white flex items-center gap-2 transition-all hover:-translate-y-[1px]"
            style={{
              background: SURF.mint,
              boxShadow: `0 10px 24px -10px ${SURF.mint}99`,
              fontFamily: "var(--font-inter)",
            }}
          >
            Open the live app →
          </a>
          <a
            href="https://github.com/haider0072"
            target="_blank"
            rel="noreferrer"
            className="h-11 px-5 rounded-full text-[13px] font-semibold flex items-center gap-2"
            style={{
              background: "#fff",
              border: `1px solid ${SURF.border}`,
              color: SURF.ink,
              fontFamily: "var(--font-inter)",
            }}
          >
            View on GitHub
          </a>
        </div>
      </div>

      <Mascot />
    </section>
  );
}

function Mascot() {
  return (
    <div className="relative h-[280px]">
      <svg
        viewBox="0 0 300 280"
        className="w-full h-full"
        aria-label="Mochi mascot"
      >
        <defs>
          <radialGradient id="mochi-body" cx="50%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f0e8df" />
          </radialGradient>
          <filter id="mochi-shadow">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>
        <ellipse
          cx="150"
          cy="245"
          rx="90"
          ry="10"
          fill="#3d2f23"
          opacity="0.08"
          filter="url(#mochi-shadow)"
        />
        <ellipse
          cx="150"
          cy="148"
          rx="110"
          ry="98"
          fill="url(#mochi-body)"
          stroke="#3d2f23"
          strokeWidth="1.5"
        />
        <ellipse cx="115" cy="140" rx="7" ry="9" fill="#3d2f23">
          <animate
            attributeName="ry"
            values="9;0.7;9;9;9"
            keyTimes="0;0.05;0.1;0.8;1"
            dur="5s"
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse cx="185" cy="140" rx="7" ry="9" fill="#3d2f23">
          <animate
            attributeName="ry"
            values="9;0.7;9;9;9"
            keyTimes="0;0.05;0.1;0.8;1"
            dur="5s"
            repeatCount="indefinite"
          />
        </ellipse>
        <circle cx="100" cy="160" r="10" fill="#FFB6C1" opacity="0.55" />
        <circle cx="200" cy="160" r="10" fill="#FFB6C1" opacity="0.55" />
        <path
          d="M 130 172 Q 150 192 170 172"
          stroke="#3d2f23"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Floating tokens */}
        <g opacity="0.85">
          <circle cx="250" cy="70" r="10" fill="#4CAF77">
            <animate attributeName="cy" values="70;60;70" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="55" cy="90" r="8" fill="#E91E63" opacity="0.7">
            <animate attributeName="cy" values="90;82;90" dur="2.6s" repeatCount="indefinite" />
          </circle>
          <rect x="240" y="200" width="18" height="18" rx="5" fill="#F59E0B" opacity="0.8">
            <animate attributeName="y" values="200;190;200" dur="3.2s" repeatCount="indefinite" />
          </rect>
        </g>
      </svg>
    </div>
  );
}

// ─── OPINION ─────────────────────────────────────────────────────────

function Opinion() {
  return (
    <section className="max-w-[1080px] mx-auto px-6 py-10 grid grid-cols-[1fr_2fr] gap-10 items-start">
      <p
        className="text-[11px] font-mono uppercase tracking-[0.22em]"
        style={{ color: SURF.muted }}
      >
        The opinion
      </p>
      <div className="max-w-[640px]">
        <h2
          className="text-[30px] font-semibold leading-tight tracking-tight"
          style={{ color: SURF.ink, fontFamily: "var(--font-fraunces)" }}
        >
          AI-built apps all look the same because the tokens are an
          afterthought.
        </h2>
        <p
          className="mt-4 text-[15px] leading-[1.65]"
          style={{ color: SURF.inkSoft, fontFamily: "var(--font-inter)" }}
        >
          I work in Claude Code every day. My own projects felt
          intentional because I set design guidelines before prompting.
          Everyone else&apos;s AI-built apps kept looking the same —
          generic, shadcn-default, no soul. Mochi is the tool I wanted:
          one prompt, one design system you can actually ship with.
        </p>
        <p
          className="mt-3 text-[15px] leading-[1.65]"
          style={{ color: SURF.inkSoft, fontFamily: "var(--font-inter)" }}
        >
          Six tokens done right beat fifty that nobody uses. And Claude
          writes its best code when you&apos;ve already decided the
          shape of the output before you prompt.
        </p>
      </div>
    </section>
  );
}

// ─── DEMO ────────────────────────────────────────────────────────────

function Demo({
  seedIdx,
  setSeedIdx,
  customHex,
  setCustomHex,
  seed,
  primaryScale,
  secondaryScale,
  accentScale,
  family,
}: {
  seedIdx: number;
  setSeedIdx: (i: number) => void;
  customHex: string;
  setCustomHex: (h: string) => void;
  seed: { name: string; hex: string };
  primaryScale: Record<number, string>;
  secondaryScale: Record<number, string>;
  accentScale: Record<number, string>;
  family: { primary: string; secondary: string; accent: string };
}) {
  return (
    <section className="max-w-[1080px] mx-auto px-6 py-10">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
        <div>
          <p
            className="text-[11px] font-mono uppercase tracking-[0.22em]"
            style={{ color: SURF.muted }}
          >
            Live · the real OKLCH engine
          </p>
          <h2
            className="mt-1 text-[30px] font-semibold leading-tight tracking-tight"
            style={{ color: SURF.ink, fontFamily: "var(--font-fraunces)" }}
          >
            One seed. Eleven steps. Every step perceptually equidistant.
          </h2>
        </div>
        <p
          className="text-[12px] font-mono"
          style={{ color: SURF.muted }}
        >
          Ported from src/lib/tokens/colorGeneration.ts
        </p>
      </div>

      {/* Seed picker */}
      <div
        className="rounded-[20px] p-5"
        style={{
          background: "#fff",
          border: `1px solid ${SURF.border}`,
          boxShadow: "0 20px 44px -28px rgba(61,47,35,0.12)",
        }}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <p
            className="text-[11px] font-mono uppercase tracking-[0.22em]"
            style={{ color: SURF.muted }}
          >
            Seed
          </p>
          <div className="flex items-center gap-1.5 flex-wrap">
            {SEEDS.map((s, i) => {
              const active = seedIdx === i && customHex === s.hex;
              return (
                <button
                  key={s.name}
                  onClick={() => setSeedIdx(i)}
                  className="h-8 px-2.5 rounded-full text-[11.5px] flex items-center gap-1.5 transition-all"
                  style={{
                    background: active ? s.hex + "22" : "transparent",
                    border: `1px solid ${active ? s.hex : SURF.border}`,
                    color: SURF.ink,
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: s.hex }}
                  />
                  {s.name}
                </button>
              );
            })}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <label
              className="text-[11px] font-mono"
              style={{ color: SURF.muted }}
            >
              hex
            </label>
            <input
              type="text"
              value={customHex}
              onChange={(e) => setCustomHex(e.target.value)}
              className="h-8 w-24 px-2.5 text-[12px] rounded-lg outline-none"
              style={{
                background: SURF.surface,
                border: `1px solid ${isValidHex(customHex) ? SURF.mint : SURF.border}`,
                color: SURF.ink,
                fontFamily: "var(--font-jetbrains)",
              }}
              maxLength={7}
            />
            <input
              type="color"
              value={customHex}
              onChange={(e) => setCustomHex(e.target.value)}
              className="h-8 w-8 rounded-lg overflow-hidden cursor-pointer"
              style={{ border: `1px solid ${SURF.border}` }}
              aria-label="Pick color"
            />
          </div>
        </div>

        {/* 11-step scale */}
        <ScaleRow label="primary" scale={primaryScale} />
        <ScaleRow label="secondary" scale={secondaryScale} hint="-40% chroma" />
        <ScaleRow label="accent" scale={accentScale} hint="+15° hue · +15% chroma" />

        {/* Family swatches */}
        <div
          className="mt-6 pt-5 grid grid-cols-3 gap-3"
          style={{ borderTop: `1px solid ${SURF.divider}` }}
        >
          <FamilyTile label="primary" hex={family.primary} note="Brand, CTA, interactive" />
          <FamilyTile label="secondary" hex={family.secondary} note="Subtle backgrounds, cards, dividers" />
          <FamilyTile label="accent" hex={family.accent} note="Links, focus, highlights" />
        </div>

        <p
          className="mt-5 text-[12px] leading-relaxed"
          style={{ color: SURF.inkSoft, fontFamily: "var(--font-inter)" }}
        >
          <span className="font-semibold" style={{ color: SURF.ink }}>
            Real products don&apos;t use derived secondaries via hue rotation.
          </span>{" "}
          They use one brand color plus tonal variants. Mochi bakes that
          opinion into the math — secondary drops chroma 40%, accent
          shifts hue 15° and boosts chroma 15%. You get one cohesive
          family, not a rainbow.
        </p>
      </div>
    </section>
  );
}

function ScaleRow({
  label,
  scale,
  hint,
}: {
  label: string;
  scale: Record<number, string>;
  hint?: string;
}) {
  return (
    <div className="mt-5">
      <div className="flex items-baseline justify-between mb-2">
        <p
          className="text-[10px] font-mono uppercase tracking-[0.22em]"
          style={{ color: SURF.muted }}
        >
          {label}
        </p>
        {hint && (
          <p
            className="text-[11px] font-mono"
            style={{ color: SURF.muted }}
          >
            {hint}
          </p>
        )}
      </div>
      <div
        className="grid grid-cols-11 gap-[2px] rounded-xl overflow-hidden"
      >
        {STEPS.map((step) => {
          const hex = scale[step];
          const text = readableOn(hex);
          return (
            <div
              key={step}
              className="aspect-[2/3] flex flex-col items-center justify-between py-2 transition-colors"
              style={{ background: hex }}
            >
              <span
                className="text-[9.5px] font-mono"
                style={{ color: text, opacity: 0.8 }}
              >
                {step}
              </span>
              <span
                className="text-[8.5px] font-mono"
                style={{ color: text, opacity: 0.65 }}
              >
                {hex.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FamilyTile({
  label,
  hex,
  note,
}: {
  label: string;
  hex: string;
  note: string;
}) {
  const text = readableOn(hex);
  return (
    <div
      className="rounded-xl p-3 flex flex-col gap-2"
      style={{ background: hex }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] font-mono uppercase tracking-[0.22em]"
          style={{ color: text, opacity: 0.75 }}
        >
          {label}
        </span>
        <span
          className="text-[10px] font-mono"
          style={{ color: text, opacity: 0.75 }}
        >
          {hex.toUpperCase()}
        </span>
      </div>
      <p
        className="text-[11.5px] leading-snug"
        style={{ color: text, opacity: 0.9, fontFamily: "var(--font-inter)" }}
      >
        {note}
      </p>
    </div>
  );
}

// ─── COMPONENTS PREVIEW ──────────────────────────────────────────────

function Components({
  scale,
  accent,
  seedName,
}: {
  scale: Record<number, string>;
  accent: string;
  seedName: string;
}) {
  return (
    <section className="max-w-[1080px] mx-auto px-6 py-10">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
        <div>
          <p
            className="text-[11px] font-mono uppercase tracking-[0.22em]"
            style={{ color: SURF.muted }}
          >
            Live · components use the generated scale
          </p>
          <h2
            className="mt-1 text-[30px] font-semibold leading-tight tracking-tight"
            style={{ color: SURF.ink, fontFamily: "var(--font-fraunces)" }}
          >
            The same scale ships React, Vue, and Figma.
          </h2>
        </div>
      </div>

      <div
        className="rounded-[20px] p-8 grid grid-cols-[1fr_1fr] gap-8"
        style={{
          background: scale[50],
          border: `1px solid ${SURF.border}`,
        }}
      >
        {/* Left: buttons + badges */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <MochiButton variant="primary" scale={scale}>
              Primary
            </MochiButton>
            <MochiButton variant="secondary" scale={scale}>
              Secondary
            </MochiButton>
            <MochiButton variant="ghost" scale={scale}>
              Ghost
            </MochiButton>
          </div>
          <div className="flex flex-wrap gap-2">
            <MochiBadge scale={scale}>Default</MochiBadge>
            <MochiBadge scale={scale} variant="soft">
              {seedName}
            </MochiBadge>
            <MochiBadge scale={scale} variant="solid">
              Active
            </MochiBadge>
          </div>
          <MochiInput scale={scale} />
        </div>

        {/* Right: card */}
        <MochiCard scale={scale} accent={accent} seedName={seedName} />
      </div>
    </section>
  );
}

function MochiButton({
  variant,
  scale,
  children,
}: {
  variant: "primary" | "secondary" | "ghost";
  scale: Record<number, string>;
  children: React.ReactNode;
}) {
  const styles =
    variant === "primary"
      ? { background: scale[500], color: "#fff", border: "none" }
      : variant === "secondary"
        ? {
            background: scale[50],
            color: scale[700],
            border: `1px solid ${scale[200]}`,
          }
        : { background: "transparent", color: SURF.inkSoft, border: "none" };
  return (
    <button
      className="h-10 px-5 rounded-[12px] text-[13px] font-semibold transition-all hover:-translate-y-[1px]"
      style={{
        ...styles,
        fontFamily: "var(--font-inter)",
        boxShadow:
          variant === "primary"
            ? `0 8px 18px -10px ${scale[500]}aa`
            : "none",
      }}
    >
      {children}
    </button>
  );
}

function MochiBadge({
  variant = "outline",
  scale,
  children,
}: {
  variant?: "outline" | "soft" | "solid";
  scale: Record<number, string>;
  children: React.ReactNode;
}) {
  const styles =
    variant === "solid"
      ? { background: scale[500], color: "#fff", border: "none" }
      : variant === "soft"
        ? {
            background: scale[100],
            color: scale[800],
            border: `1px solid ${scale[200]}`,
          }
        : {
            background: "#fff",
            color: SURF.inkSoft,
            border: `1px solid ${SURF.border}`,
          };
  return (
    <span
      className="h-7 px-2.5 rounded-full text-[11.5px] font-medium inline-flex items-center gap-1.5"
      style={{ ...styles, fontFamily: "var(--font-inter)" }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: variant === "solid" ? "#fff" : scale[500] }}
      />
      {children}
    </span>
  );
}

function MochiInput({ scale }: { scale: Record<number, string> }) {
  return (
    <div
      className="rounded-[12px] px-4 py-2.5 flex items-center gap-2"
      style={{
        background: "#fff",
        border: `1.5px solid ${scale[500]}`,
        boxShadow: `0 0 0 3px ${scale[500]}1a`,
      }}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ background: scale[500] }}
      />
      <span
        className="text-[13px]"
        style={{ color: SURF.inkSoft, fontFamily: "var(--font-inter)" }}
      >
        input with primary focus ring
      </span>
    </div>
  );
}

function MochiCard({
  scale,
  accent,
  seedName,
}: {
  scale: Record<number, string>;
  accent: string;
  seedName: string;
}) {
  return (
    <div
      className="rounded-[16px] p-5 flex flex-col gap-3"
      style={{
        background: "#fff",
        border: `1px solid ${scale[200]}`,
        boxShadow: "0 18px 44px -28px rgba(61,47,35,0.18)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-[10px] flex items-center justify-center text-white text-[14px]"
            style={{
              background: `linear-gradient(135deg, ${scale[400]}, ${scale[600]})`,
            }}
          >
            🍡
          </div>
          <p
            className="text-[14px] font-semibold"
            style={{ color: SURF.ink, fontFamily: "var(--font-inter)" }}
          >
            {seedName} system
          </p>
        </div>
        <span
          className="h-6 px-2 rounded-full text-[10px] font-mono"
          style={{
            background: scale[100],
            color: scale[800],
            border: `1px solid ${scale[200]}`,
          }}
        >
          v1.0
        </span>
      </div>
      <p
        className="text-[12.5px] leading-relaxed"
        style={{ color: SURF.inkSoft, fontFamily: "var(--font-inter)" }}
      >
        A generated design system. Tokens, components, and a Figma file
        in one prompt — all sharing the same scale.
      </p>
      <div
        className="mt-1 rounded-lg overflow-hidden flex"
      >
        {[scale[300], scale[500], scale[700], scale[900], accent].map((c, i) => (
          <div
            key={i}
            className="h-4 flex-1"
            style={{ background: c }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 pt-1">
        <button
          className="h-8 px-3 rounded-lg text-[12px] font-semibold text-white"
          style={{
            background: scale[600],
            fontFamily: "var(--font-inter)",
          }}
        >
          Export
        </button>
        <button
          className="h-8 px-3 rounded-lg text-[12px] font-medium"
          style={{
            background: scale[50],
            color: scale[800],
            border: `1px solid ${scale[200]}`,
            fontFamily: "var(--font-inter)",
          }}
        >
          Figma
        </button>
      </div>
    </div>
  );
}

// ─── TOKEN OUTPUT ────────────────────────────────────────────────────

function TokenOutput({
  primary,
  secondary,
  accent,
}: {
  primary: Record<number, string>;
  secondary: Record<number, string>;
  accent: Record<number, string>;
}) {
  const [tab, setTab] = useState<"css" | "json" | "tailwind">("css");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    if (tab === "css") {
      const lines: string[] = [":root {"];
      STEPS.forEach((s) => lines.push(`  --primary-${s}: ${primary[s]};`));
      STEPS.forEach((s) => lines.push(`  --secondary-${s}: ${secondary[s]};`));
      STEPS.forEach((s) => lines.push(`  --accent-${s}: ${accent[s]};`));
      lines.push("}");
      return lines.join("\n");
    }
    if (tab === "json") {
      return JSON.stringify(
        {
          primary,
          secondary,
          accent,
        },
        null,
        2
      );
    }
    // tailwind
    return (
      "theme: {\n  extend: {\n    colors: {\n" +
      ["primary", "secondary", "accent"]
        .map((name, idx) => {
          const scale = [primary, secondary, accent][idx];
          const body = STEPS.map((s) => `        ${s}: '${scale[s]}'`).join(",\n");
          return `      ${name}: {\n${body}\n      }`;
        })
        .join(",\n") +
      ",\n    },\n  },\n},"
    );
  }, [tab, primary, secondary, accent]);

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="max-w-[1080px] mx-auto px-6 py-10">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
        <div>
          <p
            className="text-[11px] font-mono uppercase tracking-[0.22em]"
            style={{ color: SURF.muted }}
          >
            Ship · what Mochi actually outputs
          </p>
          <h2
            className="mt-1 text-[30px] font-semibold leading-tight tracking-tight"
            style={{ color: SURF.ink, fontFamily: "var(--font-fraunces)" }}
          >
            Your tokens, in whatever format your stack speaks.
          </h2>
        </div>
      </div>

      <div
        className="rounded-[20px] overflow-hidden"
        style={{
          background: "#1e1b18",
          border: `1px solid ${SURF.border}`,
        }}
      >
        <div className="flex items-center justify-between px-4 h-11 border-b border-white/10">
          <div className="flex items-center gap-1">
            {(["css", "json", "tailwind"] as const).map((t) => {
              const active = tab === t;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="h-7 px-3 rounded-md text-[11px] font-mono uppercase tracking-[0.18em] transition-colors"
                  style={{
                    background: active ? SURF.mint : "transparent",
                    color: active ? "#fff" : "rgba(255,255,255,0.55)",
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>
          <button
            onClick={copy}
            className="h-7 px-3 rounded-md text-[11px] font-mono uppercase tracking-[0.18em]"
            style={{
              background: copied ? SURF.mint : "rgba(255,255,255,0.08)",
              color: copied ? "#fff" : "rgba(255,255,255,0.7)",
            }}
          >
            {copied ? "copied ✓" : "copy"}
          </button>
        </div>
        <pre
          className="text-[12px] leading-[1.65] p-5 overflow-x-auto max-h-[320px]"
          style={{
            color: "#f0e8df",
            fontFamily: "var(--font-jetbrains)",
          }}
        >
          {output}
        </pre>
      </div>
    </section>
  );
}

// ─── TECH STACK ──────────────────────────────────────────────────────

function TechStack() {
  const items = [
    { label: "Next.js 16", note: "App Router, server components, edge-ready" },
    { label: "TypeScript", note: "Strict, no any, zod-validated AI output" },
    { label: "culori", note: "OKLCH math — perceptually uniform scales" },
    { label: "Tailwind", note: "Emitted tokens ship directly into config" },
    { label: "Claude Code", note: "Entire build, from empty repo to production" },
    { label: "Figma API", note: "One-click sync of tokens + components" },
  ];
  return (
    <section className="max-w-[1080px] mx-auto px-6 py-10 grid grid-cols-[1fr_2fr] gap-10 items-start">
      <p
        className="text-[11px] font-mono uppercase tracking-[0.22em]"
        style={{ color: SURF.muted }}
      >
        Under the hood
      </p>
      <div className="grid grid-cols-2 gap-3">
        {items.map((i) => (
          <div
            key={i.label}
            className="rounded-xl p-4"
            style={{
              background: "#fff",
              border: `1px solid ${SURF.border}`,
            }}
          >
            <p
              className="text-[13px] font-semibold"
              style={{ color: SURF.ink, fontFamily: "var(--font-inter)" }}
            >
              {i.label}
            </p>
            <p
              className="mt-1 text-[12px]"
              style={{ color: SURF.inkSoft, fontFamily: "var(--font-inter)" }}
            >
              {i.note}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── OUTCOME ─────────────────────────────────────────────────────────

function Outcome() {
  const notes = [
    {
      head: "OKLCH is worth the pain.",
      body: "RGB and HSL scales feel muddy at the edges. OKLCH makes every step equally loud — designers stop hand-tweaking and ship.",
    },
    {
      head: "Six tokens > fifty.",
      body: "Primary, secondary, accent, neutral, semantic set. If a variable isn't earning its keep, it dies. Systems used are systems loved.",
    },
    {
      head: "Decide the output before you prompt.",
      body: "Claude writes its best code when the shape is fixed. Schemas, zod, types — whole categories of errors never happen.",
    },
  ];
  return (
    <section className="max-w-[1080px] mx-auto px-6 py-10 grid grid-cols-[1fr_2fr] gap-10 items-start">
      <p
        className="text-[11px] font-mono uppercase tracking-[0.22em]"
        style={{ color: SURF.muted }}
      >
        What it taught me
      </p>
      <div className="space-y-5">
        {notes.map((n) => (
          <div key={n.head}>
            <p
              className="text-[18px] font-semibold tracking-tight"
              style={{ color: SURF.ink, fontFamily: "var(--font-fraunces)" }}
            >
              {n.head}
            </p>
            <p
              className="mt-1.5 text-[14.5px] leading-relaxed"
              style={{ color: SURF.inkSoft, fontFamily: "var(--font-inter)" }}
            >
              {n.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
