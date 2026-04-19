"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CardActivity } from "../use-card-activity";
import { ProjectFrame } from "../project-frame";
import { FocusModal } from "../focus-modal";
import { ClaudeLogo, GithubLogo } from "../tool-logos";
import { cn } from "@/lib/cn";

const WATCHED = [
  { pair: "BTC/USDT", price: 67420, ta: 0.75, ml: 0.68, ai: 0.82, verdict: "STRONG_BUY" as const },
  { pair: "ETH/USDT", price: 3285, ta: 0.72, ml: 0.78, ai: 0.68, verdict: "BUY" as const },
  { pair: "SOL/USDT", price: 184.3, ta: 0.44, ml: 0.52, ai: 0.38, verdict: "HOLD" as const },
  { pair: "AVAX/USDT", price: 38.7, ta: 0.28, ml: 0.35, ai: 0.42, verdict: "SELL" as const },
];

const DISCORD = {
  bg: "#313338",
  sidebar: "#1e1f22",
  channel: "#2b2d31",
  hover: "#35373c",
  text: "#dbdee1",
  muted: "#949ba4",
  accent: "#5865f2",
  green: "#23a55a",
  red: "#f23f42",
  yellow: "#f0b232",
  embed: "#2b2d31",
  border: "#3f4147",
};

export function TradingBotPrototype({ activity }: { activity: CardActivity }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TradingPeek activity={activity} onOpen={() => setOpen(true)} />
      <FocusModal open={open} onClose={() => setOpen(false)} projectKey="Trading Bot">
        <TradingFocus />
      </FocusModal>
    </>
  );
}

function TradingPeek({
  activity,
  onOpen,
}: {
  activity: CardActivity;
  onOpen: () => void;
}) {
  const [idx, setIdx] = useState(1); // start on ETH (BUY vibe)

  useEffect(() => {
    if (activity === "idle") return;
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % WATCHED.length);
    }, 2800);
    return () => clearInterval(id);
  }, [activity]);

  const pair = WATCHED[idx];

  return (
    <ProjectFrame
      meta={{
        year: "2024",
        title: "Trading Bot",
        tagline: "Halal crypto automation. Discord-first, 3-layer consensus, self-healing.",
      }}
      innerClassName="bg-[#313338]"
      onOpen={onOpen}
      tape="top-left"
    >
      {/* Discord channel header */}
      <div className="relative h-full flex flex-col text-[#dbdee1]" style={{ fontFamily: "'gg sans', 'Inter', system-ui" }}>
        <div className="h-8 border-b border-[#1e1f22] flex items-center px-3 gap-2 text-xs shrink-0">
          <span className="text-[#949ba4]">#</span>
          <span className="font-semibold text-white text-[11px]">trade-alerts</span>
          <span className="ml-auto text-[9px] text-[#949ba4] font-medium">live</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#23a55a] animate-pulse" />
        </div>

        {/* Message with embed */}
        <div className="flex-1 px-3 py-2.5 flex gap-2 min-h-0">
          <div className="h-7 w-7 rounded-full shrink-0 bg-gradient-to-br from-[#5865f2] to-[#3b46d4] flex items-center justify-center text-white text-[9px] font-bold">
            TB
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5 text-[10px]">
              <span className="text-white font-semibold">Trading Bot</span>
              <span className="px-1 h-3 rounded-sm bg-[#5865f2] text-white text-[7px] font-bold flex items-center">APP</span>
              <span className="text-[#949ba4]">now</span>
            </div>

            {/* Embed */}
            <div
              className="mt-1 rounded border-l-[3px] bg-[#2b2d31] pl-2.5 pr-2 py-1.5"
              style={{
                borderLeftColor:
                  pair.verdict === "STRONG_BUY" || pair.verdict === "BUY"
                    ? DISCORD.green
                    : pair.verdict === "SELL"
                      ? DISCORD.red
                      : DISCORD.yellow,
              }}
            >
              <p className="text-[10px] font-semibold text-white truncate">
                {pair.verdict === "STRONG_BUY"
                  ? "📈 STRONG SIGNAL"
                  : pair.verdict === "BUY"
                    ? "📊 Entry signal"
                    : pair.verdict === "SELL"
                      ? "📉 Exit signal"
                      : "⏸️ Hold"}
                <span className="ml-1 text-[#949ba4] font-normal">· {pair.pair}</span>
              </p>

              {/* 3-layer bars */}
              <div className="mt-1.5 space-y-1">
                <LayerBar label="TA" value={pair.ta} color="#5865f2" />
                <LayerBar label="ML" value={pair.ml} color="#9b6cff" />
                <LayerBar label="AI" value={pair.ai} color="#f0b232" />
              </div>

              <div className="mt-1.5 pt-1.5 border-t border-[#3f4147] flex items-center justify-between text-[8px]">
                <span className="text-[#949ba4] tabular-nums">
                  @ ${pair.price.toLocaleString()}
                </span>
                <span className="text-[#949ba4]">scan #128 · 16 pairs</span>
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-[#1e1f22] px-3 py-1.5 flex items-center gap-2 text-[8px] font-mono uppercase tracking-[0.22em] text-[#949ba4]">
          <span>25 slash commands</span>
          <span>·</span>
          <span>systemctl active</span>
          <span className="ml-auto text-[#23a55a]">paper mode</span>
        </div>
      </div>
    </ProjectFrame>
  );
}

function LayerBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-5 text-[8px] font-bold tabular-nums" style={{ color }}>
        {label}
      </span>
      <div className="flex-1 h-1 rounded-full bg-[#1e1f22] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.round(value * 100)}%`, background: color }}
        />
      </div>
      <span className="w-6 text-[8px] text-right text-[#949ba4] tabular-nums">
        {Math.round(value * 100)}%
      </span>
    </div>
  );
}

// ====================================================================
// FOCUS MODAL
// ====================================================================

type Tab = "discord" | "signals" | "ml" | "rules";

function TradingFocus() {
  const [tab, setTab] = useState<Tab>("discord");

  return (
    <div className="w-[min(1280px,96vw)] h-[min(800px,92vh)] grid grid-cols-[360px_1fr] bg-white text-[#0a0e27] overflow-hidden font-sans">
      <CaseStudySidebar />
      <section className="flex flex-col overflow-hidden bg-white min-w-0">
        <TopBar tab={tab} />
        <TabBar tab={tab} setTab={setTab} />
        <div className="flex-1 overflow-hidden">
          {tab === "discord" && <DiscordTab />}
          {tab === "signals" && <SignalsTab />}
          {tab === "ml" && <MLPipelineTab />}
          {tab === "rules" && <RulesTab />}
        </div>
      </section>
    </div>
  );
}

function CaseStudySidebar() {
  return (
    <aside className="p-7 bg-[#f7f8fa] border-r border-[#e6e8ec] overflow-y-auto">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-[#0a0e27] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M3 17l5-6 4 4 4-8 5 10"
              stroke="#23a55a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="font-semibold tracking-tight text-base leading-none">Trading Bot</p>
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#5b616e] mt-1">
            2024 · Halal automation
          </p>
        </div>
      </div>

      <p className="mt-5 text-[13px] leading-relaxed text-[#5b616e]">
        A Discord-first automated spot-trading bot on Binance. Halal by
        design. No leverage, no margin, no futures. Three independent
        signal layers (TA, an ML ensemble, and Claude&apos;s reasoning)
        have to agree before anything fires. A `/fix` command lets the bot
        diagnose and repair itself through a sandboxed Claude CLI.
      </p>

      <div className="mt-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#5b616e] mb-2">
          My role
        </p>
        <p className="text-[13px] leading-relaxed text-[#5b616e]">
          Solo. Strategy and risk rules, the ML pipeline, the Discord bot
          with 25 slash commands, the self-healing loop, and the systemd
          deployment. Also the first user, which was by far the harshest
          review cycle.
        </p>
      </div>

      <div className="mt-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#5b616e] mb-3">
          Built with
        </p>
        <div className="inline-flex items-center gap-2 rounded-md border border-[#e6e8ec] bg-white px-3 py-1.5">
          <ClaudeLogo size={14} className="text-[#0a0e27]" />
          <span className="text-[11px] font-semibold text-[#0a0e27]">Claude Code</span>
          <span className="text-[9px] text-[#9a9ea8] ml-1">strategy, ML, bot, ops</span>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#5b616e] mb-2">
          Stack
        </p>
        <div className="flex flex-wrap gap-1.5">
          {[
            "Python",
            "discord.py",
            "XGBoost",
            "Random Forest",
            "Gradient Boosting",
            "scikit-learn",
            "pandas_ta",
            "python-binance",
            "PostgreSQL",
            "Redis",
            "Claude CLI",
            "Flask",
            "WebSockets",
            "systemd",
          ].map((s) => (
            <span
              key={s}
              className="text-[10px] px-2 py-0.5 rounded border border-[#e6e8ec] text-[#5b616e] bg-white"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#5b616e] mb-2">
          What it taught me
        </p>
        <p className="text-[13px] leading-relaxed text-[#5b616e]">
          Markets evolve, so the ML training weights more recent data
          (2025=1.0, 2021=0.4). Adaptive TA/AI/ML weights had to be
          smoothed (70% inertia, 30% update) to stop the strategy
          whipsawing. And running Claude as a subprocess CLI, not an SDK
          call, turned out to be the right choice for safety gates and
          cost.
        </p>
      </div>

      <div className="mt-6 p-3 rounded-xl bg-[#eaf0ff] text-[#0a2ca6] text-xs leading-relaxed">
        Three layers must agree. 4h veto on 1h signals. ATR stops. 3-phase
        trailing take-profit. Weekly retrain. One kill switch.
      </div>

      <div className="mt-6 space-y-2">
        <a
          href="https://github.com/haider0072/trading-bot"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between rounded-xl bg-[#0a0e27] hover:bg-[#1a1f3d] text-white px-4 py-3 text-sm font-semibold transition-colors"
        >
          <span className="flex items-center gap-2">
            <GithubLogo size={16} />
            View on GitHub
          </span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>
      </div>
    </aside>
  );
}

function TopBar({ tab }: { tab: Tab }) {
  const titles: Record<Tab, { title: string; sub: string }> = {
    discord: { title: "Discord feed", sub: "Primary interface, 25 slash commands" },
    signals: { title: "Signal scan", sub: "Current 1h evaluation across the watchlist" },
    ml: { title: "ML pipeline", sub: "800k candles, 40 features, weekly retrain" },
    rules: { title: "Strategy rules", sub: "Entry, risk, and exit enforced in code" },
  };
  const t = titles[tab];
  return (
    <header className="h-[72px] border-b border-[#e6e8ec] flex items-center pl-7 pr-24 gap-6 shrink-0 relative">
      <div className="flex flex-col min-w-0">
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#5b616e]">
          {t.sub}
        </span>
        <span className="text-xl font-bold tracking-tight mt-0.5">{t.title}</span>
      </div>
      <div className="ml-auto flex items-center gap-3 shrink-0">
        <span className="hidden lg:flex items-center gap-1.5 text-xs text-[#5b616e] whitespace-nowrap">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00d395] animate-pulse shrink-0" />
          <span className="font-medium">systemd active</span>
        </span>
        <span className="h-7 px-2.5 rounded-md bg-[#eaf0ff] text-[#0052ff] text-[10px] font-mono uppercase tracking-[0.22em] font-semibold inline-flex items-center">
          paper mode
        </span>
      </div>
    </header>
  );
}

function TabBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { id: Tab; label: string; hint: string }[] = [
    { id: "discord", label: "Discord", hint: "how you use it" },
    { id: "signals", label: "Signals", hint: "TA · ML · AI" },
    { id: "ml", label: "ML pipeline", hint: "training + features" },
    { id: "rules", label: "Rules", hint: "entry · risk · exit" },
  ];
  return (
    <nav className="h-12 border-b border-[#e6e8ec] flex items-center px-5 gap-1 shrink-0">
      {items.map((item) => {
        const active = tab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={cn(
              "relative h-12 px-4 text-sm font-medium transition-colors",
              active ? "text-[#0a0e27]" : "text-[#5b616e] hover:text-[#0a0e27]",
            )}
          >
            {item.label}
            {active && (
              <span className="absolute bottom-[-1px] left-4 right-4 h-[2px] rounded-full bg-[#0052ff]" />
            )}
          </button>
        );
      })}
    </nav>
  );
}

// ====================================================================
// DISCORD TAB
// ====================================================================

type DiscordMsg =
  | { kind: "slash"; user: string; command: string; args?: string }
  | { kind: "bot-embed"; title: string; fields: { name: string; value: string; color?: string }[]; color: string; footer?: string }
  | { kind: "bot-text"; text: string }
  | { kind: "signal-alert"; pair: string; ta: number; ml: number; ai: number; entry: number; sl: number; tp: number }
  | { kind: "trade-open"; pair: string; side: "BUY" | "SELL"; price: number; size: string; sl: number; tp: number }
  | { kind: "trade-close"; pair: string; pnl: number; reason: string }
  | { kind: "ask"; question: string; answer: string };

const CHANNELS = [
  { name: "trade-alerts", unread: 3, icon: "📈" },
  { name: "system-logs", unread: 0, icon: "⚙️" },
  { name: "ask-claude", unread: 1, icon: "💬" },
  { name: "commands", unread: 0, icon: "🎛️" },
];

function DiscordTab() {
  const [active, setActive] = useState(0);
  const [messages, setMessages] = useState<(DiscordMsg & { id: number; time: string })[]>(() => [
    {
      id: 1,
      time: "09:14",
      kind: "signal-alert",
      pair: "ETH/USDT",
      ta: 0.72,
      ml: 0.78,
      ai: 0.68,
      entry: 3281.5,
      sl: 3248.0,
      tp: 3395.2,
    },
    {
      id: 2,
      time: "09:15",
      kind: "trade-open",
      pair: "ETH/USDT",
      side: "BUY",
      price: 3281.5,
      size: "0.32 ETH",
      sl: 3248.0,
      tp: 3395.2,
    },
    {
      id: 3,
      time: "09:32",
      kind: "slash",
      user: "haider",
      command: "/ask",
      args: "why did you enter ETH and not SOL?",
    },
    {
      id: 4,
      time: "09:32",
      kind: "ask",
      question: "why did you enter ETH and not SOL?",
      answer:
        "ETH hit TA score 3 with confidence 72% and AI agreed. SOL scored 1 (TA=buy weak), and the 4h timeframe was bearish so the multi-timeframe filter skipped it. Also, SOL had 2 losses in the last hour, so it's in a 60-min cooldown.",
    },
    {
      id: 5,
      time: "10:04",
      kind: "slash",
      user: "haider",
      command: "/weights",
    },
    {
      id: 6,
      time: "10:04",
      kind: "bot-embed",
      title: "Adaptive signal weights · week 14",
      color: "#5865f2",
      fields: [
        { name: "TA", value: "47% · rolling accuracy 61%", color: "#5865f2" },
        { name: "AI", value: "44% · rolling accuracy 58%", color: "#f0b232" },
        { name: "ML", value: "9% · rolling accuracy 52%", color: "#9b6cff" },
      ],
      footer: "Smoothed 70% old · 30% new · updates every Sunday",
    },
    {
      id: 7,
      time: "11:47",
      kind: "trade-close",
      pair: "ETH/USDT",
      pnl: 1.8,
      reason: "trailing stop hit · +0.4% locked in phase 2",
    },
  ]);
  const idRef = useRef(8);

  useEffect(() => {
    const pool: DiscordMsg[] = [
      {
        kind: "signal-alert",
        pair: "BTC/USDT",
        ta: 0.75,
        ml: 0.68,
        ai: 0.82,
        entry: 67420,
        sl: 66411,
        tp: 69443,
      },
      {
        kind: "bot-text",
        text: "4h bearish skip SOL/USDT. Multi-timeframe filter enforced.",
      },
      {
        kind: "bot-text",
        text: "Scan done: 3 buy, 1 sell, 12 hold · 16 pairs",
      },
      {
        kind: "trade-open",
        pair: "BTC/USDT",
        side: "BUY",
        price: 67420,
        size: "0.018 BTC",
        sl: 66411,
        tp: 69443,
      },
    ];
    const id = setInterval(() => {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      const now = new Date();
      const t = `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
      setMessages((prev) => [...prev.slice(-12), { ...pick, id: idRef.current++, time: t }]);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="h-full grid grid-cols-[200px_1fr]"
      style={{ fontFamily: "'gg sans', 'Inter', system-ui" }}
    >
      {/* Channel sidebar */}
      <div className="bg-[#2b2d31] text-[#dbdee1] flex flex-col">
        <div className="h-12 px-4 flex items-center border-b border-[#1e1f22] shrink-0">
          <span className="text-sm font-semibold text-white">trading-bot</span>
          <span className="ml-auto text-[#949ba4] text-xs">▾</span>
        </div>
        <div className="py-3 px-2 flex-1 overflow-y-auto">
          <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[#949ba4]">
            channels
          </p>
          {CHANNELS.map((c, i) => (
            <button
              key={c.name}
              onClick={() => setActive(i)}
              className={cn(
                "w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors mb-0.5",
                active === i
                  ? "bg-[#404249] text-white"
                  : "text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]",
              )}
            >
              <span className="text-[#949ba4] text-base leading-none">#</span>
              <span className="flex-1 text-left truncate">{c.name}</span>
              {c.unread > 0 && (
                <span className="h-4 min-w-[16px] px-1 rounded-full bg-[#f23f42] text-white text-[10px] font-bold flex items-center justify-center">
                  {c.unread}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="px-2 py-2 bg-[#232428] border-t border-[#1e1f22] flex items-center gap-2 shrink-0">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#5865f2] to-[#3b46d4] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
            TB
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">Trading Bot</p>
            <p className="text-[10px] text-[#23a55a]">online · paper</p>
          </div>
        </div>
      </div>

      {/* Channel feed */}
      <div className="bg-[#313338] text-[#dbdee1] flex flex-col min-w-0">
        <div className="h-12 px-4 flex items-center border-b border-[#1e1f22] shrink-0 gap-2 whitespace-nowrap overflow-hidden">
          <span className="text-[#949ba4] text-lg shrink-0">#</span>
          <span className="font-semibold text-white truncate">{CHANNELS[active].name}</span>
          <span className="text-[#949ba4] text-xs border-l border-[#3f4147] pl-3 ml-1 truncate hidden xl:inline">
            Automated alerts from the trading loop
          </span>
          <span className="ml-auto text-xs text-[#949ba4] shrink-0">{messages.length} msgs</span>
        </div>

        <div className="flex-1 overflow-y-auto py-3">
          {messages.map((m) => (
            <DiscordMessage key={m.id} msg={m} />
          ))}
        </div>

        <div className="px-4 pb-3 shrink-0">
          <div className="bg-[#383a40] rounded-lg px-4 py-2.5 text-sm text-[#949ba4] flex items-center gap-2">
            <span className="text-[#949ba4]">+</span>
            <span>Message #{CHANNELS[active].name}</span>
            <span className="ml-auto text-[10px] font-mono uppercase tracking-[0.2em]">
              try /ask, /scan, /fix
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiscordMessage({ msg }: { msg: DiscordMsg & { id: number; time: string } }) {
  const botAvatar = (
    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#5865f2] to-[#3b46d4] flex items-center justify-center text-white text-xs font-bold shrink-0">
      TB
    </div>
  );
  const userAvatar = (
    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#c2410c] to-[#9a3412] flex items-center justify-center text-white text-xs font-bold shrink-0">
      H
    </div>
  );

  if (msg.kind === "slash") {
    return (
      <div className="px-4 py-1.5 hover:bg-[#2e3035] flex gap-3 group">
        {userAvatar}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2 text-sm">
            <span className="font-semibold text-[#e1b94c]">{msg.user}</span>
            <span className="text-[11px] text-[#949ba4]">{msg.time}</span>
          </div>
          <p className="text-sm text-[#dbdee1]">
            <span className="px-1.5 py-0.5 rounded bg-[#404249] text-[#c4d4f7] font-medium">
              {msg.command}
            </span>
            {msg.args && <span className="ml-2 text-[#b5bac1]">{msg.args}</span>}
          </p>
        </div>
      </div>
    );
  }

  if (msg.kind === "signal-alert") {
    return (
      <div className="px-4 py-1.5 hover:bg-[#2e3035] flex gap-3">
        {botAvatar}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2 text-sm">
            <span className="font-semibold text-white">Trading Bot</span>
            <span className="px-1 h-4 rounded-sm bg-[#5865f2] text-white text-[9px] font-bold flex items-center">
              APP
            </span>
            <span className="text-[11px] text-[#949ba4]">{msg.time}</span>
          </div>
          <div className="mt-1 max-w-[460px] rounded border-l-[3px] border-[#23a55a] bg-[#2b2d31] p-3">
            <p className="text-sm font-semibold text-white">
              📈 STRONG SIGNAL <span className="text-[#949ba4] font-normal">· {msg.pair}</span>
            </p>
            <div className="mt-2 space-y-1">
              <LayerBarDiscord label="Technical" value={msg.ta} color="#5865f2" />
              <LayerBarDiscord label="Machine Learning" value={msg.ml} color="#9b6cff" />
              <LayerBarDiscord label="AI (Claude)" value={msg.ai} color="#f0b232" />
            </div>
            <div className="mt-3 pt-2 border-t border-[#3f4147] grid grid-cols-3 gap-3 text-[11px]">
              <Field label="Entry" value={`$${msg.entry.toLocaleString()}`} />
              <Field label="Stop" value={`$${msg.sl.toLocaleString()}`} color="#f23f42" />
              <Field label="Target" value={`$${msg.tp.toLocaleString()}`} color="#23a55a" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (msg.kind === "trade-open") {
    return (
      <div className="px-4 py-1.5 hover:bg-[#2e3035] flex gap-3">
        {botAvatar}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2 text-sm">
            <span className="font-semibold text-white">Trading Bot</span>
            <span className="text-[11px] text-[#949ba4]">{msg.time}</span>
          </div>
          <div className="mt-1 max-w-[420px] rounded border-l-[3px] border-[#23a55a] bg-[#2b2d31] px-3 py-2">
            <p className="text-xs font-semibold text-white">
              ✅ {msg.side} filled · {msg.pair}
            </p>
            <p className="text-[11px] text-[#b5bac1] mt-0.5">
              @ ${msg.price.toLocaleString()} · size {msg.size}
            </p>
            <p className="text-[10px] text-[#949ba4] mt-1 tabular-nums">
              SL ${msg.sl.toLocaleString()} · TP ${msg.tp.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (msg.kind === "trade-close") {
    const win = msg.pnl >= 0;
    return (
      <div className="px-4 py-1.5 hover:bg-[#2e3035] flex gap-3">
        {botAvatar}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2 text-sm">
            <span className="font-semibold text-white">Trading Bot</span>
            <span className="text-[11px] text-[#949ba4]">{msg.time}</span>
          </div>
          <div
            className="mt-1 max-w-[420px] rounded border-l-[3px] bg-[#2b2d31] px-3 py-2"
            style={{ borderLeftColor: win ? "#23a55a" : "#f23f42" }}
          >
            <p className="text-xs font-semibold text-white">
              {win ? "🎯 Closed" : "❌ Stopped"} · {msg.pair}
              <span
                className="ml-2 font-bold tabular-nums"
                style={{ color: win ? "#23a55a" : "#f23f42" }}
              >
                {win ? "+" : ""}
                {msg.pnl.toFixed(2)}%
              </span>
            </p>
            <p className="text-[11px] text-[#949ba4] mt-0.5">{msg.reason}</p>
          </div>
        </div>
      </div>
    );
  }

  if (msg.kind === "ask") {
    return (
      <div className="px-4 py-1.5 hover:bg-[#2e3035] flex gap-3">
        {botAvatar}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2 text-sm">
            <span className="font-semibold text-white">Trading Bot</span>
            <span className="px-1 h-4 rounded-sm bg-[#5865f2] text-white text-[9px] font-bold flex items-center">
              APP
            </span>
            <span className="text-[11px] text-[#949ba4]">{msg.time}</span>
          </div>
          <div className="mt-1 max-w-[520px] rounded bg-[#2b2d31] px-3 py-2.5 border-l-[3px] border-[#f0b232]">
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#f0b232] mb-1.5">
              /ask · claude cli · redis context
            </p>
            <p className="text-[13px] text-[#dbdee1] leading-relaxed">{msg.answer}</p>
          </div>
        </div>
      </div>
    );
  }

  if (msg.kind === "bot-embed") {
    return (
      <div className="px-4 py-1.5 hover:bg-[#2e3035] flex gap-3">
        {botAvatar}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2 text-sm">
            <span className="font-semibold text-white">Trading Bot</span>
            <span className="text-[11px] text-[#949ba4]">{msg.time}</span>
          </div>
          <div
            className="mt-1 max-w-[440px] rounded border-l-[3px] bg-[#2b2d31] px-3 py-2.5"
            style={{ borderLeftColor: msg.color }}
          >
            <p className="text-sm font-semibold text-white">{msg.title}</p>
            <div className="mt-2 space-y-1.5">
              {msg.fields.map((f) => (
                <div key={f.name} className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold w-10"
                    style={{ color: f.color || "#949ba4" }}
                  >
                    {f.name}
                  </span>
                  <span className="text-[12px] text-[#b5bac1] tabular-nums">{f.value}</span>
                </div>
              ))}
            </div>
            {msg.footer && (
              <p className="mt-2 pt-2 border-t border-[#3f4147] text-[10px] text-[#949ba4]">
                {msg.footer}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (msg.kind === "bot-text") {
    return (
      <div className="px-4 py-1.5 hover:bg-[#2e3035] flex gap-3">
        {botAvatar}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2 text-sm">
            <span className="font-semibold text-white">Trading Bot</span>
            <span className="text-[11px] text-[#949ba4]">{msg.time}</span>
          </div>
          <p className="text-sm text-[#dbdee1]">{msg.text}</p>
        </div>
      </div>
    );
  }

  return null;
}

function LayerBarDiscord({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="w-32 text-[#b5bac1]">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-[#1e1f22] overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.round(value * 100)}%`, background: color }}
        />
      </div>
      <span className="w-9 text-right font-semibold tabular-nums" style={{ color }}>
        {Math.round(value * 100)}%
      </span>
    </div>
  );
}

function Field({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div>
      <p className="text-[9px] font-mono uppercase tracking-[0.22em] text-[#949ba4]">
        {label}
      </p>
      <p className="text-xs font-semibold tabular-nums" style={{ color: color || "white" }}>
        {value}
      </p>
    </div>
  );
}

// ====================================================================
// SIGNALS TAB
// ====================================================================

const INDICATORS = [
  { name: "RSI", period: "14", value: "34.2", score: "+2", note: "oversold, reversal zone", color: "#0052ff" },
  { name: "RSI", period: "6", value: "41.8", score: "+1", note: "short-term turning up", color: "#0052ff" },
  { name: "MACD", period: "12 / 26 / 9", value: "bullish cross", score: "+2", note: "histogram positive, momentum flip", color: "#0052ff" },
  { name: "EMA", period: "9 > 21 > 50", value: "stacked", score: "+2", note: "strong bullish alignment", color: "#00a574" },
  { name: "EMA", period: "200", value: "price above", score: "+1", note: "macro trend bullish", color: "#00a574" },
  { name: "Bollinger", period: "20, 2σ", value: "lower touch", score: "+1", note: "mean reversion setup", color: "#7e5bef" },
  { name: "Volume", period: "vs 20-SMA", value: "1.6×", score: "+1", note: "participation confirming", color: "#f5a524" },
  { name: "ATR", period: "14", value: "1.8%", score: "", note: "sizing stop at 1.5× ATR = 2.7%", color: "#5b616e" },
];

function SignalsTab() {
  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
        <div>
          <div className="flex items-baseline gap-3 mb-2">
            <h3 className="text-2xl font-semibold tracking-tight">ETH/USDT</h3>
            <span className="text-sm text-[#5b616e]">1h · $3,285 · cycle #128</span>
          </div>
          <p className="text-sm text-[#5b616e] mb-6">
            TA score 9 of possible 10. Score over 4 is strong_buy.
          </p>

          <div className="rounded-2xl border border-[#e6e8ec] overflow-hidden">
            <div className="grid grid-cols-[1.2fr_1fr_1fr_56px] gap-4 px-5 py-3 bg-[#f7f8fa] text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5b616e]">
              <span>Indicator</span>
              <span>Period</span>
              <span>Value</span>
              <span className="text-right">Score</span>
            </div>
            {INDICATORS.map((ind, i) => (
              <div
                key={i}
                className="grid grid-cols-[1.2fr_1fr_1fr_56px] gap-4 px-5 py-3.5 items-center text-sm border-t border-[#e6e8ec]"
              >
                <span className="font-semibold" style={{ color: ind.color }}>
                  {ind.name}
                </span>
                <span className="font-mono text-xs text-[#5b616e]">{ind.period}</span>
                <span className="text-[#0a0e27] tabular-nums">{ind.value}</span>
                <span
                  className={cn(
                    "text-right font-semibold tabular-nums text-sm",
                    ind.score.startsWith("+")
                      ? "text-[#00a574]"
                      : ind.score.startsWith("-")
                        ? "text-[#d01c28]"
                        : "text-[#5b616e]",
                  )}
                >
                  {ind.score || "—"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#5b616e] mb-4">
              Three-layer consensus
            </p>
            <LayerFull label="Technical" tag="TA" value={0.72} color="#0052ff" bg="#eaf0ff" />
            <div className="h-5" />
            <LayerFull label="Machine Learning" tag="ML" value={0.78} color="#7e5bef" bg="#f3efff" />
            <div className="h-5" />
            <LayerFull label="AI reasoning" tag="AI" value={0.68} color="#f5a524" bg="#fff6e5" />
          </div>

          <div className="rounded-2xl bg-[#f7f8fa] p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#5b616e]">
              Verdict
            </p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-[#00a574]">BUY</p>
            <p className="mt-1 text-sm text-[#5b616e] tabular-nums">
              72% confidence
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LayerFull({
  label,
  tag,
  value,
  color,
  bg,
}: {
  label: string;
  tag: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="h-6 px-2 rounded-md text-[10px] font-mono uppercase tracking-[0.22em] font-semibold inline-flex items-center"
            style={{ background: bg, color }}
          >
            {tag}
          </span>
          <span className="text-sm font-semibold">{label}</span>
        </div>
        <span className="text-sm font-semibold tabular-nums" style={{ color }}>
          {(value * 100).toFixed(0)}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-[#f7f8fa] overflow-hidden">
        <div
          className="h-full"
          style={{ width: `${Math.round(value * 100)}%`, background: color }}
        />
      </div>
    </div>
  );
}

function RowSmall({
  label,
  value,
  sub,
  subColor,
}: {
  label: string;
  value: string;
  sub?: string;
  subColor?: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[#5b616e]">{label}</span>
      <div className="text-right">
        <span className="font-semibold tabular-nums">{value}</span>
        {sub && (
          <span className="ml-2 text-[11px] font-semibold tabular-nums" style={{ color: subColor }}>
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}

// ====================================================================
// ML PIPELINE TAB
// ====================================================================

const FEATURES = [
  { group: "Price returns", color: "#0052ff", items: ["return_1", "return_3", "return_5", "return_10", "return_20", "log_return"] },
  { group: "Volatility", color: "#7e5bef", items: ["vol_5", "vol_10", "vol_20"] },
  { group: "RSI", color: "#00a574", items: ["rsi", "rsi_6"] },
  { group: "MACD", color: "#00a574", items: ["MACD_12_26_9", "MACDh", "MACDs"] },
  { group: "EMAs", color: "#f5a524", items: ["ema_9", "ema_21", "ema_50", "ema_200", "ema_9_21", "ema_21_50", "price_ema9", "price_ema50"] },
  { group: "Bollinger", color: "#d01c28", items: ["BBU", "BBM", "BBL", "bb_width", "bb_pos"] },
  { group: "Volume", color: "#7e5bef", items: ["vol_ratio", "vol_change"] },
  { group: "ATR", color: "#5b616e", items: ["atr", "atr_ratio"] },
  { group: "Candle structure", color: "#f5a524", items: ["body", "upper_wick", "lower_wick"] },
  { group: "Trend & lag", color: "#0052ff", items: ["higher_high", "lower_low", "trend_3", "trend_5", "rsi_lag1", "rsi_lag2", "rsi_lag3", "ret_lag1", "ret_lag2", "ret_lag3"] },
];

const YEAR_WEIGHTS = [
  { year: "2025+", weight: 1.0 },
  { year: "2023–24", weight: 0.7 },
  { year: "2021–22", weight: 0.4 },
  { year: "< 2021", weight: 0.2 },
];

function MLPipelineTab() {
  return (
    <div className="h-full overflow-y-auto p-7">
      <div className="grid grid-cols-3 gap-4 mb-7">
        <StatCard label="Training candles" value="800k+" sub="1h / 4h / 1d / 15m across 16 pairs" />
        <StatCard label="Engineered features" value="40" sub="returns, volatility, indicators, lag" />
        <StatCard label="Retrain cadence" value="Weekly" sub="Sunday, full rewrite, versioned pkl" />
      </div>

      {/* Time-weighted */}
      <div className="rounded-2xl border border-[#e6e8ec] p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#5b616e]">
              Time-weighted training
            </p>
            <h3 className="text-base font-semibold tracking-tight mt-0.5">
              Recent markets weigh more. Old markets still teach.
            </h3>
          </div>
          <span className="text-xs text-[#5b616e] font-mono">core/ml_model.py · L239</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {YEAR_WEIGHTS.map((y) => (
            <div key={y.year} className="rounded-xl bg-[#f7f8fa] p-4">
              <p className="text-xs text-[#5b616e]">{y.year}</p>
              <p className="text-2xl font-bold tabular-nums mt-0.5">
                {y.weight.toFixed(1)}×
              </p>
              <div className="h-1.5 rounded-full bg-white mt-3 overflow-hidden">
                <div
                  className="h-full bg-[#0052ff]"
                  style={{ width: `${y.weight * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature families — horizontal bar count */}
      <div className="rounded-2xl border border-[#e6e8ec] p-6 mb-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#5b616e]">
          Feature families
        </p>
        <h3 className="text-base font-semibold tracking-tight mt-0.5 mb-5">
          40 features across 10 categories
        </h3>
        <div className="space-y-2.5">
          {FEATURES.map((g) => {
            const pct = (g.items.length / 10) * 100;
            return (
              <div key={g.group} className="grid grid-cols-[160px_1fr_40px] gap-3 items-center">
                <span className="text-xs font-semibold" style={{ color: g.color }}>
                  {g.group}
                </span>
                <div className="h-2 rounded-full bg-[#f7f8fa] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: g.color }}
                  />
                </div>
                <span className="text-xs text-[#5b616e] tabular-nums text-right">
                  {g.items.length}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ensemble — single card */}
      <div className="rounded-2xl border border-[#e6e8ec] p-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#5b616e]">
          Voting ensemble · TimeSeriesSplit
        </p>
        <h3 className="text-base font-semibold tracking-tight mt-0.5 mb-5">
          Three models, soft vote. 5 folds, gap to prevent leakage.
        </h3>
        <ModelRow
          name="XGBoost"
          detail="200 trees · depth 4 · lr 0.08"
          color="#0052ff"
          weight={0.38}
        />
        <ModelRow
          name="Random Forest"
          detail="100 trees · depth 6"
          color="#7e5bef"
          weight={0.34}
        />
        <ModelRow
          name="Gradient Boosting"
          detail="100 trees · depth 4 · lr 0.1"
          color="#f5a524"
          weight={0.28}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-[#e6e8ec] p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#5b616e]">
        {label}
      </p>
      <p className="text-3xl font-bold tracking-tight mt-1 tabular-nums">{value}</p>
      <p className="text-xs text-[#5b616e] mt-1">{sub}</p>
    </div>
  );
}

function ModelRow({
  name,
  detail,
  color,
  weight,
}: {
  name: string;
  detail: string;
  color: string;
  weight: number;
}) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <div>
          <p className="text-sm font-semibold" style={{ color }}>
            {name}
          </p>
          <p className="text-[11px] text-[#5b616e]">{detail}</p>
        </div>
        <span className="text-xs font-semibold tabular-nums" style={{ color }}>
          {(weight * 100).toFixed(0)}%
        </span>
      </div>
      <div className="h-1 rounded-full bg-[#f7f8fa] overflow-hidden">
        <div
          className="h-full"
          style={{ width: `${weight * 100}%`, background: color }}
        />
      </div>
    </div>
  );
}

// ====================================================================
// RULES TAB
// ====================================================================

function RulesTab() {
  const groups = [
    {
      phase: "Entry",
      items: [
        "TA score ≥ 2, confidence ≥ 55%",
        "AI agrees direction, or TA alone strong",
        "Risk manager passes",
        "4h timeframe not bearish",
        "Limit order, market fallback after 60s",
      ],
    },
    {
      phase: "Risk",
      items: [
        "Spot only. Halal constraint in code.",
        "Stop at 1.5× ATR",
        "Minimum 1:2 risk to reward",
        "Daily loss cap $50",
        "Max 3 positions, 1h cooldown after losses",
      ],
    },
    {
      phase: "Exit",
      items: [
        "0–2% profit: stop at entry − 2%",
        "2–4% profit: breakeven stop",
        "4%+ profit: trailing at highest − 1.5%",
        "/closeall force-closes everything",
      ],
    },
  ];

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="grid grid-cols-3 gap-5">
        {groups.map((g) => (
          <div key={g.phase} className="rounded-2xl border border-[#e6e8ec] p-6">
            <span className="inline-flex h-6 px-2.5 rounded-md text-[10px] font-mono uppercase tracking-[0.22em] font-semibold items-center bg-[#eaf0ff] text-[#0052ff] mb-5">
              {g.phase}
            </span>
            <ul className="space-y-3">
              {g.items.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm leading-snug text-[#0a0e27]">
                  <span className="shrink-0 h-5 w-5 rounded-full bg-[#f7f8fa] text-[#5b616e] text-[10px] font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
