"use client";

import { cn } from "@/lib/cn";
import { site } from "@/data/site";
import { experience } from "@/data/experience";
import { skillGroups } from "@/data/skills";
import type {
  BoardCard,
  IntroCard,
  ProjectCard,
  PrototypeCard,
  PolaroidCard,
  NoteCard,
  StickerCard,
  ContactCard,
  ExperienceCard,
  SkillsCard,
  QuoteCard,
} from "./types";
import { AudoraPrototype } from "./prototypes/audora";
import { MochiPrototype } from "./prototypes/mochi";
import { TradingBotPrototype } from "./prototypes/trading-bot";
import { WiseSendPrototype } from "./prototypes/wisesend";
import { EmberPrototype } from "./prototypes/ember";
import { FlowCraftPrototype } from "./prototypes/flowcraft";
import type { CardActivity } from "./use-card-activity";
import {
  ContributionCalendarCard,
  StatsSummaryCard,
  ActivityFeedCard,
  LanguagesCard,
} from "./github-cards";
import type { GithubStats } from "@/lib/github";

const noteColors: Record<string, string> = {
  yellow: "#f5e7a8",
  pink: "#f2c3c9",
  blue: "#bcd3e6",
  green: "#c7d9ba",
};

export function CardRenderer({
  card,
  activity,
  github,
}: {
  card: BoardCard;
  activity: CardActivity;
  github: GithubStats | null;
}) {
  switch (card.kind) {
    case "intro":
      return <IntroCardView card={card} />;
    case "project":
      return <ProjectCardView card={card} />;
    case "prototype":
      return <PrototypeCardView card={card} activity={activity} />;
    case "polaroid":
      return <PolaroidCardView card={card} />;
    case "note":
      return <NoteCardView card={card} />;
    case "sticker":
      return <StickerCardView card={card} />;
    case "contact":
      return <ContactCardView card={card} />;
    case "experience":
      return <ExperienceCardView card={card} />;
    case "skills":
      return <SkillsCardView card={card} />;
    case "quote":
      return <QuoteCardView card={card} />;
    case "gh-calendar":
      return <ContributionCalendarCard data={github?.calendar ?? null} />;
    case "gh-stats":
      return github ? (
        <StatsSummaryCard data={github} />
      ) : (
        <GhPlaceholder label="GitHub · stats" />
      );
    case "gh-activity":
      return <ActivityFeedCard data={github?.activity ?? []} />;
    case "gh-languages":
      return <LanguagesCard data={github?.languages ?? []} />;
  }
}

function PrototypeCardView({
  card,
  activity,
}: {
  card: PrototypeCard;
  activity: CardActivity;
}) {
  switch (card.slug) {
    case "audora":
      return <AudoraPrototype activity={activity} />;
    case "mochi":
      return <MochiPrototype activity={activity} />;
    case "trading-bot":
      return <TradingBotPrototype activity={activity} />;
    case "wisesend":
      return <WiseSendPrototype activity={activity} />;
    case "ember":
      return <EmberPrototype activity={activity} />;
    case "flowcraft":
      return <FlowCraftPrototype activity={activity} />;
    default:
      return <GhPlaceholder label={`${card.slug} · coming soon`} />;
  }
}

function GhPlaceholder({ label }: { label: string }) {
  return (
    <div
      data-no-drag
      className="bg-paper border border-ink/10 rounded-sm p-5 w-[280px] font-mono text-[11px] text-ink-muted"
    >
      {label}
    </div>
  );
}

function IntroCardView({ card }: { card: IntroCard }) {
  return (
    <article
      data-no-drag
      style={{ width: card.w, height: card.h }}
      className="bg-paper border border-ink/10 rounded-sm shadow-[0_10px_40px_-15px_rgba(42,31,23,0.3)] p-8 flex flex-col justify-between"
    >
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
          Introducing
        </p>
        <h1 className="mt-4 font-serif text-5xl leading-[0.95] tracking-tight">
          Haider
          <br />
          <span className="italic text-terracotta">Ali Khan</span>
        </h1>
      </div>
      <div>
        <p className="text-sm text-ink-soft leading-relaxed max-w-[80%]">
          {site.role}. Karachi-based. Designs products, ships systems,
          occasionally a little magic.
        </p>
        <div className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-terracotta animate-pulse" />
          <span>Drag · scroll · click</span>
        </div>
      </div>
    </article>
  );
}

const accentBg: Record<string, string> = {
  terracotta: "bg-[#f4d5c6]",
  ochre: "bg-[#f0dbae]",
  sage: "bg-[#d4dcc6]",
};
const accentRing: Record<string, string> = {
  terracotta: "ring-terracotta",
  ochre: "ring-ochre",
  sage: "ring-sage",
};

function ProjectCardView({ card }: { card: ProjectCard }) {
  return (
    <a
      data-no-drag
      href={card.href ?? "#"}
      target={card.href ? "_blank" : undefined}
      rel="noreferrer"
      className={cn(
        "group block w-[300px] bg-paper border border-ink/10 rounded-sm shadow-[0_12px_40px_-15px_rgba(42,31,23,0.4)] overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_rgba(42,31,23,0.5)] hover:ring-2 ring-offset-2 ring-offset-transparent",
        accentRing[card.accent],
      )}
    >
      <div
        className={cn(
          "relative aspect-[4/3] w-full flex items-center justify-center",
          accentBg[card.accent],
        )}
      >
        <ProjectThumb slug={card.slug} accent={card.accent} />
        <span className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.22em] text-ink-muted bg-cream/70 backdrop-blur px-2 py-1 rounded-full">
          {card.year}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-2xl leading-tight tracking-tight">
          {card.title}
        </h3>
        <p className="mt-1 text-sm text-ink-soft leading-snug">{card.tagline}</p>
        <div className="mt-3 flex items-center justify-between">
          <ul className="flex gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted">
            {card.stack.map((s) => (
              <li key={s} className="border border-rule rounded-full px-2 py-0.5">
                {s}
              </li>
            ))}
          </ul>
          <span className="font-mono text-xs text-ink-muted group-hover:text-terracotta transition-colors">
            →
          </span>
        </div>
      </div>
    </a>
  );
}

function PolaroidCardView({ card }: { card: PolaroidCard }) {
  return (
    <div
      data-no-drag
      className="bg-white p-3 pb-10 shadow-[0_14px_30px_-10px_rgba(42,31,23,0.35)] w-[220px] select-none"
    >
      <div
        className="relative w-full aspect-square flex items-center justify-center text-[80px]"
        style={{
          background: `linear-gradient(135deg, ${card.color ?? "#e9c79a"}, ${card.color ?? "#e9c79a"}cc)`,
        }}
      >
        <span aria-hidden>{card.emoji ?? "✦"}</span>
      </div>
      <p className="mt-3 font-hand text-2xl text-center text-ink leading-none">
        {card.caption}
      </p>
    </div>
  );
}

function NoteCardView({ card }: { card: NoteCard }) {
  return (
    <div
      data-no-drag
      style={{ background: noteColors[card.color ?? "yellow"] }}
      className="w-[220px] min-h-[180px] p-5 shadow-[0_12px_24px_-10px_rgba(42,31,23,0.25)] select-none"
    >
      <p className="font-hand text-2xl leading-snug text-ink">{card.text}</p>
      {card.author && (
        <p className="mt-4 font-hand text-xl text-ink-muted">{card.author}</p>
      )}
    </div>
  );
}

function StickerCardView({ card }: { card: StickerCard }) {
  return (
    <div data-no-drag className="flex flex-col items-center select-none">
      <span className="font-serif text-5xl md:text-6xl text-terracotta">
        {card.symbol}
      </span>
      {card.label && (
        <span className="mt-1 font-hand text-xl text-ink-muted whitespace-nowrap">
          {card.label}
        </span>
      )}
    </div>
  );
}

function ContactCardView({ card }: { card: ContactCard }) {
  return (
    <div
      data-no-drag
      style={{ width: card.w, height: card.h }}
      className="bg-ink text-cream rounded-sm p-6 shadow-[0_14px_30px_-10px_rgba(42,31,23,0.4)] flex flex-col justify-between"
    >
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cream/60">
          Say hello
        </p>
        <h3 className="mt-3 font-serif text-3xl leading-tight tracking-tight">
          Got a weird brief?
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        <a
          href={site.socials.email}
          className="rounded-full bg-terracotta text-cream px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:bg-cream hover:text-ink transition-colors"
        >
          Email
        </a>
        <a
          href={site.socials.linkedin}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-cream/30 px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:bg-cream hover:text-ink transition-colors"
        >
          LinkedIn
        </a>
        <a
          href={site.socials.github}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-cream/30 px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:bg-cream hover:text-ink transition-colors"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}

function ExperienceCardView({ card }: { card: ExperienceCard }) {
  return (
    <div
      data-no-drag
      style={{ width: card.w, height: card.h }}
      className="bg-paper border border-ink/10 rounded-sm shadow-[0_14px_30px_-10px_rgba(42,31,23,0.3)] p-6 flex flex-col"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
        Résumé · brief
      </p>
      <h3 className="mt-3 font-serif text-2xl tracking-tight">Where I've been</h3>
      <ol className="mt-4 space-y-3 text-sm">
        {experience.map((exp) => (
          <li key={exp.company} className="border-t border-rule pt-3">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-medium text-ink">{exp.company}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted whitespace-nowrap">
                {exp.period}
              </p>
            </div>
            <p className="text-ink-muted text-xs mt-0.5">{exp.role}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function SkillsCardView({ card }: { card: SkillsCard }) {
  return (
    <div
      data-no-drag
      style={{ width: card.w, height: card.h }}
      className="bg-paper border border-ink/10 rounded-sm shadow-[0_14px_30px_-10px_rgba(42,31,23,0.3)] p-6 overflow-hidden"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
        Toolkit
      </p>
      <h3 className="mt-3 font-serif text-2xl tracking-tight">What I reach for</h3>
      <div className="mt-4 space-y-3 text-sm">
        {skillGroups.slice(0, 5).map((g) => (
          <div key={g.label}>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted">
              {g.label}
            </p>
            <p className="mt-1 text-ink-soft leading-snug">
              {g.items.slice(0, 5).join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuoteCardView({ card }: { card: QuoteCard }) {
  return (
    <div
      data-no-drag
      className="max-w-[280px] font-serif italic text-2xl leading-snug text-ink/80 select-none"
    >
      <span className="text-terracotta">"</span>
      {card.text}
      <span className="text-terracotta">"</span>
    </div>
  );
}

function ProjectThumb({
  slug,
  accent,
}: {
  slug: string;
  accent: "terracotta" | "ochre" | "sage";
}) {
  const stroke =
    accent === "terracotta"
      ? "#c4623d"
      : accent === "ochre"
        ? "#b88a3e"
        : "#7a8268";
  const ink = "#2a1f17";

  if (slug === "mochi") {
    return (
      <svg viewBox="0 0 200 150" className="w-full h-full">
        {Array.from({ length: 6 }).map((_, r) =>
          Array.from({ length: 8 }).map((_, c) => (
            <circle
              key={`${r}-${c}`}
              cx={20 + c * 22}
              cy={20 + r * 22}
              r={r === 2 && c === 4 ? 7 : 2.5}
              fill={r === 2 && c === 4 ? stroke : ink}
              opacity={r === 2 && c === 4 ? 1 : 0.35}
            />
          )),
        )}
      </svg>
    );
  }
  if (slug === "audora") {
    return (
      <svg viewBox="0 0 200 150" className="w-full h-full">
        {Array.from({ length: 30 }).map((_, i) => {
          const h = 10 + Math.abs(Math.sin(i * 0.6)) * 90;
          return (
            <rect
              key={i}
              x={10 + i * 6.3}
              y={75 - h / 2}
              width="2.5"
              height={h}
              fill={i === 15 ? stroke : ink}
              opacity={i === 15 ? 1 : 0.55}
            />
          );
        })}
      </svg>
    );
  }
  if (slug === "flowcraft") {
    return (
      <svg viewBox="0 0 200 150" className="w-full h-full">
        {Array.from({ length: 3 }).map((_, r) =>
          Array.from({ length: 4 }).map((_, c) => (
            <g key={`${r}-${c}`}>
              <rect
                x={20 + c * 42}
                y={20 + r * 38}
                width="34"
                height="34"
                fill="none"
                stroke={ink}
                strokeWidth={0.6}
                opacity={0.4}
              />
              <circle
                cx={37 + c * 42}
                cy={37 + r * 38}
                r={6 + ((c + r) % 3)}
                fill={r === 1 && c === 2 ? stroke : ink}
                opacity={r === 1 && c === 2 ? 1 : 0.7}
              />
            </g>
          )),
        )}
      </svg>
    );
  }
  if (slug === "ember") {
    return (
      <svg viewBox="0 0 200 150" className="w-full h-full">
        <circle cx="100" cy="75" r="50" fill="none" stroke={ink} opacity="0.5" />
        <circle cx="100" cy="75" r="30" fill="none" stroke={ink} opacity="0.6" />
        <circle cx="100" cy="75" r="14" fill={stroke} />
      </svg>
    );
  }
  if (slug === "trading-bot") {
    return (
      <svg viewBox="0 0 200 150" className="w-full h-full">
        <polyline
          points="15,120 40,95 65,105 90,70 115,80 140,45 165,60 185,30"
          fill="none"
          stroke={stroke}
          strokeWidth="1.8"
        />
      </svg>
    );
  }
  if (slug === "relay") {
    return (
      <svg viewBox="0 0 200 150" className="w-full h-full">
        {[30, 70, 110, 150, 30, 70, 110, 150].map((x, i) => (
          <circle
            key={i}
            cx={x}
            cy={i < 4 ? 40 : 110}
            r="8"
            fill={i === 1 ? stroke : ink}
            opacity={i === 1 ? 1 : 0.5}
          />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1={30 + i * 40}
            y1="40"
            x2={30 + ((i + 1) % 4) * 40}
            y2="110"
            stroke={ink}
            strokeWidth="0.6"
            opacity="0.3"
          />
        ))}
      </svg>
    );
  }
  // wisesend and default
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full">
      <path
        d="M 40 90 L 100 40 L 160 90 L 130 90 L 130 120 L 70 120 L 70 90 Z"
        fill="none"
        stroke={ink}
        strokeWidth="1.5"
        opacity="0.8"
      />
      <circle cx="100" cy="65" r="5" fill={stroke} />
    </svg>
  );
}
