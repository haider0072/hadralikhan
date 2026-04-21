"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type DockKey = "work" | "about" | "now" | "contact";

const items: {
  key: DockKey;
  label: string;
  Icon: (props: { filled: boolean }) => React.ReactElement;
}[] = [
  { key: "work", label: "Work", Icon: WorkIcon },
  { key: "about", label: "About", Icon: AboutIcon },
  { key: "now", label: "Now", Icon: NowIcon },
  { key: "contact", label: "Contact", Icon: ContactIcon },
];

export function Dock({
  active,
  onToggle,
}: {
  active: DockKey | null;
  onToggle: (k: DockKey) => void;
}) {
  const [time, setTime] = useState("");
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      const t = d.toLocaleTimeString("en-US", {
        timeZone: "Asia/Karachi",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setTime(t);
    };
    fmt();
    const id = setInterval(fmt, 30_000);
    return () => clearInterval(id);
  }, []);

  const playTick = () => {
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!audioCtxRef.current) audioCtxRef.current = new Ctx();
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") void ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 2200;

      osc.type = "triangle";
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.07);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.11);
    } catch {
      // ignore — audio is a nicety, not critical
    }
  };

  const handle = (k: DockKey) => {
    playTick();
    onToggle(k);
  };

  return (
    <div
      data-no-drag
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] flex items-stretch gap-1 bg-paper/90 backdrop-blur-md border border-ink/10 rounded-full pl-1.5 pr-2 py-1.5 shadow-[0_10px_30px_rgba(42,31,23,0.08)]"
    >
      {items.map((it) => {
        const isActive = active === it.key;
        return (
          <button
            key={it.key}
            onClick={() => handle(it.key)}
            aria-pressed={isActive}
            aria-label={it.label}
            className={cn(
              "group relative flex items-center gap-2 rounded-full transition-[color,background-color,padding] duration-300 ease-out",
              isActive
                ? "bg-ink text-cream px-3.5 py-1.5"
                : "text-ink-muted hover:text-ink hover:bg-cream-deep/60 px-2.5 py-1.5",
            )}
          >
            <span className="flex items-center justify-center w-4 h-4">
              <it.Icon filled={isActive} />
            </span>
            <span
              className={cn(
                "overflow-hidden font-serif italic text-[15px] leading-none tracking-tight transition-[max-width,opacity,margin] duration-300 ease-out whitespace-nowrap",
                isActive
                  ? "max-w-[120px] opacity-100 ml-0"
                  : "max-w-0 opacity-0 ml-0",
              )}
            >
              {it.label}
            </span>
          </button>
        );
      })}
      <span className="mx-1 w-px bg-ink/10 my-1.5" aria-hidden />
      <div className="flex items-center gap-2 px-3 text-ink-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-sage animate-pulse" />
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] leading-none">
          KHI · {time || "—"}
        </span>
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────
function WorkIcon({ filled }: { filled: boolean }) {
  return filled ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="5" width="8" height="6" rx="1.2" />
      <rect x="13" y="5" width="8" height="6" rx="1.2" />
      <rect x="3" y="13" width="8" height="6" rx="1.2" />
      <rect x="13" y="13" width="8" height="6" rx="1.2" />
    </svg>
  ) : (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="8" height="6" rx="1.2" />
      <rect x="13" y="5" width="8" height="6" rx="1.2" />
      <rect x="3" y="13" width="8" height="6" rx="1.2" />
      <rect x="13" y="13" width="8" height="6" rx="1.2" />
    </svg>
  );
}

function AboutIcon({ filled }: { filled: boolean }) {
  return filled ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6v1H4v-1z" />
    </svg>
  ) : (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

function NowIcon({ filled }: { filled: boolean }) {
  return filled ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="9" />
      <path
        d="M12 7v5l3.2 2"
        stroke="#f4ece0"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ) : (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </svg>
  );
}

function ContactIcon({ filled }: { filled: boolean }) {
  return filled ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 6.5C3 5.67 3.67 5 4.5 5h15c.83 0 1.5.67 1.5 1.5v11c0 .83-.67 1.5-1.5 1.5h-15A1.5 1.5 0 013 17.5v-11z" />
      <path
        d="M4 7l8 6 8-6"
        stroke="#f4ece0"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ) : (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}
