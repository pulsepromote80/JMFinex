"use client";

import React, { useEffect, useState } from "react";
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
  Menu,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

const navItems = [
  "about",
  "services",
  "platform",
  "technology",
  "Education",
  "vision",
  "faq",
];

const tracks = [
  [
    CandlestickChart,
    "Liquidity Providers: How They Work and Why They Matter in Financial Markets",
    "Build a confident base with market structure, order types, and disciplined execution.",
    "",
    "#3B9EFF",
  ],
  [
    BrainCircuit,
    "Win Rate; How to Calculate Win Rate and Its Importance in Forex",
    "Understand how intelligent systems read patterns and support better decisions.",
    "",
    "#F0B429",
  ],
  [
    BarChart3,
    "What Is a Centralized Exchange? High Liquidity & Diverse Financial Services",
    "Read charts with clarity using indicators, price action, and repeatable setups.",
    "",
    "#35D07F",
  ],
  [
    TrendingUp,
    "What Are Maker and Taker Fees? Difference Between Maker and Taker",
    "Explore currency pairs, liquidity, and the rhythm of global trading sessions.",
    "",
    "#E8836B",
  ],
  [
    Bitcoin,
    "Fear & Greed Index: Market Sentiment Gauge + Component Weights",
    "Navigate crypto, blockchain fundamentals, and the ideas shaping decentralized finance.",
    "",
    "#A78BFA",
  ],
  [
    ShieldCheck,
    "Cryptocurrency; Decentralized & Secure P2P Financial Transactions",
    "Protect your capital with position sizing, portfolio allocation, and smart exits.",
    "",
    "#22E8D4",
  ],
];

const articleContent = {
  "Liquidity Providers: How They Work and Why They Matter in Financial Markets": {
    summary: "Liquidity providers supply the capital and pricing that allow financial markets to operate smoothly. They help connect buyers and sellers, reduce delays, and make it easier to enter or exit a position.",
    points: ["Bid and ask prices", "Market liquidity", "Trade execution", "Price slippage"],
  },
  "Win Rate; How to Calculate Win Rate and Its Importance in Forex": {
    summary: "Liquidity Providers supply the required capital for trading in Forex, cryptocurrency, stock markets, and other markets. Liquidity Providers provide bid and ask prices, and the speed of trade execution depends on their presence. In fact, a liquidity provider is an individual or entity that supplies assets to a market or a liquidity pool in order to facilitate smooth trading and, in return, receives fees or rewards.",
    points: ["Win-rate calculation", "Risk-to-reward", "Sample size", "Strategy evaluation"],
  },
  "What Is a Centralized Exchange? High Liquidity & Diverse Financial Services": {
    summary: "Centralized exchanges provide a structured marketplace where users can buy, sell, and manage digital assets. They bring liquidity, order matching, and additional services into one platform.",
    points: ["Order matching", "Exchange liquidity", "Custody basics", "Platform services"],
  },
  "What Are Maker and Taker Fees? Difference Between Maker and Taker": {
    summary: "Maker and taker fees describe how exchange users contribute to liquidity. Understanding the difference helps traders estimate the real cost of entering and exiting a position.",
    points: ["Maker orders", "Taker orders", "Trading fees", "Execution costs"],
  },
  "Fear & Greed Index: Market Sentiment Gauge + Component Weights": {
    summary: "The Fear and Greed Index combines market signals into a sentiment gauge. It can help traders understand whether participants are acting defensively or chasing momentum.",
    points: ["Market sentiment", "Fear signals", "Greed signals", "Component weights"],
  },
  "Cryptocurrency; Decentralized & Secure P2P Financial Transactions": {
    summary: "Cryptocurrency enables peer-to-peer value transfer through decentralized networks. This article introduces the technology, transaction flow, and risks that make digital assets different from traditional markets.",
    points: ["Peer-to-peer payments", "Blockchain networks", "Wallet security", "Transaction confirmation"],
  },
};

function getArticleParagraphs(article) {
  const content = articleContent[article.title];
  const points = content?.points || ["Core concepts", "Practical examples", "Market context", "Risk awareness"];
  return [
    content?.summary || article.description,
    `In practical terms, ${article.description.toLowerCase()} Studying this topic helps you understand the market context before making a decision and gives you a clearer way to evaluate both opportunity and risk.`,
    `The most useful ideas to carry forward are ${points.slice(0, 3).join(", ")}, and disciplined execution. These principles work together to turn information into a repeatable learning process.`,
  ];
}

export default function AcademicsSection() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSelectedArticle(null);
    };
    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    const shouldLockScroll = mobileMenuOpen || selectedArticle;

    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = shouldLockScroll ? "hidden" : previousBodyOverflow;
    document.documentElement.style.overflow = shouldLockScroll ? "hidden" : previousDocumentOverflow;

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
    };
  }, [mobileMenuOpen, selectedArticle]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050812] text-[#EEF3F8]">
      <div className="pointer-events-none fixed inset-0 [background:radial-gradient(ellipse_at_top_right,rgba(59,158,255,0.13),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(240,180,41,0.08),transparent_55%),linear-gradient(180deg,rgba(8,11,24,0.9),#050812)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(59,158,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(59,158,255,0.35)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent_80%)]" />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-[#080B18]/80 py-[18px] backdrop-blur-[18px]">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-8 max-[720px]:px-5">
          <a
            href="/user"
            aria-label="JMFinex home"
            className="flex items-center"
          >
            <Image
              src="/logo.png"
              alt="JMFinex Logo"
              width={240}
              height={54}
              className="block h-auto max-w-full"
              priority
            />
          </a>
          <nav className="hidden items-center gap-[38px] min-[901px]:flex">
            {navItems.map((id) => (
              <a
                key={id}
                href={
                  id.toLowerCase() === "education" ? "/user/course" : `/user#${id}`
                }
                className={`relative text-[0.88rem] font-medium capitalize transition-colors duration-250 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gradient-to-r after:from-[#3B9EFF] after:to-[#F0B429] after:transition-[width] after:duration-350 hover:text-[#EEF3F8] hover:after:w-full ${id.toLowerCase() === "education" ? "text-[#EEF3F8] after:w-full" : "text-[#8B98B0]"}`}
              >
                {id === "faq" ? "FAQ" : id}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-3.5 min-[901px]:flex">
            <a
              href="/user#platform"
              className="rounded-full border border-white/[0.22] bg-white/[0.02] px-6 py-[11px] text-[0.86rem] font-semibold text-[#EEF2F8] transition hover:-translate-y-0.5 hover:border-[#F0B429]"
            >
              Explore Platform
            </a>
            <a
              href="/user/login"
              className="rounded-full bg-gradient-to-br from-[#F0B429] to-[#D4A017] px-6 py-[11px] text-[0.86rem] font-semibold text-[#0A0E1A] transition hover:-translate-y-0.5"
            >
              Get SignIn
            </a>
          </div>
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
            className="text-[#EEF3F8] min-[901px]:hidden"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-7 bg-[#080B18]/[0.98] pt-20 backdrop-blur-xl min-[901px]:hidden">
          {navItems.map((id) => (
            <a
              key={id}
              href={
                id.toLowerCase() === "education" ? "/user/course" : `/user#${id}`
              }
              onClick={() => setMobileMenuOpen(false)}
              className="font-display text-[1.45rem] capitalize text-[#EEF3F8]"
            >
              {id === "faq" ? "FAQ" : id}
            </a>
          ))}
          <a
            href="/user#cta"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-full bg-gradient-to-br from-[#F0B429] to-[#D4A017] px-7 py-3 font-semibold text-[#0A0E1A]"
          >
            Get Signup
          </a>
        </div>
      )}

      <main className="relative z-10 mx-auto max-w-[1240px] px-8 pb-20 pt-[150px] max-[720px]:px-5 max-[720px]:pt-[125px]">
        <section className="grid items-end gap-10 border-b border-white/[0.1] pb-14 lg:grid-cols-[1fr_330px]">
          <div>
            <span className="mt-4 mb-8 inline-flex items-center gap-2.5 font-mono text-[0.72rem] uppercase tracking-[0.22em] text-[#3B9EFF] before:h-px before:w-[22px] before:bg-[#3B9EFF]">
              JMFinex Academics
            </span>
            <h1 className="max-w-[760px] font-display text-[clamp(2.5rem,5.4vw,4.4rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-[#EEF3F8]">
              Learn with intent.
              <br />
              <span className="bg-gradient-to-br from-[#3B9EFF] to-[#F0B429] bg-clip-text text-transparent">
                Trade with clarity.
              </span>
            </h1>
            <p className="mt-6 max-w-[650px] text-[1.05rem] leading-[1.7] text-[#8B98B0]">
              A focused learning hub for the ideas, tools, and habits behind
              confident market decisions. Move from first principles to
              practical strategy at your own pace.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#tracks"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#F0B429] to-[#D4A017] px-6 py-3.5 font-semibold text-[#0A0E1A] transition hover:-translate-y-0.5"
              >
                Explore learning paths <ArrowUpRight size={17} />
              </a>
              <a
                href="#about-academics"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.18] px-6 py-3.5 font-semibold text-[#EEF2F8] transition hover:border-[#3B9EFF]"
              >
                How it works
              </a>
            </div>
          </div>
          <div id="about-academics" className="grid grid-cols-2 gap-3">
            {[
              ["6", "learning paths", GraduationCap],
              ["61", "guided lessons", BookOpen],
              ["100%", "self-paced", Sparkles],
              ["24/7", "access", Users],
            ].map(([value, label, Icon]) => (
              <div
                key={label}
                className="group border border-white/[0.1] bg-white/[0.035] p-4 transition duration-300 hover:-translate-y-1 hover:border-[#3B9EFF]/[0.45] hover:bg-white/[0.08]"
              >
                <Icon
                  size={17}
                  className="mb-5 text-[#3B9EFF] transition duration-300 group-hover:text-[#F0B429]"
                />
                <strong className="block font-display text-[1.45rem] text-[#EEF2F8] transition-colors duration-300 group-hover:text-[#F0B429]">
                  {value}
                </strong>
                <span className="text-[0.72rem] uppercase tracking-[0.08em] text-[#5D6B85] transition-colors duration-300 group-hover:text-[#8B98B0]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section id="tracks" className="pt-14">
          <div className="mb-7 flex items-end justify-between gap-5">
            <div>
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#3b9eff]">
                Curriculum
              </span>
              <h2 className="mt-2 font-display text-[clamp(1.7rem,3vw,2.35rem)] font-semibold text-[#EEF3F8]">
                Choose your next edge
              </h2>
            </div>
            <span className="hidden text-right text-sm text-[#8B98B0] sm:block">
              Built for curious minds
              <br />
              and deliberate traders.
            </span>
          </div>
          <div className="grid grid-cols-4 gap-3 max-[1100px]:grid-cols-3 max-[820px]:grid-cols-2 max-[560px]:grid-cols-1">
            {tracks.map(([Icon, title, description, lessons, color], index) => (
              <article
                key={title}
                role="button"
                tabIndex={0}
                aria-label={`Read summary: ${title}`}
                onClick={() => setSelectedArticle({ Icon, title, description, lessons, color })}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedArticle({ Icon, title, description, lessons, color });
                  }
                }}
                className="group cursor-pointer overflow-hidden rounded-[22px] bg-[#1B1E2D] transition duration-300 hover:-translate-y-1 hover:bg-[#222638] hover:shadow-[0_18px_40px_rgba(0,0,0,0.28)]"
              >
                <div
                  className="relative flex h-[132px] items-end justify-between overflow-hidden p-4"
                  style={{ background: `linear-gradient(135deg, ${color}55 0%, #20263B 62%, #111522 100%)` }}
                >
                  <div className="absolute inset-0 opacity-50 [background:radial-gradient(circle_at_25%_60%,rgba(255,255,255,0.45),transparent_18%),linear-gradient(145deg,transparent_45%,rgba(255,255,255,0.2)_46%,transparent_48%),linear-gradient(25deg,transparent_55%,rgba(24,199,217,0.45)_56%,transparent_58%)]" />
                  <span className="relative rounded-r-md bg-[#7650A6] px-2 py-1 text-[0.62rem] font-semibold text-white">
                    {index < 2 ? "Trading Concepts" : "Market Education"}
                  </span>
                  <div className="relative grid h-10 w-10 place-items-center rounded-full border-2 bg-[#172039]/80" style={{ borderColor: color, color }}>
                    <Icon size={19} />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="min-h-[58px] font-display text-[1.12rem] font-semibold leading-[1.35] text-[#EEF2F8]">{title}</h3>
                  <div className="mt-3 flex items-center justify-between text-[0.86rem] text-[#EEF2F8]"><span className="flex items-center gap-1.5">JMFinex <CheckCircle2 size={15} style={{ color }} /></span><span className="text-[#EEF2F8]">{lessons}</span></div>
                  <p className="mt-3 line-clamp-3 min-h-[78px] text-[1rem] leading-[1.6] text-[#EEF2F8]/[0.9]">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

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
            <div className="grid h-14 w-14 place-items-center rounded-full border-2 bg-[#111827]" style={{ borderColor: selectedArticle.color, color: selectedArticle.color }}>
              <selectedArticle.Icon size={24} />
            </div>
            <span className="mt-6 inline-block rounded-r-md bg-[#7650A6] px-3 py-1 text-xs font-semibold text-white">JMFinex Academics</span>
            <h2 id="article-modal-title" className="mt-5 pr-10 font-display text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-[1.15] text-[#EEF3F8]">{selectedArticle.title}</h2>
            <div className="mt-4 flex items-center gap-2 text-sm text-[#8B98B0]"><CheckCircle2 size={16} style={{ color: selectedArticle.color }} /> {selectedArticle.lessons} <span className="mx-1 text-[#5D6B85]">|</span> Beginner-friendly overview</div>
            <div className="mt-7 space-y-6 text-[1.05rem] leading-[1.9] text-[#D6DCE6]">{getArticleParagraphs(selectedArticle).map((paragraph, index) => <p key={`${selectedArticle.title}-${index}`}>{index === 0 ? <><strong style={{ color: selectedArticle.color }}>{selectedArticle.title.split(":")[0]}</strong> {paragraph}</> : paragraph}</p>)}</div>
            <div className="mt-7 border-t border-white/[0.1] pt-6"><h3 className="font-display text-lg font-semibold text-[#EEF3F8]">What you will learn</h3><div className="mt-4 grid gap-3 sm:grid-cols-2">{(articleContent[selectedArticle.title]?.points || ["Core concepts", "Practical examples", "Market context", "Risk awareness"]).map((point) => <div key={point} className="flex items-center gap-2 border border-white/[0.1] bg-white/[0.035] p-3 text-sm text-[#C9D0DC]"><CheckCircle2 size={15} style={{ color: selectedArticle.color }} />{point}</div>)}</div></div>
          </section>
        </div>
      )}

   <section className="relative pb-[120px] max-[900px]:pb-[84px]">
  <div className="mx-auto max-w-[1240px] px-8 max-[720px]:px-5">
    <div className="overflow-hidden rounded-[26px] border border-[rgba(120,160,220,0.16)] bg-[#0A1428]">
      <img
        src="/academic_image.jpeg"
        alt="academic image"
        className="block w-full max-h-[620px] object-contain mx-auto"
      />
    </div>
  </div>
</section>

      <footer className="relative z-10 block w-full border-t border-[rgba(120,160,220,0.16)] bg-[#070C17] py-[70px] pb-[30px]">
        <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5">
          <div className="grid gap-10 pb-[50px] [grid-template-columns:1.4fr_1fr_1fr_1fr] max-[820px]:!grid-cols-2 max-[520px]:!grid-cols-1">
            <div>
              <a href="#top" className="flex items-center gap-2.5 font-display text-[1.35rem] font-bold -tracking-[0.01em]">
                <img src="/logo.png" alt="JMFinex Logo" className="w-[240px] max-w-full block" />
              </a>
              <p className="text-[#8B98B0] text-[0.86rem] leading-[1.6] mt-4 max-w-[280px]">
                An AI-powered trading technology ecosystem for global forex and digital asset markets.
              </p>
              <div className="flex gap-3 mt-[22px]">
                <a href="#" aria-label="X" className="w-9 h-9 rounded-full border border-[rgba(120,160,220,0.16)] flex items-center justify-center transition-[border-color,background] duration-300 hover:border-[#F0B429] hover:bg-[#F0B429]/[0.14]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px] text-[#8B98B0]"><path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.9L4.5 22H1.4l8.2-9.4L1 2h7l4.9 6.4L18.9 2Z" /></svg>
                </a>
                <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-full border border-[rgba(120,160,220,0.16)] flex items-center justify-center transition-[border-color,background] duration-300 hover:border-[#F0B429] hover:bg-[#F0B429]/[0.14]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px] text-[#8B98B0]"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2 3.77-2 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9Z" /></svg>
                </a>
                <a href="#" aria-label="Telegram" className="w-9 h-9 rounded-full border border-[rgba(120,160,220,0.16)] flex items-center justify-center transition-[border-color,background] duration-300 hover:border-[#F0B429] hover:bg-[#F0B429]/[0.14]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px] text-[#8B98B0]"><path d="M21.9 3.5 2.6 11c-1 .4-1 1.7.1 2l4.7 1.5 1.8 5.6c.3.9 1.4 1.1 2 .4l2.6-2.7 4.8 3.6c.9.7 2.2.2 2.4-.9l3-16.4c.2-1.2-1-2.1-2.1-1.6Z" /></svg>
                </a>
              </div>
            </div>
            <div>
              <h5 className="font-mono text-[0.72rem] tracking-[0.12em] uppercase text-[#5D6B85] mb-[18px]">Platform</h5>
              {[["#why", "Why JMFinex"], ["#technology", "Technology"], ["#global", "Global Network"], ["#how", "How It Works"]].map(([href, label]) => (
                <a key={label} href={href} className="block text-[#8B98B0] text-[0.88rem] mb-3 transition-colors duration-250 hover:text-[#F0B429]">{label}</a>
              ))}
            </div>
            <div>
              <h5 className="font-mono text-[0.72rem] tracking-[0.12em] uppercase text-[#5D6B85] mb-[18px]">Company</h5>
              {[["#vision", "Vision"], ["#faq", "FAQ"], ["#", "Contact"], ["#", "Careers"]].map(([href, label], i) => (
                <a key={label + i} href={href} className="block text-[#8B98B0] text-[0.88rem] mb-3 transition-colors duration-250 hover:text-[#F0B429]">{label}</a>
              ))}
            </div>
            <div>
              <h5 className="font-mono text-[0.72rem] tracking-[0.12em] uppercase text-[#5D6B85] mb-[18px]">Address</h5>
              <p className="text-[#8B98B0] text-[0.88rem] leading-[1.6] mb-5">
                <strong>Registered Office:</strong> 838, Castries, Rodney Court Building, Rodney Bay, St. Lucia
              </p>
              <p className="text-[#8B98B0] text-[0.88rem] leading-[1.6]">
                <strong>Corporate Presence:</strong> United States &amp; St. Lucia
              </p>
            </div>
          </div>
          <div className="text-[0.78rem] text-[#5D6B85] leading-[1.6] max-w-[900px] mt-[26px] pt-[26px] border-t border-[rgba(120,160,220,0.16)]">
            <strong className="text-[#8B98B0]">Risk Disclosure:</strong> Trading forex and digital assets involves substantial risk and may not be suitable for all users. Past performance is not indicative of future results, and no returns or outcomes are guaranteed. Figures and charts on this site are illustrative and for demonstration purposes only. Placeholder content — replace with verified regulatory and legal information before launch.
          </div>
          <div className="flex justify-between items-center flex-wrap gap-4 border-t border-[rgba(120,160,220,0.16)] pt-[26px] mt-[30px]">
            <p className="text-[0.78rem] text-[#5D6B85]">© 2026 JMFinex. All rights reserved.</p>
            <p className="text-[0.78rem] text-[#5D6B85]">Designed as a technology & platform experience.</p>
          </div>
        </div>
      </footer>

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
              <FaWhatsapp size={18} className="text-[#25D366]" /> WhatsApp
            </a>
            <a
              href="https://t.me/share/url?text=Learn%20more%20about%20JMFinex%20Academics"
              target="_blank"
              rel="noreferrer"
              role="menuitem"
              aria-label="Share on Telegram"
              className="flex items-center gap-2.5 rounded-full border border-[#229ED9]/[0.45] bg-[#102331] px-3.5 py-2.5 text-[0.85rem] font-semibold text-[#EEF3F8] shadow-[0_8px_25px_rgba(0,0,0,0.3)] transition hover:-translate-y-0.5 hover:bg-[#153449]"
            >
              <FaTelegramPlane size={18} className="text-[#229ED9]" /> Telegram
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