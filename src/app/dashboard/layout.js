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
          <title>XOXOFX</title>
          <meta name="description" content="Trading" />
          <link rel="icon" href="/favicon.png" />
          <link rel="shortcut icon" href="/favicon.png" />
          <link rel="apple-touch-icon" href="/favicon.png" />
        </Head>
        
        <div className="fixed inset-0 flex items-center justify-center z-[9999] m-0 p-0 bg-gradient-to-br from-[#060918] to-[#0a0f2a]">
          <div className="text-center">
            <svg
              width="80"
              height="80"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-5"
            >
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#8b5cf6", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: "#22d3ee", stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#22d3ee", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: "#8b5cf6", stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(139, 92, 246, 0.1)"
                strokeWidth="4"
              />
              
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#gradient1)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="60 190"
                strokeDashoffset="0"
                transform="rotate(0 50 50)"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 50 50"
                  to="360 50 50"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </circle>
              
              <circle
                cx="50"
                cy="50"
                r="30"
                fill="none"
                stroke="url(#gradient2)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="40 150"
                strokeDashoffset="0"
                transform="rotate(180 50 50)"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="360 50 50"
                  to="0 50 50"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
              
              <circle cx="50" cy="50" r="5" fill="#8b5cf6">
                <animate
                  attributeName="r"
                  values="3;6;3"
                  dur="1s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.5;1;0.5"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>

            <div className="text-purple-500 font-mono text-[13px] tracking-[3px] animate-pulse">
              LOADING
            </div>
            
            <div className="flex gap-2 justify-center mt-3">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0s]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-purple-300 animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>XOXOFX</title>
        <meta name="description" content="Trading" />
        <link rel="icon" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </Head>

      <div data-theme={theme === 'dark' ? 'dark' : 'light'}>

        {/* Background Elements */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className={`absolute w-[580px] h-[580px] rounded-full blur-[100px] animate-[blobD_20s_ease-in-out_infinite_alternate] ${
            theme === 'dark' ? 'opacity-32' : 'opacity-12'
          } bg-gradient-to-r from-teal-500/45 to-transparent top-[-180px] left-[-80px]`}></div>
          <div className={`absolute w-[480px] h-[480px] rounded-full blur-[100px] animate-[blobD_24s_ease-in-out_infinite_alternate] ${
            theme === 'dark' ? 'opacity-32' : 'opacity-12'
          } bg-gradient-to-r from-amber-500/38 to-transparent bottom-[-140px] right-[-80px] [animation-delay:-9s]`}></div>
          <div className={`absolute w-[340px] h-[340px] rounded-full blur-[100px] animate-[blobD_16s_ease-in-out_infinite_alternate] ${
            theme === 'dark' ? 'opacity-32' : 'opacity-12'
          } bg-gradient-to-r from-teal-500/22 to-transparent top-[45%] left-[42%] [animation-delay:-5s]`}></div>
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            className={`fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto flex-shrink-0 h-screen overflow-hidden transition-transform duration-300 ease-in-out ${
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
            <div className="flex-shrink-0">
              <DashboardTopbar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            </div>

            {/* Scrollable Content */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-5 lg:p-6 min-h-0">
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