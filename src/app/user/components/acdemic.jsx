"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import {
  ArrowUpRight,
  BarChart3,
  Bitcoin,
  BookOpen,
  BrainCircuit,
  CandlestickChart,
  CheckCircle2,
  GraduationCap,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react";



const tracks = [
  [
    CandlestickChart,
    "Foundation of Forex 2025",
    "Master modern Forex fundamentals including market structure, institutional participants, liquidity concepts, and the evolving landscape of global currency trading.",
    "",
    "#3B9EFF",
  ],
  [
    BrainCircuit,
    "Smart Money Concepts (SMC)",
    "Learn institutional trading concepts: order blocks, liquidity pools, market structure shifts, and how to read the footprints left by big players in the market.",
    "",
    "#F0B429",
  ],
  [
    BarChart3,
    "ICT Trading Framework",
    "Understand the Inner Circle Trader approach: liquidity, displacement, fair value gaps, and how to trade with institutional market participants rather than against them.",
    "",
    "#35D07F",
  ],
  [
    TrendingUp,
    "Liquidity & Order Flow",
    "Advanced market microstructure analysis using footprint charts, order book data, VWAP, and real-time order flow to decode institutional intentions and execute precise entries.",
    "",
    "#E8836B",
  ],
  [
    Bitcoin,
    "AI-Powered Trading Analysis",
    "Leverage modern AI tools for NLP news analysis, volume spike detection, algorithmic pattern recognition, and data-driven decision making in today's high-frequency markets.",
    "",
    "#A78BFA",
  ],
  [
    ShieldCheck,
    "Central Bank Policy Trading",
    "Navigate the fragmented global easing cycle, trade interest rate differentials, and capitalize on policy divergence between the Fed, ECB, BOE, and other major central banks.",
    "",
    "#22E8D4",
  ],
  [
    BrainCircuit,
    "Advanced Risk Management",
    "Implement equity guards, ATR-based position sizing, regime-based risk controls, and volatility gates to protect capital in modern market conditions.",
    "",
    "#33C285",
  ],
  [
    GraduationCap,
    "Algorithmic Execution Mastery",
    "Learn to build and use EAs, automated risk management systems, and algorithmic execution strategies that align with institutional trading practices.",
    "",
    "#3B9EFF",
  ],
];

const skills = [
  "Understand modern Forex market structure and institutional participants",
  "Identify Smart Money Concepts and institutional order flow",
  "Apply ICT trading framework and liquidity analysis",
  "Use AI-powered tools for market analysis and decision making",
  "Trade central bank policy divergence and interest rate differentials",
  "Implement advanced risk management with equity guards and ATR-based sizing",
  "Execute precise entries using order flow and market microstructure",
  "Build algorithmic execution strategies aligned with institutional practices",
];


/* ---------- Pattern data ---------- */
const PATTERNS = [
  { id: "hs", bias: "bear", tag: "REVERSAL · BEARISH", title: "Head & Shoulders",
    desc: "Three peaks — a higher middle peak flanked by two similar side peaks. A break below the neckline often signals the uptrend has lost momentum.",
    points: [{x:0,y:30},{x:12,y:60},{x:22,y:38},{x:35,y:85},{x:48,y:38},{x:60,y:60},{x:72,y:38},{x:85,y:18},{x:100,y:8}],
    guides: [{x1:18,y1:38,x2:100,y2:20}] },
  { id: "ihs", bias: "bull", tag: "REVERSAL · BULLISH", title: "Inverse Head & Shoulders",
    desc: "The mirror of head and shoulders, forming after a downtrend. A break above the neckline suggests selling pressure is fading.",
    points: [{x:0,y:70},{x:12,y:40},{x:22,y:62},{x:35,y:15},{x:48,y:62},{x:60,y:40},{x:72,y:62},{x:85,y:82},{x:100,y:92}],
    guides: [{x1:18,y1:62,x2:100,y2:80}] },
  { id: "dtop", bias: "bear", tag: "REVERSAL · BEARISH", title: "Double Top",
    desc: "Price tests the same resistance twice and fails to break higher. A close below the mid support often confirms the change in trend.",
    points: [{x:0,y:30},{x:20,y:75},{x:35,y:45},{x:55,y:75},{x:72,y:45},{x:88,y:20},{x:100,y:12}],
    guides: [{x1:28,y1:45,x2:100,y2:45}] },
  { id: "dbot", bias: "bull", tag: "REVERSAL · BULLISH", title: "Double Bottom",
    desc: "Price tests the same support twice and holds. A close above the mid resistance often confirms buyers have taken control.",
    points: [{x:0,y:70},{x:20,y:25},{x:35,y:55},{x:55,y:25},{x:72,y:55},{x:88,y:80},{x:100,y:88}],
    guides: [{x1:28,y1:55,x2:100,y2:55}] },
  { id: "asctri", bias: "bull", tag: "CONTINUATION · BULLISH", title: "Ascending Triangle",
    desc: "A flat resistance line capped above a series of rising higher lows. A breakout above resistance usually continues the prior trend.",
    points: [{x:0,y:28},{x:12,y:58},{x:24,y:38},{x:36,y:58},{x:48,y:44},{x:60,y:58},{x:72,y:50},{x:85,y:58},{x:92,y:75},{x:100,y:88}],
    guides: [{x1:8,y1:58,x2:88,y2:58},{x1:24,y1:38,x2:72,y2:50}] },
  { id: "desctri", bias: "bear", tag: "CONTINUATION · BEARISH", title: "Descending Triangle",
    desc: "A flat support line beneath a series of falling lower highs. A breakdown below support usually continues the prior trend.",
    points: [{x:0,y:72},{x:12,y:42},{x:24,y:62},{x:36,y:42},{x:48,y:56},{x:60,y:42},{x:72,y:50},{x:85,y:42},{x:92,y:25},{x:100,y:12}],
    guides: [{x1:8,y1:42,x2:88,y2:42},{x1:24,y1:62,x2:72,y2:50}] },
  { id: "symtri", bias: "neutral", tag: "BILATERAL", title: "Symmetrical Triangle",
    desc: "Converging trendlines compress price into a tightening range. Direction isn't decided until the breakout — trade the confirmation, not the shape.",
    points: [{x:0,y:30},{x:14,y:70},{x:28,y:40},{x:42,y:62},{x:56,y:46},{x:68,y:56},{x:78,y:50},{x:88,y:66},{x:100,y:80}],
    guides: [{x1:0,y1:70,x2:78,y2:50},{x1:0,y1:30,x2:78,y2:50}] },
  { id: "bullflag", bias: "bull", tag: "CONTINUATION · BULLISH", title: "Bull Flag",
    desc: "A sharp rally (the pole) followed by a brief, orderly pullback (the flag). A breakout above the flag often resumes the original move.",
    points: [{x:0,y:10},{x:10,y:76},{x:24,y:68},{x:34,y:73},{x:44,y:63},{x:54,y:68},{x:64,y:58},{x:76,y:82},{x:88,y:92},{x:100,y:97}],
    guides: [{x1:20,y1:73,x2:68,y2:56},{x1:20,y1:68,x2:68,y2:51}] },
  { id: "bearflag", bias: "bear", tag: "CONTINUATION · BEARISH", title: "Bear Flag",
    desc: "A sharp decline (the pole) followed by a brief, orderly bounce (the flag). A breakdown below the flag often resumes the original move.",
    points: [{x:0,y:90},{x:10,y:24},{x:24,y:32},{x:34,y:27},{x:44,y:37},{x:54,y:32},{x:64,y:42},{x:76,y:18},{x:88,y:8},{x:100,y:3}],
    guides: [{x1:20,y1:27,x2:68,y2:44},{x1:20,y1:32,x2:68,y2:49}] },
  { id: "cup", bias: "bull", tag: "CONTINUATION · BULLISH", title: "Cup & Handle",
    desc: "A rounded recovery (the cup) followed by a small pullback near the prior high (the handle). A breakout above the handle often continues the uptrend.",
    points: [{x:0,y:70},{x:10,y:50},{x:20,y:30},{x:30,y:18},{x:40,y:15},{x:50,y:18},{x:60,y:30},{x:70,y:50},{x:78,y:68},{x:84,y:58},{x:90,y:62},{x:96,y:80},{x:100,y:90}],
    guides: [{x1:0,y1:70,x2:78,y2:70}] },
];

const articleContent = {
  "Foundation of Forex 2025": {
    summary:
      "Modern Forex trading requires understanding institutional market structure, liquidity concepts, and the evolving landscape of global currency trading. Learn how banks, hedge funds, and other major participants shape price action and create opportunities for informed traders.",
    points: [
      "Institutional market structure",
      "Liquidity provider mechanics",
      "Modern currency pair dynamics",
      "Global trading session evolution",
    ],
  },
  "Smart Money Concepts (SMC)": {
    summary:
      "Smart Money Concepts is a trading approach that aims to understand and replicate the strategies used by institutional traders. By identifying order blocks, liquidity pools, and market structure shifts, you can anticipate institutional moves and align your trading with smart money flow.",
    points: [
      "Order block identification",
      "Liquidity pool analysis",
      "Market structure shifts",
      "Institutional footprint recognition",
    ],
  },
  "ICT Trading Framework": {
    summary:
      "The Inner Circle Trader framework focuses on liquidity, displacement, and fair value gaps. This approach teaches traders to think like institutional participants rather than retail traders, providing a sophisticated understanding of how smart money manipulates price to execute large positions.",
    points: [
      "Liquidity zone mapping",
      "Fair value gap trading",
      "Displacement concepts",
      "Institutional timing strategies",
    ],
  },
  "Liquidity & Order Flow": {
    summary:
      "Advanced liquidity trading involves understanding market microstructure, bid-ask dynamics, and institutional liquidity pools. Modern traders use footprint charts, order book data, and high-frequency analytics to anticipate liquidity gaps and execute with surgical precision.",
    points: [
      "Market microstructure analysis",
      "Order flow decoding",
      "Footprint chart interpretation",
      "Liquidity gap anticipation",
    ],
  },
  "AI-Powered Trading Analysis": {
    summary:
      "Leading traders now leverage AI-powered tools that analyze massive amounts of data, including NLP news analytics, volume spikes, and algorithmic patterns. These tools can account for over 50% of daily volume shifts in major currency pairs, providing a significant edge in modern markets.",
    points: [
      "AI market sentiment analysis",
      "NLP news integration",
      "Volume spike detection",
      "Algorithmic pattern recognition",
    ],
  },
  "Central Bank Policy Trading": {
    summary:
      "With the global easing cycle fragmenting, central bank policy divergence has become a key driver in Forex markets. Learn to trade interest rate differentials, policy shifts, and the evolving landscape between the Fed, ECB, BOE, and other major central banks.",
    points: [
      "Central bank policy analysis",
      "Interest rate differential trading",
      "Policy divergence strategies",
      "Macro event impact assessment",
    ],
  },
  "Advanced Risk Management": {
    summary:
      "Modern risk management goes beyond simple percentage rules. Advanced approaches include equity guards, ATR-based position sizing, regime-based risk controls, and volatility gates that adapt to changing market conditions and protect capital during uncertain periods.",
    points: [
      "ATR-based position sizing",
      "Equity protection systems",
      "Volatility filtering gates",
      "Regime-based risk adjustment",
    ],
  },
  "Algorithmic Execution Mastery": {
    summary:
      "Learn to build and use Expert Advisors (EAs), automated risk management systems, and algorithmic execution strategies that align with institutional trading practices. This includes understanding market regime detection, volatility filtering, and disciplined execution automation.",
    points: [
      "EA development and optimization",
      "Automated risk management",
      "Market regime detection",
      "Institutional execution alignment",
    ],
  },
};

function getArticleParagraphs(article) {
  const content = articleContent[article.title];
  const points = content?.points || [
    "Core concepts",
    "Practical examples",
    "Market context",
    "Risk awareness",
  ];

  return [
    content?.summary || article.description,
    `In practical terms, ${article.description.toLowerCase()} Studying this topic helps you understand modern market dynamics and institutional behavior before making decisions, giving you a clearer way to evaluate both opportunity and risk in today's complex Forex environment.`,
    `The most useful ideas to carry forward are ${points
      .slice(0, 3)
      .join(
        ", ",
      )}, and disciplined execution. These principles work together to turn information into a repeatable learning process that aligns with institutional trading practices.`,
  ];
}

/* Level tags shown in the reference image — index-mapped */
const LEVEL_META = [
  { tag: "BEGINNER", cls: "bg-[rgba(62,123,250,0.14)] text-[#6FA0FF]" },              // 01
  { tag: "INTERMEDIATE", cls: "bg-[rgba(201,162,39,0.16)] text-[#EAC766]" },          // 02
  { tag: "BEGINNER → INTERMEDIATE", cls: "bg-white/[0.06] text-[#9BA3B0]" },          // 03
  { tag: "INTERMEDIATE", cls: "bg-[rgba(201,162,39,0.16)] text-[#EAC766]" },          // 04
  { tag: "INTERMEDIATE", cls: "bg-[rgba(201,162,39,0.16)] text-[#EAC766]" },          // 05
  { tag: "ALL LEVELS", cls: "bg-[rgba(51,194,133,0.12)] text-[#33C285]" },            // 06
  { tag: "ALL LEVELS", cls: "bg-[rgba(51,194,133,0.12)] text-[#33C285]" },            // 07
  { tag: "BEGINNER", cls: "bg-[rgba(62,123,250,0.14)] text-[#6FA0FF]" },              // 08
];

/* Candlestick data for the hero chart — matches the reference image */
const heroCandles = [
  // --- Phase 1: bottom start (mixed, near support) ---
  { o: 250, c: 254, h: 258, l: 246 },
  { o: 254, c: 248, h: 256, l: 244 },
  { o: 248, c: 256, h: 260, l: 244 },
  { o: 256, c: 250, h: 258, l: 246 },
  { o: 250, c: 244, h: 252, l: 240 },
  { o: 244, c: 248, h: 252, l: 240 },
  { o: 248, c: 240, h: 250, l: 236 },
  { o: 240, c: 234, h: 242, l: 230 },

  // --- Phase 2: rising trend (mostly gold) ---
  { o: 234, c: 226, h: 236, l: 222 },
  { o: 226, c: 230, h: 234, l: 222 },
  { o: 230, c: 220, h: 232, l: 216 },
  { o: 220, c: 212, h: 222, l: 208 },
  { o: 212, c: 216, h: 220, l: 208 },
  { o: 216, c: 204, h: 218, l: 200 },
  { o: 204, c: 196, h: 206, l: 192 },
  { o: 196, c: 200, h: 204, l: 192 },
  { o: 200, c: 188, h: 202, l: 184 },
  { o: 188, c: 178, h: 190, l: 174 },
  { o: 178, c: 182, h: 186, l: 174 },
  { o: 182, c: 170, h: 184, l: 166 },
  { o: 170, c: 158, h: 172, l: 154 },
  { o: 158, c: 148, h: 160, l: 144 },
  { o: 148, c: 140, h: 150, l: 136 },
  { o: 140, c: 130, h: 142, l: 126 },

  // --- Phase 3: peak / breakout zone ---
  { o: 130, c: 120, h: 132, l: 116 },
  { o: 120, c: 108, h: 122, l: 104 },
  { o: 108, c: 100, h: 110, l: 96 },
  { o: 100, c: 105, h: 108, l: 96 },
  { o: 105, c: 100, h: 108, l: 96 },

  // --- Phase 4: sharp fall (mostly blue) ---
  { o: 100, c: 110, h: 106, l: 114 },
  { o: 110, c: 122, h: 116, l: 126 },
  { o: 122, c: 134, h: 128, l: 138 },
  { o: 134, c: 145, h: 140, l: 149 },
  { o: 145, c: 158, h: 151, l: 162 },
  { o: 158, c: 172, h: 164, l: 176 },
  { o: 172, c: 186, h: 178, l: 190 },
  { o: 186, c: 200, h: 192, l: 204 },
  { o: 200, c: 214, h: 206, l: 218 },
  { o: 214, c: 228, h: 220, l: 232 },
  { o: 228, c: 244, h: 234, l: 248 },
  { o: 244, c: 258, h: 250, l: 262 },
];

/* ---------- Practice chart candle data (48 candles) ---------- */
const practiceCandles = [
  { o: 210, c: 208, h: 212, l: 205 }, { o: 208, c: 210, h: 213, l: 205 },
  { o: 210, c: 206, h: 211, l: 203 }, { o: 206, c: 203, h: 208, l: 200 },
  { o: 203, c: 206, h: 209, l: 200 }, { o: 206, c: 202, h: 208, l: 199 },
  { o: 202, c: 198, h: 204, l: 195 }, { o: 198, c: 201, h: 203, l: 195 },
  { o: 201, c: 197, h: 203, l: 194 }, { o: 197, c: 200, h: 202, l: 194 },
  { o: 200, c: 195, h: 201, l: 192 }, { o: 195, c: 191, h: 197, l: 188 },
  { o: 191, c: 188, h: 193, l: 185 }, { o: 188, c: 185, h: 190, l: 182 },
  { o: 185, c: 182, h: 187, l: 179 }, { o: 182, c: 185, h: 187, l: 179 },
  { o: 185, c: 180, h: 186, l: 177 }, { o: 180, c: 176, h: 182, l: 173 },
  { o: 176, c: 173, h: 178, l: 170 }, { o: 173, c: 170, h: 175, l: 167 },
  { o: 170, c: 167, h: 172, l: 164 }, { o: 167, c: 170, h: 172, l: 164 },
  { o: 170, c: 165, h: 171, l: 162 }, { o: 165, c: 160, h: 167, l: 157 },
  { o: 160, c: 156, h: 162, l: 153 }, { o: 156, c: 158, h: 161, l: 153 },
  { o: 158, c: 153, h: 159, l: 150 }, { o: 153, c: 149, h: 155, l: 146 },
  { o: 149, c: 145, h: 151, l: 142 }, { o: 145, c: 141, h: 147, l: 138 },
  { o: 141, c: 143, h: 146, l: 138 }, { o: 143, c: 138, h: 144, l: 135 },
  { o: 138, c: 133, h: 140, l: 130 }, { o: 133, c: 129, h: 135, l: 126 },
  { o: 129, c: 125, h: 131, l: 122 }, { o: 125, c: 121, h: 127, l: 118 },
  { o: 121, c: 118, h: 123, l: 115 }, { o: 118, c: 121, h: 123, l: 115 },
  { o: 121, c: 116, h: 122, l: 113 }, { o: 116, c: 111, h: 118, l: 108 },
  { o: 111, c: 107, h: 113, l: 104 }, { o: 107, c: 103, h: 109, l: 100 },
  { o: 103, c: 100, h: 105, l: 97 },  { o: 100, c: 97,  h: 102, l: 94 },
  { o: 97,  c: 94,  h: 99,  l: 91 },  { o: 94,  c: 96,  h: 99,  l: 91 },
  { o: 96,  c: 92,  h: 97,  l: 89 },  { o: 92,  c: 88,  h: 94,  l: 85 },
];

function HeroChart() {
  const w = 760;
  const h = 320;
  const spacing = 19;
  const bodyW = 8;
  const startX = 24;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height="auto"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Grid lines */}
      {[1, 2, 3].map((g) => (
        <line
          key={g}
          x1="0"
          y1={(h / 4) * g}
          x2={w}
          y2={(h / 4) * g}
          stroke="rgba(255,255,255,0.045)"
          strokeWidth="1"
        />
      ))}

      {/* Resistance dashed line */}
      <line
        x1="0"
        y1="115"
        x2={w}
        y2="115"
        stroke="#EAC766"
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.55"
      />

      {/* Support dashed line */}
      <line
        x1="0"
        y1="248"
        x2={w}
        y2="248"
        stroke="#6FA0FF"
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.55"
      />

      {/* Candles */}
      {heroCandles.map((c, i) => {
        const x = startX + i * spacing;
        const up = c.c < c.o;
        const top = Math.min(c.o, c.c);
        const bot = Math.max(c.o, c.c);
        const bodyH = Math.max(2, bot - top);

        return (
          <g key={i}>
            {/* Wick */}
            <line
              x1={x + bodyW / 2}
              y1={c.h}
              x2={x + bodyW / 2}
              y2={c.l}
              stroke={up ? "#EAC766" : "#6FA0FF"}
              strokeWidth="1"
              opacity="0.85"
            />
            {/* Body */}
            <rect
              x={x}
              y={top}
              width={bodyW}
              height={bodyH}
              rx="1.5"
              fill={up ? "#EAC766" : "#3E7BFA"}
            />
          </g>
        );
      })}

      {/* Annotation: Resistance */}
      <g>
        <rect
          x="40"
          y="82"
          width="100"
          height="26"
          rx="6"
          fill="rgba(12,14,19,0.9)"
          stroke="rgba(255,255,255,0.12)"
        />
        <text x="52" y="99" fontFamily="monospace" fontSize="11" fill="#EAC766">
          Resistance
        </text>
      </g>

      {/* Annotation: Breakout */}
      <g>
        <rect
          x="470"
          y="180"
          width="90"
          height="26"
          rx="6"
          fill="rgba(12,14,19,0.9)"
          stroke="rgba(255,255,255,0.12)"
        />
        <text x="482" y="197" fontFamily="monospace" fontSize="11" fill="#9BA3B0">
          Breakout
        </text>
      </g>

      {/* Annotation: Support */}
      <g>
        <rect
          x="40"
          y="215"
          width="80"
          height="26"
          rx="6"
          fill="rgba(12,14,19,0.9)"
          stroke="rgba(255,255,255,0.12)"
        />
        <text x="52" y="232" fontFamily="monospace" fontSize="11" fill="#6FA0FF">
          Support
        </text>
      </g>
    </svg>
  );
}
function PatternDiagram({ pattern }) {
  const color =
    pattern.bias === "bull"
      ? "#EAC766"
      : pattern.bias === "bear"
      ? "#6FA0FF"
      : "#9BA3B0";

  // Build a smooth curved path through the points
  const pts = pattern.points;
  let d = `M ${pts[0].x} ${100 - pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const mx = (p0.x + p1.x) / 2;
    const my = (100 - p0.y + 100 - p1.y) / 2;
    d += ` Q ${p0.x} ${100 - p0.y} ${mx} ${my}`;
  }
  const last = pts[pts.length - 1];
  d += ` T ${last.x} ${100 - last.y}`;

  // Arrowhead at the end of the line
  const prev = pts[pts.length - 2];
  const dx = last.x - prev.x;
  const dy = -(last.y - prev.y);
  const ang = Math.atan2(dy, dx);
  const ax = last.x;
  const ay = 100 - last.y;
  const a1x = ax - 4 * Math.cos(ang - 0.5);
  const a1y = ay - 4 * Math.sin(ang - 0.5);
  const a2x = ax - 4 * Math.cos(ang + 0.5);
  const a2y = ay - 4 * Math.sin(ang + 0.5);

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Guide lines */}
      {(pattern.guides || []).map((g, i) => (
        <line
          key={i}
          x1={g.x1}
          y1={100 - g.y1}
          x2={g.x2}
          y2={100 - g.y2}
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="0.6"
          strokeDasharray="2.2 2.2"
        />
      ))}

      {/* Main pattern line */}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      {/* End dot */}
      <circle cx={ax} cy={ay} r="1.6" fill={color} />

      {/* Arrowhead */}
      <path
        d={`M ${ax} ${ay} L ${a1x} ${a1y} M ${ax} ${ay} L ${a2x} ${a2y}`}
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function PracticeChart() {
  const w = 760;
  const h = 320;
  const spacing = 14;
  const bodyW = 7;
  const startX = 30;

  // Compute price range to scale candles to fit the chart height
  const highs = practiceCandles.map((c) => c.h);
  const lows = practiceCandles.map((c) => c.l);
  const maxP = Math.max(...highs);
  const minP = Math.min(...lows);
  const pad = 16;
  const range = maxP - minP || 1;
  const y = (v) => pad + (1 - (v - minP) / range) * (h - pad * 2);

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Grid lines */}
      {[1, 2, 3].map((g) => (
        <line
          key={g}
          x1="0"
          y1={(h / 4) * g}
          x2={w}
          y2={(h / 4) * g}
          stroke="rgba(255,255,255,0.045)"
          strokeWidth="1"
        />
      ))}

      {/* Resistance dashed line */}
      <line
        x1="0"
        y1="70"
        x2={w}
        y2="70"
        stroke="#EAC766"
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.55"
      />

      {/* Support dashed line */}
      <line
        x1="0"
        y1="250"
        x2={w}
        y2="250"
        stroke="#3E7BFA"
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.55"
      />

      {/* Trend line */}
      <line
        x1={0.05 * w}
        y1={y(minP + range * 0.8)}
        x2={0.9 * w}
        y2={y(minP + range * 0.34)}
        stroke="#6FA0FF"
        strokeWidth="1.4"
        opacity="0.7"
      />

      {/* Candles */}
      {practiceCandles.map((c, i) => {
        const x = startX + i * spacing;
        const up = c.c < c.o;
        const top = y(Math.max(c.o, c.c));
        const bot = y(Math.min(c.o, c.c));
        const bodyH = Math.max(2, bot - top);

        return (
          <g key={i}>
            <line
              x1={x + bodyW / 2}
              y1={y(c.h)}
              x2={x + bodyW / 2}
              y2={y(c.l)}
              stroke={up ? "#EAC766" : "#6FA0FF"}
              strokeWidth="1"
              opacity="0.85"
            />
            <rect
              x={x}
              y={top}
              width={bodyW}
              height={bodyH}
              rx="1.5"
              fill={up ? "#EAC766" : "#3E7BFA"}
            />
          </g>
        );
      })}

      {/* Entry marker */}
      <circle cx={startX + 14 * spacing} cy={y(143)} r="3.5" fill="#33C285" stroke="#050812" strokeWidth="1.5" />
      <circle cx={startX + 14 * spacing} cy={y(180)} r="3.5" fill="#E8566A" stroke="#050812" strokeWidth="1.5" />
      <circle cx={startX + 40 * spacing} cy={y(103)} r="3.5" fill="#33C285" stroke="#050812" strokeWidth="1.5" />

      {/* Annotations */}
      <g>
        <rect x="40" y="46" width="100" height="26" rx="6" fill="rgba(12,14,19,0.9)" stroke="rgba(255,255,255,0.12)" />
        <text x="52" y="63" fontFamily="monospace" fontSize="11" fill="#EAC766">Resistance</text>
      </g>
      <g>
        <rect x="40" y="250" width="80" height="26" rx="6" fill="rgba(12,14,19,0.9)" stroke="rgba(255,255,255,0.12)" />
        <text x="52" y="267" fontFamily="monospace" fontSize="11" fill="#6FA0FF">Support</text>
      </g>
      <g>
        <rect x="380" y="120" width="70" height="26" rx="6" fill="rgba(12,14,19,0.9)" stroke="rgba(255,255,255,0.12)" />
        <text x="392" y="137" fontFamily="monospace" fontSize="11" fill="#33C285">Entry</text>
      </g>
      <g>
        <rect x="540" y="205" width="70" height="26" rx="6" fill="rgba(12,14,19,0.9)" stroke="rgba(255,255,255,0.12)" />
        <text x="552" y="222" fontFamily="monospace" fontSize="11" fill="#9BA3B0">Trend</text>
      </g>
    </svg>
  );
}

export default function AcademicsSection() {
  const pathname = usePathname();

  const [chatOpen, setChatOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div className="relative overflow-hidden bg-[#050812] text-[#EEF3F8]">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_top_right,rgba(59,158,255,0.13),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(240,180,41,0.08),transparent_55%),linear-gradient(180deg,rgba(8,11,24,0.9),#050812)]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(59,158,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(59,158,255,0.35)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent_80%)]" />

    

<main className="relative z-10 mx-auto max-w-[1240px] px-8 pb-20 pt-[150px] max-[720px]:px-5 max-[720px]:pt-[180px]"><section className="grid items-center gap-14 pb-32 lg:grid-cols-[1.05fr_1fr]">
            {/* LEFT */}
          <div>
            {/* Eyebrow pill */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-[rgba(201,162,39,0.16)] px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C9A227] shadow-[0_0_8px_2px_rgba(201,162,39,0.7)]" />
              <span className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-[#EAC766]">
                JM FINEX ACADEMY
              </span>
            </div>

            {/* Heading — single line, "Grow." in gold */}
            <h1 className="whitespace-nowrap font-display text-[clamp(1.6rem,5vw,4.4rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[#EEF3F8]">
              Learn. Trade. <span className="text-[#EAC766]">Grow.</span>
            </h1>

            {/* Lead paragraph */}
            <p className="mt-6 max-w-[520px] text-[1.05rem] leading-[1.7] text-[#8B98B0]">
              Build practical Forex trading knowledge, understand market
              behavior, develop disciplined strategies and become confident in
              analyzing the markets.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#tracks"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#F0B429] to-[#D4A017] px-6 py-3.5 font-semibold text-[#0A0E1A] shadow-[0_14px_32px_-14px_rgba(201,162,39,0.65)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-16px_rgba(201,162,39,0.8)]"
              >
                Start Learning
              </a>

              <a
                href="#about-academics"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.18] px-6 py-3.5 font-semibold text-[#EEF2F8] transition hover:-translate-y-0.5 hover:border-[#C9A227]"
              >
                View My Progress
              </a>
            </div>

            {/* Inline stats row */}
            <div className="mt-10 flex gap-10">
              {[
                ["8", "Structured courses"],
                ["72", "Practical lessons"],
                ["15", "Advanced concepts covered"],
              ].map(([value, label]) => (
                <div key={label} className="flex flex-col">
                  <strong className="font-display text-[1.6rem] font-bold leading-none text-[#EEF3F8]">
                    {value}
                  </strong>
                  <span className="mt-2 text-[0.82rem] text-[#5D6B85]">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — chart card */}
          <div className="relative overflow-hidden rounded-[18px] border border-white/[0.07] bg-gradient-to-b from-[#12141A] to-[#0C0E13] p-5 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.7)]">
            {/* Ambient glow */}
            <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_78%_18%,rgba(62,123,250,0.14),transparent_55%)]" />

            {/* Top bar */}
            <div className="relative mb-3.5 flex items-center justify-between">
              <span className="font-mono text-[12.5px] tracking-[0.04em] text-[#9BA3B0]">
                XAU/USD · 4H
              </span>
              <span className="font-mono text-[12.5px] text-[#33C285]">
                2,384.12
              </span>
            </div>

            {/* Chart */}
            <div className="relative overflow-hidden rounded-[14px] bg-black/25">
              <HeroChart />
            </div>

            {/* Legend */}
            <div className="relative mt-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-[11px] text-[#9BA3B0]">
                <span className="h-[9px] w-[9px] rounded-[2px] bg-[#C9A227]" />
                Support / Resistance
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-[#9BA3B0]">
                <span className="h-[9px] w-[9px] rounded-[2px] bg-[#3E7BFA]" />
                Market structure
              </div>
            </div>
          </div>
        </section>

<section id="tracks" className="pt-20 sm:pt-28 lg:pt-32">
            <div className="mb-7 flex items-end justify-between gap-5">
            <div>
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#3b9eff]">
                ACADEMY OVERVIEW
              </span>

              <h2 className="mt-2 font-display text-[clamp(1.7rem,3vw,2.35rem)] font-semibold text-[#EEF3F8]">
                Build your trading knowledge
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#8FA3B8]">
                Learn the fundamentals of Forex trading and gradually develop
                the skills required to analyze charts, understand market
                structure, manage risk and execute trades with discipline.
              </p>
            </div>
          </div>

          <div className="mb-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                num: "01",
                title: "Foundation",
                desc: "Build strong trading fundamentals with modern market structure understanding.",
              },
              {
                num: "02",
                title: "Smart Money Concepts",
                desc: "Master institutional order flow, liquidity pools, and SMC framework.",
              },
              {
                num: "03",
                title: "AI & Algorithmic Trading",
                desc: "Leverage AI tools and algorithmic execution for precision trading.",
              },
              {
                num: "04",
                title: "Advanced Risk Management",
                desc: "Protect capital with equity guards, ATR-based sizing, and regime-based controls.",
              },
            ].map((item) => (
              <div
                key={item.num}
                className="flex flex-col gap-3 bg-[#1B1E2D] px-[26px] py-[30px] transition-colors duration-300 hover:bg-[#222638]"
              >
                <span className="font-mono text-sm font-semibold text-[#F0B429]">
                  {item.num}
                </span>
                <h3 className="font-display text-lg font-semibold text-[#EEF3F8]">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#8B98B0]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

         <div className="pt-52">
  <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#3b9eff]">
    COURSE CATEGORIES
            </span>

            <h2 className="mt-3 font-display text-[clamp(1.75rem,3.2vw,2.6rem)] font-bold leading-[1.15] tracking-[-0.015em] text-[#EEF3F8]">
              Trading learning path
            </h2>

            <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-[#8FA3B8]">
              Follow a structured learning path designed to take you from
              fundamentals to practical market analysis.
            </p>
          </div>

          {/* ================== COURSE CARDS GRID ================== */}
<div className="pt-20 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {tracks.map(([Icon, title, description, lessons, color], index) => {
              const level = LEVEL_META[index] || {
                tag: "ALL LEVELS",
                cls: "bg-[rgba(51,194,133,0.12)] text-[#33C285]",
              };
              const ctaText = index === 2 ? "View Patterns" : "Start Course";

              return (
                <div
                  key={title}
                  role="button"
                  tabIndex={0}
                  aria-label={`Read summary: ${title}`}
                  onClick={() =>
                    setSelectedArticle({
                      Icon,
                      title,
                      description,
                      lessons,
                      color,
                    })
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedArticle({
                        Icon,
                        title,
                        description,
                        lessons,
                        color,
                      });
                    }
                  }}
                  className="group flex cursor-pointer flex-col gap-2 rounded-[18px] border border-white/[0.07] bg-[#12141A] p-[26px] transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.12] hover:shadow-[0_20px_40px_-22px_rgba(0,0,0,0.65)]"
                >
                  {/* Top row: index + level tag */}
                  <div className="flex items-start justify-between gap-2.5">
                    <span className="font-mono text-[11px] text-[#5D6472]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 font-mono text-[10px] tracking-wider whitespace-nowrap ${level.cls}`}
                    >
                      {level.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-[18px] font-bold leading-tight tracking-[-0.005em] text-[#F2F3F6]">
                    {title}
                  </h3>

                  {/* Description */}
                  <p className="flex-1 text-[13.5px] leading-relaxed text-[#9BA3B0]">
                    {description}
                  </p>

                  {/* Bottom CTA row */}
                  <div className="flex items-center justify-between border-t border-white/[0.07] pt-3.5 text-[13px] font-semibold text-[#F2F3F6]">
                    <span>{ctaText}</span>
                    <span className="text-[#C9A227] transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* ================== END COURSE CARDS GRID ================== */}


        </section>
      </main>

      {/* ARTICLE MODAL */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#050812]/[0.82] p-5 backdrop-blur-md"
          role="presentation"
          onClick={() => setSelectedArticle(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="article-modal-title"
            onClick={(event) => event.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-[720px] overflow-y-auto rounded-[24px] border border-white/[0.14] bg-[#171B2A] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.5)] max-[640px]:p-5"
          >
            <button
              type="button"
              aria-label="Close article summary"
              onClick={() => setSelectedArticle(null)}
              className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-white/[0.14] text-[#8B98B0] transition hover:border-[#F0B429] hover:text-[#F0B429]"
            >
              <X size={18} />
            </button>

            <div
              className="grid h-14 w-14 place-items-center rounded-full border-2 bg-[#111827]"
              style={{
                borderColor: selectedArticle.color,
                color: selectedArticle.color,
              }}
            >
              <selectedArticle.Icon size={24} />
            </div>

            <span className="mt-6 inline-block rounded-r-md bg-[#7650A6] px-3 py-1 text-xs font-semibold text-white">
              JMFinex Academics
            </span>

            <h2
              id="article-modal-title"
              className="mt-5 pr-10 font-display text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-[1.15] text-[#EEF3F8]"
            >
              {selectedArticle.title}
            </h2>

            <div className="mt-4 flex items-center gap-2 text-sm text-[#8B98B0]">
              <CheckCircle2
                size={16}
                style={{ color: selectedArticle.color }}
              />
              {selectedArticle.lessons}
              <span className="mx-1 text-[#5D6B85]">|</span>
              Beginner-friendly overview
            </div>

            <div className="mt-7 space-y-6 text-[1.05rem] leading-[1.9] text-[#D6DCE6]">
              {getArticleParagraphs(selectedArticle).map((paragraph, index) => (
                <p key={`${selectedArticle.title}-${index}`}>
                  {index === 0 ? (
                    <>
                      <strong style={{ color: selectedArticle.color }}>
                        {selectedArticle.title.split(":")[0]}
                      </strong>{" "}
                      {paragraph}
                    </>
                  ) : (
                    paragraph
                  )}
                </p>
              ))}
            </div>

            <div className="mt-7 border-t border-white/[0.1] pt-6">
              <h3 className="font-display text-lg font-semibold text-[#EEF3F8]">
                What you will learn
              </h3>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {(
                  articleContent[selectedArticle.title]?.points || [
                    "Core concepts",
                    "Practical examples",
                    "Market context",
                    "Risk awareness",
                  ]
                ).map((point) => (
                  <div
                    key={point}
                    className="flex items-center gap-2 border border-white/[0.1] bg-white/[0.035] p-3 text-sm text-[#C9D0DC]"
                  >
                    <CheckCircle2
                      size={15}
                      style={{ color: selectedArticle.color }}
                    />
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Outcomes */}
<section id="skills" className="relative pt-40 pb-[120px] max-[900px]:pt-32 max-[900px]:pb-[84px]">
    <div className="mx-auto max-w-[1240px] px-8 max-[720px]:px-5">
    {/* Section header */}
    <div className="mb-12">
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#3b9eff]">
        OUTCOMES
      </span>
      <h2 className="mt-3 font-display text-[clamp(1.75rem,3.2vw,2.6rem)] font-bold leading-[1.15] tracking-[-0.015em] text-[#EEF3F8]">
        What you will learn
      </h2>
      <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-[#8FA3B8]">
        By the end of the academy path, you&apos;ll be able to approach the
        market with a repeatable, disciplined process.
      </p>
    </div>

    {/* Skills grid */}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {skills.map((skill) => (
        <div
          key={skill}
          className="flex items-start gap-3 rounded-[14px] border border-white/[0.06] bg-[#0F1119] p-5 transition-colors duration-200 hover:border-white/[0.12]"
        >
          <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-md border border-[#C9A227]/[0.4] bg-[rgba(201,162,39,0.16)] text-[13px] leading-none text-[#EAC766]">
            ✓
          </span>
          <span className="pt-0.5 text-[13.5px] leading-[1.45] text-[#F2F3F6]">
            {skill}
          </span>
        </div>
      ))}
    </div>
  </div>

           {/* ==================== FOREX MARKET STRUCTURE ==================== */}
<section
  id="market-structure"
  className="relative pt-40 pb-[120px] max-[900px]:pt-32 max-[900px]:pb-[84px]"
>
  <div className="mx-auto max-w-[1240px] px-8 max-[720px]:px-5">

    {/* Section header */}
    <div className="mb-12 max-w-[820px]">
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#3b9eff]">
        FOUNDATIONS
      </span>
      <h2 className="mt-3 font-display text-[clamp(1.75rem,3.2vw,2.6rem)] font-bold leading-[1.15] tracking-[-0.015em] text-[#EEF3F8]">
        How is the forex market structured?
      </h2>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-[#8FA3B8]">
        You can think of the forex market as a network of connected
        participants, not one single marketplace. At the institutional level,
        large banks and financial institutions trade currencies with one
        another — these institutions provide liquidity and facilitate
        transactions for other participants.
      </p>
    </div>

    <div className="grid gap-x-16 gap-y-14 lg:grid-cols-2">

      {/* ---------- Column 1 ---------- */}
      <div className="flex flex-col gap-14">

        {/* Market structure */}
        <div>
          <h3 className="mb-4 font-display text-[1.05rem] font-semibold text-[#EEF3F8]">
            Modern market structure
          </h3>
          <p className="mb-4 text-[0.95rem] leading-[1.8] text-[#8FA3B8]">
            In 2025, the Forex market structure has evolved with the rise of algorithmic trading, AI-powered analysis, and fragmented central bank policies. Below the institutional layer sit brokers and other financial intermediaries that provide retail traders with access to the forex market.
          </p>
          <p className="mb-4 font-mono text-[13px] leading-[1.9] text-[#EAC766]">
            Central Banks &amp; Governments → Large Banks &amp; Institutions →
            Liquidity Providers / HFT Firms → AI-Powered Brokers → Retail Traders
          </p>
          <p className="text-[0.95rem] leading-[1.8] text-[#8FA3B8]">
            This modern structure includes high-frequency trading firms and AI-powered execution systems that have changed how liquidity is provided and consumed. Understanding this evolved structure matters because algorithmic participants now account for over 50% of daily volume in major currency pairs.
          </p>
        </div>

        {/* Mechanics */}
        <div>
          <h3 className="mb-4 font-display text-[1.05rem] font-semibold text-[#EEF3F8]">
            What are forex market mechanics?
          </h3>
          <p className="mb-4 text-[0.95rem] leading-[1.8] text-[#8FA3B8]">
            Market mechanics describe how buying and selling actually takes
            place, and how orders contribute to price movements. Whenever
            someone wants to buy a currency pair, there must be a seller
            willing to take the other side of the transaction. The interaction
            between buyers and sellers helps determine the available market
            price.
          </p>
          <p className="text-[0.95rem] leading-[1.8] text-[#8FA3B8]">
            For example, consider EUR/USD. If you believe the euro will
            strengthen against the US dollar, you may buy EUR/USD. If another
            trader expects the euro to weaken, they may sell EUR/USD. When
            buying and selling changes, the market price can change.
          </p>
        </div>

        {/* Liquidity */}
        <div>
          <h3 className="mb-4 font-display text-[1.05rem] font-semibold text-[#EEF3F8]">
            What is liquidity in forex?
          </h3>
          <p className="mb-4 text-[0.95rem] leading-[1.8] text-[#8FA3B8]">
            Liquidity refers to how easily an asset can be bought or sold
            without causing a significant change in its price. The forex
            market is generally considered one of the world&apos;s most liquid
            financial markets, as major currency pairs such as EUR/USD,
            GBP/USD, and USD/JPY usually have significant trading activity.
          </p>
          <p className="mb-4 text-[0.95rem] leading-[1.8] text-[#8FA3B8]">
            Imagine a market where thousands of buyers and sellers are seeking
            to trade an asset. If you want to buy, there may be plenty of
            sellers available. If you want to sell, there may be plenty of
            buyers available. This is a liquid market.
          </p>
          <p className="text-[0.95rem] leading-[1.8] text-[#8FA3B8]">
            Now imagine a market with very few buyers and sellers. Executing a
            large order may cause the price to move substantially. That market
            would have lower liquidity.
          </p>
        </div>
      </div>

      {/* ---------- Column 2 ---------- */}
      <div className="flex flex-col gap-14">

        {/* Order types */}
        <div>
          <h3 className="mb-4 font-display text-[1.05rem] font-semibold text-[#EEF3F8]">
            How do orders affect the market?
          </h3>
          <p className="mb-6 text-[0.95rem] leading-[1.8] text-[#8FA3B8]">
            There are many types of orders a forex trader can use. Three of
            the most common are market, limit, and stop orders.
          </p>

          <div className="flex flex-col gap-6">
            <div>
              <h4 className="mb-1.5 font-display text-[14.5px] font-semibold text-[#EEF3F8]">
                Market Orders
              </h4>
              <p className="text-[14px] leading-[1.75] text-[#8FA3B8]">
                Attempts to buy or sell at the best price available right now.
                If EUR/USD is trading around 1.1000 and you place a market buy
                order, your trade may execute around the available price at
                that moment.
              </p>
            </div>

            <div>
              <h4 className="mb-1.5 font-display text-[14.5px] font-semibold text-[#EEF3F8]">
                Limit Orders
              </h4>
              <p className="text-[14px] leading-[1.75] text-[#8FA3B8]">
                Placed at a specific price or better. If EUR/USD is currently
                trading at 1.1000 but you want to buy at 1.0950, you could
                place a buy limit order around that level.
              </p>
            </div>

            <div>
              <h4 className="mb-1.5 font-display text-[14.5px] font-semibold text-[#EEF3F8]">
                Stop Orders
              </h4>
              <p className="text-[14px] leading-[1.75] text-[#8FA3B8]">
                Becomes active when the market reaches a specified price.
                Traders commonly use stop orders for entries or to manage
                risk. The interaction of these orders contributes to the
                continuous process of price discovery.
              </p>
            </div>
          </div>
        </div>

        {/* Takeaways */}
        <div>
          <h3 className="mb-4 font-display text-[1.05rem] font-semibold text-[#EEF3F8]">
            Key takeaways for beginners
          </h3>
          <p className="mb-6 text-[0.95rem] leading-[1.8] text-[#8FA3B8]">
            If you are seeking to start your career in forex trading, here are
            a few essential things to remember.
          </p>

          <div className="flex flex-col gap-5">
            {[
              ["Market Structure", "Forex is a decentralized global market made up of different participants and liquidity venues."],
              ["Market Mechanics", "Prices change through the interaction of orders, liquidity, supply, demand, and market expectations."],
              ["Major Participants", "Central banks, commercial banks, investment firms, corporations, governments, brokers, and retail traders all participate in the forex ecosystem."],
              ["Liquidity", "How easily transactions can take place without significantly affecting price. It can influence spreads, execution, and volatility."],
              ["Market Makers", "Provide buy and sell quotes and help facilitate trading by supplying liquidity, while managing their own market and inventory risks."],
            ].map(([t, d]) => (
              <div key={t}>
                <span className="font-display text-[14px] font-semibold text-[#EAC766]">
                  {t}
                </span>
                <p className="mt-1 text-[14px] leading-[1.75] text-[#8FA3B8]">
                  {d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- Final Thoughts (full width, single flow) ---------- */}
      <div className="lg:col-span-2 lg:border-t lg:border-white/[0.06] lg:pt-14">
        <h3 className="mb-4 font-display text-[1.05rem] font-semibold text-[#EEF3F8]">
          Final thoughts
        </h3>

        <p className="mb-4 max-w-[900px] text-[0.95rem] leading-[1.8] text-[#8FA3B8]">
          Understanding forex market structure, market mechanics, major
          participants, liquidity, and market makers gives beginners a clearer
          picture of what happens behind the charts. Forex trading is not
          simply about identifying a buy or sell signal. Behind every price
          movement is a complex interaction between participants, orders,
          liquidity, economic information, expectations, and risk.
        </p>

        <p className="max-w-[900px] text-[0.95rem] leading-[1.8] text-[#8FA3B8]">
          Once you understand these fundamentals, concepts such as price
          action, market structure, liquidity zones, spreads, order execution,
          and institutional trading become much easier to follow. However,
          knowledge of market structure alone does not guarantee profitable
          trading. Forex trading involves significant risk, and beginners
          should focus on education, proper risk management, and disciplined
          decision-making before taking a real trade.
        </p>
      </div>

    </div>
  </div>
</section>


</section>

{/* PATTERN RECOGNITION */}
<section
  id="patterns"
  className="relative pt-40 pb-[120px] max-[900px]:pt-32 max-[900px]:pb-[84px]"
>
  <div className="mx-auto max-w-[1240px] px-8 max-[720px]:px-5">
    {/* Section header */}
    <div className="mb-12 max-w-[640px]">
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#3b9eff]">
        PATTERN RECOGNITION
      </span>
      <h2 className="mt-3 font-display text-[clamp(1.75rem,3.2vw,2.6rem)] font-bold leading-[1.15] tracking-[-0.015em] text-[#EEF3F8]">
        Chart pattern library
      </h2>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-[#8FA3B8]">
        Recurring price formations that traders watch for signs of reversal,
        continuation or an undecided market. Each shape is a summary of the
        ongoing balance between buyers and sellers.
      </p>
    </div>

    {/* Pattern grid — all rendered at once */}
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {PATTERNS.map((p) => (
        <div
          key={p.id}
          className="flex flex-col overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#12141A] transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.12] hover:shadow-[0_20px_40px_-22px_rgba(0,0,0,0.65)]"
        >
          {/* Visual */}
          <div className="relative h-[150px] border-b border-white/[0.07] bg-black/[0.24]">
            <PatternDiagram pattern={p} />
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col gap-3 p-[22px]">
            <div className="flex items-center justify-between gap-2.5">
              <h3 className="font-display text-[16px] font-bold tracking-[-0.005em] text-[#F2F3F6]">
                {p.title}
              </h3>
              <span
                className={`rounded-full px-2.5 py-1 font-mono text-[9.5px] tracking-wider whitespace-nowrap ${
                  p.bias === "bull"
                    ? "bg-[rgba(201,162,39,0.16)] text-[#EAC766]"
                    : p.bias === "bear"
                    ? "bg-[rgba(62,123,250,0.14)] text-[#6FA0FF]"
                    : "bg-white/[0.06] text-[#9BA3B0]"
                }`}
              >
                {p.tag}
              </span>
            </div>
            <p className="text-[13px] leading-relaxed text-[#9BA3B0]">
              {p.desc}
            </p>
          </div>
        </div>
      ))}
    </div>

    {/* Note */}
    <div className="mt-8 rounded-[14px] border border-white/[0.07] bg-[#0C0E13] p-5 text-[12.5px] leading-relaxed text-[#9BA3B0]">
      <b className="text-[#F2F3F6]">
        Patterns describe historical tendencies, not guarantees.
      </b>{" "}
      Treat a pattern as a reason to watch a level closely, not as a signal to
      enter without a plan — always confirm the breakout and define your risk
      first.
    </div>
  </div>
</section>



{/* APPLIED LEARNING */}
<section
  id="practice"
  className="relative pt-40 pb-[120px] max-[900px]:pt-32 max-[900px]:pb-[84px]"
>
  <div className="mx-auto max-w-[1240px] px-8 max-[720px]:px-5">
    {/* Section header */}
    <div className="mb-12 max-w-[640px]">
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#3b9eff]">
        APPLIED LEARNING
      </span>
      <h2 className="mt-3 font-display text-[clamp(1.75rem,3.2vw,2.6rem)] font-bold leading-[1.15] tracking-[-0.015em] text-[#EEF3F8]">
        Learn through practice
      </h2>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-[#8FA3B8]">
        Every concept is paired with a live example, so theory turns into a
        repeatable trade setup you can recognize on a real chart.
      </p>
    </div>

    {/* Practice layout */}
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
      {/* Chart panel */}
      <div className="relative overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#12141A] p-[22px]">
        <div className="relative z-10 mb-3.5 flex items-center justify-between">
          <span className="font-mono text-[12.5px] tracking-[0.04em] text-[#9BA3B0]">
            EUR/USD · 1H
          </span>
          <span className="rounded-full border border-white/[0.12] px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] text-[#9BA3B0]">
            ANALYSIS MODE
          </span>
        </div>
        <div className="relative z-10 h-[320px] overflow-hidden rounded-[14px] bg-black/25">
          <PracticeChart />
        </div>
      </div>

      {/* Setup panel */}
      <div className="relative overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#12141A] p-6">
        <div className="mb-4 font-mono text-[11.5px] tracking-[0.12em] text-[#5D6472]">
          TRADE SETUP
        </div>

        {[
          { k: "Market", v: "EUR/USD" },
          { k: "Direction", v: "BUY", badge: true },
          { k: "Entry", v: "1.0842" },
          { k: "Stop Loss", v: "1.0812", color: "#E8566A" },
          { k: "Take Profit", v: "1.0902", color: "#33C285" },
          { k: "Risk / Reward", v: "1 : 2", color: "#EAC766" },
        ].map((row) => (
          <div
            key={row.k}
            className="flex items-center justify-between border-b border-white/[0.07] py-3 last:border-b-0"
          >
            <span className="text-[13px] text-[#9BA3B0]">{row.k}</span>
            {row.badge ? (
              <span className="rounded-md bg-[rgba(51,194,133,0.14)] px-2.5 py-1 font-mono text-[11px] tracking-[0.06em] text-[#33C285]">
                {row.v}
              </span>
            ) : (
              <span
                className="font-mono text-[13.5px] font-semibold"
                style={{ color: row.color || "#F2F3F6" }}
              >
                {row.v}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
</section>


{/* PROGRESS */}
<section
  id="progress"
  className="relative pt-40 pb-[120px] max-[900px]:pt-32 max-[900px]:pb-[84px]"
>
  <div className="mx-auto max-w-[1240px] px-8 max-[720px]:px-5">
    {/* Section header */}
    <div className="mb-12 max-w-[640px]">
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#3b9eff]">
        YOUR PROGRESS
      </span>
      <h2 className="mt-3 font-display text-[clamp(1.75rem,3.2vw,2.6rem)] font-bold leading-[1.15] tracking-[-0.015em] text-[#EEF3F8]">
        Track your progress
      </h2>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-[#8FA3B8]">
        Pick up where you left off — every completed lesson moves you closer to
        trading with a defined process.
      </p>
    </div>

    {/* Progress panel */}
    <div className="grid grid-cols-1 gap-9 rounded-[18px] border border-white/[0.07] bg-gradient-to-b from-[#12141A] to-[#0C0E13] p-10 max-[560px]:p-7 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.3fr]">
      {/* Metric 1 */}
      <div>
        <span className="block text-[12px] text-[#5D6472]">
          Courses Completed
        </span>
        <b className="mt-1 block font-display text-[26px] font-bold text-[#F2F3F6]">
          5 / 8
        </b>
      </div>

      {/* Metric 2 */}
      <div>
        <span className="block text-[12px] text-[#5D6472]">
          Lessons Completed
        </span>
        <b className="mt-1 block font-display text-[26px] font-bold text-[#F2F3F6]">
          48 / 72
        </b>
      </div>

      {/* Metric 3 */}
      <div>
        <span className="block text-[12px] text-[#5D6472]">
          Practice Exercises
        </span>
        <b className="mt-1 block font-display text-[26px] font-bold text-[#F2F3F6]">
          24
        </b>
      </div>

      {/* Metric 4 + bar */}
      <div>
        <span className="text-[12px] text-[#5D6472]">Academy Progress</span>
        <b className="mt-1 block font-display text-[22px] font-bold text-[#F2F3F6]">
          72%
        </b>
        <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#C9A227] to-[#EAC766]"
            style={{ width: "72%" }}
          />
        </div>
      </div>
    </div>
  </div>
</section>

{/* final cta */}
<section className="relative pt-40 pb-[110px] max-[900px]:pt-32 max-[900px]:pb-[84px]">
  <div className="mx-auto max-w-[620px] px-8 text-center max-[720px]:px-5">
    <h2 className="font-display text-[clamp(28px,4vw,42px)] font-bold leading-[1.15] tracking-[-0.02em] text-[#EEF3F8]">
      Build knowledge before you build positions
    </h2>

    <p className="mx-auto mb-9 mt-5 max-w-[520px] text-[15.5px] leading-[1.7] text-[#8B98B0]">
      Develop the skills, discipline and market understanding required to
      approach trading with a structured process.
    </p>

    <a
      href="#courses"
      className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[#F0B429] to-[#D4A017] px-7 py-3.5 text-[0.9rem] font-semibold text-[#0A0E1A] shadow-[0_14px_32px_-14px_rgba(201,162,39,0.65)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-16px_rgba(201,162,39,0.8)]"
    >
      Explore Academy
    </a>
  </div>
</section>


     

      {/* FLOATING CHAT */}
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
              role="menuitem"
              aria-label="Contact us on WhatsApp"
              className="flex items-center gap-2.5 rounded-full border border-[#25D366]/[0.45] bg-[#10251A] px-3.5 py-2.5 text-[0.85rem] font-semibold text-[#EEF3F8] shadow-[0_8px_25px_rgba(0,0,0,0.3)] transition hover:-translate-y-0.5 hover:bg-[#163822]"
            >
              <FaWhatsapp size={18} className="text-[#25D366]" />
              WhatsApp
            </a>

            <a
              href="https://t.me/share/url?text=Learn%20more%20about%20JMFinex%20Academics"
              target="_blank"
              rel="noreferrer"
              role="menuitem"
              aria-label="Share on Telegram"
              className="flex items-center gap-2.5 rounded-full border border-[#229ED9]/[0.45] bg-[#102331] px-3.5 py-2.5 text-[0.85rem] font-semibold text-[#EEF3F8] shadow-[0_8px_25px_rgba(0,0,0,0.3)] transition hover:-translate-y-0.5 hover:bg-[#153449]"
            >
              <FaTelegramPlane size={18} className="text-[#229ED9]" />
              Telegram
            </a>
          </div>
        )}

        <button
          type="button"
          onClick={() => setChatOpen((isOpen) => !isOpen)}
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
  );
}