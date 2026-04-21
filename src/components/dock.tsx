"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "motion/react";
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
  const [hovered, setHovered] = useState<DockKey | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const prefersReducedMotion = useReducedMotion();

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

      const now = ctx.currentTime + 0.005;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.55, now);
      master.connect(ctx.destination);

      // 1. Transient "tick" — noise burst through narrow bandpass @ 2.4kHz
      const tickBuf = ctx.createBuffer(
        1,
        Math.floor(ctx.sampleRate * 0.04),
        ctx.sampleRate,
      );
      const td = tickBuf.getChannelData(0);
      for (let i = 0; i < td.length; i++) {
        const env = Math.pow(1 - i / td.length, 2.5);
        td[i] = (Math.random() * 2 - 1) * env;
      }
      const tick = ctx.createBufferSource();
      tick.buffer = tickBuf;
      const tickBp = ctx.createBiquadFilter();
      tickBp.type = "bandpass";
      tickBp.frequency.value = 2400;
      tickBp.Q.value = 6.5;
      const tickGain = ctx.createGain();
      tickGain.gain.setValueAtTime(0.0001, now);
      tickGain.gain.exponentialRampToValueAtTime(0.9, now + 0.002);
      tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
      tick.connect(tickBp);
      tickBp.connect(tickGain);
      tickGain.connect(master);

      // 2. Body "thock" — short low triangle through lowpass
      const body = ctx.createOscillator();
      body.type = "triangle";
      body.frequency.setValueAtTime(210, now);
      body.frequency.exponentialRampToValueAtTime(140, now + 0.06);
      const bodyLp = ctx.createBiquadFilter();
      bodyLp.type = "lowpass";
      bodyLp.frequency.value = 800;
      bodyLp.Q.value = 0.7;
      const bodyGain = ctx.createGain();
      bodyGain.gain.setValueAtTime(0.0001, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.18, now + 0.006);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      body.connect(bodyLp);
      bodyLp.connect(bodyGain);
      bodyGain.connect(master);

      tick.start(now);
      body.start(now);
      body.stop(now + 0.1);
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
      className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2"
    >
      <LayoutGroup id="portfolio-dock">
        <motion.div
          className="flex items-center gap-1 rounded-full border border-ink/10 bg-paper/90 p-1.5 pr-2 shadow-[0_16px_45px_rgba(42,31,23,0.12)] backdrop-blur-xl"
          initial={
            prefersReducedMotion ? false : { opacity: 0, y: 12, scale: 0.98 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.8 }}
        >
          {items.map((it) => {
            const isActive = active === it.key;
            const isHovered = hovered === it.key;
            return (
              <motion.button
                layout
                key={it.key}
                onClick={() => handle(it.key)}
                onHoverStart={() => setHovered(it.key)}
                onHoverEnd={() =>
                  setHovered((prev) => (prev === it.key ? null : prev))
                }
                whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
                aria-pressed={isActive}
                aria-label={it.label}
                className={cn(
                  "group relative isolate flex h-8 min-w-8 items-center justify-center overflow-hidden rounded-full px-2 text-ink-muted outline-none transition-colors duration-200",
                  "focus-visible:ring-2 focus-visible:ring-terracotta/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
                  isActive ? "text-cream" : "hover:text-ink",
                )}
              >
                {isHovered && !isActive && (
                  <motion.span
                    layoutId="dock-hover-pill"
                    className="absolute inset-0 rounded-full bg-cream-deep/70"
                    transition={{
                      type: "spring",
                      stiffness: 340,
                      damping: 30,
                    }}
                  />
                )}
                {isActive && (
                  <motion.span
                    layoutId="dock-active-pill"
                    className="absolute inset-0 rounded-full bg-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_8px_18px_rgba(42,31,23,0.18)]"
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 30,
                    }}
                  />
                )}
                <motion.span
                  layout="position"
                  className="relative z-10 flex h-4 w-4 shrink-0 items-center justify-center"
                  transition={{ type: "spring", stiffness: 280, damping: 30 }}
                >
                  <it.Icon filled={isActive} />
                </motion.span>
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.span
                      key="label"
                      className="relative z-10 overflow-hidden whitespace-nowrap font-serif text-[15px] italic leading-none tracking-tight"
                      initial={
                        prefersReducedMotion
                          ? false
                          : { width: 0, opacity: 0, marginLeft: 0 }
                      }
                      animate={{
                        width: "auto",
                        opacity: 1,
                        marginLeft: 6,
                      }}
                      exit={
                        prefersReducedMotion
                          ? undefined
                          : { width: 0, opacity: 0, marginLeft: 0 }
                      }
                      transition={{
                        type: "spring",
                        stiffness: 280,
                        damping: 30,
                      }}
                    >
                      <span className="block pr-1">{it.label}</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
          <span className="mx-1 h-5 w-px bg-ink/10" aria-hidden />
          <motion.div
            layout
            className="flex h-8 items-center gap-2 px-3 text-ink-muted"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-sage animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] leading-none">
              KHI · {time || "—"}
            </span>
          </motion.div>
        </motion.div>
      </LayoutGroup>
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill="currentColor" />
      <circle cx="12" cy="12" r="1.35" fill="var(--ink)" />
      <path
        d="M12 7.2V12l3.1 2"
        stroke="var(--ink)"
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" fill="currentColor" />
      <path
        d="M4.5 7.2 12 13l7.5-5.8"
        stroke="var(--ink)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m4.8 17 5.1-4.3M19.2 17l-5.1-4.3"
        stroke="var(--ink)"
        strokeWidth="1.35"
        strokeLinecap="round"
        opacity="0.55"
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
