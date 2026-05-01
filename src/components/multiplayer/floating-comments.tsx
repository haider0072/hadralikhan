"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { flagUrl } from "@/lib/twemoji";
import { useRealtime, type CommentEvent } from "./realtime-context";
import { cursorColor } from "./palette";

const LIFE_MS = 8000;

type Item = CommentEvent & { bornAt: number };

export function FloatingComments() {
  const { onComment } = useRealtime();
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    return onComment((e) => {
      const item: Item = { ...e, bornAt: Date.now() };
      setItems((prev) => [...prev, item]);
      window.setTimeout(() => {
        setItems((prev) => prev.filter((i) => i.id !== e.id));
      }, LIFE_MS);
    });
  }, [onComment]);

  return (
    <>
      {items.map((c) => {
        const color = cursorColor(c.from);
        return (
          <div
            key={c.id}
            className="rt-comment pointer-events-none absolute select-none"
            style={{
              left: c.worldX,
              top: c.worldY,
              maxWidth: 240,
            }}
          >
            <div
              className="relative -translate-x-2 -translate-y-1 bg-paper border border-ink/10 rounded-2xl rounded-tl-sm px-3 py-2 shadow-[0_8px_24px_rgba(42,31,23,0.16)]"
              style={{ borderLeftColor: color, borderLeftWidth: 3 }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Image
                  src={flagUrl(c.country)}
                  alt=""
                  width={12}
                  height={12}
                  className="rounded-[2px]"
                  aria-hidden
                />
                <span
                  className="text-[9px] font-mono uppercase tracking-[0.22em]"
                  style={{ color }}
                >
                  {c.country ?? "anon"}
                </span>
              </div>
              <p className="text-sm text-ink leading-snug whitespace-pre-wrap break-words">
                {c.text}
              </p>
            </div>
          </div>
        );
      })}
      <style>{`
        @keyframes rtCommentEnter {
          0%   { opacity: 0; transform: translateY(8px) scale(0.95); }
          12%  { opacity: 1; transform: translateY(0) scale(1); }
          88%  { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-6px) scale(0.98); }
        }
        .rt-comment {
          animation: rtCommentEnter ${LIFE_MS}ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
          will-change: transform, opacity;
          transform-origin: top left;
        }
      `}</style>
    </>
  );
}
