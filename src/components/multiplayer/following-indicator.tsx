"use client";

import Image from "next/image";
import { flagUrl } from "@/lib/twemoji";

type Props = {
  country: string | null;
  color: string | null;
  onExit: () => void;
};

export function FollowingIndicator({ country, color, onExit }: Props) {
  return (
    <div
      data-no-drag
      className="fixed top-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-paper/95 backdrop-blur border border-ink/10 rounded-full pl-3 pr-1 py-1 shadow-[0_4px_16px_rgba(42,31,23,0.12)]"
    >
      <span
        className="h-1.5 w-1.5 rounded-full animate-pulse"
        style={{ backgroundColor: color ?? "#c25b3a" }}
        aria-hidden
      />
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
        following
      </span>
      <Image
        src={flagUrl(country)}
        alt=""
        width={14}
        height={14}
        className="rounded-[2px]"
        aria-hidden
      />
      <button
        onClick={onExit}
        className="ml-1 flex items-center justify-center h-6 w-6 rounded-full hover:bg-ink/5 active:scale-90 transition-transform"
        aria-label="Exit follow mode"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
          <path
            d="M2 2l6 6M8 2L2 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
