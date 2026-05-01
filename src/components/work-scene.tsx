"use client";

import { animate } from "motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MochiPrototype } from "@/components/board/prototypes/mochi";
import { AudoraPrototype } from "@/components/board/prototypes/audora";
import { FlowCraftPrototype } from "@/components/board/prototypes/flowcraft";
import { EmberPrototype } from "@/components/board/prototypes/ember";
import { TradingBotPrototype } from "@/components/board/prototypes/trading-bot";
import { WiseSendPrototype } from "@/components/board/prototypes/wisesend";
import type { CardActivity } from "@/components/board/use-card-activity";

type ProtoProps = { activity: CardActivity };

const protoMap: Record<string, React.FC<ProtoProps>> = {
  mochi: MochiPrototype,
  audora: AudoraPrototype,
  flowcraft: FlowCraftPrototype,
  ember: EmberPrototype,
  "trading-bot": TradingBotPrototype,
  wisesend: WiseSendPrototype,
};

type Home = {
  cx: number;
  cy: number;
  scale: number;
  rotation: number;
  width: number;
  height: number;
};

function readRotationDeg(el: HTMLElement): number {
  const t = getComputedStyle(el).transform;
  if (!t || t === "none") return 0;
  const m = t.match(/matrix\(([^)]+)\)/);
  if (!m) return 0;
  const [a, b] = m[1].split(",").map((v) => parseFloat(v.trim()));
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return (Math.atan2(b, a) * 180) / Math.PI;
}

type Item = {
  slug: string;
  home: Home;
  target: {
    x: number;
    y: number;
    scale: number;
    rotation: number;
    delay: number;
  };
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export function WorkScene({ open, onClose }: Props) {
  const [items, setItems] = useState<Item[] | null>(null);
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState(0);
  const sessionRef = useRef(0);
  const originalsRef = useRef<HTMLElement[]>([]);
  const closeTimerRef = useRef<number | null>(null);

  // Open sequence: capture -> hide originals -> mount
  useEffect(() => {
    if (!open) return;

    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    // Bump session so FlyingItems fully remount on each open
    sessionRef.current += 1;
    const mySession = sessionRef.current;
    setSession(mySession);

    // If originals were previously hidden but not yet restored (mid-close),
    // restore them before we re-measure so rects reflect their true layout.
    originalsRef.current.forEach((el) => {
      el.style.opacity = "";
      el.style.pointerEvents = "";
    });
    originalsRef.current = [];

    const originals = Array.from(
      document.querySelectorAll<HTMLElement>("[data-card-slug]"),
    ).filter((el) => {
      const slug = el.getAttribute("data-card-slug");
      return !!slug && !!protoMap[slug];
    });

    if (originals.length === 0) return;

    // Capture positions (center + rotation so clone visually matches original)
    const captured: Item[] = originals.map((el, i) => {
      const rect = el.getBoundingClientRect();
      const ow = el.offsetWidth || rect.width;
      const oh = el.offsetHeight || rect.height;
      const rotation = readRotationDeg(el);
      // Derive parent/board scale from screen-space bbox vs natural size
      // (rotations are small so cos ~ 1; this is good enough)
      const rad = (rotation * Math.PI) / 180;
      const denom =
        ow * Math.abs(Math.cos(rad)) + oh * Math.abs(Math.sin(rad));
      const scale = denom > 0 ? rect.width / denom : 1;
      const cx = rect.x + rect.width / 2;
      const cy = rect.y + rect.height / 2;
      const slug = el.getAttribute("data-card-slug")!;
      return {
        slug,
        home: { cx, cy, scale, rotation, width: ow, height: oh },
        target: {
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          delay: i * 0.05,
        },
      };
    });

    // Compute grid targets
    const count = captured.length;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const topReserve = 190;
    const bottomReserve = 140;
    const sideReserve = 80;
    const availW = vw - sideReserve * 2;
    const availH = vh - topReserve - bottomReserve;

    const cols = count <= 4 ? count : count <= 9 ? 3 : 4;
    const rows = Math.ceil(count / cols);
    const cellW = availW / cols;
    const cellH = availH / rows;
    const padding = 0.94;

    captured.forEach((it, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const cx = sideReserve + cellW * (col + 0.5);
      const cy = topReserve + cellH * (row + 0.5);
      const fit = Math.min(
        (cellW * padding) / it.home.width,
        (cellH * padding) / it.home.height,
      );
      // Cards should feel big and present — let them go above 1.0 (live DOM,
      // no pixelation) but clamp so they never overflow the cell.
      const targetScale = Math.min(1.25, fit);
      it.target.x = cx; // center x
      it.target.y = cy; // center y
      it.target.scale = targetScale;
      it.target.rotation = Math.sin(i * 1.7 + 0.3) * 3;
    });

    // Hide originals
    originals.forEach((el) => {
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
    });
    originalsRef.current = originals;

    setItems(captured);
    setMounted(true);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Close sequence: animate back, then unmount + unhide
  useEffect(() => {
    if (open || !mounted || !items) return;
    const mySession = sessionRef.current;

    closeTimerRef.current = window.setTimeout(() => {
      // Another open may have started in the interim — bail if so.
      if (sessionRef.current !== mySession) return;
      originalsRef.current.forEach((el) => {
        el.style.opacity = "";
        el.style.pointerEvents = "";
      });
      originalsRef.current = [];
      setItems(null);
      setMounted(false);
      closeTimerRef.current = null;
    }, 900);

    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [open, mounted, items]);

  return (
    <>
      {/* Backdrop wash */}
      <div
        aria-hidden
        className={`fixed inset-0 z-40 bg-cream/85 transition-opacity duration-500 ease-out ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Editorial header */}
      <div
        className={`fixed top-10 left-1/2 -translate-x-1/2 z-[46] text-center pointer-events-none transition-opacity duration-500 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-muted mb-2">
          Featured · 2023 — now
        </p>
        <h2 className="font-serif italic text-5xl md:text-6xl tracking-tight leading-[0.95]">
          Selected <span className="text-terracotta">work</span>
        </h2>
      </div>

      <p
        className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[46] font-mono text-[10px] uppercase tracking-[0.28em] text-ink-muted pointer-events-none transition-opacity duration-500 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      >
        hover a card · click open for details · esc to close
      </p>

      {/* Backdrop click-to-close */}
      {open && (
        <button
          aria-label="Close"
          onClick={onClose}
          tabIndex={-1}
          className="fixed inset-0 z-[41]"
          style={{ background: "transparent" }}
        />
      )}

      {/* Close X */}
      {open && (
        <button
          onClick={onClose}
          className="fixed top-6 right-6 z-[70] h-10 w-10 rounded-full border border-ink/15 bg-paper/90 hover:bg-ink hover:text-cream text-ink-muted flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}

      {/* Flying items — live React prototypes. Key includes session so they
          fully remount on every open and never inherit stale gsap state. */}
      {mounted && items &&
        items.map((it) => (
          <FlyingItem
            key={`${session}-${it.slug}`}
            item={it}
            closing={!open}
          />
        ))}
    </>
  );
}

function FlyingItem({ item, closing }: { item: Item; closing: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const Cmp = protoMap[item.slug];
  const ow = item.home.width;
  const oh = item.home.height;

  // Home x/y for gsap (top-left such that center lands on home.cx, home.cy)
  const homeX = item.home.cx - ow / 2;
  const homeY = item.home.cy - oh / 2;
  const targetX = item.target.x - ow / 2;
  const targetY = item.target.y - oh / 2;

  // Track active animations so hover/close can cancel cleanly without
  // killTweensOf-style stragglers.
  const flightRef = useRef<ReturnType<typeof animate> | null>(null);
  const hoverRef = useRef<ReturnType<typeof animate> | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Animate per-property (x/y/scale/rotate) so Motion interpolates each
    // value and we don't fight with transform strings. [from, to] arrays
    // give Motion the explicit start state regardless of any inline style.
    flightRef.current = animate(
      el,
      {
        x: [homeX, targetX],
        y: [homeY, targetY],
        scale: [item.home.scale, item.target.scale],
        rotate: [item.home.rotation, item.target.rotation],
      },
      {
        duration: 1.1,
        delay: item.target.delay,
        ease: [0.16, 1, 0.3, 1],
      },
    );
    return () => {
      flightRef.current?.cancel();
      hoverRef.current?.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close: fly back to home exactly, matching rotation & scale.
  useEffect(() => {
    if (!closing) return;
    const el = ref.current;
    if (!el) return;
    flightRef.current?.cancel();
    hoverRef.current?.cancel();
    flightRef.current = animate(
      el,
      {
        x: homeX,
        y: homeY,
        scale: item.home.scale,
        rotate: item.home.rotation,
      },
      { duration: 0.75, ease: [0.65, 0, 0.35, 1] },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closing]);

  const onEnter = () => {
    const el = ref.current;
    if (!el || closing) return;
    hoverRef.current?.cancel();
    el.style.zIndex = "60";
    hoverRef.current = animate(
      el,
      {
        x: targetX,
        y: targetY,
        scale: item.target.scale * 1.06,
        rotate: 0,
      },
      { duration: 0.4, ease: [0.33, 1, 0.68, 1] },
    );
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el || closing) return;
    hoverRef.current?.cancel();
    el.style.zIndex = "50";
    hoverRef.current = animate(
      el,
      {
        x: targetX,
        y: targetY,
        scale: item.target.scale,
        rotate: item.target.rotation,
      },
      { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
    );
  };

  return (
    <div
      ref={ref}
      className="fixed z-[50] rounded-2xl shadow-[0_18px_36px_rgba(42,31,23,0.14)] hover:shadow-[0_30px_54px_rgba(42,31,23,0.22)] transition-shadow duration-300"
      style={{
        left: 0,
        top: 0,
        width: ow,
        height: oh,
        transformOrigin: "50% 50%",
        willChange: "transform",
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <Cmp activity="active" />
    </div>
  );
}
