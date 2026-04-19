"use client";

import { useEffect, useRef, useState } from "react";
import type { CardActivity } from "../use-card-activity";
import { ProjectFrame } from "../project-frame";
import { FocusModal } from "../focus-modal";
import { cn } from "@/lib/cn";

const COINS = [
  { symbol: "BTC/USDT", base: 67420, vol: 0.008 },
  { symbol: "ETH/USDT", base: 3285, vol: 0.012 },
  { symbol: "SOL/USDT", base: 184.3, vol: 0.02 },
  { symbol: "AVAX/USDT", base: 38.7, vol: 0.018 },
];

type Candle = { o: number; h: number; l: number; c: number };

function seedCandles(basePrice: number, count: number, vol: number): Candle[] {
  const out: Candle[] = [];
  let price = basePrice;
  for (let i = 0; i < count; i++) {
    const o = price;
    const delta = (Math.random() - 0.48) * basePrice * vol;
    const c = Math.max(basePrice * 0.5, o + delta);
    const h = Math.max(o, c) + Math.random() * Math.abs(delta) * 0.6;
    const l = Math.min(o, c) - Math.random() * Math.abs(delta) * 0.6;
    out.push({ o, h, l, c });
    price = c;
  }
  return out;
}

function nextCandle(last: Candle, base: number, vol: number): Candle {
  const o = last.c;
  const delta = (Math.random() - 0.48) * base * vol;
  const c = Math.max(base * 0.5, o + delta);
  const h = Math.max(o, c) + Math.random() * Math.abs(delta) * 0.6;
  const l = Math.min(o, c) - Math.random() * Math.abs(delta) * 0.6;
  return { o, h, l, c };
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
  const coin = COINS[0];
  const [candles, setCandles] = useState<Candle[]>(() =>
    seedCandles(coin.base, 24, coin.vol),
  );
  const [signal, setSignal] = useState<"BUY" | "SELL" | "HOLD">("HOLD");

  useEffect(() => {
    if (activity === "idle") return;
    const id = setInterval(() => {
      setCandles((prev) => {
        const last = prev[prev.length - 1];
        const next = nextCandle(last, coin.base, coin.vol);
        const signals: ("BUY" | "SELL" | "HOLD" | "HOLD" | "HOLD")[] = [
          "BUY",
          "SELL",
          "HOLD",
          "HOLD",
          "HOLD",
        ];
        if (Math.random() > 0.7)
          setSignal(signals[Math.floor(Math.random() * signals.length)]);
        return [...prev.slice(1), next];
      });
    }, 700);
    return () => clearInterval(id);
  }, [activity, coin.base, coin.vol]);

  const price = candles[candles.length - 1].c;
  const open_ = candles[0].o;
  const change = ((price - open_) / open_) * 100;
  const up = change >= 0;

  return (
    <ProjectFrame
      meta={{
        year: "2024",
        title: "Trading Bot",
        tagline:
          "Automated crypto on Binance. TA + ML + AI, 3-layer signal confirmation.",
      }}
      innerClassName="bg-[#0a0f0c] text-[#d4e4d1]"
      onOpen={onOpen}
      tape="top-left"
    >
      {/* Grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(#14261d 1px, transparent 1px), linear-gradient(90deg, #14261d 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Glow */}
      <div
        className={cn(
          "absolute -top-12 -right-12 w-44 h-44 rounded-full blur-3xl transition-colors",
          up ? "bg-[#22c55e]/20" : "bg-[#ef4444]/20",
        )}
      />

      {/* Header */}
      <div className="relative px-4 pt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-[#52665a]">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e] animate-pulse" />
          <span>live · binance</span>
        </div>
        <span>{coin.symbol}</span>
      </div>

      {/* Price + change */}
      <div className="relative px-4 mt-1 flex items-baseline gap-2">
        <span className="font-mono text-xl font-semibold text-white tabular-nums">
          ${price.toFixed(2)}
        </span>
        <span
          className={cn(
            "font-mono text-xs tabular-nums",
            up ? "text-[#22c55e]" : "text-[#ef4444]",
          )}
        >
          {up ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
        </span>
      </div>

      {/* Mini candles */}
      <svg viewBox="0 0 200 70" className="relative w-full h-[70px] mt-1 px-4">
        {(() => {
          const maxH = Math.max(...candles.map((c) => c.h));
          const minL = Math.min(...candles.map((c) => c.l));
          const range = maxH - minL || 1;
          const w = 200 / candles.length;
          return candles.map((c, i) => {
            const x = i * w + w / 2;
            const yH = 68 - ((c.h - minL) / range) * 60;
            const yL = 68 - ((c.l - minL) / range) * 60;
            const yO = 68 - ((c.o - minL) / range) * 60;
            const yC = 68 - ((c.c - minL) / range) * 60;
            const upBar = c.c >= c.o;
            const color = upBar ? "#22c55e" : "#ef4444";
            return (
              <g key={i}>
                <line
                  x1={x}
                  x2={x}
                  y1={yH}
                  y2={yL}
                  stroke={color}
                  strokeWidth="0.6"
                />
                <rect
                  x={x - w * 0.28}
                  y={Math.min(yO, yC)}
                  width={w * 0.56}
                  height={Math.max(1.5, Math.abs(yC - yO))}
                  fill={color}
                />
              </g>
            );
          });
        })()}
      </svg>

      {/* Signal badge */}
      <div className="relative px-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-[#52665a]">
          <span>TA · ML · AI</span>
        </div>
        <span
          className={cn(
            "px-2.5 py-1 rounded-sm font-mono text-[10px] font-bold tracking-[0.22em] border",
            signal === "BUY"
              ? "bg-[#22c55e]/15 border-[#22c55e] text-[#22c55e]"
              : signal === "SELL"
                ? "bg-[#ef4444]/15 border-[#ef4444] text-[#ef4444]"
                : "bg-[#f59e0b]/10 border-[#f59e0b] text-[#f59e0b]",
          )}
        >
          {signal}
        </span>
      </div>
    </ProjectFrame>
  );
}

function TradingFocus() {
  const [coinIdx, setCoinIdx] = useState(0);
  const coin = COINS[coinIdx];
  const [candles, setCandles] = useState<Candle[]>(() =>
    seedCandles(coin.base, 60, coin.vol),
  );
  const [log, setLog] = useState<
    { t: string; type: string; msg: string; color: string }[]
  >(() => [
    { t: "09:14", type: "INIT", msg: "loaded 765k candles · ML model v4.2", color: "#52665a" },
    { t: "09:14", type: "WATCH", msg: "monitoring 25 coins by volume", color: "#52665a" },
    { t: "09:15", type: "TA", msg: "RSI=34 · MACD bullish cross on ETH/USDT", color: "#0ea5e9" },
    { t: "09:15", type: "ML", msg: "xgboost confidence 0.78 · long bias", color: "#8b5cf6" },
    { t: "09:15", type: "AI", msg: "indicators align, structure intact → BUY", color: "#f59e0b" },
    { t: "09:15", type: "ORDER", msg: "limit buy ETH/USDT @ 3281.50 · size 0.32", color: "#22c55e" },
  ]);

  // Advance candles
  useEffect(() => {
    const id = setInterval(() => {
      setCandles((prev) => [
        ...prev.slice(1),
        nextCandle(prev[prev.length - 1], coin.base, coin.vol),
      ]);
    }, 600);
    return () => clearInterval(id);
  }, [coin.base, coin.vol]);

  // Add log entries
  useEffect(() => {
    const id = setInterval(() => {
      const pool = [
        { type: "TA", msg: "bollinger squeeze · volatility drop detected", color: "#0ea5e9" },
        { type: "ML", msg: "confidence 0.71 · recent wins = 3/5", color: "#8b5cf6" },
        { type: "AI", msg: "trend intact, continuation likely", color: "#f59e0b" },
        { type: "FILL", msg: `${coin.symbol} filled @ ${coin.base.toFixed(2)}`, color: "#22c55e" },
        { type: "TRAIL", msg: "stop moved to breakeven · +0.4% locked", color: "#22c55e" },
        { type: "EXIT", msg: "trailing stop hit · realized +1.8%", color: "#22c55e" },
        { type: "COOLDOWN", msg: "3 losses in row · paused 1h", color: "#ef4444" },
      ];
      const pick = pool[Math.floor(Math.random() * pool.length)];
      const now = new Date();
      const t = `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
      setLog((prev) => [...prev.slice(-14), { t, ...pick }]);
    }, 1800);
    return () => clearInterval(id);
  }, [coin.symbol, coin.base]);

  const lastPrice = candles[candles.length - 1].c;
  const openPrice = candles[0].o;
  const change = ((lastPrice - openPrice) / openPrice) * 100;
  const up = change >= 0;

  return (
    <div
      className="w-[min(1120px,95vw)] h-[min(680px,90vh)] bg-[#07100b] text-[#d4e4d1] font-mono"
      style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
    >
      {/* Top bar */}
      <div className="h-12 border-b border-[#14261d] flex items-center px-5 gap-5 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-[#22c55e]/20 border border-[#22c55e] flex items-center justify-center">
            <span className="text-[#22c55e] text-[11px] font-bold">↑</span>
          </div>
          <span className="font-semibold text-white">Trading Bot</span>
          <span className="text-[#52665a]">v4.2 · spot only · binance</span>
        </div>
        <div className="ml-auto flex items-center gap-5 text-[10px] uppercase tracking-[0.22em]">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span>systemctl · live</span>
          </div>
          <span className="text-[#52665a]">cooldown: 0/1h</span>
          <button className="px-3 py-1 border border-[#ef4444] rounded text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors">
            kill switch
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-[1fr_320px] grid-rows-[1fr_auto] gap-3 p-4 h-[calc(100%-3rem)]">
        {/* Chart area */}
        <div className="bg-[#0a0f0c] border border-[#14261d] rounded relative overflow-hidden">
          {/* Header */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-5">
              {COINS.map((c, i) => (
                <button
                  key={c.symbol}
                  onClick={() => {
                    setCoinIdx(i);
                    setCandles(seedCandles(c.base, 60, c.vol));
                  }}
                  className={cn(
                    "text-xs transition-colors",
                    i === coinIdx ? "text-white" : "text-[#52665a] hover:text-[#d4e4d1]",
                  )}
                >
                  {c.symbol}
                </button>
              ))}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tabular-nums text-white">
                ${lastPrice.toFixed(2)}
              </span>
              <span
                className={cn(
                  "text-sm tabular-nums",
                  up ? "text-[#22c55e]" : "text-[#ef4444]",
                )}
              >
                {up ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Chart */}
          <svg viewBox="0 0 600 300" className="w-full h-[calc(100%-100px)]">
            {/* Gridlines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="0"
                x2="600"
                y1={50 + i * 50}
                y2={50 + i * 50}
                stroke="#14261d"
                strokeWidth="0.5"
              />
            ))}
            {(() => {
              const maxH = Math.max(...candles.map((c) => c.h));
              const minL = Math.min(...candles.map((c) => c.l));
              const range = maxH - minL || 1;
              const w = 600 / candles.length;
              return candles.map((c, i) => {
                const x = i * w + w / 2;
                const yH = 280 - ((c.h - minL) / range) * 240;
                const yL = 280 - ((c.l - minL) / range) * 240;
                const yO = 280 - ((c.o - minL) / range) * 240;
                const yC = 280 - ((c.c - minL) / range) * 240;
                const upBar = c.c >= c.o;
                const color = upBar ? "#22c55e" : "#ef4444";
                return (
                  <g key={i}>
                    <line x1={x} x2={x} y1={yH} y2={yL} stroke={color} strokeWidth="1" />
                    <rect
                      x={x - w * 0.3}
                      y={Math.min(yO, yC)}
                      width={w * 0.6}
                      height={Math.max(1.5, Math.abs(yC - yO))}
                      fill={color}
                    />
                  </g>
                );
              });
            })()}
            {/* Entry / exit markers (static examples) */}
            <g>
              <circle cx="180" cy="180" r="5" fill="#22c55e" />
              <text x="188" y="183" fontSize="10" fill="#22c55e">
                BUY 3281.50
              </text>
            </g>
          </svg>

          {/* Indicator strip */}
          <div className="absolute bottom-0 left-0 right-0 h-14 border-t border-[#14261d] px-4 flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-[#52665a]">
            <div className="flex items-center gap-1.5">
              <span>RSI</span>
              <span className="text-[#0ea5e9] font-bold tabular-nums">34.2</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>ATR</span>
              <span className="text-[#f59e0b] font-bold tabular-nums">1.8%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>Vol</span>
              <div className="w-20 h-1.5 bg-[#14261d] rounded-full overflow-hidden">
                <div className="h-full bg-[#22c55e] w-3/4" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span>MACD</span>
              <span className="text-[#22c55e] font-bold tabular-nums">+</span>
            </div>
          </div>
        </div>

        {/* Signal panel */}
        <div className="bg-[#0a0f0c] border border-[#14261d] rounded p-4 space-y-4 overflow-hidden">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#52665a]">
            3-layer confirmation
          </p>

          <SignalBar label="TA" value={0.72} color="#0ea5e9" note="RSI + MACD bullish" />
          <SignalBar label="ML" value={0.78} color="#8b5cf6" note="xgb + rf + gb ensemble" />
          <SignalBar label="AI" value={0.68} color="#f59e0b" note="trend intact → buy bias" />

          <div className="border-t border-[#14261d] pt-4 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#52665a]">
              Active positions · 2/3
            </p>
            <Position symbol="ETH/USDT" entry={3281.5} current={3324.1} size="0.32" sl={3248.0} />
            <Position symbol="SOL/USDT" entry={182.4} current={184.3} size="12.4" sl={180.1} />
          </div>

          <div className="border-t border-[#14261d] pt-4 grid grid-cols-2 gap-3 text-[10px] uppercase tracking-[0.22em] text-[#52665a]">
            <div>
              <p>daily p&amp;l</p>
              <p className="text-[#22c55e] text-sm font-bold mt-0.5 tabular-nums">
                +$24.60
              </p>
            </div>
            <div>
              <p>week</p>
              <p className="text-[#22c55e] text-sm font-bold mt-0.5 tabular-nums">
                +$182.30
              </p>
            </div>
          </div>
        </div>

        {/* Log stream — full width */}
        <div className="col-span-2 bg-[#0a0f0c] border border-[#14261d] rounded h-[180px] overflow-hidden">
          <div className="flex items-center justify-between px-4 h-8 border-b border-[#14261d] text-[10px] uppercase tracking-[0.22em] text-[#52665a]">
            <span>journalctl · trading-loop.service</span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e] animate-pulse" />
              streaming
            </span>
          </div>
          <div className="p-3 h-[calc(100%-2rem)] overflow-y-auto text-[11px] leading-relaxed">
            {log.map((l, i) => (
              <div key={i} className="flex gap-2 mb-0.5">
                <span className="text-[#52665a] shrink-0">[{l.t}]</span>
                <span
                  className="shrink-0 font-bold uppercase tracking-[0.08em]"
                  style={{ color: l.color }}
                >
                  {l.type.padEnd(6, " ")}
                </span>
                <span className="text-[#d4e4d1]">{l.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SignalBar({
  label,
  value,
  color,
  note,
}: {
  label: string;
  value: number;
  color: string;
  note: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold tabular-nums" style={{ color }}>
          {label}
        </span>
        <span className="text-xs tabular-nums" style={{ color }}>
          {value.toFixed(2)}
        </span>
      </div>
      <div className="h-1.5 bg-[#14261d] rounded-full overflow-hidden">
        <div
          className="h-full transition-all"
          style={{ width: `${value * 100}%`, background: color }}
        />
      </div>
      <p className="text-[9px] uppercase tracking-[0.2em] text-[#52665a] mt-1">
        {note}
      </p>
    </div>
  );
}

function Position({
  symbol,
  entry,
  current,
  size,
  sl,
}: {
  symbol: string;
  entry: number;
  current: number;
  size: string;
  sl: number;
}) {
  const pnl = ((current - entry) / entry) * 100;
  const up = pnl >= 0;
  return (
    <div className="flex items-center justify-between text-xs tabular-nums">
      <div>
        <p className="text-white font-semibold">{symbol}</p>
        <p className="text-[#52665a] text-[10px]">
          size {size} · SL ${sl}
        </p>
      </div>
      <div className="text-right">
        <p className="text-[#d4e4d1]">${current.toFixed(2)}</p>
        <p className={cn("text-[10px] font-bold", up ? "text-[#22c55e]" : "text-[#ef4444]")}>
          {up ? "+" : ""}
          {pnl.toFixed(2)}%
        </p>
      </div>
    </div>
  );
}
