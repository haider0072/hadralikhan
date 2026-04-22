import type { BoardCard } from "./types";

// Layout philosophy — one hero, everything orbits it.
//
// The About card sits dead-center as the single dense hub. Six prototypes
// form a flat oval ring around it (like a planetary system). Polaroids sit
// closer than the ring, pinned near the About card. The GitHub dev corner
// clusters in the north gap above the hero. A top-right quote+heart pair
// and a bottom-right pink note balance the right side. Outer negative
// space carries sparse atmosphere — not structure.
//
// Rotation budget: About is 0° as the anchor. Audora (ring right) is also
// 0° to stabilize the horizon. Every other card tilts 2–8° so the anchors
// read as deliberate.

export const WORLD = { w: 4400, h: 3200, padding: 400 };

export const BOARD_HOME = { x: 2200, y: 1600, scale: 0.85 };

export const cards: BoardCard[] = [
  // ──────────────────────────────────────────────────────────────
  // ABOUT — dense hero, dead center, 0° anchor
  // ──────────────────────────────────────────────────────────────
  {
    id: "about",
    kind: "about",
    x: 2200,
    y: 1600,
    rotation: 0,
    depth: 2,
    w: 540,
  },

  // ──────────────────────────────────────────────────────────────
  // POLAROIDS — pinned inside the ring, closer to About
  // ──────────────────────────────────────────────────────────────
  {
    id: "polaroid-me",
    kind: "polaroid",
    x: 1720,
    y: 1500,
    rotation: -8,
    depth: 1,
    caption: "haider, probably debugging",
    emoji: "🧑🏻‍💻",
    color: "#b88a3e",
  },
  {
    id: "polaroid-karachi",
    kind: "polaroid",
    x: 2840,
    y: 1460,
    rotation: 5,
    depth: 1,
    caption: "home · karachi",
    emoji: "🌙",
    color: "#e9c79a",
  },
  {
    id: "polaroid-desk",
    kind: "polaroid",
    x: 2392,
    y: 2377,
    rotation: -3,
    depth: 1,
    caption: "the desk, 2am",
    emoji: "☕",
    color: "#c4623d",
  },

  // ──────────────────────────────────────────────────────────────
  // PROJECT RING — six prototypes, flat oval around About
  //   E  = audora      (0°, anchor, 0°)
  //   NE = flowcraft   (upper-right)
  //   NW = mochi       (upper-left)
  //   W  = trading-bot (left)
  //   SW = wisesend    (lower-left)
  //   SE = ember       (lower-right)
  // ──────────────────────────────────────────────────────────────
  {
    id: "project-audora",
    kind: "prototype",
    slug: "audora",
    x: 3300,
    y: 1620,
    rotation: 0,
    depth: 0,
  },
  {
    id: "project-flowcraft",
    kind: "prototype",
    slug: "flowcraft",
    x: 3000,
    y: 1000,
    rotation: 3,
    depth: 0,
  },
  {
    id: "project-mochi",
    kind: "prototype",
    slug: "mochi",
    x: 1380,
    y: 1020,
    rotation: -4,
    depth: 0,
  },
  {
    id: "project-trading",
    kind: "prototype",
    slug: "trading-bot",
    x: 980,
    y: 1700,
    rotation: -5,
    depth: 0,
  },
  {
    id: "project-wisesend",
    kind: "prototype",
    slug: "wisesend",
    x: 1490,
    y: 2192,
    rotation: 2,
    depth: 0,
  },
  {
    id: "project-ember",
    kind: "prototype",
    slug: "ember",
    x: 2960,
    y: 2320,
    rotation: -3,
    depth: 0,
  },

  // ──────────────────────────────────────────────────────────────
  // DEV CORNER — compact GitHub cluster in the north gap
  // ──────────────────────────────────────────────────────────────
  {
    id: "gh-languages",
    kind: "gh-languages",
    x: 1960,
    y: 380,
    rotation: 3,
    depth: 0,
  },
  {
    id: "gh-stats",
    kind: "gh-stats",
    x: 2560,
    y: 500,
    rotation: -2,
    depth: 1,
  },
  {
    id: "gh-calendar",
    kind: "gh-calendar",
    x: 2040,
    y: 680,
    rotation: -1,
    depth: 1,
  },
  {
    id: "gh-activity",
    kind: "gh-activity",
    x: 2600,
    y: 820,
    rotation: 2,
    depth: 1,
  },

  // ──────────────────────────────────────────────────────────────
  // ATMOSPHERE — accents in the outer negative space
  // ──────────────────────────────────────────────────────────────
  {
    id: "quote-1",
    kind: "quote",
    x: 1897,
    y: 1037,
    rotation: -3,
    depth: 1,
    text: "a product is a frozen argument. design the argument first.",
  },
  {
    id: "note-1",
    kind: "note",
    x: 1018,
    y: 1247,
    rotation: -5,
    depth: 2,
    text: "design like you'll read it at 2am with tired eyes",
    author: "h.",
    color: "yellow",
  },
  {
    id: "note-2",
    kind: "note",
    x: 3398,
    y: 2097,
    rotation: 4,
    depth: 2,
    text: "ship, then make it beautiful. never the other way.",
    color: "pink",
  },

  // ──────────────────────────────────────────────────────────────
  // STICKERS — minimal, atmospheric marks
  // ──────────────────────────────────────────────────────────────
  {
    id: "sticker-arrow",
    kind: "sticker",
    x: 2403,
    y: 1159,
    rotation: -15,
    depth: 3,
    symbol: "↴",
    label: "about me",
  },
  {
    id: "sticker-star",
    kind: "sticker",
    x: 1548,
    y: 681,
    rotation: 10,
    depth: 3,
    symbol: "✶",
  },
  {
    id: "sticker-heart",
    kind: "sticker",
    x: 3160,
    y: 1180,
    rotation: -8,
    depth: 3,
    symbol: "❤",
  },
  {
    id: "sticker-spark",
    kind: "sticker",
    x: 2010,
    y: 2271,
    rotation: -4,
    depth: 3,
    symbol: "✦",
    label: "drag · scroll · click",
  },
];
