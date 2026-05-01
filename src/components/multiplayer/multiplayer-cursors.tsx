"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { flagUrl } from "@/lib/twemoji";
import { useRealtime } from "./realtime-context";
import type { Viewport } from "@/components/board/types";

type Props = {
  viewport: Viewport;
};

type Tracked = {
  id: string;
  country: string | null;
  // Latest server-provided target in screen coords
  targetX: number;
  targetY: number;
  // Current rendered position (lerped each frame)
  renderX: number;
  renderY: number;
  visible: boolean;
};

const LERP = 0.18;

export function MultiplayerCursors({ viewport }: Props) {
  const { others } = useRealtime();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Stable map keyed by other.id holding both target + rendered position.
  const trackedRef = useRef<Map<string, Tracked>>(new Map());
  // Refs to the actual DOM nodes so we can mutate transforms outside React.
  const nodesRef = useRef<Map<string, HTMLDivElement | null>>(new Map());

  // Convert latest realtime data to per-id targets in screen coords.
  // Recomputed when others or viewport change.
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
        // First time we see this user — start render at the target so it
        // doesn't fly in from (0,0).
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

    // Drop entries for users who left.
    for (const key of map.keys()) {
      if (!seen.has(key)) map.delete(key);
    }

    return ids;
  }, [others, viewport.scale, viewport.x, viewport.y]);

  // rAF loop — lerps every tracked cursor toward its target each frame.
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
            className="pointer-events-none absolute top-0 left-0 will-change-transform"
          >
            <div className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <span className="absolute h-1.5 w-1.5 rounded-full bg-ink/70 shadow-[0_0_0_2px_rgba(244,236,224,0.85)]" />
              <Image
                src={flagUrl(t.country)}
                alt=""
                width={28}
                height={28}
                unoptimized
                className="absolute translate-x-3 translate-y-3 drop-shadow-[0_2px_6px_rgba(42,31,23,0.25)]"
                aria-hidden
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
