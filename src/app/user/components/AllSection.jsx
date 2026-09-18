// "use client";

// import Script from "next/script";
// import { useState, useEffect } from "react";
// import TradingViewWidget from "./Tradeview";
// import TradingViewTicker from "./TradingViewTicker";
// import TradingViewHeatmap from "./TradingViewHeatMap";

// export default function AllSection() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [aiSignalConfidence, setAiSignalConfidence] = useState(87.3);
//   const [selectedSymbol, setSelectedSymbol] = useState("TVC:GOLD");
//   const [selectedSymbolName, setSelectedSymbolName] = useState("GOLD / USD");

//   const navItems = ["about", "services", "platform", "technology", "heatmap", "vision", "faq", "Course"];

//   const symbols = [
//     { name: "GOLD / USD", symbol: "TVC:GOLD" },
//     { name: "SOL / USD", symbol: "BINANCE:SOLUSDT" },
//     { name: "ETH / USD", symbol: "BINANCE:ETHUSDT" },
//     { name: "BTC / USD", symbol: "BINANCE:BTCUSDT" },
//     { name: "XRP / USD", symbol: "BINANCE:XRPUSDT" },
//     { name: "ADA / USD", symbol: "BINANCE:ADAUSDT" },
//     { name: "DOGE / USD", symbol: "BINANCE:DOGEUSDT" },
//     { name: "MATIC / USD", symbol: "BINANCE:MATICUSDT" },
//     { name: "DOT / USD", symbol: "BINANCE:DOTUSDT" },
//     { name: "LINK / USD", symbol: "BINANCE:LINKUSDT" },
//     { name: "BNB / USD", symbol: "BINANCE:BNBUSDT" },
//     { name: "AVAX / USD", symbol: "BINANCE:AVAXUSDT" },
//     { name: "LTC / USD", symbol: "BINANCE:LTCUSDT" },
//     { name: "UNI / USD", symbol: "BINANCE:UNIUSDT" },
//     { name: "ATOM / USD", symbol: "BINANCE:ATOMUSDT" },
//   ];

//   const handleSymbolChange = (symbol, name) => {
//     setSelectedSymbol(symbol);
//     setSelectedSymbolName(name);
//   };

//   useEffect(() => {
//     document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
//     const closeOnEscape = (event) => {
//       if (event.key === "Escape") setMobileMenuOpen(false);
//     };
//     document.addEventListener("keydown", closeOnEscape);
//     return () => {
//       document.body.style.overflow = "";
//       document.removeEventListener("keydown", closeOnEscape);
//     };
//   }, [mobileMenuOpen]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setAiSignalConfidence((prev) => {
//         const variation = (Math.random() - 0.5) * 2;
//         const newValue = Math.max(75, Math.min(95, prev + variation));
//         return Math.round(newValue * 10) / 10;
//       });
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);





//   return (
//     <>
//       {/* ============ BACKGROUND VIDEO ============ */}
//       <video
//         autoPlay muted loop playsInline id="bg-video"
//         className="fixed top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -z-[3] -translate-x-1/2 -translate-y-1/2 object-cover [filter:brightness(0.25)_contrast(1.2)_saturate(1.3)_hue-rotate(180deg)]"
//       >
//         <source src="https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4" type="video/mp4" />
//       </video>

//       {/* BACKGROUND OVERLAYS */}
//       <div className="fixed inset-0 -z-[2] pointer-events-none [background:radial-gradient(ellipse_at_top,rgba(59,158,255,0.10),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(240,180,41,0.06),transparent_60%),linear-gradient(180deg,rgba(8,11,24,0.85),rgba(5,8,18,0.95))]" />

//       <div className="fixed inset-0 -z-[1] pointer-events-none opacity-[0.035] [background-image:url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_width=%27120%27_height=%27120%27%3E%3Cfilter_id=%27n%27%3E%3CfeTurbulence_type=%27fractalNoise%27_baseFrequency=%270.9%27_numOctaves=%272%27_stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect_width=%27100%25%27_height=%27100%25%27_filter=%27url(%23n)%27/%3E%3C/svg%3E')]" />

//       <div className="fixed inset-0 z-0 pointer-events-none [background-image:linear-gradient(rgba(59,158,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,158,255,0.05)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black_20%,transparent_75%)]" />

//       <canvas id="particles" className="fixed inset-0 z-[1] pointer-events-none" />

//       <div id="cursor-glow" className="fixed top-0 left-0 w-[520px] h-[520px] rounded-full pointer-events-none z-[2] opacity-0 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 [background:radial-gradient(circle,rgba(59,158,255,0.12)_0%,rgba(59,158,255,0)_70%)]" />

//       {/* ============ HEADER ============ */}
//       <header id="siteHeader" className="fixed top-0 left-0 right-0 z-50 py-[18px] border-b border-transparent transition-[padding,background,border-color] duration-400">
//         <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5 flex items-center justify-between">
//           <a href="#top" aria-label="JMFinex home" className="flex items-center gap-2.5 font-display text-[1.35rem] font-bold -tracking-[0.01em]">
//             <img src="/logo.png" alt="JMFinex Logo" className="w-[240px] max-w-full block" />
//           </a>

//           <nav className="hidden max-[900px]:!hidden [@media(min-width:901px)]:flex items-center gap-[38px]">
//             {navItems.map((id) => (
//               <a
//                 key={id}
//                 href={id.toLowerCase() === "course" ? "/user/course" : `#${id}`}
//                 target={id.toLowerCase() === "course" ? "_blank" : undefined}
//                 rel={id.toLowerCase() === "course" ? "noopener noreferrer" : undefined}
//                 className="relative text-[0.88rem] font-medium text-[#8B98B0] transition-colors duration-250 hover:text-[#EEF2F8] after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-0 after:h-px after:[background:linear-gradient(90deg,#3B9EFF,#F0B429)] after:transition-[width] after:duration-350 hover:after:w-full capitalize"
//               >
//                 {id === "faq" ? "FAQ" : id}
//               </a>
//             ))}
//           </nav>

//           <div className="hidden min-[901px]:flex items-center gap-3.5">
//             <a href="#"
//               className="relative inline-flex items-center justify-center gap-2.5 rounded-full font-semibold text-[0.86rem] cursor-pointer border border-white/[0.22] bg-white/[0.02] overflow-hidden whitespace-nowrap py-[11px] px-6 text-[#EEF2F8] transition-transform duration-350 hover:border-[#F0B429] hover:bg-[#F0B429]/[0.14] hover:-translate-y-0.5"
//             >
//               <span className="relative z-[2]">Explore Platform</span>
//             </a>
//             <a href="/user/login"
//               className="group relative inline-flex items-center justify-center gap-2.5 rounded-full font-semibold text-[0.86rem] cursor-pointer border border-transparent overflow-hidden whitespace-nowrap py-[11px] px-6 text-[#0A0E1A] [background:linear-gradient(135deg,#F0B429_0%,#D4A017_100%)] transition-transform duration-350 hover:-translate-y-0.5 hover:[box-shadow:0_12px_32px_-8px_rgba(240,180,41,.55),0_0_24px_-4px_rgba(255,215,0,.4)] before:content-[''] before:absolute before:top-0 before:-left-[75%] before:w-1/2 before:h-full before:z-[1] before:[background:linear-gradient(115deg,transparent,rgba(255,240,200,0.6),transparent)] before:[transform:skewX(-20deg)] before:transition-[left] before:duration-700 hover:before:left-[130%]"
//             >
//               <span className="relative z-[2]">Get SignIn</span>
//             </a>
//           </div>

//           <div
//             className="min-[901px]:hidden flex flex-col gap-[5px] cursor-pointer z-[60] w-[26px]"
//             id="burger" aria-label="Open menu" aria-expanded={mobileMenuOpen} role="button" tabIndex={0}
//             onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
//             onKeyDown={(event) => {
//               if (event.key === "Enter" || event.key === " ") {
//                 event.preventDefault();
//                 setMobileMenuOpen((isOpen) => !isOpen);
//               }
//             }}
//           >
//             <span className={`h-0.5 w-full bg-[#EEF2F8] rounded-[2px] transition-transform duration-350 ${mobileMenuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
//             <span className={`h-0.5 w-full bg-[#EEF2F8] rounded-[2px] transition-opacity duration-350 ${mobileMenuOpen ? "opacity-0" : "opacity-100"}`} />
//             <span className={`h-0.5 w-full bg-[#EEF2F8] rounded-[2px] transition-transform duration-350 ${mobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
//           </div>
//         </div>
//       </header>

//       {/* ============ MOBILE MENU ============ */}
//       <div
//         className={`mobile-menu fixed inset-0 z-[55] flex flex-col items-center justify-center gap-[34px] [background:rgba(8,11,24,0.98)] backdrop-blur-[20px] transition-[opacity,transform,visibility] duration-400 ${mobileMenuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-3"}`}
//         id="mobileMenu"
//       >
//         <button
//           onClick={() => setMobileMenuOpen(false)}
//           className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center text-white hover:text-[#F0B429] transition-colors duration-300 bg-white/5 rounded-full hover:bg-white/10"
//           aria-label="Close menu"
//           style={{ color: "#ffffff" }}
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//             <line x1="18" y1="6" x2="6" y2="18"></line>
//             <line x1="6" y1="6" x2="18" y2="18"></line>
//           </svg>
//         </button>

//         {/* {navItems.map((id) => (
//           <a
//             key={id}
//             href={`#${id}`}
//             onClick={() => setMobileMenuOpen(false)}
//             className={`mobile-menu-link font-display text-[1.6rem] transition-[opacity,transform] duration-500 capitalize ${mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
//             style={{ color: "#ffffff" }}
//           >
//             {id === "faq" ? "FAQ" : id}
//           </a>
//         ))} */}
//         {navItems.map((id) => (
//           <a
//             key={id}
//             href={id.toLowerCase() === "academics" ? "/user/academic" : `#${id}`}
//             target={id.toLowerCase() === "academics" ? "_blank" : undefined}
//             rel={id.toLowerCase() === "academics" ? "noopener noreferrer" : undefined}
//             onClick={() => setMobileMenuOpen(false)}
//             className={`mobile-menu-link font-display text-[1.6rem] transition-[opacity,transform] duration-500 capitalize ${mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
//             style={{ color: "#ffffff" }}
//           >
//             {id === "faq" ? "FAQ" : id}
//           </a>
//         ))}
//         <a
//           href="#"
//           onClick={() => setMobileMenuOpen(false)}
//           className="mobile-menu-cta mt-2.5 relative inline-flex items-center justify-center gap-2.5 rounded-full font-semibold py-[15px] px-[30px] text-[0.94rem] [background:linear-gradient(135deg,#F0B429_0%,#D4A017_100%)]"
//           style={{ color: "#0A0E1A" }}
//         >
//           <span style={{ color: "#0A0E1A" }}>Get Signup</span>
//         </a>
//       </div>

//       {/* ============ MAIN ============ */}
//       <main id="top">
//         {/* HERO */}
//         <section className="relative py-[120px] max-[900px]:py-[84px] min-h-screen !flex items-center !pt-[120px] !pb-[60px] overflow-hidden">
//           <div id="heroGlow" className="absolute -top-[10%] -right-[12%] w-[900px] h-[900px] rounded-full pointer-events-none transition-transform duration-500 [background:radial-gradient(circle,rgba(59,158,255,0.18)_0%,rgba(59,158,255,0)_62%)] blur-[10px]" />
//           <div className="absolute -bottom-[14%] -left-[10%] w-[640px] h-[640px] rounded-full pointer-events-none [background:radial-gradient(circle,rgba(240,180,41,0.10)_0%,rgba(240,180,41,0)_65%)] blur-[10px]" />

//           <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5 grid gap-10 items-center [grid-template-columns:1.05fr_1fr] max-[980px]:!grid-cols-1 relative">
//             <div className="hero-copy">
//               <span className="inline-flex items-center gap-2.5 font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[#3B9EFF] mb-[18px] opacity-0 [animation:heroFadeUp_0.8s_var(--ease-brand)_0.1s_forwards] before:content-[''] before:w-[22px] before:h-px before:bg-[#3B9EFF] before:[box-shadow:0_0_8px_#3B9EFF]">
//                 AI-Powered Trading Technology
//               </span>
//               <h1 className="font-display font-semibold text-[#EEF2F8] -tracking-[0.02em] leading-[1.06] opacity-0 [font-size:clamp(2.5rem,5.4vw,4.3rem)] [animation:heroFadeUp_0.9s_var(--ease-brand)_0.25s_forwards]">
//                 Learn. Trade.
//                 <br />
//                 Grow{" "}
//                 <span className="inline-block bg-gradient-to-br from-[#3B9EFF] to-[#F0B429] bg-clip-text text-transparent">
//                   Smarter.
//                 </span>
//               </h1>
//               <p className="mt-6 text-[1.15rem] text-[#8B98B0] max-w-[460px] leading-[1.6] opacity-0 [animation:heroFadeUp_0.9s_var(--ease-brand)_0.4s_forwards]">
//                 JMFinex is a next-generation trading technology ecosystem — combining AI-driven analytics, automated infrastructure and real-time global market data into a single, secure platform.
//               </p>
//               <div className="flex gap-4 mt-[38px] flex-wrap opacity-0 [animation:heroFadeUp_0.9s_var(--ease-brand)_0.55s_forwards]">
//                 <a href="#" className="relative inline-flex items-center justify-center gap-2.5 rounded-full font-semibold py-[15px] px-[30px] text-[0.94rem] !text-[#0A0E1A] [background:linear-gradient(135deg,#F0B429_0%,#D4A017_100%)] transition-transform duration-350 hover:-translate-y-0.5 hover:[box-shadow:0_12px_32px_-8px_rgba(240,180,41,.55),0_0_24px_-4px_rgba(255,215,0,.4)]">
//                   <span className="transition-colors duration-300 hover:text-white">Explore Platform</span>
//                 </a>
//                 <a href="#" className="relative inline-flex items-center justify-center gap-2.5 rounded-full font-semibold py-[15px] px-[30px] text-[0.94rem] text-[#EEF2F8] border border-white/[0.22] bg-white/[0.02] transition-transform duration-350 hover:border-[#F0B429] hover:bg-[#F0B429]/[0.14] hover:-translate-y-0.5">
//                   <span>Get Signup</span>
//                 </a>
//               </div>
//               <div className="flex gap-9 mt-14 flex-wrap opacity-0 [animation:heroFadeUp_0.9s_var(--ease-brand)_0.7s_forwards]">
//                 <div>
//                   <b id="statMarkets" className="block font-display text-[1.7rem] text-[#EEF2F8]">0</b>
//                   <span className="text-[0.78rem] text-[#5D6B85] tracking-[0.03em]">Markets Tracked</span>
//                 </div>
//                 <div>
//                   <b id="statNodes" className="block font-display text-[1.7rem] text-[#EEF2F8]">0</b>
//                   <span className="text-[0.78rem] text-[#5D6B85] tracking-[0.03em]">Global Data Nodes</span>
//                 </div>
//                 <div>
//                   <b className="block font-display text-[1.7rem] text-[#EEF2F8]">24/7</b>
//                   <span className="text-[0.78rem] text-[#5D6B85] tracking-[0.03em]">Live Market Sync</span>
//                 </div>
//               </div>
//             </div>

//             <div className="relative h-[560px] max-[980px]:h-[400px] max-[980px]:mt-5 flex items-center justify-center transition-transform duration-300 [will-change:transform]">
//               <canvas id="globe-canvas" style={{ display: "none" }} className="w-full h-full max-w-[560px]" />
//               <img src="/banner-img.jpg" alt="JMFinex Platform" className="max-w-full max-h-full object-contain" />
//               <div className="absolute top-[6%] -left-[4%] max-[980px]:left-0 rounded-[14px] border border-[rgba(120,160,220,0.18)] [background:rgba(15,22,45,0.6)] backdrop-blur-[16px] font-mono text-[0.78rem] max-[420px]:text-[0.7rem] text-[#8B98B0] py-3.5 px-[18px] [box-shadow:0_20px_50px_-20px_rgba(0,0,0,.6)] animate-floaty [animation-delay:0.2s] transition-[border-color] hover:border-[rgba(240,180,41,0.5)]">
//                 <b className="block font-display text-[#3B9EFF] text-base mb-0.5">BTC · ETH</b>
//                 Digital asset feed live
//               </div>
//               <div className="absolute bottom-[12%] -right-[6%] max-[980px]:right-0 rounded-[14px] border border-[rgba(120,160,220,0.18)] [background:rgba(15,22,45,0.6)] backdrop-blur-[16px] font-mono text-[0.78rem] max-[420px]:text-[0.7rem] text-[#8B98B0] py-3.5 px-[18px] [box-shadow:0_20px_50px_-20px_rgba(0,0,0,.6)] animate-floaty [animation-delay:1.4s] transition-[border-color] hover:border-[rgba(240,180,41,0.5)]">
//                 <b className="block font-display text-[#3B9EFF] text-base mb-0.5">AI Engine</b>
//                 Pattern signals active
//               </div>
//               <div className="absolute bottom-0 left-[2%] max-[980px]:hidden rounded-[14px] border border-[rgba(120,160,220,0.18)] [background:rgba(15,22,45,0.6)] backdrop-blur-[16px] font-mono text-[0.78rem] text-[#8B98B0] py-3.5 px-[18px] [box-shadow:0_20px_50px_-20px_rgba(0,0,0,.6)] animate-floaty [animation-delay:0.8s] transition-[border-color] hover:border-[rgba(240,180,41,0.5)]">
//                 <b className="block font-display text-[#3B9EFF] text-base mb-0.5">Uptime 99.9%</b>
//                 Infrastructure status
//               </div>
//             </div>
//           </div>

//           <div className="absolute bottom-[26px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#5D6B85] font-mono text-[0.68rem] tracking-[0.15em] uppercase transition-opacity duration-400">
//             <span>Scroll</span>
//             <div className="w-px h-[34px] [background:linear-gradient(#3B9EFF,transparent)] animate-[scrollLine_2s_ease-in-out_infinite]" />
//           </div>
//         </section>

//         {/* TICKER */}
//         <TradingViewTicker />

//         {/* ABOUT */}
//         <section className="relative py-[120px] max-[900px]:py-[84px] border-t border-b border-[rgba(120,160,220,0.16)] [background:linear-gradient(180deg,rgba(12,20,42,.5),rgba(5,8,18,.7))]" id="about">
//           <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5 grid gap-16 items-center [grid-template-columns:.95fr_1.05fr] max-[900px]:!grid-cols-1">
//             <div className="relative min-h-[460px] rounded-[18px] overflow-hidden border border-[rgba(120,160,220,0.16)] [background:url('/1.png')_center/cover] after:content-[''] after:absolute after:inset-0 after:[background:linear-gradient(180deg,transparent,rgba(5,8,18,.8))]">
//               <div className="absolute z-[2] bottom-[22px] left-[22px] py-3.5 px-[18px] rounded-xl [background:rgba(5,8,18,.85)] border border-[rgba(120,160,220,0.16)] font-mono text-[0.75rem] text-[#8B98B0]">
//                 <strong className="block text-[#F0B429] text-[1.2rem] mb-1.5">Built For The Future</strong>
//                 Intelligent. Secure. Scalable.
//               </div>
//             </div>
//             <div>
//               <span className="inline-flex items-center gap-2.5 font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[#3B9EFF] mb-[18px] before:content-[''] before:w-[22px] before:h-px before:bg-[#3B9EFF] before:[box-shadow:0_0_8px_#3B9EFF]">
//                 About JMFinex
//               </span>
//               <h2 className="font-display font-semibold text-[#EEF2F8] leading-[1.1] mb-5 [font-size:clamp(1.9rem,3.6vw,2.75rem)]">
//                 Turning complex market data into{" "}
//                 <span className="inline-block bg-gradient-to-br from-[#3B9EFF] to-[#F0B429] bg-clip-text text-transparent">
//                   clear opportunities.
//                 </span>
//               </h2>
//               <p className="text-[#8B98B0] leading-[1.75] mb-[25px]">
//                 JMFinex is a next-generation digital trading technology platform designed for modern market participants. Our ecosystem combines advanced data infrastructure, artificial intelligence and automation to simplify the way users understand and interact with global markets.
//               </p>
//               <p className="text-[#8B98B0] leading-[1.75] mb-[25px]">
//                 We focus on building practical tools that provide clarity, speed and control without compromising security or transparency.
//               </p>
//               <div className="grid grid-cols-2 gap-[18px] max-[640px]:!grid-cols-1">
//                 {[
//                   ["Data First", "Reliable market intelligence from multiple global sources."],
//                   ["AI Assisted", "Models designed to identify trends, momentum and volatility."],
//                   ["Built To Scale", "Infrastructure created for continuous growth and performance."],
//                   ["User Focused", "Simple interfaces designed for confident decision-making."],
//                 ].map(([title, desc]) => (
//                   <div key={title} className="pl-[15px] border-l-2 border-[#3B9EFF]">
//                     <strong className="block font-display mb-1.5 text-[#EEF2F8]">{title}</strong>
//                     <span className="text-[#8B98B0] text-[0.85rem] leading-[1.5]">{desc}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* SERVICES */}
//         <section className="relative py-[120px] max-[900px]:py-[84px]" id="services">
//           <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5">
//             <div className="reveal max-w-[640px] mb-14">
//               <span className="inline-flex items-center gap-2.5 font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[#3B9EFF] mb-[18px] before:content-[''] before:w-[22px] before:h-px before:bg-[#3B9EFF] before:[box-shadow:0_0_8px_#3B9EFF]">
//                 Our Services
//               </span>
//               <h2 className="font-display font-semibold text-[#EEF2F8] leading-[1.1] [font-size:clamp(1.9rem,3.6vw,2.75rem)]">
//                 Everything you need to operate in modern markets.
//               </h2>
//               <p className="text-[#8B98B0] text-[1.02rem] leading-[1.65] mt-4">
//                 From market intelligence to automated systems, JMFinex provides a complete set of technology services for a smarter digital trading experience.
//               </p>
//             </div>
//             <div className="reveal-stagger grid grid-cols-3 gap-[22px] max-[980px]:!grid-cols-2 max-[640px]:!grid-cols-1">
//               {[
//                 ["◈", "AI Market Intelligence", "Understand market structure through AI-assisted signals, trend analysis and real-time pattern detection.", "/1main.png"],
//                 ["◎", "Forex Technology", "Access organized insights across major, minor and selected exotic currency markets.", "/2.png"],
//                 ["₿", "Digital Asset Analytics", "Monitor digital asset activity with transparent pricing, market depth and consolidated data.", "/3main.png"],
//                 ["⌁", "Portfolio Monitoring", "Track asset allocation, performance indicators and portfolio activity from one dashboard.", "/4.png"],
//                 ["↗", "Automated Execution", "Configure systematic rules and workflows that help you monitor market conditions and execute predefined actions more consistently.", "/5.png"],
//                 ["◉", "Secure Infrastructure", "Modern security layers help protect data, user access and platform operations.", "/6.png"],
//               ].map(([icon, title, desc, img]) => (
//                 <article key={title} className="relative overflow-hidden rounded-[18px] border border-[rgba(120,160,220,0.16)] [background:rgba(15,22,45,0.6)] min-h-[300px] transition-transform duration-[400ms] hover:-translate-y-2.5 hover:border-[rgba(59,158,255,0.55)] hover:[box-shadow:0_25px_55px_rgba(59,158,255,0.12)]">
//                   <div className="relative h-[145px] bg-cover bg-center after:content-[''] after:absolute after:inset-0 after:[background:linear-gradient(180deg,transparent,rgba(15,22,45,0.55))]" style={{ backgroundImage: `url(${img})` }} />
//                   <div className="relative z-[2] -mt-[23px] px-[23px] pb-[25px]">
//                     <div className="w-12 h-12 rounded-[14px] grid place-items-center bg-[#0B1428] text-[#3B9EFF] border border-[rgba(59,158,255,0.28)] mb-[17px] text-[1.3rem]">{icon}</div>
//                     <h3 className="mb-2.5 text-[1.17rem] font-display font-semibold text-[#EEF2F8]">{title}</h3>
//                     <p className="text-[#8B98B0] text-[0.88rem] leading-[1.6]">{desc}</p>
//                   </div>
//                 </article>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* PLATFORM TABS */}
//         <section className="relative py-[120px] max-[900px]:py-[84px] border-t border-b border-[rgba(120,160,220,0.16)] [background:linear-gradient(180deg,rgba(8,14,28,.35),rgba(12,20,42,.65))]" id="platform">
//           <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5">
//             <div className="reveal max-w-[640px] mb-14">
//               <span className="inline-flex items-center gap-2.5 font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[#3B9EFF] mb-[18px] before:content-[''] before:w-[22px] before:h-px before:bg-[#3B9EFF] before:[box-shadow:0_0_8px_#3B9EFF]">
//                 Explore The Platform
//               </span>
//               <h2 className="font-display font-semibold text-[#EEF2F8] leading-[1.1] [font-size:clamp(1.9rem,3.6vw,2.75rem)]">
//                 One ecosystem. Multiple intelligent capabilities.
//               </h2>
//               <p className="text-[#8B98B0] text-[1.02rem] leading-[1.65] mt-4">
//                 Explore the core platform modules built to help you analyze, automate and monitor market activity.
//               </p>
//             </div>
//             <div className="reveal border border-[rgba(120,160,220,0.16)] rounded-3xl p-2.5 [background:rgba(15,22,45,.6)]">
//               <div className="flex flex-wrap gap-2 p-[7px] border-b border-[rgba(120,160,220,0.16)]">
//                 {["Analytics", "Automation", "Market Heatmap", "Security"].map((t, i) => (
//                   <button key={t} className={`tab-button cursor-pointer border rounded-[10px] text-[0.87rem] py-[13px] px-[18px] transition-[color,background,border-color] duration-300 ${i === 0 ? "text-[#F0B429] bg-[#F0B429]/[0.09] border-[rgba(240,180,41,0.25)]" : "text-[#8B98B0] bg-transparent border-transparent hover:text-[#F0B429] hover:bg-[#F0B429]/[0.09] hover:border-[rgba(240,180,41,0.25)]"}`} data-tab={t.toLowerCase().replace(" ", "").replace("market", "global")}>
//                     {t}
//                   </button>
//                 ))}
//               </div>
//               {[
//                 { id: "analytics", label: "01 / Analytics", title: "See the signals behind the movement.", desc: "Powerful charting and AI-assisted market intelligence help transform complex price activity into easier-to-understand insights.", list: ["AI trend and momentum detection", "Volatility and sentiment overlays", "Multi-asset market comparison"], active: true, img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=85" },
//                 { id: "automation", label: "02 / Automation", title: "Let your systems work consistently.", desc: "Configure rules-based workflows that help you monitor market conditions and execute predefined actions more consistently.", list: ["Custom strategy rules", "Automated alerts and monitoring", "Workflow-based execution logic"], active: false, img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=85" },
//                 { id: "global", label: "03 / Market Heatmap", title: "Visualize market movements at a glance.", desc: "Interactive heatmap showing real-time percentage changes across major forex pairs, helping you quickly identify currency strength and weakness.", list: ["Real-time currency performance", "Visual strength/weakness indicators", "Multi-currency correlation view"], active: false, img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=85" },
//                 { id: "security", label: "04 / Security", title: "Designed with protection in mind.", desc: "JMFinex uses layered security principles to help protect account access, data pipelines and platform communication.", list: ["Encrypted data communication", "Protected account access", "Transparent system monitoring"], active: false, img: "https://images.unsplash.com/photo-1573166364518-8d9e8c090a0e?auto=format&fit=crop&w=1000&q=85" },
//               ].map((p) => (
//                 <div key={p.id} id={p.id} className={`${p.active ? "grid animate-tab-fade" : "hidden"} grid-cols-2 max-[900px]:!grid-cols-1 gap-10 items-center py-[42px] px-7 pb-[30px]`}>
//                   <div>
//                     <span className="inline-flex items-center gap-2.5 font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[#3B9EFF] mb-[18px] before:content-[''] before:w-[22px] before:h-px before:bg-[#3B9EFF] before:[box-shadow:0_0_8px_#3B9EFF]">
//                       {p.label}
//                     </span>
//                     <h3 className="text-2xl mb-3.5 font-display font-semibold text-[#EEF2F8]">{p.title}</h3>
//                     <p className="text-[#8B98B0] leading-[1.7] mb-[22px]">{p.desc}</p>
//                     <ul className="grid gap-3">
//                       {p.list.map((item) => (
//                         <li key={item} className="flex items-center gap-2.5 text-[#8B98B0] text-[0.9rem] before:content-['✓'] before:w-[21px] before:h-[21px] before:grid before:place-items-center before:rounded-full before:bg-[#3B9EFF]/[0.12] before:text-[#3B9EFF] before:text-[0.75rem]">
//                           {item}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                   <div className="relative min-h-[300px] rounded-2xl border border-[rgba(120,160,220,0.16)] overflow-hidden after:content-[''] after:absolute after:inset-0 after:[background:linear-gradient(135deg,rgba(5,8,18,.05),rgba(5,8,18,.7))]" style={{ backgroundImage: `linear-gradient(135deg, rgba(59,158,255,.18), transparent 45%), linear-gradient(315deg, rgba(240,180,41,.22), transparent 55%), url(${p.img})`, backgroundPosition: "center", backgroundSize: "cover" }} />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* WHY / FEATURES */}
//         <section className="relative py-[120px] max-[900px]:py-[84px]" id="why">
//           <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5">
//             <div className="reveal max-w-[640px] mb-14">
//               <span className="inline-flex items-center gap-2.5 font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[#3B9EFF] mb-[18px] before:content-[''] before:w-[22px] before:h-px before:bg-[#3B9EFF] before:[box-shadow:0_0_8px_#3B9EFF]">
//                 Why JMFinex
//               </span>
//               <h2 className="font-display font-semibold text-[#EEF2F8] leading-[1.1] [font-size:clamp(1.9rem,3.6vw,2.75rem)]">
//                 Infrastructure built for how modern markets actually move.
//               </h2>
//               <p className="text-[#8B98B0] text-[1.02rem] leading-[1.65] mt-4">
//                 Every layer of the platform — from data ingestion to execution — is engineered around speed, clarity and resilience.
//               </p>
//             </div>
//             <div className="reveal-stagger grid grid-cols-3 gap-[22px] max-[980px]:!grid-cols-2 max-[640px]:!grid-cols-1">
//               {[
//                 ["01", "AI Trading Technology", "Machine-learning models continuously read market structure to surface patterns across timeframes.", <path key="1" d="M12 2a5 5 0 0 1 5 5v3a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5Z M8 12a4 4 0 0 0 8 0M4 21h16M12 16v5" />],
//                 ["02", "Global Forex Markets", "Deep liquidity access across major, minor and exotic currency pairs, synced in real time.", <><circle key="c" cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z" /></>],
//                 ["03", "Digital Asset Markets", "Unified access to major digital assets with transparent pricing and consolidated order books.", <path key="3" d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />],
//                 ["04", "Automated Execution", "Rules-based automation handles routine execution so strategies run consistently, around the clock.", <><path key="4a" d="M4 4h16v16H4z" /><path d="M4 9h16M9 20V9" /></>],
//                 ["05", "Advanced Analytics", "Layered charting, volatility mapping and sentiment overlays built for fast, informed decisions.", <><path key="5a" d="M3 3v18h18" /><path d="M7 15l4-5 3 3 5-7" /></>],
//                 ["06", "Secure Infrastructure", "Encrypted data pipelines and segregated wallet architecture protect every layer of the stack.", <><path key="6a" d="M12 2l8 4v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-4Z" /><path d="M9 12l2 2 4-4" /></>],
//               ].map(([num, title, desc, svgPath]) => (
//                 <div key={title} className="group relative overflow-hidden border border-[rgba(120,160,220,0.16)] rounded-[18px] py-8 px-[26px] [background:rgba(15,22,45,0.6)] transition-[transform,border-color,box-shadow,background-color] duration-[450ms] hover:-translate-y-2 hover:border-[rgba(240,180,41,0.4)] hover:bg-[rgba(15,22,45,0.75)] hover:[box-shadow:0_30px_60px_-30px_rgba(59,158,255,.3),0_0_0_1px_rgba(240,180,41,0.08)] before:content-[''] before:absolute before:inset-0 before:z-0 before:rounded-[inherit] before:p-px before:[background:linear-gradient(135deg,#F0B429_0%,#3B9EFF_45%,transparent_70%)] before:[mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] before:[mask-composite:exclude] before:opacity-0 before:transition-opacity before:duration-[450ms] hover:before:opacity-20">
//                   <span className="relative z-[1] absolute top-5 right-6 font-mono text-[0.72rem] text-[#5D6B85]">{num}</span>
//                   <div className="relative w-[52px] h-[52px] rounded-[14px] flex items-center justify-center bg-[#0A1428] text-[#3B9EFF] mb-[22px] z-[1] transition-[color,transform] duration-500 group-hover:text-[#FFD666] group-hover:-translate-y-0.5 before:content-[''] before:absolute before:-inset-1.5 before:rounded-2xl before:-z-10 before:[background:conic-gradient(from_0deg,transparent_0%,#F0B429_14%,transparent_34%,#3B9EFF_60%,transparent_82%)] before:opacity-40 before:animate-iconspin group-hover:before:opacity-100 group-hover:before:animate-iconspin-fast after:content-[''] after:absolute after:inset-0 after:rounded-[14px] after:bg-[#0A1428] after:-z-10">
//                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-6 h-6 relative z-[2] transition-transform duration-500 group-hover:scale-[1.12] group-hover:-rotate-6">
//                       {svgPath}
//                     </svg>
//                   </div>
//                   <h3 className="relative z-[1] text-[1.15rem] text-[#EEF2F8] mb-2.5 font-semibold">{title}</h3>
//                   <p className="relative z-[1] text-[#8B98B0] text-[0.92rem] leading-[1.6]">{desc}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* TECHNOLOGY / DASHBOARD (DYNAMIC) */}
//         <section className="relative py-[120px] max-[900px]:py-[84px]" id="technology">
//           <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5">
//             <div className="reveal max-w-[640px] mb-14">
//               <span className="inline-flex items-center gap-2.5 font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[#3B9EFF] mb-[18px] before:content-[''] before:w-[22px] before:h-px before:bg-[#3B9EFF] before:[box-shadow:0_0_8px_#3B9EFF]">
//                 AI Trading Ecosystem
//               </span>
//               <h2 className="font-display font-semibold text-[#EEF2F8] leading-[1.1] [font-size:clamp(1.9rem,3.6vw,2.75rem)]">
//                 One dashboard. Every signal that matters.
//               </h2>
//               <p className="text-[#8B98B0] text-[1.02rem] leading-[1.65] mt-4">
//                 A unified view of price action, AI-generated indicators and portfolio composition — designed for clarity under pressure.
//               </p>
//             </div>
//             <div className="reveal relative overflow-hidden rounded-[22px] border border-[rgba(120,160,220,0.16)] [background:linear-gradient(160deg,rgba(15,22,45,0.75),rgba(8,12,26,0.85))] backdrop-blur-[20px] p-7 [box-shadow:0_60px_120px_-60px_rgba(0,0,0,.7)] transition-transform duration-250 [will-change:transform] before:content-[''] before:absolute before:-top-[40%] before:left-[20%] before:w-[60%] before:h-[80%] before:[background:radial-gradient(ellipse,rgba(59,158,255,0.10),transparent_65%)] before:pointer-events-none after:content-[''] after:absolute after:top-0 after:left-0 after:right-0 after:h-0.5 after:[background:linear-gradient(90deg,transparent,#F0B429,#3B9EFF,transparent)] after:[background-size:200%_100%] after:animate-scanline">
//               <div className="flex justify-between items-center mb-[22px] flex-wrap gap-3.5">
//                 <div className="flex gap-[7px]">
//                   <span className="w-[9px] h-[9px] rounded-full bg-[#E8836B]" />
//                   <span className="w-[9px] h-[9px] rounded-full bg-[#F0B429]" />
//                   <span className="w-[9px] h-[9px] rounded-full bg-[#3B9EFF]" />
//                 </div>
//                 <span className="font-mono text-[0.72rem] text-[#5D6B85] tracking-[0.1em] uppercase">JMFinex Console — Live Preview</span>
//                 <div className="flex items-center gap-3">
//                   <span className="w-[9px] h-[9px] rounded-full bg-[#3B9EFF] animate-pulse-dot" />
//                   <span className="font-mono text-[0.72rem] text-[#8B98B0] normal-case tracking-normal">AI engine processing market data</span>
//                 </div>
//               </div>
//               <div className="grid gap-5 [grid-template-columns:2fr_1fr] max-[900px]:!grid-cols-1">
//                 <div className="border border-[rgba(120,160,220,0.16)] rounded-2xl bg-white/[0.015] overflow-hidden">
//                   <div className="p-5">
//                     <div className="flex flex-wrap gap-2 mb-4">
//                       {symbols.map((item) => (
//                         <button key={item.symbol} onClick={() => handleSymbolChange(item.symbol, item.name)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedSymbol === item.symbol ? "bg-[#F0B429] text-[#0A0E1A]" : "bg-white/[0.05] text-[#8B98B0] hover:bg-white/[0.1]"}`}>
//                           {item.name}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="h-[500px]">
//                     <TradingViewWidget defaultSymbol={selectedSymbol} />
//                   </div>
//                 </div>
//                 <div className="flex flex-col gap-4">
//                   <div className="border border-[rgba(120,160,220,0.16)] rounded-2xl py-[18px] px-5 bg-white/[0.015]">
//                     <div className="flex justify-between items-center mb-2.5">
//                       <span className="text-[0.76rem] text-[#5D6B85]">Portfolio Allocation</span>
//                     </div>
//                     {symbols.map((item, index) => {
//                       const widths = [62, 41, 74, 29, 55, 38, 45, 67, 33, 58, 52, 48, 63, 39, 57];
//                       const width = widths[index % widths.length];
//                       const label = item.name.split(" / ")[0];
//                       return (
//                         <div key={item.symbol} className="flex items-center gap-2.5 mt-2">
//                           <span className="w-11 font-mono text-[0.68rem] text-[#5D6B85]">{label}</span>
//                           <div className="flex-1 h-[5px] rounded bg-white/[0.06] overflow-hidden">
//                             <div className="h-full rounded [background:linear-gradient(90deg,#3B9EFF,#F0B429)] transition-[width] duration-[1400ms]" style={{ width: `${width}%` }} />
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                   <div className="border border-[rgba(120,160,220,0.16)] rounded-2xl py-[18px] px-5 bg-white/[0.015]">
//                     <div className="flex justify-between items-center mb-2.5">
//                       <span className="text-[0.76rem] text-[#5D6B85]">AI Signal Confidence</span>
//                     </div>
//                     <div className="font-display text-2xl text-[#EEF2F8]">
//                       {aiSignalConfidence}<span className="text-base text-[#5D6B85]"> %</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-[18px] flex items-center gap-2 font-mono text-[0.68rem] text-[#5D6B85] before:content-[''] before:w-1.5 before:h-1.5 before:border before:border-[#5D6B85] before:rounded-sm before:flex-shrink-0">
//                 Sample interface for illustration purposes. Figures shown are live trading data and results.
//               </div>
//             </div>
//             <div className="grid gap-[18px] mt-[60px] relative [grid-template-columns:repeat(4,1fr)] max-[900px]:!grid-cols-2 max-[560px]:!grid-cols-1">
//               {[
//                 ["DATA", "Market Ingestion", "Continuous feeds from global forex and digital asset venues, normalized in real time."],
//                 ["MODEL", "AI Analysis", "Pattern-recognition models score structure, momentum and volatility across assets."],
//                 ["EXECUTE", "Automated Routing", "Execution logic routes orders through optimized, low-latency infrastructure."],
//                 ["MONITOR", "Live Oversight", "Every position and signal stays visible on a single, unified console."],
//               ].map(([num, title, desc]) => (
//                 <div key={title} className="reveal relative text-left border border-[rgba(120,160,220,0.16)] rounded-2xl py-6 px-5 [background:rgba(15,22,45,0.6)] transition-[transform,border-color,background] duration-[450ms] hover:-translate-y-1.5 hover:border-[rgba(240,180,41,0.45)] hover:bg-[#F0B429]/[0.05]">
//                   <span className="font-mono text-[0.75rem] tracking-[0.1em] text-[#F0B429] animate-fnum-glow">{num}</span>
//                   <h4 className="mt-3 text-base text-[#EEF2F8]">{title}</h4>
//                   <p className="mt-2 text-[#8B98B0] text-[0.85rem] leading-[1.55]">{desc}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* HEATMAP */}
//         <section className="relative py-[120px] max-[900px]:py-[84px]" id="heatmap">
//           <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5">
//             <div className="reveal max-w-[640px] mb-14">
//               <span className="inline-flex items-center gap-2.5 font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[#F0B429] mb-[18px] before:content-[''] before:w-[22px] before:h-px before:bg-[#F0B429] before:[box-shadow:0_0_8px_#F0B429]">
//                 Market Heatmap
//               </span>
//               <h2 className="font-display font-semibold text-[#EEF2F8] leading-[1.1] [font-size:clamp(1.9rem,3.6vw,2.75rem)]">
//                 Real-time currency performance visualization.
//               </h2>
//               <p className="text-[#8B98B0] text-[1.02rem] leading-[1.65] mt-4">
//                 Track percentage changes across major forex pairs with our interactive TradingView heatmap. Green indicates gains, red shows losses.
//               </p>
//             </div>
//             <div className="reveal relative overflow-hidden rounded-[22px] border border-[rgba(120,160,220,0.16)] [background:radial-gradient(ellipse_at_50%_30%,rgba(240,180,41,0.07),transparent_60%),#0A1428] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:z-[2] before:[background:linear-gradient(90deg,transparent,#F0B429,#3B9EFF,transparent)] before:[background-size:200%_100%] before:animate-scanline-slow">
//               <div className="w-full h-[500px] max-[640px]:!h-[400px]">
//                 <TradingViewHeatmap />
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* VISION */}
//         <section className="relative py-[120px] max-[900px]:py-[84px]" id="vision">
//           <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5">
//             <div className="reveal relative overflow-hidden text-center border border-[rgba(120,160,220,0.16)] rounded-[26px] py-20 px-[60px] max-[640px]:!px-[18px] max-[640px]:!py-14 [background:linear-gradient(180deg,rgba(15,22,45,0.65),rgba(6,9,20,0.9))] before:content-[''] before:absolute before:-top-[30%] before:left-1/2 before:-translate-x-1/2 before:w-[900px] before:h-[500px] before:[background:radial-gradient(ellipse,rgba(240,180,41,0.12),transparent_65%)] before:pointer-events-none">
//               <span className="relative inline-flex items-center justify-center gap-2.5 font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[#3B9EFF] mb-[18px] before:content-[''] before:w-[22px] before:h-px before:bg-[#3B9EFF] before:[box-shadow:0_0_8px_#3B9EFF]">
//                 Our Vision
//               </span>
//               <h2 className="relative font-display font-semibold leading-[1.15] max-w-[760px] mx-auto text-[#EEF2F8] [font-size:clamp(2rem,4.2vw,3.2rem)]">
//                 Smart Vision.{" "}
//                 <span className="inline-block bg-gradient-to-br from-[#3B9EFF] to-[#F0B429] bg-clip-text text-transparent">
//                   Stronger Future.
//                 </span>
//               </h2>
//               <div className="reveal-stagger relative grid gap-px mt-14 rounded-2xl overflow-hidden border border-[rgba(120,160,220,0.16)] bg-[rgba(120,160,220,0.16)] [grid-template-columns:repeat(4,1fr)] max-[820px]:!grid-cols-2">
//                 {[
//                   ["Innovation", "New models and tooling are shipped continuously as markets and technology evolve.", <path key="i" d="M9 18h6M10 22h4M12 2a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 2Z" />],
//                   ["Technology", "A modern engineering stack built for speed, uptime and precise execution.", <><rect key="t" x="4" y="9" width="16" height="11" rx="2" /><path d="M8 9V6a4 4 0 0 1 8 0v3" /></>],
//                   ["Transparency", "Clear reporting and visible system status, so users always know what's happening.", <><path key="tr" d="M12 2 3 6v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V6l-9-4Z" /><path d="M9 12l2 2 4-4" /></>],
//                   ["Sustainable Growth", "Infrastructure decisions are made for long-term stability, not short-term shortcuts.", <path key="g" d="M12 22c5-2 8-6 8-11V5l-8-3-8 3v6c0 5 3 9 8 11Z" />],
//                 ].map(([title, desc, svgPath]) => (
//                   <div key={title} className="group text-left bg-[#0A1428] py-[30px] px-[22px] transition-colors duration-400 hover:bg-[#0F1A30]">
//                     <div className="relative w-14 h-14 rounded-full flex items-center justify-center mb-[18px] bg-[#0A1428] z-[1] before:content-[''] before:absolute before:-inset-[5px] before:rounded-full before:-z-10 before:[background:conic-gradient(from_0deg,transparent_0%,#F0B429_18%,transparent_40%,#3B9EFF_65%,transparent_88%)] before:opacity-45 before:animate-iconspin-slow group-hover:before:opacity-90 group-hover:before:animate-iconspin-fast after:content-[''] after:absolute after:inset-0 after:rounded-full after:bg-[#0A1428] after:-z-10">
//                       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="relative w-6 h-6 text-[#3B9EFF] z-[2] transition-transform duration-400 group-hover:scale-110 group-hover:text-[#FFD666]">
//                         {svgPath}
//                       </svg>
//                     </div>
//                     <h4 className="text-[0.98rem] text-[#EEF2F8] mb-2">{title}</h4>
//                     <p className="text-[#8B98B0] text-[0.82rem] leading-[1.55]">{desc}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* HOW IT WORKS */}
//         <section className="relative py-[120px] max-[900px]:py-[84px]" id="how">
//           <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5">
//             <div className="reveal max-w-[640px] mb-14">
//               <span className="inline-flex items-center gap-2.5 font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[#3B9EFF] mb-[18px] before:content-[''] before:w-[22px] before:h-px before:bg-[#3B9EFF] before:[box-shadow:0_0_8px_#3B9EFF]">
//                 How It Works
//               </span>
//               <h2 className="font-display font-semibold text-[#EEF2F8] leading-[1.1] [font-size:clamp(1.9rem,3.6vw,2.75rem)]">
//                 From account to active dashboard, in four steps.
//               </h2>
//             </div>
//             <div className="reveal-stagger grid gap-[22px] [grid-template-columns:repeat(4,1fr)] max-[900px]:!grid-cols-2 max-[560px]:!grid-cols-1">
//               {[
//                 ["01", "Create Account", "Set up a secure JMFinex account with verified access credentials."],
//                 ["02", "Explore Platform", "Get oriented with the console, market feeds and analytics tools."],
//                 ["03", "Access Trading Tools", "Configure charting, automation rules and AI-assisted indicators."],
//                 ["04", "Monitor Market Activity", "Track positions, signals and system status from a single dashboard."],
//               ].map(([num, title, desc]) => (
//                 <div key={title} className="relative border border-[rgba(120,160,220,0.16)] rounded-2xl py-[30px] px-6 [background:rgba(15,22,45,0.6)] transition-[transform,border-color] duration-[450ms] hover:-translate-y-1.5 hover:border-[rgba(240,180,41,0.4)]">
//                   <div className="font-display text-[2.4rem] text-transparent opacity-60 mb-[18px] [-webkit-text-stroke:1px_#3B9EFF] animate-sn-glow">{num}</div>
//                   <h4 className="text-[1.02rem] text-[#EEF2F8] mb-2.5">{title}</h4>
//                   <p className="text-[#8B98B0] text-[0.86rem] leading-[1.55]">{desc}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* FAQ */}
//         <section className="relative py-[120px] max-[900px]:py-[84px]" id="faq">
//           <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5">
//             <div className="reveal mx-auto text-center max-w-[640px] mb-14">
//               <span className="relative inline-flex items-center justify-center gap-2.5 font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[#3B9EFF] mb-[18px] before:content-[''] before:w-[22px] before:h-px before:bg-[#3B9EFF] before:[box-shadow:0_0_8px_#3B9EFF]">
//                 FAQ
//               </span>
//               <h2 className="font-display font-semibold text-[#EEF2F8] leading-[1.1] [font-size:clamp(1.9rem,3.6vw,2.75rem)]">
//                 Common questions
//               </h2>
//             </div>
//             <div className="reveal max-w-[800px] mx-auto">
//               {[
//                 ["What is JMFinex?", "JMFinex is a technology platform that provides AI-assisted analytics, automation tooling and market data infrastructure for forex and digital asset markets.", true],
//                 ["What markets does the platform cover?", "The platform aggregates data and access across major forex pairs and widely-traded digital assets, kept in sync through a global network of data nodes.", false],
//                 ["How does the AI engine work?", "Models analyze historical and live price structure to identify trend, momentum and volatility patterns, which are surfaced as indicators inside the dashboard.", false],
//                 ["How is my data and access secured?", "The platform uses encrypted data pipelines, segregated wallet architecture and standard account-security practices such as verified login and session monitoring.", false],
//                 ["Can I use the automation tools without AI signals?", "Yes. Automation rules can be configured independently, with or without AI-generated indicators layered on top.", false],
//                 ["Is trading activity or performance guaranteed?", "No. JMFinex provides technology and tools only. Trading involves risk, and no outcome or return is guaranteed. See our Risk Disclosure for details.", false],
//               ].map(([q, a, open]) => (
//                 <div key={q} className={`faq-item border-b border-[rgba(120,160,220,0.16)] ${open ? "open" : ""}`}>
//                   <div className="flex items-center justify-between gap-5 cursor-pointer py-[26px] px-1">
//                     <h4 className="text-[1.02rem] font-medium text-[#EEF2F8]">{q}</h4>
//                     <div className={`relative flex-shrink-0 w-[30px] h-[30px] rounded-full border flex items-center justify-center transition-[border-color,background] duration-300 before:content-[''] before:absolute before:w-[10px] before:h-px after:content-[''] after:absolute after:w-px after:h-[10px] before:transition-transform after:transition-transform before:duration-350 after:duration-350 ${open ? "border-[#3B9EFF] bg-[#3B9EFF]/[0.14] before:bg-[#3B9EFF] after:bg-[#3B9EFF] after:scale-y-0" : "border-[rgba(120,160,220,0.16)] before:bg-[#8B98B0] after:bg-[#8B98B0]"}`} />
//                   </div>
//                   <div className={`overflow-hidden transition-[max-height] duration-500 ${open ? "max-h-[300px]" : "max-h-0"}`}>
//                     <p className="text-[#8B98B0] text-[0.92rem] leading-[1.65] max-w-[680px] px-1 pb-[26px]">{a}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* FINAL CTA */}
//         <section className="relative py-[120px] max-[900px]:py-[84px]" id="cta">
//           <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5">
//             <div className="reveal relative overflow-hidden text-center rounded-[26px] py-[90px] px-10 max-[640px]:!px-[22px] max-[640px]:!py-16 bg-[#0A1428] border border-[rgba(120,160,220,0.16)]">
//               <canvas id="ctaParticles" className="absolute inset-0 w-full h-full opacity-50" />
//               <div className="relative z-[2]">
//                 <span className="relative inline-flex items-center justify-center gap-2.5 font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[#3B9EFF] mb-[18px] before:content-[''] before:w-[22px] before:h-px before:bg-[#3B9EFF] before:[box-shadow:0_0_8px_#3B9EFF]">
//                   Get Signup
//                 </span>
//                 <h2 className="font-display font-semibold leading-[1.15] max-w-[680px] mx-auto mb-[34px] text-[#EEF2F8] [font-size:clamp(1.9rem,4vw,3rem)]">
//                   Explore the future of digital trading technology.
//                 </h2>
//                 <a href="#" className="relative inline-flex items-center justify-center gap-2.5 rounded-full font-semibold text-base py-[18px] px-10 text-[#0A0E1A] [background:linear-gradient(135deg,#F0B429_0%,#D4A017_100%)] transition-transform duration-350 hover:-translate-y-0.5 hover:[box-shadow:0_12px_32px_-8px_rgba(240,180,41,.55),0_0_24px_-4px_rgba(255,215,0,.4)]">
//                   <span>Get Signup with JMFinex</span>
//                 </a>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>

//       {/* FOOTER */}
//       <footer className="border-t border-[rgba(120,160,220,0.16)] py-[70px] pb-[30px] bg-[#070C17]">
//         <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5">
//           <div className="grid gap-10 pb-[50px] [grid-template-columns:1.4fr_1fr_1fr_1fr] max-[820px]:!grid-cols-2 max-[520px]:!grid-cols-1">
//             <div>
//               <a href="#top" className="flex items-center gap-2.5 font-display text-[1.35rem] font-bold -tracking-[0.01em]">
//                 <img src="/logo.png" alt="JMFinex Logo" className="w-[240px] max-w-full block" />
//               </a>
//               <p className="text-[#8B98B0] text-[0.86rem] leading-[1.6] mt-4 max-w-[280px]">
//                 An AI-powered trading technology ecosystem for global forex and digital asset markets.
//               </p>
//               <div className="flex gap-3 mt-[22px]">
//                 <a href="#" aria-label="X" className="w-9 h-9 rounded-full border border-[rgba(120,160,220,0.16)] flex items-center justify-center transition-[border-color,background] duration-300 hover:border-[#F0B429] hover:bg-[#F0B429]/[0.14]">
//                   <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px] text-[#8B98B0]"><path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.9L4.5 22H1.4l8.2-9.4L1 2h7l4.9 6.4L18.9 2Z" /></svg>
//                 </a>
//                 <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-full border border-[rgba(120,160,220,0.16)] flex items-center justify-center transition-[border-color,background] duration-300 hover:border-[#F0B429] hover:bg-[#F0B429]/[0.14]">
//                   <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px] text-[#8B98B0]"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2 3.77-2 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9Z" /></svg>
//                 </a>
//                 <a href="#" aria-label="Telegram" className="w-9 h-9 rounded-full border border-[rgba(120,160,220,0.16)] flex items-center justify-center transition-[border-color,background] duration-300 hover:border-[#F0B429] hover:bg-[#F0B429]/[0.14]">
//                   <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px] text-[#8B98B0]"><path d="M21.9 3.5 2.6 11c-1 .4-1 1.7.1 2l4.7 1.5 1.8 5.6c.3.9 1.4 1.1 2 .4l2.6-2.7 4.8 3.6c.9.7 2.2.2 2.4-.9l3-16.4c.2-1.2-1-2.1-2.1-1.6Z" /></svg>
//                 </a>
//               </div>
//             </div>
//             <div>
//               <h5 className="font-mono text-[0.72rem] tracking-[0.12em] uppercase text-[#5D6B85] mb-[18px]">Platform</h5>
//               {[["#why", "Why JMFinex"], ["#technology", "Technology"], ["#global", "Global Network"], ["#how", "How It Works"]].map(([href, label]) => (
//                 <a key={label} href={href} className="block text-[#8B98B0] text-[0.88rem] mb-3 transition-colors duration-250 hover:text-[#F0B429]">{label}</a>
//               ))}
//             </div>
//             <div>
//               <h5 className="font-mono text-[0.72rem] tracking-[0.12em] uppercase text-[#5D6B85] mb-[18px]">Company</h5>
//               {[["#vision", "Vision"], ["#faq", "FAQ"], ["#", "Contact"], ["#", "Careers"]].map(([href, label], i) => (
//                 <a key={label + i} href={href} className="block text-[#8B98B0] text-[0.88rem] mb-3 transition-colors duration-250 hover:text-[#F0B429]">{label}</a>
//               ))}
//             </div>
//             <div>
//               <h5 className="font-mono text-[0.72rem] tracking-[0.12em] uppercase text-[#5D6B85] mb-[18px]">Legal</h5>
//               {[["#", "Privacy Policy"], ["#", "Terms & Conditions"], ["#", "Risk Disclosure"], ["#", "Contact"]].map(([href, label], i) => (
//                 <a key={label + i} href={href} className="block text-[#8B98B0] text-[0.88rem] mb-3 transition-colors duration-250 hover:text-[#F0B429]">{label}</a>
//               ))}
//             </div>
//           </div>
//           <div className="text-[0.78rem] text-[#5D6B85] leading-[1.6] max-w-[900px] mt-[26px] pt-[26px] border-t border-[rgba(120,160,220,0.16)]">
//             <strong className="text-[#8B98B0]">Risk Disclosure:</strong> Trading forex and digital assets involves substantial risk and may not be suitable for all users. Past performance is not indicative of future results, and no returns or outcomes are guaranteed. Figures and charts on this site are illustrative and for demonstration purposes only. Placeholder content — replace with verified regulatory and legal information before launch.
//           </div>
//           <div className="flex justify-between items-center flex-wrap gap-4 border-t border-[rgba(120,160,220,0.16)] pt-[26px] mt-[30px]">
//             <p className="text-[0.78rem] text-[#5D6B85]">© 2026 JMFinex. All rights reserved.</p>
//             <p className="text-[0.78rem] text-[#5D6B85]">Designed as a technology & platform experience.</p>
//           </div>
//         </div>
//       </footer>

//       <Script src="/script.js" strategy="afterInteractive" />
//     </>
//   );
// }


"use client";

import Script from "next/script";
import { useState, useEffect } from "react";
import TradingViewWidget from "./Tradeview";
import TradingViewTicker from "./TradingViewTicker";
import TradingViewHeatmap from "./TradingViewHeatMap";

export default function AllSection() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiSignalConfidence, setAiSignalConfidence] = useState(87.3);
  const [selectedSymbol, setSelectedSymbol] = useState("TVC:GOLD");
  const [selectedSymbolName, setSelectedSymbolName] = useState("GOLD / USD");

  const navItems = ["about", "services", "platform", "technology", "Education", "vision", "faq"];

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

  const handleSymbolChange = (symbol, name) => {
    setSelectedSymbol(symbol);
    setSelectedSymbolName(name);
  };

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAiSignalConfidence((prev) => {
        const variation = (Math.random() - 0.5) * 2;
        const newValue = Math.max(75, Math.min(95, prev + variation));
        return Math.round(newValue * 10) / 10;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);





  return (
    <>
      {/* ============ BACKGROUND VIDEO ============ */}
      <video
        autoPlay muted loop playsInline id="bg-video"
        className="fixed top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -z-[3] -translate-x-1/2 -translate-y-1/2 object-cover [filter:brightness(0.25)_contrast(1.2)_saturate(1.3)_hue-rotate(180deg)]"
      >
        <source src="https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4" type="video/mp4" />
      </video>

      {/* BACKGROUND OVERLAYS */}
      <div className="fixed inset-0 -z-[2] pointer-events-none [background:radial-gradient(ellipse_at_top,rgba(59,158,255,0.10),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(240,180,41,0.06),transparent_60%),linear-gradient(180deg,rgba(8,11,24,0.85),rgba(5,8,18,0.95))]" />

      <div className="fixed inset-0 -z-[1] pointer-events-none opacity-[0.035] [background-image:url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_width=%27120%27_height=%27120%27%3E%3Cfilter_id=%27n%27%3E%3CfeTurbulence_type=%27fractalNoise%27_baseFrequency=%270.9%27_numOctaves=%272%27_stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect_width=%27100%25%27_height=%27100%25%27_filter=%27url(%23n)%27/%3E%3C/svg%3E')]" />

      <div className="fixed inset-0 z-0 pointer-events-none [background-image:linear-gradient(rgba(59,158,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,158,255,0.05)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black_20%,transparent_75%)]" />

      <canvas id="particles" className="fixed inset-0 z-[1] pointer-events-none" />

      <div id="cursor-glow" className="fixed top-0 left-0 w-[520px] h-[520px] rounded-full pointer-events-none z-[2] opacity-0 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 [background:radial-gradient(circle,rgba(59,158,255,0.12)_0%,rgba(59,158,255,0)_70%)]" />

      {/* ============ HEADER ============ */}
      <header id="siteHeader" className="fixed top-0 left-0 right-0 z-50 py-[18px] border-b border-transparent transition-[padding,background,border-color] duration-400">
        <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5 flex items-center justify-between">
          <a href="#top" aria-label="JMFinex home" className="flex items-center gap-2.5 font-display text-[1.35rem] font-bold -tracking-[0.01em]">
            <img src="/logo.png" alt="JMFinex Logo" className="w-[240px] max-w-full block" />
          </a>

          <nav className="hidden max-[900px]:!hidden [@media(min-width:901px)]:flex items-center gap-[38px]">
            {navItems.map((id) => (
              <a
                key={id}
                href={id.toLowerCase() === "education" ? "/user/course" : `#${id}`}
                className="relative text-[0.88rem] font-medium text-[#8B98B0] transition-colors duration-250 hover:text-[#EEF2F8] after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-0 after:h-px after:[background:linear-gradient(90deg,#3B9EFF,#F0B429)] after:transition-[width] after:duration-350 hover:after:w-full capitalize"
              >
                {id === "faq" ? "FAQ" : id}
              </a>
            ))}
          </nav>

          <div className="hidden min-[901px]:flex items-center gap-3.5">
            <a href="#"
              className="relative inline-flex items-center justify-center gap-2.5 rounded-full font-semibold text-[0.86rem] cursor-pointer border border-white/[0.22] bg-white/[0.02] overflow-hidden whitespace-nowrap py-[11px] px-6 text-[#EEF2F8] transition-transform duration-350 hover:border-[#F0B429] hover:bg-[#F0B429]/[0.14] hover:-translate-y-0.5"
            >
              <span className="relative z-[2]">Explore Platform</span>
            </a>
            <a href="#"
              className="group relative inline-flex items-center justify-center gap-2.5 rounded-full font-semibold text-[0.86rem] cursor-pointer border border-transparent overflow-hidden whitespace-nowrap py-[11px] px-6 text-[#0A0E1A] [background:linear-gradient(135deg,#F0B429_0%,#D4A017_100%)] transition-transform duration-350 hover:-translate-y-0.5 hover:[box-shadow:0_12px_32px_-8px_rgba(240,180,41,.55),0_0_24px_-4px_rgba(255,215,0,.4)] before:content-[''] before:absolute before:top-0 before:-left-[75%] before:w-1/2 before:h-full before:z-[1] before:[background:linear-gradient(115deg,transparent,rgba(255,240,200,0.6),transparent)] before:[transform:skewX(-20deg)] before:transition-[left] before:duration-700 hover:before:left-[130%]"
            >
              <span className="relative z-[2]">Get Signup</span>
            </a>
          </div>

          <div
            className="min-[901px]:hidden flex flex-col gap-[5px] cursor-pointer z-[60] w-[26px]"
            id="burger" aria-label="Open menu" aria-expanded={mobileMenuOpen} role="button" tabIndex={0}
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setMobileMenuOpen((isOpen) => !isOpen);
              }
            }}
          >
            <span className={`h-0.5 w-full bg-[#EEF2F8] rounded-[2px] transition-transform duration-350 ${mobileMenuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`h-0.5 w-full bg-[#EEF2F8] rounded-[2px] transition-opacity duration-350 ${mobileMenuOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`h-0.5 w-full bg-[#EEF2F8] rounded-[2px] transition-transform duration-350 ${mobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </div>
        </div>
      </header>

      {/* ============ MOBILE MENU ============ */}
      <div
        className={`mobile-menu fixed inset-0 z-[55] flex flex-col items-center justify-center gap-[34px] [background:rgba(8,11,24,0.98)] backdrop-blur-[20px] transition-[opacity,transform,visibility] duration-400 ${mobileMenuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-3"}`}
        id="mobileMenu"
      >
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center text-white hover:text-[#F0B429] transition-colors duration-300 bg-white/5 rounded-full hover:bg-white/10"
          aria-label="Close menu"
          style={{ color: "#ffffff" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* {navItems.map((id) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={() => setMobileMenuOpen(false)}
            className={`mobile-menu-link font-display text-[1.6rem] transition-[opacity,transform] duration-500 capitalize ${mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ color: "#ffffff" }}
          >
            {id === "faq" ? "FAQ" : id}
          </a>
        ))} */}
        {navItems.map((id) => (
          <a
            key={id}
            href={id.toLowerCase() === "academics" ? "/user/academic" : `#${id}`}
            target={id.toLowerCase() === "academics" ? "_blank" : undefined}
            rel={id.toLowerCase() === "academics" ? "noopener noreferrer" : undefined}
            onClick={() => setMobileMenuOpen(false)}
            className={`mobile-menu-link font-display text-[1.6rem] transition-[opacity,transform] duration-500 capitalize ${mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ color: "#ffffff" }}
          >
            {id === "faq" ? "FAQ" : id}
          </a>
        ))}
        <a
          href="#"
          onClick={() => setMobileMenuOpen(false)}
          className="mobile-menu-cta mt-2.5 relative inline-flex items-center justify-center gap-2.5 rounded-full font-semibold py-[15px] px-[30px] text-[0.94rem] [background:linear-gradient(135deg,#F0B429_0%,#D4A017_100%)]"
          style={{ color: "#0A0E1A" }}
        >
          <span style={{ color: "#0A0E1A" }}>Get Signup</span>
        </a>
      </div>

      {/* ============ MAIN ============ */}
      <main id="top">
        {/* HERO */}
        <section className="relative py-[120px] max-[900px]:py-[84px] min-h-screen !flex items-center !pt-[120px] !pb-[60px] overflow-hidden">
          <div id="heroGlow" className="absolute -top-[10%] -right-[12%] w-[900px] h-[900px] rounded-full pointer-events-none transition-transform duration-500 [background:radial-gradient(circle,rgba(59,158,255,0.18)_0%,rgba(59,158,255,0)_62%)] blur-[10px]" />
          <div className="absolute -bottom-[14%] -left-[10%] w-[640px] h-[640px] rounded-full pointer-events-none [background:radial-gradient(circle,rgba(240,180,41,0.10)_0%,rgba(240,180,41,0)_65%)] blur-[10px]" />

          <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5 grid gap-10 items-center [grid-template-columns:1.05fr_1fr] max-[980px]:!grid-cols-1 relative">
            <div className="hero-copy">
              <span className="inline-flex items-center gap-2.5 font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[#3B9EFF] mb-[18px] opacity-0 [animation:heroFadeUp_0.8s_var(--ease-brand)_0.1s_forwards] before:content-[''] before:w-[22px] before:h-px before:bg-[#3B9EFF] before:[box-shadow:0_0_8px_#3B9EFF]">
                AI-Powered Trading Technology
              </span>
              <h1 className="font-display font-semibold text-[#EEF2F8] -tracking-[0.02em] leading-[1.06] opacity-0 [font-size:clamp(2.5rem,5.4vw,4.3rem)] [animation:heroFadeUp_0.9s_var(--ease-brand)_0.25s_forwards]">
                Learn. Trade.
                <br />
                Grow{" "}
                <span className="inline-block bg-gradient-to-br from-[#3B9EFF] to-[#F0B429] bg-clip-text text-transparent">
                  Smarter.
                </span>
              </h1>
              <p className="mt-6 text-[1.15rem] text-[#8B98B0] max-w-[460px] leading-[1.6] opacity-0 [animation:heroFadeUp_0.9s_var(--ease-brand)_0.4s_forwards]">
                JMFinex is a next-generation trading technology ecosystem — combining AI-driven analytics, automated infrastructure and real-time global market data into a single, secure platform.
              </p>
              <div className="flex gap-4 mt-[38px] flex-wrap opacity-0 [animation:heroFadeUp_0.9s_var(--ease-brand)_0.55s_forwards]">
                <a href="#" className="relative inline-flex items-center justify-center gap-2.5 rounded-full font-semibold py-[15px] px-[30px] text-[0.94rem] !text-[#0A0E1A] [background:linear-gradient(135deg,#F0B429_0%,#D4A017_100%)] transition-transform duration-350 hover:-translate-y-0.5 hover:[box-shadow:0_12px_32px_-8px_rgba(240,180,41,.55),0_0_24px_-4px_rgba(255,215,0,.4)]">
                  <span className="transition-colors duration-300 hover:text-white">Explore Platform</span>
                </a>
                <a href="#" className="relative inline-flex items-center justify-center gap-2.5 rounded-full font-semibold py-[15px] px-[30px] text-[0.94rem] text-[#EEF2F8] border border-white/[0.22] bg-white/[0.02] transition-transform duration-350 hover:border-[#F0B429] hover:bg-[#F0B429]/[0.14] hover:-translate-y-0.5">
                  <span>Get Signup</span>
                </a>
              </div>
              <div className="flex gap-9 mt-14 flex-wrap opacity-0 [animation:heroFadeUp_0.9s_var(--ease-brand)_0.7s_forwards]">
                <div>
                  <b id="statMarkets" className="block font-display text-[1.7rem] text-[#EEF2F8]">0</b>
                  <span className="text-[0.78rem] text-[#5D6B85] tracking-[0.03em]">Markets Tracked</span>
                </div>
                <div>
                  <b id="statNodes" className="block font-display text-[1.7rem] text-[#EEF2F8]">0</b>
                  <span className="text-[0.78rem] text-[#5D6B85] tracking-[0.03em]">Global Data Nodes</span>
                </div>
                <div>
                  <b className="block font-display text-[1.7rem] text-[#EEF2F8]">24/7</b>
                  <span className="text-[0.78rem] text-[#5D6B85] tracking-[0.03em]">Live Market Sync</span>
                </div>
              </div>
            </div>

            <div className="relative h-[560px] max-[980px]:h-[400px] max-[980px]:mt-5 flex items-center justify-center transition-transform duration-300 [will-change:transform]">
              <canvas id="globe-canvas" style={{ display: "none" }} className="w-full h-full max-w-[560px]" />
              <img src="/banner-img.jpg" alt="JMFinex Platform" className="max-w-full max-h-full object-contain" />
              <div className="absolute top-[6%] -left-[4%] max-[980px]:left-0 rounded-[14px] border border-[rgba(120,160,220,0.18)] [background:rgba(15,22,45,0.6)] backdrop-blur-[16px] font-mono text-[0.78rem] max-[420px]:text-[0.7rem] text-[#8B98B0] py-3.5 px-[18px] [box-shadow:0_20px_50px_-20px_rgba(0,0,0,.6)] animate-floaty [animation-delay:0.2s] transition-[border-color] hover:border-[rgba(240,180,41,0.5)]">
                <b className="block font-display text-[#3B9EFF] text-base mb-0.5">BTC · ETH</b>
                Digital asset feed live
              </div>
              <div className="absolute bottom-[12%] -right-[6%] max-[980px]:right-0 rounded-[14px] border border-[rgba(120,160,220,0.18)] [background:rgba(15,22,45,0.6)] backdrop-blur-[16px] font-mono text-[0.78rem] max-[420px]:text-[0.7rem] text-[#8B98B0] py-3.5 px-[18px] [box-shadow:0_20px_50px_-20px_rgba(0,0,0,.6)] animate-floaty [animation-delay:1.4s] transition-[border-color] hover:border-[rgba(240,180,41,0.5)]">
                <b className="block font-display text-[#3B9EFF] text-base mb-0.5">AI Engine</b>
                Pattern signals active
              </div>
              <div className="absolute bottom-0 left-[2%] max-[980px]:hidden rounded-[14px] border border-[rgba(120,160,220,0.18)] [background:rgba(15,22,45,0.6)] backdrop-blur-[16px] font-mono text-[0.78rem] text-[#8B98B0] py-3.5 px-[18px] [box-shadow:0_20px_50px_-20px_rgba(0,0,0,.6)] animate-floaty [animation-delay:0.8s] transition-[border-color] hover:border-[rgba(240,180,41,0.5)]">
                <b className="block font-display text-[#3B9EFF] text-base mb-0.5">Uptime 99.9%</b>
                Infrastructure status
              </div>
            </div>
          </div>

          <div className="absolute bottom-[26px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#5D6B85] font-mono text-[0.68rem] tracking-[0.15em] uppercase transition-opacity duration-400">
            <span>Scroll</span>
            <div className="w-px h-[34px] [background:linear-gradient(#3B9EFF,transparent)] animate-[scrollLine_2s_ease-in-out_infinite]" />
          </div>
        </section>

        {/* TICKER */}
        <TradingViewTicker />

        {/* ABOUT */}
        <section className="relative py-[120px] max-[900px]:py-[84px] border-t border-b border-[rgba(120,160,220,0.16)] [background:linear-gradient(180deg,rgba(12,20,42,.5),rgba(5,8,18,.7))]" id="about">
          <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5 grid gap-16 items-center [grid-template-columns:.95fr_1.05fr] max-[900px]:!grid-cols-1">
            <div className="relative min-h-[460px] rounded-[18px] overflow-hidden border border-[rgba(120,160,220,0.16)] [background:url('/1.png')_center/cover] after:content-[''] after:absolute after:inset-0 after:[background:linear-gradient(180deg,transparent,rgba(5,8,18,.8))]">
              <div className="absolute z-[2] bottom-[22px] left-[22px] py-3.5 px-[18px] rounded-xl [background:rgba(5,8,18,.85)] border border-[rgba(120,160,220,0.16)] font-mono text-[0.75rem] text-[#8B98B0]">
                <strong className="block text-[#F0B429] text-[1.2rem] mb-1.5">Built For The Future</strong>
                Intelligent. Secure. Scalable.
              </div>
            </div>
            <div>
              <span className="inline-flex items-center gap-2.5 font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[#3B9EFF] mb-[18px] before:content-[''] before:w-[22px] before:h-px before:bg-[#3B9EFF] before:[box-shadow:0_0_8px_#3B9EFF]">
                About JMFinex
              </span>
              <h2 className="font-display font-semibold text-[#EEF2F8] leading-[1.1] mb-5 [font-size:clamp(1.9rem,3.6vw,2.75rem)]">
                Turning complex market data into{" "}
                <span className="inline-block bg-gradient-to-br from-[#3B9EFF] to-[#F0B429] bg-clip-text text-transparent">
                  clear opportunities.
                </span>
              </h2>
              <p className="text-[#8B98B0] leading-[1.75] mb-[25px]">
                JMFinex is a next-generation digital trading technology platform designed for modern market participants. Our ecosystem combines advanced data infrastructure, artificial intelligence and automation to simplify the way users understand and interact with global markets.
              </p>
              <p className="text-[#8B98B0] leading-[1.75] mb-[25px]">
                We focus on building practical tools that provide clarity, speed and control without compromising security or transparency.
              </p>
              <div className="grid grid-cols-2 gap-[18px] max-[640px]:!grid-cols-1">
                {[
                  ["Data First", "Reliable market intelligence from multiple global sources."],
                  ["AI Assisted", "Models designed to identify trends, momentum and volatility."],
                  ["Built To Scale", "Infrastructure created for continuous growth and performance."],
                  ["User Focused", "Simple interfaces designed for confident decision-making."],
                ].map(([title, desc]) => (
                  <div key={title} className="pl-[15px] border-l-2 border-[#3B9EFF]">
                    <strong className="block font-display mb-1.5 text-[#EEF2F8]">{title}</strong>
                    <span className="text-[#8B98B0] text-[0.85rem] leading-[1.5]">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="relative py-[120px] max-[900px]:py-[84px]" id="services">
          <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5">
            <div className="reveal max-w-[640px] mb-14">
              <span className="inline-flex items-center gap-2.5 font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[#3B9EFF] mb-[18px] before:content-[''] before:w-[22px] before:h-px before:bg-[#3B9EFF] before:[box-shadow:0_0_8px_#3B9EFF]">
                Our Services
              </span>
              <h2 className="font-display font-semibold text-[#EEF2F8] leading-[1.1] [font-size:clamp(1.9rem,3.6vw,2.75rem)]">
                Everything you need to operate in modern markets.
              </h2>
              <p className="text-[#8B98B0] text-[1.02rem] leading-[1.65] mt-4">
                From market intelligence to automated systems, JMFinex provides a complete set of technology services for a smarter digital trading experience.
              </p>
            </div>
            <div className="reveal-stagger grid grid-cols-3 gap-[22px] max-[980px]:!grid-cols-2 max-[640px]:!grid-cols-1">
              {[
                ["◈", "AI Market Intelligence", "Understand market structure through AI-assisted signals, trend analysis and real-time pattern detection.", "/1main.png"],
                ["◎", "Forex Technology", "Access organized insights across major, minor and selected exotic currency markets.", "/2.png"],
                ["₿", "Digital Asset Analytics", "Monitor digital asset activity with transparent pricing, market depth and consolidated data.", "/3main.png"],
                ["⌁", "Portfolio Monitoring", "Track asset allocation, performance indicators and portfolio activity from one dashboard.", "/4.png"],
                ["↗", "Automated Execution", "Configure systematic rules and workflows that help you monitor market conditions and execute predefined actions more consistently.", "/5.png"],
                ["◉", "Secure Infrastructure", "Modern security layers help protect data, user access and platform operations.", "/6.png"],
              ].map(([icon, title, desc, img]) => (
                <article key={title} className="relative overflow-hidden rounded-[18px] border border-[rgba(120,160,220,0.16)] [background:rgba(15,22,45,0.6)] min-h-[300px] transition-transform duration-[400ms] hover:-translate-y-2.5 hover:border-[rgba(59,158,255,0.55)] hover:[box-shadow:0_25px_55px_rgba(59,158,255,0.12)]">
                  <div className="relative h-[145px] bg-cover bg-center after:content-[''] after:absolute after:inset-0 after:[background:linear-gradient(180deg,transparent,rgba(15,22,45,0.55))]" style={{ backgroundImage: `url(${img})` }} />
                  <div className="relative z-[2] -mt-[23px] px-[23px] pb-[25px]">
                    <div className="w-12 h-12 rounded-[14px] grid place-items-center bg-[#0B1428] text-[#3B9EFF] border border-[rgba(59,158,255,0.28)] mb-[17px] text-[1.3rem]">{icon}</div>
                    <h3 className="mb-2.5 text-[1.17rem] font-display font-semibold text-[#EEF2F8]">{title}</h3>
                    <p className="text-[#8B98B0] text-[0.88rem] leading-[1.6]">{desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PLATFORM TABS */}
        <section className="relative py-[120px] max-[900px]:py-[84px] border-t border-b border-[rgba(120,160,220,0.16)] [background:linear-gradient(180deg,rgba(8,14,28,.35),rgba(12,20,42,.65))]" id="platform">
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
              <div className="flex flex-wrap gap-2 p-[7px] border-b border-[rgba(120,160,220,0.16)]">
                {["Analytics", "Automation", "Market Heatmap", "Security"].map((t, i) => (
                  <button key={t} className={`tab-button cursor-pointer border rounded-[10px] text-[0.87rem] py-[13px] px-[18px] transition-[color,background,border-color] duration-300 ${i === 0 ? "text-[#F0B429] bg-[#F0B429]/[0.09] border-[rgba(240,180,41,0.25)]" : "text-[#8B98B0] bg-transparent border-transparent hover:text-[#F0B429] hover:bg-[#F0B429]/[0.09] hover:border-[rgba(240,180,41,0.25)]"}`} data-tab={t.toLowerCase().replace(" ", "").replace("market", "global")}>
                    {t}
                  </button>
                ))}
              </div>
              {[
                { id: "analytics", label: "01 / Analytics", title: "See the signals behind the movement.", desc: "Powerful charting and AI-assisted market intelligence help transform complex price activity into easier-to-understand insights.", list: ["AI trend and momentum detection", "Volatility and sentiment overlays", "Multi-asset market comparison"], active: true, img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=85" },
                { id: "automation", label: "02 / Automation", title: "Let your systems work consistently.", desc: "Configure rules-based workflows that help you monitor market conditions and execute predefined actions more consistently.", list: ["Custom strategy rules", "Automated alerts and monitoring", "Workflow-based execution logic"], active: false, img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=85" },
                { id: "global", label: "03 / Market Heatmap", title: "Visualize market movements at a glance.", desc: "Interactive heatmap showing real-time percentage changes across major forex pairs, helping you quickly identify currency strength and weakness.", list: ["Real-time currency performance", "Visual strength/weakness indicators", "Multi-currency correlation view"], active: false, img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=85" },
                { id: "security", label: "04 / Security", title: "Designed with protection in mind.", desc: "JMFinex uses layered security principles to help protect account access, data pipelines and platform communication.", list: ["Encrypted data communication", "Protected account access", "Transparent system monitoring"], active: false, img: "https://images.unsplash.com/photo-1573166364518-8d9e8c090a0e?auto=format&fit=crop&w=1000&q=85" },
              ].map((p) => (
                <div key={p.id} id={p.id} className={`${p.active ? "grid animate-tab-fade" : "hidden"} grid-cols-2 max-[900px]:!grid-cols-1 gap-10 items-center py-[42px] px-7 pb-[30px]`}>
                  <div>
                    <span className="inline-flex items-center gap-2.5 font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[#3B9EFF] mb-[18px] before:content-[''] before:w-[22px] before:h-px before:bg-[#3B9EFF] before:[box-shadow:0_0_8px_#3B9EFF]">
                      {p.label}
                    </span>
                    <h3 className="text-2xl mb-3.5 font-display font-semibold text-[#EEF2F8]">{p.title}</h3>
                    <p className="text-[#8B98B0] leading-[1.7] mb-[22px]">{p.desc}</p>
                    <ul className="grid gap-3">
                      {p.list.map((item) => (
                        <li key={item} className="flex items-center gap-2.5 text-[#8B98B0] text-[0.9rem] before:content-['✓'] before:w-[21px] before:h-[21px] before:grid before:place-items-center before:rounded-full before:bg-[#3B9EFF]/[0.12] before:text-[#3B9EFF] before:text-[0.75rem]">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative min-h-[300px] rounded-2xl border border-[rgba(120,160,220,0.16)] overflow-hidden after:content-[''] after:absolute after:inset-0 after:[background:linear-gradient(135deg,rgba(5,8,18,.05),rgba(5,8,18,.7))]" style={{ backgroundImage: `linear-gradient(135deg, rgba(59,158,255,.18), transparent 45%), linear-gradient(315deg, rgba(240,180,41,.22), transparent 55%), url(${p.img})`, backgroundPosition: "center", backgroundSize: "cover" }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY / FEATURES */}
        <section className="relative py-[120px] max-[900px]:py-[84px]" id="why">
          <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5">
            <div className="reveal max-w-[640px] mb-14">
              <span className="inline-flex items-center gap-2.5 font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[#3B9EFF] mb-[18px] before:content-[''] before:w-[22px] before:h-px before:bg-[#3B9EFF] before:[box-shadow:0_0_8px_#3B9EFF]">
                Why JMFinex
              </span>
              <h2 className="font-display font-semibold text-[#EEF2F8] leading-[1.1] [font-size:clamp(1.9rem,3.6vw,2.75rem)]">
                Infrastructure built for how modern markets actually move.
              </h2>
              <p className="text-[#8B98B0] text-[1.02rem] leading-[1.65] mt-4">
                Every layer of the platform — from data ingestion to execution — is engineered around speed, clarity and resilience.
              </p>
            </div>
            <div className="reveal-stagger grid grid-cols-3 gap-[22px] max-[980px]:!grid-cols-2 max-[640px]:!grid-cols-1">
              {[
                ["01", "AI Trading Technology", "Machine-learning models continuously read market structure to surface patterns across timeframes.", <path key="1" d="M12 2a5 5 0 0 1 5 5v3a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5Z M8 12a4 4 0 0 0 8 0M4 21h16M12 16v5" />],
                ["02", "Global Forex Markets", "Deep liquidity access across major, minor and exotic currency pairs, synced in real time.", <><circle key="c" cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z" /></>],
                ["03", "Digital Asset Markets", "Unified access to major digital assets with transparent pricing and consolidated order books.", <path key="3" d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />],
                ["04", "Automated Execution", "Rules-based automation handles routine execution so strategies run consistently, around the clock.", <><path key="4a" d="M4 4h16v16H4z" /><path d="M4 9h16M9 20V9" /></>],
                ["05", "Advanced Analytics", "Layered charting, volatility mapping and sentiment overlays built for fast, informed decisions.", <><path key="5a" d="M3 3v18h18" /><path d="M7 15l4-5 3 3 5-7" /></>],
                ["06", "Secure Infrastructure", "Encrypted data pipelines and segregated wallet architecture protect every layer of the stack.", <><path key="6a" d="M12 2l8 4v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-4Z" /><path d="M9 12l2 2 4-4" /></>],
              ].map(([num, title, desc, svgPath]) => (
                <div key={title} className="group relative overflow-hidden border border-[rgba(120,160,220,0.16)] rounded-[18px] py-8 px-[26px] [background:rgba(15,22,45,0.6)] transition-[transform,border-color,box-shadow,background-color] duration-[450ms] hover:-translate-y-2 hover:border-[rgba(240,180,41,0.4)] hover:bg-[rgba(15,22,45,0.75)] hover:[box-shadow:0_30px_60px_-30px_rgba(59,158,255,.3),0_0_0_1px_rgba(240,180,41,0.08)] before:content-[''] before:absolute before:inset-0 before:z-0 before:rounded-[inherit] before:p-px before:[background:linear-gradient(135deg,#F0B429_0%,#3B9EFF_45%,transparent_70%)] before:[mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] before:[mask-composite:exclude] before:opacity-0 before:transition-opacity before:duration-[450ms] hover:before:opacity-20">
                  <span className="relative z-[1] absolute top-5 right-6 font-mono text-[0.72rem] text-[#5D6B85]">{num}</span>
                  <div className="relative w-[52px] h-[52px] rounded-[14px] flex items-center justify-center bg-[#0A1428] text-[#3B9EFF] mb-[22px] z-[1] transition-[color,transform] duration-500 group-hover:text-[#FFD666] group-hover:-translate-y-0.5 before:content-[''] before:absolute before:-inset-1.5 before:rounded-2xl before:-z-10 before:[background:conic-gradient(from_0deg,transparent_0%,#F0B429_14%,transparent_34%,#3B9EFF_60%,transparent_82%)] before:opacity-40 before:animate-iconspin group-hover:before:opacity-100 group-hover:before:animate-iconspin-fast after:content-[''] after:absolute after:inset-0 after:rounded-[14px] after:bg-[#0A1428] after:-z-10">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-6 h-6 relative z-[2] transition-transform duration-500 group-hover:scale-[1.12] group-hover:-rotate-6">
                      {svgPath}
                    </svg>
                  </div>
                  <h3 className="relative z-[1] text-[1.15rem] text-[#EEF2F8] mb-2.5 font-semibold">{title}</h3>
                  <p className="relative z-[1] text-[#8B98B0] text-[0.92rem] leading-[1.6]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TECHNOLOGY / DASHBOARD (DYNAMIC) */}
        <section className="relative py-[120px] max-[900px]:py-[84px]" id="technology">
          <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5">
            <div className="reveal max-w-[640px] mb-14">
              <span className="inline-flex items-center gap-2.5 font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[#3B9EFF] mb-[18px] before:content-[''] before:w-[22px] before:h-px before:bg-[#3B9EFF] before:[box-shadow:0_0_8px_#3B9EFF]">
                AI Trading Ecosystem
              </span>
              <h2 className="font-display font-semibold text-[#EEF2F8] leading-[1.1] [font-size:clamp(1.9rem,3.6vw,2.75rem)]">
                One dashboard. Every signal that matters.
              </h2>
              <p className="text-[#8B98B0] text-[1.02rem] leading-[1.65] mt-4">
                A unified view of price action, AI-generated indicators and portfolio composition — designed for clarity under pressure.
              </p>
            </div>
            <div className="reveal relative overflow-hidden rounded-[22px] border border-[rgba(120,160,220,0.16)] [background:linear-gradient(160deg,rgba(15,22,45,0.75),rgba(8,12,26,0.85))] backdrop-blur-[20px] p-7 [box-shadow:0_60px_120px_-60px_rgba(0,0,0,.7)] transition-transform duration-250 [will-change:transform] before:content-[''] before:absolute before:-top-[40%] before:left-[20%] before:w-[60%] before:h-[80%] before:[background:radial-gradient(ellipse,rgba(59,158,255,0.10),transparent_65%)] before:pointer-events-none after:content-[''] after:absolute after:top-0 after:left-0 after:right-0 after:h-0.5 after:[background:linear-gradient(90deg,transparent,#F0B429,#3B9EFF,transparent)] after:[background-size:200%_100%] after:animate-scanline">
              <div className="flex justify-between items-center mb-[22px] flex-wrap gap-3.5">
                <div className="flex gap-[7px]">
                  <span className="w-[9px] h-[9px] rounded-full bg-[#E8836B]" />
                  <span className="w-[9px] h-[9px] rounded-full bg-[#F0B429]" />
                  <span className="w-[9px] h-[9px] rounded-full bg-[#3B9EFF]" />
                </div>
                <span className="font-mono text-[0.72rem] text-[#5D6B85] tracking-[0.1em] uppercase">JMFinex Console — Live Preview</span>
                <div className="flex items-center gap-3">
                  <span className="w-[9px] h-[9px] rounded-full bg-[#3B9EFF] animate-pulse-dot" />
                  <span className="font-mono text-[0.72rem] text-[#8B98B0] normal-case tracking-normal">AI engine processing market data</span>
                </div>
              </div>
              <div className="grid gap-5 [grid-template-columns:2fr_1fr] max-[900px]:!grid-cols-1">
                <div className="border border-[rgba(120,160,220,0.16)] rounded-2xl bg-white/[0.015] overflow-hidden">
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {symbols.map((item) => (
                        <button key={item.symbol} onClick={() => handleSymbolChange(item.symbol, item.name)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedSymbol === item.symbol ? "bg-[#F0B429] text-[#0A0E1A]" : "bg-white/[0.05] text-[#8B98B0] hover:bg-white/[0.1]"}`}>
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-[500px]">
                    <TradingViewWidget defaultSymbol={selectedSymbol} />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="border border-[rgba(120,160,220,0.16)] rounded-2xl py-[18px] px-5 bg-white/[0.015]">
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-[0.76rem] text-[#5D6B85]">Portfolio Allocation</span>
                    </div>
                    {symbols.map((item, index) => {
                      const widths = [62, 41, 74, 29, 55, 38, 45, 67, 33, 58, 52, 48, 63, 39, 57];
                      const width = widths[index % widths.length];
                      const label = item.name.split(" / ")[0];
                      return (
                        <div key={item.symbol} className="flex items-center gap-2.5 mt-2">
                          <span className="w-11 font-mono text-[0.68rem] text-[#5D6B85]">{label}</span>
                          <div className="flex-1 h-[5px] rounded bg-white/[0.06] overflow-hidden">
                            <div className="h-full rounded [background:linear-gradient(90deg,#3B9EFF,#F0B429)] transition-[width] duration-[1400ms]" style={{ width: `${width}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border border-[rgba(120,160,220,0.16)] rounded-2xl py-[18px] px-5 bg-white/[0.015]">
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-[0.76rem] text-[#5D6B85]">AI Signal Confidence</span>
                    </div>
                    <div className="font-display text-2xl text-[#EEF2F8]">
                      {aiSignalConfidence}<span className="text-base text-[#5D6B85]"> %</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-[18px] flex items-center gap-2 font-mono text-[0.68rem] text-[#5D6B85] before:content-[''] before:w-1.5 before:h-1.5 before:border before:border-[#5D6B85] before:rounded-sm before:flex-shrink-0">
                Sample interface for illustration purposes. Figures shown are live trading data and results.
              </div>
            </div>
            <div className="grid gap-[18px] mt-[60px] relative [grid-template-columns:repeat(4,1fr)] max-[900px]:!grid-cols-2 max-[560px]:!grid-cols-1">
              {[
                ["DATA", "Market Ingestion", "Continuous feeds from global forex and digital asset venues, normalized in real time."],
                ["MODEL", "AI Analysis", "Pattern-recognition models score structure, momentum and volatility across assets."],
                ["EXECUTE", "Automated Routing", "Execution logic routes orders through optimized, low-latency infrastructure."],
                ["MONITOR", "Live Oversight", "Every position and signal stays visible on a single, unified console."],
              ].map(([num, title, desc]) => (
                <div key={title} className="reveal relative text-left border border-[rgba(120,160,220,0.16)] rounded-2xl py-6 px-5 [background:rgba(15,22,45,0.6)] transition-[transform,border-color,background] duration-[450ms] hover:-translate-y-1.5 hover:border-[rgba(240,180,41,0.45)] hover:bg-[#F0B429]/[0.05]">
                  <span className="font-mono text-[0.75rem] tracking-[0.1em] text-[#F0B429] animate-fnum-glow">{num}</span>
                  <h4 className="mt-3 text-base text-[#EEF2F8]">{title}</h4>
                  <p className="mt-2 text-[#8B98B0] text-[0.85rem] leading-[1.55]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HEATMAP */}
        <section className="relative py-[120px] max-[900px]:py-[84px]" id="heatmap">
          <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5">
            <div className="reveal max-w-[640px] mb-14">
              <span className="inline-flex items-center gap-2.5 font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[#F0B429] mb-[18px] before:content-[''] before:w-[22px] before:h-px before:bg-[#F0B429] before:[box-shadow:0_0_8px_#F0B429]">
                Market Heatmap
              </span>
              <h2 className="font-display font-semibold text-[#EEF2F8] leading-[1.1] [font-size:clamp(1.9rem,3.6vw,2.75rem)]">
                Real-time currency performance visualization.
              </h2>
              <p className="text-[#8B98B0] text-[1.02rem] leading-[1.65] mt-4">
                Track percentage changes across major forex pairs with our interactive TradingView heatmap. Green indicates gains, red shows losses.
              </p>
            </div>
            <div className="reveal relative overflow-hidden rounded-[22px] border border-[rgba(120,160,220,0.16)] [background:radial-gradient(ellipse_at_50%_30%,rgba(240,180,41,0.07),transparent_60%),#0A1428] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:z-[2] before:[background:linear-gradient(90deg,transparent,#F0B429,#3B9EFF,transparent)] before:[background-size:200%_100%] before:animate-scanline-slow">
              <div className="w-full h-[500px] max-[640px]:!h-[400px]">
                <TradingViewHeatmap />
              </div>
            </div>
          </div>
        </section>

        {/* VISION */}
        <section className="relative py-[120px] max-[900px]:py-[84px]" id="vision">
          <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5">
            <div className="reveal relative overflow-hidden text-center border border-[rgba(120,160,220,0.16)] rounded-[26px] py-20 px-[60px] max-[640px]:!px-[18px] max-[640px]:!py-14 [background:linear-gradient(180deg,rgba(15,22,45,0.65),rgba(6,9,20,0.9))] before:content-[''] before:absolute before:-top-[30%] before:left-1/2 before:-translate-x-1/2 before:w-[900px] before:h-[500px] before:[background:radial-gradient(ellipse,rgba(240,180,41,0.12),transparent_65%)] before:pointer-events-none">
              <span className="relative inline-flex items-center justify-center gap-2.5 font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[#3B9EFF] mb-[18px] before:content-[''] before:w-[22px] before:h-px before:bg-[#3B9EFF] before:[box-shadow:0_0_8px_#3B9EFF]">
                Our Vision
              </span>
              <h2 className="relative font-display font-semibold leading-[1.15] max-w-[760px] mx-auto text-[#EEF2F8] [font-size:clamp(2rem,4.2vw,3.2rem)]">
                Smart Vision.{" "}
                <span className="inline-block bg-gradient-to-br from-[#3B9EFF] to-[#F0B429] bg-clip-text text-transparent">
                  Stronger Future.
                </span>
              </h2>
              <div className="reveal-stagger relative grid gap-px mt-14 rounded-2xl overflow-hidden border border-[rgba(120,160,220,0.16)] bg-[rgba(120,160,220,0.16)] [grid-template-columns:repeat(4,1fr)] max-[820px]:!grid-cols-2">
                {[
                  ["Innovation", "New models and tooling are shipped continuously as markets and technology evolve.", <path key="i" d="M9 18h6M10 22h4M12 2a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 2Z" />],
                  ["Technology", "A modern engineering stack built for speed, uptime and precise execution.", <><rect key="t" x="4" y="9" width="16" height="11" rx="2" /><path d="M8 9V6a4 4 0 0 1 8 0v3" /></>],
                  ["Transparency", "Clear reporting and visible system status, so users always know what's happening.", <><path key="tr" d="M12 2 3 6v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V6l-9-4Z" /><path d="M9 12l2 2 4-4" /></>],
                  ["Sustainable Growth", "Infrastructure decisions are made for long-term stability, not short-term shortcuts.", <path key="g" d="M12 22c5-2 8-6 8-11V5l-8-3-8 3v6c0 5 3 9 8 11Z" />],
                ].map(([title, desc, svgPath]) => (
                  <div key={title} className="group text-left bg-[#0A1428] py-[30px] px-[22px] transition-colors duration-400 hover:bg-[#0F1A30]">
                    <div className="relative w-14 h-14 rounded-full flex items-center justify-center mb-[18px] bg-[#0A1428] z-[1] before:content-[''] before:absolute before:-inset-[5px] before:rounded-full before:-z-10 before:[background:conic-gradient(from_0deg,transparent_0%,#F0B429_18%,transparent_40%,#3B9EFF_65%,transparent_88%)] before:opacity-45 before:animate-iconspin-slow group-hover:before:opacity-90 group-hover:before:animate-iconspin-fast after:content-[''] after:absolute after:inset-0 after:rounded-full after:bg-[#0A1428] after:-z-10">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="relative w-6 h-6 text-[#3B9EFF] z-[2] transition-transform duration-400 group-hover:scale-110 group-hover:text-[#FFD666]">
                        {svgPath}
                      </svg>
                    </div>
                    <h4 className="text-[0.98rem] text-[#EEF2F8] mb-2">{title}</h4>
                    <p className="text-[#8B98B0] text-[0.82rem] leading-[1.55]">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="relative py-[120px] max-[900px]:py-[84px]" id="how">
          <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5">
            <div className="reveal max-w-[640px] mb-14">
              <span className="inline-flex items-center gap-2.5 font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[#3B9EFF] mb-[18px] before:content-[''] before:w-[22px] before:h-px before:bg-[#3B9EFF] before:[box-shadow:0_0_8px_#3B9EFF]">
                How It Works
              </span>
              <h2 className="font-display font-semibold text-[#EEF2F8] leading-[1.1] [font-size:clamp(1.9rem,3.6vw,2.75rem)]">
                From account to active dashboard, in four steps.
              </h2>
            </div>
            <div className="reveal-stagger grid gap-[22px] [grid-template-columns:repeat(4,1fr)] max-[900px]:!grid-cols-2 max-[560px]:!grid-cols-1">
              {[
                ["01", "Create Account", "Set up a secure JMFinex account with verified access credentials."],
                ["02", "Explore Platform", "Get oriented with the console, market feeds and analytics tools."],
                ["03", "Access Trading Tools", "Configure charting, automation rules and AI-assisted indicators."],
                ["04", "Monitor Market Activity", "Track positions, signals and system status from a single dashboard."],
              ].map(([num, title, desc]) => (
                <div key={title} className="relative border border-[rgba(120,160,220,0.16)] rounded-2xl py-[30px] px-6 [background:rgba(15,22,45,0.6)] transition-[transform,border-color] duration-[450ms] hover:-translate-y-1.5 hover:border-[rgba(240,180,41,0.4)]">
                  <div className="font-display text-[2.4rem] text-transparent opacity-60 mb-[18px] [-webkit-text-stroke:1px_#3B9EFF] animate-sn-glow">{num}</div>
                  <h4 className="text-[1.02rem] text-[#EEF2F8] mb-2.5">{title}</h4>
                  <p className="text-[#8B98B0] text-[0.86rem] leading-[1.55]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

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

        {/* FINAL CTA */}
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
                <a href="#" className="relative inline-flex items-center justify-center gap-2.5 rounded-full font-semibold text-base py-[18px] px-10 text-[#0A0E1A] [background:linear-gradient(135deg,#F0B429_0%,#D4A017_100%)] transition-transform duration-350 hover:-translate-y-0.5 hover:[box-shadow:0_12px_32px_-8px_rgba(240,180,41,.55),0_0_24px_-4px_rgba(255,215,0,.4)]">
                  <span>Get Signup with JMFinex</span>
                </a>
             
              </div>
            </div>
          </div>
        </section>

       
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[rgba(120,160,220,0.16)] py-[70px] pb-[30px] bg-[#070C17]">
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

      <Script src="/script.js" strategy="afterInteractive" />
    </>
  );
}