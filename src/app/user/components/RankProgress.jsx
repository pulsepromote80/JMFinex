"use client";

import React from "react";

export default function RankProgress({
  totQualifyRnk = 0,
  total = 7,
  activeRank = "No Rank",
  description = "Welcome back to your Roventar ecosystem. Monitor your trading performance, team growth and reward progress from one place.",
  title = "Good Morning UserName",
}) {
  const pct = Math.min(100, Math.max(0, Math.round((totQualifyRnk / total) * 100)));

  return (
    <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl shadow-sm overflow-hidden my-4">
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
          
          {/* LEFT SIDE */}
          <div className="flex-1 min-w-0 w-full lg:w-auto">
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5 text-teal-600 dark:text-[#2fd9d3] text-base font-bold tracking-[1.6px] uppercase mb-3">
              <div className="w-8 h-8 rounded-full bg-teal-600 dark:bg-[#2fd9d3] flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 21h8" />
                  <path d="M12 17v4" />
                  <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
                  <path d="M17 5h2.5A1.5 1.5 0 0 1 21 6.5v0A3.5 3.5 0 0 1 17.5 10H17" />
                  <path d="M7 5H4.5A1.5 1.5 0 0 0 3 6.5v0A3.5 3.5 0 0 0 6.5 10H7" />
                </svg>
              </div>
              <span>ROVENTAR ECOSYSTEM</span>
            </div>

            {/* Title */}
            <h3 className="text-7xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#12263a] dark:text-[#eaf5f7] tracking-tight mb-2">
              {title}
            </h3>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#647785] dark:text-[#9db4be] leading-relaxed max-w-lg mb-5">
              {description}
            </p>

            {/* Chips */}
            <div className="flex flex-wrap gap-2.5 mb-6">
              <span className="inline-flex items-center gap-2 bg-gray-100 dark:bg-[#142936] border border-gray-300 dark:border-[rgba(140,200,205,0.16)] rounded-full px-4 py-1.5 text-base font-semibold text-gray-800 dark:text-[#eaf5f7]">
                Rank MANAGER
              </span>
              <span className="inline-flex items-center gap-2 bg-green-50 dark:bg-[#2ed99a]/10 border border-green-300 dark:border-[#2ed99a]/25 rounded-full px-4 py-1.5 text-base font-semibold text-green-700 dark:text-[#2ed99a]">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <polyline points="2,8 5.5,11.5 14,3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Trading Package Active
              </span>
              <span className="inline-flex items-center gap-2 bg-green-50 dark:bg-[#2ed99a]/10 border border-green-300 dark:border-[#2ed99a]/25 rounded-full px-4 py-1.5 text-base font-semibold text-green-700 dark:text-[#2ed99a]">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <polyline points="2,8 5.5,11.5 14,3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                KYC Verified
              </span>
              <span className="inline-flex items-center gap-2 bg-green-50 dark:bg-[#2ed99a]/10 border border-green-300 dark:border-[#2ed99a]/25 rounded-full px-4 py-1.5 text-base font-semibold text-green-700 dark:text-[#2ed99a]">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <polyline points="2,8 5.5,11.5 14,3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Account Active
              </span>
            </div>

            {/* Progress Section */}
            {/* <div className="max-w-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-base font-semibold uppercase tracking-wider text-[#647785] dark:text-[#9db4be]">
                  Rank Progress
                </span>
                <span className="text-base font-bold text-teal-600 dark:text-[#2fd9d3]">
                  {pct}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 dark:bg-[#142936] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-teal-500 to-teal-400 dark:from-[#2fd9d3] dark:to-[#18c7c2] rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div> */}
          </div>

          {/* RIGHT SIDE - Rank Image */}
          <div className="flex-1 flex items-center justify-end w-full lg:w-auto">
            <img
              src="/banner-img.png"
              alt={activeRank}
              className="w-[300px] sm:w-[350px] lg:w-[400px] xl:w-[450px] h-auto object-contain"
            />
          </div>

        </div>
      </div>
    </div>
  );
}