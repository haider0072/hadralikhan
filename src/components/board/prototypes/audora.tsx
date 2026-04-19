"use client";

import { useEffect, useRef, useState } from "react";
import type { CardActivity } from "../use-card-activity";

const BAR_COUNT = 44;

export function AudoraPrototype({ activity }: { activity: CardActivity }) {
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0.32);
  const bars = useRef<HTMLDivElement[]>([]);
  const rafRef = useRef<number | null>(null);
  const tRef = useRef(0);

  // Waveform animation — runs only when active AND playing
  useEffect(() => {
    if (activity === "idle" || !playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }
    const tick = () => {
      tRef.current += 0.06;
      for (let i = 0; i < bars.current.length; i++) {
        const el = bars.current[i];
        if (!el) continue;
        const h =
          18 +
          Math.abs(Math.sin(tRef.current + i * 0.35)) * 44 +
          Math.abs(Math.sin(tRef.current * 1.7 + i * 0.6)) * 14;
        el.style.height = `${h}px`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [activity, playing]);

  // Progress tick
  useEffect(() => {
    if (activity === "idle" || !playing) return;
    const id = setInterval(() => {
      setProgress((p) => (p >= 1 ? 0 : p + 0.003));
    }, 80);
    return () => clearInterval(id);
  }, [activity, playing]);

  return (
    <div
      data-no-drag
      onPointerDown={(e) => e.stopPropagation()}
      className="relative w-[320px] bg-gradient-to-br from-[#1d1612] to-[#2a1f17] text-cream p-5 rounded-sm shadow-[0_18px_40px_-10px_rgba(42,31,23,0.55)] select-none"
    >
      {/* Faux window controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#c4623d]" />
          <span className="h-2 w-2 rounded-full bg-[#b88a3e]" />
          <span className="h-2 w-2 rounded-full bg-[#7a8268]" />
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-cream/50">
          Audora · v0.4
        </span>
      </div>

      {/* Track meta */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 rounded-sm bg-gradient-to-br from-[#c4623d] to-[#8a4e28] flex items-center justify-center">
          <span className="font-serif italic text-xl text-cream/90">a</span>
        </div>
        <div className="min-w-0">
          <p className="font-serif text-base leading-tight truncate">
            Midnight in Kyoto
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/50 truncate">
            Hiroshi Yoshimura · FLAC · 44.1kHz
          </p>
        </div>
      </div>

      {/* Waveform */}
      <div className="flex items-center justify-center gap-[3px] h-[70px] mb-3">
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) bars.current[i] = el;
            }}
            className="w-[3px] rounded-full transition-[height] duration-75"
            style={{
              height: "24px",
              background:
                i / BAR_COUNT < progress
                  ? "linear-gradient(to top, #c4623d, #e9a45a)"
                  : "#f4ece022",
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2 font-mono text-[10px] text-cream/60">
        <span>
          {formatTime(progress * 213)}
        </span>
        <div className="flex-1 h-[3px] bg-cream/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-terracotta to-ochre"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span>3:33</span>
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-center gap-5">
        <button
          data-cursor-text="prev"
          aria-label="Previous"
          className="text-cream/70 hover:text-cream transition-colors"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setProgress(0)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4v16M20 4v16L8 12z" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </button>
        <button
          data-cursor-text={playing ? "pause" : "play"}
          aria-label={playing ? "Pause" : "Play"}
          className="h-11 w-11 rounded-full bg-terracotta hover:bg-ochre flex items-center justify-center transition-colors"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#f4ece0">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#f4ece0">
              <path d="M6 4l14 8-14 8z" />
            </svg>
          )}
        </button>
        <button
          data-cursor-text="next"
          aria-label="Next"
          className="text-cream/70 hover:text-cream transition-colors"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setProgress(Math.min(1, progress + 0.2))}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 4v16M18 4v16M4 12l12-8v16z" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>

      {/* Project label strip */}
      <div className="mt-4 pt-3 border-t border-cream/10 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-cream/50">
        <span>Audora · Pro music player</span>
        <span>2025</span>
      </div>
    </div>
  );
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${ss}`;
}
