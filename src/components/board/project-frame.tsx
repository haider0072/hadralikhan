"use client";

import { cn } from "@/lib/cn";

/**
 * Unified "scrapbook" chrome for every project prototype on the board.
 * The interior (passed as children) carries the project's own art direction;
 * the frame keeps the portfolio feeling like one studio.
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
  return (
    <div
      data-no-drag
      className={cn(
        "group relative bg-paper border border-ink/10 rounded-sm shadow-[0_14px_40px_-15px_rgba(42,31,23,0.4)] overflow-hidden w-[320px] transition-shadow",
        "hover:shadow-[0_22px_50px_-15px_rgba(42,31,23,0.55)]",
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
        {onOpen && (
          <button
            onClick={onOpen}
            onPointerDown={(e) => e.stopPropagation()}
            data-cursor-text="open"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-ink text-cream px-4 py-2 text-xs font-mono uppercase tracking-[0.22em] hover:bg-terracotta transition-colors"
          >
            <span>Open</span>
            <span>→</span>
          </button>
        )}
      </div>
    </div>
  );
}
