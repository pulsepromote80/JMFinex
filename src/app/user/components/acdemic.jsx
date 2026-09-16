"use client";

import React from "react";

export default function AcademicsSection() {
  return (
    <div className="min-h-screen py-[120px] px-8">
      <div className="max-w-[1240px] mx-auto">
        <span className="inline-flex items-center gap-2.5 font-mono text-[0.72rem] tracking-[0.22em] uppercase text-[#3B9EFF] mb-[18px] before:content-[''] before:w-[22px] before:h-px before:bg-[#3B9EFF]">
          Academics
        </span>
        <h1 className="font-display font-semibold text-[#EEF2F8] leading-[1.1] mb-6 [font-size:clamp(2rem,4vw,3rem)]">
          Learn. Master.{" "}
          <span className="inline-block bg-gradient-to-br from-[#3B9EFF] to-[#F0B429] bg-clip-text text-transparent">
            Grow.
          </span>
        </h1>
        <p className="text-[#8B98B0] text-[1.05rem] leading-[1.7] max-w-[720px] mb-12">
          JMFinex Academics ek comprehensive learning hub hai jahan aap trading, 
          AI analytics, aur market structure ke baare mein deep knowledge hasil kar sakte hain.
        </p>

        <div className="grid grid-cols-3 gap-[22px] max-[980px]:!grid-cols-2 max-[640px]:!grid-cols-1">
          {[
            ["📊", "Trading Basics", "Market structure, order types, aur risk management ki foundation."],
            ["🤖", "AI in Trading", "Machine learning models kaise market patterns detect karte hain."],
            ["📈", "Technical Analysis", "Chart patterns, indicators, aur price action strategies."],
            ["💹", "Forex Markets", "Currency pairs, liquidity, aur global market sessions."],
            ["₿", "Digital Assets", "Crypto markets, blockchain fundamentals, aur DeFi concepts."],
            ["🛡️", "Risk Management", "Portfolio allocation, stop-loss, aur position sizing."],
          ].map(([icon, title, desc]) => (
            <article
              key={title}
              className="rounded-[18px] border border-[rgba(120,160,220,0.16)] [background:rgba(15,22,45,0.6)] p-6 transition-transform duration-300 hover:-translate-y-2 hover:border-[rgba(59,158,255,0.55)]"
            >
              <div className="w-12 h-12 rounded-[14px] grid place-items-center bg-[#0B1428] text-[#3B9EFF] border border-[rgba(59,158,255,0.28)] mb-4 text-[1.3rem]">
                {icon}
              </div>
              <h3 className="mb-2 text-[1.17rem] font-display font-semibold text-[#EEF2F8]">
                {title}
              </h3>
              <p className="text-[#8B98B0] text-[0.88rem] leading-[1.6]">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}