"use client";

import { cn } from "@/lib/cn";

/**
 * Unified "scrapbook" chrome for every project prototype on the board.
 * The interior (passed as children) carries the project's own art direction;
 * the frame keeps the portfolio feeling like one studio.
 *
 * Whole card is clickable when onOpen is provided. The board-level drag
 * threshold (5px) already suppresses clicks during a real drag.
 */
export function ProjectFrame({
  children,
  meta,
  className,
  innerClassName,
  onOpen,
  tape,
}: {
  children: React.ReactNode;
  meta: { year: string; title: string; tagline: string };
  className?: string;
  innerClassName?: string;
  onOpen?: () => void;
  tape?: "top-left" | "top-right" | "none";
}) {
  const interactive = !!onOpen;
  return (
    <div
      data-no-drag
      data-cursor-text={interactive ? "open" : undefined}
      onClick={onOpen}
      className={cn(
        "group relative bg-paper border border-ink/10 rounded-sm shadow-[0_14px_40px_-15px_rgba(42,31,23,0.4)] overflow-hidden w-[320px]",
        "hover:shadow-[0_22px_50px_-15px_rgba(42,31,23,0.55)] hover:-translate-y-0.5 transition-[transform,box-shadow] duration-200",
        interactive && "cursor-pointer",
        className,
      )}
    >
      {tape !== "none" && (
        <span
          aria-hidden
          className={cn(
            "absolute z-10 h-4 w-16 bg-[#e9d9b4]/85 rotate-[-6deg] border border-ink/10 mix-blend-multiply",
            tape === "top-right"
              ? "-top-2 -right-3 rotate-[6deg]"
              : "-top-2 -left-3",
          )}
        />
      )}

      {/* Hover hint — "click to open" */}
      {interactive && (
        <div
          aria-hidden
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-cream/90 backdrop-blur border border-ink/10 rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-ink opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 17L17 7M17 7H10M17 7V14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span>open</span>
        </div>
      )}

      <div
        className={cn(
          "relative aspect-[4/3] w-full overflow-hidden",
          innerClassName,
        )}
      >
        {children}
      </div>

      <div className="p-4 border-t border-rule">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-serif text-xl tracking-tight leading-none">
            {meta.title}
          </h3>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted shrink-0">
            {meta.year}
          </span>
        </div>
        <p className="mt-1.5 text-sm text-ink-soft leading-snug line-clamp-2">
          {meta.tagline}
        </p>
        {interactive && (
          <div className="mt-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted group-hover:text-terracotta transition-colors">
            <span>Click to open</span>
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
