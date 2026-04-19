"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CardActivity } from "../use-card-activity";
import { ProjectFrame } from "../project-frame";
import { FocusModal } from "../focus-modal";
import { GithubLogo } from "../tool-logos";
import { cn } from "@/lib/cn";

const BRAND = {
  blue: "#0084ff",
  blueSoft: "#e7f2ff",
  ink: "#111216",
  paper: "#ffffff",
  muted: "#6b7280",
  dracula: "#282a36",
  draculaCard: "#44475a",
  draculaPurple: "#bd93f9",
  draculaGreen: "#50fa7b",
};

export function WiseSendPrototype({ activity }: { activity: CardActivity }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <WiseSendPeek activity={activity} onOpen={() => setOpen(true)} />
      <FocusModal open={open} onClose={() => setOpen(false)} projectKey="WiseSend">
        <WiseSendFocus />
      </FocusModal>
    </>
  );
}

function WiseSendPeek({
  activity,
  onOpen,
}: {
  activity: CardActivity;
  onOpen: () => void;
}) {
  return (
    <ProjectFrame
      meta={{
        year: "2023",
        title: "WiseSend",
        tagline:
          "Files stay on your device. Share by QR, no cloud, no sign-up.",
      }}
      innerClassName="bg-[#f6f7fb]"
      onOpen={onOpen}
      tape="top-left"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#f6f7fb] to-[#e7f2ff]" />

      <div className="relative h-full flex items-center justify-center px-6">
        <PhoneMockup animated={activity === "active"} />
      </div>

      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg overflow-hidden bg-white shadow-sm ring-1 ring-black/5">
            <Image
              src="/projects/wisesend-logo.png"
              alt="WiseSend"
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#111216] leading-none">
              WiseSend
            </p>
            <p className="text-[9px] text-[#6b7280] mt-0.5">Play Store</p>
          </div>
        </div>
        <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-[#0084ff] bg-white px-2 py-1 rounded-full ring-1 ring-[#0084ff]/20">
          no cloud
        </span>
      </div>
    </ProjectFrame>
  );
}

function PhoneMockup({ animated }: { animated: boolean }) {
  return (
    <div className="relative">
      <div className="h-[180px] w-[96px] rounded-[18px] bg-[#0a0d12] p-1 shadow-[0_20px_40px_-10px_rgba(10,13,18,0.35)] ring-1 ring-black/10">
        <div className="h-full w-full rounded-[14px] bg-[#282a36] relative overflow-hidden flex flex-col">
          {/* Status bar */}
          <div className="h-3 flex items-center justify-center">
            <span className="h-[3px] w-10 rounded-full bg-[#0a0d12]" />
          </div>

          {/* Header */}
          <div className="px-2 pt-1">
            <p className="text-[6px] font-semibold text-white leading-none">
              Send file
            </p>
            <p className="text-[5px] text-[#6272a4] mt-0.5">
              Scan from any browser
            </p>
          </div>

          {/* QR Card */}
          <div className="mx-2 mt-2 rounded-md bg-[#44475a] p-1.5 flex items-center justify-center">
            <MiniQR />
          </div>

          {/* URL */}
          <div className="mx-2 mt-1.5 rounded bg-[#0084ff]/15 px-1.5 py-0.5">
            <p className="text-[5px] font-mono text-[#0084ff] truncate">
              192.168.1.18:8080
            </p>
          </div>

          {/* File list */}
          <div className="mx-2 mt-1.5 space-y-0.5 flex-1">
            {["report.pdf", "trip.mov", "notes.md"].map((f, i) => (
              <div
                key={f}
                className="flex items-center gap-1 rounded-sm bg-[#0a0d12]/40 px-1 py-0.5"
              >
                <span
                  className="h-1 w-1 rounded-full"
                  style={{
                    background:
                      i === 0 ? "#ff5555" : i === 1 ? "#50fa7b" : "#bd93f9",
                  }}
                />
                <span className="text-[5px] text-[#f8f8f2] truncate">{f}</span>
              </div>
            ))}
          </div>

          {/* Connected dot */}
          {animated && (
            <div className="absolute bottom-1.5 left-2 flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-[#50fa7b] animate-pulse" />
              <span className="text-[5px] text-[#50fa7b]">connected</span>
            </div>
          )}
        </div>
      </div>

      {/* Orbiting dot showing data transfer */}
      {animated && (
        <div
          className="absolute top-1/2 -right-3 h-[26px] w-[26px] rounded-full bg-white shadow-md ring-1 ring-[#0084ff]/15 flex items-center justify-center"
          style={{ transform: "translateY(-50%)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 12h12m0 0-4-4m4 4-4 4"
              stroke="#0084ff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="16"
              y="4"
              width="5"
              height="16"
              rx="1"
              stroke="#0084ff"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

function MiniQR() {
  const cells = 8;
  const pattern = useRef<boolean[] | null>(null);
  if (!pattern.current) {
    pattern.current = Array.from({ length: cells * cells }, () => Math.random() > 0.5);
  }
  return (
    <div
      className="grid gap-[1px] bg-[#44475a]"
      style={{ gridTemplateColumns: `repeat(${cells}, 1fr)` }}
    >
      {pattern.current.map((on, i) => (
        <span
          key={i}
          className="h-[3px] w-[3px]"
          style={{ background: on ? "#f8f8f2" : "transparent" }}
        />
      ))}
    </div>
  );
}

// ====================================================================
// FOCUS MODAL
// ====================================================================

type Tab = "connect" | "inside" | "story";

function WiseSendFocus() {
  const [tab, setTab] = useState<Tab>("connect");
  return (
    <div className="w-[min(1200px,96vw)] h-[min(760px,92vh)] grid grid-cols-[360px_1fr] bg-white overflow-hidden font-sans">
      <Sidebar />
      <section className="flex flex-col overflow-hidden bg-[#fafbfc]">
        <TabBar tab={tab} setTab={setTab} />
        <div className="flex-1 overflow-hidden">
          {tab === "connect" && <ConnectTab />}
          {tab === "inside" && <InsideTab />}
          {tab === "story" && <StoryTab />}
        </div>
      </section>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="p-7 bg-white border-r border-[#eceef2] overflow-y-auto">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl overflow-hidden ring-1 ring-black/5 bg-white">
          <Image
            src="/projects/wisesend-logo.png"
            alt="WiseSend"
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-semibold tracking-tight text-base leading-none">WiseSend</p>
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6b7280] mt-1">
            2023 · File sharing
          </p>
        </div>
      </div>

      <p className="mt-5 text-[13px] leading-relaxed text-[#4b5563]">
        A file sharing app where your files stay on your device. Open the
        app, it spins up a local server, your phone shows a QR code. Any
        browser on the same WiFi scans and you are transferring. No cloud,
        no sign-up, no app to install on the other end.
      </p>

      <div className="mt-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6b7280] mb-2">
          My role
        </p>
        <p className="text-[13px] leading-relaxed text-[#4b5563]">
          Originator, product design, Flutter app shell and the flows
          people actually see. I built the first version solo in a
          cable-less afternoon. My friend{" "}
          <a
            href="https://github.com/ishaquehassan"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[#0084ff] hover:underline"
          >
            Ishaque
          </a>{" "}
          joined shortly after and we have been co-building since.
        </p>
      </div>

      <div className="mt-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6b7280] mb-2">
          Ishaque built
        </p>
        <p className="text-[13px] leading-relaxed text-[#4b5563]">
          The browser side that opens after the QR scan, the server
          endpoints that talk to it, and most recently an Android-on-
          desktop port that is in the oven for a future release.
        </p>
      </div>

      <div className="mt-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6b7280] mb-2">
          Stack
        </p>
        <div className="flex flex-wrap gap-1.5">
          {[
            "Flutter",
            "Provider",
            "Shelf",
            "WebSockets",
            "Kotlin",
            "Material 3",
            "Poppins",
          ].map((s) => (
            <span
              key={s}
              className="text-[10px] px-2 py-0.5 rounded border border-[#eceef2] text-[#6b7280] bg-white"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6b7280] mb-2">
          What it taught me
        </p>
        <p className="text-[13px] leading-relaxed text-[#4b5563]">
          The best products come from your own itch. I needed to move a
          file and everything else was ad-heavy or cloud-locked. The
          slowest part of shipping was not writing the app, it was the
          months of waiting for Play Store review while we kept adding
          features.
        </p>
      </div>

      <div className="mt-6 space-y-2">
        <a
          href="https://play.google.com/store/apps/details?id=app.xrlabs.wisesend"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between rounded-xl bg-[#0084ff] hover:bg-[#006bd6] text-white px-4 py-3 text-sm font-semibold transition-colors"
        >
          <span>Open on Play Store</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>
        <a
          href="https://github.com/ishaquehassan"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between rounded-xl border border-[#eceef2] px-4 py-2.5 text-xs text-[#6b7280] hover:bg-[#fafbfc] transition-colors"
        >
          <span className="flex items-center gap-2">
            <GithubLogo size={14} />
            Co-builder Ishaque
          </span>
          <span>↗</span>
        </a>
      </div>
    </aside>
  );
}

function TabBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { id: Tab; label: string }[] = [
    { id: "connect", label: "Connect" },
    { id: "inside", label: "Inside the app" },
    { id: "story", label: "Story" },
  ];
  return (
    <nav className="h-14 border-b border-[#eceef2] flex items-center pl-7 pr-24 gap-1 shrink-0 bg-white">
      {items.map((item) => {
        const active = tab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={cn(
              "relative h-14 px-4 text-sm font-medium transition-colors",
              active ? "text-[#111216]" : "text-[#6b7280] hover:text-[#111216]",
            )}
          >
            {item.label}
            {active && (
              <span className="absolute bottom-[-1px] left-4 right-4 h-[2px] rounded-full bg-[#0084ff]" />
            )}
          </button>
        );
      })}
    </nav>
  );
}

// ====================================================================
// CONNECT TAB
// ====================================================================

function ConnectTab() {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const loop = () => {
      setPhase(0);
      timers.push(setTimeout(() => setPhase(1), 1400));
      timers.push(setTimeout(() => setPhase(2), 3000));
      timers.push(setTimeout(() => setPhase(3), 4800));
      timers.push(setTimeout(loop, 7200));
    };
    loop();
    return () => timers.forEach(clearTimeout);
  }, []);

  const labels = [
    "Phone shows a QR",
    "Browser scans",
    "Files appear",
    "Transfer in flight",
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[900px] mx-auto px-10 py-12">
        <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#6b7280]">
          How it connects
        </p>
        <h3 className="mt-1 text-2xl font-semibold tracking-tight">
          Point, scan, transfer. No accounts, no cloud.
        </h3>
        <p className="mt-2 text-sm text-[#6b7280] max-w-[620px] leading-relaxed">
          The phone spins up a local HTTP server and shows a QR. Any
          browser on the same WiFi scans and is connected. For remote
          transfers there is an optional WebSocket tunnel that gives a
          public URL without touching the cloud middle.
        </p>

        <div className="mt-10 grid grid-cols-[auto_1fr] gap-10 items-center">
          <div className="shrink-0">
            <PhoneBig phase={phase} />
          </div>
          <div>
            <BrowserBig phase={phase} />
          </div>
        </div>

        <div className="mt-10 flex items-center gap-2">
          {labels.map((l, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-colors",
                phase >= i
                  ? "bg-[#0084ff] text-white"
                  : "bg-[#f1f3f7] text-[#6b7280]",
              )}
            >
              <span className="text-[10px] font-mono font-bold tabular-nums">
                0{i + 1}
              </span>
              <span>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PhoneBig({ phase }: { phase: number }) {
  return (
    <div className="h-[360px] w-[180px] rounded-[32px] bg-[#0a0d12] p-2 shadow-[0_30px_60px_-15px_rgba(10,13,18,0.3)]">
      <div className="h-full w-full rounded-[26px] bg-[#282a36] overflow-hidden flex flex-col relative">
        <div className="h-6 flex items-center justify-center">
          <span className="h-1 w-14 rounded-full bg-[#0a0d12]" />
        </div>
        <div className="px-4">
          <p className="text-xs font-semibold text-white">Send file</p>
          <p className="text-[10px] text-[#6272a4] mt-0.5">
            Scan from any browser
          </p>
        </div>
        <div className="mx-4 mt-4 rounded-lg bg-[#44475a] p-3 flex items-center justify-center">
          <BigQR highlight={phase >= 1} />
        </div>
        <div className="mx-4 mt-3 rounded bg-[#0084ff]/15 px-2 py-1">
          <p className="text-[9px] font-mono text-[#0084ff] truncate">
            192.168.1.18:8080
          </p>
        </div>
        <div className="px-4 mt-3 space-y-1 flex-1">
          {[
            { name: "vacation.mov", size: "124 MB", color: "#50fa7b" },
            { name: "report.pdf", size: "2.1 MB", color: "#ff5555" },
            { name: "notes.md", size: "18 KB", color: "#bd93f9" },
          ].map((f) => (
            <div
              key={f.name}
              className="flex items-center gap-2 rounded bg-[#0a0d12]/50 px-2 py-1.5"
            >
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ background: f.color }}
              />
              <span className="text-[10px] text-[#f8f8f2] truncate flex-1">
                {f.name}
              </span>
              <span className="text-[8px] text-[#6272a4] font-mono">
                {f.size}
              </span>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 flex items-center gap-1.5">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full transition-colors",
              phase >= 2 ? "bg-[#50fa7b] animate-pulse" : "bg-[#44475a]",
            )}
          />
          <span
            className={cn(
              "text-[9px] transition-colors",
              phase >= 2 ? "text-[#50fa7b]" : "text-[#6272a4]",
            )}
          >
            {phase >= 2 ? "connected · 1 device" : "waiting"}
          </span>
        </div>
      </div>
    </div>
  );
}

function BigQR({ highlight }: { highlight: boolean }) {
  const cells = 11;
  const pattern = useRef<boolean[] | null>(null);
  if (!pattern.current) {
    pattern.current = Array.from(
      { length: cells * cells },
      () => Math.random() > 0.5,
    );
  }
  return (
    <div
      className={cn(
        "grid gap-[1.5px] p-1 rounded transition-all",
        highlight ? "bg-white ring-2 ring-[#0084ff]/50 scale-105" : "bg-white/90",
      )}
      style={{ gridTemplateColumns: `repeat(${cells}, 1fr)` }}
    >
      {pattern.current.map((on, i) => (
        <span
          key={i}
          className="h-[5px] w-[5px]"
          style={{ background: on ? "#0a0d12" : "transparent" }}
        />
      ))}
    </div>
  );
}

function BrowserBig({ phase }: { phase: number }) {
  return (
    <div className="rounded-xl bg-white border border-[#eceef2] shadow-[0_20px_40px_-15px_rgba(10,13,18,0.15)] overflow-hidden">
      {/* Chrome */}
      <div className="h-9 bg-[#f5f6f8] border-b border-[#eceef2] flex items-center px-3 gap-2">
        <div className="flex gap-1.5 shrink-0">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 h-6 rounded-md bg-white border border-[#eceef2] px-2 flex items-center">
          <span className="text-[10px] font-mono text-[#6b7280] truncate">
            {phase >= 1 ? "192.168.1.18:8080" : ""}
            {phase === 0 && (
              <span className="text-[#c1c5cc]">
                waiting for scan...
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 min-h-[280px]">
        {phase < 2 ? (
          <div className="flex flex-col items-center justify-center h-[280px] text-center">
            <div className="h-12 w-12 rounded-full bg-[#e7f2ff] flex items-center justify-center mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#0084ff" strokeWidth="1.5" />
                <path
                  d="M12 8v4l2 2"
                  stroke="#0084ff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-[#111216]">
              {phase === 0 ? "Waiting for scan" : "Connecting..."}
            </p>
            <p className="text-xs text-[#6b7280] mt-1">
              Scan the QR from your phone
            </p>
          </div>
        ) : (
          <div className="animate-[fadeIn_300ms_ease-out]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#0084ff]">
                  connected · 3 files
                </p>
                <h4 className="text-base font-semibold mt-0.5">
                  Haider&apos;s iPhone
                </h4>
              </div>
              <button className="h-8 px-3 rounded-lg bg-[#0084ff] text-white text-xs font-semibold">
                Download all
              </button>
            </div>
            <div className="space-y-1.5">
              {[
                { name: "vacation.mov", size: "124 MB", icon: "🎬", progress: phase >= 3 ? 72 : 0 },
                { name: "report.pdf", size: "2.1 MB", icon: "📄", progress: phase >= 3 ? 100 : 0 },
                { name: "notes.md", size: "18 KB", icon: "📝", progress: phase >= 3 ? 100 : 0 },
              ].map((f) => (
                <div
                  key={f.name}
                  className="rounded-lg border border-[#eceef2] px-3 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base leading-none">{f.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{f.name}</p>
                      <p className="text-[11px] text-[#6b7280]">{f.size}</p>
                    </div>
                    {phase >= 3 ? (
                      <span
                        className={cn(
                          "text-[11px] font-semibold tabular-nums",
                          f.progress === 100 ? "text-[#16a34a]" : "text-[#0084ff]",
                        )}
                      >
                        {f.progress === 100 ? "done" : `${f.progress}%`}
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#6b7280]">queued</span>
                    )}
                  </div>
                  {phase >= 3 && f.progress < 100 && (
                    <div className="mt-2 h-1 rounded-full bg-[#eceef2] overflow-hidden">
                      <div
                        className="h-full bg-[#0084ff] transition-all duration-700"
                        style={{ width: `${f.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}

// ====================================================================
// INSIDE TAB
// ====================================================================

function InsideTab() {
  const screens = [
    {
      name: "Home",
      caption: "Start screen. Everything is one tap away.",
      content: (
        <div className="h-full bg-[#282a36] p-3 text-white">
          <p className="text-[9px] text-[#6272a4] uppercase tracking-wider">
            WiseSend
          </p>
          <p className="text-sm font-semibold mt-0.5">Quick actions</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              { label: "Share", color: "#0084ff" },
              { label: "Receive", color: "#50fa7b" },
              { label: "Recent", color: "#bd93f9" },
              { label: "Car mode", color: "#ffb86c" },
            ].map((a) => (
              <div
                key={a.label}
                className="rounded-md bg-[#44475a] p-2 flex flex-col gap-1.5"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: a.color }}
                />
                <span className="text-[9px] font-semibold">{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      name: "File server",
      caption: "QR, local URL, live connection status.",
      content: (
        <div className="h-full bg-[#282a36] p-3 text-white flex flex-col gap-2">
          <p className="text-[9px] text-[#6272a4] uppercase tracking-wider">
            Server live
          </p>
          <div className="rounded-md bg-[#44475a] p-2 flex items-center justify-center">
            <div
              className="grid gap-[1px] bg-white p-1"
              style={{ gridTemplateColumns: "repeat(9, 1fr)" }}
            >
              {Array.from({ length: 81 }).map((_, i) => (
                <span
                  key={i}
                  className="h-[4px] w-[4px]"
                  style={{ background: (i * 7) % 3 === 0 ? "#0a0d12" : "transparent" }}
                />
              ))}
            </div>
          </div>
          <p className="text-[8px] font-mono text-[#0084ff] truncate">
            192.168.1.18:8080
          </p>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#50fa7b] animate-pulse" />
            <span className="text-[8px] text-[#50fa7b]">1 device</span>
          </div>
        </div>
      ),
    },
    {
      name: "Receiver",
      caption: "Drop in files, watch them land.",
      content: (
        <div className="h-full bg-[#282a36] p-3 text-white flex flex-col gap-2">
          <p className="text-[9px] text-[#6272a4] uppercase tracking-wider">
            Incoming
          </p>
          {[
            { name: "vacation.mov", p: 100, c: "#50fa7b" },
            { name: "slides.key", p: 62, c: "#0084ff" },
            { name: "photo.jpg", p: 100, c: "#50fa7b" },
          ].map((f) => (
            <div key={f.name} className="rounded bg-[#44475a] p-1.5">
              <div className="flex items-center justify-between text-[8px]">
                <span className="truncate">{f.name}</span>
                <span className="font-mono" style={{ color: f.c }}>
                  {f.p}%
                </span>
              </div>
              <div className="mt-1 h-[3px] bg-[#282a36] rounded overflow-hidden">
                <div
                  className="h-full rounded"
                  style={{ width: `${f.p}%`, background: f.c }}
                />
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      name: "Android Auto",
      caption: "A car-friendly view for hands-free moments.",
      content: (
        <div className="h-full bg-[#0a0d12] p-3 text-white flex flex-col gap-2">
          <p className="text-[9px] text-[#bd93f9] uppercase tracking-wider font-semibold">
            Car mode
          </p>
          <div className="rounded-lg bg-[#1c1f2a] p-3 flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="h-10 w-10 rounded-full bg-[#0084ff] mx-auto flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14m0 0-5-5m5 5-5 5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-[10px] mt-2 font-semibold">Quick receive</p>
              <p className="text-[8px] text-[#6272a4] mt-0.5">Large tap zone</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="h-full overflow-y-auto px-10 py-10">
      <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#6b7280]">
        Screen tour
      </p>
      <h3 className="mt-1 text-2xl font-semibold tracking-tight">
        Four screens do most of the work.
      </h3>
      <p className="mt-2 text-sm text-[#6b7280] max-w-[620px] leading-relaxed">
        Built in Flutter with a Dracula-adjacent dark theme and Poppins.
        The same app runs on a phone, a tablet, and via Android Auto. A
        desktop port is next.
      </p>

      <div className="mt-10 grid grid-cols-2 xl:grid-cols-4 gap-6">
        {screens.map((s) => (
          <div key={s.name}>
            <div className="h-[260px] w-full rounded-[22px] bg-[#0a0d12] p-1.5 shadow-[0_20px_40px_-15px_rgba(10,13,18,0.25)]">
              <div className="h-full w-full rounded-[18px] overflow-hidden">
                {s.content}
              </div>
            </div>
            <p className="mt-3 text-sm font-semibold text-[#111216]">{s.name}</p>
            <p className="text-xs text-[#6b7280] mt-0.5 leading-relaxed">
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
      label: "The afternoon",
      title: "A file and no cable.",
      body: "One afternoon I needed to move something from my phone to my PC. No cable. Every app on the Play Store was ad-heavy, cloud-first, or wanted an account. I started building the app I wanted to open in that moment.",
    },
    {
      label: "The friend",
      title: "Ishaque saw it and leaned in.",
      body: "I showed the first version to my friend Ishaque (@ishaquehassan). He got excited and joined. He took on the browser-side experience that opens after the QR scan, plus the server routes it talks to.",
    },
    {
      label: "The months",
      title: "Play Store review took forever.",
      body: "By the time it got approved it had grown into a full-featured app. Live thumbnails, an optional WebSocket tunnel for remote transfers without port forwarding, an Android Auto screen. The wait forced polish.",
    },
    {
      label: "Today",
      title: "Small tool, specific crowd.",
      body: "WiseSend sits at 10+ installs on the Play Store, small on purpose. No ads, no sign-up, files stay on your device. Ishaque is currently cooking a desktop port for the next release.",
    },
  ];

  const stats = [
    { label: "On Play Store", value: "2 years" },
    { label: "Install count", value: "10+" },
    { label: "Ads", value: "none" },
    { label: "Sign-up", value: "never" },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[760px] mx-auto px-10 py-12">
        <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#6b7280]">
          Origin
        </p>
        <h3 className="mt-1 text-3xl font-semibold tracking-tight leading-tight">
          One afternoon, one missing cable, one app that kept growing.
        </h3>

        <div className="mt-8 grid grid-cols-4 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white border border-[#eceef2] p-4">
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6b7280]">
                {s.label}
              </p>
              <p className="text-xl font-bold mt-1 tracking-tight">{s.value}</p>
            </div>
          ))}
        </div>

        <ol className="mt-10 relative border-l-2 border-[#eceef2]">
          {beats.map((b, i) => (
            <li key={i} className="pl-6 pb-8 relative last:pb-0">
              <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-[#0084ff] ring-4 ring-white" />
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#0084ff]">
                {b.label}
              </p>
              <h4 className="mt-1 text-lg font-semibold tracking-tight">
                {b.title}
              </h4>
              <p className="mt-1.5 text-sm text-[#4b5563] leading-relaxed">
                {b.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
