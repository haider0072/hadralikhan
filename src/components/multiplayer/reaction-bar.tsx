"use client";

import { useCallback, useRef } from "react";
import { REACTIONS } from "@/lib/supabase";
import { useRealtime } from "./realtime-context";
import type { Viewport } from "@/components/board/types";
import type { RefObject } from "react";

type Props = {
  viewportRef: RefObject<Viewport>;
};

export function ReactionBar({ viewportRef }: Props) {
  const { ready, broadcastReaction } = useRealtime();
  const lastFireRef = useRef(0);

  const fire = useCallback(
    (emoji: string) => {
      const now = performance.now();
      if (now - lastFireRef.current < 250) return;
      lastFireRef.current = now;

      const v = viewportRef.current;
      if (!v) return;
      const sx = window.innerWidth / 2;
      const sy = window.innerHeight - 140;
      const worldX = (sx - v.x) / v.scale;
      const worldY = (sy - v.y) / v.scale;

      broadcastReaction(emoji, worldX, worldY);
    },
    [broadcastReaction, viewportRef],
  );

  if (!ready) return null;

  return (
    <div
      data-no-drag
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 bg-paper/90 backdrop-blur border border-ink/10 rounded-full px-2 py-1.5"
    >
      {REACTIONS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => fire(emoji)}
          className="flex items-center justify-center h-9 w-9 rounded-full text-lg hover:bg-ink/5 active:scale-90 transition-transform"
          aria-label={`React with ${emoji}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
