
"use client";

import React, { useState, useEffect, useRef } from "react";
import { CiMenuFries } from "react-icons/ci";
import { FiUser, FiHelpCircle } from "react-icons/fi";
import { FaWhatsapp, FaFacebookF, FaInstagram, FaTelegramPlane, FaFilePdf, FaBell } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { getUserDashboardDetails } from "../../redux/slices/authSlice";
import { Getusernotification, updateNotificationsCount } from "../../redux/slices/ticketSlice";
import { getUserReffrellLink } from "../../redux/slices/walletSlice";
import { useDispatch, useSelector } from "react-redux";
import { getUserId, doUserLogout } from "@/app/api/auth";
import Link from 'next/link';
import { FiLogOut } from "react-icons/fi";
import { useTheme } from 'next-themes';
import { RiMoonLine, RiSunLine } from 'react-icons/ri';

export default function DashboardHeader({ sidebarOpen, setSidebarOpen }) {

  const pathname = usePathname();
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();
  const [showBotPopup, setShowBotPopup] = useState(false);
  const [showRefPopup, setShowRefPopup] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState({ parent: "Dashboard", child: "Overview" });
  const [referralLink, setReferralLink] = useState("");
  const userMenuRef = useRef(null);
  const [selectedPosition, setSelectedPosition] = useState("L");
  const [leftUrl, setLeftUrl] = useState("");
  const [rightUrl, setRightUrl] = useState("");


  const [notificationsDropDown, setNotificationsDropDown] = useState(false);
  const [seenNotifications, setSeenNotifications] = useState(new Set());
  const notifyRef = useRef(null);
  const notificationPollingRef = useRef(null);


  const { refrelData, loading: refrelLoading } = useSelector((state) => state.wallet);
  const { userNotifications } = useSelector((state) => state.ticket);

  const notificationsArray = userNotifications?.notificationList || [];
 

  const unseenNotifications = notificationsArray.filter((n) => !seenNotifications.has(n.URID) && !n.Seen);
  const actualUnseenCount = unseenNotifications.length;

  useEffect(() => {
    const pathParts = pathname.split('/').filter(Boolean);

    const breadcrumbMap = {
      'dashboard': { parent: 'Dashboard', child: 'Overview' },
      'analytics': { parent: 'Analytics', child: 'Overview' },
      'AI-Trading-Bots': { parent: 'AI Trading Bots', child: 'Overview' },
      'Team': { parent: 'Genealogy', child: 'All Teams' },
      'deposit-request': { parent: 'Finance', child: 'Deposit Request' },
      'deposit-history': { parent: 'Finance', child: 'Deposit History' },
      'fund-director': { parent: 'Finance', child: 'Fund Director' },
      'income-statement': { parent: 'Finance', child: 'Income Statement' },
      'wallet-statement': { parent: 'Finance', child: 'Wallet Statement' },
      'ticket-logs': { parent: 'Support', child: 'Ticket Logs' },
      'new-ticket': { parent: 'Support', child: 'New Ticket' },
      'ROI-history': { parent: 'Finance', child: 'ROI History' },
      'roi-request': { parent: 'Finance', child: 'ROI Request' },
      'Admin-profile': { parent: 'Account', child: 'Profile' },
    };

    let parent = 'Dashboard';
    let child = 'Overview';

    for (const part of [...pathParts].reverse()) {
      if (breadcrumbMap[part]) {
        parent = breadcrumbMap[part].parent;
        child = breadcrumbMap[part].child;
        break;
      }
    }

    setBreadcrumb({ parent, child }); 

  }, [pathname]);

 
  const getAuthLogin = () => {
    try {
      const currentUserPlain = localStorage.getItem("currentUserPlain");

      if (currentUserPlain) {
        const userData = JSON.parse(currentUserPlain);
        return userData?.authLogin || userData?.userData?.authLogin;
      }
    } catch (error) {
      console.error("Error getting AuthLogin:", error);
    }
    return null;
  };

  const userID = getAuthLogin();
  console.log("YTYTY",userID);
  const userURID = getUserId();

  // Fetch Dashboard Details
  useEffect(() => {
    const fetchDashboardDetails = async () => {

      setIsLoading(true);
      try {
        const result = await dispatch(getUserDashboardDetails()).unwrap();
        if (result?.data) {
          setDashboardData(result.data);
        } else if (result) {
          setDashboardData(result);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardDetails();
  }, [dispatch]);

  // Fetch Referral Link
  useEffect(() => {
    const fetchReferralLink = async () => {
      try {
        const result = await dispatch(getUserReffrellLink()).unwrap();
      } catch (error) {
        console.error("Failed to fetch referral link:", error);
      }
    };

    fetchReferralLink();
  }, [dispatch, userID]);

  useEffect(() => {
    let rentWalletData = null;

    if (refrelData?.data?.rentWallet?.[0]) {
      rentWalletData = refrelData.data.rentWallet[0];
    } else if (refrelData?.rentWallet?.[0]) {
      rentWalletData = refrelData.rentWallet[0];
    }

    if (rentWalletData) {
      setLeftUrl(rentWalletData.LeftURL);
      setRightUrl(rentWalletData.RightURL);

      const initialLink = selectedPosition === "L" ? rentWalletData.LeftURL : rentWalletData.RightURL;
      setReferralLink(initialLink);
    }
  }, [refrelData, selectedPosition]);


  useEffect(() => {
    if (leftUrl && rightUrl) {
      const newLink = selectedPosition === "L" ? leftUrl : rightUrl;
      setReferralLink(newLink);
    }
  }, [selectedPosition, leftUrl, rightUrl]);

 
  useEffect(() => {
    const savedSeenNotifications = localStorage.getItem("seenNotifications");
    if (savedSeenNotifications) setSeenNotifications(new Set(JSON.parse(savedSeenNotifications)));
  }, []);

  useEffect(() => {
    localStorage.setItem("seenNotifications", JSON.stringify([...seenNotifications]));
  }, [seenNotifications]);

  useEffect(() => {
    const pollNotifications = () => {
      dispatch(Getusernotification());
    };
    pollNotifications();
    notificationPollingRef.current = setInterval(pollNotifications, 30000);
    return () => { 
      if (notificationPollingRef.current) 
        clearInterval(notificationPollingRef.current); 
    };
  }, [dispatch]);

  useEffect(() => {
    const resetInterval = setInterval(() => {
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      const savedTime = localStorage.getItem("seenNotificationsTime");
      if (!savedTime || parseInt(savedTime) < oneDayAgo) {
        setSeenNotifications(new Set());
        localStorage.setItem("seenNotificationsTime", Date.now().toString());
      }
    }, 60000);
    return () => clearInterval(resetInterval);
  }, []);

  const handleNotificationClick = (e) => { 
    e.stopPropagation(); 
    setNotificationsDropDown((prev) => !prev); 
  };

  const handleCloseNotifications = async (e) => {
    e.stopPropagation();
    
    try {
      const allNotificationIds = notificationsArray.map(n => n.URID || n.id || n.NotificationId);
      setSeenNotifications(new Set([...seenNotifications, ...allNotificationIds]));
      const URID = getUserId();
      await dispatch(updateNotificationsCount({ URID })).unwrap();
      
      if (URID) {
        await dispatch(Getusernotification({ URID })).unwrap();
       
      } else {
        console.warn("⚠️ URID not found, skipping Getusernotification");
      }
      
    } catch (error) {
      console.error("Error updating notification:", error);
    }
    
    setNotificationsDropDown(false);
  };

  const handleIndividualNotificationClick = (notification) => {
    const notificationId = notification.URID || notification.id || notification.NotificationId;
    setSeenNotifications((prev) => new Set([...prev, notificationId]));
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowBotPopup(false);
        setShowRefPopup(false);
        setShowUserMenu(false);
        if (notificationsDropDown) {
          const allNotificationIds = notificationsArray.map(n => n.URID || n.id || n.NotificationId);
          setSeenNotifications(new Set([...seenNotifications, ...allNotificationIds]));
          setNotificationsDropDown(false);
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [notificationsDropDown, seenNotifications, notificationsArray]);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationsDropDown && notifyRef.current && !notifyRef.current.contains(event.target)) {
        const allNotificationIds = notificationsArray.map(n => n.URID || n.id || n.NotificationId);
        setSeenNotifications(new Set([...seenNotifications, ...allNotificationIds]));
        setNotificationsDropDown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu, notificationsDropDown, seenNotifications, notificationsArray]);

  const toggleSidebar = () => {
    setSidebarOpen((isOpen) => !isOpen);
  };

  const closeBot = () => setShowBotPopup(false);
  const closeRef = () => setShowRefPopup(false);

  const activateBot = () => {
    setShowBotPopup(false);
  };

  const copyRef = async () => {
    const refLink = referralLink || `https://jmfinex.com/user/register?ref=${userID || "XO5599007"}`;

    try {
      const cleanLink = refLink.split('&Position=')[0];
      await navigator.clipboard.writeText(cleanLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareOn = (platform) => {
    const refLink = referralLink || `https://jmfinex.com/user/register?ref=${userID || "XO5599007"}`;
    const cleanLink = refLink.split('&Position=')[0];
    const text = `Join me on jmfinex - earn up to 8% commission! My ID: ${userID}`;

    let url = "";
    switch (platform) {
      case "WhatsApp":
        url = `https://wa.me/?text=${encodeURIComponent(text + " " + cleanLink)}`;
        break;
      case "Facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cleanLink)}`;
        break;
      case "Instagram":
        window.open(
          "https://www.instagram.com/",
          "_blank"
        );
        return;

      case "Telegram":
        url = `https://t.me/share/url?url=${encodeURIComponent(cleanLink)}&text=${encodeURIComponent(text)}`;
        break;
    }
    if (url) window.open(url, "_blank");
  };

  return (
    <>
      <header className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-[#10222e] backdrop-blur-[28px] saturate-[1.5] sticky top-0 transition-colors duration-300 flex-wrap">
        
        {/* Left Section */}
        <div className="flex-1 min-w-[120px]">
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-gray-500 dark:text-gray-400">
              {breadcrumb.parent}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
              / {breadcrumb.child}
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 flex-wrap">
          

          {/* Invite & Earn */}
          <div 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer"
            onClick={() => setShowRefPopup(true)}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] dark:bg-[#38BDF8]"></span>
            INVITE & EARN
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <RiSunLine className="w-4 h-4" /> : <RiMoonLine className="w-4 h-4" />}
            <span className="hidden sm:inline">{theme === 'dark' ? 'Dark' : 'Light'}</span>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifyRef}>
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 cursor-pointer relative"
              onClick={handleNotificationClick}
            >
              <FaBell className="w-4 h-4" />
              {actualUnseenCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                  {actualUnseenCount > 99 ? "99+" : actualUnseenCount}
                </span>
              )}
            </div>

            {notificationsDropDown && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute left-0 sm:right-0 sm:left-auto top-[calc(100%+10px)] w-72 max-w-[calc(100vw-20px)] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-[999] overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">Notifications</div>
                    {actualUnseenCount > 0 && (
                      <div className="text-xs text-blue-500">{actualUnseenCount} unread</div>
                    )}
                  </div>
                  <div onClick={handleCloseNotifications} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer text-sm">
                    ✕
                  </div>
                </div>

                <div className="max-h-[280px] overflow-y-auto">
                  {notificationsArray.length > 0 ? (
                    notificationsArray.map((msg, index) => (
                      <div
                        key={index}
                        onClick={() => handleIndividualNotificationClick(msg)}
                        className={`flex items-start gap-2.5 px-4 py-3 cursor-pointer border-b border-gray-100 dark:border-gray-800 ${
                          !seenNotifications.has(msg.URID) && !msg.Seen 
                            ? 'bg-blue-50/50 dark:bg-blue-900/10' 
                            : 'bg-transparent'
                        }`}
                      >
                        <FaBell className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          <div>{msg?.AdminRemarks || msg?.message || "Notification"}</div>
                          {msg?.NotificationDate && (
                            <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                              {new Date(msg.NotificationDate).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 px-4 text-center">
                      <FaBell className="w-6 h-6 text-gray-400 opacity-40 mx-auto mb-2" />
                      <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">All caught up!</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">No new notifications</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Deposit Button */}
          <Link href="/dashboard/fund-director">
            <div className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-xs font-bold text-[#0057D9] dark:text-[#38BDF8] cursor-pointer">
              + Deposit
            </div>
          </Link>   

          {/* Today Income */}
          <div className="px-3 py-1.5 rounded-full bg-[#f7f8fa] dark:bg-[#0B2347]/60 border border-amber-300 dark:border-amber-300 text-xs font-bold text-amber-400 dark:text-amber-300">
            ▲ +${dashboardData?.[0]?.TodayIncome || "0"} today
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF3FF] dark:bg-[#0B2347]/60 border border-[#B8D5FF] dark:border-[#1D4F91] text-[#0057D9] dark:text-[#38BDF8] text-sm font-semibold hover:bg-[#D9EBFF] dark:hover:bg-[#123663] transition-colors"
              onClick={() => setShowUserMenu((prev) => !prev)}
            >
              <FiUser className="w-4 h-4" />
              <div className="flex flex-col items-start leading-tight">
                <span className="text-xs">{userID}</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                  {dashboardData?.[0]?.UserRank}
                </span>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute left-0 sm:right-0 sm:left-auto top-[calc(100%+10px)] w-48 max-w-[calc(100vw-20px)] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-[999] overflow-hidden py-1">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <FiUser className="w-4 h-4" />
                  Profile
                </Link>

                <Link
                  href="/dashboard/support"
                  className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <FiHelpCircle className="w-4 h-4" />
                  Support
                </Link>

                <Link
                  href="/user/login"
                  className="flex items-center gap-2.5 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors border-t border-gray-100 dark:border-gray-800"
                  onClick={() => {
                    doUserLogout();
                    setShowUserMenu(false);
                  }}
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
              onClick={toggleSidebar}
            >
              <CiMenuFries className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Bot Popup */}
      {showBotPopup && (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm z-[900] flex items-center justify-center p-4" id="botOv" onClick={(e) => e.target === e.currentTarget && closeBot()}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="h-1 bg-gradient-to-r from-[#0057D9] to-[#38BDF8]"></div>
            <button className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" onClick={closeBot}>✕</button>
            <div className="p-6 text-center">
              <div className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-1">
                Bot <span className="text-[#0057D9] dark:text-[#38BDF8]">Status</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Your trading bot is currently <strong className="text-[#0057D9] dark:text-[#38BDF8]">ACTIVE</strong>
              </div>
              <button 
                className="mt-4 w-full bg-[#0057D9] hover:bg-[#0046AE] text-white font-bold py-3 rounded-xl transition-colors"
                onClick={activateBot}
              >
                ✓ Bot Active
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Referral Popup */}
      {showRefPopup && (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm z-[900] flex items-center justify-center p-4" id="refOv" onClick={(e) => e.target === e.currentTarget && closeRef()}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[94vh] overflow-y-auto">
            <div className="h-1 bg-gradient-to-r from-[#0057D9] to-[#38BDF8]"></div>
            <button className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" onClick={closeRef}>✕</button>
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-1">
                  Invite &amp; <span className="text-purple-500 dark:text-purple-400">Earn</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Share your link · Earn up to <strong className="text-amber-500">12% commission</strong> on every trade — Learn | Trade | Grow together! <span className="text-purple-500 dark:text-purple-400">💰</span>
                </div>
              </div>

              {(leftUrl || rightUrl) && (
                <div className="flex gap-2.5 mb-4 bg-purple-50 dark:bg-purple-950/20 p-2 rounded-xl justify-center">
                  <button
                    onClick={() => setSelectedPosition("L")}
                    className={`px-4 py-1.5 rounded-lg border-none text-sm font-bold cursor-pointer transition-colors ${
                      selectedPosition === "L" 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-purple-100 dark:bg-purple-900/30 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    Left Position
                  </button>
                  <button
                    onClick={() => setSelectedPosition("R")}
                    className={`px-4 py-1.5 rounded-lg border-none text-sm font-bold cursor-pointer transition-colors ${
                      selectedPosition === "R" 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-purple-100 dark:bg-purple-900/30 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    Right Position
                  </button>
                </div>
              )}

              <div className="text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">
                Your Unique Referral Link {leftUrl && rightUrl ? `(${selectedPosition === "L" ? "Left" : "Right"} Position)` : ""}
              </div>
              <div className="font-mono text-xs bg-gray-100 dark:bg-gray-800 rounded-xl p-3 border border-dashed border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 break-all mb-3">
                {refrelLoading ? "Loading..." : (referralLink || `https://jmfinex.com/user/register?ref=${userID || "XO5599007"}`)}
              </div>
              <button 
                className="w-full bg-gradient-to-r from-[#0057D9] to-[#38BDF8] hover:from-[#0046AE] hover:to-[#0EA5E9] text-white font-bold py-3 rounded-xl transition-all mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={copyRef} 
                disabled={refrelLoading}
              >
                {copySuccess ? "✓ Copied!" : "Copy Referral Link"}
              </button>

              <div className="text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2 mt-4">
                Share on Social Media
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#25D366] text-[#25D366] bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors text-sm font-bold" onClick={() => shareOn("WhatsApp")}>
                  <FaWhatsapp />
                  WhatsApp
                </button>
                <a className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-bold" href="https://apis.jmfinex.com/JMFINEX.pdf" target="_blank">
                  <FaFilePdf />
                  PDF
                </a>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#E4405F] text-[#E4405F] bg-[#E4405F]/10 hover:bg-[#E4405F]/20 transition-colors text-sm font-bold" onClick={() => shareOn("Instagram")}>
                  <FaInstagram />
                  Instagram
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#0088cc] text-[#0088cc] bg-[#0088cc]/10 hover:bg-[#0088cc]/20 transition-colors text-sm font-bold" onClick={() => shareOn("Telegram")}>
                  <FaTelegramPlane />
                  Telegram
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}