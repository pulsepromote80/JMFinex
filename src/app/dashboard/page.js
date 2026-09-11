"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import Chart from 'chart.js/auto';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { getUserDashboardDetails } from "../redux/slices/authSlice";
import { getallusernotification } from "../redux/slices/ticketSlice";
import { useDispatch, useSelector } from "react-redux";
import { getUserId } from "@/app/api/auth";
import { botActivate } from "@/app/redux/slices/fundManagerSlice"
import { useRouter } from 'next/navigation';
import XoxoFxChatbot from '../user/components/Xoxofxchatbot';
import RankProgress from '../user/components/RankProgress';
import { useTheme } from '@/components/ThemeProvider';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isDark } = useTheme();
  const chartEarnRef = useRef(null);
  const chartPieRef = useRef(null);
  const chartPortRef = useRef(null);
  const oppLRef = useRef(null);
  const heatmapRef = useRef(null);
  const execGridRef = useRef(null);
  const fuTrackRef = useRef(null);
  const timerNumRef = useRef(null);

  // Popup States
  const [showBotPopup, setShowBotPopup] = useState(false);
  const [showSimplePopup, setShowSimplePopup] = useState(false);
  const [showRefPopup, setShowRefPopup] = useState(false);
  const [showBuyPackagePopup, setShowBuyPackagePopup] = useState(false);
  const [showCongratsPopup, setShowCongratsPopup] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [botStartTime, setBotStartTime] = useState(null);
  const [botTime, setBotTime] = useState(null);

  const [isBotActive, setIsBotActive] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [analyticsRange, setAnalyticsRange] = useState('7D');
  const [analyticsMetric, setAnalyticsMetric] = useState('Income');
  const [botActiveTime, setBotActiveTime] = useState(null);

  const theme = isDark ? 'dark' : 'light';

  const BOT_SESSION_KEY = 'RoventarBotActive';
  const BOT_START_KEY = 'RoventarBotStartTime';

  function formatElapsedTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  function formatBotTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  const userURID = getUserId();

  const userDisplayName = dashboardData?.[0]?.UserName || dashboardData?.[0]?.Name || dashboardData?.[0]?.FullName || 'Investor';
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  })();
  const userInitials = String(userDisplayName).trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();

  const botStatus = Number(dashboardData?.[0]?.chktodayBotStatus ?? 0);
  const notifications = useSelector((state) => state.ticket?.notificationData);

  const notificationList = notifications?.notificationList ?? notifications?.notificationList ?? [];

  const notificationCount = notificationList?.length || 0;
  const unseenTotal = Array.isArray(notificationList) ? notificationList.filter(n => !n.Seen).length : 0;
  const botIsActive = isBotActive || botStatus === 1;

  const shouldBotBeActive = botIsActive && dashboardData?.[0]?.Kid === 1;
  const isKidNotOne = dashboardData?.[0]?.Kid !== 1;
 
   const isKidFive = dashboardData?.[0]?.Kid === 5;
  const isKidOne = dashboardData?.[0]?.Kid === 1;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        await dispatch(getallusernotification()).unwrap();
      } catch (err) {
        try {
          dispatch(Getusernotification());
        } catch (e) {
          console.error('Failed to fetch user notifications:', e || err);
        }
      }
    };
    fetchNotifications();
  }, [dispatch]);

  useEffect(() => {
    if (dashboardData && !shouldBotBeActive) {
      if (isKidFive) {
        setShowBuyPackagePopup(true);
      } else if (isKidOne) {
        setShowSimplePopup(true);
      }
    }
  }, [dashboardData, shouldBotBeActive, isKidFive, isKidOne]);

  useEffect(() => {
    try {
      const apiBotTime = dashboardData?.[0]?.BotActiveTime;

      if (apiBotTime && botStatus === 1) {
        let startTime;
        if (typeof apiBotTime === 'number') {
          startTime = apiBotTime;
        } else if (typeof apiBotTime === 'string') {
          startTime = new Date(apiBotTime).getTime();
        }

        if (apiBotTime && !isNaN(apiBotTime)) {
          setBotStartTime(apiBotTime);
          const elapsed = (apiBotTime);
          setElapsedSeconds(elapsed > 0 ? elapsed : 0);
          setIsBotActive(true);

          if (timerNumRef.current) {
            timerNumRef.current.textContent = formatElapsedTime(elapsed > 0 ? elapsed : 0);
          }
        }
      } else {
        const storedActive = localStorage.getItem(BOT_SESSION_KEY) === 'true';

        if (storedActive && storedStart && !Number.isNaN(storedStart)) {
          setBotStartTime(storedStart);
          const elapsed = Math.floor((Date.now() - storedStart) / 1000);
          setElapsedSeconds(elapsed > 0 ? elapsed : 0);
          setIsBotActive(true);

          if (timerNumRef.current) {
            timerNumRef.current.textContent = formatElapsedTime(elapsed > 0 ? elapsed : 0);
          }
        }
      }
    } catch (err) {
      console.warn('Could not restore bot timer from localStorage', err);
    }
  }, [dashboardData, botStatus]);

  useEffect(() => {
    if (botStatus === 1) {
      const apiBotTime = dashboardData?.[0]?.BotActiveTime;

      if (apiBotTime) {
        let startTime;
        if (typeof apiBotTime === 'number') {
          startTime = apiBotTime * 1000;
        } else if (typeof apiBotTime === 'string') {
          startTime = new Date(apiBotTime).getTime();
        }

        if (startTime && !isNaN(startTime)) {
          setBotStartTime(startTime);
          setBotActiveTime(startTime);
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          setElapsedSeconds(elapsed > 0 ? elapsed : 0);

          if (timerNumRef.current) {
            timerNumRef.current.textContent = formatElapsedTime(elapsed > 0 ? elapsed : 0);
          }
        }
      } else {
        const storedStart = Number(localStorage.getItem(BOT_START_KEY));
        if (storedStart && !Number.isNaN(storedStart)) {
          setBotStartTime(storedStart);
          const elapsed = Math.floor((Date.now() - storedStart) / 1000);
          setElapsedSeconds(elapsed > 0 ? elapsed : 0);
          setIsBotActive(true);

          if (timerNumRef.current) {
            timerNumRef.current.textContent = formatElapsedTime(elapsed > 0 ? elapsed : 0);
          }
        } else {
          const now = Date.now();
          setBotStartTime(now);
          setElapsedSeconds(0);

          if (timerNumRef.current) {
            timerNumRef.current.textContent = formatElapsedTime(0);
          }
        }
      }
      setIsBotActive(true);
      setShowBotPopup(false);
      setShowSimplePopup(false);
      setShowBuyPackagePopup(false);
    } else {
      setIsBotActive(false);
      setBotStartTime(null);
      setElapsedSeconds(0);
      setBotActiveTime(null);
      localStorage.removeItem(BOT_SESSION_KEY);
      localStorage.removeItem(BOT_START_KEY);

      if (timerNumRef.current) {
        timerNumRef.current.textContent = formatElapsedTime(0);
      }
    }
  }, [botStatus, dashboardData]);

  const totalIncome = Number(dashboardData?.[0]?.TotalIncome ?? 0);
  const earningLimit = Number(dashboardData?.[0]?.EarningLimit ?? 0);
  const remainingLimit = Number(dashboardData?.[0]?.RemainingLimit ?? Math.max(0, earningLimit - totalIncome));
  const usedPercentage = earningLimit > 0 ? Math.min(100, (totalIncome / earningLimit) * 100) : 0;
  const visualPercent = Number(usedPercentage.toFixed(1));
  const strokeOffset = 339 - (339 * visualPercent) / 100;

  const slides = [
    { id: 0, image: "/assets/images/forex.png", alt: "Forex" },
    { id: 1, image: "/assets/images/crypto.png", alt: "Crypto" },
    { id: 2, image: "/assets/images/stock.png", alt: "Stock" },
  ];

  useEffect(() => {
    const fetchDashboardDetails = async () => {
      setIsLoading(true);
      try {
        const result = await dispatch(getUserDashboardDetails()).unwrap();

        if (result?.data) {
          setDashboardData(result.data);

          const botTime = result.data[0]?.BotActiveTime;
          if (botTime && botStatus === 1) {
            setBotActiveTime(botTime);

            let startTime;
            if (typeof botTime === 'number') {
              startTime = botTime * 1000;
            } else if (typeof botTime === 'string') {
              startTime = new Date(botTime).getTime();
            }

            if (startTime && !isNaN(startTime)) {
              const elapsed = Math.floor((Date.now() - startTime) / 1000);
              setElapsedSeconds(elapsed > 0 ? elapsed : 0);
              setBotStartTime(startTime);
              setIsBotActive(true);
            }
          }
        } else if (result) {
          setDashboardData(result);

          const botTime = result[0]?.BotActiveTime;
          if (botTime && botStatus === 1) {
            setBotActiveTime(botTime);

            let startTime;
            if (typeof botTime === 'number') {
              startTime = botTime * 1000;
            } else if (typeof botTime === 'string') {
              startTime = new Date(botTime).getTime();
            }

            if (startTime && !isNaN(startTime)) {
              localStorage.setItem(BOT_START_KEY, startTime.toString());
              const elapsed = Math.floor((Date.now() - startTime) / 1000);
              setElapsedSeconds(elapsed > 0 ? elapsed : 0);
              setBotStartTime(startTime);
              setIsBotActive(true);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch dashboard details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardDetails();
  }, [dispatch]);

  const openBotFullPopup = () => {
    if (isKidOne && !shouldBotBeActive) {
      setShowSimplePopup(false);
      setShowBotPopup(true);
    }
  };

  const closeBotFullPopup = () => {
    setShowBotPopup(false);
    setIsCheckboxChecked(false);
  };

  const closeSimplePopup = () => {
    setShowSimplePopup(false);
  };

  const closeBuyPackagePopup = () => {
    setShowBuyPackagePopup(false);
  };

  const closeCongratsPopup = () => {
    setShowCongratsPopup(false);
  };

  const openRef = () => {
    setShowRefPopup(true);
  };

  const closeRef = () => {
    setShowRefPopup(false);
  };

  const copyRef = async () => {
    const refLink = "https://arbion.ai/ref/ARB-a9x7k2-premium";
    try {
      await navigator.clipboard.writeText(refLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareOn = (platform) => {
    const refLink = "https://arbion.ai/ref/ARB-a9x7k2-premium";
    const text = "Join me on Roventar AI Engine - earn up to 8% commission!";
    let url = "";
    switch (platform) {
      case "WhatsApp":
        url = `https://wa.me/?text=${encodeURIComponent(text + " " + refLink)}`;
        break;
      case "Facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(refLink)}`;
        break;
      case "Instagram":
        navigator.clipboard.writeText(`${text} ${refLink}`);
        alert("Link copied! Share it on Instagram.");
        return;
      case "Telegram":
        url = `https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent(text)}`;
        break;
    }
    if (url) window.open(url, "_blank");
  };

  useEffect(() => {
    let interval;
    if (shouldBotBeActive && botStartTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - botStartTime) / 1000);
        setElapsedSeconds(elapsed > 0 ? elapsed : 0);

        if (timerNumRef.current) {
          timerNumRef.current.textContent = formatElapsedTime(elapsed > 0 ? elapsed : 0);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [shouldBotBeActive, botStartTime]);

  useEffect(() => {
    if (timerNumRef.current && shouldBotBeActive) {
      timerNumRef.current.textContent = formatElapsedTime(elapsedSeconds);
    }
  }, [elapsedSeconds, shouldBotBeActive]);

  useEffect(() => {
    if (!shouldBotBeActive) return;

    const refreshDashboard = async () => {
      try {
        const result = await dispatch(getUserDashboardDetails()).unwrap();
        const apiBotTime = result?.[0]?.BotActiveTime;
        if (apiBotTime !== undefined) {
          setBotTime(apiBotTime);
        }
      } catch (error) {
        console.error("Failed to refresh dashboard:", error);
      }
    };

    refreshDashboard();
    const interval = setInterval(refreshDashboard, 5000);
    return () => clearInterval(interval);
  }, [shouldBotBeActive, dispatch]);

  const activateBot = async () => {
    if (shouldBotBeActive) return;

    const now = Date.now();

    try {
      const response = await dispatch(botActivate()).unwrap();

      localStorage.setItem(BOT_SESSION_KEY, 'true');
      localStorage.setItem(BOT_START_KEY, now.toString());
      setBotStartTime(now);
      setBotActiveTime(now);
      setElapsedSeconds(0);
      setIsBotActive(true);
      setShowBotPopup(false);
      setShowSimplePopup(false);
      setIsCheckboxChecked(false);

      setShowCongratsPopup(true);

      if (timerNumRef.current) {
        timerNumRef.current.textContent = formatElapsedTime(0);
      }

      const result = await dispatch(getUserDashboardDetails()).unwrap();
      if (result?.data) {
        setDashboardData(result.data);
      }

      setTimeout(() => {
        setShowCongratsPopup(false);
      }, 5000);

    } catch (error) {
      console.error('Failed to activate bot:', error);
      return;
    }

    const botNotif = document.getElementById('botNotif');
    const timerBox = document.getElementById('timerBox');
    const botActArea = document.getElementById('botActArea');
    if (botNotif) botNotif.style.display = 'flex';
    if (timerBox) timerBox.style.display = 'flex';
    if (botActArea) botActArea.style.display = 'none';
  };

  const pauseBot = () => {
    setIsBotActive(false);
    setBotStartTime(null);
    setElapsedSeconds(0);
    setBotActiveTime(null);
    localStorage.removeItem(BOT_SESSION_KEY);
    localStorage.removeItem(BOT_START_KEY);

    if (timerNumRef.current) {
      timerNumRef.current.textContent = formatElapsedTime(0);
    }
  };

  const closeAnnouncement = () => {
    setShowAnnouncement(false);
  };

  useEffect(() => {
    if (chartEarnRef.current) {
      const ctx = chartEarnRef.current.getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [
            {
              label: 'Earned',
              data: [1240, 2890, 4520, 8241],
              borderColor: '#14b8a6',
              backgroundColor: 'rgba(20, 184, 166, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Limit',
              data: [3000, 6000, 9000, 12000],
              borderColor: 'rgba(239, 68, 68, 0.5)',
              borderDash: [5, 5],
              backgroundColor: 'transparent',
              tension: 0.4,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    }

    if (chartPieRef.current) {
      const ctx = chartPieRef.current.getContext('2d');
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Trading', 'Level', 'Affiliate', 'Compound'],
          datasets: [{
            data: [4286, 1841, 841, 1274],
            backgroundColor: ['#14b8a6', '#34d399', '#8b5cf6', '#f59e0b'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    }

    if (chartPortRef.current) {
      const ctx = chartPortRef.current.getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
          datasets: [{
            data: Array.from({ length: 30 }, (_, i) => 38000 + (i * 320)),
            borderColor: '#14b8a6',
            backgroundColor: 'rgba(20, 184, 166, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    }

    return () => {
      const charts = Chart.instances;
      Object.values(charts).forEach(chart => chart.destroy());
    };
  }, []);

  useEffect(() => {
    if (oppLRef.current && dashboardData && dashboardData.length > 0) {
      const userData = dashboardData[0];

      const opportunities = [
        {
          pair: 'Trading Withdrawal',
          profit: `+$${userData?.TradingWithdrawal || 0}`
        },
        {
          pair: 'Income Withdrawal',
          profit: `+$${userData?.IncomeWithdrawal || 0}`
        },
        {
          pair: 'Level Open',
          profit: `${userData.LevelOpen || 0}`
        },
        {
          pair: 'Income Wallet',
          profit: `+$${userData.IncomeWallet || 0}`
        },
        {
          pair: 'Deposit Wallet',
          profit: `+$${userData.DepositWallet || 0}`
        },
        {
          pair: 'Trading Wallet',
          profit: `+$${userData.TradingWallet || 0}`
        },
      ];
      oppLRef.current.innerHTML = opportunities.map(opp => `
        <div class="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
          <span class="text-sm text-gray-500 dark:text-gray-400">${opp.pair}</span>
          <span class="text-sm font-bold text-gray-900 dark:text-white">${opp.profit}</span>
        </div>
      `).join('');
    }

    if (execGridRef.current) {
      const executions = [
        { hash: '0x7a3f...b291', profit: '+$342.50', time: '12s ago', chain: 'SOL' },
        { hash: '0x2e8c...d174', profit: '+$218.30', time: '34s ago', chain: 'ETH' },
        { hash: '0x9b4d...f823', profit: '+$156.20', time: '1m ago', chain: 'BSC' },
      ];
      execGridRef.current.innerHTML = executions.map(exec => `
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-2 mb-1.5">
            <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">${exec.chain}</span>
            <span class="font-mono text-xs cursor-pointer text-teal-600 dark:text-teal-400 hover:underline">${exec.hash}</span>
          </div>
          <div class="font-mono text-sm font-bold text-teal-600 dark:text-teal-400">${exec.profit}</div>
          <div class="text-xs text-gray-400 dark:text-gray-500">${exec.time}</div>
        </div>
      `).join('');
    }

    if (fuTrackRef.current) {
      const users = [
        { name: 'Alex***', country: '🇺🇸', amount: '$1,240' },
        { name: 'Maria***', country: '🇬🇧', amount: '$892' },
        { name: 'Wei***', country: '🇸🇬', amount: '$2,100' },
        { name: 'Carlos***', country: '🇧🇷', amount: '$567' },
      ];
      fuTrackRef.current.innerHTML = [...users, ...users].map(user => `
        <div class="flex items-center gap-3 px-5 py-2.5 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 last:border-r-0">
          <div class="flex items-center gap-2.5">
            <span class="text-lg">${user.country}</span>
            <span class="font-semibold text-gray-800 dark:text-gray-200">${user.name}</span>
          </div>
          <div class="font-mono font-bold text-gray-500 dark:text-gray-400">${user.amount}</div>
        </div>
      `).join('');
    }

    if (heatmapRef.current) {
      const days = 28;
      let html = '';
      for (let i = 0; i < days; i++) {
        const profit = Math.random() * 100;
        let intensity = '';
        if (profit > 80) intensity = 'bg-emerald-500';
        else if (profit > 60) intensity = 'bg-emerald-400';
        else if (profit > 40) intensity = 'bg-emerald-300';
        else intensity = 'bg-emerald-200';
        html += `<div class="h-5 rounded ${intensity}" title="+$${Math.floor(profit * 10)}"></div>`;
        if ((i + 1) % 7 === 0 && i !== days - 1) html += '<div class="col-span-7 h-px"></div>';
      }
      heatmapRef.current.innerHTML = html;
    }

    let oppCount = 142;
    const opmElement = document.getElementById('opm');
    if (opmElement) {
      const oppInterval = setInterval(() => {
        oppCount = Math.floor(140 + Math.random() * 20);
        opmElement.textContent = `${oppCount}/m`;
      }, 3000);
      return () => clearInterval(oppInterval);
    }
  }, [dashboardData]);

  const StatIcon = ({ children, tone = "blue" }) => {
    const bgColors = {
      blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      teal: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400',
      green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      gold: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    };
    return (
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${bgColors[tone] || bgColors.blue}`}>
        {children}
      </div>
    );
  };

  const inr = (n) => Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  const leftBiz = Number(dashboardData?.[0]?.LeftBussiness ?? dashboardData?.[0]?.LeftBusiness ?? 0);
  const rightBiz = Number(dashboardData?.[0]?.RightBussiness ?? dashboardData?.[0]?.RightBusiness ?? 0);
  const totalTeam = dashboardData?.[0]?.TotalTeam ?? ((dashboardData?.[0]?.LeftTeam || 0) + (dashboardData?.[0]?.RightTeam || 0));
  const activeTeam = dashboardData?.[0]?.ActiveTeam ?? 0;
  const teamBusiness = dashboardData?.[0]?.TeamBusiness ?? (leftBiz + rightBiz);
  const strongTeamBusiness = dashboardData?.[0]?.StrongTeamBusiness ?? Math.max(leftBiz, rightBiz);
  const otherLegBusiness = dashboardData?.[0]?.OtherLegBusiness ?? Math.min(leftBiz, rightBiz);

  const quickActions = [
    {
      key: 'Deposit', label: 'Deposit', active: true, path: '/user/dashboard/deposit', icon: (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18"><rect x="3" y="5" width="14" height="11" rx="2" /><path d="M3 8h14" strokeLinecap="round" /></svg>
      )
    },
    {
      key: 'Withdraw', label: 'Withdraw', path: '/user/dashboard/wallet-statement', icon: (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18"><path d="M10 3v11M6 10l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 16.5h12" strokeLinecap="round" /></svg>
      )
    },
    {
      key: 'BuyPackage', label: 'Buy Package', path: '/user/dashboard/analytics', icon: (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18"><path d="M3 7l7-4 7 4-7 4-7-4z" /><path d="M3 7v6l7 4 7-4V7" /></svg>
      )
    },
    {
      key: 'MyTeam', label: 'My Team', path: '/user/dashboard/fund-director', icon: (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18"><circle cx="7" cy="6" r="2.4" /><circle cx="14" cy="7" r="2" /><path d="M2 17c0-2.6 2.3-4.5 5-4.5s5 1.9 5 4.5" strokeLinecap="round" /><path d="M13 12.8c1.9.3 3.5 1.9 3.5 4.2" strokeLinecap="round" /></svg>
      )
    },
    {
      key: 'GrowthRewards', label: 'Growth Rewards', path: '/user/dashboard/Team', icon: (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18"><circle cx="10" cy="10" r="6.5" /><path d="M10 6.5v3.5l2.3 2.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
      )
    },
    {
      key: 'Accelerator', label: 'Accelerator', path: '/user/dashboard/income-statement', icon: (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18"><path d="M10 2l1.8 4.6L17 8l-4 3.2L14 17l-4-2.7L6 17l1-5.8-4-3.2 5.2-1.4L10 2z" strokeLinejoin="round" /></svg>
      )
    },
    {
      key: 'Transactions', label: 'Transactions', path: '/user/dashboard/my-rewards', icon: (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18"><path d="M4 6h9l-2.5-2.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 14H7l2.5 2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      )
    },
  ];

  const [activeQuickAction, setActiveQuickAction] = useState('Deposit');

  const wallets = [
    {
      key: 'income',
      label: 'Income Wallet',
      value: dashboardData?.[0]?.IncomeWallet ?? 0,
      icon: (<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18"><circle cx="10" cy="10" r="7" /><path d="M10 6.5v7M7.5 8.3c0-1 .9-1.6 2.5-1.6s2.5.7 2.5 1.7-1 1.4-2.5 1.6c-1.6.2-2.5.7-2.5 1.7s.9 1.7 2.5 1.7 2.5-.6 2.5-1.6" strokeLinecap="round" /></svg>),
      primaryLabel: 'Withdraw',
      onPrimary: () => router.push('/user/dashboard/withdraw'),
    },
    {
      key: 'trading',
      label: 'Trading Wallet',
      value: dashboardData?.[0]?.TradingWallet ?? 0,
      icon: (<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18"><polyline points="2,14 6,8 10,11 14,5 18,8" /></svg>),
      primaryLabel: 'Trade',
      onPrimary: () => router.push('/user/dashboard/trade'),
    },
    {
      key: 'deposit',
      label: 'Deposit Wallet',
      value: dashboardData?.[0]?.DepositWallet ?? 0,
      icon: (<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18"><rect x="3" y="6" width="14" height="10" rx="2" /><path d="M3 9h14" strokeLinecap="round" /></svg>),
      primaryLabel: 'Deposit',
      onPrimary: () => router.push('/user/dashboard/deposit'),
    },
  ];

  const growthLevels = [
    { level: 'G1', required: 100000, current: 100000, reward: 5000 },
    { level: 'G2', required: 250000, current: 250000, reward: 10000 },
    { level: 'G3', required: 500000, current: Number(dashboardData?.[0]?.TeamBusiness ?? 425000), reward: 25000 },
    { level: 'G4', required: 1000000, current: Number(dashboardData?.[0]?.TeamBusiness ?? 425000), reward: 50000 },
  ];
  const currentGrowthIdx = Math.max(0, growthLevels.findIndex(g => g.current < g.required));
  const activeGrowthIdx = currentGrowthIdx === -1 ? growthLevels.length - 1 : currentGrowthIdx;
  const growthPct = Math.min(100, Math.round((growthLevels[activeGrowthIdx].current / growthLevels[activeGrowthIdx].required) * 100));

  const rankLevels = [
    { rank: 'V1', business: '₹5L', status: 'achieved' },
    { rank: 'V2', business: '₹10L', status: 'current', progress: 75 },
    { rank: 'V3', business: '₹25L', status: 'upcoming' },
    { rank: 'V4', business: '₹50L', status: 'upcoming' },
    { rank: 'V5', business: '₹1Cr', status: 'upcoming' },
  ];

  const recentTransactions = [
    { id: '#TRX10291', date: '24 Aug 2026', type: 'Daily Trading Income', wallet: 'Income Wallet', amount: '+₹5,250', status: 'Completed', tone: 'success' },
    { id: '#TRX10277', date: '23 Aug 2026', type: 'Direct Income', wallet: 'Income Wallet', amount: '+₹2,000', status: 'Completed', tone: 'success' },
    { id: '#TRX10254', date: '22 Aug 2026', type: 'Withdrawal', wallet: 'Income Wallet', amount: '-₹8,000', status: 'Pending', tone: 'warning' },
    { id: '#TRX10231', date: '21 Aug 2026', type: 'Team Trading Income', wallet: 'Trading Wallet', amount: '+₹3,420', status: 'Completed', tone: 'success' },
    { id: '#TRX10198', date: '20 Aug 2026', type: 'Deposit', wallet: 'Deposit Wallet', amount: '+₹25,000', status: 'Failed', tone: 'danger' },
  ];

  const recentAchievements = [
    { title: 'Trading Package Activated', sub: 'Elite package unlocked full benefits' },
    { title: 'Growth Reward G2 Achieved', sub: '₹10,000 reward credited' },
    { title: '100 Active Team Members', sub: 'Team milestone reached' },
    { title: `Accelerator ${dashboardData?.[0]?.UserRank || 'V1'} Achieved`, sub: 'First rank unlocked' },
  ];

  const CircularGauge = ({ percent = 0, size = 120, stroke = 9, colorFrom = "#0ea5e9", colorTo = "#14b8a6", gradId, centerTop, centerBottom, track = true }) => {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const off = c - (c * Math.min(100, Math.max(0, percent))) / 100;
    const cx = size / 2, cy = size / 2;
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={colorFrom} />
              <stop offset="100%" stopColor={colorTo} />
            </linearGradient>
          </defs>
          {track && <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E5E7EB" className="dark:stroke-gray-700" strokeWidth={stroke} />}
          <circle
            cx={cx} cy={cy} r={r} fill="none"
            stroke={`url(#${gradId})`} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={off}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-base font-bold text-gray-900 dark:text-white">{centerTop}</div>
          {centerBottom && <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 text-center">{centerBottom}</div>}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen  text-gray-900 dark:text-white`}>

      {/* SIMPLE POPUP */}
      {showSimplePopup && isKidOne && !shouldBotBeActive && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) closeSimplePopup(); }}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="h-1 bg-gradient-to-r from-teal-400 to-blue-400"></div>
            <button type="button" className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg" onClick={closeSimplePopup} aria-label="Close">✕</button>
            <div className="p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <svg width="34" height="34" viewBox="0 0 64 64" fill="none">
                  <rect x="10" y="18" width="44" height="34" rx="9" stroke="#14b8a6" strokeWidth="1.8" />
                  <rect x="10" y="18" width="44" height="12" rx="9" fill="rgba(20,184,166,0.15)" />
                  <rect x="19" y="28" width="8" height="8" rx="3" fill="#0ea5e9" />
                  <rect x="37" y="28" width="8" height="8" rx="3" fill="#14b8a6" />
                  <circle cx="23" cy="32" r="2" fill="#fff" opacity=".7" />
                  <circle cx="41" cy="32" r="2" fill="#fff" opacity=".7" />
                  <path d="M22 42h20" stroke="#14b8a6" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M26 18V13M38 18V13" stroke="#14b8a6" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="26" cy="11" r="3" fill="#0ea5e9" />
                  <circle cx="38" cy="11" r="3" fill="#0ea5e9" />
                </svg>
              </div>
              <h5 className="text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-500 dark:from-teal-400 dark:to-blue-400">🤖 Trading Bot Activation Required</h5>
              <p className="text-gray-500 dark:text-gray-400 text-base mb-2">Dear Investor,</p>
              <p className="text-base mb-3 text-gray-700 dark:text-gray-300">To start receiving your trading income, please activate the AI Trading Bot once from your dashboard.</p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-base text-blue-700 dark:text-blue-300 mb-2">⚡ After activation, the system will automatically connect your account with the trading engine and your trading income process will begin.</div>
            </div>
          </div>
        </div>
      )}

      {/* BUY PACKAGE POPUP */}
      {showBuyPackagePopup && isKidFive && !shouldBotBeActive && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) closeBuyPackagePopup(); }}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-400"></div>
            <button type="button" className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg" onClick={closeBuyPackagePopup} aria-label="Close">✕</button>
            <div className="p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-4">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.5">
                  <path d="M20 7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7Z" />
                  <path d="M16 21V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V21" />
                  <path d="M12 7V5" /><path d="M9 13H15" /><path d="M12 10V16" />
                </svg>
              </div>
              <h5 className="text-2xl font-bold mb-3 text-amber-600 dark:text-amber-400">📦 Package Purchase Required</h5>
              <p className="text-gray-500 dark:text-gray-400 text-base mb-2">Dear Investor,</p>
              <p className="text-base mb-3 text-gray-700 dark:text-gray-300">Please purchase a trading package to activate your AI Trading Bot.</p>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 text-base text-amber-700 dark:text-amber-300 mb-2">🛒 Choose a package that suits your investment goals and start earning!</div>
            </div>
          </div>
        </div>
      )}

      {/* CONGRATULATION POPUP */}
      {showCongratsPopup && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) closeCongratsPopup(); }}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="h-1 bg-gradient-to-r from-emerald-400 via-amber-400 to-purple-400"></div>
            <button type="button" className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg" onClick={closeCongratsPopup} aria-label="Close">✕</button>
            <div className="p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-purple-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🤖</span>
              </div>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-400 mb-1">🎉 Woo Hoo! 🎉</div>
              <div className="text-xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-emerald-500 dark:from-amber-400 dark:to-emerald-400">Bot Activated Successfully!</div>
              <p className="text-base mb-2 text-gray-700 dark:text-gray-300">Your AI Trading Bot is now live and actively monitoring the markets!</p>
              <p className="text-base text-gray-500 dark:text-gray-400">🚀 The bot has started scanning for profitable opportunities</p>
            </div>
          </div>
        </div>
      )}

      {/* BOT ACTIVATION FULL POPUP */}
      {showBotPopup && isKidOne && !shouldBotBeActive && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="botOv" onClick={(e) => { if (e.target === e.currentTarget) closeBotFullPopup(); }}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="h-1 bg-gradient-to-r from-teal-400 to-blue-400"></div>
            <button type="button" className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg" onClick={closeBotFullPopup} aria-label="Close">✕</button>
            <div className="p-6">
              <div className="flex gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <svg width="38" height="38" viewBox="0 0 64 64" fill="none">
                    <rect x="10" y="18" width="44" height="34" rx="9" stroke="#14b8a6" strokeWidth="1.5" />
                    <rect x="10" y="18" width="44" height="12" rx="9" fill="rgba(20,184,166,0.15)" />
                    <rect x="19" y="28" width="8" height="8" rx="3" fill="#0ea5e9" opacity=".9" />
                    <rect x="37" y="28" width="8" height="8" rx="3" fill="#14b8a6" opacity=".9" />
                    <circle cx="23" cy="32" r="2" fill="#fff" opacity=".7" />
                    <circle cx="41" cy="32" r="2" fill="#fff" opacity=".7" />
                    <path d="M22 42h20" stroke="#14b8a6" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-xl mb-1 text-gray-900 dark:text-white">🤖 Trading <span className="text-teal-600 dark:text-teal-400">Bot Activation Required</span></div>
                  <div className="text-base text-gray-500 dark:text-gray-400 leading-snug">Dear Investor, To start receiving your trading income, please activate the AI Trading Bot once from your dashboard.</div>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-base text-blue-700 dark:text-blue-300 mb-4">⚡ After activation, the system will automatically connect your account with the trading engine and your trading income process will begin.</div>
              <ul className="space-y-2 text-base text-gray-700 dark:text-gray-300 mb-4">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>The bot may execute automated buy/sell orders</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>Perform arbitrage and MEV trading</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>Monitor market opportunities 24/7</li>
              </ul>
              <div className="flex items-center gap-2 mb-4">
                <input type="checkbox" id="approveTrading" className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-teal-600 dark:text-teal-400 focus:ring-teal-500" checked={isCheckboxChecked} onChange={(e) => setIsCheckboxChecked(e.target.checked)} />
                <label htmlFor="approveTrading" className="text-base text-gray-700 dark:text-gray-300 cursor-pointer">I understand and approve automated trading execution.</label>
              </div>
              <button className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-gray-50 font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base" onClick={activateBot} disabled={shouldBotBeActive || !isCheckboxChecked}>
                {shouldBotBeActive ? '✔ Bot Active' : '🔴 Activate Bot — Start Earning Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REFERRAL POPUP */}
      {showRefPopup && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="refOv" onClick={(e) => { if (e.target === e.currentTarget) closeRef(); }}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="h-1 bg-gradient-to-r from-teal-400 to-amber-400"></div>
            <button type="button" className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg" onClick={closeRef} aria-label="Close">✕</button>
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="text-xl font-bold mb-1 text-gray-900 dark:text-white">Invite &amp; <span className="text-teal-600 dark:text-teal-400">Earn</span></div>
                <div className="text-base text-gray-500 dark:text-gray-400">Share your link · Earn up to <strong className="text-amber-500">8% commission</strong> on every trade — 3 levels deep, paid daily</div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3"><div className="font-bold text-teal-600 dark:text-teal-400 text-base">12</div><div className="text-sm text-gray-500 dark:text-gray-400">Referrals</div></div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3"><div className="font-bold text-emerald-600 dark:text-emerald-400 text-base">$841</div><div className="text-sm text-gray-500 dark:text-gray-400">Earned</div></div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3"><div className="font-bold text-blue-500 text-base">$92k</div><div className="text-sm text-gray-500 dark:text-gray-400">Team Vol</div></div>
              </div>
              <div className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Your Unique Referral Link</div>
              <div className="font-mono text-sm bg-gray-100 dark:bg-gray-700 rounded-xl p-3 border border-dashed border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 break-all mb-3">https://arbion.ai/ref/ARB-a9x7k2-premium</div>
              <button className="w-full bg-gradient-to-r from-teal-600 to-blue-500 hover:from-teal-700 hover:to-blue-600 text-white font-bold py-3 rounded-xl transition-all mb-4 text-base" onClick={copyRef}>{copySuccess ? "✓ Copied!" : "Copy Referral Link"}</button>
              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div className="rounded-xl p-3 border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/20"><div className="font-bold text-emerald-600 dark:text-emerald-400 text-base">8%</div><div className="text-sm text-gray-500 dark:text-gray-400">Level 1</div></div>
                <div className="rounded-xl p-3 border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20"><div className="font-bold text-blue-500 text-base">5%</div><div className="text-sm text-gray-500 dark:text-gray-400">Level 2</div></div>
                <div className="rounded-xl p-3 border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/20"><div className="font-bold text-purple-500 text-base">3%</div><div className="text-sm text-gray-500 dark:text-gray-400">Level 3</div></div>
              </div>
              <div className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Share on Social Media</div>
              <div className="grid grid-cols-4 gap-2">
                <button className="bg-[#25D366] hover:bg-[#1da85c] text-white text-sm font-bold py-2 rounded-lg transition-all" onClick={() => shareOn('WhatsApp')}>WA</button>
                <button className="bg-[#1877F2] hover:bg-[#0d65d6] text-white text-sm font-bold py-2 rounded-lg transition-all" onClick={() => shareOn('Facebook')}>FB</button>
                <button className="bg-[#E4405F] hover:bg-[#c72e4c] text-white text-sm font-bold py-2 rounded-lg transition-all" onClick={() => shareOn('Instagram')}>IG</button>
                <button className="bg-[#0088cc] hover:bg-[#006699] text-white text-sm font-bold py-2 rounded-lg transition-all" onClick={() => shareOn('Telegram')}>TG</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RANK PROGRESS */}
      <RankProgress activeRank={dashboardData?.[0]?.UserRank} NextRank={dashboardData?.[0]?.NextRank} totQualifyRnk={dashboardData?.[0]?.totQualifyRnk} />

      {/* QUICK ACTIONS */}
      <div className="mt-6 mb-3">
        <h5 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h5>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 mb-6">
        {quickActions.map((qa) => (
          <button
            key={qa.key}
            type="button"
            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-md ${
              activeQuickAction === qa.key 
                ? 'border-teal-500 dark:border-teal-400 shadow-md bg-teal-50 dark:bg-teal-900/20' 
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            onClick={() => { setActiveQuickAction(qa.key); if (qa.path) router.push(qa.path); }}
          >
            <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
              {qa.icon}
            </span>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">{qa.label}</span>
          </button>
        ))}
      </div>

      {/* RANK & PACKAGE */}
      <div className="mb-3">
        <h5 className="text-xl font-bold text-gray-900 dark:text-white">Accelerator Rank</h5>
        <p className="text-lg text-gray-500 dark:text-gray-400">Your premium rank achievement system</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white  rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">Your Rank Journey</div>
          <div className="text-base text-gray-500 dark:text-gray-400 mb-4">Your premium rank achievement system</div>
          <div className="flex flex-wrap items-center gap-6">
            <CircularGauge
              percent={rankLevels.find(r => r.status === 'current')?.progress || 0}
              size={100} stroke={9} colorFrom="#5eead4" colorTo="#0d9488" gradId="rankGrad"
              centerTop={dashboardData?.[0]?.UserRank || 'V1'}
              centerBottom={`${rankLevels.find(r => r.status === 'current')?.progress || 0}%`}
            />
            <div className="flex-1 min-w-[140px]">
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-lg text-gray-500 dark:text-gray-400">Current Business</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">₹{Number(dashboardData?.[0]?.TeamBusiness || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-lg text-gray-500 dark:text-gray-400">Next Rank</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{dashboardData?.[0]?.NextRank || 'V2'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-lg text-gray-500 dark:text-gray-400">Required Business</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">₹10,00,000</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-lg text-gray-500 dark:text-gray-400">Remaining</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">₹2,50,000</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-bold text-gray-900 dark:text-white">Trading Package</div>
            <span className="text-base font-semibold px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">${dashboardData?.[0]?.TotalInvestment || "0.00"}</span>
          </div>
          <div className="flex justify-center my-3">
            <CircularGauge percent={visualPercent} size={110} stroke={9} colorFrom="#0ea5e9" colorTo="#14b8a6" gradId="rg" centerTop={`${visualPercent}%`} centerBottom="used" />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div><div className="text-base text-gray-500 dark:text-gray-400">Total Income</div><div className="font-bold text-teal-600 dark:text-teal-400 text-base">${(dashboardData?.[0]?.TotalIncome || 0).toFixed(2) || "0.00"}</div></div>
            <div><div className="text-base text-gray-500 dark:text-gray-400">Max Limit</div><div className="font-bold text-amber-500 text-base">${(dashboardData?.[0]?.EarningLimit || 0).toFixed(2) || "0.00"}</div></div>
            <div><div className="text-base text-gray-500 dark:text-gray-400">Remaining</div><div className="font-bold text-emerald-600 dark:text-emerald-400 text-base">${(dashboardData?.[0]?.RemainingLimit || 0).toFixed(2) || "0.00"}</div></div>
          </div>
        </div>
      </div>

      {/* INCOME OVERVIEW */}
      <div className="mb-3">
        <h5 className="text-xl font-bold text-gray-900 dark:text-white">Income Overview</h5>
        <p className="text-lg text-gray-500 dark:text-gray-400">Your earnings across all Roventar income streams</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { key: 'SingleLegIncome', label: 'Single Leg Income', value: dashboardData?.[0]?.SingleSpillIncome || "0.00", today: dashboardData?.[0]?.SingleSpillIncomeToday || "0.00", path: '/user/dashboard/income-statement?tab=SingleLegIncome' },
          { key: 'PairVolumeIncome', label: 'Pair Volume Income', value: dashboardData?.[0]?.PairVolumeIncome || "0.00", today: dashboardData?.[0]?.PairVolumeIncomeToday || "0.00", path: '/user/dashboard/income-statement?tab=PairVolumeIncome' },
          { key: 'TradingBotIncome', label: 'Trading Bot Income', value: dashboardData?.[0]?.TradingBotIncome || "0.00", today: dashboardData?.[0]?.TradingBotIncomeToday || "0.00", path: '/user/dashboard/income-statement?tab=TradingBotIncome' },
          { key: 'LeadershipRecurringIncome', label: 'Leadership Recurring Income', value: dashboardData?.[0]?.LeadershipTradingIncome || "0.00", today: dashboardData?.[0]?.LeadershipTradingIncomeToday || "0.00", path: '/user/dashboard/income-statement?tab=LeadershipRecurringIncome' },
          { key: 'PowerBoostIncome', label: 'Power Boost Income', value: dashboardData?.[0]?.PowerBoostIncome || "0.00", today: dashboardData?.[0]?.PowerBoostIncomeToday || "0.00", path: '/user/dashboard/income-statement?tab=PowerBoostIncome' },
          { key: 'RewardIncome', label: 'Reward Income', value: dashboardData?.[0]?.RewardIncome || "0.00", today: dashboardData?.[0]?.RewardIncomeToday || "0.00", path: '/user/dashboard/income-statement?tab=RewardIncome' },
        ].map((item) => (
          <div key={item.key} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all" role="button" onClick={() => router.push(item.path)}>
            <div className="flex justify-between items-start mb-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                <svg viewBox="0 0 20 20" fill="none" strokeWidth="1.5" width="17" height="17" stroke="currentColor"><circle cx="7" cy="5.5" r="3" /><circle cx="14" cy="6.5" r="2.5" /><path d="M1 17c0-2.8 2.7-5 6-5s6 2.2 6 5" strokeLinecap="round" /><path d="M14 10.5c2 .4 3.5 2 3.5 4" strokeLinecap="round" /></svg>
              </div>
              <span className="text-base font-bold px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">↗ ${item.today}</span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{item.label}</div>
            <div className="text-lg font-extrabold text-gray-900 dark:text-white">${item.value}</div>
          </div>
        ))}
      </div>

      {/* WALLET OVERVIEW */}
      <div className="mb-3">
        <h5 className="text-xl font-bold text-gray-900 dark:text-white">Wallet Overview</h5>
        <p className="text-lg text-gray-500 dark:text-gray-400">Manage your Roventar wallet balances</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {wallets.map((w) => (
          <div key={w.key} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
            <div className="flex justify-between items-start mb-3">
              <StatIcon tone="teal">{w.icon}</StatIcon>
              <span className="text-sm font-bold px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">Active</span>
            </div>
            <div className="text-base text-gray-500 dark:text-gray-400">{w.label}</div>
            <div className="text-xl font-extrabold text-gray-900 dark:text-white mb-4">${Number(w.value || 0).toFixed(2)}</div>
            <div className="flex gap-2">
              <button type="button" className="flex-1 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 font-semibold py-2.5 rounded-xl transition-all text-base" onClick={() => router.push('/user/dashboard/wallet')}>View Wallet</button>
              <button type="button" className="flex-1 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-gray-50 font-bold py-2.5 rounded-xl transition-all text-base" onClick={w.onPrimary}>{w.primaryLabel}</button>
            </div>
          </div>
        ))}
      </div>

      {/* BOT + SUMMARY */}
      <div className="mb-3">
        <h5 className="text-xl font-bold text-gray-900 dark:text-white">AI Trading Engine</h5>
        <p className="text-lg text-gray-500 dark:text-gray-400">Live bot status and your summary report</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 relative overflow-hidden">
          <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
            <div className="flex gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500/20 to-blue-500/20 flex items-center justify-center text-2xl">🤖</div>
                {shouldBotBeActive && <span className="absolute -inset-1 rounded-full border-2 border-teal-400 animate-ping opacity-40"></span>}
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">Roventar AI Engine</div>
                <div className="flex items-center gap-2 text-base text-gray-500 dark:text-gray-400 flex-wrap">
                  <span>Uptime {formatElapsedTime(elapsedSeconds)}</span>
                </div>
              </div>
            </div>
            <span className={`text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
              shouldBotBeActive 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${shouldBotBeActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              {shouldBotBeActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p className="text-base text-gray-500 dark:text-gray-400 mb-4">AI-driven Forex &amp; Crypto trading engine operating 24/7 — automatically scanning market trends and executing profitable trading opportunities with high-speed precision.</p>
          <div className="grid grid-cols-4 gap-2 text-center mb-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5">
              <div className="font-bold text-gray-900 dark:text-white text-base">{dashboardData?.[0]?.Bot || 'N/A'}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Bot</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5">
              <div className="font-bold text-gray-900 dark:text-white text-base">~{dashboardData?.[0]?.APY}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">APY</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5">
              <div className="font-bold text-gray-900 dark:text-white text-base" id="powerBoosterStatus">{dashboardData?.[0]?.PowerBoosterStatus}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Boost Status</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5">
              <div className="font-bold text-gray-900 dark:text-white text-base">{dashboardData?.[0]?.BoosterValue}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Boost Power</div>
            </div>
          </div>
          <button
            className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-gray-50 font-bold py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-3 text-base"
            onClick={() => {
              if (isKidFive && !shouldBotBeActive) {
                setShowBuyPackagePopup(true);
              } else if (isKidOne && !shouldBotBeActive) {
                openBotFullPopup();
              }
            }}
            disabled={shouldBotBeActive || isKidFive || (!isKidOne && !isKidFive)}
          >
            {shouldBotBeActive ? '✔ Bot Active' :
              (isKidFive ? '🔒 Bot Unavailable' :
                (isKidOne ? '▶ Activate Bot' : '🔒 Not Available'))}
          </button>
          {shouldBotBeActive && (
            <div className="flex flex-wrap items-center gap-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3" id="botNotif2">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="flex-shrink-0"><polyline points="2,8 5.5,11.5 14,3.5" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span className="text-base text-gray-700 dark:text-gray-300"><strong>Your Bot is now ACTIVATED!</strong> — Scanning 142+ opportunities/min across SOL, ETH &amp; BSC. First profit expected within 60 seconds.</span>
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full text-sm font-bold text-emerald-700 dark:text-emerald-300" id="timerBox2">
                <span>{formatBotTime(botTime)}</span>
                <span>🟢 Running</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Summary Report Status</div>
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center gap-1.5 cursor-pointer" role="button" onClick={openRef}>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
              {dashboardData?.[0]?.PowerBoosterStatus || "N/A"}
            </span>
          </div>
          <div id="ol" ref={oppLRef}></div>
        </div>
      </div>

      {/* BUSINESS OVERVIEW */}
      <div className="mb-3">
        <h5 className="text-lg font-bold text-gray-900 dark:text-white">Business Overview</h5>
        <p className="text-base text-gray-500 dark:text-gray-400">Your team&apos;s collective trading business</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {[
          { key: 'totalTeam', label: 'Total Team', value: totalTeam, icon: 'M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9.5 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87', tone: 'teal' },
          { key: 'activeTeam', label: 'Active Team', value: activeTeam, icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6', tone: 'green' },
          { key: 'teamBusiness', label: 'Team Business', value: `₹${inr(teamBusiness)}`, icon: 'M3 17l6-6 4 4 8-8M15 7h6v6', tone: 'blue' },
          { key: 'strongTeamBusiness', label: 'Strong Team Business', value: `₹${inr(strongTeamBusiness)}`, icon: 'M13 2L4 14h6l-1 8 9-12h-6l1-8Z', tone: 'gold' },
          { key: 'otherLegBusiness', label: 'Other Leg Business', value: `₹${inr(otherLegBusiness)}`, icon: 'M12 12a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', tone: 'teal' },
        ].map((item) => (
          <div key={item.key} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
            <StatIcon tone={item.tone}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" width="18" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg>
            </StatIcon>
            <div className="text-xl font-extrabold text-gray-900 dark:text-white mt-2">{item.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{item.label}</div>
            <div className="flex items-end gap-0.5 h-7 mt-2">
              {[10, 22, 14, 26, 12, 24].map((h, i) => (
                <span key={i} className={`flex-1 rounded-sm ${i === 2 || i === 4 ? 'bg-teal-500' : 'bg-gray-200 dark:bg-gray-700'}`} style={{ height: `${h}px` }}></span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* DIRECT TEAM PERFORMANCE */}
      <div className="mb-3">
        <h5 className="text-lg font-bold text-gray-900 dark:text-white">Direct Team Performance</h5>
        <p className="text-base text-gray-500 dark:text-gray-400">Track your directly sponsored members</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
          <StatIcon tone="blue">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" width="18" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          </StatIcon>
          <div className="text-xl font-extrabold text-gray-900 dark:text-white mt-2">{dashboardData?.[0]?.TotalDirect ?? 0}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Direct</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
          <StatIcon tone="green">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" width="18" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></svg>
          </StatIcon>
          <div className="text-xl font-extrabold text-gray-900 dark:text-white mt-2">{dashboardData?.[0]?.ActiveDirect ?? 0}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Active Direct</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
          <StatIcon tone="teal">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" width="18" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
          </StatIcon>
          <div className="text-xl font-extrabold text-gray-900 dark:text-white mt-2">&#8377;{Number(dashboardData?.[0]?.DirectBusiness ?? dashboardData?.[0]?.DirectBussiness ?? 0).toLocaleString('en-IN')}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Direct Business</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
          <StatIcon tone="gold">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" width="18" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><rect x="7" y="12" width="3" height="6" /><rect x="12" y="8" width="3" height="10" /><rect x="17" y="5" width="3" height="13" /></svg>
          </StatIcon>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-1">Level Open</div>
          <span className="text-sm font-bold px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            LEVEL {dashboardData?.[0]?.LevelOpen ?? 0} OPEN
          </span>
        </div>
      </div>

      {/* GROWTH REWARDS BANNER */}
      <div className="mb-3">
        <h5 className="text-lg font-bold text-gray-900 dark:text-white">Growth Rewards</h5>
        <p className="text-base text-gray-500 dark:text-gray-400">Build your business. Unlock your next milestone.</p>
      </div>
      <div className="bg-gradient-to-r from-teal-900 to-slate-800 rounded-2xl p-5 mb-6 text-white shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-center">
          <div className="lg:col-span-2">
            <div className="text-sm font-bold uppercase tracking-wider text-teal-300/80 mb-1">Current Milestone</div>
            <div className="text-xl font-extrabold text-teal-200">{growthLevels[activeGrowthIdx]?.level} — ₹{Number(growthLevels[activeGrowthIdx]?.reward).toLocaleString('en-IN')} Reward</div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div><div className="text-sm text-teal-300/70">Business Requirement</div><div className="font-bold text-gray-50 text-base">₹{Number(growthLevels[activeGrowthIdx]?.required).toLocaleString('en-IN')}</div></div>
              <div><div className="text-sm text-teal-300/70">Current Business</div><div className="font-bold text-gray-50 text-base">₹{Number(growthLevels[activeGrowthIdx]?.current).toLocaleString('en-IN')}</div></div>
              <div><div className="text-sm text-teal-300/70">Remaining</div><div className="font-bold text-gray-50 text-base">₹{Math.max(0, Number(growthLevels[activeGrowthIdx]?.required) - Number(growthLevels[activeGrowthIdx]?.current)).toLocaleString('en-IN')}</div></div>
            </div>
          </div>
          <div className="flex justify-center">
            <CircularGauge percent={growthPct} size={120} stroke={10} colorFrom="#5eead4" colorTo="#14b8a6" gradId="growthGrad" centerTop={`${growthPct}%`} centerBottom={`${growthLevels[activeGrowthIdx]?.level} Progress`} />
          </div>
        </div>
      </div>

      {/* GROWTH REWARD JOURNEY */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 mb-6">
        <div className="font-bold text-lg text-gray-900 dark:text-white mb-4">Growth Reward Journey</div>
        <div className="flex items-center mb-5">
          {growthLevels.map((g, i) => (
            <div key={g.level} className="flex items-center flex-1 last:flex-0">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0 ${
                i < activeGrowthIdx ? 'bg-teal-600 text-white' : 
                i === activeGrowthIdx ? 'bg-white dark:bg-gray-800 border-2 border-teal-500 text-teal-600 dark:text-teal-400 shadow-md' : 
                'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                {i < activeGrowthIdx ? (
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><polyline points="2,8 5.5,11.5 14,3.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : g.level}
              </div>
              {i < growthLevels.length - 1 && <div className={`h-0.5 flex-1 mx-1 ${i < activeGrowthIdx ? 'bg-teal-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>}
            </div>
          ))}
        </div>
        <div className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Milestone Details</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-2 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Level</th>
                <th className="text-left py-2 px-2 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Business Required</th>
                <th className="text-left py-2 px-2 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Current Business</th>
                <th className="text-left py-2 px-2 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Reward</th>
                <th className="text-left py-2 px-2 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {growthLevels.map((g, i) => {
                const pct = Math.min(100, Math.round((g.current / g.required) * 100));
                const status = i < activeGrowthIdx ? 'Qualified' : i === activeGrowthIdx ? `${pct}%` : 'Upcoming';
                const statusClass = i < activeGrowthIdx ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 
                  i === activeGrowthIdx ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 
                  'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400';
                return (
                  <tr key={g.level} className="border-b border-gray-100 dark:border-gray-700/50 last:border-b-0">
                    <td className="py-2.5 px-2 font-semibold text-gray-900 dark:text-white">{g.level}</td>
                    <td className="py-2.5 px-2 text-gray-700 dark:text-gray-300">₹{(g.required / 100000).toFixed(1)}L</td>
                    <td className="py-2.5 px-2 text-gray-700 dark:text-gray-300">₹{(g.current / 100000).toFixed(2)}L</td>
                    <td className="py-2.5 px-2 text-gray-700 dark:text-gray-300">₹{(g.reward / 1000)}K</td>
                    <td className="py-2.5 px-2"><span className={`text-sm font-bold px-3 py-1 rounded-full ${statusClass}`}>{status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ACCELERATOR RANK + RECENT TRANSACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <div className="font-bold text-lg text-gray-900 dark:text-white mb-4">Your Rank Journey</div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
            {rankLevels.map((r) => (
              <div key={r.rank} className={`rounded-xl p-2.5 text-center border ${
                r.status === 'achieved' ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/20' :
                r.status === 'current' ? 'border-teal-500 dark:border-teal-400 bg-teal-50/50 dark:bg-teal-900/20' :
                'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
              }`}>
                <div className="text-base font-extrabold text-gray-900 dark:text-white">{r.rank}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{r.business}</div>
                <div className={`text-sm font-bold mt-0.5 ${
                  r.status === 'achieved' ? 'text-emerald-600 dark:text-emerald-400' :
                  r.status === 'current' ? 'text-teal-600 dark:text-teal-400' :
                  'text-gray-400 dark:text-gray-500'
                }`}>
                  {r.status === 'achieved' ? '✓ Achieved' : r.status === 'current' ? `${r.progress}% Progress` : 'Upcoming'}
                </div>
              </div>
            ))}
          </div>
          <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4">
            <div className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Your Next Milestone</div>
            <div className="text-base font-bold text-gray-900 dark:text-white mb-1">Grow your team business by ₹2,50,000</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">You are only 25% away from Accelerator {dashboardData?.[0]?.NextRank || 'V2'}.</div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-sm font-semibold px-3 py-1.5 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">Build active team</span>
              <span className="text-sm font-semibold px-3 py-1.5 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">Increase direct business</span>
              <span className="text-sm font-semibold px-3 py-1.5 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">Improve team volume</span>
            </div>
            <button type="button" className="bg-teal-400 text-gray-50 font-bold py-2 px-5 rounded-xl transition-all text-base" onClick={() => router.push('/dashboard/team')}>View Business</button>
          </div>
        </div>

        {/* RECENT TRANSACTIONS */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <div className="flex flex-wrap justify-between items-end gap-2 mb-3">
            <div>
              <h5 className="text-base font-bold text-gray-900 dark:text-white">Recent Transactions</h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your latest wallet activity</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-2 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
                  <th className="text-left py-2 px-2 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">ID</th>
                  <th className="text-left py-2 px-2 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Type</th>
                  <th className="text-left py-2 px-2 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Wallet</th>
                  <th className="text-right py-2 px-2 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Amount</th>
                  <th className="text-left py-2 px-2 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((t) => (
                  <tr key={t.id} className="border-b border-gray-100 dark:border-gray-700/50 last:border-b-0">
                    <td className="py-2.5 px-2 text-gray-600 dark:text-gray-400 text-sm">{t.date}</td>
                    <td className="py-2.5 px-2 font-mono text-sm text-gray-700 dark:text-gray-300">{t.id}</td>
                    <td className="py-2.5 px-2 text-gray-700 dark:text-gray-300 text-sm">{t.type}</td>
                    <td className="py-2.5 px-2 text-gray-700 dark:text-gray-300 text-sm">{t.wallet}</td>
                    <td className={`py-2.5 px-2 text-right font-bold text-sm ${t.amount.startsWith('-') ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{t.amount}</td>
                    <td className="py-2.5 px-2">
                      <span className={`text-sm font-bold px-2.5 py-1 rounded-full ${
                        t.tone === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                        t.tone === 'warning' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' :
                        'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                      }`}>{t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="mb-3">
        <h5 className="text-lg font-bold text-gray-900 dark:text-white">Support &amp; Updates</h5>
        <p className="text-base text-gray-500 dark:text-gray-400">Assistant help and the latest Roventar notifications</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="text-base font-bold text-gray-900 dark:text-white">Recent Achievements</div>
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">{recentAchievements.length}</span>
          </div>
          <div className="space-y-2">
            {recentAchievements.map((a) => (
              <div key={a.title} className="flex items-start gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700">
                <div className="w-6 h-6 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><polyline points="2,8 5.5,11.5 14,3.5" stroke="#0d9488" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{a.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{a.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <XoxoFxChatbot />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="text-base font-bold text-gray-900 dark:text-white">Notifications</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{notificationCount} items</div>
          </div>
          <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
            {notificationList && notificationList.length > 0 ? (
              notificationList.map((n, i) => (
                <div key={(n.URID || i) + i} className={`p-3 rounded-xl border ${n.Seen ? 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-700' : 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800'}`}>
                  <div className="flex justify-between gap-2">
                    <div className="text-sm text-gray-700 dark:text-gray-300">{n.AdminRemarks || ''}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">{n.Amount || ''}</div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-bold text-teal-600 dark:text-teal-400">UPDATE</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">2m ago</span>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">Arbitrum One now live — 3 chains running simultaneously. SOL/USDC spreads widening.</div>
                </div>
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">ALERT</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">8m ago</span>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">High ETH volatility — bot in opportunistic mode. Execution frequency up 34%.</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">NEWS</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">15m ago</span>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">BSC gas at 3 gwei — optimal conditions for cross-chain arb operations today.</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}