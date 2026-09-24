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
    ShieldCheck,
    Sparkles,
    TrendingUp,
    Users,
    X,
} from "lucide-react";

const tracks = [
    [
        CandlestickChart,
        "Smart Money Concepts: Understanding Institutional Order Flow",
        "Learn how banks and institutions manipulate liquidity pools and order blocks for strategic market positioning.",
        "",
        "#3B9EFF",
    ],
    [
        BrainCircuit,
        "ICT Trading Strategy: Inner Circle Trader Framework",
        "Master liquidity, displacement, and fair value gaps to trade like institutional participants.",
        "",
        "#F0B429",
    ],
    [
        BarChart3,
        "Liquidity Trading: Market Microstructure & Order Flow Analysis",
        "Use footprint charts, VWAP, and order book data to decode hidden market intentions and precise entries.",
        "",
        "#35D07F",
    ],
    [
        TrendingUp,
        "AI-Powered Trading: Modern Algorithmic Approaches",
        "Leverage NLP news analytics, volume spikes, and AI algorithms for enhanced trading precision in 2025.",
        "",
        "#E8836B",
    ],
    [
        Bitcoin,
        "Central Bank Divergence: Trading Policy Shifts in 2025-2026",
        "Navigate the fragmented global easing cycle and policy uncertainty affecting major currency pairs.",
        "",
        "#A78BFA",
    ],
    [
        ShieldCheck,
        "Advanced Risk Management: Adaptive Position Sizing",
        "Implement equity guards, ATR-aware stops, and regime-based risk controls for modern market conditions.",
        "",
        "#22E8D4",
    ],
];

const articleContent = {
    "Smart Money Concepts: Understanding Institutional Order Flow": {
        summary: "Smart Money Concepts (SMC) is a trading approach that aims to understand and replicate the strategies used by institutional traders like banks and hedge funds. By identifying how these institutions position themselves, you can anticipate their moves and potentially profit from them.",
        points: ["Market structure analysis", "Order blocks identification", "Liquidity pools recognition", "Institutional order flow"],
    },
    "ICT Trading Strategy: Inner Circle Trader Framework": {
        summary: "ICT trading is a way of reading price action through the perspective of big institutions. The key concepts are liquidity, displacement, and fair value gaps. This framework helps traders think like institutional participants rather than retail traders.",
        points: ["Liquidity zones", "Fair value gaps", "Displacement concepts", "Market structure shifts"],
    },
    "Liquidity Trading: Market Microstructure & Order Flow Analysis": {
        summary: "Modern liquidity trading involves understanding market microstructure, bid-ask dynamics, and institutional liquidity pools. Advanced traders use footprint charts, order book data, and high-frequency analytics to anticipate liquidity gaps and optimize trade entries.",
        points: ["Market microstructure", "Order flow decoding", "Bid-ask dynamics", "Liquidity pool analysis"],
    },
    "AI-Powered Trading: Modern Algorithmic Approaches": {
        summary: "Leading traders now tap into complex algorithms that decipher layers of market noise. AI-powered trading tools analyze massive amounts of data, including NLP news analytics, volume spikes, and algorithmic patterns that account for over 50% of daily volume shifts in major currency pairs.",
        points: ["AI market analysis", "NLP news integration", "Volume spike detection", "Algorithmic pattern recognition"],
    },
    "Central Bank Divergence: Trading Policy Shifts in 2025-2026": {
        summary: "The global easing cycle has fragmented, with the Fed taking a dovish shift while the ECB and Bank of England remain cautious. This divergence creates opportunities in EUR/USD, GBP/USD, and other major pairs as central bank policies move in different directions.",
        points: ["Central bank policy analysis", "Policy divergence trading", "Interest rate differentials", "Macro event impact"],
    },
    "Advanced Risk Management: Adaptive Position Sizing": {
        summary: "Modern risk management goes beyond simple percentage-based rules. Advanced approaches include equity guards, ATR-aware stop-loss placement, regime-based risk controls, and volatility gates that adapt to changing market conditions and protect capital during uncertain periods.",
        points: ["ATR-based position sizing", "Equity protection guards", "Volatility filtering", "Regime-based risk adjustment"],
    },
};

function getArticleParagraphs(article) {
    const content = articleContent[article.title];
    const points = content?.points || ["Core concepts", "Practical examples", "Market context", "Risk awareness"];
    return [
        content?.summary || article.description,
        `In practical terms, ${article.description.toLowerCase()} Studying this topic helps you understand modern market dynamics and institutional behavior before making decisions, giving you a clearer way to evaluate both opportunity and risk in today's complex Forex environment.`,
        `The most useful ideas to carry forward are ${points.slice(0, 3).join(", ")}, and disciplined execution. These principles work together to turn information into a repeatable learning process that aligns with institutional trading practices.`,
    ];
}

export default function AcademicsSection() {
    const [chatOpen, setChatOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);

    useEffect(() => {
        const closeOnEscape = (event) => {
            if (event.key === "Escape") setSelectedArticle(null);
        };
        const previousBodyOverflow = document.body.style.overflow;
        const previousDocumentOverflow = document.documentElement.style.overflow;
        const shouldLockScroll = selectedArticle;

        document.addEventListener("keydown", closeOnEscape);
        document.body.style.overflow = shouldLockScroll ? "hidden" : previousBodyOverflow;
        document.documentElement.style.overflow = shouldLockScroll ? "hidden" : previousDocumentOverflow;

        return () => {
            document.removeEventListener("keydown", closeOnEscape);
            document.body.style.overflow = previousBodyOverflow;
            document.documentElement.style.overflow = previousDocumentOverflow;
        };
    }, [selectedArticle]);

    return (
        <div className="relative overflow-hidden bg-[#050812] text-[#EEF3F8]">
            <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_top_right,rgba(59,158,255,0.13),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(240,180,41,0.08),transparent_55%),linear-gradient(180deg,rgba(8,11,24,0.9),#050812)]" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(59,158,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(59,158,255,0.35)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent_80%)]" />


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
                                        {index < 2 ? "Institutional Concepts" : "Advanced Trading"}
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

            <section className="relative pb-[120px] max-[900px]:pb-[84px] mt-3">
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