export type CardKind =
  | "intro"
  | "about"
  | "project"
  | "prototype"
  | "polaroid"
  | "note"
  | "sticker"
  | "contact"
  | "experience"
  | "skills"
  | "quote"
  | "gh-calendar"
  | "gh-stats"
  | "gh-activity"
  | "gh-languages";

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

export type AboutCard = CardBase & {
  kind: "about";
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

export type PrototypeCard = CardBase & {
  kind: "prototype";
  slug:
    | "audora"
    | "flowcraft"
    | "mochi"
    | "trading-bot"
    | "ember"
    | "relay"
    | "wisesend";
};

export type GhCalendarCard = CardBase & { kind: "gh-calendar" };
export type GhStatsCard = CardBase & { kind: "gh-stats" };
export type GhActivityCard = CardBase & { kind: "gh-activity" };
export type GhLanguagesCard = CardBase & { kind: "gh-languages" };

export type BoardCard =
  | IntroCard
  | AboutCard
  | ProjectCard
  | PrototypeCard
  | PolaroidCard
  | NoteCard
  | StickerCard
  | ContactCard
  | ExperienceCard
  | SkillsCard
  | QuoteCard
  | GhCalendarCard
  | GhStatsCard
  | GhActivityCard
  | GhLanguagesCard;

export type Viewport = { x: number; y: number; scale: number };
