export type CardKind =
  | "intro"
  | "project"
  | "polaroid"
  | "note"
  | "sticker"
  | "contact"
  | "experience"
  | "skills"
  | "quote";

export type CardBase = {
  id: string;
  kind: CardKind;
  x: number;
  y: number;
  rotation?: number;
  depth?: 0 | 1 | 2 | 3;
  w?: number;
  h?: number;
};

export type IntroCard = CardBase & {
  kind: "intro";
};

export type ProjectCard = CardBase & {
  kind: "project";
  slug: string;
  title: string;
  tagline: string;
  year: string;
  stack: string[];
  accent: "terracotta" | "ochre" | "sage";
  href?: string;
};

export type PolaroidCard = CardBase & {
  kind: "polaroid";
  caption: string;
  emoji?: string;
  color?: string;
};

export type NoteCard = CardBase & {
  kind: "note";
  text: string;
  author?: string;
  color?: "yellow" | "pink" | "blue" | "green";
};

export type StickerCard = CardBase & {
  kind: "sticker";
  symbol: string;
  label?: string;
};

export type ContactCard = CardBase & {
  kind: "contact";
};

export type ExperienceCard = CardBase & {
  kind: "experience";
};

export type SkillsCard = CardBase & {
  kind: "skills";
};

export type QuoteCard = CardBase & {
  kind: "quote";
  text: string;
};

export type BoardCard =
  | IntroCard
  | ProjectCard
  | PolaroidCard
  | NoteCard
  | StickerCard
  | ContactCard
  | ExperienceCard
  | SkillsCard
  | QuoteCard;

export type Viewport = { x: number; y: number; scale: number };
