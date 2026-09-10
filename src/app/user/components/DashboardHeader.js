
// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { useRouter, usePathname } from 'next/navigation';
// import {
//   FiGrid,
//   FiZap,
//   FiBarChart2,
//   FiCpu,
//   FiRefreshCw,
//   FiCreditCard,
//   FiUsers,
//   FiFileText,
//   FiUser,
//   FiSettings,
//   FiX,
//   FiChevronRight,
//   FiTrendingUp,
//   FiLogOut,
//   FiAward ,
//   FiBookOpen // Added for Fund Director icon
// } from "react-icons/fi";
// import { doUserLogout } from "@/app/api/auth";

// export default function DashboardHeader({
//   sidebarOpen,
//   setSidebarOpen,
// }) {

//   const router = useRouter();
//   const pathname = usePathname();

//   // Close Sidebar Function
//   const closeSidebar = () => {
//     setSidebarOpen(false);
//   };

//   const handleSignOut = () => {
//     doUserLogout()
//     router.push('/user/login');
//   };

//   return (
//     <aside className="sidebar">
//       <div className="logo-area">
//         <Image
//           src="/LOG02.png"
//           alt="Logo"
//           width={200}
//           height={60}
//           priority
//         />

//         {/* Close Button */}
//         <button className="close-sidebar-btn" onClick={closeSidebar}>
//           <FiX />
//         </button>
//       </div>

//       <div className="nb">
//         <div className="nlbl">Platform</div>

//         <Link href="/user/dashboard" className={"ni " + (pathname === '/user/dashboard' ? 'on' : '')}>
//           <span className="ic">
//             <FiGrid />
//           </span>
//           <span>Dashboard</span>
//         </Link>
//         <Link href="/user/dashboard/AI-Trading-Bots" className={"ni " + (pathname === '/user/dashboard/AI-Trading-Bots' ? 'on' : '')}>
//           <span className="ic">
//             <FiZap />
//           </span>
//           <span>AI Trading Bots</span>
//           <span className="npip pg"></span>
//         </Link>
//         <Link href="/user/dashboard/engine" className={"ni " + (pathname === '/user/dashboard/engine' ? 'on' : '')}>
//           <span className="ic">
//             <FiZap />
//           </span>
//           <span>Roventar Engine</span>
//           <span className="npip pg"></span>
//         </Link>

//         <Link href="/user/dashboard/analytics" className={"ni " + (pathname === '/user/dashboard/analytics' ? 'on' : '')}>
//           <span className="ic">
//             <FiBarChart2 />
//           </span>
//           <span>Analytics</span>
//         </Link>

//         {/* <Link href="/user/dashboard/simulate" className="ni">
//           <span className="ic">
//             <FiCpu />
//           </span>
//           <span>Simulate</span>
//           <span className="nbadge">BETA</span>
//         </Link> */}

//         {/* <Link href="/user/dashboard/auto-trade" className="ni">
//           <span className="ic">
//             <FiRefreshCw />
//           </span>
//           <span>Auto-Trade</span>
//           <span className="npip py"></span>
//         </Link> */}

//         {/* Fund Director Menu Item - Added here */}
//         <Link href="/user/dashboard/fund-director" className={"ni " + (pathname === '/user/dashboard/fund-director' ? 'on' : '')}>
//           <span className="ic">
//             <FiTrendingUp />
//           </span>
//           <span>Fund Director</span>
//         </Link>
//         <Link href="/user/dashboard/Team" className={"ni " + (pathname === '/user/dashboard/Team' ? 'on' : '')}>
//           <span className="ic">
//             <FiUsers />
//           </span>
//           <span>Genealogy</span>
//         </Link>
//         {/* <Link href="/user/dashboard/lms" className={"ni " + (pathname === '/user/dashboard/lms' ? 'on' : '')}>
//           <span className="ic">
//             <FiBookOpen />
//           </span>
//           <span>Academy</span>
//         </Link> */}
//       </div>

//       <div className="nb">
//         <div className="nlbl">Finance</div>

//         {/* <Link href="/user/dashboard/wallet" className="ni">
//           <span className="ic">
//             <FiCreditCard />
//           </span>
//           <span>Wallet</span>
//         </Link> */}

//         {/* <Link href="/user/dashboard/community" className="ni">
//           <span className="ic">
          
//           </span>
//           <span>Community</span>
//         </Link> */}
//         <Link href="/user/dashboard/income-statement" className={"ni " + (pathname === '/user/dashboard/income-statement' ? 'on' : '')}>
//           <span className="ic">
//             <FiCreditCard />
//           </span>
//           <span>Income Statement</span>
//         </Link>


//         <Link href="/user/dashboard/wallet-statement" className={"ni " + (pathname === '/user/dashboard/wallet-statement' ? 'on' : '')}>
//           <span className="ic">
//             <FiFileText />
//           </span>
//           <span>Wallet Statement</span>
//         </Link>

//         <Link href="/user/dashboard/my-rewards" className={"ni " + (pathname === '/user/dashboard/my-rewards' ? 'on' : '')}>
//           <span className="ic">
//             <FiAward />
//           </span>
//           <span>Rank Progress</span>
//         </Link>
//          <Link href="/user/dashboard/ai-assistant" className={"ni " + (pathname === '/user/dashboard/ai-assistant' ? 'on' : '')}>
//           <span className="ic">
//             <FiCpu />
//           </span>
//           <span>AI Assistant Demo</span>
//         </Link>
//       </div>

//       <div className="nb">
//         <div className="nlbl">Account</div>

//         <Link href="/user/dashboard/profile" className={"ni " + (pathname === '/user/dashboard/profile' ? 'on' : '')}>
//           <span className="ic">
//             <FiUser />
//           </span>
//           <span>Profile</span>
//         </Link>
//         <Link
//           href="/user/login"
//           onClick={doUserLogout}
//           className="ni"
//         >
//           <span className="ic">
//             <FiLogOut />
//           </span>
//           <span>Logout</span>
//         </Link>
//         {/* <div
//           onClick={handleSignOut}
//           className="ni"
//           style={{
//             cursor: 'pointer',
//             background: 'rgba(220, 38, 38, 0.1)',
//             color: '#ef4444',
//             borderRadius: '8px',
//             padding: '8px 12px',
//             border: '1px solid rgba(220, 38, 38, 0.2)',
//             transition: 'all 0.3s ease'
//           }}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.background = 'rgba(220, 38, 38, 0.2)';
//             e.currentTarget.style.border = '1px solid rgba(220, 38, 38, 0.3)';
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)';
//             e.currentTarget.style.border = '1px solid rgba(220, 38, 38, 0.2)';
//           }}
//         >
//           <span className="ic">
//             <FiLogOut />
//           </span>
//           <span>Sign Out</span>
//         </div> */}

//         {/* <Link href="/user/dashboard/settings" className="ni">
//           <span className="ic">
//             <FiSettings />
//           </span>
//           <span>Settings</span>
//         </Link> */}
//       </div>
//       {/* 
//       <div className="sb-bot">
//         <div className="urow">
//           <div className="uava">A</div>

//           <div className="uinfo">
//             <div className="uname">arbion123</div>
//             <div className="ulvl">★ PRO TRADER · LV.12</div>
//           </div>

//           <div className="uarr">
//             <FiChevronRight />
//           </div>
//         </div>

//         <div className="chs">
//           <div className="cp eth">ETH</div>
//           <div className="cp sol">SOL</div>
//           <div className="cp bsc">BSC</div>
//         </div>
//       </div> */}
//     </aside>
//   );
// }



"use client";

import Link from "next/link";
import Image from "next/image";
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
import { useTheme } from '@/components/ThemeProvider';

export default function DashboardHeader({
  sidebarOpen,
  setSidebarOpen,
}) {

  const router = useRouter();
  const pathname = usePathname();
  const { isDark } = useTheme();

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
          src="/LOG02.png"
          alt="Logo"
          width={200}
          height={60}
          priority
          className="object-contain dark:brightness-[0.6] dark:contrast-[1.2]"
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
              ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-l-teal-500 dark:border-l-teal-400' 
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
              ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-l-teal-500 dark:border-l-teal-400' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <span className="w-4 text-center text-sm opacity-55 flex-shrink-0">
            <FiZap />
          </span>
          <span>AI Trading Bots</span>
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-teal-400 shadow-[0_0_7px_rgba(20,184,166,0.5)] dark:shadow-[0_0_7px_rgba(45,212,191,0.5)] animate-pulse"></span>
        </Link>

        <Link 
          href="/dashboard/engine" 
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-l-[3px] border-transparent ${
            pathname === '/dashboard/engine' 
              ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-l-teal-500 dark:border-l-teal-400' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <span className="w-4 text-center text-sm opacity-55 flex-shrink-0">
            <FiZap />
          </span>
          <span>Roventar Engine</span>
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-teal-400 shadow-[0_0_7px_rgba(20,184,166,0.5)] dark:shadow-[0_0_7px_rgba(45,212,191,0.5)] animate-pulse"></span>
        </Link>

        <Link 
          href="/dashboard/analytics" 
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-l-[3px] border-transparent ${
            pathname === '/dashboard/analytics' 
              ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-l-teal-500 dark:border-l-teal-400' 
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
              ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-l-teal-500 dark:border-l-teal-400' 
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
              ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-l-teal-500 dark:border-l-teal-400' 
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
              ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-l-teal-500 dark:border-l-teal-400' 
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
              ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-l-teal-500 dark:border-l-teal-400' 
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
              ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-l-teal-500 dark:border-l-teal-400' 
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
              ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-l-teal-500 dark:border-l-teal-400' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <span className="w-4 text-center text-sm opacity-55 flex-shrink-0">
            <FiAward />
          </span>
          <span>Rank Progress</span>
        </Link>

        <Link 
          href="/dashboard/ai-assistant" 
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-l-[3px] border-transparent ${
            pathname === '/dashboard/ai-assistant' 
              ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-l-teal-500 dark:border-l-teal-400' 
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
              ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-l-teal-500 dark:border-l-teal-400' 
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