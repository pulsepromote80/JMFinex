

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from 'next/navigation';
import {
  FiGrid,
  FiZap,
  FiBarChart2,
  FiCpu,
  FiCreditCard,
  FiUsers,
  FiFileText,
  FiUser,
  FiX,
  FiTrendingUp,
  FiLogOut,
  FiAward,
} from "react-icons/fi";
import { doUserLogout } from "@/app/api/auth";
import { useTheme } from 'next-themes';

export default function DashboardHeader({
  sidebarOpen,
  setSidebarOpen,
}) {

  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleSignOut = () => {
    doUserLogout()
    router.push('/user/login');
  };

  return (
    <aside className={`
      w-[230px] flex-shrink-0 
      bg-white dark:border-gray-800
      border-r border-gray-200 
      flex flex-col sticky top-0 
      backdrop-blur-[28px] saturate-[1.4] 
      transition-all duration-300 
      overflow-auto h-full
    `}>
      
      {/* Logo Area */}
      <div className={`flex items-center gap-3 px-4 py-0.5 border-b border-gray-200 dark:border-gray-800 dark:bg-[#10222e]  bg-white/95 `}>
        <Image
          src={mounted && theme === "dark" ? "/logo.png" : "/LogoBlack.png"}
          alt="Logo"
          width={200}
          height={60}
          priority
          className="object-contain dark:brightness-125 dark:contrast-125"
        />
        <button 
          className="lg:hidden w-9 h-9 min-w-[36px] rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:rotate-90 transition-all duration-300 flex items-center justify-center"
          onClick={closeSidebar}
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* Platform Section */}
      <div className="px-3 py-4">
        <div className="text-xs font-bold uppercase tracking-[2.5px] text-gray-500 dark:text-gray-400 px-4 pb-2">
          Platform
        </div>

        <Link 
          href="/dashboard" 
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-l-[3px] border-transparent ${
            pathname === '/dashboard' 
              ? 'text-[#0057D9] dark:text-[#38BDF8] bg-[#EAF3FF] dark:bg-[#0B2347]/60 border-l-[#0057D9] dark:border-l-[#38BDF8]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <span className="w-4 text-center text-sm opacity-55 flex-shrink-0">
            <FiGrid />
          </span>
          <span>Dashboard</span>
        </Link>

        <Link 
          href="/dashboard/AI-Trading-Bots" 
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-l-[3px] border-transparent ${
            pathname === '/dashboard/AI-Trading-Bots' 
              ? 'text-[#0057D9] dark:text-[#38BDF8] bg-[#EAF3FF] dark:bg-[#0B2347]/60 border-l-[#0057D9] dark:border-l-[#38BDF8]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <span className="w-4 text-center text-sm opacity-55 flex-shrink-0">
            <FiZap />
          </span>
          <span>FMP Strategy  </span>
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-teal-400 shadow-[0_0_7px_rgba(20,184,166,0.5)] dark:shadow-[0_0_7px_rgba(45,212,191,0.5)] animate-pulse"></span>
        </Link>

        <Link 
          href="/dashboard/engine" 
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-l-[3px] border-transparent ${
            pathname === '/dashboard/engine' 
              ? 'text-[#0057D9] dark:text-[#38BDF8] bg-[#EAF3FF] dark:bg-[#0B2347]/60 border-l-[#0057D9] dark:border-l-[#38BDF8]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <span className="w-4 text-center text-sm opacity-55 flex-shrink-0">
            <FiZap />
          </span>
          <span>FMP Engine</span>
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-teal-400 shadow-[0_0_7px_rgba(20,184,166,0.5)] dark:shadow-[0_0_7px_rgba(45,212,191,0.5)] animate-pulse"></span>
        </Link>

        <Link 
          href="/dashboard/analytics" 
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-l-[3px] border-transparent ${
            pathname === '/dashboard/analytics' 
              ? 'text-[#0057D9] dark:text-[#38BDF8] bg-[#EAF3FF] dark:bg-[#0B2347]/60 border-l-[#0057D9] dark:border-l-[#38BDF8]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <span className="w-4 text-center text-sm opacity-55 flex-shrink-0">
            <FiBarChart2 />
          </span>
          <span>Analytics</span>
        </Link>

        <Link 
          href="/dashboard/fund-director" 
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-l-[3px] border-transparent ${
            pathname === '/dashboard/fund-director' 
              ? 'text-[#0057D9] dark:text-[#38BDF8] bg-[#EAF3FF] dark:bg-[#0B2347]/60 border-l-[#0057D9] dark:border-l-[#38BDF8]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <span className="w-4 text-center text-sm opacity-55 flex-shrink-0">
            <FiTrendingUp />
          </span>
          <span>Fund Director</span>
        </Link>

        <Link 
          href="/dashboard/Team" 
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-l-[3px] border-transparent ${
            pathname === '/dashboard/Team' 
              ? 'text-[#0057D9] dark:text-[#38BDF8] bg-[#EAF3FF] dark:bg-[#0B2347]/60 border-l-[#0057D9] dark:border-l-[#38BDF8]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <span className="w-4 text-center text-sm opacity-55 flex-shrink-0">
            <FiUsers />
          </span>
          <span>Genealogy</span>
        </Link>

          <Link 
          href="/dashboard/crypto-terminal" 
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-l-[3px] border-transparent ${
            pathname === '/dashboard/crypto-terminal' 
              ? 'text-[#0057D9] dark:text-[#38BDF8] bg-[#EAF3FF] dark:bg-[#0B2347]/60 border-l-[#0057D9] dark:border-l-[#38BDF8]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <span className="w-4 text-center text-sm opacity-55 flex-shrink-0">
            <FiUsers />
          </span>
          <span>Crypto Terminal</span>
        </Link>
      </div>

      {/* Finance Section */}
      <div className="px-3 py-4">
        <div className="text-xs font-bold uppercase tracking-[2.5px] text-gray-500 dark:text-gray-400 px-4 pb-2">
          Finance
        </div>

        <Link 
          href="/dashboard/income-statement" 
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-l-[3px] border-transparent ${
            pathname === '/dashboard/income-statement' 
              ? 'text-[#0057D9] dark:text-[#38BDF8] bg-[#EAF3FF] dark:bg-[#0B2347]/60 border-l-[#0057D9] dark:border-l-[#38BDF8]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <span className="w-4 text-center text-sm opacity-55 flex-shrink-0">
            <FiCreditCard />
          </span>
          <span>Income Statement</span>
        </Link>

        <Link 
          href="/dashboard/wallet-statement" 
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-l-[3px] border-transparent ${
            pathname === '/dashboard/wallet-statement' 
              ? 'text-[#0057D9] dark:text-[#38BDF8] bg-[#EAF3FF] dark:bg-[#0B2347]/60 border-l-[#0057D9] dark:border-l-[#38BDF8]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <span className="w-4 text-center text-sm opacity-55 flex-shrink-0">
            <FiFileText />
          </span>
          <span>Wallet Statement</span>
        </Link>

        <Link 
          href="/dashboard/my-rewards" 
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-l-[3px] border-transparent ${
            pathname === '/dashboard/my-rewards' 
              ? 'text-[#0057D9] dark:text-[#38BDF8] bg-[#EAF3FF] dark:bg-[#0B2347]/60 border-l-[#0057D9] dark:border-l-[#38BDF8]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <span className="w-4 text-center text-sm opacity-55 flex-shrink-0">
            <FiAward />
          </span>
          <span>Rank Reward</span>
        </Link>

        <Link 
          href="/dashboard/ai-assistant" 
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-l-[3px] border-transparent ${
            pathname === '/dashboard/ai-assistant' 
              ? 'text-[#0057D9] dark:text-[#38BDF8] bg-[#EAF3FF] dark:bg-[#0B2347]/60 border-l-[#0057D9] dark:border-l-[#38BDF8]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <span className="w-4 text-center text-sm opacity-55 flex-shrink-0">
            <FiCpu />
          </span>
          <span>AI Assistant Demo</span>
        </Link>
      </div>

      {/* Account Section */}
      <div className="px-3 py-4 mt-auto">
        <div className="text-xs font-bold uppercase tracking-[2.5px] text-gray-500 dark:text-gray-400 px-4 pb-2">
          Account
        </div>

        <Link 
          href="/dashboard/profile" 
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-l-[3px] border-transparent ${
            pathname === '/dashboard/profile' 
              ? 'text-[#0057D9] dark:text-[#38BDF8] bg-[#EAF3FF] dark:bg-[#0B2347]/60 border-l-[#0057D9] dark:border-l-[#38BDF8]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <span className="w-4 text-center text-sm opacity-55 flex-shrink-0">
            <FiUser />
          </span>
          <span>Profile</span>
        </Link>

        <Link
          href="/user/login"
          onClick={doUserLogout}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 hover:border-red-300 dark:hover:border-red-700"
        >
          <span className="w-4 text-center text-sm flex-shrink-0">
            <FiLogOut />
          </span>
          <span>Logout</span>
        </Link>
      </div>

    </aside>
  );
}