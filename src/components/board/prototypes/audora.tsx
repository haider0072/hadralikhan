"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CardActivity } from "../use-card-activity";
import { ProjectFrame } from "../project-frame";
import { FocusModal } from "../focus-modal";
import {
  V0Logo,
  CursorLogo,
  ClaudeLogo,
  YoutubeLogo,
  SpotifyLogo,
} from "../tool-logos";
import { ProjectLinks } from "../project-links";
import { cn } from "@/lib/cn";

type Lyric = { han: string; rom: string; eng: string };

type Track = {
  slug: string;
  title: string;
  titleNative?: string;
  artist: string;
  album: string;
  year: number;
  duration: number;
  audio: string;
  cover: string;
  coverFrom: string;
  coverVia: string;
  coverTo: string;
  lrc: string;
  lrcOffset?: number;
  youtubeId: string;
  youtubeTitle: string;
  youtubeChannel: string;
  youtubeLength: string;
  lyrics: Lyric[];
  story: string;
  sizes: { flac: string; alac: string; mp3: string };
};

const TRACKS: Track[] = [
  {
    slug: "spring-day",
    title: "Spring Day",
    titleNative: "봄날",
    artist: "BTS",
    album: "You Never Walk Alone",
    year: 2017,
    duration: 274.7,
    audio: "/audio/spring-day.flac",
    cover: "/audio/spring-day.jpg",
    lrc: "/audio/spring-day.lrc",
    coverFrom: "#3b5a7a",
    coverVia: "#8396ac",
    coverTo: "#d4c9b8",
    youtubeId: "xEeFrLSkMm8",
    youtubeTitle: "BTS (방탄소년단) '봄날 (Spring Day)' Official MV",
    youtubeChannel: "HYBE LABELS",
    youtubeLength: "5:29",
    lyrics: [],
    story:
      "\"Spring Day\" is the BTS song that people who don't follow BTS know. Released on You Never Walk Alone in February 2017, it's a ballad about longing — for someone gone, for a version of yourself that isn't coming back. The visual language of the MV (the yellow train, the abandoned hotel, the shoes on the wire) reads as a tribute to the 2014 Sewol ferry disaster, though the group never stated it directly. Musically it's layered: acoustic guitar, piano, strings, shifting into an anthemic chorus. Ursula K. Le Guin's \"The Ones Who Walk Away from Omelas\" is cited as an inspiration. RM produced it with Pdogg.",
    sizes: { flac: "35.0 MB", alac: "23.2 MB", mp3: "8.8 MB" },
  },
  {
    slug: "untitled-2014",
    title: "Untitled, 2014",
    titleNative: "무제 (無題)",
    artist: "G-DRAGON",
    album: "KWON JI YONG",
    year: 2017,
    duration: 222.87,
    audio: "/audio/untitled-2014.flac",
    cover: "/audio/untitled-2014.jpg",
    lrc: "/audio/untitled-2014.lrc",
    coverFrom: "#2a1810",
    coverVia: "#4a2818",
    coverTo: "#6b3d28",
    youtubeId: "9kaCAbIXuyg",
    youtubeTitle: "G-DRAGON - '무제(無題) (Untitled, 2014)' M/V",
    youtubeChannel: "YG ENTERTAINMENT",
    youtubeLength: "3:43",
    lyrics: [],
    story:
      "Recorded one late night in 2014 and shelved for three years, \"Untitled, 2014\" is G-Dragon at his most stripped. A piano. A vocal take. No rap, no production flex. He co-produced it with Choice37 and kept the arrangement deliberately thin — you can hear the room. The MV was shot single-take, allegedly finished in under an hour. The song was widely read as a letter to Kiko Mizuhara after their split, though GD has never confirmed it. What it is for certain: the moment Korea's biggest rapper proved he could carry a room with nothing but a melody and a mic.",
    sizes: { flac: "21.1 MB", alac: "14.3 MB", mp3: "5.2 MB" },
  },
  {
    slug: "my-old-story",
    title: "My Old Story",
    titleNative: "나의 옛날이야기",
    artist: "IU",
    album: "꽃갈피 (A Flower Bookmark)",
    year: 2014,
    duration: 213.83,
    audio: "/audio/my-old-story.flac",
    cover: "/audio/my-old-story.jpg",
    lrc: "/audio/my-old-story.lrc",
    coverFrom: "#8b6b4a",
    coverVia: "#a68a6d",
    coverTo: "#d4b896",
    youtubeId: "npttud7NkL0",
    youtubeTitle: "[MV] IU(아이유) _ My Old Story (나의 옛날이야기)",
    youtubeChannel: "1theK (원더케이)",
    youtubeLength: "3:41",
    lyrics: [
      {
        han: "쓸쓸하던 그 골목을",
        rom: "sseulsseulhadeon geu golmogeul",
        eng: "That lonely alleyway",
      },
      {
        han: "당신은 기억하십니까",
        rom: "dangsineun gieokhasimnikka",
        eng: "Do you still remember?",
      },
      {
        han: "지금도 난 기억합니다",
        rom: "jigeumdo nan gieokhamnida",
        eng: "I still remember, even now",
      },
      {
        han: "철없던 시절의",
        rom: "cheoreopdeon sijeorui",
        eng: "Of those childish days",
      },
      {
        han: "눈부시게 아름다운 밤",
        rom: "nunbusige areumdaun bam",
        eng: "Dazzlingly beautiful nights",
      },
      { han: "아직 난 사랑 중", rom: "ajik nan sarang jung", eng: "I am still in love" },
    ],
    story:
      "\"My Old Story\" opens A Flower Bookmark, IU's 2014 remake project where she reinterpreted older Korean songs she'd grown up with. The original belongs to indie duo Eoeoobook; in IU's hands it became quieter and more personal. Recorded nearly live with minimal overdubs — acoustic guitar, a little piano, her voice. No strings, no builds. The kind of track that rewards a listening room and a good DAC. A year later she'd re-record it for a soundtrack. This was the version that mattered.",
    sizes: { flac: "19.0 MB", alac: "12.6 MB", mp3: "4.8 MB" },
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
        <div className="relative h-28 w-28 rounded-md overflow-hidden shadow-lg ring-1 ring-black/10 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/audio/spring-day.jpg"
            alt=""
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
        <div className="min-w-0 flex-1">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#9f1239]">
            Now playing
          </span>
          <p className="mt-1 font-semibold text-[#4c0519] leading-tight truncate">
            Spring Day
          </p>
          <p className="text-[11px] text-[#9f1239] truncate">BTS · 봄날</p>
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

type Player = {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  track: Track;
  trackIndex: number;
  selectTrack: (i: number) => void;
  playing: boolean;
  buffering: boolean;
  toggle: () => void;
  currentTime: number;
  duration: number;
  getAnalyserData: () => Uint8Array | null;
};

function useAudioPlayer(): Player {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const dataRef = useRef<Uint8Array | null>(null);

  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const shouldPlayNext = useRef(false);

  const track = TRACKS[trackIndex];

  const ensureCtx = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (!ctxRef.current) {
      type WindowWithWebkit = Window & {
        webkitAudioContext?: typeof AudioContext;
      };
      const w = window as WindowWithWebkit;
      const Ctx = window.AudioContext || w.webkitAudioContext;
      if (!Ctx) return;
      ctxRef.current = new Ctx();
    }
    if (!sourceRef.current && ctxRef.current) {
      try {
        sourceRef.current = ctxRef.current.createMediaElementSource(a);
        analyserRef.current = ctxRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        analyserRef.current.smoothingTimeConstant = 0.75;
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(ctxRef.current.destination);
        dataRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
      } catch {
        // MediaElementSource already created — ignore
      }
    }
    if (ctxRef.current.state === "suspended") {
      void ctxRef.current.resume();
    }
  }, []);

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    ensureCtx();
    if (a.paused) {
      void a.play().catch(() => {});
    } else {
      a.pause();
    }
  }, [ensureCtx]);

  const selectTrack = useCallback(
    (i: number) => {
      if (i === trackIndex) {
        toggle();
        return;
      }
      shouldPlayNext.current = true;
      setTrackIndex(i);
    },
    [trackIndex, toggle],
  );

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const wasPlaying = !a.paused || shouldPlayNext.current;
    a.src = TRACKS[trackIndex].audio;
    a.load();
    setCurrentTime(0);
    if (wasPlaying) {
      ensureCtx();
      void a.play().catch(() => {});
    }
    shouldPlayNext.current = false;
  }, [trackIndex, ensureCtx]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => setCurrentTime(a.currentTime);
    const onMeta = () => setDuration(a.duration || 0);
    const onWaiting = () => setBuffering(true);
    const onPlaying = () => setBuffering(false);
    const onEnded = () => {
      shouldPlayNext.current = true;
      setTrackIndex((i) => (i + 1) % TRACKS.length);
    };
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("durationchange", onMeta);
    a.addEventListener("waiting", onWaiting);
    a.addEventListener("playing", onPlaying);
    a.addEventListener("ended", onEnded);
    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("durationchange", onMeta);
      a.removeEventListener("waiting", onWaiting);
      a.removeEventListener("playing", onPlaying);
      a.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    return () => {
      const a = audioRef.current;
      if (a) a.pause();
      if (ctxRef.current && ctxRef.current.state !== "closed") {
        void ctxRef.current.close();
      }
    };
  }, []);

  const getAnalyserData = useCallback(() => {
    const analyser = analyserRef.current;
    const data = dataRef.current;
    if (!analyser || !data) return null;
    analyser.getByteFrequencyData(data as unknown as Uint8Array<ArrayBuffer>);
    return data;
  }, []);

  return {
    audioRef,
    track,
    trackIndex,
    selectTrack,
    playing,
    buffering,
    toggle,
    currentTime,
    duration: duration || track.duration,
    getAnalyserData,
  };
}

function AudoraFocus() {
  const [tab, setTab] = useState<Tab>("now");
  const [dark, setDark] = useState(true);
  const player = useAudioPlayer();

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
      <audio
        ref={player.audioRef}
        src={TRACKS[0].audio}
        preload="metadata"
      />

      {/* Sidebar — case study */}
      <aside className={cn("border-r p-7 overflow-y-auto", border)}>
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl overflow-hidden shrink-0 ring-1 ring-white/10 shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/projects/audora-logo.png"
              alt="Audora"
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold tracking-tight text-base">Audora</p>
            <p className={cn("text-[10px] font-mono uppercase tracking-[0.22em]", subtle)}>
              2025 · Music player
            </p>
          </div>
          <ProjectLinks
            dark={dark}
            links={[
              { kind: "live", href: "https://audora-player.vercel.app" },
              { kind: "github", href: "https://github.com/haider0072/Audora" },
            ]}
          />
        </div>

        <p className={cn("mt-5 text-sm leading-relaxed", subtle)}>
          I buy FLAC tracks. Studio-recorded, not MP3. I listen to a lot of
          Korean ballads and late-night indie — music that rewards a good DAC
          and a quiet room. Qobuz didn&apos;t feel right. Nothing had the
          sorting, typography, or backstory I wanted. So I built my own.
        </p>

        <div className="mt-6">
          <p
            className={cn(
              "text-[10px] font-mono uppercase tracking-[0.22em] mb-2",
              subtle,
            )}
          >
            My role
          </p>
          <p className={cn("text-[13px] leading-relaxed", subtle)}>
            Solo build. Research, interaction design, every line of code.
            I spent a week with my own FLAC library and listening habits
            before designing a single screen.
          </p>
        </div>

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
              role="Started here. Base structure and first pass when v0 was new."
            />
            <BuildStep
              dark={dark}
              tool="Cursor"
              Logo={CursorLogo}
              role="Manual heavy early features: EQ, YouTube ingest, lyrics."
            />
            <BuildStep
              dark={dark}
              tool="Claude Code"
              Logo={ClaudeLogo}
              role="Polish, UI work, and the download engine."
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
            What it taught me
          </p>
          <p className={cn("text-[13px] leading-relaxed", subtle)}>
            Waveform rendering and cue syncing taught me more about browsers
            than two years of React. Also: Qobuz isn&apos;t bad, it just
            wasn&apos;t built for a listener like me. That was the whole
            thesis.
          </p>
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
            <NowPlaying
              player={player}
              dark={dark}
              subtle={subtle}
              border={border}
              muted={muted}
            />
          )}
          {tab === "youtube" && (
            <YouTubeTab
              track={player.track}
              dark={dark}
              subtle={subtle}
              surface={surface}
              border={border}
            />
          )}
          {tab === "lyrics" && (
            <LyricsTab player={player} dark={dark} subtle={subtle} />
          )}
          {tab === "ai" && (
            <AITab
              track={player.track}
              dark={dark}
              subtle={subtle}
              surface={surface}
              border={border}
            />
          )}
          {tab === "download" && (
            <DownloadTab
              track={player.track}
              dark={dark}
              subtle={subtle}
              border={border}
              surface={surface}
            />
          )}
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
    <div className={cn("grid grid-cols-[104px_1fr] items-start gap-3 py-1")}>
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
  player,
  dark,
  subtle,
  border,
  muted,
}: {
  player: Player;
  dark: boolean;
  subtle: string;
  border: string;
  muted: string;
}) {
  const { track, trackIndex, selectTrack, playing, toggle, currentTime, duration, buffering, getAnalyserData } = player;
  const bars = useRef<HTMLDivElement[]>([]);
  const raf = useRef<number | null>(null);
  const fallbackT = useRef(0);

  useEffect(() => {
    const tick = () => {
      const data = getAnalyserData();
      const count = bars.current.length;
      if (data && playing) {
        const step = Math.max(1, Math.floor(data.length / count));
        for (let i = 0; i < count; i++) {
          const el = bars.current[i];
          if (!el) continue;
          const v = data[i * step] ?? 0;
          const h = 12 + (v / 255) * 68;
          el.style.height = `${h}px`;
        }
      } else {
        // idle ambient float when paused / no analyser yet
        fallbackT.current += playing ? 0.06 : 0.02;
        for (let i = 0; i < count; i++) {
          const el = bars.current[i];
          if (!el) continue;
          const base = playing ? 28 : 18;
          const amp = playing ? 16 : 4;
          el.style.height = `${base + Math.abs(Math.sin(fallbackT.current + i * 0.3)) * amp}px`;
        }
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [playing, getAnalyserData]);

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <div className="p-8 grid grid-cols-[260px_1fr] gap-8 h-full">
      <div className="space-y-3">
        <div className="relative h-60 w-60">
          <div
            className={cn(
              "absolute top-1 left-1 h-58 w-58 rounded-full transition-transform duration-[650ms] ease-out",
              playing ? "translate-x-14" : "translate-x-0 opacity-0 scale-90",
            )}
            aria-hidden
            style={{ height: "232px", width: "232px" }}
          >
            <div
              className={cn(
                "h-full w-full rounded-full relative",
                playing ? "animate-[spin_9s_linear_infinite]" : "",
              )}
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, #1a1a1a 0%, #050505 55%, #111 100%)",
                boxShadow: "0 18px 40px -12px rgba(0,0,0,0.7)",
              }}
            >
              {[0.1, 0.2, 0.3, 0.42].map((i) => (
                <div
                  key={i}
                  className="absolute rounded-full border border-white/5"
                  style={{ inset: `${i * 100}%` }}
                />
              ))}
              <div className="absolute inset-[38%] rounded-full overflow-hidden ring-1 ring-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={track.cover}
                  alt=""
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </div>
              <div className="absolute inset-[48%] rounded-full bg-black" />
            </div>
          </div>
          <div className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/20 z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={track.cover}
              alt={`${track.title} cover`}
              className="h-full w-full object-cover"
              draggable={false}
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"
              aria-hidden
            />
          </div>
        </div>

        <div>
          <p className={cn("text-[10px] font-mono uppercase tracking-[0.22em] mb-2", subtle)}>Queue</p>
          <div className="space-y-1">
            {TRACKS.map((tr, i) => {
              const active = i === trackIndex;
              return (
                <button
                  key={tr.slug}
                  onClick={() => selectTrack(i)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-xs flex items-center justify-between",
                    active
                      ? "bg-[#e11d48]/15 text-[#e11d48]"
                      : dark
                        ? "hover:bg-white/5"
                        : "hover:bg-black/5",
                  )}
                >
                  <span className="truncate flex items-center gap-2">
                    {active && playing ? (
                      <span className="inline-flex items-end gap-[1.5px] h-3">
                        <span className="w-[2px] bg-[#e11d48] animate-[eq1_0.8s_ease-in-out_infinite]" />
                        <span className="w-[2px] bg-[#e11d48] animate-[eq2_0.7s_ease-in-out_infinite]" />
                        <span className="w-[2px] bg-[#e11d48] animate-[eq3_0.9s_ease-in-out_infinite]" />
                      </span>
                    ) : null}
                    <span className="truncate">{tr.title}</span>
                  </span>
                  <span className={cn("text-[10px] font-mono shrink-0 ml-2", subtle)}>
                    {formatTime(tr.duration)}
                  </span>
                </button>
              );
            })}
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
          {track.titleNative && (
            <p className={cn("mt-0.5 text-sm font-serif italic", subtle)}>
              {track.titleNative}
            </p>
          )}
          <p className={cn("mt-1 text-lg", subtle)}>{track.artist}</p>
          <p className={cn("mt-1 text-xs font-mono uppercase tracking-[0.22em]", subtle)}>
            FLAC · 44.1 kHz · 16-bit {buffering && playing ? "· buffering…" : ""}
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
          <span className={subtle}>{formatTime(currentTime)}</span>
          <div className={cn("flex-1 h-[3px] rounded-full overflow-hidden", muted)}>
            <div
              className="h-full bg-gradient-to-r from-[#e11d48] to-[#fb7185]"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className={subtle}>{formatTime(duration)}</span>
        </div>

        <div className="mt-5 flex items-center justify-center gap-6">
          <button
            onClick={() => selectTrack((trackIndex - 1 + TRACKS.length) % TRACKS.length)}
            className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
              dark ? "hover:bg-white/10 text-white/80" : "hover:bg-black/5 text-black/70",
            )}
            aria-label="Previous"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6v12h2V6H6zm3.5 6L20 18V6l-10.5 6z" />
            </svg>
          </button>
          <button
            onClick={toggle}
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
          <button
            onClick={() => selectTrack((trackIndex + 1) % TRACKS.length)}
            className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
              dark ? "hover:bg-white/10 text-white/80" : "hover:bg-black/5 text-black/70",
            )}
            aria-label="Next"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 6v12h2V6h-2zM4 18l10.5-6L4 6v12z" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes eq1 {
          0%, 100% { height: 4px; }
          50% { height: 12px; }
        }
        @keyframes eq2 {
          0%, 100% { height: 10px; }
          50% { height: 4px; }
        }
        @keyframes eq3 {
          0%, 100% { height: 6px; }
          50% { height: 12px; }
        }
      `}</style>
    </div>
  );
}

function YouTubeTab({
  track,
  dark,
  subtle,
  surface,
  border,
}: {
  track: Track;
  dark: boolean;
  subtle: string;
  surface: string;
  border: string;
}) {
  const [url, setUrl] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [typing, setTyping] = useState(true);
  const targetUrl = `https://youtu.be/${track.youtubeId}`;
  const watchUrl = `https://www.youtube.com/watch?v=${track.youtubeId}`;
  const thumbnail = `https://i.ytimg.com/vi/${track.youtubeId}/maxresdefault.jpg`;

  useEffect(() => {
    setUrl("");
    setLoaded(false);
    setTyping(true);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setUrl(targetUrl.slice(0, i));
      if (i >= targetUrl.length) {
        clearInterval(id);
        setTyping(false);
        setTimeout(() => setLoaded(true), 500);
      }
    }, 50);
    return () => clearInterval(id);
  }, [targetUrl]);

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
        <a
          href={watchUrl}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "mt-6 block rounded-xl border overflow-hidden group",
            border,
            "animate-[audora-fadeIn_0.4s_ease-out]",
          )}
        >
          <div className="relative aspect-video bg-gradient-to-br from-[#0a0a0a] to-[#27272a]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnail}
              alt={track.youtubeTitle}
              className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = `https://i.ytimg.com/vi/${track.youtubeId}/hqdefault.jpg`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-[#e11d48] flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M7 4l13 8-13 8z" />
                </svg>
              </div>
            </div>
            <span className="absolute bottom-3 right-3 font-mono text-[10px] bg-black/80 text-white px-2 py-1 rounded">
              {track.youtubeLength}
            </span>
          </div>
          <div className={cn("p-4", surface)}>
            <p className="font-semibold text-sm">{track.youtubeTitle}</p>
            <p className={cn("text-xs mt-1", subtle)}>{track.youtubeChannel}</p>
            <div className="mt-3 flex gap-2">
              <span className="h-8 px-3 rounded-md bg-[#e11d48] text-white text-xs font-semibold flex items-center">
                Queue now
              </span>
              <span
                className={cn(
                  "h-8 px-3 rounded-md border text-xs font-semibold flex items-center gap-1",
                  border,
                  subtle,
                )}
              >
                Watch on YouTube <span>↗</span>
              </span>
            </div>
          </div>
        </a>
      )}

      <div className={cn("mt-6 text-xs leading-relaxed", subtle)}>
        Audora extracts audio via yt-dlp on the backend, caches the track, and
        matches it against Spotify metadata for cover art, album name, and
        release year.
      </div>

      <style jsx>{`
        @keyframes audora-fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}

type LrcLine = { time: number; text: string };

function parseLrc(src: string): LrcLine[] {
  const out: LrcLine[] = [];
  for (const raw of src.split("\n")) {
    const m = raw.match(/^\[(\d+):(\d+(?:\.\d+)?)\]\s*(.*)$/);
    if (!m) continue;
    const t = parseInt(m[1], 10) * 60 + parseFloat(m[2]);
    const text = m[3].trim();
    if (!text) continue;
    out.push({ time: t, text });
  }
  return out.sort((a, b) => a.time - b.time);
}

function useLrc(url: string): { lines: LrcLine[]; loading: boolean } {
  const [lines, setLines] = useState<LrcLine[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    setLines([]);
    setLoading(true);
    fetch(url)
      .then((r) => (r.ok ? r.text() : ""))
      .then((text) => {
        if (cancelled) return;
        setLines(text ? parseLrc(text) : []);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [url]);
  return { lines, loading };
}

function LyricsTab({
  player,
  dark,
  subtle,
}: {
  player: Player;
  dark: boolean;
  subtle: string;
}) {
  const { track, currentTime } = player;
  const { lines, loading } = useLrc(track.lrc);
  const offset = track.lrcOffset ?? 0;
  const listRef = useRef<HTMLDivElement | null>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  let active = -1;
  const t = currentTime + offset;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].time <= t) active = i;
    else break;
  }

  useEffect(() => {
    if (active < 0) return;
    const el = lineRefs.current[active];
    const container = listRef.current;
    if (!el || !container) return;
    const elRect = el.getBoundingClientRect();
    const contRect = container.getBoundingClientRect();
    const delta =
      elRect.top - contRect.top - container.clientHeight / 2 + el.clientHeight / 2;
    container.scrollBy({ top: delta, behavior: "smooth" });
  }, [active]);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <p className={cn("text-[10px] font-mono uppercase tracking-[0.22em]", subtle)}>
            {loading
              ? "Live lyrics · loading…"
              : lines.length
                ? "Live lyrics · synced to playback"
                : "Lyrics unavailable"}
          </p>
          <h3 className="mt-2 font-serif text-2xl tracking-tight">{track.title}</h3>
          {track.titleNative && (
            <p className={cn("text-xs italic font-serif mt-0.5", subtle)}>
              {track.titleNative}
            </p>
          )}
          <p className={cn("text-xs mt-0.5", subtle)}>{track.artist}</p>
        </div>
        <span
          className={cn(
            "text-[10px] font-mono uppercase tracking-[0.22em] px-2.5 py-1 rounded-full bg-[#e11d48]/15 text-[#e11d48]",
          )}
        >
          ● synced
        </span>
      </div>

      <div
        ref={listRef}
        className="mt-6 space-y-4 overflow-y-auto pr-2 scroll-smooth"
        style={{ maxHeight: "calc(92vh - 240px)" }}
      >
        {loading && (
          <p className={cn("text-sm font-mono", subtle)}>Fetching LRC from lrclib…</p>
        )}
        {!loading && lines.length === 0 && (
          <p className={cn("text-sm", subtle)}>
            No synced lyrics available for this track.
          </p>
        )}
        {lines.map((line, i) => {
          const distance = Math.abs(i - active);
          const opacity = i === active ? 1 : Math.max(0.2, 1 - distance * 0.18);
          const scale = i === active ? 1 : 0.96;
          return (
            <div
              key={i}
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              className="transition-all duration-500"
              style={{
                opacity,
                transform: `scale(${scale})`,
                transformOrigin: "left center",
              }}
            >
              <p
                className={cn(
                  "font-serif leading-snug",
                  i === active
                    ? "text-[#e11d48] text-2xl md:text-3xl font-medium"
                    : dark
                      ? "text-white text-lg md:text-xl"
                      : "text-black text-lg md:text-xl",
                )}
              >
                {line.text}
              </p>
            </div>
          );
        })}
      </div>

      <p className={cn("mt-4 text-[10px] font-mono uppercase tracking-[0.22em]", subtle)}>
        Lyrics · lrclib.net
      </p>
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
  track: Track;
  dark: boolean;
  subtle: string;
  surface: string;
  border: string;
}) {
  const [typed, setTyped] = useState("");
  const story = track.story;

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

  const related: Record<string, string[]> = {
    "spring-day": [
      "BTS · Blue & Grey",
      "BTS · 00:00 (Zero O'Clock)",
      "RM · Seoul (prod. HONNE)",
    ],
    "untitled-2014": [
      "TAEYANG · Eyes, Nose, Lips",
      "IU feat. G-DRAGON · Palette",
      "Crush · Beautiful",
    ],
    "my-old-story": [
      "IU · Through the Night (밤편지)",
      "Eoeoobook · original version",
      "Yoon Jong Shin · Like It",
    ],
  };

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
        <span
          className={cn(
            "flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.22em]",
            subtle,
          )}
        >
          <span>via</span>
          <SpotifyLogo size={12} />
          <span>+</span>
          <ClaudeLogo size={12} />
        </span>
      </div>
      <h3 className="mt-3 font-serif text-3xl tracking-tight">{track.title}</h3>
      {track.titleNative && (
        <p className={cn("text-sm italic font-serif", subtle)}>{track.titleNative}</p>
      )}
      <p className={cn("text-sm mt-1", subtle)}>
        {track.artist} · {track.album} · {track.year}
      </p>

      <p
        className={cn(
          "mt-6 text-lg leading-relaxed font-serif",
          dark ? "text-white/85" : "text-black/80",
        )}
      >
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
          {(related[track.slug] ?? []).map((t) => (
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
  track: Track;
  dark: boolean;
  subtle: string;
  border: string;
  surface: string;
}) {
  const qualities = [
    { label: "FLAC", detail: "44.1 kHz · 16-bit · lossless", size: track.sizes.flac },
    { label: "ALAC", detail: "44.1 kHz · 16-bit · lossless", size: track.sizes.alac },
    { label: "MP3", detail: "320 kbps · compressed", size: track.sizes.mp3 },
  ];
  const [picked, setPicked] = useState(0);
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(true);

  useEffect(() => {
    setProgress(0);
    setDownloading(true);
  }, [track.slug, picked]);

  useEffect(() => {
    if (!downloading) return;
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
  }, [downloading]);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <p className={cn("text-[10px] font-mono uppercase tracking-[0.22em]", subtle)}>
        Save locally · airplane mode friendly
      </p>
      <h3 className="mt-2 font-serif text-3xl tracking-tight">Download</h3>

      <div className={cn("mt-5 rounded-xl border p-5", border, surface)}>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-lg shrink-0 overflow-hidden ring-1 ring-black/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={track.cover}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>
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
                    picked === i
                      ? "border-[#e11d48] bg-[#e11d48]"
                      : dark
                        ? "border-white/30"
                        : "border-black/30",
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
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${ss}`;
}
