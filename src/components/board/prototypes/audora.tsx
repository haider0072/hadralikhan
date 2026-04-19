"use client";

import { useEffect, useRef, useState } from "react";
import type { CardActivity } from "../use-card-activity";
import { ProjectFrame } from "../project-frame";
import { FocusModal } from "../focus-modal";
import { cn } from "@/lib/cn";

const TRACKS = [
  { title: "Midnight in Kyoto", artist: "Hiroshi Yoshimura", duration: 213, album: "静かな夜" },
  { title: "Wabi", artist: "Haruomi Hosono", duration: 187, album: "Glass Garden" },
  { title: "Soft Rain, Osaka", artist: "Mariah", duration: 244, album: "Utakata no Hibi" },
  { title: "Seaside Drive", artist: "Yasuaki Shimizu", duration: 298, album: "Kakashi" },
];

export function AudoraPrototype({ activity }: { activity: CardActivity }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <AudoraPeek activity={activity} onOpen={() => setOpen(true)} />
      <FocusModal open={open} onClose={() => setOpen(false)} projectKey="Audora">
        <AudoraFocus />
      </FocusModal>
    </>
  );
}

function AudoraPeek({
  activity,
  onOpen,
}: {
  activity: CardActivity;
  onOpen: () => void;
}) {
  const bars = useRef<HTMLDivElement[]>([]);
  const raf = useRef<number | null>(null);
  const t = useRef(0);

  useEffect(() => {
    if (activity === "idle") {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
      return;
    }
    const tick = () => {
      t.current += 0.05;
      for (let i = 0; i < bars.current.length; i++) {
        const el = bars.current[i];
        if (!el) continue;
        const h = 6 + Math.abs(Math.sin(t.current + i * 0.4)) * 18;
        el.style.height = `${h}px`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [activity]);

  return (
    <ProjectFrame
      meta={{
        year: "2025",
        title: "Audora",
        tagline: "A modern music player — FLAC, EQ, cloud sync, beautiful.",
      }}
      innerClassName="bg-gradient-to-br from-[#fdf2f8] via-[#fce7f3] to-[#ffe4e6]"
      onOpen={onOpen}
      tape="top-right"
    >
      {/* Rose glow */}
      <div className="absolute -top-8 -right-10 w-44 h-44 rounded-full bg-[#e11d48]/25 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-[#fb7185]/20 blur-3xl" />

      {/* Album art */}
      <div className="absolute inset-4 flex items-center gap-3">
        <div className="relative h-28 w-28 rounded-md bg-gradient-to-br from-[#e11d48] via-[#be185d] to-[#831843] shadow-lg flex items-center justify-center shrink-0">
          <svg
            viewBox="0 0 100 100"
            className="w-20 h-20 opacity-90"
            aria-hidden
          >
            <circle cx="50" cy="50" r="46" fill="#1f1a1e" />
            <circle cx="50" cy="50" r="32" fill="none" stroke="#fda4af" strokeWidth="0.4" opacity="0.5" />
            <circle cx="50" cy="50" r="22" fill="none" stroke="#fda4af" strokeWidth="0.4" opacity="0.5" />
            <circle cx="50" cy="50" r="12" fill="#e11d48" />
            <circle cx="50" cy="50" r="2" fill="#fce7f3" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#9f1239]">
            Now playing
          </span>
          <p className="mt-1 font-semibold text-[#4c0519] leading-tight truncate">
            Midnight in Kyoto
          </p>
          <p className="text-[11px] text-[#9f1239] truncate">
            Hiroshi Yoshimura
          </p>

          {/* Mini waveform */}
          <div className="mt-3 flex items-end gap-[2px] h-[24px]">
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                ref={(el) => {
                  if (el) bars.current[i] = el;
                }}
                className="w-[2px] rounded-full bg-[#e11d48] transition-[height] duration-75"
                style={{ height: "8px", opacity: i < 10 ? 1 : 0.35 }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lower stripe */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-[#9f1239]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#e11d48] animate-pulse" />
          <span>FLAC · 44.1kHz</span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#9f1239]">
          Next.js · shadcn
        </span>
      </div>
    </ProjectFrame>
  );
}

function AudoraFocus() {
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0.32);
  const [dark, setDark] = useState(true);
  const bars = useRef<HTMLDivElement[]>([]);
  const raf = useRef<number | null>(null);
  const t = useRef(0);

  const track = TRACKS[trackIdx];

  useEffect(() => {
    if (!playing) {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
      return;
    }
    const tick = () => {
      t.current += 0.06;
      for (let i = 0; i < bars.current.length; i++) {
        const el = bars.current[i];
        if (!el) continue;
        const h =
          18 + Math.abs(Math.sin(t.current + i * 0.28)) * 52 +
          Math.abs(Math.sin(t.current * 1.7 + i * 0.5)) * 10;
        el.style.height = `${h}px`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [playing]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 1) {
          setTrackIdx((i) => (i + 1) % TRACKS.length);
          return 0;
        }
        return p + 1 / track.duration / 3;
      });
    }, 100);
    return () => clearInterval(id);
  }, [playing, track.duration]);

  const bg = dark ? "bg-[#0a0a0a] text-[#fafafa]" : "bg-white text-[#0a0a0a]";
  const surface = dark ? "bg-[#18181b]" : "bg-[#f4f4f5]";
  const subtle = dark ? "text-[#a1a1aa]" : "text-[#71717a]";
  const border = dark ? "border-white/10" : "border-black/10";

  return (
    <div
      className={cn(
        "w-[min(1000px,94vw)] h-[min(640px,88vh)] grid grid-cols-[340px_1fr] font-sans",
        bg,
      )}
    >
      {/* Sidebar — library */}
      <aside className={cn("border-r p-5 overflow-y-auto", border)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-[#e11d48] flex items-center justify-center text-white font-semibold text-sm">
              a
            </div>
            <span className="font-semibold tracking-tight">Audora</span>
          </div>
          <button
            onClick={() => setDark((d) => !d)}
            className={cn(
              "h-7 px-2.5 rounded-full border text-[11px] font-medium transition-colors",
              border,
              dark
                ? "hover:bg-white/10"
                : "hover:bg-black/5",
            )}
          >
            {dark ? "Light" : "Dark"}
          </button>
        </div>

        <div className={cn("mt-5 rounded-lg px-3 py-2 flex items-center gap-2", surface)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" />
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
          <span className={cn("text-xs", subtle)}>Search library</span>
        </div>

        <div className="mt-6">
          <p className={cn("font-mono text-[10px] uppercase tracking-[0.2em] mb-3", subtle)}>
            Queue · {TRACKS.length} tracks
          </p>
          <ul className="space-y-1">
            {TRACKS.map((tr, i) => (
              <li key={tr.title}>
                <button
                  onClick={() => {
                    setTrackIdx(i);
                    setProgress(0);
                    setPlaying(true);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md flex items-center gap-3 transition-colors",
                    i === trackIdx
                      ? "bg-[#e11d48]/10 text-[#e11d48]"
                      : dark
                        ? "hover:bg-white/5"
                        : "hover:bg-black/5",
                  )}
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded shrink-0 bg-gradient-to-br",
                      [
                        "from-[#e11d48] to-[#831843]",
                        "from-[#f43f5e] to-[#881337]",
                        "from-[#fb7185] to-[#9f1239]",
                        "from-[#fda4af] to-[#be185d]",
                      ][i % 4],
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{tr.title}</p>
                    <p className={cn("text-xs truncate", i === trackIdx ? "text-[#e11d48]/80" : subtle)}>
                      {tr.artist}
                    </p>
                  </div>
                  <span className={cn("text-[10px] font-mono shrink-0", subtle)}>
                    {formatTime(tr.duration)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main player */}
      <section className="p-8 flex flex-col justify-between relative overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#e11d48]/20 blur-3xl pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[#fb7185]/15 blur-3xl pointer-events-none"
          aria-hidden
        />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em]">
            <span className={subtle}>Now playing</span>
            <span className="h-1 w-1 rounded-full bg-current opacity-40" />
            <span className={subtle}>{track.album}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
            <span className={subtle}>Cloud synced</span>
          </div>
        </div>

        <div className="relative grid grid-cols-[auto_1fr] gap-8 items-center my-4">
          {/* Cover */}
          <div className="relative h-56 w-56 rounded-2xl bg-gradient-to-br from-[#e11d48] via-[#be185d] to-[#831843] shadow-2xl flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-40 h-40" aria-hidden>
              <circle cx="50" cy="50" r="46" fill="#1f1a1e" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#fda4af" strokeWidth="0.3" opacity="0.4" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="#fda4af" strokeWidth="0.3" opacity="0.4" />
              <circle cx="50" cy="50" r="22" fill="none" stroke="#fda4af" strokeWidth="0.3" opacity="0.4" />
              <circle cx="50" cy="50" r="14" fill="#e11d48" />
              <circle cx="50" cy="50" r="3" fill="#fce7f3" />
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="font-serif text-4xl tracking-tight leading-tight">{track.title}</h3>
            <p className={cn("mt-1 text-base", subtle)}>{track.artist}</p>
            <p className={cn("mt-0.5 text-sm", subtle)}>
              {track.album} · FLAC · 44.1 kHz · 24-bit
            </p>

            {/* EQ-style chips */}
            <div className="mt-4 flex gap-2 flex-wrap">
              {["Flat", "Jazz", "Classical", "Ambient", "Custom"].map((p, i) => (
                <button
                  key={p}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs border transition-colors",
                    border,
                    i === 3
                      ? "bg-[#e11d48] text-white border-[#e11d48]"
                      : dark
                        ? "hover:bg-white/10"
                        : "hover:bg-black/5",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Big waveform */}
        <div className="relative flex items-end justify-center gap-[3px] h-[80px] mb-4">
          {Array.from({ length: 72 }).map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) bars.current[i] = el;
              }}
              className="w-[3px] rounded-full transition-[height] duration-75"
              style={{
                height: "20px",
                background:
                  i / 72 < progress
                    ? "linear-gradient(to top, #e11d48, #fb7185)"
                    : dark
                      ? "#ffffff22"
                      : "#0a0a0a22",
              }}
            />
          ))}
        </div>

        {/* Progress */}
        <div className="relative flex items-center gap-3 font-mono text-xs mb-5">
          <span className={subtle}>{formatTime(progress * track.duration)}</span>
          <div className={cn("flex-1 h-[3px] rounded-full overflow-hidden", dark ? "bg-white/10" : "bg-black/10")}>
            <div
              className="h-full bg-gradient-to-r from-[#e11d48] to-[#fb7185]"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className={subtle}>{formatTime(track.duration)}</span>
        </div>

        {/* Transport */}
        <div className="relative flex items-center justify-center gap-6">
          <IconBtn ariaLabel="Shuffle" dark={dark}>
            <path d="M3 6h3l8 12h4m0 0l-2-2m2 2l-2 2M3 18h3l2-3M17 6h4m0 0l-2-2m2 2l-2 2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </IconBtn>
          <IconBtn
            ariaLabel="Previous"
            dark={dark}
            onClick={() => {
              setTrackIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length);
              setProgress(0);
            }}
          >
            <path d="M6 4v16M20 4v16L8 12z" stroke="currentColor" strokeWidth="1.75" fill="none" />
          </IconBtn>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="h-14 w-14 rounded-full bg-[#e11d48] hover:bg-[#be185d] flex items-center justify-center shadow-lg transition-colors"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M7 4l13 8-13 8z" />
              </svg>
            )}
          </button>
          <IconBtn
            ariaLabel="Next"
            dark={dark}
            onClick={() => {
              setTrackIdx((i) => (i + 1) % TRACKS.length);
              setProgress(0);
            }}
          >
            <path d="M4 4v16M18 4v16M4 12l12-8v16z" stroke="currentColor" strokeWidth="1.75" fill="none" />
          </IconBtn>
          <IconBtn ariaLabel="Repeat" dark={dark}>
            <path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" fill="none" />
          </IconBtn>
        </div>
      </section>
    </div>
  );
}

function IconBtn({
  children,
  ariaLabel,
  onClick,
  dark,
}: {
  children: React.ReactNode;
  ariaLabel: string;
  onClick?: () => void;
  dark: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
        dark ? "text-white/70 hover:text-white hover:bg-white/10" : "text-black/60 hover:text-black hover:bg-black/5",
      )}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        {children}
      </svg>
    </button>
  );
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${ss}`;
}
