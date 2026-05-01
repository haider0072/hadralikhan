"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePanZoom } from "./use-pan-zoom";
import { cards as initialCards, WORLD, BOARD_HOME } from "./layout";
import { CardRenderer } from "./cards";
import { Minimap } from "./minimap";
import { MultiplayerCursors } from "@/components/multiplayer/multiplayer-cursors";
import { FloatingReactions } from "@/components/multiplayer/floating-reactions";
import { SlashMenu } from "@/components/multiplayer/slash-menu";
import { FloatingComments } from "@/components/multiplayer/floating-comments";
import {
  FollowController,
  FollowingIndicatorMount,
} from "@/components/multiplayer/follow-controller";
import { useRealtime } from "@/components/multiplayer/realtime-context";
import { cn } from "@/lib/cn";
import type { BoardCard, Viewport } from "./types";
import type { GithubStats } from "@/lib/github";

const STORAGE_KEY = "haider.board.layout.v1";
const DRAG_THRESHOLD = 8;

type Positions = Record<string, { x: number; y: number }>;

export function BoardCanvas({
  github,
  dimmed = false,
  followingId,
  onFollowChange,
}: {
  github: GithubStats | null;
  dimmed?: boolean;
  followingId: string | null;
  onFollowChange: (id: string | null) => void;
}) {
  const { containerRef, viewport, setViewport, isDragging } = usePanZoom({
    world: WORLD,
    minScale: 0.3,
    maxScale: 2,
    initial: { x: BOARD_HOME.x, y: BOARD_HOME.y, scale: BOARD_HOME.scale },
  });

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [showHint, setShowHint] = useState(true);
  const [positions, setPositions] = useState<Positions>({});
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [topIndex, setTopIndex] = useState<Record<string, number>>({});
  const topCounter = useRef(100);
  const viewportRef = useRef(viewport);
  viewportRef.current = viewport;

  // Compose current card state (base + override positions). Memoized so
  // pan/zoom (which re-renders this component every frame) doesn't thrash
  // all card children through React reconciliation.
  const cards: BoardCard[] = useMemo(
    () =>
      initialCards.map((c) =>
        positions[c.id]
          ? { ...c, x: positions[c.id].x, y: positions[c.id].y }
          : c,
      ),
    [positions],
  );

  // Derive a coarse zoom step that only flips when crossing the 0.55
  // threshold — used to toggle expensive prototype animations active/idle.
  // This keeps continuous scale changes from invalidating the card list.
  const isZoomedIn = viewport.scale >= 0.55;
  const activity: "active" | "idle" =
    dimmed || !isZoomedIn ? "idle" : "active";

  // Load layout from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPositions(JSON.parse(raw));
    } catch {}
  }, []);

  // Persist on change (debounced)
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
      } catch {}
    }, 250);
    return () => clearTimeout(id);
  }, [positions]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 5200);
    return () => clearTimeout(t);
  }, []);

  // Stable realtime callbacks only — `others` lives in a separate context so
  // BoardCanvas doesn't re-render on every cursor broadcast.
  const { updateCursor } = useRealtime();

  // Cancel follow on user pan / zoom / esc
  useEffect(() => {
    if (!followingId) return;
    const cancel = () => onFollowChange(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cancel();
    };
    const el = containerRef.current;
    el?.addEventListener("pointerdown", cancel);
    el?.addEventListener("wheel", cancel);
    window.addEventListener("keydown", onKey);
    return () => {
      el?.removeEventListener("pointerdown", cancel);
      el?.removeEventListener("wheel", cancel);
      window.removeEventListener("keydown", onKey);
    };
  }, [followingId, containerRef, onFollowChange]);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const v = viewportRef.current;
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const worldX = (sx - v.x) / v.scale;
      const worldY = (sy - v.y) / v.scale;
      updateCursor({ worldX, worldY });
    };
    el.addEventListener("pointermove", onMove);
    return () => {
      el.removeEventListener("pointermove", onMove);
    };
  }, [containerRef, updateCursor]);

  const onMinimapJump = useCallback(
    (wx: number, wy: number) => {
      animateTo(
        { wx, wy, scale: viewportRef.current.scale },
        viewportRef.current,
        setViewport,
        size,
      );
    },
    [setViewport, size],
  );

  // Per-card drag
  const dragRef = useRef<{
    id: string;
    pointerId: number;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);

  const bringToFront = useCallback((id: string) => {
    topCounter.current += 1;
    setTopIndex((prev) => ({ ...prev, [id]: topCounter.current }));
  }, []);

  const onCardPointerDown = useCallback(
    (e: React.PointerEvent, card: BoardCard) => {
      const t = e.target as HTMLElement | null;
      if (t && t.closest("a, button")) return;
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {}
      dragRef.current = {
        id: card.id,
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        origX: card.x,
        origY: card.y,
        moved: false,
      };
      setActiveCardId(card.id);
      bringToFront(card.id);
    },
    [bringToFront],
  );

  const onCardPointerMove = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const screenDx = e.clientX - d.startX;
    const screenDy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(screenDx, screenDy) > DRAG_THRESHOLD) {
      d.moved = true;
    }
    if (!d.moved) return;
    const scale = viewportRef.current.scale;
    const nx = d.origX + screenDx / scale;
    const ny = d.origY + screenDy / scale;
    setPositions((prev) => ({ ...prev, [d.id]: { x: nx, y: ny } }));
  }, []);

  const onCardPointerUp = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    if (d.moved) suppressClickRef.current = true;
    dragRef.current = null;
    setActiveCardId(null);
  }, []);

  const onCardClickCapture = useCallback((e: React.MouseEvent) => {
    if (suppressClickRef.current) {
      e.preventDefault();
      e.stopPropagation();
      suppressClickRef.current = false;
    }
  }, []);

  const onDoubleClickCard = useCallback(
    (c: BoardCard) => {
      animateTo(
        { wx: c.x, wy: c.y, scale: 1.4 },
        viewportRef.current,
        setViewport,
        size,
      );
    },
    [setViewport, size],
  );

  // Render the card list once per "meaningful" state change. Viewport pan
  // frames don't touch this tree.
  const cardList = useMemo(
    () =>
      cards.map((c) => {
        const isActive = activeCardId === c.id;
        const base = (c.depth ?? 1) * 2 + (c.kind === "sticker" ? 5 : 0);
        const z = topIndex[c.id] ?? base;
        const slug =
          c.kind === "project" || c.kind === "prototype" ? c.slug : undefined;
        return (
          <div
            key={c.id}
            data-no-drag
            data-card-id={c.id}
            data-card-slug={slug}
            className={cn(
              "absolute",
              isActive
                ? "cursor-grabbing"
                : "cursor-grab active:cursor-grabbing",
            )}
            style={{
              left: c.x,
              top: c.y,
              transform: `translate(-50%, -50%) rotate(${
                isActive ? 0 : (c.rotation ?? 0)
              }deg) ${isActive ? "scale(1.03)" : ""}`,
              transformOrigin: "center center",
              zIndex: z,
              filter: isActive
                ? "drop-shadow(0 20px 40px rgba(42,31,23,0.25))"
                : undefined,
              transition: isActive
                ? "none"
                : "transform 180ms ease, filter 180ms ease",
            }}
            onPointerDown={(e) => onCardPointerDown(e, c)}
            onPointerMove={onCardPointerMove}
            onPointerUp={onCardPointerUp}
            onPointerCancel={onCardPointerUp}
            onClickCapture={onCardClickCapture}
            onDoubleClick={() => onDoubleClickCard(c)}
          >
            <CardRenderer card={c} activity={activity} github={github} />
          </div>
        );
      }),
    [
      cards,
      activeCardId,
      topIndex,
      activity,
      github,
      onCardPointerDown,
      onCardPointerMove,
      onCardPointerUp,
      onCardClickCapture,
      onDoubleClickCard,
    ],
  );

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          "fixed inset-0 overflow-hidden touch-none select-none bg-cream",
          dimmed
            ? "pointer-events-none"
            : isDragging
              ? "cursor-grabbing"
              : "cursor-grab",
        )}
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(42,31,23,0.14) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          backgroundPosition: `${viewport.x}px ${viewport.y}px`,
        }}
      >
        <div
          className="absolute top-0 left-0 will-change-transform"
          style={{
            width: `${WORLD.w}px`,
            height: `${WORLD.h}px`,
            transform: `translate3d(${viewport.x}px, ${viewport.y}px, 0) scale(${viewport.scale})`,
            transformOrigin: "0 0",
            filter: dimmed
              ? "blur(3px) brightness(0.96) saturate(0.9)"
              : undefined,
            opacity: dimmed ? 0.6 : 1,
            transition:
              "filter 600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 600ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {cardList}
          <FloatingReactions />
          <FloatingComments />
        </div>
      </div>

      <MultiplayerCursors viewport={viewport} followingId={followingId} />
      <FollowController
        followingId={followingId}
        containerRef={containerRef}
        viewportRef={viewportRef}
        setViewport={setViewport}
        onUserGone={() => onFollowChange(null)}
      />
      {followingId && (
        <FollowingIndicatorMount
          followingId={followingId}
          onExit={() => onFollowChange(null)}
        />
      )}
      <SlashMenu viewportRef={viewportRef} containerRef={containerRef} />

      {/* Top-left brand */}
      <div
        data-no-drag
        className="fixed top-5 left-5 z-40 flex items-center gap-3 bg-paper/80 backdrop-blur border border-ink/10 rounded-full px-4 py-2"
      >
        <span className="h-2 w-2 rounded-full bg-terracotta animate-pulse" />
        <span className="font-serif text-sm italic tracking-tight">
          Haider<span className="text-terracotta">.</span>
        </span>
        <span className="hidden md:inline font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
          Portfolio · Board
        </span>
      </div>

      {/* Drag hint */}
      <div
        data-no-drag
        className={cn(
          "fixed top-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-paper/90 backdrop-blur border border-ink/10 rounded-full px-5 py-2.5 transition-opacity duration-700 pointer-events-none",
          showHint ? "opacity-100" : "opacity-0",
        )}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M7 7l10 10M17 7L7 17"
            stroke="#2a1f17"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span className="font-hand text-lg text-ink">
          drag the board to pan · pick up any card · scroll to zoom
        </span>
      </div>

      {/* Zoom indicator */}
      <div
        data-no-drag
        className="fixed bottom-5 left-5 z-40 bg-paper/90 backdrop-blur border border-ink/10 rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted"
      >
        Zoom · {Math.round(viewport.scale * 100)}%
      </div>

      <Minimap
        cards={cards}
        world={WORLD}
        viewport={viewport}
        containerSize={size}
        onJump={onMinimapJump}
      />

    </>
  );
}

function animateTo(
  target: { wx: number; wy: number; scale: number },
  current: Viewport,
  setViewport: (v: Viewport) => void,
  size: { w: number; h: number },
) {
  const targetView: Viewport = {
    x: size.w / 2 - target.wx * target.scale,
    y: size.h / 2 - target.wy * target.scale,
    scale: target.scale,
  };
  const start = { ...current };
  const duration = 700;
  const t0 = performance.now();
  const ease = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const tick = () => {
    const now = performance.now();
    const t = Math.min(1, (now - t0) / duration);
    const e = ease(t);
    setViewport({
      x: start.x + (targetView.x - start.x) * e,
      y: start.y + (targetView.y - start.y) * e,
      scale: start.scale + (targetView.scale - start.scale) * e,
    });
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
