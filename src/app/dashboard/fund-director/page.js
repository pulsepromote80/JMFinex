
"use client";
import { useState, useEffect } from "react";
import { fundDirectorTabs } from "@/app/constants/funddirector.js";
import SelfDeposit from "./self-deposit/page";
import FundRequest from "./fund-request/page";
import InstantTransfer from "./instant-transfer/page";
import UserTransfer from "./user-transfer/page";
import WithDrawal from "./with-drawal/page";
import { usePathname } from "next/navigation";

export default function FundDirector() {
  const [activeTab, setActiveTab] = useState("deposit");

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

  return (
    <div className="w-full px-4 sm:px-6 py-6">
      {/* Tabs Container */}
      <div className="overflow-x-auto">
        <div className="flex gap-1 bg-gray-100 dark:bg-[#142936] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-xl p-1 mb-6">
          {fundDirectorTabs.map((tab) => (
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
        {activeTab === "deposit" && <SelfDeposit />}
        {activeTab === "instant" && <InstantTransfer />}
        {activeTab === "userTransfer" && <UserTransfer />}
        {activeTab === "withdraw" && <WithDrawal />}
      </div>
    </div>
  );
}