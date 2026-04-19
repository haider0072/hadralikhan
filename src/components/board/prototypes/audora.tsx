"use client";

import { useEffect, useRef, useState } from "react";
import type { CardActivity } from "../use-card-activity";
import { ProjectFrame } from "../project-frame";
import { FocusModal } from "../focus-modal";
import {
  V0Logo,
  CursorLogo,
  ClaudeLogo,
  YoutubeLogo,
  SpotifyLogo,
  GithubLogo,
} from "../tool-logos";
import { cn } from "@/lib/cn";

const TRACKS = [
  {
    title: "Midnight in Kyoto",
    artist: "Hiroshi Yoshimura",
    album: "静かな夜",
    duration: 213,
    year: 1993,
  },
  {
    title: "Wabi",
    artist: "Haruomi Hosono",
    album: "Glass Garden",
    duration: 187,
    year: 1988,
  },
  {
    title: "Soft Rain, Osaka",
    artist: "Mariah",
    album: "Utakata no Hibi",
    duration: 244,
    year: 1983,
  },
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
        tagline:
          "A high-res music player for audiophiles. FLAC, YouTube, lyrics, AI song stories, downloads.",
      }}
      innerClassName="bg-gradient-to-br from-[#fdf2f8] via-[#fce7f3] to-[#ffe4e6]"
      onOpen={onOpen}
      tape="top-right"
    >
      <div className="absolute -top-8 -right-10 w-44 h-44 rounded-full bg-[#e11d48]/25 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-[#fb7185]/20 blur-3xl" />

      <div className="absolute inset-4 flex items-center gap-3">
        <div className="relative h-28 w-28 rounded-md bg-gradient-to-br from-[#e11d48] via-[#be185d] to-[#831843] shadow-lg flex items-center justify-center shrink-0">
          <svg viewBox="0 0 100 100" className="w-20 h-20 opacity-90" aria-hidden>
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
          <p className="text-[11px] text-[#9f1239] truncate">Hiroshi Yoshimura</p>
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

      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-[#9f1239]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#e11d48] animate-pulse" />
          <span>FLAC · 44.1kHz</span>
        </div>
        <span className="flex items-center gap-1.5 text-[#9f1239]">
          <V0Logo size={10} />
          <CursorLogo size={10} />
          <ClaudeLogo size={10} />
        </span>
      </div>
    </ProjectFrame>
  );
}

type Tab = "now" | "youtube" | "lyrics" | "ai" | "download";

function AudoraFocus() {
  const [tab, setTab] = useState<Tab>("now");
  const [dark, setDark] = useState(true);
  const [track, setTrack] = useState(TRACKS[0]);

  const bg = dark ? "bg-[#0a0a0a] text-[#fafafa]" : "bg-white text-[#0a0a0a]";
  const surface = dark ? "bg-[#18181b]" : "bg-[#f4f4f5]";
  const subtle = dark ? "text-[#a1a1aa]" : "text-[#71717a]";
  const border = dark ? "border-white/10" : "border-black/10";
  const muted = dark ? "bg-white/5" : "bg-black/5";

  return (
    <div
      className={cn(
        "w-[min(1240px,96vw)] h-[min(780px,92vh)] grid grid-cols-[360px_1fr] font-sans overflow-hidden",
        bg,
      )}
    >
      {/* Sidebar — case study */}
      <aside className={cn("border-r p-7 overflow-y-auto", border)}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#e11d48] flex items-center justify-center">
            <span className="text-white font-serif italic text-lg">a</span>
          </div>
          <div>
            <p className="font-semibold tracking-tight text-base">Audora</p>
            <p className={cn("text-[10px] font-mono uppercase tracking-[0.22em]", subtle)}>
              2025 · Music player
            </p>
          </div>
        </div>

        <p className={cn("mt-5 text-sm leading-relaxed", subtle)}>
          I buy FLAC tracks. Studio-recorded, not MP3. Qobuz didn't feel right;
          nothing had the sorting, typography, or backstory I wanted. So I
          built my own.
        </p>

        <div className="mt-6">
          <p
            className={cn(
              "text-[10px] font-mono uppercase tracking-[0.22em] mb-3",
              subtle,
            )}
          >
            Built with
          </p>
          <div className="space-y-2.5">
            <BuildStep
              dark={dark}
              tool="v0"
              Logo={V0Logo}
              role="Started here — base structure when v0 was new."
            />
            <BuildStep
              dark={dark}
              tool="Cursor"
              Logo={CursorLogo}
              role="Manual-heavy early features: EQ, YouTube, lyrics."
            />
            <BuildStep
              dark={dark}
              tool="Claude Code"
              Logo={ClaudeLogo}
              role="Polish, UI, and the download engine."
            />
          </div>
        </div>

        <div className="mt-6">
          <p
            className={cn(
              "text-[10px] font-mono uppercase tracking-[0.22em] mb-2",
              subtle,
            )}
          >
            Stack
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[
              "Next.js",
              "shadcn",
              "Tailwind",
              "Web Audio",
              "Spotify API",
              "YouTube",
            ].map((s) => (
              <span
                key={s}
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded border",
                  border,
                  subtle,
                )}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <a
            href="https://audora-player.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between rounded-xl bg-[#e11d48] hover:bg-[#be185d] text-white px-4 py-3 text-sm font-semibold transition-colors"
          >
            <span>Open live app</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href="https://github.com/haider0072/Audora"
            target="_blank"
            rel="noreferrer"
            className={cn(
              "flex items-center justify-between rounded-xl border px-4 py-2.5 text-xs",
              border,
              subtle,
              dark ? "hover:bg-white/5" : "hover:bg-black/5",
            )}
          >
            <span className="flex items-center gap-2">
              <GithubLogo size={14} />
              View on GitHub
            </span>
            <span>↗</span>
          </a>
        </div>
      </aside>

      {/* Main — feature demo */}
      <section className="flex flex-col overflow-hidden relative">
        {/* Tab bar */}
        <nav
          className={cn(
            "flex items-center gap-1 px-6 h-14 border-b shrink-0",
            border,
          )}
        >
          <TabBtn id="now" tab={tab} setTab={setTab} dark={dark}>
            Now playing
          </TabBtn>
          <TabBtn id="youtube" tab={tab} setTab={setTab} dark={dark}>
            YouTube
          </TabBtn>
          <TabBtn id="lyrics" tab={tab} setTab={setTab} dark={dark}>
            Lyrics
          </TabBtn>
          <TabBtn id="ai" tab={tab} setTab={setTab} dark={dark}>
            AI · Backstory
          </TabBtn>
          <TabBtn id="download" tab={tab} setTab={setTab} dark={dark}>
            Download
          </TabBtn>
          <div className="ml-auto flex items-center gap-2 mr-14">
            <button
              onClick={() => setDark((d) => !d)}
              className={cn(
                "h-7 px-3 rounded-full border text-[10px] font-mono uppercase tracking-[0.22em] transition-colors",
                border,
                subtle,
                dark ? "hover:bg-white/10" : "hover:bg-black/5",
              )}
            >
              {dark ? "Light" : "Dark"}
            </button>
          </div>
        </nav>

        <div className="flex-1 overflow-y-auto relative">
          {tab === "now" && (
            <NowPlaying track={track} setTrack={setTrack} dark={dark} subtle={subtle} border={border} muted={muted} />
          )}
          {tab === "youtube" && <YouTubeTab dark={dark} subtle={subtle} surface={surface} border={border} />}
          {tab === "lyrics" && <LyricsTab track={track} dark={dark} subtle={subtle} />}
          {tab === "ai" && <AITab track={track} dark={dark} subtle={subtle} surface={surface} border={border} />}
          {tab === "download" && <DownloadTab track={track} dark={dark} subtle={subtle} border={border} surface={surface} />}
        </div>
      </section>
    </div>
  );
}

function TabBtn({
  id,
  tab,
  setTab,
  dark,
  children,
}: {
  id: Tab;
  tab: Tab;
  setTab: (t: Tab) => void;
  dark: boolean;
  children: React.ReactNode;
}) {
  const active = tab === id;
  return (
    <button
      onClick={() => setTab(id)}
      className={cn(
        "h-9 px-3.5 rounded-md text-xs font-medium transition-colors",
        active
          ? "bg-[#e11d48] text-white"
          : dark
            ? "text-white/60 hover:text-white hover:bg-white/5"
            : "text-black/60 hover:text-black hover:bg-black/5",
      )}
    >
      {children}
    </button>
  );
}

function BuildStep({
  tool,
  role,
  dark,
  Logo,
}: {
  tool: string;
  role: string;
  dark: boolean;
  Logo: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[104px_1fr] items-start gap-3 py-1",
      )}
    >
      <span
        className={cn(
          "flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.22em] px-2 py-1 rounded-md border whitespace-nowrap",
          dark ? "border-white/15 text-white" : "border-black/15 text-black",
        )}
      >
        <Logo size={12} />
        {tool}
      </span>
      <p
        className={cn(
          "text-[12px] leading-snug",
          dark ? "text-white/55" : "text-black/55",
        )}
      >
        {role}
      </p>
    </div>
  );
}

// ---------- Tabs ----------

function NowPlaying({
  track,
  setTrack,
  dark,
  subtle,
  border,
  muted,
}: {
  track: (typeof TRACKS)[number];
  setTrack: (t: (typeof TRACKS)[number]) => void;
  dark: boolean;
  subtle: string;
  border: string;
  muted: string;
}) {
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0.32);
  const bars = useRef<HTMLDivElement[]>([]);
  const raf = useRef<number | null>(null);
  const t = useRef(0);

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
          18 +
          Math.abs(Math.sin(t.current + i * 0.28)) * 52 +
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
      setProgress((p) => (p >= 1 ? 0 : p + 1 / track.duration / 3));
    }, 100);
    return () => clearInterval(id);
  }, [playing, track.duration]);

  return (
    <div className="p-8 grid grid-cols-[260px_1fr] gap-8 h-full">
      <div className="space-y-3">
        <div className="relative h-60 w-60 rounded-2xl bg-gradient-to-br from-[#e11d48] via-[#be185d] to-[#831843] shadow-2xl flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 100 100" className="w-44 h-44 animate-[spin_8s_linear_infinite]" aria-hidden>
            <circle cx="50" cy="50" r="46" fill="#1f1a1e" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#fda4af" strokeWidth="0.3" opacity="0.4" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="#fda4af" strokeWidth="0.3" opacity="0.4" />
            <circle cx="50" cy="50" r="22" fill="none" stroke="#fda4af" strokeWidth="0.3" opacity="0.4" />
            <circle cx="50" cy="50" r="14" fill="#e11d48" />
            <circle cx="50" cy="50" r="3" fill="#fce7f3" />
          </svg>
        </div>

        <div>
          <p className={cn("text-[10px] font-mono uppercase tracking-[0.22em] mb-2", subtle)}>Queue</p>
          <div className="space-y-1">
            {TRACKS.map((tr) => (
              <button
                key={tr.title}
                onClick={() => setTrack(tr)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-xs flex items-center justify-between",
                  tr.title === track.title
                    ? "bg-[#e11d48]/15 text-[#e11d48]"
                    : dark
                      ? "hover:bg-white/5"
                      : "hover:bg-black/5",
                )}
              >
                <span className="truncate">{tr.title}</span>
                <span className={cn("text-[10px] font-mono shrink-0 ml-2", subtle)}>
                  {formatTime(tr.duration)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col min-w-0">
        <div className="min-w-0">
          <p className={cn("text-[10px] font-mono uppercase tracking-[0.22em]", subtle)}>
            Now playing · {track.album} · {track.year}
          </p>
          <h3 className="mt-2 font-serif text-3xl md:text-4xl tracking-tight leading-tight truncate">
            {track.title}
          </h3>
          <p className={cn("mt-1 text-lg", subtle)}>{track.artist}</p>
          <p className={cn("mt-1 text-xs font-mono uppercase tracking-[0.22em]", subtle)}>
            FLAC · 44.1 kHz · 24-bit
          </p>
        </div>

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

        <div className="flex-1 flex items-end justify-center gap-[3px] h-[80px] mt-6">
          {Array.from({ length: 64 }).map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) bars.current[i] = el;
              }}
              className="w-[3px] rounded-full transition-[height] duration-75"
              style={{
                height: "20px",
                background:
                  i / 64 < progress
                    ? "linear-gradient(to top, #e11d48, #fb7185)"
                    : dark
                      ? "#ffffff22"
                      : "#0a0a0a22",
              }}
            />
          ))}
        </div>

        <div className="mt-5 flex items-center gap-3 font-mono text-xs">
          <span className={subtle}>{formatTime(progress * track.duration)}</span>
          <div className={cn("flex-1 h-[3px] rounded-full overflow-hidden", muted)}>
            <div
              className="h-full bg-gradient-to-r from-[#e11d48] to-[#fb7185]"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className={subtle}>{formatTime(track.duration)}</span>
        </div>

        <div className="mt-5 flex items-center justify-center gap-6">
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
        </div>
      </div>
    </div>
  );
}

function YouTubeTab({
  dark,
  subtle,
  surface,
  border,
}: {
  dark: boolean;
  subtle: string;
  surface: string;
  border: string;
}) {
  const [url, setUrl] = useState("");
  const [loaded, setLoaded] = useState<{ title: string; channel: string } | null>(null);
  const [typing, setTyping] = useState(true);
  const targetUrl = "https://youtu.be/kQyUl3rhxW0";

  useEffect(() => {
    setUrl("");
    setLoaded(null);
    setTyping(true);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setUrl(targetUrl.slice(0, i));
      if (i >= targetUrl.length) {
        clearInterval(id);
        setTyping(false);
        setTimeout(() => {
          setLoaded({
            title: "Hiroshi Yoshimura — Music for Nine Postcards (Full Album)",
            channel: "Light in the Attic Records",
          });
        }, 700);
      }
    }, 60);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <p className={cn("text-[10px] font-mono uppercase tracking-[0.22em]", subtle)}>
        Paste any YouTube URL · Audora handles the rest
      </p>
      <h3 className="mt-3 font-serif text-3xl tracking-tight">Import from YouTube</h3>

      <div className={cn("mt-6 rounded-xl border p-1.5 flex items-center gap-2", border, surface)}>
        <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center shrink-0">
          <YoutubeLogo size={20} />
        </div>
        <input
          readOnly
          value={url}
          className={cn(
            "flex-1 bg-transparent outline-none px-2 text-sm tabular-nums",
            dark ? "text-white" : "text-black",
          )}
        />
        <button
          className={cn(
            "h-8 px-4 rounded-md text-xs font-semibold transition-colors",
            typing
              ? dark
                ? "bg-white/10 text-white/50"
                : "bg-black/5 text-black/40"
              : "bg-[#e11d48] text-white hover:bg-[#be185d]",
          )}
          disabled={typing}
        >
          {typing ? "…" : "Load"}
        </button>
      </div>

      {loaded && (
        <div
          className={cn(
            "mt-6 rounded-xl border overflow-hidden",
            border,
            "animate-[fadeIn_0.4s_ease-out]",
          )}
        >
          <div className="relative aspect-video bg-gradient-to-br from-[#0a0a0a] to-[#27272a]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-[#e11d48] flex items-center justify-center shadow-2xl">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M7 4l13 8-13 8z" />
                </svg>
              </div>
            </div>
            <span className="absolute bottom-3 right-3 font-mono text-[10px] bg-black/80 text-white px-2 py-1 rounded">
              47:22
            </span>
          </div>
          <div className={cn("p-4", surface)}>
            <p className="font-semibold text-sm">{loaded.title}</p>
            <p className={cn("text-xs mt-1", subtle)}>{loaded.channel}</p>
            <div className="mt-3 flex gap-2">
              <button className="h-8 px-3 rounded-md bg-[#e11d48] hover:bg-[#be185d] text-white text-xs font-semibold transition-colors">
                Queue now
              </button>
              <button
                className={cn(
                  "h-8 px-3 rounded-md border text-xs font-semibold transition-colors",
                  border,
                  dark ? "hover:bg-white/5" : "hover:bg-black/5",
                )}
              >
                Save to library
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={cn("mt-6 text-xs leading-relaxed", subtle)}>
        Audora extracts audio via yt-dlp on the backend, caches the track, and
        matches it against Spotify metadata for cover art, album name, and
        release year.
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}

const LYRICS = [
  "静かな夜、京都の雨",
  "Soft the city breathes in grey",
  "Neon flickers on the pavement",
  "Tea cools by my side",
  "A thousand paper cranes",
  "Fold inside the silence",
  "And I drift on the tone",
  "Of a piano from next door",
  "静かな夜、また明日",
];

function LyricsTab({
  track,
  dark,
  subtle,
}: {
  track: (typeof TRACKS)[number];
  dark: boolean;
  subtle: string;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % LYRICS.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <p className={cn("text-[10px] font-mono uppercase tracking-[0.22em]", subtle)}>
            Live lyrics · synced
          </p>
          <h3 className="mt-2 font-serif text-2xl tracking-tight">{track.title}</h3>
        </div>
        <span
          className={cn(
            "text-[10px] font-mono uppercase tracking-[0.22em] px-2.5 py-1 rounded-full bg-[#e11d48]/15 text-[#e11d48]",
          )}
        >
          ● synced
        </span>
      </div>

      <div className="mt-8 space-y-5">
        {LYRICS.map((line, i) => {
          const distance = Math.abs(i - active);
          const opacity = i === active ? 1 : Math.max(0.15, 1 - distance * 0.25);
          const scale = i === active ? 1 : 0.94;
          return (
            <p
              key={i}
              className={cn(
                "font-serif transition-all duration-500",
                i === active
                  ? "text-[#e11d48] text-4xl font-medium"
                  : dark
                    ? "text-white text-3xl"
                    : "text-black text-3xl",
              )}
              style={{ opacity, transform: `scale(${scale})`, transformOrigin: "left center" }}
            >
              {line}
            </p>
          );
        })}
      </div>
    </div>
  );
}

function AITab({
  track,
  dark,
  subtle,
  surface,
  border,
}: {
  track: (typeof TRACKS)[number];
  dark: boolean;
  subtle: string;
  surface: string;
  border: string;
}) {
  const story = `"${track.title}" sits in the tradition of Japanese kankyō ongaku — "environmental music" — that ${track.artist} helped crystallize in the late 80s and early 90s. ${track.year === 1993 ? "Recorded in a single afternoon session at the artist's Tokyo apartment" : "Released as part of a small-run cassette"}, the piece leans on a Roland SH-2 drone, long sustains, and spaced silences. What you're hearing is less a song than a room — a thick, slow atmosphere you walk into and out of.`;

  const [typed, setTyped] = useState("");

  useEffect(() => {
    setTyped("");
    let i = 0;
    const id = setInterval(() => {
      i += 3;
      setTyped(story.slice(0, i));
      if (i >= story.length) clearInterval(id);
    }, 14);
    return () => clearInterval(id);
  }, [story]);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-1">
        <span
          className={cn(
            "text-[10px] font-mono uppercase tracking-[0.22em] px-2.5 py-1 rounded-full bg-[#e11d48]/15 text-[#e11d48]",
          )}
        >
          AI · Backstory
        </span>
        <span className={cn("flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.22em]", subtle)}>
          <span>via</span>
          <SpotifyLogo size={12} />
          <span>+</span>
          <ClaudeLogo size={12} />
        </span>
      </div>
      <h3 className="mt-3 font-serif text-3xl tracking-tight">{track.title}</h3>
      <p className={cn("text-sm", subtle)}>
        {track.artist} · {track.album} · {track.year}
      </p>

      <p className={cn("mt-6 text-lg leading-relaxed font-serif", dark ? "text-white/85" : "text-black/80")}>
        {typed}
        {typed.length < story.length && (
          <span className="inline-block w-[2px] h-[1.1em] bg-[#e11d48] align-middle ml-0.5 animate-pulse" />
        )}
      </p>

      <div className={cn("mt-8 rounded-xl border p-4 text-xs", border, surface)}>
        <p className={cn("font-mono uppercase tracking-[0.22em] text-[10px] mb-2", subtle)}>
          Related tracks
        </p>
        <ul className="space-y-1">
          {[
            "Hiroshi Yoshimura — Music for Nine Postcards",
            "Haruomi Hosono — Watering a Flower",
            "Mariah — Shinzo No Tobira",
          ].map((t) => (
            <li key={t} className={cn("py-1 flex items-center justify-between", subtle)}>
              <span>{t}</span>
              <span>→</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function DownloadTab({
  track,
  dark,
  subtle,
  border,
  surface,
}: {
  track: (typeof TRACKS)[number];
  dark: boolean;
  subtle: string;
  border: string;
  surface: string;
}) {
  const qualities = [
    { label: "FLAC", detail: "44.1 kHz · 24-bit · lossless", size: "42.3 MB" },
    { label: "ALAC", detail: "44.1 kHz · 16-bit · lossless", size: "28.1 MB" },
    { label: "MP3", detail: "320 kbps · compressed", size: "9.8 MB" },
  ];
  const [picked, setPicked] = useState(0);
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(true);

  useEffect(() => {
    if (!downloading) return;
    setProgress(0);
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 1) {
          setDownloading(false);
          clearInterval(id);
          return 1;
        }
        return p + 0.012;
      });
    }, 80);
    return () => clearInterval(id);
  }, [downloading, picked]);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <p className={cn("text-[10px] font-mono uppercase tracking-[0.22em]", subtle)}>
        Save locally · airplane mode friendly
      </p>
      <h3 className="mt-2 font-serif text-3xl tracking-tight">Download</h3>

      <div className={cn("mt-5 rounded-xl border p-5", border, surface)}>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-[#e11d48] to-[#831843] shrink-0" />
          <div>
            <p className="font-semibold">{track.title}</p>
            <p className={cn("text-xs", subtle)}>
              {track.artist} · {formatTime(track.duration)}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          {qualities.map((q, i) => (
            <button
              key={q.label}
              onClick={() => {
                setPicked(i);
                setDownloading(true);
                setProgress(0);
              }}
              className={cn(
                "w-full rounded-lg border px-4 py-3 flex items-center justify-between text-left transition-colors",
                picked === i ? "border-[#e11d48] bg-[#e11d48]/10" : border,
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-4 w-4 rounded-full border-2",
                    picked === i ? "border-[#e11d48] bg-[#e11d48]" : dark ? "border-white/30" : "border-black/30",
                  )}
                />
                <div>
                  <p className="text-sm font-semibold">{q.label}</p>
                  <p className={cn("text-xs", subtle)}>{q.detail}</p>
                </div>
              </div>
              <span className={cn("text-xs font-mono tabular-nums", subtle)}>{q.size}</span>
            </button>
          ))}
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className={subtle}>
              {downloading ? "Downloading…" : "Saved · ready offline"}
            </span>
            <span className={cn("font-mono tabular-nums", subtle)}>
              {Math.round(progress * 100)}%
            </span>
          </div>
          <div className={cn("h-[3px] rounded-full overflow-hidden", dark ? "bg-white/10" : "bg-black/10")}>
            <div
              className="h-full bg-gradient-to-r from-[#e11d48] to-[#fb7185] transition-[width]"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
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
