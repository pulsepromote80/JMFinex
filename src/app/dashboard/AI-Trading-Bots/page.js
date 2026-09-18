"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  CircleDollarSign,
  History,
  Download,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getActiveProducts } from "@/app/redux/slices/productSlice";
import {
  getFundRequestReport,
  usernameByLoginId,
  addRechargeTransactionUser,
} from "@/app/redux/slices/fundManagerSlice";
import { getUserId } from "@/app/api/auth";
import { activeProducts, productLoading } from "@/app/(main)/admin/product/product-selectors";
import html2pdf from "html2pdf.js";
import InvestmentHistory from "@/app/user/components/AitradingbotHistory";

const TWELVEDATA_API_KEY = "7b23d1d237c14b5297a2d5df7a0e23e7";

/* =========================
   LIVE MARKET HOOK — Real prices → Real charts
========================= */
function useLiveMarket() {
  const [chartData, setChartData] = useState({});
  const [wsConnected, setWsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [marketPrices, setMarketPrices] = useState({});

  const realPricesRef = useRef({});
  const realChangesRef = useRef({});
  const chartDataRef = useRef({});
  const weekendPriceCacheRef = useRef({});
  const lastWeekdayCheckRef = useRef(null);

  // ✅ Live change fluctuation refs
  const liveChangesRef = useRef({});

  const SYMBOLS = ["EUR/USD", "GBP/USD", "XAU/USD", "USD/JPY"];

  const isWeekend = () => {
    const day = new Date().getDay();
    return day === 0 || day === 6;
  };

  const isFriday = () => {
    const day = new Date().getDay();
    return day === 5;
  };

  // ===== Build market prices using LIVE fluctuating changes =====
  const buildMarketPrices = () => {
    const bases = {
      "EUR/USD": realPricesRef.current["EUR/USD"] ?? 1.14668,
      "GBP/USD": realPricesRef.current["GBP/USD"] ?? 1.33809,
      "XAU/USD": realPricesRef.current["XAU/USD"] ?? 4303.14,
      "USD/JPY": realPricesRef.current["USD/JPY"] ?? 155.71208,
    };

    const currentDay = new Date().getDay();
    const isWeekendDay = isWeekend();
    const isFridayDay = isFriday();

    const defaultChanges = {
      "EUR/USD": { change: "0.05", positive: false },
      "GBP/USD": { change: "0.06", positive: true },
      "XAU/USD": { change: "1.02", positive: true },
      "USD/JPY": { change: "0.00", positive: true },
    };

    // ✅ Use LIVE change if available, else real API change, else default
    const getChange = (symbol) => {
      if (liveChangesRef.current[symbol]) {
        return liveChangesRef.current[symbol];
      }
      if (realChangesRef.current[symbol]) {
        return realChangesRef.current[symbol];
      }
      return defaultChanges[symbol];
    };

    // Friday → Saturday transition cache
    if (
      isWeekendDay &&
      lastWeekdayCheckRef.current !== null &&
      lastWeekdayCheckRef.current === 5 &&
      currentDay === 6
    ) {
      weekendPriceCacheRef.current = {
        "EUR/USD": { price: bases["EUR/USD"], ...getChange("EUR/USD") },
        "GBP/USD": { price: bases["GBP/USD"], ...getChange("GBP/USD") },
        "XAU/USD": { price: bases["XAU/USD"], ...getChange("XAU/USD") },
        "USD/JPY": { price: bases["USD/JPY"], ...getChange("USD/JPY") },
      };
      console.log("📅 Weekend started - Cached Friday prices");
    }

    if (isFridayDay && Object.keys(weekendPriceCacheRef.current).length === 0) {
      weekendPriceCacheRef.current = {
        "EUR/USD": { price: bases["EUR/USD"], ...getChange("EUR/USD") },
        "GBP/USD": { price: bases["GBP/USD"], ...getChange("GBP/USD") },
        "XAU/USD": { price: bases["XAU/USD"], ...getChange("XAU/USD") },
        "USD/JPY": { price: bases["USD/JPY"], ...getChange("USD/JPY") },
      };
      console.log("📅 Friday - Cached prices");
    }

    lastWeekdayCheckRef.current = currentDay;

    if (!isWeekendDay && currentDay === 1) {
      weekendPriceCacheRef.current = {};
      console.log("📅 Weekend ended - Cleared cache");
    }

    if (isWeekendDay && Object.keys(weekendPriceCacheRef.current).length > 0) {
      return weekendPriceCacheRef.current;
    }

    return {
      "EUR/USD": { price: bases["EUR/USD"], ...getChange("EUR/USD") },
      "GBP/USD": { price: bases["GBP/USD"], ...getChange("GBP/USD") },
      "XAU/USD": { price: bases["XAU/USD"], ...getChange("XAU/USD") },
      "USD/JPY": { price: bases["USD/JPY"], ...getChange("USD/JPY") },
    };
  };

  // ===== MAIN EFFECT: Fetch real prices + build charts =====
  useEffect(() => {
    let isMounted = true;

    // Init empty per-symbol charts
    const initCharts = {};
    SYMBOLS.forEach((s) => (initCharts[s] = []));
    chartDataRef.current = initCharts;
    setChartData(initCharts);

    const BASES = {
      "EUR/USD": 1.14668,
      "GBP/USD": 1.33809,
      "XAU/USD": 4303.14,
      "USD/JPY": 155.71208,
    };

    // Step 1: Fetch historical data for each symbol (WITH CACHING + 429 HANDLING)
    const fetchHistorical = async (symbol) => {
      try {
        const cacheKey = `hist_${symbol}`;
        if (typeof window !== "undefined") {
          const cached = localStorage.getItem(cacheKey);
          if (cached) {
            try {
              const { prices, timestamp } = JSON.parse(cached);
              if (
                Date.now() - timestamp < 5 * 60 * 1000 &&
                Array.isArray(prices) &&
                prices.length > 0
              ) {
                chartDataRef.current[symbol] = prices;
                if (isMounted) {
                  setChartData((prev) => ({ ...prev, [symbol]: prices }));
                }
                const lastPrice = prices[prices.length - 1];
                if (lastPrice && !realPricesRef.current[symbol]) {
                  realPricesRef.current[symbol] = lastPrice;
                }
                return;
              }
            } catch (e) {
              // ignore bad cache
            }
          }
        }

        const res = await fetch(
          `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(
            symbol
          )}&interval=1min&outputsize=30&apikey=${TWELVEDATA_API_KEY}`
        );

        if (res.status === 429) {
          console.warn(`⚠️ Rate limit on historical for ${symbol} — using base price`);
          chartDataRef.current[symbol] = [BASES[symbol]];
          if (isMounted) {
            setChartData((prev) => ({ ...prev, [symbol]: [BASES[symbol]] }));
          }
          if (!realPricesRef.current[symbol]) {
            realPricesRef.current[symbol] = BASES[symbol];
          }
          return;
        }

        const data = await res.json();

        if (data?.values && Array.isArray(data.values) && data.values.length > 0) {
          const prices = data.values.map((v) => parseFloat(v.close)).reverse();
          chartDataRef.current[symbol] = prices;
          if (isMounted) {
            setChartData((prev) => ({ ...prev, [symbol]: prices }));
          }
          const lastPrice = prices[prices.length - 1];
          if (lastPrice && !realPricesRef.current[symbol]) {
            realPricesRef.current[symbol] = lastPrice;
          }
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(
                cacheKey,
                JSON.stringify({ prices, timestamp: Date.now() })
              );
            } catch (e) {
              // storage full — ignore
            }
          }
        } else {
          chartDataRef.current[symbol] = [BASES[symbol]];
          if (isMounted) {
            setChartData((prev) => ({ ...prev, [symbol]: [BASES[symbol]] }));
          }
          if (!realPricesRef.current[symbol]) {
            realPricesRef.current[symbol] = BASES[symbol];
          }
        }
      } catch (err) {
        console.error(`Historical fetch failed for ${symbol}:`, err);
        chartDataRef.current[symbol] = [BASES[symbol]];
        if (isMounted) {
          setChartData((prev) => ({ ...prev, [symbol]: [BASES[symbol]] }));
        }
        if (!realPricesRef.current[symbol]) {
          realPricesRef.current[symbol] = BASES[symbol];
        }
      }
    };

    // Step 2: Fetch real-time quote for all symbols (every 8 min)
    const fetchRealPrices = async () => {
      try {
        const symbolParam = SYMBOLS.join(",");
        const res = await fetch(
          `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(
            symbolParam
          )}&apikey=${TWELVEDATA_API_KEY}`
        );

        if (res.status === 429) {
          console.warn("⚠️ Rate limit — using base prices");
          SYMBOLS.forEach((symbol) => {
            if (!realPricesRef.current[symbol]) {
              realPricesRef.current[symbol] = BASES[symbol];
            }
          });
          setMarketPrices(buildMarketPrices());
          setLastUpdate(Date.now());
          setWsConnected(true);
          return;
        }

        const data = await res.json();
        if (!isMounted) return;

        let anyUpdate = false;

        SYMBOLS.forEach((symbol) => {
          const entry = data[symbol];
          if (entry && entry.status !== "error" && entry.close) {
            const price = parseFloat(entry.close);
            if (!Number.isFinite(price)) return;
            realPricesRef.current[symbol] = price;
            anyUpdate = true;

            // ✅ Store real change %
            if (entry.percent_change !== undefined && entry.percent_change !== null) {
              const pct = parseFloat(entry.percent_change);
              if (Number.isFinite(pct)) {
                realChangesRef.current[symbol] = {
                  change: Math.abs(pct).toFixed(2),
                  positive: pct >= 0,
                };
                // ✅ Also seed the live change ref
                liveChangesRef.current[symbol] = {
                  change: Math.abs(pct).toFixed(2),
                  positive: pct >= 0,
                };
              }
            }

            // ✅ Push REAL price into this symbol's chart (only every 8 min)
            const currentChart = chartDataRef.current[symbol] || [];
            const newChart = [...currentChart, price].slice(-50);
            chartDataRef.current[symbol] = newChart;
            setChartData((prev) => ({ ...prev, [symbol]: newChart }));
          }
        });

        if (anyUpdate) {
          setMarketPrices(buildMarketPrices());
          setLastUpdate(Date.now());
          setWsConnected(true);
        } else {
          SYMBOLS.forEach((symbol) => {
            if (!realPricesRef.current[symbol]) {
              realPricesRef.current[symbol] = BASES[symbol];
            }
          });
          setMarketPrices(buildMarketPrices());
        }
      } catch (err) {
        console.error("Real price fetch failed:", err);
        SYMBOLS.forEach((symbol) => {
          if (!realPricesRef.current[symbol]) {
            realPricesRef.current[symbol] = BASES[symbol];
          }
        });
        setMarketPrices(buildMarketPrices());
      }
    };

    // Init — sequential with delay
    const initAll = async () => {
      for (const symbol of SYMBOLS) {
        if (!isMounted) return;
        await fetchHistorical(symbol);
        await new Promise((r) => setTimeout(r, 800));
      }
      await new Promise((r) => setTimeout(r, 1500));
      await fetchRealPrices();
    };
    initAll();

    // ✅ Every 8 min — price + chart update
    const interval = setInterval(fetchRealPrices, 480000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // ✅ LIVE CHANGE FLUCTUATION — every 2 sec, change % fluctuates naturally
  useEffect(() => {
    const liveChangeInterval = setInterval(() => {
      SYMBOLS.forEach((symbol) => {
        const current = liveChangesRef.current[symbol] || realChangesRef.current[symbol];
        if (current) {
          // Small fluctuation around the base change
          const baseChange = parseFloat(current.change) || 0;
          const fluctuation = (Math.random() - 0.5) * 0.15; // ±0.075%
          let newChange = baseChange + fluctuation;
          if (newChange < 0) newChange = 0.01;
          if (newChange > 5) newChange = 5;

          liveChangesRef.current[symbol] = {
            change: newChange.toFixed(2),
            positive: current.positive, // keep same direction
          };
        } else {
          // Seed with default
          const defaults = {
            "EUR/USD": { change: "0.05", positive: false },
            "GBP/USD": { change: "0.06", positive: true },
            "XAU/USD": { change: "1.02", positive: true },
            "USD/JPY": { change: "0.00", positive: true },
          };
          liveChangesRef.current[symbol] = defaults[symbol];
        }
      });

      // ✅ Only re-render prices — no chart/price change
      setMarketPrices(buildMarketPrices());
    }, 2000); // every 2 sec

    return () => clearInterval(liveChangeInterval);
  }, []);

  return { chartData, wsConnected, lastUpdate, marketPrices };
}

/* =========================
   BOT MAPPING CONFIG
========================= */
const botConfig = {
  "GOLD RUSH AI BOT": {
    subtitle: "Gold Trading Strategy",
    icon: "🪙",
    iconBg: "bg-yellow-100 dark:bg-[#422006]",
    symbols: ["XAU/USD"],
    chartColor: "#eab308",
    rsi: "53.6",
    macd: "Bearish",
    trend: "Sideways",
    signal: "BUY",
    signalSymbol: "XAU/USD",
    confidence: "68%",
    timeframe: "15M",
    market: "Commodities",
    myfxbookLink: "https://www.myfxbook.com/members/FXEAMASTER/gold-rush/9875023",
  },
  "BEETLE EA BOT": {
    subtitle: "Scalping Strategy",
    icon: "🪲",
    iconBg: "bg-blue-100 dark:bg-[#1e3a5f]",
    symbols: ["USD/JPY"],
    chartColor: "#2563eb",
    rsi: "62.4",
    macd: "Bullish",
    trend: "Uptrend",
    signal: "BUY",
    signalSymbol: "USD/JPY",
    confidence: "82%",
    timeframe: "5M",
    market: "Forex",
    myfxbookLink: "https://www.myfxbook.com/members/SonicExperts/sonic-ai/12076857",
  },
  "SEAGULL EA BOT": {
    subtitle: "Trend Following Strategy",
    icon: "🕊️",
    iconBg: "bg-purple-100 dark:bg-[#2e1065]",
    symbols: ["GBP/USD"],
    chartColor: "#9333ea",
    rsi: "58.7",
    macd: "Bullish",
    trend: "Uptrend",
    signal: "BUY",
    signalSymbol: "GBP/USD",
    confidence: "76%",
    timeframe: "15M",
    market: "Forex",
    myfxbookLink: "https://www.myfxbook.com/members/SonicExperts/sonic-ai/12076857",
  },
  "EXPERTSCOPY BOT": {
    subtitle: "Copy Trading Strategy",
    icon: "📋",
    iconBg: "bg-orange-100 dark:bg-[#431407]",
    symbols: ["EUR/USD"],
    chartColor: "#f97316",
    rsi: "45.3",
    macd: "Bearish",
    trend: "Sideways",
    signal: "BUY",
    signalSymbol: "EUR/USD",
    confidence: "64%",
    timeframe: "1H",
    market: "Forex",
    myfxbookLink: "https://www.myfxbook.com/lv/members/pg_forexoffecial/phantom-bot/12073391",
  },
  "PIP SNIPER AI BOT": {
    subtitle: "Breakout Strategy",
    icon: "🎯",
    iconBg: "bg-green-100 dark:bg-[#14532d]",
    symbols: ["EUR/USD"],
    chartColor: "#22c55e",
    rsi: "65.1",
    macd: "Bullish",
    trend: "Uptrend",
    signal: "BUY",
    signalSymbol: "EUR/USD",
    confidence: "79%",
    timeframe: "15M",
    market: "Forex",
    risk: "Medium",
    myfxbookLink: "https://www.myfxbook.com/members/MT4Sniper/pip-sniper/9468462",
  },
  // ===== Backup names =====
  "SONIC SCALPER AI": {
    subtitle: "Scalping Strategy",
    icon: "🤖",
    iconBg: "bg-blue-100 dark:bg-[#1e3a5f]",
    symbols: ["EUR/USD"],
    chartColor: "#2563eb",
    rsi: "62.4",
    macd: "Bullish",
    trend: "Uptrend",
    signal: "BUY",
    signalSymbol: "EUR/USD",
    confidence: "82%",
    timeframe: "5M",
    market: "Forex",
    myfxbookLink: "https://www.myfxbook.com/members/SonicExperts/sonic-ai/12076857",
  },
  "Revolut AI": {
    subtitle: "Trend Following Strategy",
    icon: "🧠",
    iconBg: "bg-purple-100 dark:bg-[#2e1065]",
    symbols: ["USD/JPY"],
    chartColor: "#9333ea",
    rsi: "58.7",
    macd: "Bullish",
    trend: "Uptrend",
    signal: "BUY",
    signalSymbol: "USD/JPY",
    confidence: "76%",
    timeframe: "15M",
    market: "Forex",
    myfxbookLink: "https://www.myfxbook.com/members/SonicExperts/sonic-ai/12076857",
  },
  "Phantom Stealth AI": {
    subtitle: "Grid Trading Strategy",
    icon: "🥷",
    iconBg: "bg-orange-100 dark:bg-[#431407]",
    symbols: ["GBP/USD"],
    chartColor: "#f97316",
    rsi: "45.3",
    macd: "Bearish",
    trend: "Sideways",
    signal: "BUY",
    signalSymbol: "GBP/USD",
    confidence: "64%",
    timeframe: "1H",
    market: "Forex",
    myfxbookLink: "https://www.myfxbook.com/lv/members/pg_forexoffecial/phantom-bot/12073391",
  },
  "Pip Sniper AI": {
    subtitle: "Breakout Strategy",
    icon: "🎯",
    iconBg: "bg-green-100 dark:bg-[#14532d]",
    symbols: ["EUR/USD"],
    chartColor: "#22c55e",
    rsi: "65.1",
    macd: "Bullish",
    trend: "Uptrend",
    signal: "BUY",
    signalSymbol: "EUR/USD",
    confidence: "79%",
    timeframe: "15M",
    market: "Forex",
    risk: "Medium",
    myfxbookLink: "https://www.myfxbook.com/members/MT4Sniper/pip-sniper/9468462",
  },
  "Gold Rush AI": {
    subtitle: "Gold Trading Strategy",
    icon: "🪙",
    iconBg: "bg-yellow-100 dark:bg-[#422006]",
    symbols: ["XAU/USD"],
    chartColor: "#eab308",
    rsi: "53.6",
    macd: "Bearish",
    trend: "Sideways",
    signal: "BUY",
    signalSymbol: "XAU/USD",
    confidence: "68%",
    timeframe: "15M",
    market: "Commodities",
    myfxbookLink: "https://www.myfxbook.com/members/FXEAMASTER/gold-rush/9875023",
  },
};

const defaultConfig = {
  subtitle: "AI Trading Strategy",
  icon: "🤖",
  iconBg: "bg-blue-100 dark:bg-[#1e3a5f]",
  symbols: ["EUR/USD", "GBP/USD"],
  chartColor: "#2563eb",
  rsi: "50.0",
  macd: "Neutral",
  trend: "Sideways",
  signal: "BUY",
  signalSymbol: "EUR/USD",
  confidence: "50%",
  timeframe: "15M",
  market: "Forex",
  myfxbookLink: "https://www.myfxbook.com",
};

const getBotConfig = (productName) => {
  if (!productName) return defaultConfig;
  const searchName = productName.trim();
  if (botConfig[searchName]) return botConfig[searchName];
  const upperName = searchName.toUpperCase();
  for (const key of Object.keys(botConfig)) {
    if (key.toUpperCase() === upperName) return botConfig[key];
  }
  for (const key of Object.keys(botConfig)) {
    const keyUpper = key.toUpperCase();
    if (upperName.includes(keyUpper) || keyUpper.includes(upperName)) return botConfig[key];
  }
  const cleanName = searchName.replace(/AI|BOT|STRATEGY|TRADING/gi, "").trim().toUpperCase();
  for (const key of Object.keys(botConfig)) {
    const cleanKey = key.replace(/AI|BOT|STRATEGY|TRADING/gi, "").trim().toUpperCase();
    if (cleanName === cleanKey) return botConfig[key];
  }
  console.log("❌ No match found for:", searchName);
  console.log("Available keys:", Object.keys(botConfig));
  return defaultConfig;
};

const mapApiDataToBots = (activeProducts) => {
  if (!activeProducts || !Array.isArray(activeProducts)) return [];
  const mappedBots = activeProducts.map((product) => {
    const config = getBotConfig(product.productName);
    return {
      id: product.productId,
      name: product.productName,
      subtitle: config.subtitle,
      icon: config.icon,
      iconBg: config.iconBg,
      symbols: config.symbols,
      chartColor: config.chartColor,
      rsi: config.rsi,
      macd: config.macd,
      trend: config.trend,
      signal: config.signal,
      signalSymbol: config.signalSymbol,
      confidence: config.confidence,
      timeframe: config.timeframe,
      market: config.market,
      myfxbookLink: product.url || config.myfxbookLink,
      risk: config.risk || "Medium",
      apr: `${product.roi}%`,
      winRate: `${product.winrate}%`,
      traders: product.traders?.toLocaleString() || "0",
      type: product.type,
      minInvest: product.mininvest,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      description: product.tittle,
    };
  });
  return mappedBots.sort((a, b) => {
    if (a.market === "Commodities" && b.market !== "Commodities") return -1;
    if (a.market !== "Commodities" && b.market === "Commodities") return 1;
    return 0;
  });
};

/* =========================
   MINI CHART
========================= */
function MiniChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-20 flex items-center justify-center">
        <span className="text-[11px] text-slate-400 dark:text-slate-400">Loading chart...</span>
      </div>
    );
  }
  const width = 300,
    height = 90,
    padding = 5;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((value, index) => {
      const x = padding + (index / Math.max(data.length - 1, 1)) * (width - padding * 2);
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-20">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-600 dark:text-blue-400"
      />
    </svg>
  );
}

/* =========================
   MARKET ROW
========================= */
function MarketRow({ symbol, marketPrices }) {
  const market = marketPrices?.[symbol];
  if (!market) {
    return (
      <div className="flex flex-wrap justify-between items-center px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 opacity-60 gap-1">
        <span className="text-[11px] font-medium text-slate-900 dark:text-slate-100">{symbol}</span>
        <span className="text-[11px] text-slate-400">Loading...</span>
      </div>
    );
  }
  const price = market.price;
  const change = parseFloat(market.change);
  const positive = market.positive;
  const formattedPrice =
    symbol === "XAU/USD"
      ? price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : price.toFixed(5);

  return (
    <div className="flex flex-wrap justify-between items-center px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 gap-1">
      <span className="text-[11px] font-medium text-slate-900 dark:text-slate-100">{symbol}</span>
      <span className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">
        ${formattedPrice}
      </span>
      <span
        className={`text-[11px] font-semibold ${
          positive ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"
        }`}
      >
        {positive ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
      </span>
    </div>
  );
}

/* =========================
   BOT CARD
========================= */
function BotCard({
  bot,
  marketPrices,
  lastUpdate,
  chartData,
  wsConnected,
  onInvest,
  onViewDetails,
}) {
  const isBuy = bot.signal === "BUY";
  const isConnected = wsConnected;

  // ✅ Per-symbol chart — us bot ka apna symbol
  const botSymbol = bot.symbols?.[0];
  const botChartData = (chartData && botSymbol && chartData[botSymbol]) || [];

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all mb-4 overflow-hidden w-full">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center px-4 py-3 border-b border-slate-200 dark:border-slate-700 gap-2">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div
            className={`flex w-10 h-10 items-center justify-center rounded-xl text-lg shrink-0 ${bot.iconBg}`}
          >
            {bot.icon}
          </div>
          <div className="min-w-0">
            <h2 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 m-0 tracking-wide break-words">
              {bot.name}
            </h2>
            <p className="text-[11px] text-slate-400 m-0 mt-0.5">{bot.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-semibold shrink-0">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isConnected ? "bg-green-500 animate-sb-pulse" : "bg-red-500"
            }`}
          />
          <span
            className={
              isConnected
                ? "text-green-500 dark:text-green-400"
                : "text-red-500 dark:text-red-400"
            }
          >
            {isConnected ? "LIVE" : "OFFLINE"}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[1fr_200px] xl:grid-cols-[1fr_220px]">
          {/* Left */}
          <div className="min-w-0 w-full">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Live Market
            </p>
            <div className="flex flex-col gap-1.5">
              {bot.symbols.map((symbol) => (
                <MarketRow key={symbol} symbol={symbol} marketPrices={marketPrices} />
              ))}
            </div>
            <div className="text-[11px] font-medium text-slate-900 dark:text-slate-100 mt-3 mb-1.5">
              {bot.signalSymbol} • {bot.timeframe} Chart
            </div>

            {/* ✅ Real per-symbol chart */}
            <MiniChart data={botChartData} />

            <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 mt-2.5">
              <div className="p-1.5 text-center">
                <p className="text-[9px] text-slate-400 m-0">Timeframe</p>
                <p className="text-[11px] font-semibold text-slate-900 dark:text-slate-100 m-0 mt-1">
                  {bot.timeframe}
                </p>
              </div>
              <div className="p-1.5 text-center border-l border-slate-200 dark:border-slate-700">
                <p className="text-[9px] text-slate-400 m-0">Market</p>
                <p className="text-[11px] font-semibold text-slate-900 dark:text-slate-100 m-0 mt-1">
                  {bot.market}
                </p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-1.5 w-full">
            <p className="px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-[9px] font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 m-0">
              Strategy Indicators
            </p>
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <div className="flex justify-between px-2.5 py-1.5 border-b border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-400">RSI</span>
                <span className="text-[11px] font-semibold text-slate-900 dark:text-slate-100">
                  {bot.rsi}
                </span>
              </div>
              <div className="flex justify-between px-2.5 py-1.5 border-b border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-400">MACD</span>
                <span
                  className={`text-[11px] font-semibold ${
                    bot.macd === "Bullish"
                      ? "text-green-500 dark:text-green-400"
                      : "text-red-500 dark:text-red-400"
                  }`}
                >
                  {bot.macd}
                </span>
              </div>
              <div className="flex justify-between px-2.5 py-1.5">
                <span className="text-[11px] text-slate-400">Trend</span>
                <span
                  className={`text-[11px] font-semibold ${
                    bot.trend === "Uptrend"
                      ? "text-green-500 dark:text-green-400"
                      : bot.trend === "Downtrend"
                      ? "text-red-500 dark:text-red-400"
                      : "text-amber-500 dark:text-amber-400"
                  }`}
                >
                  {bot.trend}
                </span>
              </div>
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
              Signal
            </p>
            <div
              className={`rounded-lg p-2.5 text-center border ${
                isBuy
                  ? "border-green-500 bg-green-50 dark:bg-[#14532d]/40"
                  : "border-red-500 bg-red-50 dark:bg-[#7f1d1d]/40"
              }`}
            >
              <div
                className={`flex items-center justify-center gap-1.5 text-base font-bold ${
                  isBuy
                    ? "text-green-500 dark:text-green-400"
                    : "text-red-500 dark:text-red-400"
                }`}
              >
                {isBuy ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                {bot.signal}
              </div>
              <p className="text-[11px] text-slate-900 dark:text-slate-100 m-0 mt-0.5">
                {bot.signalSymbol}
              </p>
            </div>

            <div className="flex justify-between px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900">
              <span className="text-[10px] text-slate-400">Confidence</span>
              <span
                className={`text-[12px] font-bold ${
                  isBuy
                    ? "text-green-500 dark:text-green-400"
                    : "text-red-500 dark:text-red-400"
                }`}
              >
                {bot.confidence}
              </span>
            </div>

            <div className="flex justify-between text-[10px]">
              <span className="text-slate-400">Last Update</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : "--:--:--"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1">
              <button
                onClick={() => onViewDetails(bot)}
                className="flex items-center justify-center gap-1 px-2.5 py-2 max-sm:py-2.5 max-sm:px-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-[10px] max-sm:text-[11px] font-medium text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 hover:-translate-y-px transition-all whitespace-nowrap"
              >
                👁 View Details
              </button>
              <button
                onClick={() => onInvest(bot)}
                className="flex items-center justify-center gap-1 px-2.5 py-2 max-sm:py-2.5 max-sm:px-3 border border-blue-600 rounded-lg bg-blue-50 dark:bg-[#1e3a5f] text-[10px] max-sm:text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white hover:-translate-y-px transition-all whitespace-nowrap"
              >
                Use Strategy
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 mt-3">
          <div className="p-1.5 text-center">
            <p className="text-[9px] text-slate-400 m-0">Backtest APR</p>
            <p className="text-[11px] font-semibold text-slate-900 dark:text-slate-100 m-0 mt-1">
              {bot.apr}
            </p>
          </div>
          <div className="p-1.5 text-center border-x border-slate-200 dark:border-slate-700">
            <p className="text-[9px] text-slate-400 m-0">Win Rate</p>
            <p className="text-[11px] font-semibold text-slate-900 dark:text-slate-100 m-0 mt-1">
              {bot.winRate}
            </p>
          </div>
          <div className="p-1.5 text-center">
            <p className="text-[9px] text-slate-400 m-0">Live Traders</p>
            <p className="text-[11px] font-semibold text-slate-900 dark:text-slate-100 m-0 mt-1">
              {bot.traders}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   INVEST MODAL
========================= */
function InvestModal({ bot, onClose, onSubmit, walletBalance, isLoading }) {
  const dispatch = useDispatch();
  const [uid, setUid] = useState("");
  const [uname, setUname] = useState("");
  const [uerr, setUerr] = useState("");
  const [userURID, setUserURID] = useState("");
  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [amountError, setAmountError] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      if (!uid.trim()) {
        setUname("");
        setUerr("");
        setUserURID("");
        setIsFetchingUser(false);
        return;
      }
      setIsFetchingUser(true);
      try {
        const result = await dispatch(usernameByLoginId(uid));
        if (result?.payload && result?.payload?.data?.name) {
          setUname(result.payload.data.name);
          setUserURID(result.payload.data.urid || result.payload.data.id || "");
          setUerr("");
        } else {
          setUname("");
          setUerr("Invalid User ID");
          setUserURID("");
        }
      } catch (error) {
        console.error("Error fetching username:", error);
        setUname("");
        setUerr("Error fetching user");
        setUserURID("");
      } finally {
        setIsFetchingUser(false);
      }
    };
    const timer = setTimeout(() => {
      fetchUsername();
    }, 500);
    return () => clearTimeout(timer);
  }, [uid, dispatch]);

  const getInvestmentAmount = () =>
    customAmount && customAmount !== "" ? parseFloat(customAmount) : 0;

  const getPackageNameByAmount = (amount) => {
    if (!amount || isNaN(amount)) return null;
    if (amount < 100) return "Minimum $100 required";
    if (amount >= 100 && amount <= 999) return "Standard";
    else if (amount >= 1000 && amount <= 4999) return "Premium";
    else if (amount >= 5000) return "Premium Plus";
    return null;
  };

  const validateAmount = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setAmountError("Please enter a valid amount");
      return false;
    }
    if (numValue < 100) {
      setAmountError("Minimum investment amount is $100");
      return false;
    }
    if (numValue > walletBalance) {
      setAmountError(
        `Insufficient balance! Your wallet balance is $${walletBalance.toLocaleString()}`
      );
      return false;
    }
    setAmountError("");
    return true;
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setCustomAmount("");
      setAmountError("");
      return;
    }
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setCustomAmount(numValue);
      validateAmount(numValue);
    }
  };

  const handleSubmit = () => {
    if (!uname) {
      setUerr("Please enter a valid User ID");
      return;
    }
    const investmentAmount = getInvestmentAmount();
    if (investmentAmount < 100) {
      setAmountError("Minimum investment amount is $100");
      return;
    }
    if (walletBalance < investmentAmount) {
      setAmountError(
        `Insufficient funds! Your wallet balance is $${walletBalance.toLocaleString()}`
      );
      return;
    }
    onSubmit({ uid, uname, userURID, amount: investmentAmount, bot });
  };

  const packageName =
    customAmount && parseFloat(customAmount) >= 100
      ? getPackageNameByAmount(parseFloat(customAmount))
      : null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#2b2b2d]/55 backdrop-blur-[2px] animate-sb-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[500px] rounded-[26px] border border-[#dfe5ee] bg-[#f3f5f7] p-4 shadow-[0_16px_38px_rgba(15,23,42,0.18)] max-h-[88vh] overflow-y-auto animate-sb-slideUp">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="m-0 text-[24px] md:text-[28px] font-black leading-none tracking-[-0.04em] text-slate-900">
              Invest in {bot?.name}
            </h3>
            <p className="mt-1.5 text-xs text-slate-500">Enter investment details below</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[22px] text-slate-500 shadow-sm transition hover:bg-slate-100"
            aria-label="Close investment modal"
          >
            ✕
          </button>
        </div>

        <div className="mb-3 rounded-full border border-[#58d69b] bg-[#dff7ea] px-3 py-2 shadow-inner shadow-white/20">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12px] font-semibold text-[#1d8d57]">Wallet Balance</span>
            <span className="text-[24px] font-black leading-none text-[#1d8d57]">
              ${walletBalance.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="mb-3">
          <label className="mb-1.5 block text-[14px] font-semibold text-slate-800">
            User ID *
          </label>
          <input
            className="w-full rounded-full border border-[#dfe6ef] bg-[#edf1f5] px-3.5 py-2.5 text-[14px] text-slate-900 placeholder:text-slate-400 focus:border-[#6ea8ff] focus:outline-none focus:ring-2 focus:ring-[#b9d4ff]"
            placeholder="Enter User ID (e.g. test@gmail.com)"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
          />
          {!uid.trim() ? (
            <div className="mt-1.5 text-[11px] font-medium text-red-500">
              ⚠ Please enter User ID
            </div>
          ) : isFetchingUser ? (
            <div className="mt-1.5 text-[11px] text-slate-500">⏳ Fetching user details...</div>
          ) : uname ? (
            <div className="mt-1.5 text-[11px] font-semibold text-green-600">
              ✓ {uname}
            </div>
          ) : uerr ? (
            <div className="mt-1.5 text-[11px] font-medium text-red-500">⚠ {uerr}</div>
          ) : null}
        </div>

        <div className="mb-3">
          <label className="mb-1.5 block text-[14px] font-semibold text-slate-800">
            Selected Bot
          </label>
          <div className="flex items-center gap-3 rounded-full border border-[#dfe6ef] bg-[#edf1f5] px-3.5 py-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f7d983] text-sm shadow-sm">
              {bot?.icon || "🤖"}
            </span>
            <span className="text-[14px] font-bold uppercase tracking-[0.02em] text-slate-900">
              {bot?.name}
            </span>
          </div>
        </div>

        <div className="mb-3">
          <label className="mb-1.5 block text-[14px] font-semibold text-slate-800">
            Investment Amount (USD) *
          </label>
          <p className="mb-1.5 text-[11px] text-slate-500">Min: $100 | No max limit</p>
          <input
            type="number"
            step="1"
            className={`w-full rounded-full border bg-[#edf1f5] px-3.5 py-2.5 text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
              amountError
                ? "border-red-400 focus:ring-red-200"
                : "border-[#dfe6ef] focus:border-[#6ea8ff] focus:ring-[#b9d4ff]"
            }`}
            placeholder="Enter amount between"
            value={customAmount}
            onChange={handleAmountChange}
          />
          {amountError ? (
            <div className="mt-1.5 text-[11px] font-medium text-red-500">⚠ {amountError}</div>
          ) : packageName &&
            !packageName.includes("Minimum") &&
            !packageName.includes("Maximum") ? (
            <div className="mt-1.5 text-[11px] font-semibold text-blue-600">
              Package: <strong>{packageName}</strong>
            </div>
          ) : null}
        </div>

        <button
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7ea7ff] to-[#5c7ef5] px-4 py-2.5 text-[16px] font-bold text-white shadow-[0_10px_24px_rgba(95,125,245,0.35)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={handleSubmit}
          disabled={
            !uname ||
            isLoading ||
            isFetchingUser ||
            !customAmount ||
            amountError ||
            parseFloat(customAmount) < 100 ||
            walletBalance < parseFloat(customAmount || 0)
          }
        >
          <span className="text-xl">⚡</span>
          {isLoading ? "Processing..." : "Activate Investment"}
        </button>
      </div>
    </div>
  );
}

/* =========================
   MAIN PAGE
========================= */
export default function SonicScalper() {
  const dispatch = useDispatch();
  const loading = useSelector(productLoading);
  const activeProductsData = useSelector(activeProducts);
  const [activeTab, setActiveTab] = useState("bots");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { chartData, wsConnected, lastUpdate, marketPrices } = useLiveMarket();

  const [walletBalance, setWalletBalance] = useState(0);
  const [walletLoading, setWalletLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedBot, setSelectedBot] = useState(null);
  const [inv, setInv] = useState(null);
  const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailBot, setDetailBot] = useState(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  const bots = mapApiDataToBots(activeProductsData);

  // Check initial data ready
  useEffect(() => {
    if (
      !walletLoading &&
      marketPrices &&
      Object.keys(marketPrices).length > 0 &&
      chartData &&
      Object.keys(chartData).length > 0
    ) {
      setTimeout(() => setInitialDataLoaded(true), 300);
    }
  }, [walletLoading, marketPrices, chartData]);

  // ✅ Safety timeout — force load after 8 sec if API fails
  useEffect(() => {
    const timeout = setTimeout(() => {
      setInitialDataLoaded(true);
    }, 8000);
    return () => clearTimeout(timeout);
  }, []);

  // Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Fetch products
  useEffect(() => {
    dispatch(getActiveProducts());
  }, [dispatch]);

  // Fetch wallet
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        setWalletLoading(true);
        const result = await dispatch(getFundRequestReport()).unwrap();
        if (result?.walletBalance?.[0]?.depositWallet !== undefined) {
          setWalletBalance(result.walletBalance[0].depositWallet);
        }
      } catch (error) {
        console.error("Failed to fetch wallet balance:", error);
        setWalletBalance(0);
      } finally {
        setWalletLoading(false);
      }
    };
    fetchWalletBalance();
  }, [dispatch]);

  const handleInvestClick = (bot) => {
    setSelectedBot(bot);
    setShowInvestModal(true);
  };

  const handleViewDetails = (bot) => {
    if (bot?.myfxbookLink) {
      window.open(bot.myfxbookLink, "_blank", "noopener,noreferrer");
    }
  };

  const handleDownloadInvoice = async (invoiceData) => {
    const invoiceNo = invoiceData.id || `INV-${Date.now()}`;
    const userName = invoiceData.user || "User";
    const userId = invoiceData.uid || "N/A";
    const amount = invoiceData.amount || 0;
    const orderDate = invoiceData.date || new Date().toLocaleDateString();
    const status = "Active";
    const roiValue = invoiceData.roi || "20";
    const d = {
      bot: invoiceData.bot,
      package: invoiceData.package,
      CategoryName: invoiceData.bot,
      PackageName: invoiceData.package,
    };

    const invoiceHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8" /><title>JMFINX Invoice ${invoiceNo}</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#eaf2fb;padding:10px;font-family:"Inter",-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh}
    .invoice{width:700px;max-width:700px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(7,31,51,.2);page-break-inside:avoid;break-inside:avoid}
    .top-bar{background:#071f33;padding:16px 28px;display:flex;justify-content:space-between;align-items:center;border-bottom:4px solid #075bda}
    .top-bar .brand{display:flex;flex-direction:column;align-items:flex-start;gap:2px}
    .top-bar .brand .logo-img{width:180px;max-width:180px;height:auto;object-fit:contain;display:block}
    .top-bar .invoice-tag{text-align:right}
    .top-bar .invoice-tag .label{font-size:8px;color:#8fdff2;text-transform:uppercase;letter-spacing:1.5px;font-weight:600}
    .top-bar .invoice-tag .number{font-size:13px;font-weight:700;color:#fff}
    .header{background:#f3f7fb;padding:16px 28px 14px;border-bottom:1px solid #c9d8e8}
    .header-content{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px}
    .header-left .greeting{font-size:20px;font-weight:700;color:#071f33}
    .header-left .greeting span{color:#075bda}
    .header-left .sub{font-size:12px;color:#536b80;font-weight:400;margin-top:1px}
    .header-right{text-align:right}
    .header-right .amount-label{font-size:10px;color:#536b80;text-transform:uppercase;letter-spacing:1px;font-weight:700}
    .header-right .amount-wrapper{display:flex;align-items:baseline;justify-content:flex-end;gap:4px}
    .header-right .amount{font-size:28px;font-weight:900;color:#075bda;line-height:1.1}
    .header-right .currency{font-size:14px;font-weight:600;color:#536b80}
    .status-row{display:flex;justify-content:space-between;align-items:center;padding:8px 28px;background:#fff;border-bottom:1px solid #c9d8e8;flex-wrap:wrap;gap:6px}
    .status-row .date{font-size:12px;color:#536b80;font-weight:500}
    .status-row .date strong{color:#071f33;font-weight:700}
    .status-badge{display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:#087f5b}
    .body{padding:14px 28px 10px;background:#fff}
    .section{margin-bottom:18px}
    .section:last-of-type{margin-bottom:0}
    .section-title{font-size:10px;font-weight:800;color:#075bda;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid #8fdff2}
    .section-title .icon{margin-right:6px;font-size:13px}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px}
    .grid-3{grid-template-columns:repeat(3,1fr)}
    .card{background:#f3f7fb;border-radius:10px;padding:8px 14px;border:1px solid #c9d8e8}
    .card .label{font-size:9px;font-weight:700;color:#536b80;text-transform:uppercase;letter-spacing:.8px;margin-bottom:2px}
    .card .value{font-size:14px;font-weight:700;color:#071f33}
    .card .value-sm{font-size:13px;font-weight:600;color:#071f33}
    .highlight-box{background:#eaf7fb;border:2px solid #00a8e8;border-radius:10px;padding:10px 18px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-top:2px}
    .highlight-box .left .label,.highlight-box .right .label{font-size:10px;font-weight:700;color:#536b80;text-transform:uppercase;letter-spacing:1px}
    .highlight-box .left .value{font-size:16px;font-weight:800;color:#071f33;margin-top:1px}
    .highlight-box .right{text-align:right}
    .highlight-box .right .value{font-size:18px;font-weight:900;color:#075bda;margin-top:1px}
    .company-address{background:#f3f7fb;padding:8px 18px;border-radius:10px;border:1px solid #c9d8e8;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px}
    .company-address .address-text{font-size:10px;color:#536b80;line-height:1.5}
    .company-address .address-text strong{color:#071f33}
    .stamp-section{display:flex;justify-content:flex-end;align-items:center;margin-top:8px;padding-top:8px;border-top:2px dashed #ccc}
    .stamp-box{display:flex;flex-direction:column;align-items:center;gap:2px}
    .stamp-box .stamp-label{font-size:7px;color:#536b80;text-transform:uppercase;letter-spacing:1px;font-weight:600}
    .stamp-box .stamp-image{width:88px;height:88px;object-fit:contain;border-radius:8px;background:#fff;padding:4px}
    .footer{background:#071f33;padding:12px 28px 10px;text-align:center;border-top:3px solid #f59e0b}
    .footer .brand-name{font-size:14px;font-weight:800;color:#fff;letter-spacing:1px}
    .footer .brand-name span{color:#00a8e8}
    .footer .divider{width:25px;height:2px;background:#f59e0b;margin:4px auto;border-radius:2px}
    .footer p{font-size:10px;color:#dbeafe;font-weight:500;line-height:1.4}
    .footer .note{font-size:7px;color:#8fdff2;font-weight:500;margin-top:3px}
    .brand-logo-span{color:#f59e0b;font-weight:700;font-size:12px;letter-spacing:.5px}
    @media (max-width:700px){.top-bar{flex-direction:column;gap:6px;padding:10px 16px;text-align:center}.top-bar .brand{align-items:center;width:100%}.top-bar .brand .logo-img{max-width:150px}.top-bar .invoice-tag{text-align:center}.header{padding:12px 16px}.header-content{flex-direction:column;align-items:flex-start}.header-right{text-align:left;width:100%}.header-right .amount-wrapper{justify-content:flex-start}.header-right .amount{font-size:24px}.body{padding:10px 16px}.grid-3{grid-template-columns:1fr 1fr}.status-row{padding:6px 16px;flex-direction:column;align-items:flex-start}.footer{padding:8px 16px}.stamp-section{justify-content:center}.company-address{flex-direction:column;text-align:center}.stamp-box .stamp-image{width:100px;height:100px}}
    @media (max-width:480px){.grid-3{grid-template-columns:1fr}.top-bar .brand .logo-img{max-width:120px}.header-left .greeting{font-size:17px}}
    @media print{body{background:#fff;padding:0;margin:0}.invoice{box-shadow:none;border-radius:0;max-width:100%}.top-bar{background:#1a1a1a!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}.top-bar .brand .logo-img{-webkit-print-color-adjust:exact;print-color-adjust:exact}.status-badge{color:#333!important}.highlight-box,.card,.footer,.header,.company-address,.stamp-image{-webkit-print-color-adjust:exact;print-color-adjust:exact}.stamp-section{page-break-inside:avoid;break-inside:avoid}}
    </style></head>
    <body>
    <div class="invoice">
      <div class="top-bar"><div class="brand"><img src="/logo.png" alt="JMFinex Logo" class="logo-img" /><span class="brand-logo-span">LEARN | TRADE | GROW</span></div>
      <div class="invoice-tag"><div class="label">Invoice Number</div><div class="number">#${invoiceNo}</div></div></div>
      <div class="header"><div class="header-content"><div class="header-left"><div class="greeting">Hello, <span>${userName}</span></div><div class="sub">Thank you for investing with JMFINEX</div></div>
      <div class="header-right"><div class="amount-label">Total Investment</div><div class="amount-wrapper"><span class="amount">$${amount.toFixed(
        2
      )}</span><span class="currency">USD</span></div></div></div></div>
      <div class="status-row"><div class="date">📅 <strong>Transaction Date:</strong> ${orderDate}</div><div><span class="status-badge">${status}</span></div></div>
      <div class="body">
        <div class="section"><div class="section-title"><span class="icon">👤</span> User Details</div>
          <div class="grid"><div class="card"><div class="label">Username</div><div class="value">${userName}</div></div>
          <div class="card"><div class="label">User ID</div><div class="value value-sm">${userId}</div></div></div></div>
        <div class="section"><div class="section-title"><span class="icon">🤖</span> Package Details</div>
          <div class="grid grid-3"><div class="card"><div class="label">Strategy</div><div class="value">${
            d.CategoryName || d.bot || "N/A"
          }</div></div>
          <div class="card"><div class="label">Package</div><div class="value">${
            d.PackageName || d.package || "N/A"
          }</div></div>
          <div class="card"><div class="label">APY</div><div class="value">${
            typeof roiValue === "number" ? roiValue.toFixed(2) : roiValue
          }%</div></div></div></div>
        <div class="section"><div class="section-title"><span class="icon">💰</span> Investment Summary</div>
          <div class="highlight-box"><div class="left"><div class="label">Package</div><div class="value">${
            d.PackageName || d.package || "N/A"
          }</div></div>
          <div class="right"><div class="label">Amount</div><div class="value">$${amount.toFixed(
            2
          )}</div></div></div></div>
        <div class="section" style="margin-bottom:4px"><div class="section-title"><span class="icon">🏢</span> Company Details</div>
          <div class="company-address"><div class="address-text"><strong>JMFINEX</strong><br />838, Castries, Rodney Court Building<br />Rodney Bay, St Lucia</div>
          <div class="address-text" style="text-align:right"><strong>Email:</strong> support@jmfinex.com<br /><strong>Phone:</strong> +1 (800) 555-0199</div></div></div>
        <div class="stamp-section"><div class="stamp-box"><span class="stamp-label">Company Stamp</span><img src="/stampbackremove.png" alt="JMFINEX Stamp" class="stamp-image" /></div></div>
      </div>
      <div class="footer"><div class="brand-name">✦ JM<span>Finex</span></div><div class="divider"></div>
        <p>Thank you for trusting JMFINEX with your investment.<br />Our AI-driven strategies are working to grow your wealth.</p>
        <div class="note">© ${new Date().getFullYear()} JMFINEX · All Rights Reserved · Computer Generated Invoice</div></div>
    </div></body></html>`;

    const invoiceFrame = document.createElement("iframe");
    invoiceFrame.setAttribute("aria-hidden", "true");
    invoiceFrame.style.cssText =
      "position:fixed;left:-100000px;top:0;width:720px;height:1100px;border:0;opacity:0;pointer-events:none;z-index:-1;";
    const frameReady = new Promise((resolve, reject) => {
      invoiceFrame.onload = resolve;
      invoiceFrame.onerror = reject;
    });
    invoiceFrame.srcdoc = invoiceHTML;
    document.body.appendChild(invoiceFrame);
    await frameReady;
    const element = invoiceFrame.contentDocument.querySelector(".invoice");
    const opt = {
      margin: 10,
      filename: `JMFINEX_Invoice_${invoiceNo}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 1.5, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "avoid-all"] },
    };
    const cleanup = () => {
      if (invoiceFrame.parentNode) invoiceFrame.parentNode.removeChild(invoiceFrame);
    };

    if (typeof html2pdf !== "undefined") {
      try {
        await html2pdf().set(opt).from(element).save();
      } finally {
        cleanup();
      }
    } else {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      try {
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
        await html2pdf().set(opt).from(element).save();
      } finally {
        cleanup();
      }
    }
  };

  const handleInvestSubmit = async ({ uid, uname, amount, bot }) => {
    setIsProcessing(true);
    try {
      const productId = bot.id || bot.productId;
      const requestBody = { productId, byLoginId: uid, rkprice: amount };
      const result = await dispatch(addRechargeTransactionUser(requestBody)).unwrap();
      let transactionData;
      if (Array.isArray(result) && result.length > 0) transactionData = result[0];
      else transactionData = result;

     const getPackageNameByAmount = (amount) => {
  if (!amount || isNaN(amount)) return null;
  if (amount < 100) return "Minimum $100 required";
  if (amount >= 100 && amount <= 999) return "Standard";
  if (amount >= 1000 && amount <= 4999) return "Premium";
  if (amount >= 5000) return "Premium Plus";
  return null;
};

      const o = {
        id: `JM-${Date.now()}`,
        bot: bot.name,
        logo: bot.icon || "🤖",
        user: uname,
        package: transactionData?.PackageName || getPackageNameByAmount(amount),
        uid: uid.toUpperCase(),
        amount: amount,
        date: new Date().toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        roi: bot.apr?.replace("%", "") || "20",
        status: "Active",
        color: bot.chartColor || "#6725cd",
        transactionId:
          transactionData?.RechargeId || transactionData?.transactionId || `TXN-${Date.now()}`,
      };
      setInv(o);
      setShowInvestModal(false);
      setShowSuccess(true);
      setSelectedBot(null);
      const walletResult = await dispatch(getFundRequestReport()).unwrap();
      if (walletResult?.walletBalance?.[0]?.depositWallet !== undefined) {
        setWalletBalance(walletResult.walletBalance[0].depositWallet);
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      alert(error?.message || "Transaction failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading || !initialDataLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-sb-bounce">📊</div>
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Loading Bot Strategy...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans max-w-[100vw] overflow-x-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex flex-wrap justify-between items-center gap-2 max-w-full">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <CircleDollarSign
                size={20}
                className="text-blue-600 dark:text-blue-400 shrink-0"
              />
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 m-0">
                AI Trading Bots
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 m-0 mt-0.5">
              Monitor your automated trading strategies
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 ml-auto">
            {/* Tabs */}
            <div className="flex gap-0.5 p-0.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0 flex-wrap max-sm:w-full max-sm:justify-stretch">
              <button
                className={`flex items-center gap-1 px-3 py-1.5 max-sm:flex-1 max-sm:justify-center max-sm:text-[11px] max-sm:px-2 max-sm:py-1.5 border-0 rounded-md text-xs font-medium cursor-pointer transition-all whitespace-nowrap ${
                  activeTab === "bots"
                    ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "bg-transparent text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
                onClick={() => setActiveTab("bots")}
              >
                <Bot size={14} className="w-3.5 h-3.5 max-sm:w-3 max-sm:h-3 shrink-0" />
                Bots
              </button>
              <button
                className={`flex items-center gap-1 px-3 py-1.5 max-sm:flex-1 max-sm:justify-center max-sm:text-[11px] max-sm:px-2 max-sm:py-1.5 border-0 rounded-md text-xs font-medium cursor-pointer transition-all whitespace-nowrap ${
                  activeTab === "history"
                    ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "bg-transparent text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
                onClick={() => setActiveTab("history")}
              >
                <History size={14} className="w-3.5 h-3.5 max-sm:w-3 max-sm:h-3 shrink-0" />
                History
              </button>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 max-sm:px-2 max-sm:py-1 max-sm:w-full max-sm:justify-center border border-green-500 rounded-lg bg-green-50 dark:bg-[#14532d]/40 shadow-sm">
              <span className="text-[11px] max-sm:text-[10px] font-semibold text-green-600 dark:text-green-400 whitespace-nowrap">
                Wallet: ${walletBalance.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="animate-sb-fadeIn">
        {activeTab === "bots" ? (
          <div className="px-4 py-3 max-sm:px-2.5">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
              {bots.map((bot) => (
                <BotCard
                  key={bot.name}
                  bot={bot}
                  marketPrices={marketPrices}
                  lastUpdate={lastUpdate}
                  chartData={chartData}
                  wsConnected={wsConnected}
                  onInvest={handleInvestClick}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </div>
        ) : (
          <InvestmentHistory />
        )}
      </div>

      {showInvestModal && selectedBot && (
        <InvestModal
          bot={selectedBot}
          onClose={() => {
            setShowInvestModal(false);
            setSelectedBot(null);
          }}
          onSubmit={handleInvestSubmit}
          walletBalance={walletBalance}
          isLoading={isProcessing}
        />
      )}

      {showSuccess && inv && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 animate-sb-fadeIn"
          onClick={(e) => e.target === e.currentTarget && setShowSuccess(false)}
        >
          <div className="w-full max-w-[520px] rounded-[24px] bg-white dark:bg-slate-800 p-6 sm:p-7 shadow-2xl text-center animate-sb-slideUp">
            <div className="text-6xl mb-3">🎉</div>
            <h3 className="text-2xl sm:text-[30px] leading-tight font-bold text-slate-900 dark:text-slate-100 mb-2.5">
              Congratulations!
            </h3>
            <p className="text-[15px] sm:text-base text-slate-900 dark:text-slate-100 mb-5">
              Your AI bot investment is now live and running.
            </p>
            <div className="mb-5 p-4 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-900 text-left">
              {[
                { label: "Order ID", value: inv.id },
                { label: "Bot Strategy", value: inv.bot },
                { label: "User ID", value: inv.user },
                { label: "Package", value: inv.package },
                { label: "Amount", value: `$${inv.amount.toFixed(2)}`, highlight: true },
                { label: "Date", value: inv.date },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between py-2 border-b border-slate-200 dark:border-slate-700 last:border-b-0 gap-4"
                >
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100 shrink-0">
                    {item.label}
                  </span>
                  <span
                    className={`min-w-0 text-right text-sm text-slate-900 dark:text-slate-100 wrap-break-word ${
                      item.highlight ? "font-bold" : ""
                    }`}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                className="w-full py-3.5 rounded-full bg-slate-600 hover:bg-slate-700 text-white text-[15px] font-semibold cursor-pointer transition-all flex-1 disabled:cursor-wait disabled:opacity-70"
                disabled={isDownloadingInvoice}
                onClick={async () => {
                  setIsDownloadingInvoice(true);
                  try {
                    // await handleDownloadInvoice(inv);
                  } finally {
                    setIsDownloadingInvoice(false);
                  }
                }}
              >
                <Download size={16} className="inline mr-1.5 align-middle" />
                {isDownloadingInvoice ? "Preparing Invoice..." : "Download Invoice"}
              </button>
              <button
                className="w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold cursor-pointer transition-all flex-1"
                onClick={() => setShowSuccess(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyframes */}
      <style jsx global>{`
        @keyframes sb-pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
        @keyframes sb-fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes sb-slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes sb-bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-sb-pulse {
          animation: sb-pulse 1.5s ease-in-out infinite;
        }
        .animate-sb-fadeIn {
          animation: sb-fadeIn 0.3s ease-out;
        }
        .animate-sb-slideUp {
          animation: sb-slideUp 0.3s ease-out;
        }
        .animate-sb-bounce {
          animation: sb-bounce 1.5s ease-in-out infinite;
        }

        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}