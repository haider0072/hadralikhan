"use client";

import { cn } from "@/lib/cn";
import type { BoardCard, Viewport } from "./types";

type Props = {
  cards: BoardCard[];
  world: { w: number; h: number };
  viewport: Viewport;
  containerSize: { w: number; h: number };
  onJump: (worldX: number, worldY: number) => void;
};

export function Minimap({
  cards,
  world,
  viewport,
  containerSize,
  onJump,
}: Props) {
  const W = 180;
  const H = (W * world.h) / world.w;
  const sx = W / world.w;
  const sy = H / world.h;

  // Viewport rect in world coords
  const vwWorld = containerSize.w / viewport.scale;
  const vhWorld = containerSize.h / viewport.scale;
  const vxWorld = -viewport.x / viewport.scale;
  const vyWorld = -viewport.y / viewport.scale;

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = (e.target as SVGElement).closest("svg")!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    onJump(mx / sx, my / sy);
  };

  const dotColor = (kind: string) => {
    if (kind === "project") return "#c4623d";
    if (kind === "intro") return "#2a1f17";
    if (kind === "contact") return "#2a1f17";
    if (kind === "polaroid") return "#b88a3e";
    if (kind === "note") return "#b88a3e";
    if (kind === "quote") return "#7a8268";
    return "#a89883";
  };

  return (
    <div
      data-no-drag
      className="fixed bottom-5 right-5 z-40 bg-paper/90 backdrop-blur border border-ink/10 rounded-md p-2 shadow-lg"
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        onClick={handleClick}
        className={cn("block cursor-crosshair")}
      >
        <rect width={W} height={H} fill="#f4ece0" />
        <defs>
          <pattern id="dots" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.6" fill="#2a1f17" opacity="0.15" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#dots)" />
        {cards.map((c) => (
          <circle
            key={c.id}
            cx={c.x * sx}
            cy={c.y * sy}
            r={c.kind === "project" ? 2.4 : c.kind === "sticker" ? 1 : 1.6}
            fill={dotColor(c.kind)}
          />
        ))}
        <rect
          x={Math.max(0, vxWorld * sx)}
          y={Math.max(0, vyWorld * sy)}
          width={Math.min(W, vwWorld * sx)}
          height={Math.min(H, vhWorld * sy)}
          fill="none"
          stroke="#c4623d"
          strokeWidth="1.2"
          rx="2"
        />
      </svg>
      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted text-center">
        Minimap · click to jump
      </p>
    </div>
  );
}
