"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import '../globals.css';
import DashboardSidebar from "../user/components/DashboardHeader";
import DashboardTopbar from "../user/components/DashboardSidebar";
import Head from "next/head";
import { useTheme } from "next-themes";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { setTheme, theme } = useTheme();

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
      if (window.innerWidth <= 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Loading timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Check token
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      window.location.replace("/user/login");
    }
  }, []);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (pageLoading) {
    return (
      <>
        <Head>
          <title>JMFINEX</title>
          <meta name="description" content="Trading" />
          <link rel="icon" href="/favicon.png" />
          <link rel="shortcut icon" href="/favicon.png" />
          <link rel="apple-touch-icon" href="/favicon.png" />
        </Head>

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
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>JMFINEX</title>
        <meta name="description" content="Trading" />
        <link rel="icon" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </Head>

      <div data-theme={theme === 'dark' ? 'dark' : 'light'}>

        {/* Background Elements */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className={`absolute w-[480px] h-[480px] rounded-full blur-[100px] animate-[blobD_24s_ease-in-out_infinite_alternate] ${
            theme === 'dark' ? 'opacity-32' : 'opacity-12'
          } bg-gradient-to-r from-amber-500/38 to-transparent bottom-[-140px] right-[-80px] [animation-delay:-9s]`}></div>
        </div>

        <div className={`fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(rgba(0,212,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.022)_1px,transparent_1px)] bg-[58px_58px] transition-opacity duration-300 ${
          theme === 'dark' ? 'opacity-100' : 'opacity-35'
        }`}></div>
        <div id="pts" className="fixed inset-0 z-0 pointer-events-none overflow-hidden"></div>

        {/* Main Layout */}
        <div className="h-screen overflow-hidden flex relative">
          
          {/* Mobile Overlay */}
          {isMobile && sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[45] lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            className={`fixed lg:relative inset-y-0 left-0 z-[150] lg:z-auto flex-shrink-0 h-screen overflow-hidden transition-transform duration-300 ease-in-out ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0`}
            aria-hidden={sidebarOpen ? "false" : "true"}
          >
            <DashboardSidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
            {/* Topbar */}
            <div className="relative z-[100] flex-shrink-0">
              <DashboardTopbar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            </div>

            {/* Scrollable Content */}
            <main className="relative flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-5 lg:p-6 min-h-0">
              {children}
            </main>
          </div>
        </div>
      </div>

      {/* Keyframe Animations */}
      <style jsx global>{`
        @keyframes blobD {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(28px, -22px) scale(1.06); }
          100% { transform: translate(-18px, 26px) scale(0.97); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }
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
        .opacity-12 { opacity: 0.12; }
        .opacity-32 { opacity: 0.32; }
        .opacity-35 { opacity: 0.35; }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(20, 184, 166, 0.3);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(20, 184, 166, 0.5);
        }

        /* Smooth transitions */
        * {
          transition-property: background-color, border-color, color, fill, stroke;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }

        /* Remove transition for faster interactions */
        input, textarea, select, button {
          transition: none;
        }
      `}</style>
    </>
  );
}