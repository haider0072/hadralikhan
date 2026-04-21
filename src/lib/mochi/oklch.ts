// Ported from Mochi's production colorGeneration.ts.
// Perceptually-uniform 11-step scales from a single seed hex.
// Mochi uses this for every generated design system — same math here so
// the demo on the case-study page is the real thing, not a mock.

import { oklch, formatHex, parse } from "culori";

export const STEPS = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;
export type Step = (typeof STEPS)[number];
export type ColorScale = Record<Step, string>;

const LIGHTNESS: Record<Step, number> = {
  50: 0.97,
  100: 0.93,
  200: 0.87,
  300: 0.8,
  400: 0.7,
  500: 0.62,
  600: 0.53,
  700: 0.44,
  800: 0.35,
  900: 0.25,
  950: 0.16,
};

function chromaForLightness(l: number, seedChroma: number): number {
  if (l >= 0.95) return seedChroma * 0.35;
  if (l >= 0.9) return seedChroma * 0.5;
  if (l >= 0.8) return seedChroma * 0.75;
  if (l <= 0.2) return seedChroma * 0.85;
  return seedChroma;
}

export function generateOklchScale(seedHex: string): ColorScale {
  const parsed = oklch(parse(seedHex));
  if (!parsed) throw new Error(`Invalid seed color: ${seedHex}`);
  const seedChroma = parsed.c ?? 0;
  const seedHue = parsed.h ?? 0;

  const scale = {} as ColorScale;
  for (const step of STEPS) {
    const l = LIGHTNESS[step];
    const c = chromaForLightness(l, seedChroma);
    const hex = formatHex({ mode: "oklch", l, c, h: seedHue });
    scale[step] = hex || seedHex;
  }
  return scale;
}

function wrapHue(h: number): number {
  return ((h % 360) + 360) % 360;
}

export function generateBrandFamily(primaryHex: string) {
  const parsed = oklch(parse(primaryHex));
  if (!parsed) throw new Error(`Invalid primary seed: ${primaryHex}`);
  const h = parsed.h ?? 0;
  const c = parsed.c ?? 0;
  const l = parsed.l ?? 0.5;

  const secondary = formatHex({
    mode: "oklch",
    l: Math.min(l + 0.05, 0.85),
    c: c * 0.45,
    h,
  });
  const accent = formatHex({
    mode: "oklch",
    l,
    c: Math.min(c * 1.15, 0.35),
    h: wrapHue(h + 15),
  });

  return {
    primary: primaryHex,
    secondary: secondary || primaryHex,
    accent: accent || primaryHex,
  };
}

/** Quick hex validator used by the input. */
export function isValidHex(s: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(s);
}

/** Pick a readable text color on top of a given background. */
export function readableOn(hex: string): "#ffffff" | "#1c1917" {
  const parsed = oklch(parse(hex));
  if (!parsed) return "#1c1917";
  return (parsed.l ?? 0.5) > 0.62 ? "#1c1917" : "#ffffff";
}
