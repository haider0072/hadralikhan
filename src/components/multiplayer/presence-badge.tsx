"use client";

import Image from "next/image";
import { flagFullUrl } from "@/lib/twemoji";
import { useRealtime, useOthers } from "./realtime-context";
import { cursorColor } from "./palette";

const MAX_VISIBLE = 4;

type Props = {
  followingId: string | null;
  onSelect: (id: string) => void;
};

export function PresenceBadge({ followingId, onSelect }: Props) {
  const { ready, self, selfId } = useRealtime();
  const others = useOthers();

  if (!ready) return null;

  // Self first, then others. Cap visible count, overflow as "+N".
  const visibleOthers = others.slice(0, MAX_VISIBLE - 1);
  const overflow = others.length - visibleOthers.length;

  return (
    <div
      data-no-drag
      className="fixed top-5 right-5 z-40 flex items-center gap-2 bg-paper/90 backdrop-blur border border-ink/10 rounded-full pl-3 pr-1.5 py-1"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terracotta opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-terracotta" />
      </span>
      <div className="flex -space-x-2">
        <Avatar
          country={self.country}
          color={cursorColor(selfId || "self")}
          isSelf
          isFollowing={false}
          onClick={() => {}}
        />
        {visibleOthers.map((o) => (
          <Avatar
            key={o.id}
            country={o.data.country}
            color={cursorColor(o.id)}
            isSelf={false}
            isFollowing={followingId === o.id}
            onClick={() => onSelect(o.id)}
          />
        ))}
        {overflow > 0 && (
          <div className="relative z-0 flex items-center justify-center h-7 w-7 rounded-full bg-paper border-2 border-paper ring-1 ring-ink/15 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted">
            +{overflow}
          </div>
        )}
      </div>
    </div>
  );
}

function Avatar({
  country,
  color,
  isSelf,
  isFollowing,
  onClick,
}: {
  country: string | null;
  color: string;
  isSelf: boolean;
  isFollowing: boolean;
  onClick: () => void;
}) {
  const ringStyle = isFollowing
    ? { boxShadow: `0 0 0 2px ${color}, 0 0 0 4px var(--paper, #f4ecd8)` }
    : undefined;
  const title = isSelf
    ? `you · ${country ?? "??"}`
    : `follow · ${country ?? "??"}`;

  const inner = (
    <span
      className="relative flex items-center justify-center h-7 w-7 rounded-full overflow-hidden ring-2 ring-paper"
      style={{ backgroundColor: color }}
    >
      <Image
        src={flagFullUrl(country)}
        alt=""
        width={24}
        height={16}
        unoptimized
        className="rounded-[2px] shadow-[0_0_0_0.5px_rgba(0,0,0,0.15)]"
        aria-hidden
      />
    </span>
  );

  if (isSelf) {
    return (
      <span
        title={title}
        aria-label={title}
        className="relative z-10"
        style={ringStyle}
      >
        {inner}
      </span>
    );
  }

  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className="relative z-10 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
      style={ringStyle}
    >
      {inner}
    </button>
  );
}
