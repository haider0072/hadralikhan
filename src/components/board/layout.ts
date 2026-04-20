import type { BoardCard } from "./types";

// World is in "world units" — cards positioned in a ~5200 x 3600 area.
// Strategy: a "Me" zone anchored dead-center, six projects orbiting it like
// planets (clockwise by year and featured-ness), resume/skills on the west
// and east flanks, contact at the top, a GitHub dev corner anchored at the
// south-east. Sticky notes and stickers scatter between clusters as glue so
// the board still feels hand-pinned rather than laid out on a grid.
export const WORLD = { w: 5200, h: 3600, padding: 600 };

// The initial viewport centers on this point at an 80% zoom so visitors
// land on the "me" cluster first instead of a shrunk-down overview.
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
    x: 2700,
    y: 1430,
    rotation: 2,
    depth: 2,
    caption: "haider, probably debugging",
    emoji: "🧑🏻‍💻",
    color: "#b88a3e",
  },
  {
    id: "polaroid-karachi",
    kind: "polaroid",
    x: 2050,
    y: 1720,
    rotation: -6,
    depth: 1,
    caption: "home · karachi",
    emoji: "🌙",
    color: "#e9c79a",
  },
  {
    id: "polaroid-desk",
    kind: "polaroid",
    x: 3180,
    y: 1880,
    rotation: 5,
    depth: 1,
    caption: "the desk, 2am",
    emoji: "☕",
    color: "#c4623d",
  },

  {
    id: "sticker-arrow-1",
    kind: "sticker",
    x: 2420,
    y: 1600,
    rotation: -15,
    depth: 3,
    symbol: "↴",
    label: "that's me",
  },
  {
    id: "quote-1",
    kind: "quote",
    x: 3280,
    y: 1360,
    rotation: -3,
    depth: 1,
    text: "a product is a frozen argument. design the argument first.",
  },

  // ──────────────────────────────────────────────────────────────
  // CONTACT — above the Me zone, first thing in the reading flow
  // ──────────────────────────────────────────────────────────────
  {
    id: "contact",
    kind: "contact",
    x: 2600,
    y: 820,
    rotation: -1,
    depth: 2,
    w: 420,
    h: 220,
  },

  // ──────────────────────────────────────────────────────────────
  // PROFESSIONAL FLANK — resume west, skills east
  // ──────────────────────────────────────────────────────────────
  {
    id: "experience",
    kind: "experience",
    x: 820,
    y: 1320,
    rotation: -2,
    depth: 1,
    w: 380,
    h: 460,
  },
  {
    id: "skills",
    kind: "skills",
    x: 4440,
    y: 1450,
    rotation: 3,
    depth: 1,
    w: 380,
    h: 420,
  },

  // ──────────────────────────────────────────────────────────────
  // PROJECTS — six planets orbiting Me, ordered by year + prominence.
  // Top row: newest featured work. Middle row: deep case studies.
  // Bottom row: older but real ships.
  // ──────────────────────────────────────────────────────────────
  {
    id: "project-mochi",
    kind: "prototype",
    slug: "mochi",
    x: 1050,
    y: 820,
    rotation: -4,
    depth: 0,
  },
  {
    id: "project-audora",
    kind: "prototype",
    slug: "audora",
    x: 4130,
    y: 860,
    rotation: 2,
    depth: 0,
  },

  {
    id: "project-flowcraft",
    kind: "prototype",
    slug: "flowcraft",
    x: 820,
    y: 2100,
    rotation: 2,
    depth: 0,
  },
  {
    id: "project-ember",
    kind: "prototype",
    slug: "ember",
    x: 4320,
    y: 2260,
    rotation: -3,
    depth: 0,
  },

  {
    id: "project-trading",
    kind: "prototype",
    slug: "trading-bot",
    x: 1420,
    y: 3100,
    rotation: -5,
    depth: 0,
  },
  {
    id: "project-wisesend",
    kind: "prototype",
    slug: "wisesend",
    x: 3280,
    y: 3140,
    rotation: -2,
    depth: 0,
  },

  // ──────────────────────────────────────────────────────────────
  // STICKY NOTES — atmosphere glue between clusters
  // ──────────────────────────────────────────────────────────────
  {
    id: "note-1",
    kind: "note",
    x: 1750,
    y: 1280,
    rotation: -4,
    depth: 2,
    text: "design like you'll read it at 2am with tired eyes",
    author: "h.",
    color: "yellow",
  },
  {
    id: "note-2",
    kind: "note",
    x: 3720,
    y: 2520,
    rotation: 6,
    depth: 2,
    text: "ship, then make it beautiful. never the other way.",
    color: "pink",
  },
  {
    id: "note-3",
    kind: "note",
    x: 1470,
    y: 2500,
    rotation: 3,
    depth: 2,
    text: "karachi · 05:00 UTC · coffee: black",
    color: "blue",
  },

  // ──────────────────────────────────────────────────────────────
  // STICKERS — mood atmosphere, scattered
  // ──────────────────────────────────────────────────────────────
  {
    id: "sticker-star",
    kind: "sticker",
    x: 1820,
    y: 520,
    rotation: 10,
    depth: 3,
    symbol: "✶",
  },
  {
    id: "sticker-heart",
    kind: "sticker",
    x: 3780,
    y: 1480,
    rotation: -8,
    depth: 3,
    symbol: "❤",
  },
  {
    id: "sticker-flower",
    kind: "sticker",
    x: 1120,
    y: 2620,
    rotation: 12,
    depth: 3,
    symbol: "✿",
  },
  {
    id: "sticker-spark",
    kind: "sticker",
    x: 2920,
    y: 2640,
    rotation: -6,
    depth: 3,
    symbol: "✦",
  },
  {
    id: "sticker-circle",
    kind: "sticker",
    x: 2300,
    y: 2350,
    rotation: 0,
    depth: 3,
    symbol: "○",
    label: "tap a project →",
  },

  // ──────────────────────────────────────────────────────────────
  // DEV CORNER — anchored south-east, second pole of the board
  // "also: I code" sticker literally points the eye in here.
  // ──────────────────────────────────────────────────────────────
  {
    id: "sticker-dev",
    kind: "sticker",
    x: 3520,
    y: 2420,
    rotation: -10,
    depth: 3,
    symbol: "↳",
    label: "also: i code",
  },

  {
    id: "gh-calendar",
    kind: "gh-calendar",
    x: 4100,
    y: 3150,
    rotation: -1.5,
    depth: 1,
  },
  {
    id: "gh-languages",
    kind: "gh-languages",
    x: 3820,
    y: 2700,
    rotation: 4,
    depth: 0,
  },
  {
    id: "gh-stats",
    kind: "gh-stats",
    x: 4780,
    y: 2680,
    rotation: 2.5,
    depth: 1,
  },
  {
    id: "gh-activity",
    kind: "gh-activity",
    x: 4680,
    y: 3300,
    rotation: -3,
    depth: 1,
  },
];
