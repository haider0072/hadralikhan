"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useOthers } from "./realtime-context";
import { FollowingIndicator } from "./following-indicator";
import { cursorColor } from "./palette";
import type { Viewport } from "@/components/board/types";

type Props = {
  followingId: string | null;
  containerRef: RefObject<HTMLDivElement | null>;
  viewportRef: RefObject<Viewport>;
  setViewport: (v: Viewport) => void;
  onUserGone: () => void;
};

const LERP = 0.12;

export function FollowController({
  followingId,
  containerRef,
  viewportRef,
  setViewport,
  onUserGone,
}: Props) {
  const others = useOthers();
  const othersRef = useRef(others);
  othersRef.current = others;

  // Auto-exit if followed user leaves the room
  useEffect(() => {
    if (!followingId) return;
    if (!others.some((o) => o.id === followingId)) onUserGone();
  }, [followingId, others, onUserGone]);

  // While following, lerp viewport each frame to center their cursor on screen
  useEffect(() => {
    if (!followingId) return;
    let raf = 0;
    const tick = () => {
      const target = othersRef.current.find((o) => o.id === followingId);
      const cur = target?.data.cursor;
      const el = containerRef.current;
      if (cur && el) {
        const rect = el.getBoundingClientRect();
        const v = viewportRef.current;
        const tx = rect.width / 2 - cur.worldX * v.scale;
        const ty = rect.height / 2 - cur.worldY * v.scale;
        setViewport({
          x: v.x + (tx - v.x) * LERP,
          y: v.y + (ty - v.y) * LERP,
          scale: v.scale,
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [followingId, containerRef, viewportRef, setViewport]);

  return null;
}

// Indicator wrapper — subscribes to others only while follow is active so
// the parent BoardCanvas doesn't have to re-render on cursor broadcasts.
export function FollowingIndicatorMount({
  followingId,
  onExit,
}: {
  followingId: string;
  onExit: () => void;
}) {
  const others = useOthers();
  const country =
    others.find((o) => o.id === followingId)?.data.country ?? null;
  return (
    <FollowingIndicator
      country={country}
      color={cursorColor(followingId)}
      onExit={onExit}
    />
  );
}
