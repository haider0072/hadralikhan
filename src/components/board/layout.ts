import type { BoardCard } from "./types";

// World is in "world units" — cards positioned inside a 5200 x 3600 area.
//
// Strategy (reads at 80% zoom on a typical laptop):
//
//                      [ Contact ]
//   [Mochi]                                    [Audora]
//   [Resume]    [note] [Quote]                   [Skills]
//                  [ Me + polaroids ]
//                    [note]
//   [FlowCraft]                                  [Ember]
//           [Trading]   [note]   [WiseSend]
//                                             [ Dev Corner ]
//
// The Me zone is dead-center. Contact hovers above as the first invitation.
// All six projects orbit Me in a compact hexagon so at least the top row
// (Mochi, Audora) and the inner-bottom row (Trading, WiseSend) peek into
// the frame on entry — the rest reveal with a short pan. Resume, Skills
// and the GitHub dev corner sit farther out as exploration rewards, with
// the "also: i code" sticker pointing the eye into the south-east pole.
// Sticky notes and stickers scatter between bands so the board still
// feels hand-pinned.
export const WORLD = { w: 5200, h: 3600, padding: 600 };

export const BOARD_HOME = { x: 2600, y: 1800, scale: 0.8 };

export const cards: BoardCard[] = [
  // ──────────────────────────────────────────────────────────────
  // ME zone — dead-center anchor
  // ──────────────────────────────────────────────────────────────
  {
    id: "intro",
    kind: "intro",
    x: 2600,
    y: 1800,
    rotation: -1.5,
    depth: 2,
    w: 520,
    h: 340,
  },

  {
    id: "polaroid-me",
    kind: "polaroid",
    x: 2690,
    y: 1470,
    rotation: 2,
    depth: 2,
    caption: "haider, probably debugging",
    emoji: "🧑🏻‍💻",
    color: "#b88a3e",
  },
  {
    id: "polaroid-karachi",
    kind: "polaroid",
    x: 2160,
    y: 1740,
    rotation: -6,
    depth: 1,
    caption: "home · karachi",
    emoji: "🌙",
    color: "#e9c79a",
  },
  {
    id: "polaroid-desk",
    kind: "polaroid",
    x: 3070,
    y: 1860,
    rotation: 5,
    depth: 1,
    caption: "the desk, 2am",
    emoji: "☕",
    color: "#c4623d",
  },

  {
    id: "sticker-arrow-1",
    kind: "sticker",
    x: 2430,
    y: 1610,
    rotation: -15,
    depth: 3,
    symbol: "↴",
    label: "that's me",
  },

  // ──────────────────────────────────────────────────────────────
  // CONTACT — floats above Me
  // ──────────────────────────────────────────────────────────────
  {
    id: "contact",
    kind: "contact",
    x: 2600,
    y: 1040,
    rotation: -1,
    depth: 2,
    w: 420,
    h: 220,
  },

  // ──────────────────────────────────────────────────────────────
  // PROJECTS — hexagon orbit, clockwise by year
  // Top corners peek in at entry. Mid flanks visible with a small pan.
  // Bottom row peeks in from below.
  // ──────────────────────────────────────────────────────────────
  {
    id: "project-mochi",
    kind: "prototype",
    slug: "mochi",
    x: 1900,
    y: 1300,
    rotation: -4,
    depth: 0,
  },
  {
    id: "project-audora",
    kind: "prototype",
    slug: "audora",
    x: 3300,
    y: 1300,
    rotation: 2,
    depth: 0,
  },

  {
    id: "project-flowcraft",
    kind: "prototype",
    slug: "flowcraft",
    x: 1720,
    y: 2080,
    rotation: 2,
    depth: 0,
  },
  {
    id: "project-ember",
    kind: "prototype",
    slug: "ember",
    x: 3480,
    y: 2100,
    rotation: -3,
    depth: 0,
  },

  {
    id: "project-trading",
    kind: "prototype",
    slug: "trading-bot",
    x: 2020,
    y: 2450,
    rotation: -5,
    depth: 0,
  },
  {
    id: "project-wisesend",
    kind: "prototype",
    slug: "wisesend",
    x: 3180,
    y: 2460,
    rotation: -2,
    depth: 0,
  },

  // ──────────────────────────────────────────────────────────────
  // PROFESSIONAL FLANK — resume west, skills east, exploration rewards
  // ──────────────────────────────────────────────────────────────
  {
    id: "experience",
    kind: "experience",
    x: 1300,
    y: 1400,
    rotation: -2,
    depth: 1,
    w: 380,
    h: 460,
  },
  {
    id: "skills",
    kind: "skills",
    x: 3900,
    y: 1420,
    rotation: 3,
    depth: 1,
    w: 380,
    h: 420,
  },
  {
    id: "quote-1",
    kind: "quote",
    x: 3080,
    y: 1370,
    rotation: -3,
    depth: 1,
    text: "a product is a frozen argument. design the argument first.",
  },

  // ──────────────────────────────────────────────────────────────
  // STICKY NOTES — atmosphere glue
  // ──────────────────────────────────────────────────────────────
  {
    id: "note-1",
    kind: "note",
    x: 2130,
    y: 1250,
    rotation: -4,
    depth: 2,
    text: "design like you'll read it at 2am with tired eyes",
    author: "h.",
    color: "yellow",
  },
  {
    id: "note-2",
    kind: "note",
    x: 2600,
    y: 2230,
    rotation: 6,
    depth: 2,
    text: "ship, then make it beautiful. never the other way.",
    color: "pink",
  },
  {
    id: "note-3",
    kind: "note",
    x: 1340,
    y: 2280,
    rotation: 3,
    depth: 2,
    text: "karachi · 05:00 UTC · coffee: black",
    color: "blue",
  },

  // ──────────────────────────────────────────────────────────────
  // STICKERS — mood atmosphere
  // ──────────────────────────────────────────────────────────────
  {
    id: "sticker-star",
    kind: "sticker",
    x: 1250,
    y: 950,
    rotation: 10,
    depth: 3,
    symbol: "✶",
  },
  {
    id: "sticker-heart",
    kind: "sticker",
    x: 3920,
    y: 950,
    rotation: -8,
    depth: 3,
    symbol: "❤",
  },
  {
    id: "sticker-flower",
    kind: "sticker",
    x: 1180,
    y: 2620,
    rotation: 12,
    depth: 3,
    symbol: "✿",
  },
  {
    id: "sticker-spark",
    kind: "sticker",
    x: 2600,
    y: 2720,
    rotation: -6,
    depth: 3,
    symbol: "✦",
  },
  {
    id: "sticker-circle",
    kind: "sticker",
    x: 2390,
    y: 2330,
    rotation: 0,
    depth: 3,
    symbol: "○",
    label: "tap a project →",
  },

  // ──────────────────────────────────────────────────────────────
  // DEV CORNER — south-east pole
  // ──────────────────────────────────────────────────────────────
  {
    id: "sticker-dev",
    kind: "sticker",
    x: 3750,
    y: 2350,
    rotation: -10,
    depth: 3,
    symbol: "↳",
    label: "also: i code",
  },
  {
    id: "gh-languages",
    kind: "gh-languages",
    x: 3900,
    y: 2650,
    rotation: 4,
    depth: 0,
  },
  {
    id: "gh-stats",
    kind: "gh-stats",
    x: 4550,
    y: 2700,
    rotation: 2.5,
    depth: 1,
  },
  {
    id: "gh-calendar",
    kind: "gh-calendar",
    x: 4050,
    y: 3050,
    rotation: -1.5,
    depth: 1,
  },
  {
    id: "gh-activity",
    kind: "gh-activity",
    x: 4520,
    y: 3250,
    rotation: -3,
    depth: 1,
  },
];
