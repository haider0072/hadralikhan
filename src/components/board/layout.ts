import type { BoardCard } from "./types";

// World is in "world units" — cards positioned inside a 5200 x 3600 area.
//
// Strategy: isolated clusters with real breathing room between them.
// Instead of packing everything around the Me zone, each cluster gets its
// own quadrant and the empty dots between are treated as composition
// (not as bug). On entry at 80% zoom, the visitor sees a clean Me zone
// with quiet atmosphere around it — projects and the dev corner reveal
// with a short pan.
//
//             [ Contact ]                   ← top air
//     [Mochi]                   [Audora]    ← top projects sit high
//
//   [Resume]        [ Me ]        [Skills]  ← center band
//                 (polaroids,
//                  arrow, quote)
//
//               [ pink note ]
//   [FlowCraft]                   [Ember]   ← flanks drop below
//     [Trading]              [WiseSend]
//                                  ↳
//                              [ Dev Corner ]
export const WORLD = { w: 5400, h: 3800, padding: 600 };

export const BOARD_HOME = { x: 2700, y: 1900, scale: 0.8 };

export const cards: BoardCard[] = [
  // ──────────────────────────────────────────────────────────────
  // ME zone — dead-center, tight
  // ──────────────────────────────────────────────────────────────
  {
    id: "intro",
    kind: "intro",
    x: 2700,
    y: 1900,
    rotation: -1.5,
    depth: 2,
    w: 520,
    h: 340,
  },

  {
    id: "polaroid-me",
    kind: "polaroid",
    x: 2790,
    y: 1560,
    rotation: 2,
    depth: 2,
    caption: "haider, probably debugging",
    emoji: "🧑🏻‍💻",
    color: "#b88a3e",
  },
  {
    id: "polaroid-karachi",
    kind: "polaroid",
    x: 2240,
    y: 1820,
    rotation: -6,
    depth: 1,
    caption: "home · karachi",
    emoji: "🌙",
    color: "#e9c79a",
  },
  {
    id: "polaroid-desk",
    kind: "polaroid",
    x: 3170,
    y: 1960,
    rotation: 5,
    depth: 1,
    caption: "the desk, 2am",
    emoji: "☕",
    color: "#c4623d",
  },

  {
    id: "sticker-arrow-1",
    kind: "sticker",
    x: 2530,
    y: 1700,
    rotation: -15,
    depth: 3,
    symbol: "↴",
    label: "that's me",
  },
  {
    id: "quote-1",
    kind: "quote",
    x: 3320,
    y: 1530,
    rotation: -3,
    depth: 1,
    text: "a product is a frozen argument. design the argument first.",
  },

  // ──────────────────────────────────────────────────────────────
  // TOP BAND — Contact floats, projects fly high with air above Me
  // ──────────────────────────────────────────────────────────────
  {
    id: "contact",
    kind: "contact",
    x: 2700,
    y: 960,
    rotation: -1,
    depth: 2,
    w: 420,
    h: 220,
  },
  {
    id: "project-mochi",
    kind: "prototype",
    slug: "mochi",
    x: 1600,
    y: 1020,
    rotation: -4,
    depth: 0,
  },
  {
    id: "project-audora",
    kind: "prototype",
    slug: "audora",
    x: 3820,
    y: 1030,
    rotation: 2,
    depth: 0,
  },

  // ──────────────────────────────────────────────────────────────
  // CENTER FLANKS — Resume west, Skills east, room before Me
  // ──────────────────────────────────────────────────────────────
  {
    id: "experience",
    kind: "experience",
    x: 1080,
    y: 1600,
    rotation: -2,
    depth: 1,
    w: 380,
    h: 460,
  },
  {
    id: "skills",
    kind: "skills",
    x: 4300,
    y: 1620,
    rotation: 3,
    depth: 1,
    w: 380,
    h: 420,
  },

  // ──────────────────────────────────────────────────────────────
  // LOWER BAND — Case studies drop below Me with a clear gap
  // ──────────────────────────────────────────────────────────────
  {
    id: "project-flowcraft",
    kind: "prototype",
    slug: "flowcraft",
    x: 1480,
    y: 2420,
    rotation: 2,
    depth: 0,
  },
  {
    id: "project-ember",
    kind: "prototype",
    slug: "ember",
    x: 3920,
    y: 2440,
    rotation: -3,
    depth: 0,
  },

  // ──────────────────────────────────────────────────────────────
  // BOTTOM BAND — older real ships, distinct from the lower band
  // ──────────────────────────────────────────────────────────────
  {
    id: "project-trading",
    kind: "prototype",
    slug: "trading-bot",
    x: 1900,
    y: 2920,
    rotation: -5,
    depth: 0,
  },
  {
    id: "project-wisesend",
    kind: "prototype",
    slug: "wisesend",
    x: 3300,
    y: 2940,
    rotation: -2,
    depth: 0,
  },

  // ──────────────────────────────────────────────────────────────
  // STICKY NOTES — sit in the gaps between bands as glue
  // ──────────────────────────────────────────────────────────────
  {
    id: "note-1",
    kind: "note",
    x: 2100,
    y: 1200,
    rotation: -4,
    depth: 2,
    text: "design like you'll read it at 2am with tired eyes",
    author: "h.",
    color: "yellow",
  },
  {
    id: "note-2",
    kind: "note",
    x: 2700,
    y: 2350,
    rotation: 6,
    depth: 2,
    text: "ship, then make it beautiful. never the other way.",
    color: "pink",
  },
  {
    id: "note-3",
    kind: "note",
    x: 1140,
    y: 2540,
    rotation: 3,
    depth: 2,
    text: "karachi · 05:00 UTC · coffee: black",
    color: "blue",
  },

  // ──────────────────────────────────────────────────────────────
  // STICKERS — small mood markers in the empty dots between zones
  // ──────────────────────────────────────────────────────────────
  {
    id: "sticker-star",
    kind: "sticker",
    x: 920,
    y: 820,
    rotation: 10,
    depth: 3,
    symbol: "✶",
  },
  {
    id: "sticker-heart",
    kind: "sticker",
    x: 4420,
    y: 860,
    rotation: -8,
    depth: 3,
    symbol: "❤",
  },
  {
    id: "sticker-flower",
    kind: "sticker",
    x: 920,
    y: 2960,
    rotation: 12,
    depth: 3,
    symbol: "✿",
  },
  {
    id: "sticker-spark",
    kind: "sticker",
    x: 2700,
    y: 3200,
    rotation: -6,
    depth: 3,
    symbol: "✦",
  },
  {
    id: "sticker-circle",
    kind: "sticker",
    x: 2470,
    y: 2620,
    rotation: 0,
    depth: 3,
    symbol: "○",
    label: "tap a project →",
  },

  // ──────────────────────────────────────────────────────────────
  // DEV CORNER — south-east second pole with real distance from Me
  // ──────────────────────────────────────────────────────────────
  {
    id: "sticker-dev",
    kind: "sticker",
    x: 4020,
    y: 2720,
    rotation: -10,
    depth: 3,
    symbol: "↳",
    label: "also: i code",
  },
  {
    id: "gh-languages",
    kind: "gh-languages",
    x: 4150,
    y: 3050,
    rotation: 4,
    depth: 0,
  },
  {
    id: "gh-stats",
    kind: "gh-stats",
    x: 4780,
    y: 3080,
    rotation: 2.5,
    depth: 1,
  },
  {
    id: "gh-calendar",
    kind: "gh-calendar",
    x: 4300,
    y: 3430,
    rotation: -1.5,
    depth: 1,
  },
  {
    id: "gh-activity",
    kind: "gh-activity",
    x: 4820,
    y: 3520,
    rotation: -3,
    depth: 1,
  },
];
