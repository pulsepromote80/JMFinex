"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { X, MessageCircle } from "lucide-react";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import TradingViewChart from "./TradingViewChart";

/* =========================================================
   STATIC DATA
========================================================= */
const pairs = [
  { sym: "EUR/USD", price: "1.0868", pct: "+0.18%", up: true, seed: 1 },
  { sym: "GBP/USD", price: "1.2734", pct: "-0.09%", up: false, seed: 2 },
  { sym: "USD/JPY", price: "151.42", pct: "+0.22%", up: true, seed: 3 },
  { sym: "XAU/USD", price: "2387.90", pct: "+0.61%", up: true, seed: 4 },
  { sym: "GBP/JPY", price: "192.88", pct: "-0.14%", up: false, seed: 5 },
  { sym: "BTC/USD", price: "64,210.50", pct: "-1.02%", up: false, seed: 6 },
];

const openPositions = [
  {
    sym: "EUR/USD",
    type: "BUY",
    vol: "0.10",
    entry: "1.0842",
    curr: "1.0868",
    sl: "1.0812",
    tp: "1.0902",
    pl: "+$42.50",
    pos: true,
  },
  {
    sym: "XAU/USD",
    type: "SELL",
    vol: "0.05",
    entry: "2384.20",
    curr: "2387.90",
    sl: "2392.10",
    tp: "2368.40",
    pl: "-$18.20",
    pos: false,
  },
];

const tradeHistory = [
  {
    date: "Sep 21",
    sym: "EUR/USD",
    type: "BUY",
    vol: "0.10",
    entry: "1.0801",
    exit: "1.0842",
    pl: "+$41.00",
    status: "profitable",
  },
  {
    date: "Sep 20",
    sym: "GBP/USD",
    type: "SELL",
    vol: "0.15",
    entry: "1.2760",
    exit: "1.2782",
    pl: "-$33.00",
    status: "loss",
  },
  {
    date: "Sep 19",
    sym: "XAU/USD",
    type: "BUY",
    vol: "0.05",
    entry: "2360.10",
    exit: "2384.20",
    pl: "+$120.50",
    status: "profitable",
  },
  {
    date: "Sep 18",
    sym: "USD/JPY",
    type: "BUY",
    vol: "0.20",
    entry: "150.88",
    exit: "150.61",
    pl: "-$36.00",
    status: "loss",
  },
  {
    date: "Sep 17",
    sym: "EUR/USD",
    type: "SELL",
    vol: "0.10",
    entry: "1.0870",
    exit: "—",
    pl: "—",
    status: "open",
  },
];

const analyticsMetrics = [
  ["Win Rate", "68%"],
  ["Profit Factor", "1.82"],
  ["Average R:R", "1 : 2.1"],
  ["Total Trades", "124"],
];

const disciplineItems = [
  { let: "PLAN", title: "Plan", desc: "Define your setup before entering." },
  { let: "RISK", title: "Risk", desc: "Know your maximum acceptable risk." },
  { let: "EXECUTE", title: "Execute", desc: "Follow your trading plan." },
  { let: "REVIEW", title: "Review", desc: "Analyze every completed trade." },
];

const plBarValues = [120, -45, 88, 150, -30, 64, 95];

/* ---------- Chart data generators ---------- */
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateCandles(seed, count, start, vol, wick, trend) {
  const rand = mulberry32(seed);
  let price = start;
  const candles = [];
  let min = Infinity,
    max = -Infinity;
  for (let i = 0; i < count; i++) {
    const trendBias = trend ? Math.sin(i / 8) * (trend * 0.6) : 0;
    const v = (rand() - 0.5) * vol + trendBias;
    const open = price;
    const close = open + v;
    const high = Math.max(open, close) + rand() * wick;
    const low = Math.min(open, close) - rand() * wick;
    candles.push({ open, close, high, low });
    price = close;
    min = Math.min(min, low);
    max = Math.max(max, high);
  }
  return { candles, min, max };
}

const mainChartData = generateCandles(23, 52, 1.081, 0.0026, 0.0016, 0.9);

/* =========================================================
   CHART COMPONENTS
========================================================= */
function Sparkline({ seed, up }) {
  const rand = mulberry32(seed);
  const w = 52,
    h = 20,
    n = 14;
  let v = 10;
  const pts = [];
  let min = Infinity,
    max = -Infinity;
  for (let i = 0; i < n; i++) {
    v += (rand() - 0.5) * 3 + (up ? 0.35 : -0.35);
    pts.push(v);
    min = Math.min(min, v);
    max = Math.max(max, v);
  }
  const range = max - min || 1;
  const step = w / (n - 1);
  const d = pts
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${i * step} ${h - ((p - min) / range) * h}`,
    )
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height="100%"
      preserveAspectRatio="none"
    >
      <path
        d={d}
        fill="none"
        stroke={up ? "#33C285" : "#E8566A"}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MainChart() {
  const w = 1000,
    h = 380;
  const { candles, min, max } = mainChartData;
  const range = max - min || 1;
  const pad = { t: 16, r: 14, b: 14, l: 14 };
  const n = candles.length;
  const cw = (w - pad.l - pad.r) / n;
  const y = (v) => pad.t + (1 - (v - min) / range) * (h - pad.t - pad.b);

  return (
    <div className="relative h-full w-full">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {[1, 2, 3].map((g) => {
          const gy = pad.t + (g / 4) * (h - pad.t - pad.b);
          return (
            <line
              key={g}
              x1="0"
              y1={gy}
              x2={w}
              y2={gy}
              stroke="rgba(255,255,255,0.045)"
              strokeWidth="1"
            />
          );
        })}
        <line
          x1="0"
          y1={y(min + range * 0.78)}
          x2={w}
          y2={y(min + range * 0.78)}
          stroke="#EAC766"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.55"
        />
        <line
          x1="0"
          y1={y(min + range * 0.2)}
          x2={w}
          y2={y(min + range * 0.2)}
          stroke="#3E7BFA"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.55"
        />
        <line
          x1={0.06 * w}
          y1={y(min + range * 0.18)}
          x2={0.92 * w}
          y2={y(min + range * 0.7)}
          stroke="#6FA0FF"
          strokeWidth="1.4"
          opacity="0.7"
        />
        {candles.map((c, i) => {
          const cx = pad.l + i * cw + cw / 2;
          const up = c.close >= c.open;
          const bodyTop = y(Math.max(c.open, c.close));
          const bodyBot = y(Math.min(c.open, c.close));
          const bh = Math.max(1.4, bodyBot - bodyTop);
          return (
            <g key={i}>
              <line
                x1={cx}
                y1={y(c.high)}
                x2={cx}
                y2={y(c.low)}
                stroke={up ? "#EAC766" : "#6FA0FF"}
                strokeWidth="1"
                opacity="0.85"
              />
              <rect
                x={cx - cw * 0.3}
                y={bodyTop}
                width={cw * 0.6}
                height={bh}
                rx="1.5"
                fill={up ? "#EAC766" : "#3E7BFA"}
                opacity={up ? 1 : 0.9}
              />
            </g>
          );
        })}
        {[
          { i: 34, pos: 0.42, color: "#33C285" },
          { i: 34, pos: 0.14, color: "#E8566A" },
          { i: 34, pos: 0.8, color: "#33C285" },
        ].map((m, idx) => (
          <circle
            key={idx}
            cx={pad.l + m.i * cw + cw / 2}
            cy={y(min + range * m.pos)}
            r="3.2"
            fill={m.color}
            stroke="#07080B"
            strokeWidth="1.5"
          />
        ))}
      </svg>
      <div className="pointer-events-none absolute inset-0">
        <span
          className="absolute rounded-md border border-white/[0.12] bg-[rgba(12,14,19,0.9)] px-2 py-0.5 font-mono text-[10px] text-[#EAC766]"
          style={{ left: "5%", top: "6%" }}
        >
          Resistance
        </span>
        <span
          className="absolute rounded-md border border-white/[0.12] bg-[rgba(12,14,19,0.9)] px-2 py-0.5 font-mono text-[10px] text-[#6FA0FF]"
          style={{ left: "5%", top: "80%" }}
        >
          Support
        </span>
        <span
          className="absolute rounded-md border border-white/[0.12] bg-[rgba(12,14,19,0.9)] px-2 py-0.5 font-mono text-[10px] text-[#33C285]"
          style={{ left: "60%", top: "36%" }}
        >
          Entry
        </span>
        <span
          className="absolute rounded-md border border-white/[0.12] bg-[rgba(12,14,19,0.9)] px-2 py-0.5 font-mono text-[10px] text-[#33C285]"
          style={{ left: "60%", top: "10%" }}
        >
          Take Profit
        </span>
        <span
          className="absolute rounded-md border border-white/[0.12] bg-[rgba(12,14,19,0.9)] px-2 py-0.5 font-mono text-[10px] text-[#E8566A]"
          style={{ left: "60%", top: "86%" }}
        >
          Stop Loss
        </span>
      </div>
    </div>
  );
}

function PLBarChart() {
  const w = 1000,
    h = 200;
  const pad = { t: 14, b: 24, l: 8, r: 8 };
  const n = plBarValues.length;
  const bw = ((w - pad.l - pad.r) / n) * 0.5;
  const gap = (w - pad.l - pad.r) / n;
  const max = Math.max(...plBarValues.map((v) => Math.abs(v)));
  const zero = pad.t + (h - pad.t - pad.b) / 2;
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="0"
        y1={zero}
        x2={w}
        y2={zero}
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />
      {plBarValues.map((v, i) => {
        const x = pad.l + i * gap + (gap - bw) / 2;
        const bh = (Math.abs(v) / max) * ((h - pad.t - pad.b) / 2 - 6);
        const yPos = v >= 0 ? zero - bh : zero;
        const color = v >= 0 ? "#33C285" : "#E8566A";
        return (
          <g key={i}>
            <rect
              x={x}
              y={yPos}
              width={bw}
              height={bh}
              rx="3"
              fill={color}
              opacity="0.9"
            />
            <text
              x={x + bw / 2}
              y={h - 8}
              textAnchor="middle"
              fontSize="11"
              fill="#5D6472"
              fontFamily="monospace"
            >
              {days[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */
export default function SelfTradePage() {
  const pathname = usePathname();

  const [chatOpen, setChatOpen] = useState(false);
  const [activeTimeframe, setActiveTimeframe] = useState("1H");
  const [orderType, setOrderType] = useState("market");
  const [direction, setDirection] = useState("buy");
  const [activePairIdx, setActivePairIdx] = useState(0);

  const timeframes = ["1m", "5m", "15m", "30m", "1H", "4H", "1D"];
  const orderTypes = [
    { id: "market", label: "Market" },
    { id: "limit", label: "Limit" },
    { id: "stop", label: "Stop" },
  ];

  const badgeMap = {
    profitable: ["bg-[rgba(51,194,133,0.14)] text-[#33C285]", "PROFITABLE"],
    loss: ["bg-[rgba(232,86,106,0.14)] text-[#E8566A]", "LOSS"],
    open: ["bg-[rgba(62,123,250,0.14)] text-[#6FA0FF]", "OPEN"],
    closed: ["bg-white/[0.06] text-[#9BA3B0]", "CLOSED"],
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
    .self-trade-table { width: 100% !important; border-collapse: collapse !important; min-width: 720px !important; color: #F2F3F6 !important; }
    .self-trade-table thead th { background: #0C0E13 !important; color: #5D6472 !important; border: 0 !important; border-bottom: 1px solid rgba(255,255,255,0.07) !important; padding: 14px 18px !important; text-align: left !important; font-family: 'JetBrains Mono', monospace !important; font-size: 10.5px !important; font-weight: 500 !important; letter-spacing: 0.06em !important; white-space: nowrap !important; }
    .self-trade-table tbody td { background: transparent !important; color: #F2F3F6 !important; border: 0 !important; border-bottom: 1px solid rgba(255,255,255,0.07) !important; padding: 14px 18px !important; font-size: 13px !important; }
    .self-trade-table tbody tr:last-child td { border-bottom: 0 !important; }
    .self-trade-table tbody tr:hover, .self-trade-table tbody tr:hover td { background: #171A21 !important; }
  `,
        }}
      />

      <div className="relative overflow-hidden bg-[#07080B] font-body text-[#F2F3F6]">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0 z-0 [background:radial-gradient(ellipse_900px_500px_at_88%_-8%,rgba(62,123,250,0.09),transparent_60%),radial-gradient(ellipse_600px_380px_at_4%_4%,rgba(201,162,39,0.06),transparent_60%)]" />

     

        {/* ==================== MAIN CONTENT (top padding clears fixed navbar) ==================== */}
        <main className="relative z-10 pt-[110px] max-[720px]:pt-[90px]">
          {/* ==================== PAGE HEAD (now a <section>, not <header>) ==================== */}
          <section className="px-8 pb-7 pt-[120px] max-[720px]:px-5 max-[720px]:pt-[125px]">
            <div className="mx-auto max-w-[1400px]">
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div>
                  <div className="mb-3 font-mono text-[11px] tracking-[0.14em] text-[#6FA0FF]">
                    JM FINEX · SELF TRADE
                  </div>
                  <h1 className="mb-2.5 font-display text-[clamp(28px,4vw,38px)] font-bold leading-[1.1] tracking-[-0.02em] text-[#F2F3F6]">
                    Trade with your strategy.
                  </h1>
                  <p className="max-w-[460px] text-[14.5px] leading-[1.6] text-[#9BA3B0]">
                    Analyze the market, build your trade setup and execute
                    positions through a disciplined trading workflow.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {["Deposit", "Withdraw", "Trade History"].map((label) => (
                    <button
                      key={label}
                      type="button"
                      className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-[10px] border border-white/[0.12] bg-transparent px-4 py-2.5 text-[13px] font-semibold text-[#F2F3F6] transition hover:border-[#C9A227] hover:text-[#EAC766]"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-[18px] border border-white/[0.07] bg-white/[0.07] max-[900px]:grid-cols-3 max-[560px]:grid-cols-2 lg:grid-cols-5">
                {[
                  { l: "Available Balance", v: "$12,450.00" },
                  { l: "Equity", v: "$13,180.00", c: "text-[#EAC766]" },
                  { l: "Margin", v: "$2,400.00", c: "text-[#6FA0FF]" },
                  { l: "Free Margin", v: "$10,780.00", c: "text-[#6FA0FF]" },
                  { l: "Today's P/L", v: "+$185.40", c: "text-[#33C285]" },
                ].map((cell) => (
                  <div key={cell.l} className="bg-[#12141A] px-5 py-[18px]">
                    <span className="mb-2 block text-[11px] tracking-[0.02em] text-[#5D6472]">
                      {cell.l}
                    </span>
                    <b
                      className={`font-mono text-[17px] font-semibold ${cell.c || "text-[#F2F3F6]"}`}
                    >
                      {cell.v}
                    </b>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ==================== TERMINAL ==================== */}
          <div className="pt-9">
  <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 px-8 max-[720px]:px-5 lg:grid-cols-[220px_minmax(0,1fr)]">
    {/* Market Watch */}
    <div className="min-w-0 self-start overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#12141A]">
      <div className="flex min-w-0 items-center justify-between border-b border-white/[0.07] px-[18px] py-4">
        <h3 className="font-mono text-[11px] font-medium tracking-[0.1em] text-[#5D6472]">
          MARKET WATCH
        </h3>
      </div>
      <div className="flex flex-col">
        {pairs.map((p, i) => (
          <div
            key={p.sym}
            role="button"
            tabIndex={0}
            onClick={() => setActivePairIdx(i)}
            className={`flex min-w-0 items-center gap-2 overflow-hidden border-b border-white/[0.07] px-[18px] py-3 transition-colors last:border-b-0 hover:bg-[#171A21] ${activePairIdx === i ? "bg-[rgba(201,162,39,0.16)]" : ""}`}
          >
            <div className="min-w-0 flex-1 overflow-hidden">
              <div className="truncate text-[12.5px] font-semibold text-[#F2F3F6]">
                {p.sym}
              </div>
              <div className="mt-0.5 truncate font-mono text-[11.5px] text-[#9BA3B0]">
                {p.price}
              </div>
            </div>
            <div className="flex w-[60px] shrink-0 flex-col items-end gap-1 text-right">
              <div className="h-5 w-[52px] shrink-0 overflow-hidden">
                <Sparkline seed={p.seed} up={p.up} />
              </div>
              <div
                className={`whitespace-nowrap font-mono text-[11px] font-semibold ${p.up ? "text-[#33C285]" : "text-[#E8566A]"}`}
              >
                {p.pct}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Chart — now fills all remaining width */}
    <div className="flex min-w-0 flex-col gap-4">
      <div className="rounded-[18px] border border-white/[0.07] bg-[#12141A]">
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-white/[0.07] px-[18px] py-3">
          <div className="flex items-center gap-2">
            {["◧", "╱", "≡", "✎", "⊕", "⛶"].map((icon) => (
              <div
                key={icon}
                className="flex h-[30px] w-[30px] items-center justify-center rounded-lg border border-white/[0.07] text-[12px] text-[#9BA3B0] transition hover:border-white/[0.12] hover:text-[#F2F3F6]"
              >
                {icon}
              </div>
            ))}
          </div>
        </div>

        <div className="relative p-4 pt-[16px] pb-[18px]">
          <div className="relative h-[380px] overflow-hidden rounded-[14px] bg-[rgba(0,0,0,0.22)]">
            <TradingViewChart defaultSymbol="FX:USDCAD" interval="W" />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


{/* ==================== FOREX SESSIONS ==================== */}
<section id="sessions" className="py-20">
  <div className="mx-auto max-w-[1400px] px-8 max-[720px]:px-5">
    <div className="mb-8 max-w-[820px]">
      <div className="mb-2.5 font-mono text-[11px] tracking-[0.12em] text-[#6FA0FF]">
        SESSIONS
      </div>
      <h2 className="mb-6 font-display text-[clamp(23px,3vw,30px)] font-bold tracking-[-0.015em] text-[#F2F3F6]">
        How many forex trading sessions are there?
      </h2>
      <p className="text-[15px] leading-[1.85] text-[#9BA3B0]">
        Forex is unique — it never sleeps during the trading week. Instead of
        opening and closing once per day, it moves through different trading
        sessions worldwide as the sun travels around the globe.
      </p>
    </div>

    <div className="grid gap-x-16 gap-y-6 lg:grid-cols-2">
      {[
        ["Sydney Session", "The first market to open each trading week. In 2025, it's increasingly important for watching early Asian economic data and setting the tone for risk sentiment in AUD/USD and NZD/USD pairs."],
        ["Tokyo Session", "Famously known as the Asian Session. With Bank of Japan policy shifts and carry trade strategies evolving, JPY pairs now show heightened volatility during Asian hours, creating new opportunities for Tokyo session traders."],
        ["London Session", "One of the busiest forex sessions. The London-New York overlap (13:00-16:00 UTC) has become crucial for liquidity trading strategies, with institutions using this window for large order executions and liquidity pool testing."],
        ["New York Session", "The New York session now dominates during Fed policy announcements and central bank divergences. Traders focus on USD strength/weakness cycles and use AI-powered tools to analyze policy-driven volatility spikes."],
      ].map(([title, body]) => (
        <div key={title}>
          <h4 className="mb-1.5 font-display text-[15px] font-bold tracking-[0.01em] text-[#F2F3F6]">
            {title}
          </h4>
          <p className="text-[14.5px] leading-[1.8] text-[#9BA3B0]">{body}</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* ==================== PIPS & LOTS ==================== */}
<section id="measurement" className="py-20">
  <div className="mx-auto max-w-[1400px] px-8 max-[720px]:px-5">
    <div className="mb-8 max-w-[820px]">
      <div className="mb-2.5 font-mono text-[11px] tracking-[0.12em] text-[#6FA0FF]">
        MEASUREMENT
      </div>
      <h2 className="font-display text-[clamp(23px,3vw,30px)] font-bold tracking-[-0.015em] text-[#F2F3F6]">
        Pips and lots
      </h2>
    </div>

    <div className="grid gap-x-16 gap-y-12 lg:grid-cols-2">

      {/* Pips */}
      <div>
        <h3 className="mb-3 font-display text-[15px] font-bold tracking-[0.01em] text-[#F2F3F6]">
          What is a pip?
        </h3>
        <p className="mb-4 text-[15px] leading-[1.85] text-[#9BA3B0]">
          A pip — <em className="not-italic font-mono text-[13px] text-[#EAC766]">Percentage in Point</em> — is
          the smallest standard movement in a currency pair's price. It's the
          unit traders use to measure profit, loss, and market movement.
        </p>
        <p className="font-mono text-[13px] leading-[1.9] text-[#9BA3B0]">
          EUR/USD · 1.1000 → 1.1001 = <span className="text-[#33C285]">1 pip</span>
          <br />
          EUR/USD · 1.1000 → 1.1010 = <span className="text-[#33C285]">10 pips</span>
        </p>
      </div>

      {/* Lots */}
      <div>
        <h3 className="mb-3 font-display text-[15px] font-bold tracking-[0.01em] text-[#F2F3F6]">
          What are lots?
        </h3>
        <p className="mb-5 text-[15px] leading-[1.85] text-[#9BA3B0]">
          A lot is the standard unit used to measure the size of a forex
          trade. Instead of buying 10 euros or 50 dollars, traders open
          positions in lots. There are four common sizes.
        </p>

        <div className="flex flex-col gap-4">
          {[
            ["Standard Lot", "100,000 units", "Typically used by experienced traders, because even small price movements can have a significant financial impact."],
            ["Mini Lot", "10,000 units", "Commonly used by intermediate traders who want greater market exposure while maintaining lower risk than a standard lot."],
            ["Micro Lot", "1,000 units", "Ideal for beginners — smaller position sizes reduce potential losses while learning the market."],
            ["Nano Lot", "100 units", "Offered by some brokers, mainly for practice accounts or traders with very small balances."],
          ].map(([name, units, body]) => (
            <div key={name}>
              <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-display text-[14px] font-bold text-[#F2F3F6]">
                  {name}
                </span>
                <span className="font-mono text-[12px] text-[#EAC766]">{units}</span>
              </div>
              <p className="text-[14px] leading-[1.75] text-[#9BA3B0]">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

{/* ==================== COMMON MISTAKES ==================== */}
<section id="mistakes" className="py-20">
  <div className="mx-auto max-w-[1400px] px-8 max-[720px]:px-5">
    <div className="mb-10 max-w-[820px]">
      <div className="mb-2.5 font-mono text-[11px] tracking-[0.12em] text-[#6FA0FF]">
        PITFALLS
      </div>
      <h2 className="mb-6 font-display text-[clamp(23px,3vw,30px)] font-bold tracking-[-0.015em] text-[#F2F3F6]">
        Common mistakes beginners make
      </h2>
      <p className="text-[15px] leading-[1.85] text-[#9BA3B0]">
        Every successful trader started as a beginner. Mistakes are part of
        the learning — but understanding the most common ones can help you
        avoid unnecessary losses and build better habits from the start.
      </p>
    </div>

    <div className="grid gap-x-16 gap-y-7 lg:grid-cols-2">
      {[
        ["Trading without learning Smart Money Concepts", "Many new traders rely on basic indicators without understanding institutional order flow. Modern markets require knowledge of liquidity pools, order blocks, and how institutions manipulate price to execute large positions."],
        ["Ignoring market regime analysis", "Trading the same strategy in all market conditions is outdated. In 2025, successful traders use regime detection to distinguish between trending and ranging markets, adapting their approach based on volatility and structure."],
        ["Overlooking central bank divergence", "With global central banks taking different policy paths, ignoring interest rate differentials and policy shifts leads to poor timing. Modern traders focus on the Fed vs ECB vs BOE policy divergence landscape."],
        ["Chasing AI signals without validation", "While AI-powered tools are powerful, blindly following algorithmic signals without understanding the underlying market context is dangerous. Combine AI insights with fundamental analysis and proper risk management."],
        ["Neglecting liquidity zones", "Modern price action trading focuses on liquidity pools rather than simple support/resistance. Failing to identify where institutional orders are clustered leads to entering at wrong levels and getting stopped out by smart money."],
      ].map(([title, body]) => (
        <div key={title}>
          <h4 className="mb-1.5 font-display text-[15px] font-bold tracking-[0.01em] text-[#F2F3F6]">
            {title}
          </h4>
          <p className="text-[14.5px] leading-[1.8] text-[#9BA3B0]">{body}</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* ==================== CONCLUSION ==================== */}
<section id="conclusion" className="py-20 pb-24">
  <div className="mx-auto max-w-[1400px] px-8 max-[720px]:px-5">
    <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">

      <div>
        <div className="mb-2.5 font-mono text-[11px] tracking-[0.12em] text-[#6FA0FF]">
          SUMMARY
        </div>
        <h2 className="font-display text-[clamp(23px,3vw,30px)] font-bold leading-[1.2] tracking-[-0.015em] text-[#F2F3F6]">
          Starting with the basics
        </h2>
      </div>

      <div className="flex flex-col gap-5">
        <p className="text-[15px] leading-[1.85] text-[#9BA3B0]">
          Understanding what forex is, how currency pairs work, when the
          market is most active, and the role of pips, lots, and leverage is
          the first step toward becoming a profitable trader.
        </p>
        <p className="text-[15px] leading-[1.85] text-[#9BA3B0]">
          By learning these basic concepts you can build a trading strategy
          that allows you to grow your capital. By mastering them and
          following risk management practices, you'll be ready to make
          informed trading decisions.
        </p>
        <p className="text-[15px] italic leading-[1.85] text-[#F2F3F6]">
          Whether you want to trade part-time or build a long-term skill,
          starting with the basics is the smartest approach.
        </p>
      </div>
    </div>
  </div>
</section>
          

          {/* ==================== ANALYTICS ==================== */}
          <section id="analytics" className="py-16">
            <div className="mx-auto max-w-[1400px] px-8 max-[720px]:px-5">
              <div className="mb-8 max-w-[600px]">
                <div className="mb-2.5 font-mono text-[11px] tracking-[0.12em] text-[#6FA0FF]">
                  PERFORMANCE
                </div>
                <h2 className="font-display text-[clamp(23px,3vw,30px)] font-bold tracking-[-0.015em] text-[#F2F3F6]">
                  Your trading performance
                </h2>
              </div>

              <div className="mb-5 grid grid-cols-2 gap-px overflow-hidden rounded-[18px] border border-white/[0.07] bg-white/[0.07] lg:grid-cols-4">
                {analyticsMetrics.map(([l, v]) => (
                  <div key={l} className="bg-[#12141A] px-[22px] py-6">
                    <span className="mb-2.5 block text-[11.5px] text-[#5D6472]">
                      {l}
                    </span>
                    <b className="font-display text-[24px] font-bold text-[#F2F3F6]">
                      {v}
                    </b>
                  </div>
                ))}
              </div>

              <div className="rounded-[18px] border border-white/[0.07] bg-[#0c0e13] p-[22px]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-mono text-[11px] font-medium tracking-[0.1em] text-[#5D6472]">
                    PROFIT / LOSS — LAST 7 DAYS
                  </h3>
                </div>
                <div className="h-[200px] overflow-hidden rounded-[14px] bg-[rgba(0,0,0,0.22)]">
                  <PLBarChart />
                </div>
              </div>
            </div>
          </section>

          {/* ==================== DISCIPLINE ==================== */}
          <section id="discipline" className="py-16">
            <div className="mx-auto max-w-[1400px] px-8 max-[720px]:px-5">
              <div className="mb-8 max-w-[600px]">
                <div className="mb-2.5 font-mono text-[11px] tracking-[0.12em] text-[#6FA0FF]">
                  METHOD
                </div>
                <h2 className="font-display text-[clamp(23px,3vw,30px)] font-bold tracking-[-0.015em] text-[#F2F3F6]">
                  Trade with discipline
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {disciplineItems.map((d) => (
                  <div
                    key={d.let}
                    className="rounded-[14px] border border-white/[0.07] bg-[#12141A] p-[22px]"
                  >
                    <div className="mb-3.5 font-mono text-[12px] tracking-[0.08em] text-[#EAC766]">
                      {d.let}
                    </div>
                    <h4 className="mb-2 font-display text-[14.5px] font-bold tracking-[0.03em] text-[#F2F3F6]">
                      {d.title}
                    </h4>
                    <p className="text-[12.5px] leading-[1.55] text-[#9BA3B0]">
                      {d.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ==================== FINAL CTA ==================== */}
          <section className="py-20 pb-24">
            <div className="mx-auto max-w-[600px] px-8 text-center max-[720px]:px-5">
              <h2 className="mb-4 font-display text-[clamp(26px,3.6vw,36px)] font-bold leading-[1.15] tracking-[-0.02em] text-[#F2F3F6]">
                Your strategy. Your decision.
              </h2>
              <p className="mb-8 text-[15px] leading-[1.7] text-[#9BA3B0]">
                Analyze the market, define your risk and execute trades
                according to your own trading plan.
              </p>
              <a
                href="#top"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[#EAC766] to-[#C9A227] px-6 py-3.5 text-[13px] font-semibold text-[#181307] shadow-[0_8px_22px_-10px_rgba(201,162,39,0.5)] transition hover:-translate-y-px"
              >
                Open Trading Terminal
              </a>
            </div>
          </section>
        </main>

        {/* ==================== FLOATING CHAT ==================== */}
        <div className="fixed bottom-7 right-7 z-50 flex flex-col items-end gap-3 max-[720px]:bottom-5 max-[720px]:right-5">
          {chatOpen && (
            <div
              className="flex flex-col items-end gap-2"
              role="menu"
              aria-label="Contact options"
            >
              <a
                href="https://wa.me/?text=Hello%20JMFinex%2C%20I%20would%20like%20to%20know%20more%20about%20Academics"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 rounded-full border border-[#25D366]/[0.45] bg-[#10251A] px-3.5 py-2.5 text-[0.85rem] font-semibold text-[#EEF3F8] shadow-[0_8px_25px_rgba(0,0,0,0.3)] transition hover:-translate-y-0.5 hover:bg-[#163822]"
              >
                <FaWhatsapp size={18} className="text-[#25D366]" />
                WhatsApp
              </a>
              <a
                href="https://t.me/share/url?text=Learn%20more%20about%20JMFinex%20Academics"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 rounded-full border border-[#229ED9]/[0.45] bg-[#102331] px-3.5 py-2.5 text-[0.85rem] font-semibold text-[#EEF3F8] shadow-[0_8px_25px_rgba(0,0,0,0.3)] transition hover:-translate-y-0.5 hover:bg-[#153449]"
              >
                <FaTelegramPlane size={18} className="text-[#229ED9]" />
                Telegram
              </a>
            </div>
          )}
          <button
            type="button"
            onClick={() => setChatOpen((v) => !v)}
            aria-expanded={chatOpen}
            aria-label={
              chatOpen ? "Close contact options" : "Open contact options"
            }
            className="grid h-[55px] w-[55px] place-items-center rounded-full bg-[#7132F5] text-white shadow-[0_10px_30px_rgba(113,50,245,0.45)] transition duration-300 hover:scale-105 hover:bg-[#844DFF]"
          >
            {chatOpen ? <X size={20} /> : <MessageCircle size={22} />}
          </button>
        </div>
      </div>
    </>
  );
}