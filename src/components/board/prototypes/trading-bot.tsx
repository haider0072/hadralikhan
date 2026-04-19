"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CardActivity } from "../use-card-activity";
import { ProjectFrame } from "../project-frame";
import { FocusModal } from "../focus-modal";
import { ClaudeLogo, GithubLogo } from "../tool-logos";
import { cn } from "@/lib/cn";

const BRAND = {
  bg: "#ffffff",
  surface: "#f7f8fa",
  border: "#e6e8ec",
  ink: "#0a0e27",
  muted: "#5b616e",
  blue: "#0052ff",
  blueSoft: "#eaf0ff",
  green: "#00d395",
  greenSoft: "#e6faf3",
  red: "#ff3a44",
  redSoft: "#ffe9eb",
  amber: "#f5a524",
  purple: "#7e5bef",
};

const ASSETS = [
  { symbol: "BTC", name: "Bitcoin", price: 67420, change: 2.41, allocation: 0.42, color: "#f7931a" },
  { symbol: "ETH", name: "Ethereum", price: 3285, change: 1.82, allocation: 0.28, color: "#627eea" },
  { symbol: "SOL", name: "Solana", price: 184.3, change: -0.64, allocation: 0.18, color: "#14f195" },
  { symbol: "AVAX", name: "Avalanche", price: 38.7, change: 3.12, allocation: 0.12, color: "#e84142" },
];

function seedSeries(basePrice: number, count: number, vol: number): number[] {
  const out: number[] = [];
  let price = basePrice;
  for (let i = 0; i < count; i++) {
    const delta = (Math.random() - 0.48) * basePrice * vol;
    price = Math.max(basePrice * 0.7, price + delta);
    out.push(price);
  }
  return out;
}

function nextPrice(last: number, base: number, vol: number): number {
  const delta = (Math.random() - 0.48) * base * vol;
  return Math.max(base * 0.7, last + delta);
}

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
  const [series, setSeries] = useState<number[]>(() => seedSeries(12486, 36, 0.008));

  useEffect(() => {
    if (activity === "idle") return;
    const id = setInterval(() => {
      setSeries((prev) => [...prev.slice(1), nextPrice(prev[prev.length - 1], 12486, 0.008)]);
    }, 900);
    return () => clearInterval(id);
  }, [activity]);

  const value = series[series.length - 1];
  const start = series[0];
  const change = ((value - start) / start) * 100;
  const up = change >= 0;

  return (
    <ProjectFrame
      meta={{
        year: "2024",
        title: "Trading Bot",
        tagline: "Automated crypto on Binance. TA, ML, and AI agreeing before every trade.",
      }}
      innerClassName="bg-white"
      onOpen={onOpen}
      tape="top-left"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#eaf0ff] via-white to-white" />

      <div className="relative h-full flex flex-col px-4 py-4 gap-2">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-[#5b616e]">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00d395] animate-pulse" />
            <span>live</span>
          </div>
          <span>Portfolio</span>
        </div>

        <div>
          <p className="font-semibold text-[#0a0e27] text-2xl tracking-tight tabular-nums">
            ${value.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
          </p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums",
                up ? "bg-[#e6faf3] text-[#00a574]" : "bg-[#ffe9eb] text-[#d01c28]",
              )}
            >
              <span>{up ? "↑" : "↓"}</span>
              {Math.abs(change).toFixed(2)}%
            </span>
            <span className="text-[10px] text-[#5b616e]">24h</span>
          </div>
        </div>

        <div className="flex-1 relative">
          <AreaChart series={series} color={up ? BRAND.green : BRAND.red} />
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.22em] text-[#5b616e]">
          <span>TA · ML · AI agree</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0052ff]" />
            3 open
          </span>
        </div>
      </div>
    </ProjectFrame>
  );
}

function AreaChart({ series, color }: { series: number[]; color: string }) {
  const max = Math.max(...series);
  const min = Math.min(...series);
  const range = max - min || 1;
  const w = 100;
  const h = 100;
  const step = w / (series.length - 1);
  const points = series.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / range) * h;
    return { x, y };
  });
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;
  const id = useMemo(() => `area-${Math.random().toString(36).slice(2, 8)}`, []);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-full">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

type Tab = "portfolio" | "signals" | "strategy" | "activity";

function TradingFocus() {
  const [tab, setTab] = useState<Tab>("portfolio");

  return (
    <div className="w-[min(1240px,96vw)] h-[min(780px,92vh)] grid grid-cols-[360px_1fr] bg-white text-[#0a0e27] overflow-hidden font-sans">
      <CaseStudySidebar />
      <section className="flex flex-col overflow-hidden bg-white">
        <TopBar />
        <TabBar tab={tab} setTab={setTab} />
        <div className="flex-1 overflow-y-auto">
          {tab === "portfolio" && <PortfolioTab />}
          {tab === "signals" && <SignalsTab />}
          {tab === "strategy" && <StrategyTab />}
          {tab === "activity" && <ActivityTab />}
        </div>
      </section>
    </div>
  );
}

function CaseStudySidebar() {
  return (
    <aside className="p-7 bg-[#f7f8fa] border-r border-[#e6e8ec] overflow-y-auto">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-[#0052ff] flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 16l4-6 4 3 8-11"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="font-semibold tracking-tight text-base leading-none">Trading Bot</p>
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#5b616e] mt-1">
            2024 · Crypto automation
          </p>
        </div>
      </div>

      <p className="mt-5 text-[13px] leading-relaxed text-[#5b616e]">
        A 24/7 automated spot-trading bot on Binance. Three independent signal
        layers (technical analysis, an ML ensemble, and a reasoning pass from
        Claude) have to agree before the system takes a position. Runs on a
        VPS with a kill switch and hard daily loss limits.
      </p>

      <div className="mt-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#5b616e] mb-2">
          My role
        </p>
        <p className="text-[13px] leading-relaxed text-[#5b616e]">
          Solo. Strategy design, ML training pipeline, backend loop,
          dashboard, deployment. Also the first user, which was the harshest
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
          <span className="text-[9px] text-[#9a9ea8] ml-1">strategy + code</span>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#5b616e] mb-2">
          Stack
        </p>
        <div className="flex flex-wrap gap-1.5">
          {[
            "Python",
            "XGBoost",
            "Random Forest",
            "Binance API",
            "CoinGecko",
            "systemd",
            "Claude API",
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
          Markets punish the parts of your system you trusted most. The
          journal stream saved me more than the dashboard did. And a 52%
          accuracy bot with good position sizing beats a 62% bot that blows
          up one weekend.
        </p>
      </div>

      <div className="mt-6 p-3 rounded-xl bg-[#eaf0ff] text-[#0a2ca6] text-xs leading-relaxed">
        Three-layer confirmation. ATR stops. Trailing take-profit. Weekly
        retrain. One kill switch.
      </div>

      <div className="mt-6 space-y-2">
        <a
          href="https://github.com/haider0072/trading-bot"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between rounded-xl bg-[#0052ff] hover:bg-[#0041cc] text-white px-4 py-3 text-sm font-semibold transition-colors"
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

function TopBar() {
  const [series, setSeries] = useState<number[]>(() => seedSeries(12486, 80, 0.006));

  useEffect(() => {
    const id = setInterval(() => {
      setSeries((prev) => [...prev.slice(1), nextPrice(prev[prev.length - 1], 12486, 0.006)]);
    }, 1200);
    return () => clearInterval(id);
  }, []);

  const value = series[series.length - 1];
  const start = series[0];
  const change = value - start;
  const changePct = (change / start) * 100;
  const up = change >= 0;

  return (
    <header className="h-20 border-b border-[#e6e8ec] flex items-center px-7 gap-6 shrink-0 relative">
      <div className="flex flex-col min-w-0">
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#5b616e]">
          Portfolio value
        </span>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-2xl font-bold tracking-tight tabular-nums">
            ${value.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
              up ? "bg-[#e6faf3] text-[#00a574]" : "bg-[#ffe9eb] text-[#d01c28]",
            )}
          >
            <span>{up ? "↑" : "↓"}</span>
            ${Math.abs(change).toFixed(2)}
            <span className="opacity-70">({changePct.toFixed(2)}%)</span>
          </span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3 shrink-0 pr-14">
        <span className="hidden lg:flex items-center gap-1.5 text-xs text-[#5b616e] whitespace-nowrap">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00d395] animate-pulse shrink-0" />
          <span className="font-medium">systemd active</span>
        </span>
        <button className="px-3 h-8 rounded-lg border border-[#e6e8ec] text-xs font-semibold text-[#5b616e] hover:bg-[#f7f8fa] transition-colors whitespace-nowrap">
          Pause
        </button>
        <button className="px-3 h-8 rounded-lg bg-[#ffe9eb] text-[#d01c28] text-xs font-semibold hover:bg-[#ffd6da] transition-colors whitespace-nowrap">
          Kill
        </button>
      </div>
    </header>
  );
}

function TabBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { id: Tab; label: string }[] = [
    { id: "portfolio", label: "Portfolio" },
    { id: "signals", label: "Signals" },
    { id: "strategy", label: "Strategy" },
    { id: "activity", label: "Activity" },
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
              "relative h-12 px-3 text-sm font-medium transition-colors",
              active ? "text-[#0a0e27]" : "text-[#5b616e] hover:text-[#0a0e27]",
            )}
          >
            {item.label}
            {active && (
              <span className="absolute bottom-[-1px] left-3 right-3 h-[2px] rounded-full bg-[#0052ff]" />
            )}
          </button>
        );
      })}
    </nav>
  );
}

function PortfolioTab() {
  const [range, setRange] = useState<"1H" | "24H" | "1W" | "1M" | "ALL">("24H");
  const [series, setSeries] = useState<number[]>(() => seedSeries(12000, 96, 0.007));

  useEffect(() => {
    const id = setInterval(() => {
      setSeries((prev) => [...prev.slice(1), nextPrice(prev[prev.length - 1], 12000, 0.007)]);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  const value = series[series.length - 1];
  const start = series[0];
  const change = value - start;
  const up = change >= 0;

  return (
    <div className="p-7">
      <div className="rounded-2xl border border-[#e6e8ec] p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#5b616e]">
              Portfolio chart
            </p>
            <p className="text-2xl font-bold mt-1 tracking-tight tabular-nums">
              ${value.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
            </p>
            <p
              className={cn(
                "text-sm font-medium tabular-nums mt-0.5",
                up ? "text-[#00a574]" : "text-[#d01c28]",
              )}
            >
              {up ? "+" : ""}
              ${change.toFixed(2)} ({((change / start) * 100).toFixed(2)}%)
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-[#f7f8fa] p-1">
            {(["1H", "24H", "1W", "1M", "ALL"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  "px-3 h-7 rounded-md text-xs font-semibold transition-colors",
                  range === r
                    ? "bg-white text-[#0a0e27] shadow-sm"
                    : "text-[#5b616e] hover:text-[#0a0e27]",
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[200px]">
          <AreaChart series={series} color={up ? BRAND.blue : BRAND.red} />
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#5b616e]">
            Holdings
          </p>
          <span className="text-xs text-[#5b616e]">4 assets</span>
        </div>

        <div className="rounded-2xl border border-[#e6e8ec] overflow-hidden">
          <div className="grid grid-cols-[1.5fr_1fr_1fr_0.8fr_100px] gap-4 px-5 py-3 bg-[#f7f8fa] text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5b616e]">
            <span>Asset</span>
            <span className="text-right">Price</span>
            <span className="text-right">24h</span>
            <span className="text-right">Allocation</span>
            <span />
          </div>
          {ASSETS.map((a) => (
            <AssetRow key={a.symbol} asset={a} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AssetRow({ asset }: { asset: (typeof ASSETS)[number] }) {
  const [spark, setSpark] = useState<number[]>(() => seedSeries(asset.price, 30, 0.01));
  useEffect(() => {
    const id = setInterval(() => {
      setSpark((prev) => [...prev.slice(1), nextPrice(prev[prev.length - 1], asset.price, 0.01)]);
    }, 1600);
    return () => clearInterval(id);
  }, [asset.price]);

  const up = asset.change >= 0;
  return (
    <div className="grid grid-cols-[1.5fr_1fr_1fr_0.8fr_100px] gap-4 px-5 py-4 items-center border-t border-[#e6e8ec] hover:bg-[#f7f8fa]/60 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-bold"
          style={{ background: asset.color }}
        >
          {asset.symbol.slice(0, 1)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{asset.name}</p>
          <p className="text-[11px] text-[#5b616e]">{asset.symbol}</p>
        </div>
      </div>
      <span className="text-right text-sm tabular-nums">
        ${asset.price.toLocaleString()}
      </span>
      <span
        className={cn(
          "text-right text-sm font-semibold tabular-nums",
          up ? "text-[#00a574]" : "text-[#d01c28]",
        )}
      >
        {up ? "+" : ""}
        {asset.change.toFixed(2)}%
      </span>
      <span className="text-right text-sm tabular-nums text-[#5b616e]">
        {Math.round(asset.allocation * 100)}%
      </span>
      <div className="h-8">
        <AreaChart series={spark} color={up ? BRAND.green : BRAND.red} />
      </div>
    </div>
  );
}

function SignalsTab() {
  const [ta, setTa] = useState(0.72);
  const [ml, setMl] = useState(0.78);
  const [ai, setAi] = useState(0.68);

  useEffect(() => {
    const id = setInterval(() => {
      setTa(0.55 + Math.random() * 0.4);
      setMl(0.5 + Math.random() * 0.45);
      setAi(0.5 + Math.random() * 0.42);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  const combined = ta * 0.35 + ml * 0.4 + ai * 0.25;
  const verdict = combined > 0.7 ? "BUY" : combined < 0.45 ? "SELL" : "HOLD";

  return (
    <div className="p-7 grid grid-cols-[1fr_320px] gap-6">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#5b616e]">
          Three-layer confirmation · ETH/USDT
        </p>
        <h3 className="text-xl font-semibold mt-1 tracking-tight">
          Signals have to agree before a trade fires.
        </h3>

        <div className="mt-6 space-y-4">
          <SignalCard
            label="Technical Analysis"
            tag="TA"
            value={ta}
            color={BRAND.blue}
            bg={BRAND.blueSoft}
            note="RSI 34 · MACD bullish cross · price above EMA200"
          />
          <SignalCard
            label="Machine Learning"
            tag="ML"
            value={ml}
            color={BRAND.purple}
            bg="#f3efff"
            note="XGBoost + Random Forest + Gradient Boosting ensemble · 765k training candles"
          />
          <SignalCard
            label="AI reasoning"
            tag="AI"
            value={ai}
            color={BRAND.amber}
            bg="#fff6e5"
            note="Claude reviews the indicator stack · technical only, no market opinion"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[#e6e8ec] p-5 h-fit">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#5b616e]">
          Combined verdict
        </p>
        <div className="mt-3 flex items-baseline gap-2">
          <span
            className={cn(
              "text-3xl font-bold tracking-tight",
              verdict === "BUY"
                ? "text-[#00a574]"
                : verdict === "SELL"
                  ? "text-[#d01c28]"
                  : "text-[#5b616e]",
            )}
          >
            {verdict}
          </span>
          <span className="text-sm font-medium text-[#5b616e] tabular-nums">
            {(combined * 100).toFixed(0)}% confidence
          </span>
        </div>

        <div className="mt-4 h-2 rounded-full bg-[#f7f8fa] overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-700",
              verdict === "BUY"
                ? "bg-[#00d395]"
                : verdict === "SELL"
                  ? "bg-[#ff3a44]"
                  : "bg-[#5b616e]",
            )}
            style={{ width: `${Math.round(combined * 100)}%` }}
          />
        </div>

        <div className="mt-6 pt-5 border-t border-[#e6e8ec] space-y-2.5">
          <Row label="Entry target" value="$3,281.50" />
          <Row label="Stop loss" value="$3,248.00" sub="-1.02%" subColor="#d01c28" />
          <Row label="Take profit" value="$3,395.20" sub="+3.46%" subColor="#00a574" />
          <Row label="Position size" value="0.32 ETH" sub="$1,050.00" subColor="#5b616e" />
        </div>
      </div>
    </div>
  );
}

function SignalCard({
  label,
  tag,
  value,
  color,
  bg,
  note,
}: {
  label: string;
  tag: string;
  value: number;
  color: string;
  bg: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e6e8ec] p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span
            className="h-7 px-2.5 rounded-md text-[10px] font-mono uppercase tracking-[0.22em] font-semibold inline-flex items-center"
            style={{ background: bg, color }}
          >
            {tag}
          </span>
          <span className="font-semibold">{label}</span>
        </div>
        <span className="text-sm font-semibold tabular-nums" style={{ color }}>
          {(value * 100).toFixed(0)}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-[#f7f8fa] overflow-hidden">
        <div
          className="h-full transition-all duration-700"
          style={{ width: `${Math.round(value * 100)}%`, background: color }}
        />
      </div>
      <p className="mt-3 text-xs text-[#5b616e] leading-relaxed">{note}</p>
    </div>
  );
}

function Row({
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

function StrategyTab() {
  const rules = [
    {
      phase: "Entry",
      items: [
        "Hourly scan across the top 25 coins by volume and momentum",
        "TA score at or above 2, confidence at or above 55%",
        "AI reasoning pass agrees, or TA is strong enough to proceed alone",
        "Risk manager lets it through (daily loss, max trades, cooldown)",
        "15-minute timeframe confirms the higher-frame bias",
        "Limit order 0.1% below market, market fallback after 60 seconds",
      ],
    },
    {
      phase: "Risk",
      items: [
        "Stop loss sized with 1.5x ATR so volatile coins get wider stops",
        "Minimum risk-reward 1:2 enforced at order time",
        "Daily loss limit defaults to $50, hard stops new entries",
        "Maximum three open positions at any moment",
        "One-hour cooldown after three consecutive losses",
      ],
    },
    {
      phase: "Exit",
      items: [
        "Phase 1 (0 to 2% profit): stop sits at entry minus 2%",
        "Phase 2 (2 to 4% profit): stop moves to entry, breakeven locked",
        "Phase 3 (4%+ profit): trailing stop tracks highest minus 1.5%",
        "Kill switch drops all positions and pauses the loop",
      ],
    },
  ];

  return (
    <div className="p-7">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#5b616e]">
        Strategy rules
      </p>
      <h3 className="text-xl font-semibold mt-1 tracking-tight mb-6">
        The full entry, risk, and exit logic.
      </h3>

      <div className="grid grid-cols-3 gap-4">
        {rules.map((group) => (
          <div key={group.phase} className="rounded-2xl border border-[#e6e8ec] p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-6 px-2 rounded-md text-[10px] font-mono uppercase tracking-[0.22em] font-semibold inline-flex items-center bg-[#eaf0ff] text-[#0052ff]">
                {group.phase}
              </span>
              <span className="text-xs text-[#5b616e]">{group.items.length} rules</span>
            </div>
            <ul className="space-y-3">
              {group.items.map((item, i) => (
                <li key={i} className="flex gap-3 text-[13px] leading-snug text-[#0a0e27]">
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

type Event = {
  id: number;
  time: string;
  kind: "TA" | "ML" | "AI" | "FILL" | "TRAIL" | "EXIT" | "COOLDOWN" | "INIT";
  message: string;
};

function ActivityTab() {
  const [events, setEvents] = useState<Event[]>(() => [
    { id: 1, time: "09:14", kind: "INIT", message: "Loaded 765k candles, ML model v4.2" },
    { id: 2, time: "09:15", kind: "TA", message: "RSI=34 · MACD bullish cross on ETH/USDT" },
    { id: 3, time: "09:15", kind: "ML", message: "XGBoost confidence 0.78 · long bias" },
    { id: 4, time: "09:15", kind: "AI", message: "Indicators align, structure intact, lean buy" },
    { id: 5, time: "09:15", kind: "FILL", message: "Limit buy ETH/USDT at 3281.50, size 0.32" },
    { id: 6, time: "09:32", kind: "TRAIL", message: "Stop moved to breakeven, +0.4% locked" },
  ]);
  const idRef = useRef(7);

  useEffect(() => {
    const id = setInterval(() => {
      const pool: { kind: Event["kind"]; message: string }[] = [
        { kind: "TA", message: "Bollinger squeeze, volatility drop detected" },
        { kind: "ML", message: "Confidence 0.71 · recent wins 3/5" },
        { kind: "AI", message: "Trend intact, continuation likely" },
        { kind: "FILL", message: "ETH/USDT filled at 3285.20" },
        { kind: "TRAIL", message: "Stop moved to entry, +0.8% locked" },
        { kind: "EXIT", message: "Trailing stop hit on SOL, realized +1.8%" },
        { kind: "COOLDOWN", message: "Three losses in a row, paused for 1 hour" },
      ];
      const pick = pool[Math.floor(Math.random() * pool.length)];
      const now = new Date();
      const t = `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
      setEvents((prev) => [
        { id: idRef.current++, time: t, ...pick },
        ...prev.slice(0, 19),
      ]);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="p-7">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#5b616e]">
            Activity
          </p>
          <h3 className="text-xl font-semibold mt-1 tracking-tight">
            Live bot journal
          </h3>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-[#5b616e]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00d395] animate-pulse" />
          streaming
        </span>
      </div>

      <div className="rounded-2xl border border-[#e6e8ec] overflow-hidden">
        {events.map((e, i) => (
          <div
            key={e.id}
            className={cn(
              "grid grid-cols-[64px_90px_1fr] gap-4 px-5 py-3.5 items-center text-sm",
              i > 0 && "border-t border-[#e6e8ec]",
            )}
          >
            <span className="text-xs text-[#5b616e] font-mono tabular-nums">{e.time}</span>
            <KindBadge kind={e.kind} />
            <span className="text-[#0a0e27]">{e.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function KindBadge({ kind }: { kind: Event["kind"] }) {
  const map: Record<Event["kind"], { bg: string; color: string }> = {
    INIT: { bg: "#f7f8fa", color: "#5b616e" },
    TA: { bg: BRAND.blueSoft, color: BRAND.blue },
    ML: { bg: "#f3efff", color: BRAND.purple },
    AI: { bg: "#fff6e5", color: "#b47600" },
    FILL: { bg: BRAND.greenSoft, color: "#00a574" },
    TRAIL: { bg: BRAND.greenSoft, color: "#00a574" },
    EXIT: { bg: BRAND.greenSoft, color: "#00a574" },
    COOLDOWN: { bg: BRAND.redSoft, color: "#d01c28" },
  };
  const s = map[kind];
  return (
    <span
      className="h-6 px-2.5 rounded-md text-[10px] font-mono uppercase tracking-[0.22em] font-semibold inline-flex items-center w-fit"
      style={{ background: s.bg, color: s.color }}
    >
      {kind}
    </span>
  );
}
