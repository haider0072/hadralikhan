"use client";

import { useEffect, useState } from "react";
import { FlagCursor } from "./flag-cursor";
import { useRealtime } from "./realtime-context";
import type { Viewport } from "@/components/board/types";

type Props = {
  viewport: Viewport;
};

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

  if (!enabled || others.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {others.map((other) => {
        const cursor = other.data.cursor;
        if (!cursor) return null;
        const screenX = cursor.worldX * viewport.scale + viewport.x;
        const screenY = cursor.worldY * viewport.scale + viewport.y;
        return (
          <FlagCursor
            key={other.id}
            country={other.data.country}
            screenX={screenX}
            screenY={screenY}
          />
        );
      })}
    </div>
  );
}
