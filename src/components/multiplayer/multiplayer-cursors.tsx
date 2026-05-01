"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { flagUrl } from "@/lib/twemoji";
import { useOthers } from "./realtime-context";
import { cursorColor } from "./palette";
import type { Viewport } from "@/components/board/types";

type Props = {
  viewport: Viewport;
  onSelect?: (id: string) => void;
  followingId?: string | null;
};

type Tracked = {
  id: string;
  country: string | null;
  targetX: number;
  targetY: number;
  renderX: number;
  renderY: number;
  visible: boolean;
};

const LERP = 0.18;

export function MultiplayerCursors({ viewport, onSelect, followingId }: Props) {
  const others = useOthers();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const trackedRef = useRef<Map<string, Tracked>>(new Map());
  const nodesRef = useRef<Map<string, HTMLDivElement | null>>(new Map());

  const visibleIds = useMemo(() => {
    const ids: string[] = [];
    const map = trackedRef.current;
    const seen = new Set<string>();

    for (const o of others) {
      seen.add(o.id);
      const cursor = o.data.cursor;
      if (!cursor) {
        const existing = map.get(o.id);
        if (existing) existing.visible = false;
        continue;
      }
      const screenX = cursor.worldX * viewport.scale + viewport.x;
      const screenY = cursor.worldY * viewport.scale + viewport.y;

      const existing = map.get(o.id);
      if (existing) {
        existing.targetX = screenX;
        existing.targetY = screenY;
        existing.country = o.data.country;
        existing.visible = true;
      } else {
        map.set(o.id, {
          id: o.id,
          country: o.data.country,
          targetX: screenX,
          targetY: screenY,
          renderX: screenX,
          renderY: screenY,
          visible: true,
        });
      }
      ids.push(o.id);
    }

    for (const key of map.keys()) {
      if (!seen.has(key)) map.delete(key);
    }

    return ids;
  }, [others, viewport.scale, viewport.x, viewport.y]);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const tick = () => {
      const map = trackedRef.current;
      for (const t of map.values()) {
        const dx = t.targetX - t.renderX;
        const dy = t.targetY - t.renderY;
        if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
          t.renderX += dx * LERP;
          t.renderY += dy * LERP;
        } else {
          t.renderX = t.targetX;
          t.renderY = t.targetY;
        }
        const node = nodesRef.current.get(t.id);
        if (node) {
          node.style.transform = `translate3d(${t.renderX}px, ${t.renderY}px, 0)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled]);

  if (!enabled || visibleIds.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {visibleIds.map((id) => {
        const t = trackedRef.current.get(id);
        if (!t || !t.visible) return null;
        const color = cursorColor(id);
        const isFollowing = followingId === id;
        return (
          <div
            key={id}
            ref={(el) => {
              if (el) {
                nodesRef.current.set(id, el);
                el.style.transform = `translate3d(${t.renderX}px, ${t.renderY}px, 0)`;
              } else {
                nodesRef.current.delete(id);
              }
            }}
            className="absolute top-0 left-0 will-change-transform"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              className="drop-shadow-[0_2px_4px_rgba(42,31,23,0.25)]"
              aria-hidden
            >
              <path
                d="M4.5 2.4v15.5c0 .42.5.62.78.32l4.07-4.07a.5.5 0 0 1 .35-.15h5.78a.5.5 0 0 0 .36-.85L5.36 2.04a.5.5 0 0 0-.86.36z"
                fill={color}
                stroke="white"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
            <button
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.(id);
              }}
              data-no-drag
              className="absolute left-[18px] top-[16px] flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-[0.18em] text-white whitespace-nowrap pointer-events-auto cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              style={{
                backgroundColor: color,
                boxShadow: isFollowing
                  ? `0 0 0 2px ${color}, 0 0 0 4px white`
                  : undefined,
              }}
              aria-label={`Follow ${t.country ?? "user"}`}
            >
              <Image
                src={flagUrl(t.country)}
                alt=""
                width={12}
                height={12}
                unoptimized
                className="rounded-[2px]"
                aria-hidden
              />
              <span>{t.country ?? "??"}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
