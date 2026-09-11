


"use client";
import { useState, useEffect } from "react";
import { fundDirectorTabs } from "@/app/constants/funddirector.js";
import Reward from "./reward/page";
import Achievement from "./achievement/page";
import { usePathname } from "next/navigation";

export default function MyRewards() {
  const [activeTab, setActiveTab] = useState("myRewards");

  function getPName(pathname) {
    if (!pathname) return "";
    const parts = pathname.split("/");
    let last = parts[parts.length - 1] || parts[parts.length - 2];
    return last
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const pathname = usePathname();
  const pageName = getPName(pathname);

  const RewardsTab = [
    { img: "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/bd85e7b8-c7c1-4ab2-10fa-2893f5027900/public", id: "myRewards", label: "My Rewards" },
    { img: "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/bd85e7b8-c7c1-4ab2-10fa-2893f5027900/public", id: "rankAchievement", label: "Rank Achievements" },
  ];

  return (
    <div className="mx-auto px-4 sm:px-6 py-6">
      {/* Tabs */}
      <div className="overflow-x-auto">
        <div className="flex gap-1 bg-gray-100 dark:bg-[#142936] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-xl p-1 mb-6">
          {RewardsTab.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-teal-400 to-teal-400 text-white shadow-md shadow-purple-500/25"
                  : "text-gray-600 dark:text-[#9db4be] hover:bg-gray-200 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
              }`}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "myRewards" && <Reward />}
        {activeTab === "rankAchievement" && <Achievement />}
      </div>
    </div>
  );
}