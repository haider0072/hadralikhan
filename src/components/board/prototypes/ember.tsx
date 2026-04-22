"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CardActivity } from "../use-card-activity";
import { ProjectFrame } from "../project-frame";
import { FocusModal } from "../focus-modal";
import { ProjectLinks } from "../project-links";
import { cn } from "@/lib/cn";

const EMBER = {
  bg: "#06090d",
  surface: "#12161c",
  surfaceHi: "#1a1f27",
  border: "#232933",
  primary: "#e42000",
  primaryGlow: "#ff4a1a",
  secondary: "#ff6b00",
  muted: "#8a8f99",
  text: "#f5f5f5",
};

export function EmberPrototype({ activity }: { activity: CardActivity }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <EmberPeek activity={activity} onOpen={() => setOpen(true)} />
      <FocusModal open={open} onClose={() => setOpen(false)} projectKey="Ember">
        <EmberFocus />
      </FocusModal>
    </>
  );
}

function EmberPeek({
  activity,
  onOpen,
}: {
  activity: CardActivity;
  onOpen: () => void;
}) {
  return (
    <ProjectFrame
      meta={{
        year: "2025",
        title: "Ember",
        tagline:
          "WebTorrent-style streaming on mobile. Play while downloading, anywhere.",
      }}
      innerClassName="bg-[#06090d]"
      onOpen={onOpen}
      tape="top-right"
    >
      {/* Glow backdrop */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-[#e42000] blur-[80px] opacity-40" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-[#ff6b00] blur-[70px] opacity-30" />
      </div>

      <div className="relative h-full flex items-center justify-center px-4">
        <EmberStage animated={activity === "active"} />
      </div>

      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg overflow-hidden bg-black ring-1 ring-[#e42000]/30 shadow-[0_0_16px_rgba(228,32,0,0.35)]">
            <Image
              src="/projects/ember-logo.png"
              alt="Ember"
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-white leading-none">
              Ember
            </p>
            <p className="text-[9px] text-[#8a8f99] mt-0.5">
              stream while downloading
            </p>
          </div>
        </div>
        <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-[#ff6b00] bg-black/60 backdrop-blur px-2 py-1 rounded-full ring-1 ring-[#e42000]/40">
          libtorrent4j
        </span>
      </div>
    </ProjectFrame>
  );
}

function EmberStage({ animated }: { animated: boolean }) {
  const [playheadPct, setPlayheadPct] = useState(8);
  const [seekTarget, setSeekTarget] = useState<number | null>(null);
  const [pieces, setPieces] = useState<number[]>(() => Array(40).fill(0));
  // piece state: 0=unknown, 1=low, 2=medium, 3=high priority, 4=top, 5=downloaded

  useEffect(() => {
    if (!animated) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let tick: ReturnType<typeof setInterval> | null = null;

    const run = () => {
      // Phase A: play from start, pieces fill sequentially
      setPlayheadPct(5);
      setSeekTarget(null);
      setPieces((prev) => {
        const next = [...prev];
        for (let i = 0; i < 4; i++) next[i] = 5;
        for (let i = 4; i < 8; i++) next[i] = 3;
        for (let i = 8; i < 40; i++) next[i] = 0;
        return next;
      });

      // slowly advance
      tick = setInterval(() => {
        setPlayheadPct((p) => Math.min(28, p + 0.8));
        setPieces((prev) => {
          const next = [...prev];
          const nextIdx = next.indexOf(3);
          if (nextIdx !== -1 && Math.random() > 0.3) {
            next[nextIdx] = 5;
            if (nextIdx + 4 < 40 && next[nextIdx + 4] === 0) {
              next[nextIdx + 4] = 3;
            }
          }
          return next;
        });
      }, 180);

      // Phase B: user seeks to 75%
      timers.push(
        setTimeout(() => {
          if (tick) clearInterval(tick);
          setSeekTarget(75);
          setPieces((prev) => {
            const next = [...prev];
            // mark target + surrounding as TOP / HIGH priority
            const target = Math.floor((75 / 100) * 40);
            for (let i = 0; i < 40; i++) {
              if (next[i] === 5) continue; // already downloaded
              if (i === target) next[i] = 4; // top
              else if (Math.abs(i - target) <= 2) next[i] = 4; // top
              else if (Math.abs(i - target) <= 5) next[i] = 3; // high
              else if (Math.abs(i - target) <= 10) next[i] = 2; // medium
              else next[i] = 1; // low
            }
            return next;
          });
        }, 2800),
      );

      // Phase C: pieces around target download fast
      timers.push(
        setTimeout(() => {
          setPlayheadPct(75);
          setPieces((prev) => {
            const next = [...prev];
            const target = Math.floor((75 / 100) * 40);
            for (let i = target - 2; i <= target + 2; i++) {
              if (i >= 0 && i < 40) next[i] = 5;
            }
            return next;
          });
        }, 4400),
      );

      // Phase D: continue playback from new point
      timers.push(
        setTimeout(() => {
          setSeekTarget(null);
          tick = setInterval(() => {
            setPlayheadPct((p) => Math.min(88, p + 0.9));
            setPieces((prev) => {
              const next = [...prev];
              const nextIdx = next.indexOf(3);
              if (nextIdx !== -1 && Math.random() > 0.3) next[nextIdx] = 5;
              return next;
            });
          }, 180);
        }, 5300),
      );

      timers.push(
        setTimeout(() => {
          if (tick) clearInterval(tick);
          run();
        }, 8000),
      );
    };
    run();

    return () => {
      timers.forEach(clearTimeout);
      if (tick) clearInterval(tick);
    };
  }, [animated]);

  return <EmberPhone pieces={pieces} playheadPct={playheadPct} seekTarget={seekTarget} />;
}

function EmberPhone({
  pieces,
  playheadPct,
  seekTarget,
}: {
  pieces: number[];
  playheadPct: number;
  seekTarget: number | null;
}) {
  return (
    <div className="relative">
      <div className="h-[200px] w-[112px] rounded-[22px] bg-black p-1 ring-1 ring-[#232933] shadow-[0_20px_50px_-12px_rgba(228,32,0,0.35)]">
        <div className="h-full w-full rounded-[18px] bg-[#06090d] overflow-hidden flex flex-col relative">
          {/* Notch */}
          <div className="h-3 flex items-center justify-center">
            <span className="h-[3px] w-12 rounded-full bg-black" />
          </div>

          {/* Video area */}
          <div className="mx-2 mt-1 rounded-md bg-black relative overflow-hidden aspect-video">
            {/* Fake video content */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f27] via-[#2a1810] to-[#06090d]" />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-semibold text-white/80"
              style={{ textShadow: "0 0 8px rgba(228,32,0,0.6)" }}
            >
              ▶
            </div>
            {/* Scan lines for aesthetic */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(180deg, transparent 0 2px, rgba(255,255,255,0.05) 2px 3px)",
              }}
            />
          </div>

          {/* Timeline */}
          <div className="mx-2 mt-1.5 relative">
            <div className="h-[3px] rounded-full bg-[#1a1f27] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#e42000] to-[#ff6b00] transition-all duration-300"
                style={{ width: `${playheadPct}%` }}
              />
            </div>
            {seekTarget !== null && (
              <div
                className="absolute -top-0.5 h-[5px] w-[2px] bg-[#ff6b00] rounded-full"
                style={{
                  left: `${seekTarget}%`,
                  boxShadow: "0 0 6px #ff6b00",
                }}
              />
            )}
          </div>

          {/* Piece grid */}
          <div className="mx-2 mt-2 grid grid-cols-10 gap-[1px]">
            {pieces.map((state, i) => (
              <span
                key={i}
                className="aspect-square rounded-[1px] transition-colors duration-300"
                style={{
                  background:
                    state === 5
                      ? "#e42000"
                      : state === 4
                        ? "#ff6b00"
                        : state === 3
                          ? "#cc5500"
                          : state === 2
                            ? "#553322"
                            : state === 1
                              ? "#2a1810"
                              : "#121419",
                  boxShadow:
                    state === 4 ? "0 0 4px #ff6b00" : undefined,
                }}
              />
            ))}
          </div>

          {/* Status strip */}
          <div className="mx-2 mt-2 flex-1 flex flex-col justify-end pb-1.5">
            <div className="flex items-center justify-between text-[5px] font-mono uppercase tracking-[0.12em]">
              <span className="text-[#8a8f99]">
                {seekTarget !== null
                  ? "prioritizing"
                  : playheadPct < 30
                    ? "streaming"
                    : "downloading"}
              </span>
              <span className="text-[#ff6b00]">
                {pieces.filter((s) => s === 5).length}/40
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <span className="h-[3px] w-[3px] rounded-full bg-[#e42000] animate-pulse" />
              <span className="text-[5px] text-[#e42000]">4 peers · 3.2 mb/s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ====================================================================
// FOCUS MODAL
// ====================================================================

type Tab = "stream" | "inside" | "story";

function EmberFocus() {
  const [tab, setTab] = useState<Tab>("stream");
  return (
    <div
      className="w-[min(1200px,96vw)] h-[min(760px,92vh)] grid grid-cols-[360px_1fr] overflow-hidden font-sans"
      style={{ background: EMBER.bg, color: EMBER.text }}
    >
      <Sidebar />
      <section className="flex flex-col overflow-hidden min-w-0">
        <TabBar tab={tab} setTab={setTab} />
        <div className="flex-1 overflow-hidden">
          {tab === "stream" && <StreamTab />}
          {tab === "inside" && <InsideTab />}
          {tab === "story" && <StoryTab />}
        </div>
      </section>
    </div>
  );
}

function Sidebar() {
  return (
    <aside
      className="p-7 overflow-y-auto border-r"
      style={{
        background: EMBER.surface,
        borderColor: EMBER.border,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="h-12 w-12 rounded-xl overflow-hidden ring-1 ring-[#e42000]/40 bg-black shrink-0"
          style={{ boxShadow: "0 0 20px rgba(228,32,0,0.3)" }}
        >
          <Image
            src="/projects/ember-logo.png"
            alt="Ember"
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold tracking-tight text-base leading-none">
            Ember
          </p>
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#8a8f99] mt-1">
            2025 · Torrent streamer
          </p>
        </div>
        <ProjectLinks
          dark
          links={[{ kind: "github", href: "https://github.com/haider0072/Ember" }]}
        />
      </div>

      <p className="mt-5 text-[13px] leading-relaxed text-[#b0b4bc]">
        A torrent player for Android that starts playing while the file
        is still downloading. The kind of experience WebTorrent gives you
        on the web, brought over to a phone. You paste a magnet link or
        URL, it decides what bytes you need first, the player starts.
      </p>

      <div className="mt-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#8a8f99] mb-2">
          My role
        </p>
        <p className="text-[13px] leading-relaxed text-[#b0b4bc]">
          Solo. Product design, the Flutter UI, the Kotlin native layer
          that wraps libtorrent4j, and the local HTTP streaming server
          that stitches them together. Plus the branding, the fire mark,
          the glow.
        </p>
      </div>

      <div className="mt-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#8a8f99] mb-2">
          Stack
        </p>
        <div className="flex flex-wrap gap-1.5">
          {[
            "Flutter",
            "Kotlin",
            "libtorrent4j",
            "NanoHTTPD",
            "media_kit",
            "Provider",
            "WorkManager",
            "SQLite",
            "Poppins",
          ].map((s) => (
            <span
              key={s}
              className="text-[10px] px-2 py-0.5 rounded border text-[#b0b4bc]"
              style={{
                borderColor: EMBER.border,
                background: EMBER.surfaceHi,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#8a8f99] mb-2">
          What it taught me
        </p>
        <p className="text-[13px] leading-relaxed text-[#b0b4bc]">
          Building on someone else&apos;s magic (WebTorrent on the web)
          is a specific skill. Mobile adds its own rules: foreground
          services, DHT bootstrapping, piece deadlines. Also, seeking
          across a half-downloaded torrent is still the hardest part, a
          whipsaw between the player and the piece picker that I am
          still untangling.
        </p>
      </div>

      <div
        className="mt-6 p-3 rounded-xl text-xs leading-relaxed"
        style={{
          background: "rgba(228,32,0,0.1)",
          color: "#ffb59e",
          border: "1px solid rgba(228,32,0,0.2)",
        }}
      >
        Friends use this one. It started as &ldquo;there is no
        WebTorrent for phones&rdquo; and ended up as my most-shared
        side project.
      </div>

    </aside>
  );
}

function TabBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { id: Tab; label: string }[] = [
    { id: "stream", label: "Stream" },
    { id: "inside", label: "Inside the app" },
    { id: "story", label: "Story" },
  ];
  return (
    <nav
      className="h-14 flex items-center pl-7 pr-24 gap-1 shrink-0 border-b"
      style={{ borderColor: EMBER.border, background: EMBER.surface }}
    >
      {items.map((item) => {
        const active = tab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={cn(
              "relative h-14 px-4 text-sm font-medium transition-colors",
              active ? "text-white" : "text-[#8a8f99] hover:text-white",
            )}
          >
            {item.label}
            {active && (
              <span
                className="absolute bottom-[-1px] left-4 right-4 h-[2px] rounded-full"
                style={{
                  background: "linear-gradient(90deg, #e42000, #ff6b00)",
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

// ====================================================================
// STREAM TAB
// ====================================================================

function StreamTab() {
  const [pieces, setPieces] = useState<number[]>(() => {
    const a = Array(100).fill(0);
    for (let i = 0; i < 12; i++) a[i] = 5;
    return a;
  });
  const [seekPct, setSeekPct] = useState<number | null>(null);
  const [phase, setPhase] = useState<"playing" | "seeking" | "recovered">("playing");
  const seekTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const legend = [
    { state: 5, label: "Downloaded", color: EMBER.primary },
    { state: 4, label: "Top · 500ms deadline", color: "#ff6b00" },
    { state: 3, label: "High · 2s", color: "#cc5500" },
    { state: 2, label: "Medium · 5s", color: "#553322" },
    { state: 1, label: "Low · background", color: "#2a1810" },
    { state: 0, label: "Unknown", color: "#121419" },
  ];

  const triggerSeek = (pct: number) => {
    if (seekTimer.current) clearTimeout(seekTimer.current);
    setSeekPct(pct);
    setPhase("seeking");
    setPieces((prev) => {
      const next = [...prev];
      const target = Math.floor((pct / 100) * 100);
      for (let i = 0; i < 100; i++) {
        if (next[i] === 5) continue;
        if (Math.abs(i - target) <= 2) next[i] = 4;
        else if (Math.abs(i - target) <= 6) next[i] = 3;
        else if (Math.abs(i - target) <= 12) next[i] = 2;
        else next[i] = 1;
      }
      return next;
    });

    seekTimer.current = setTimeout(() => {
      setPieces((prev) => {
        const next = [...prev];
        const target = Math.floor((pct / 100) * 100);
        for (let i = target - 3; i <= target + 3; i++) {
          if (i >= 0 && i < 100) next[i] = 5;
        }
        return next;
      });
      setPhase("recovered");
    }, 1400);
  };

  useEffect(() => {
    return () => {
      if (seekTimer.current) clearTimeout(seekTimer.current);
    };
  }, []);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[880px] mx-auto px-10 py-12">
        <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#ff6b00]">
          The trick
        </p>
        <h3 className="mt-1 text-2xl font-semibold tracking-tight text-white">
          Seek ahead. The pieces you need climb the queue.
        </h3>
        <p className="mt-2 text-sm text-[#b0b4bc] max-w-[640px] leading-relaxed">
          Each square is a torrent piece. Instead of downloading front to
          back, Ember watches what the player is asking for and pushes
          those bytes to the front of the queue with a hard deadline.
          Seeking a torrent feels more like seeking a downloaded file.
        </p>

        <div className="mt-10">
          <div
            className="rounded-2xl p-6"
            style={{
              background: EMBER.surface,
              border: `1px solid ${EMBER.border}`,
            }}
          >
            {/* Timeline bar with click to seek */}
            <div className="mb-3 flex items-center justify-between text-[11px] font-mono text-[#8a8f99]">
              <span>
                {phase === "playing"
                  ? "playing sequentially"
                  : phase === "seeking"
                    ? `prioritizing piece ${Math.floor((seekPct ?? 0) * 1)}`
                    : `recovered · ${seekPct}% ready to play`}
              </span>
              <span>{pieces.filter((s) => s === 5).length}/100 pieces</span>
            </div>

            <div className="relative h-12 rounded-lg overflow-hidden mb-5" style={{ background: "#000" }}>
              <div
                className="absolute inset-y-0 left-0"
                style={{
                  width: `${(pieces.filter((s) => s === 5).length / 100) * 100}%`,
                  background:
                    "linear-gradient(90deg, rgba(228,32,0,0.4), rgba(255,107,0,0.3))",
                }}
              />
              {seekPct !== null && (
                <div
                  className="absolute inset-y-0 w-[3px] bg-[#ff6b00]"
                  style={{
                    left: `${seekPct}%`,
                    boxShadow: "0 0 12px #ff6b00",
                  }}
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center gap-3">
                {[15, 45, 75, 92].map((p) => (
                  <button
                    key={p}
                    onClick={() => triggerSeek(p)}
                    className="px-3 h-7 rounded-md text-[10px] font-mono uppercase tracking-[0.18em] font-semibold border transition-colors"
                    style={{
                      background: "rgba(0,0,0,0.4)",
                      borderColor: EMBER.primary,
                      color: EMBER.text,
                    }}
                  >
                    seek {p}%
                  </button>
                ))}
              </div>
            </div>

            {/* Piece grid */}
            <div className="grid grid-cols-[repeat(50,1fr)] gap-[2px]">
              {pieces.map((state, i) => (
                <span
                  key={i}
                  className="aspect-square rounded-[1px] transition-colors duration-300"
                  style={{
                    background:
                      state === 5
                        ? "#e42000"
                        : state === 4
                          ? "#ff6b00"
                          : state === 3
                            ? "#cc5500"
                            : state === 2
                              ? "#553322"
                              : state === 1
                                ? "#2a1810"
                                : "#121419",
                    boxShadow: state === 4 ? "0 0 6px #ff6b00" : undefined,
                  }}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {legend.map((l) => (
                <div key={l.state} className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-[2px]"
                    style={{ background: l.color }}
                  />
                  <span className="text-xs text-[#b0b4bc]">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-xs text-[#8a8f99] font-mono">
            PiecePriorityManager.kt · libtorrent4j session · NanoHTTPD serves bytes as they land
          </p>
        </div>
      </div>
    </div>
  );
}

// ====================================================================
// INSIDE TAB
// ====================================================================

function InsideTab() {
  const screens = [
    {
      name: "Downloads",
      caption: "Active, completed, streams in one list.",
      content: (
        <div className="h-full p-3 flex flex-col gap-2" style={{ background: EMBER.bg }}>
          <div className="flex items-center gap-1 text-[8px] font-mono uppercase tracking-[0.12em]">
            <span className="px-1.5 py-0.5 rounded bg-[#e42000] text-white">
              active
            </span>
            <span className="text-[#8a8f99] px-1.5 py-0.5">done</span>
            <span className="text-[#8a8f99] px-1.5 py-0.5">streams</span>
          </div>
          {[
            { name: "Big Buck Bunny.mp4", pct: 42, c: "#e42000" },
            { name: "Sintel (2010) 1080p", pct: 72, c: "#ff6b00" },
            { name: "Tears of Steel 4K", pct: 18, c: "#cc5500" },
          ].map((f) => (
            <div
              key={f.name}
              className="rounded p-1.5"
              style={{ background: EMBER.surfaceHi }}
            >
              <p className="text-[8px] text-white font-semibold truncate">
                {f.name}
              </p>
              <div className="mt-1 h-[2px] rounded bg-black overflow-hidden">
                <div
                  className="h-full rounded"
                  style={{ width: `${f.pct}%`, background: f.c }}
                />
              </div>
              <p className="text-[6px] text-[#8a8f99] mt-0.5 font-mono">
                {f.pct}% · 2.4 mb/s
              </p>
            </div>
          ))}
        </div>
      ),
    },
    {
      name: "Player",
      caption: "media_kit + libmpv. Plays while downloading.",
      content: (
        <div className="h-full flex flex-col" style={{ background: "#000" }}>
          <div className="flex-1 relative">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, #1a1f27 0%, #2a1810 60%, #06090d 100%)",
              }}
            />
            <div
              className="absolute inset-0 flex items-center justify-center text-white/80 text-base"
              style={{ textShadow: "0 0 12px rgba(228,32,0,0.5)" }}
            >
              ▶
            </div>
          </div>
          <div className="px-2 py-1.5" style={{ background: "rgba(0,0,0,0.8)" }}>
            <div className="h-[2px] rounded bg-[#232933] overflow-hidden mb-1">
              <div
                className="h-full rounded"
                style={{
                  width: "56%",
                  background:
                    "linear-gradient(90deg, #e42000, #ff6b00)",
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[6px] text-[#8a8f99] font-mono">
              <span>14:32</span>
              <span>25:48</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Add magnet",
      caption: "Paste a link. Deep-link from browser works too.",
      content: (
        <div className="h-full p-3 flex flex-col gap-2" style={{ background: EMBER.bg }}>
          <p className="text-[7px] font-mono uppercase tracking-[0.12em] text-[#8a8f99]">
            new download
          </p>
          <div
            className="rounded p-1.5 flex items-center gap-1"
            style={{
              background: EMBER.surfaceHi,
              border: `1px solid ${EMBER.primary}`,
            }}
          >
            <span className="text-[6px] text-[#ff6b00]">⛓</span>
            <span
              className="text-[6px] font-mono truncate"
              style={{ color: EMBER.text }}
            >
              magnet:?xt=urn:btih:88594...
            </span>
          </div>
          <button
            className="h-5 rounded text-[7px] font-semibold text-white"
            style={{
              background:
                "linear-gradient(135deg, #e42000 0%, #ff6b00 100%)",
            }}
          >
            Start stream
          </button>
          <div className="mt-auto flex items-center gap-1 text-[6px] text-[#8a8f99]">
            <span>↓</span>
            <span>or drop a .torrent</span>
          </div>
        </div>
      ),
    },
    {
      name: "Notification",
      caption: "Background service keeps downloads alive.",
      content: (
        <div className="h-full p-3 flex flex-col gap-2" style={{ background: EMBER.bg }}>
          <div
            className="rounded p-2"
            style={{ background: EMBER.surfaceHi }}
          >
            <div className="flex items-center gap-1 mb-1">
              <div
                className="h-3 w-3 rounded"
                style={{
                  background:
                    "linear-gradient(135deg, #e42000, #ff6b00)",
                }}
              />
              <p className="text-[7px] font-semibold text-white flex-1">
                Ember
              </p>
              <span className="text-[5px] text-[#8a8f99]">now</span>
            </div>
            <p className="text-[7px] text-white truncate">
              Big Buck Bunny.mp4
            </p>
            <div className="mt-1 h-[2px] rounded bg-black overflow-hidden">
              <div
                className="h-full rounded"
                style={{ width: "42%", background: "#ff6b00" }}
              />
            </div>
            <p className="text-[5px] text-[#8a8f99] mt-1 font-mono">
              42% · 2.4 mb/s · ETA 3m
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="h-full overflow-y-auto px-10 py-10">
      <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#ff6b00]">
        Screen tour
      </p>
      <h3 className="mt-1 text-2xl font-semibold tracking-tight text-white">
        Dark, minimal, no ceremony.
      </h3>
      <p className="mt-2 text-sm text-[#b0b4bc] max-w-[640px] leading-relaxed">
        Built in Flutter with a Poppins stack and a hot coal palette.
        Orange-red for primary, ember glow for the splash, everything
        else out of the way so the video has the room.
      </p>

      <div className="mt-10 grid grid-cols-2 xl:grid-cols-4 gap-6">
        {screens.map((s) => (
          <div key={s.name}>
            <div
              className="h-[280px] w-full rounded-[22px] p-1.5 shadow-[0_20px_40px_-15px_rgba(228,32,0,0.3)]"
              style={{ background: "#000", border: `1px solid ${EMBER.border}` }}
            >
              <div className="h-full w-full rounded-[18px] overflow-hidden">
                {s.content}
              </div>
            </div>
            <p className="mt-3 text-sm font-semibold text-white">{s.name}</p>
            <p className="text-xs text-[#8a8f99] mt-0.5 leading-relaxed">
              {s.caption}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ====================================================================
// STORY TAB
// ====================================================================

function StoryTab() {
  const beats = [
    {
      label: "The gap",
      title: "WebTorrent for the web. Nothing for the phone.",
      body: "On desktop, WebTorrent and its siblings made torrent streaming feel native. On mobile there was a hole. I would find a thing worth watching on my phone and there was no real way to stream while it pulled. I wanted the same feeling on Android.",
    },
    {
      label: "The bridge",
      title: "Flutter on top, Kotlin underneath.",
      body: "The UI and the product logic sit in Flutter. The actual torrent work lives in a Kotlin native layer built on libtorrent4j, talking to a tiny NanoHTTPD server on localhost. The player reads http://127.0.0.1:8080 and never knows the bytes are arriving from 40 different peers.",
    },
    {
      label: "The trick",
      title: "Deadline-based piece picking.",
      body: "Standard torrent clients download pieces rarest-first or sequentially. Streaming needs something else. The piece priority manager watches what the player is asking for (byte offset mapped to piece index) and pushes those specific pieces to the front of the queue with a 500ms deadline. Seeking a torrent starts to feel like seeking a local file.",
    },
    {
      label: "The traction",
      title: "Friends actually use this one.",
      body: "Ember is not on the Play Store yet, it is an APK I pass around. It became the side project my friends keep asking for new builds of, which is the most honest metric I know. A desktop port and a better seeking recovery path are the next two things on the list.",
    },
  ];

  const stats = [
    { label: "Built", value: "2025" },
    { label: "Platform", value: "Android" },
    { label: "Engine", value: "libtorrent4j" },
    { label: "Lines of Kotlin", value: "~1.8k" },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[760px] mx-auto px-10 py-12">
        <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#ff6b00]">
          Origin
        </p>
        <h3 className="mt-1 text-3xl font-semibold tracking-tight leading-tight text-white">
          The mobile torrent player I could not find, so I built it.
        </h3>

        <div className="mt-8 grid grid-cols-4 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-4"
              style={{
                background: EMBER.surface,
                border: `1px solid ${EMBER.border}`,
              }}
            >
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#8a8f99]">
                {s.label}
              </p>
              <p className="text-xl font-bold mt-1 tracking-tight text-white">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        <ol
          className="mt-10 relative border-l-2"
          style={{ borderColor: EMBER.border }}
        >
          {beats.map((b, i) => (
            <li key={i} className="pl-6 pb-8 relative last:pb-0">
              <span
                className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, #e42000, #ff6b00)",
                  boxShadow: "0 0 10px rgba(228,32,0,0.5), 0 0 0 4px #06090d",
                }}
              />
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#ff6b00]">
                {b.label}
              </p>
              <h4 className="mt-1 text-lg font-semibold tracking-tight text-white">
                {b.title}
              </h4>
              <p className="mt-1.5 text-sm text-[#b0b4bc] leading-relaxed">
                {b.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
