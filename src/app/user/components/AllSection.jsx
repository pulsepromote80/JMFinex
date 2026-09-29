"use client";

import { useState, useEffect, useRef } from "react";
import TradingViewWidget from "./Tradeview";
import TradingViewTicker from "./TradingViewTicker";
import TradingViewHeatmap from "./TradingViewHeatMap";

const card = "rounded-2xl border border-[rgba(120,160,220,0.16)] bg-[rgba(15,22,45,0.6)]";
const grad = "bg-gradient-to-r from-[#3B9EFF] to-[#F0B429] bg-clip-text text-transparent";

function useInView() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setSeen(true);
        io.disconnect();
      }
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
}

// fade + slide up when scrolled into view
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, seen] = useInView();
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`rv transition-all duration-700 ease-out ${seen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} ${className}`}>
      {children}
    </div>
  );
}

// number counts up when visible
function Counter({ to, suffix = "", decimals = 0 }) {
  const [ref, seen] = useInView();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!seen) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / 1600, 1);
      setVal(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to]);
  return <span ref={ref}>{val.toFixed(decimals)}{suffix}</span>;
}

// card with a spotlight that follows the mouse
function Spot({ children, className = "" }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div onMouseMove={onMove} className={`group relative overflow-hidden ${className}`}>
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(260px_circle_at_var(--mx,50%)_var(--my,50%),rgba(59,158,255,0.18),transparent_70%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}

function Heading({ kicker, title, text, center }) {
  return (
    <Reveal className={`mb-12 max-w-[640px] ${center ? "mx-auto text-center" : ""}`}>
      <p className="mb-3 flex items-center gap-3 text-sm font-medium text-[#F0B429]">
        <span className="h-px w-8 bg-gradient-to-r from-[#F0B429] to-transparent" />
        {kicker}
      </p>
      <h2 className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold leading-[1.15] text-[#EEF2F8]">{title}</h2>
      {text && <p className="mt-4 leading-[1.65] text-[#8B98B0]">{text}</p>}
    </Reveal>
  );
}

export default function AllSection() {
  const [aiSignalConfidence, setAiSignalConfidence] = useState(87.3);
  const [selectedSymbol, setSelectedSymbol] = useState("TVC:GOLD");
  const [pageLoading, setPageLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [faqOpen, setFaqOpen] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? window.scrollY / h : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const symbols = [
    { name: "GOLD / USD", symbol: "TVC:GOLD" },
    { name: "SOL / USD", symbol: "BINANCE:SOLUSDT" },
    { name: "ETH / USD", symbol: "BINANCE:ETHUSDT" },
    { name: "BTC / USD", symbol: "BINANCE:BTCUSDT" },
    { name: "XRP / USD", symbol: "BINANCE:XRPUSDT" },
    { name: "ADA / USD", symbol: "BINANCE:ADAUSDT" },
    { name: "DOGE / USD", symbol: "BINANCE:DOGEUSDT" },
    { name: "MATIC / USD", symbol: "BINANCE:MATICUSDT" },
    { name: "DOT / USD", symbol: "BINANCE:DOTUSDT" },
    { name: "LINK / USD", symbol: "BINANCE:LINKUSDT" },
    { name: "BNB / USD", symbol: "BINANCE:BNBUSDT" },
    { name: "AVAX / USD", symbol: "BINANCE:AVAXUSDT" },
    { name: "LTC / USD", symbol: "BINANCE:LTCUSDT" },
    { name: "UNI / USD", symbol: "BINANCE:UNIUSDT" },
    { name: "ATOM / USD", symbol: "BINANCE:ATOMUSDT" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAiSignalConfidence((prev) => {
        const v = Math.max(75, Math.min(95, prev + (Math.random() - 0.5) * 2));
        return Math.round(v * 10) / 10;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setPageLoading(false), 100);
    return () => clearTimeout(t);
  }, []);

  if (pageLoading) {
    return (
       <div className="fixed inset-0 z-[9999] m-0 p-0 flex items-center justify-center bg-[#040d22]">
        <div className="text-center">
         <div className="relative mx-auto mb-5 flex h-[90px] w-[90px] items-center justify-center">
           <div className="absolute inset-0 rounded-full border border-[rgba(86,166,255,0.20)] shadow-[inset_0_0_14px_rgba(86,166,255,0.08)]" />

           <div className="absolute inset-[8px] rounded-full border-[2px] border-transparent border-t-[#5dc8ff] border-r-[#7ea6ff] animate-[spin_1.6s_linear_infinite] shadow-[0_0_14px_rgba(93,200,255,0.22)]" />

           <div className="absolute inset-[18px] rounded-full border-[2px] border-transparent border-b-[#d4a633] border-l-[#5aaef7] animate-[spinReverse_1.8s_linear_infinite] shadow-[0_0_12px_rgba(212,166,51,0.22)]" />

           <div className="absolute left-1/2 top-[18px] h-[9px] w-[9px] -translate-x-1/2 rounded-full bg-[linear-gradient(135deg,#f8dc85_0%,#d4a633_100%)] shadow-[0_0_18px_rgba(248,220,133,0.85)]" />
         </div>

         <div className="text-[12px] font-bold tracking-[0.28rem] text-[#9ab7ff] uppercase drop-shadow-[0_0_12px_rgba(126,160,255,0.38)]">
           LOADING
         </div>

         <div className="mt-3 flex justify-center gap-2">
            <div className="h-2 w-2 animate-[dotPulse_1.2s_ease-in-out_0s_infinite] rounded-full bg-[#60c5ff] shadow-[0_0_10px_rgba(96,197,255,0.8)]"></div>
            <div className="h-2 w-2 animate-[dotPulse_1.2s_ease-in-out_0.18s_infinite] rounded-full bg-[#7aaeff] shadow-[0_0_10px_rgba(122,174,255,0.8)]"></div>
            <div className="h-2 w-2 animate-[dotPulse_1.2s_ease-in-out_0.36s_infinite] rounded-full bg-[#d4a633] shadow-[0_0_10px_rgba(212,166,51,0.8)]"></div>
          </div>
        </div>
       <style jsx global>{`
           @keyframes spin {
             to { transform: rotate(360deg); }
           }
           @keyframes spinReverse {
             to { transform: rotate(-360deg); }
           }
           @keyframes dotPulse {
             0%, 100% { transform: translateY(0); opacity: 0.5; }
             50% { transform: translateY(-4px); opacity: 1; }
           }
         `}</style>
       </div>
    );
   }
  const services = [
    ["Forex Technology", "Insights across major, minor and selected exotic pairs.", "/2.png", "md:col-span-2 md:row-span-2"],
    ["AI Market Intelligence", "AI-assisted signals, trend analysis and real-time pattern detection.", "/1main.png", ""],
    ["Digital Asset Analytics", "Transparent pricing, market depth and consolidated data.", "/3main.png", ""],
    ["Portfolio Monitoring", "Allocation, performance and activity on one dashboard.", "/4.png", ""],
    ["Automated Execution", "Rules and workflows that act on market conditions consistently.", "/5.png", ""],
    ["Secure Infrastructure", "Security layers for data, user access and platform operations.", "/6.png", "md:col-span-2"],
  ];

  const tabs = [
    { name: "Analytics", title: "See the signals behind the movement.", desc: "Charting and AI-assisted intelligence turn complex price activity into clear insights.", list: ["AI trend and momentum detection", "Volatility and sentiment overlays", "Multi-asset market comparison"], img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=85" },
    { name: "Automation", title: "Let your systems work consistently.", desc: "Set rules-based workflows that monitor markets and run predefined actions.", list: ["Custom strategy rules", "Automated alerts and monitoring", "Workflow-based execution logic"], img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=85" },
    { name: "Market Heatmap", title: "Visualize market movements at a glance.", desc: "Real-time percentage changes across major forex pairs show currency strength and weakness.", list: ["Real-time currency performance", "Strength and weakness indicators", "Multi-currency correlation view"], img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=85" },
    { name: "Security", title: "Designed with protection in mind.", desc: "Layered security protects account access, data pipelines and platform communication.", list: ["Encrypted data communication", "Protected account access", "Transparent system monitoring"], img: "https://images.unsplash.com/photo-1573166364518-8d9e8c090a0e?auto=format&fit=crop&w=1000&q=85" },
  ];

  const faqs = [
    ["What is JMFinex?", "JMFinex is a technology platform that provides AI-assisted analytics, automation tooling and market data infrastructure for forex and digital asset markets."],
    ["What markets does the platform cover?", "Major forex pairs and widely-traded digital assets, kept in sync through a global network of data nodes."],
    ["How does the AI engine work?", "Models analyze historical and live price structure to find trend, momentum and volatility patterns, shown as indicators in the dashboard."],
    ["How is my data and access secured?", "Encrypted data pipelines, segregated wallet architecture and standard account-security practices such as verified login and session monitoring."],
    ["Can I use automation without AI signals?", "Yes. Automation rules work independently, with or without AI indicators layered on top."],
    ["Is performance guaranteed?", "No. JMFinex provides technology and tools only. Trading involves risk and no return is guaranteed. See our Risk Disclosure."],
  ];

  const t = tabs[tab];

  return (
    <div className="relative overflow-x-clip bg-[#040d22] text-[#EEF2F8]">
      <style jsx global>{`
        html { scroll-behavior: smooth; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
        @keyframes floaty { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes floatRot { 0%, 100% { transform: translateY(0) rotate(-8deg); } 50% { transform: translateY(-18px) rotate(8deg); } }
        @keyframes draw { 0% { stroke-dashoffset: 260; } 60%, 100% { stroke-dashoffset: 0; } }
        @keyframes shimmer { to { background-position: 200% center; } }
        @keyframes blob { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(60px, 40px) scale(1.15); } }
        @keyframes marquee { to { transform: translateX(-50%); } }
        @keyframes ping2 { 0% { transform: scale(1); opacity: 0.7; } 100% { transform: scale(2.6); opacity: 0; } }
        @keyframes glowPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(240,180,41,0.45); } 50% { box-shadow: 0 0 34px 6px rgba(240,180,41,0.28); } }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; transition: none !important; }
          .hi, .rv { opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      {/* drifting color blobs */}
      <div className="pointer-events-none fixed -left-40 top-20 z-0 h-[520px] w-[520px] rounded-full bg-[#3B9EFF]/[0.14] blur-[110px] animate-[blob_16s_ease-in-out_infinite]" />
      <div className="pointer-events-none fixed -right-40 top-[45%] z-0 h-[480px] w-[480px] rounded-full bg-[#F0B429]/[0.10] blur-[110px] animate-[blob_20s_ease-in-out_infinite_reverse]" />

      {/* background: static grid + two glows (no video) */}
      <div className="pointer-events-none fixed inset-0 z-0 [background:radial-gradient(ellipse_at_top,rgba(59,158,255,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(240,180,41,0.07),transparent_60%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 [background-image:linear-gradient(rgba(59,158,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,158,255,0.05)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black_20%,transparent_75%)]" />

     

      <main id="top" className="relative z-10 scroll-smooth">
        {/* HERO: centered headline, live chart directly underneath */}
        <section className="relative mx-auto w-full px-5 pb-16 pt-[60px] md:px-8" style={{ backgroundImage: "url(/banner-img.jpg)", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
          <div className="absolute inset-0 bg-[#040d22]/80 backdrop-blur-sm" />
          <div className="relative z-10 mx-auto max-w-[820px] text-center" style={{ padding: "60px 40px" }}>
            <p className="hi mb-5 inline-flex items-center gap-2.5 rounded-full border border-[rgba(240,180,41,0.35)] bg-[#F0B429]/[0.08] px-4 py-1.5 text-sm text-[#F0B429] opacity-0 animate-[fadeUp_0.8s_ease-out_0.1s_forwards]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-[#F0B429] animate-[ping2_1.8s_ease-out_infinite]" />
                <span className="relative h-2 w-2 rounded-full bg-[#F0B429]" />
              </span>
              AI-powered trading technology
            </p>
            <h1 className="hi text-[clamp(2.6rem,6vw,4.6rem)] font-semibold leading-[1.05] tracking-tight opacity-0 animate-[fadeUp_0.9s_ease-out_0.25s_forwards]">
              Learn. Trade. Grow{" "}
              <span className="bg-[linear-gradient(90deg,#3B9EFF,#F0B429,#3B9EFF)] bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_5s_linear_infinite]">Smarter.</span>
            </h1>
            <p className="hi mx-auto mt-6 max-w-[600px] text-lg leading-[1.6] text-[#8B98B0] opacity-0 animate-[fadeUp_0.9s_ease-out_0.4s_forwards]">
              JMFinex brings AI analytics, automated infrastructure and real-time global market data into one secure platform.
            </p>
            <div className="hi mt-5 flex flex-wrap justify-center gap-2 opacity-0 animate-[fadeUp_0.9s_ease-out_0.55s_forwards]">
              <a href="/user/register" className="animate-[glowPulse_2.6s_ease-in-out_infinite] rounded-xl bg-gradient-to-br from-[#F0B429] to-[#D4A017] px-8 py-3.5 font-semibold text-[#0A0E1A] transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(240,180,41,.55)]">
                Explore Platform
              </a>
              <a href="/user/login" className="rounded-xl border border-white/[0.22] px-8 py-3.5 font-semibold transition hover:border-[#F0B429] hover:bg-[#F0B429]/[0.12]">
                Sign in
              </a>
            </div>
          </div>

          <div className="mx-auto  grid max-w-[720px] grid-cols-3 divide-x divide-[rgba(120,160,220,0.16)] text-center">
            {[[15, "+", 0, "Markets tracked"], [24, "/7", 0, "Live market sync"], [99.9, "%", 1, "Uptime"]].map(([n, s, d, l]) => (
              <div key={l} className="px-3">
                <p className="text-2xl font-semibold md:text-3xl"><Counter to={n} suffix={s} decimals={d} /></p>
                <p className="mt-1 text-xs text-[#5D6B85] md:text-sm">{l}</p>
              </div>
            ))}
          </div>

          {/* Console */}
          <div className="relative z-10">
          <div className="pointer-events-none absolute -inset-x-10 -top-10 bottom-10 -z-10 [background:radial-gradient(ellipse_at_center,rgba(59,158,255,0.18),transparent_65%)]" />
          {/* floating coins */}
          {[
            ["₿", "-left-9 top-[18%]", "6s", "0s", "from-[#F0B429] to-[#D4A017] text-[#0A0E1A]"],
            ["$", "-right-9 top-[8%]", "7s", "0.8s", "from-[#3B9EFF] to-[#1d6fd1] text-white"],
            ["€", "-left-7 bottom-[22%]", "8s", "1.6s", "from-[#3B9EFF] to-[#1d6fd1] text-white"],
            ["Au", "-right-8 bottom-[14%]", "6.5s", "0.4s", "from-[#F0B429] to-[#D4A017] text-[#0A0E1A]"],
          ].map(([sym, pos, dur, delay, tone]) => (
            <div key={sym} style={{ animationDuration: dur, animationDelay: delay }} className={`absolute ${pos} z-20 hidden h-14 w-14 place-items-center rounded-full bg-gradient-to-br ${tone} text-xl font-bold shadow-[0_12px_30px_-6px_rgba(0,0,0,.6),inset_0_2px_6px_rgba(255,255,255,.35)] ring-2 ring-white/20 animate-[floatRot_6s_ease-in-out_infinite] xl:grid`}>
              {sym}
            </div>
          ))}

          {/* live sparkline card */}
          <div className="absolute -bottom-8 left-16 z-20 hidden w-[210px] rounded-xl border border-[rgba(120,160,220,0.25)] bg-[#0A1428]/85 p-3.5 backdrop-blur-md animate-[floaty_7s_ease-in-out_0.6s_infinite] xl:block">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#EEF2F8]">EUR / USD</span>
              <span className="text-[#5D6B85]">Live</span>
            </div>
            <svg viewBox="0 0 200 56" className="mt-2 h-14 w-full" fill="none">
              <defs>
                <linearGradient id="spk" x1="0" x2="1">
                  <stop offset="0%" stopColor="#3B9EFF" />
                  <stop offset="100%" stopColor="#F0B429" />
                </linearGradient>
              </defs>
              <path d="M0 44 L20 38 L40 42 L60 26 L80 32 L100 18 L120 26 L140 12 L160 20 L180 8 L200 14" stroke="url(#spk)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="260" className="animate-[draw_4s_ease-in-out_infinite]" />
            </svg>
          </div>

          <div className="absolute -right-6 -top-6 z-20 hidden rounded-xl border border-[rgba(120,160,220,0.25)] bg-[#0A1428]/85 px-4 py-3 text-sm backdrop-blur-md animate-[floaty_7s_ease-in-out_1.2s_infinite] 2xl:block">
            <p className="flex items-center gap-2 font-semibold text-[#F0B429]">
              <span className="h-2 w-2 rounded-full bg-[#F0B429] animate-[ping2_1.8s_ease-out_infinite]" />
              AI engine
            </p>
            <p className="text-xs text-[#8B98B0]">Pattern signals active</p>
          </div>
          <div className={`${card} relative overflow-hidden p-3 shadow-[0_60px_120px_-60px_rgba(0,0,0,.8)] before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-to-r before:from-transparent before:via-[#F0B429] before:to-transparent md:p-5`}>
            <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
              <div className="overflow-hidden rounded-xl border border-[rgba(120,160,220,0.16)]">
                <div className="flex flex-wrap gap-2 p-3">
                  {symbols.map((s) => (
                    <button key={s.symbol} onClick={() => setSelectedSymbol(s.symbol)} className={`rounded-full px-4 py-2 text-xs font-medium transition border ${selectedSymbol === s.symbol ? "bg-[#F0B429] text-[#0A0E1A] border-[#F0B429]" : "bg-transparent text-[#8B98B0] border-white/[0.15] hover:border-white/[0.25] hover:bg-white/[0.05]"}`}>
                      {s.name}
                    </button>
                  ))}
                </div>
                <div className="h-[460px]">
                  <TradingViewWidget defaultSymbol={selectedSymbol} />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="rounded-xl border border-[rgba(120,160,220,0.16)] p-5">
                  <p className="text-sm text-[#5D6B85]">AI signal confidence</p>
                  <p className="mt-1 text-4xl font-semibold text-[#3B9EFF]">{aiSignalConfidence}<span className="text-lg text-[#5D6B85]">%</span></p>
                </div>
                <div className="rounded-xl border border-[rgba(120,160,220,0.16)] p-5">
                  <p className="text-sm text-[#5D6B85]">Platform status</p>
                  <p className="mt-1 text-2xl font-semibold">99.9% uptime</p>
                  <p className="mt-1 text-sm text-[#8B98B0]">24/7 live market sync</p>
                </div>
                <div className="flex-1 rounded-xl border border-[rgba(120,160,220,0.16)] p-5">
                  <p className="mb-3 text-sm text-[#5D6B85]">Allocation</p>
                  {symbols.slice(0, 6).map((s, i) => (
                    <div key={s.symbol} className="mt-2.5 flex items-center gap-2.5">
                      <span className="w-10 text-xs text-[#5D6B85]">{s.name.split(" / ")[0]}</span>
                      <div className="h-[5px] flex-1 overflow-hidden rounded bg-white/[0.06]">
                        <div className="h-full rounded bg-gradient-to-r from-[#3B9EFF] to-[#F0B429]" style={{ width: `${[62, 41, 74, 29, 55, 38][i]}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-4 px-1 text-xs text-[#5D6B85]">Sample interface for illustration purposes. Figures shown are live trading data and results.</p>
          </div>
          </div>
        </section>

        <TradingViewTicker />

        <div className="overflow-hidden border-y border-[rgba(120,160,220,0.16)] bg-[#0A1428]/40 py-4">
          <div className="flex w-max text-sm text-[#8B98B0] animate-[marquee_35s_linear_infinite]">
            {[...Array(2)].flatMap(() => ["AI signals", "Forex", "Digital assets", "Automation", "Live heatmap", "Secure infrastructure", "Global data nodes"]).map((w, i) => (
              <span key={i} className="flex items-center gap-10 whitespace-nowrap pr-10">
                {w}
                <span className="text-[#F0B429]">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* ABOUT: text left, stacked principles right */}
        <section id="about" className="mx-auto grid max-w-[1240px] gap-14 px-5 py-24 md:px-8 lg:grid-cols-2">
          <div>
            <Heading kicker="About JMFinex" title={<>Turning complex market data into <span className={grad}>clear opportunities.</span></>} />
            <p className="max-w-[540px] leading-[1.75] text-[#8B98B0]">
              JMFinex is a digital trading technology platform for modern market participants. It combines data infrastructure, AI and automation to simplify how people understand and use global markets, with clarity, speed and control.
            </p>
            <div className="relative mt-8 h-[260px] overflow-hidden rounded-2xl border border-[rgba(120,160,220,0.16)] bg-cover bg-center" style={{ backgroundImage: "url(/1.png)" }}>
              <div className="absolute inset-0 bg-gradient-to-t from-[#040d22]/90 to-transparent" />
              <p className="absolute bottom-5 left-5 font-semibold text-[#F0B429]">Built for the future. Intelligent, secure, scalable.</p>
            </div>
          </div>
          <div className="flex flex-col justify-center divide-y divide-[rgba(120,160,220,0.16)]">
            {[
              ["Data first", "Reliable market intelligence from multiple global sources."],
              ["AI assisted", "Models built to spot trends, momentum and volatility."],
              ["Built to scale", "Infrastructure made for continuous growth and performance."],
              ["User focused", "Simple interfaces for confident decisions."],
            ].map(([title, desc], i) => (
              <Reveal key={title} delay={i * 110} className="group flex gap-5 py-6">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#3B9EFF] shadow-[0_0_10px_#3B9EFF] transition-transform duration-300 group-hover:scale-150 group-hover:bg-[#F0B429]" />
                <div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-1 text-[#8B98B0]">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* SERVICES: bento grid */}
        <section id="services" className="mx-auto max-w-[1240px] px-5 py-24 md:px-8">
          <Heading kicker="Our services" title="Everything you need to operate in modern markets." text="From market intelligence to automated systems, one set of tools for a smarter trading experience." />
          <div className="grid auto-rows-[220px] gap-5 md:grid-cols-4">
            {services.map(([title, desc, img, span], i) => (
              <Reveal key={title} delay={i * 90} className={span}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-[rgba(120,160,220,0.16)] bg-cover bg-center transition duration-500 hover:border-[rgba(240,180,41,0.45)] hover:shadow-[0_25px_55px_rgba(59,158,255,0.15)]" style={{ backgroundImage: `url(${img})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#040d22] via-[#040d22]/75 to-[#040d22]/30 transition group-hover:from-[#040d22]/90" />
                <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-[#3B9EFF] to-[#F0B429] transition-transform duration-500 group-hover:scale-x-100" />
                <div className="absolute bottom-0 p-6 transition-transform duration-500 group-hover:-translate-y-1">
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-[1.55] text-[#8B98B0]">{desc}</p>
                </div>
              </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* PLATFORM: vertical tabs */}
        <section id="platform" className="relative py-[120px] max-[900px]:py-[84px] border-t border-b border-[rgba(120,160,220,0.16)] [background:linear-gradient(180deg,rgba(8,14,28,.35),rgba(12,20,42,.65))]">
  <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5">
    <div className="reveal max-w-[640px] mb-14">
      <span className="inline-flex items-center gap-2.5 font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[#3B9EFF] mb-[18px] before:content-[''] before:w-[22px] before:h-px before:bg-[#3B9EFF] before:[box-shadow:0_0_8px_#3B9EFF]">
        Explore The Platform
      </span>
      <h2 className="font-display font-semibold text-[#EEF2F8] leading-[1.1] [font-size:clamp(1.9rem,3.6vw,2.75rem)]">
        One ecosystem. Multiple intelligent capabilities.
      </h2>
      <p className="text-[#8B98B0] text-[1.02rem] leading-[1.65] mt-4">
        Explore the core platform modules built to help you analyze, automate and monitor market activity.
      </p>
    </div>

    <div className="reveal border border-[rgba(120,160,220,0.16)] rounded-3xl p-2.5 [background:rgba(15,22,45,.6)]">
      {/* Horizontal tabs */}
      <div className="flex flex-wrap gap-2 p-[7px] border-b border-[rgba(120,160,220,0.16)]">
        {tabs.map((x, i) => (
          <button
            key={x.name}
            onClick={() => setTab(i)}
            className={`tab-button cursor-pointer border rounded-[10px] text-[0.87rem] py-[13px] px-[18px] transition-[color,background,border-color] duration-300 ${
              tab === i
                ? "text-[#F0B429] bg-[#F0B429]/[0.09] border-[rgba(240,180,41,0.25)]"
                : "text-[#8B98B0] bg-transparent border-transparent hover:text-[#F0B429] hover:bg-[#F0B429]/[0.09] hover:border-[rgba(240,180,41,0.25)]"
            }`}
          >
            {x.name}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="grid animate-tab-fade grid-cols-2 max-[900px]:!grid-cols-1 gap-10 items-center py-[42px] px-7 pb-[30px]">
        <div>
          <span className="inline-flex items-center gap-2.5 font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[#3B9EFF] mb-[18px] before:content-[''] before:w-[22px] before:h-px before:bg-[#3B9EFF] before:[box-shadow:0_0_8px_#3B9EFF]">
            {String(tab + 1).padStart(2, "0")} / {t.name}
          </span>
          <h3 className="text-2xl mb-3.5 font-display font-semibold text-[#EEF2F8]">{t.title}</h3>
          <p className="text-[#8B98B0] leading-[1.7] mb-[22px]">{t.desc}</p>
          <ul className="grid gap-3">
            {t.list.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 text-[#8B98B0] text-[0.9rem] before:content-['✓'] before:w-[21px] before:h-[21px] before:grid before:place-items-center before:rounded-full before:bg-[#3B9EFF]/[0.12] before:text-[#3B9EFF] before:text-[0.75rem]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div
          className="relative min-h-[300px] rounded-2xl border border-[rgba(120,160,220,0.16)] overflow-hidden after:content-[''] after:absolute after:inset-0 after:[background:linear-gradient(135deg,rgba(5,8,18,.05),rgba(5,8,18,.7))]"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(59,158,255,.18), transparent 45%), linear-gradient(315deg, rgba(240,180,41,.22), transparent 55%), url(${t.img})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
      </div>
    </div>
  </div>
</section>

        {/* WHY: two-column, sticky heading */}
        <section id="why" className="mx-auto grid max-w-[1240px] gap-12 px-5 py-24 md:px-8 lg:grid-cols-[1fr_1.4fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Heading kicker="Why JMFinex" title="Infrastructure built for how modern markets actually move." text="Every layer, from data ingestion to execution, is engineered for speed, clarity and resilience." />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              ["AI trading technology", "Machine-learning models read market structure and surface patterns across timeframes."],
              ["Global forex markets", "Deep liquidity across major, minor and exotic pairs, synced in real time."],
              ["Digital asset markets", "Unified access to major digital assets with transparent pricing."],
              ["Automated execution", "Rules-based automation keeps strategies running around the clock."],
              ["Advanced analytics", "Layered charting, volatility mapping and sentiment overlays."],
              ["Secure infrastructure", "Encrypted pipelines and segregated wallet architecture protect every layer."],
            ].map(([title, desc], i) => (
              <Reveal key={title} delay={(i % 2) * 120} className={i % 2 ? "sm:mt-8" : ""}>
                <Spot className={`${card} h-full p-6 transition duration-300 hover:-translate-y-1.5 hover:border-[rgba(240,180,41,0.4)]`}>
                  <div className="mb-4 h-1 w-10 rounded bg-gradient-to-r from-[#3B9EFF] to-[#F0B429] transition-all duration-500 group-hover:w-20" />
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-[0.92rem] leading-[1.6] text-[#8B98B0]">{desc}</p>
                </Spot>
              </Reveal>
            ))}
          </div>
        </section>

        {/* HEATMAP */}
        <section id="heatmap" className="mx-auto max-w-[1240px] px-5 pb-24 pt-12 md:px-8">
          <Heading kicker="Market heatmap" title="Real-time currency performance." text="Percentage changes across major forex pairs. Green shows gains, red shows losses." />
          <Reveal>
            <div className="overflow-hidden rounded-[22px] border border-[rgba(120,160,220,0.16)] bg-[#0A1428]">
              <div className="h-[500px] w-full max-[640px]:h-[400px]">
                <TradingViewHeatmap />
              </div>
            </div>
          </Reveal>
        </section>

        {/* HOW IT WORKS: real sequence, horizontal steps on a line */}
        <section id="how" className="mx-auto max-w-[1240px] px-5 py-24 md:px-8">
          <Heading kicker="How it works" title="From account to active dashboard, in four steps." />
          <div className="relative grid gap-8 md:grid-cols-4">
            <div className="absolute left-0 right-0 top-[19px] hidden h-px bg-gradient-to-r from-[#3B9EFF] to-[#F0B429] md:block" />
            {[
              ["Create account", "Set up a secure account with verified credentials."],
              ["Explore platform", "Get oriented with the console, market feeds and analytics."],
              ["Set up trading tools", "Configure charts, automation rules and AI indicators."],
              ["Monitor activity", "Track positions, signals and status from one dashboard."],
            ].map(([title, desc], i) => (
              <div key={title} className="relative">
                <Reveal delay={i * 150}>
                  <h4 className="mt-5 text-lg font-semibold">{title}</h4>
                  <p className="mt-2 text-sm leading-[1.6] text-[#8B98B0]">{desc}</p>
                </Reveal>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ: heading left, accordion right */}
        {/* FAQ */}
<section className="relative py-[120px] max-[900px]:py-[84px]" id="faq">
  <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5">
    <div className="reveal mx-auto text-center max-w-[640px] mb-14">
      <span className="relative inline-flex items-center justify-center gap-2.5 font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[#3B9EFF] mb-[18px] before:content-[''] before:w-[22px] before:h-px before:bg-[#3B9EFF] before:[box-shadow:0_0_8px_#3B9EFF]">
        FAQ
      </span>
      <h2 className="font-display font-semibold text-[#EEF2F8] leading-[1.1] [font-size:clamp(1.9rem,3.6vw,2.75rem)]">
        Common questions
      </h2>
    </div>
    <div className="reveal max-w-[800px] mx-auto">
      {[
        ["What is JMFinex?", "JMFinex is a technology platform that provides AI-assisted analytics, automation tooling and market data infrastructure for forex and digital asset markets.", true],
        ["What markets does the platform cover?", "The platform aggregates data and access across major forex pairs and widely-traded digital assets, kept in sync through a global network of data nodes.", false],
        ["How does the AI engine work?", "Models analyze historical and live price structure to identify trend, momentum and volatility patterns, which are surfaced as indicators inside the dashboard.", false],
        ["How is my data and access secured?", "The platform uses encrypted data pipelines, segregated wallet architecture and standard account-security practices such as verified login and session monitoring.", false],
        ["Can I use the automation tools without AI signals?", "Yes. Automation rules can be configured independently, with or without AI-generated indicators layered on top.", false],
        ["Is trading activity or performance guaranteed?", "No. JMFinex provides technology and tools only. Trading involves risk, and no outcome or return is guaranteed. See our Risk Disclosure for details.", false],
      ].map(([q, a, open]) => (
        <div key={q} className={`faq-item border-b border-[rgba(120,160,220,0.16)] ${open ? "open" : ""}`}>
          <div className="flex items-center justify-between gap-5 cursor-pointer py-[26px] px-1">
            <h4 className="text-[1.02rem] font-medium text-[#EEF2F8]">{q}</h4>
            <div className={`relative flex-shrink-0 w-[30px] h-[30px] rounded-full border flex items-center justify-center transition-[border-color,background] duration-300 before:content-[''] before:absolute before:w-[10px] before:h-px after:content-[''] after:absolute after:w-px after:h-[10px] before:transition-transform after:transition-transform before:duration-350 after:duration-350 ${open ? "border-[#3B9EFF] bg-[#3B9EFF]/[0.14] before:bg-[#3B9EFF] after:bg-[#3B9EFF] after:scale-y-0" : "border-[rgba(120,160,220,0.16)] before:bg-[#8B98B0] after:bg-[#8B98B0]"}`} />
          </div>
          <div className={`overflow-hidden transition-[max-height] duration-500 ${open ? "max-h-[300px]" : "max-h-0"}`}>
            <p className="text-[#8B98B0] text-[0.92rem] leading-[1.65] max-w-[680px] px-1 pb-[26px]">{a}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

        {/* CTA */}
          <section className="relative py-[120px] max-[900px]:py-[84px]" id="cta">
          <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5">
            <div className="reveal relative overflow-hidden text-center rounded-[26px] py-[90px] px-10 max-[640px]:!px-[22px] max-[640px]:!py-16 bg-[#0A1428] border border-[rgba(120,160,220,0.16)]">
               <canvas id="ctaParticles" className="absolute inset-0 w-full h-full opacity-50" />
               <div className="relative z-[2]">
                 <span className="relative inline-flex items-center justify-center gap-2.5 font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[#3B9EFF] mb-[18px] before:content-[''] before:w-[22px] before:h-px before:bg-[#3B9EFF] before:[box-shadow:0_0_8px_#3B9EFF]">
                   Get Signup
                 </span>
                 <h2 className="font-display font-semibold leading-[1.15] max-w-[680px] mx-auto mb-[34px] text-[#EEF2F8] [font-size:clamp(1.9rem,4vw,3rem)]">
                   Explore the future of digital trading technology.
                 </h2>
                <a href="/user/register" className="relative inline-flex items-center justify-center gap-2.5 rounded-full font-semibold text-base py-[18px] px-10 text-[#0A0E1A] [background:linear-gradient(135deg,#F0B429_0%,#D4A017_100%)] transition-transform duration-350 hover:-translate-y-0.5 hover:[box-shadow:0_12px_32px_-8px_rgba(240,180,41,.55),0_0_24px_-4px_rgba(255,215,0,.4)]">
                  <span>Get Signup with JMFinex</span>
                 </a>
             
               </div>
             </div>
           </div>
         </section>
      </main>

    
    </div>
  );
}