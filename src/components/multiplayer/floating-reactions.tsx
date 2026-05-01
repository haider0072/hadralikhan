"use client";

import { useEffect, useState } from "react";
import { useRealtime } from "./realtime-context";

type FloatingReaction = {
  id: string;
  emoji: string;
  worldX: number;
  worldY: number;
};

const LIFE_MS = 1800;

export function FloatingReactions() {
  const { onReaction } = useRealtime();
  const [items, setItems] = useState<FloatingReaction[]>([]);

  useEffect(() => {
    return onReaction(({ emoji, worldX, worldY }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setItems((prev) => [...prev, { id, emoji, worldX, worldY }]);
      window.setTimeout(() => {
        setItems((prev) => prev.filter((i) => i.id !== id));
      }, LIFE_MS);
    });
  }, [onReaction]);

  return (
    <>
      {items.map((item) => (
        <div
          key={item.id}
          className="rt-reaction pointer-events-none absolute select-none"
          style={{
            left: item.worldX,
            top: item.worldY,
            fontSize: 36,
            lineHeight: 1,
          }}
        >
          <span style={{ transform: "translate(-50%, -50%)", display: "block" }}>
            {item.emoji}
          </span>
        </div>
      ))}
      <style>{`
        @keyframes rtReactionFloat {
          0%   { opacity: 0; transform: translateY(10px) scale(0.6); }
          15%  { opacity: 1; transform: translateY(-20px) scale(1); }
          70%  { opacity: 1; transform: translateY(-70px) scale(1); }
          100% { opacity: 0; transform: translateY(-95px) scale(0.95); }
        }
        .rt-reaction {
          animation: rtReactionFloat ${LIFE_MS}ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
          will-change: transform, opacity;
        }
      `}</style>
    </>
  );
}
