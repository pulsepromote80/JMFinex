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
   LIVE MARKET HOOK
========================= */
function useLiveMarket() {
  const [livePrice, setLivePrice] = useState(null);
  const [priceChange, setPriceChange] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [marketPrices, setMarketPrices] = useState({});
  const previousPriceRef = useRef(null);
  const realPricesRef = useRef({});

  const buildMarketPrices = () => {
    const bases = {
      "EUR/USD": realPricesRef.current["EUR/USD"] ?? 1.16642,
      "GBP/USD": realPricesRef.current["GBP/USD"] ?? 1.31867,
      "XAU/USD": realPricesRef.current["XAU/USD"] ?? 3523.41,
      "USD/JPY": realPricesRef.current["USD/JPY"] ?? 146.217,
    };
    return {
      "EUR/USD": { price: bases["EUR/USD"], change: ((Math.random() - 0.5) * 0.2).toFixed(2), positive: Math.random() > 0.5 },
      "GBP/USD": { price: bases["GBP/USD"], change: ((Math.random() - 0.5) * 0.25).toFixed(2), positive: Math.random() > 0.5 },
      "XAU/USD": { price: bases["XAU/USD"], change: ((Math.random() - 0.5) * 0.3).toFixed(2), positive: Math.random() > 0.5 },
      "USD/JPY": { price: bases["USD/JPY"], change: ((Math.random() - 0.5) * 0.15).toFixed(2), positive: Math.random() > 0.5 },
    };
  };

  useEffect(() => {
    const stream = "btcusdt@trade";
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${stream}`);
    ws.onopen = () => setWsConnected(true);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const price = parseFloat(data.p);
      if (Number.isFinite(price)) {
        setLivePrice(price);
        setLastUpdate(Date.now());
        if (previousPriceRef.current) {
          const change = ((price - previousPriceRef.current) / previousPriceRef.current) * 100;
          setPriceChange(change);
        }
        previousPriceRef.current = price;
        setChartData((prev) => {
          const newData = [...prev, price];
          if (newData.length > 50) return newData.slice(-50);
          return newData;
        });
        setMarketPrices(buildMarketPrices());
      }
    };
    ws.onerror = (error) => { console.error("WebSocket error:", error); setWsConnected(false); };
    ws.onclose = () => setWsConnected(false);
    return () => ws.close();
  }, []);

  useEffect(() => {
    const fallbackInterval = setInterval(() => {
      if (!wsConnected) {
        const simulatedPrice = 43000 + (Math.random() - 0.5) * 200;
        setLivePrice(simulatedPrice);
        setLastUpdate(Date.now());
        setPriceChange((Math.random() - 0.5) * 0.5);
        setChartData((prev) => {
          const newData = [...prev, simulatedPrice];
          if (newData.length > 50) return newData.slice(-50);
          return newData;
        });
        setMarketPrices(buildMarketPrices());
      }
    }, 3000);
    return () => clearInterval(fallbackInterval);
  }, [wsConnected]);

  useEffect(() => {
    let isMounted = true;
    const isFetchingRef = { current: false };
    const backoffUntilRef = { current: 0 };
    const symbols = ["EUR/USD", "GBP/USD", "XAU/USD", "USD/JPY"];
    const fetchRealPrices = async () => {
      if (isFetchingRef.current) return;
      if (Date.now() < backoffUntilRef.current) return;
      isFetchingRef.current = true;
      try {
        const symbolParam = symbols.join(",");
        const res = await fetch(
          `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbolParam)}&apikey=${TWELVEDATA_API_KEY}`
        );
        if (res.status === 429) {
          console.warn("Twelve Data: rate limit hit, backing off 5 min");
          backoffUntilRef.current = Date.now() + 5 * 60 * 1000;
          return;
        }
        const data = await res.json();
        if (!isMounted) return;
        symbols.forEach((symbol) => {
          const entry = data[symbol];
          if (entry && entry.status !== "error" && entry.close) {
            realPricesRef.current[symbol] = parseFloat(entry.close);
          }
        });
        setMarketPrices(buildMarketPrices());
      } catch (err) {
        console.error("Real price fetch failed:", err);
      } finally {
        isFetchingRef.current = false;
      }
    };
    fetchRealPrices();
    const interval = setInterval(fetchRealPrices, 480000);
    return () => { isMounted = false; clearInterval(interval); };
  }, []);

  return { livePrice, priceChange, chartData, wsConnected, lastUpdate, marketPrices };
}

/* =========================
   BOT MAPPING CONFIG
========================= */
const botConfig = {
  "SONIC SCALPER AI": {
    subtitle: "Scalping Strategy", icon: "🤖", iconBg: "bg-blue-100 dark:bg-[#1e3a5f]",
    symbols: ["EUR/USD"], chartColor: "#2563eb", rsi: "62.4", macd: "Bullish", trend: "Uptrend",
    signal: "BUY", signalSymbol: "EUR/USD", confidence: "82%", timeframe: "5M", market: "Forex",
    myfxbookLink: "https://www.myfxbook.com/members/SonicExperts/sonic-ai/12076857",
  },
  "Revolut AI": {
    subtitle: "Trend Following Strategy", icon: "🧠", iconBg: "bg-purple-100 dark:bg-[#2e1065]",
    symbols: ["USD/JPY"], chartColor: "#9333ea", rsi: "58.7", macd: "Bullish", trend: "Uptrend",
    signal: "BUY", signalSymbol: "USD/JPY", confidence: "76%", timeframe: "15M", market: "Forex",
    myfxbookLink: "https://www.myfxbook.com/members/SonicExperts/sonic-ai/12076857",
  },
  "Phantom Stealth AI": {
    subtitle: "Grid Trading Strategy", icon: "🥷", iconBg: "bg-orange-100 dark:bg-[#431407]",
    symbols: ["GBP/USD"], chartColor: "#f97316", rsi: "45.3", macd: "Bearish", trend: "Sideways",
    signal: "BUY", signalSymbol: "GBP/USD", confidence: "64%", timeframe: "1H", market: "Forex",
    myfxbookLink: "https://www.myfxbook.com/lv/members/pg_forexoffecial/phantom-bot/12073391",
  },
  "Pip Sniper AI": {
    subtitle: "Breakout Strategy", icon: "🎯", iconBg: "bg-green-100 dark:bg-[#14532d]",
    symbols: ["EUR/USD"], chartColor: "#22c55e", rsi: "65.1", macd: "Bullish", trend: "Uptrend",
    signal: "BUY", signalSymbol: "EUR/USD", confidence: "79%", timeframe: "15M", market: "Forex",
    risk: "Medium", myfxbookLink: "https://www.myfxbook.com/members/MT4Sniper/pip-sniper/9468462",
  },
  "Gold Rush AI": {
    subtitle: "Gold Trading Strategy", icon: "🪙", iconBg: "bg-yellow-100 dark:bg-[#422006]",
    symbols: ["XAU/USD"], chartColor: "#eab308", rsi: "53.6", macd: "Bearish", trend: "Sideways",
    signal: "BUY", signalSymbol: "XAU/USD", confidence: "68%", timeframe: "15M", market: "Commodities",
    myfxbookLink: "https://www.myfxbook.com/members/FXEAMASTER/gold-rush/9875023",
  },
};

const defaultConfig = {
  subtitle: "AI Trading Strategy", icon: "🤖", iconBg: "bg-blue-100 dark:bg-[#1e3a5f]",
  symbols: ["EUR/USD", "GBP/USD"], chartColor: "#2563eb", rsi: "50.0", macd: "Neutral",
  trend: "Sideways", signal: "BUY", signalSymbol: "EUR/USD", confidence: "50%",
  timeframe: "15M", market: "Forex", myfxbookLink: "https://www.myfxbook.com",
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
  const cleanName = searchName.replace(/AI|BOT|STRATEGY|TRADING/gi, '').trim().toUpperCase();
  for (const key of Object.keys(botConfig)) {
    const cleanKey = key.replace(/AI|BOT|STRATEGY|TRADING/gi, '').trim().toUpperCase();
    if (cleanName === cleanKey) return botConfig[key];
  }
  console.log('❌ No match found for:', searchName);
  console.log('Available keys:', Object.keys(botConfig));
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
      myfxbookLink: product.url,
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
  const width = 300, height = 90, padding = 5;
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
  const formattedPrice = symbol === "XAU/USD"
    ? price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : price.toFixed(5);
  return (
    <div className="flex flex-wrap justify-between items-center px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 gap-1">
      <span className="text-[11px] font-medium text-slate-900 dark:text-slate-100">{symbol}</span>
      <span className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">${formattedPrice}</span>
      <span className={`text-[11px] font-semibold ${positive ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
        {positive ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
      </span>
    </div>
  );
}

/* =========================
   BOT CARD
========================= */
function BotCard({ bot, marketPrices, lastUpdate, chartData, livePrice, wsConnected, onInvest, onViewDetails }) {
  const isBuy = bot.signal === "BUY";
  const isConnected = wsConnected;
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all mb-4 overflow-hidden w-full">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center px-4 py-3 border-b border-slate-200 dark:border-slate-700 gap-2">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className={`flex w-10 h-10 items-center justify-center rounded-xl text-lg shrink-0 ${bot.iconBg}`}>
            {bot.icon}
          </div>
          <div className="min-w-0">
            <h2 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 m-0 tracking-wide break-words">{bot.name}</h2>
            <p className="text-[11px] text-slate-400 m-0 mt-0.5">{bot.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-semibold shrink-0">
          <span className={`w-2 h-2 rounded-full shrink-0 ${isConnected ? "bg-green-500 animate-sb-pulse" : "bg-red-500"}`} />
          <span className={isConnected ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}>
            {isConnected ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[1fr_200px] xl:grid-cols-[1fr_220px]">
          {/* Left */}
          <div className="min-w-0 w-full">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Live Market</p>
            <div className="flex flex-col gap-1.5">
              {bot.symbols.map((symbol) => (
                <MarketRow key={symbol} symbol={symbol} marketPrices={marketPrices} livePrice={livePrice} />
              ))}
            </div>
            <div className="text-[11px] font-medium text-slate-900 dark:text-slate-100 mt-3 mb-1.5">
              {bot.signalSymbol} • {bot.timeframe} Chart
            </div>
            <MiniChart data={chartData.length > 0 ? chartData : bot.chart || []} />
            <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 mt-2.5">
              <div className="p-1.5 text-center">
                <p className="text-[9px] text-slate-400 m-0">Timeframe</p>
                <p className="text-[11px] font-semibold text-slate-900 dark:text-slate-100 m-0 mt-1">{bot.timeframe}</p>
              </div>
              <div className="p-1.5 text-center border-l border-slate-200 dark:border-slate-700">
                <p className="text-[9px] text-slate-400 m-0">Market</p>
                <p className="text-[11px] font-semibold text-slate-900 dark:text-slate-100 m-0 mt-1">{bot.market}</p>
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
                <span className="text-[11px] font-semibold text-slate-900 dark:text-slate-100">{bot.rsi}</span>
              </div>
              <div className="flex justify-between px-2.5 py-1.5 border-b border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-400">MACD</span>
                <span className={`text-[11px] font-semibold ${bot.macd === "Bullish" ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                  {bot.macd}
                </span>
              </div>
              <div className="flex justify-between px-2.5 py-1.5">
                <span className="text-[11px] text-slate-400">Trend</span>
                <span className={`text-[11px] font-semibold ${
                  bot.trend === "Uptrend" ? "text-green-500 dark:text-green-400"
                  : bot.trend === "Downtrend" ? "text-red-500 dark:text-red-400"
                  : "text-amber-500 dark:text-amber-400"
                }`}>{bot.trend}</span>
              </div>
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">Signal</p>
            <div className={`rounded-lg p-2.5 text-center border ${
              isBuy
                ? "border-green-500 bg-green-50 dark:bg-[#14532d]/40"
                : "border-red-500 bg-red-50 dark:bg-[#7f1d1d]/40"
            }`}>
              <div className={`flex items-center justify-center gap-1.5 text-base font-bold ${
                isBuy ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"
              }`}>
                {isBuy ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                {bot.signal}
              </div>
              <p className="text-[11px] text-slate-900 dark:text-slate-100 m-0 mt-0.5">{bot.signalSymbol}</p>
            </div>

            <div className="flex justify-between px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900">
              <span className="text-[10px] text-slate-400">Confidence</span>
              <span className={`text-[12px] font-bold ${isBuy ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
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
            <p className="text-[11px] font-semibold text-slate-900 dark:text-slate-100 m-0 mt-1">{bot.apr}</p>
          </div>
          <div className="p-1.5 text-center border-x border-slate-200 dark:border-slate-700">
            <p className="text-[9px] text-slate-400 m-0">Win Rate</p>
            <p className="text-[11px] font-semibold text-slate-900 dark:text-slate-100 m-0 mt-1">{bot.winRate}</p>
          </div>
          <div className="p-1.5 text-center">
            <p className="text-[9px] text-slate-400 m-0">Live Traders</p>
            <p className="text-[11px] font-semibold text-slate-900 dark:text-slate-100 m-0 mt-1">{bot.traders}</p>
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
        setUname(""); setUerr(""); setUserURID(""); setIsFetchingUser(false);
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
          setUname(""); setUerr("Invalid User ID"); setUserURID("");
        }
      } catch (error) {
        console.error("Error fetching username:", error);
        setUname(""); setUerr("Error fetching user"); setUserURID("");
      } finally {
        setIsFetchingUser(false);
      }
    };
    const timer = setTimeout(() => { fetchUsername(); }, 500);
    return () => clearTimeout(timer);
  }, [uid, dispatch]);

  const getInvestmentAmount = () => (customAmount && customAmount !== "" ? parseFloat(customAmount) : 0);

  const getPackageNameByAmount = (amount) => {
    if (!amount || isNaN(amount)) return null;
    if (amount < 100) return "Minimum $100 required";
    if (amount > 14999) return "Maximum $14,999 allowed";
    if (amount >= 100 && amount <= 999) return "Basic";
    else if (amount >= 1000 && amount <= 4999) return "Standard";
    else if (amount >= 5000 && amount <= 9999) return "Elite";
    else if (amount >= 10000 && amount <= 14999) return "Growth";
    return null;
  };

  const validateAmount = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) { setAmountError("Please enter a valid amount"); return false; }
    if (numValue < 100) { setAmountError("Minimum investment amount is $100"); return false; }
    if (numValue > 14999) { setAmountError("Maximum investment amount is $14,999"); return false; }
    if (numValue > walletBalance) {
      setAmountError(`Insufficient balance! Your wallet balance is $${walletBalance.toLocaleString()}`);
      return false;
    }
    setAmountError(""); return true;
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "") { setCustomAmount(""); setAmountError(""); return; }
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) { setCustomAmount(numValue); validateAmount(numValue); }
  };

  const handleSubmit = () => {
    if (!uname) { setUerr("Please enter a valid User ID"); return; }
    const investmentAmount = getInvestmentAmount();
    if (investmentAmount < 100) { setAmountError("Minimum investment amount is $100"); return; }
    if (investmentAmount > 14999) { setAmountError("Maximum investment amount is $14,999"); return; }
    if (walletBalance < investmentAmount) {
      setAmountError(`Insufficient funds! Your wallet balance is $${walletBalance.toLocaleString()}`);
      return;
    }
    onSubmit({ uid, uname, userURID, amount: investmentAmount, bot });
  };

  const packageName = customAmount && parseFloat(customAmount) >= 100 && parseFloat(customAmount) <= 14999
    ? getPackageNameByAmount(parseFloat(customAmount))
    : null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 animate-sb-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[460px] rounded-2xl bg-white dark:bg-slate-800 p-5 shadow-2xl max-h-[90vh] overflow-y-auto animate-sb-slideUp">
        <div className="flex justify-between items-start mb-3.5 gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 m-0">Invest in {bot?.name}</h3>
            <p className="text-xs text-slate-400 m-0 mt-1">Enter investment details below</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center shrink-0 cursor-pointer text-lg"
          >
            ✕
          </button>
        </div>

        <div className="mb-3.5 px-3.5 py-2.5 border border-green-500 rounded-lg bg-green-50 dark:bg-[#14532d]/40">
          <div className="flex justify-between items-center flex-wrap gap-1">
            <span className="text-[11px] font-medium text-green-600 dark:text-green-400">Wallet Balance</span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">${walletBalance.toLocaleString()}</span>
          </div>
        </div>

        {/* User ID */}
        <div className="mb-2.5">
          <label className="block text-xs font-medium text-slate-900 dark:text-slate-100 mb-1">User ID *</label>
          <input
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-[13px] text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Enter User ID (e.g. test@gmail.com)"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
          />
          {!uid.trim() ? (
            <div className="mt-1 text-[11px] text-red-500 dark:text-red-400">⚠ Please enter User ID</div>
          ) : isFetchingUser ? (
            <div className="mt-1 text-[11px] text-slate-400">⏳ Fetching user details...</div>
          ) : uname ? (
            <div className="mt-1 text-[11px] font-semibold text-green-600 dark:text-green-400">✓ {uname}</div>
          ) : uerr ? (
            <div className="mt-1 text-[11px] text-red-500 dark:text-red-400">⚠ {uerr}</div>
          ) : null}
        </div>

        {/* Selected Bot */}
        <div className="mb-2.5">
          <label className="block text-xs font-medium text-slate-900 dark:text-slate-100 mb-1">Selected Bot</label>
          <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900">
            <span>{bot?.icon || "🤖"}</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-[13px]">{bot?.name}</span>
          </div>
        </div>

        {/* Amount */}
        <div className="mb-2.5">
          <label className="block text-xs font-medium text-slate-900 dark:text-slate-100 mb-1">Investment Amount (USD) *</label>
          <p className="text-[11px] text-slate-400 mb-1">Min: $100 | Max: $14,999</p>
          <input
            type="number"
            step="1"
            className={`w-full px-3 py-2 border rounded-lg text-[13px] text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500 transition-colors ${
              amountError ? "border-red-500" : "border-slate-200 dark:border-slate-600"
            }`}
            placeholder="Enter amount between"
            value={customAmount}
            onChange={handleAmountChange}
          />
          {amountError ? (
            <div className="mt-1 text-[11px] text-red-500 dark:text-red-400">⚠ {amountError}</div>
          ) : packageName && !packageName.includes("Minimum") && !packageName.includes("Maximum") ? (
            <div className="mt-1 text-xs text-blue-600 dark:text-blue-400 font-semibold">
              Package: <strong>{packageName}</strong>
            </div>
          ) : null}
        </div>

        <button
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={
            !uname || isLoading || isFetchingUser || !customAmount || amountError ||
            parseFloat(customAmount) < 100 || parseFloat(customAmount) > 14999 ||
            walletBalance < parseFloat(customAmount || 0)
          }
        >
          {isLoading ? "Processing..." : "🚀 Activate Investment"}
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
  const [activeTab, setActiveTab] = useState('bots');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { livePrice, chartData, wsConnected, lastUpdate, marketPrices } = useLiveMarket();

  const [walletBalance, setWalletBalance] = useState(0);
  const [walletLoading, setWalletLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedBot, setSelectedBot] = useState(null);
  const [inv, setInv] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailBot, setDetailBot] = useState(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  const bots = mapApiDataToBots(activeProductsData);

  // Check initial data ready
  useEffect(() => {
    if (!walletLoading && marketPrices && Object.keys(marketPrices).length > 0 && chartData && chartData.length > 0) {
      setTimeout(() => setInitialDataLoaded(true), 300);
    }
  }, [walletLoading, marketPrices, chartData]);

  // Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Fetch products
  useEffect(() => { dispatch(getActiveProducts()); }, [dispatch]);

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

  const handleInvestClick = (bot) => { setSelectedBot(bot); setShowInvestModal(true); };

  const handleViewDetails = (bot) => {
    if (bot?.myfxbookLink) {
      window.open(bot.myfxbookLink, "_blank", "noopener,noreferrer");
    }
  };

  const handleDownloadInvoice = (invoiceData) => {
    const invoiceNo = invoiceData.id || `INV-${Date.now()}`;
    const userName = invoiceData.user || 'User';
    const userId = invoiceData.uid || 'N/A';
    const amount = invoiceData.amount || 0;
    const orderDate = invoiceData.date || new Date().toLocaleDateString();
    const status = 'Active';
    const roiValue = invoiceData.roi || '20';
    const d = { bot: invoiceData.bot, package: invoiceData.package, CategoryName: invoiceData.bot, PackageName: invoiceData.package };

    const invoiceHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8" /><title>Roventar Invoice ${invoiceNo}</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#e8e8e8;padding:10px;font-family:"Inter",-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh}
    .invoice{max-width:780px;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.15);page-break-inside:avoid;break-inside:avoid}
    .top-bar{background:#1a1a1a;padding:12px 28px;display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #333}
    .top-bar .brand{display:flex;flex-direction:column;align-items:flex-start;gap:2px}
    .top-bar .brand .logo-img{width:100%;max-width:180px;height:auto;object-fit:contain;display:block}
    .top-bar .invoice-tag{text-align:right}
    .top-bar .invoice-tag .label{font-size:8px;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:1.5px;font-weight:600}
    .top-bar .invoice-tag .number{font-size:13px;font-weight:700;color:#fff}
    .header{background:#f5f5f5;padding:16px 28px 14px;border-bottom:1px solid #d0d0d0}
    .header-content{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px}
    .header-left .greeting{font-size:20px;font-weight:700;color:#1a1a1a}
    .header-left .greeting span{color:#444}
    .header-left .sub{font-size:12px;color:#666;font-weight:400;margin-top:1px}
    .header-right{text-align:right}
    .header-right .amount-label{font-size:10px;color:#555;text-transform:uppercase;letter-spacing:1px;font-weight:700}
    .header-right .amount-wrapper{display:flex;align-items:baseline;justify-content:flex-end;gap:4px}
    .header-right .amount{font-size:28px;font-weight:900;color:#1a1a1a;line-height:1.1}
    .header-right .currency{font-size:14px;font-weight:600;color:#555}
    .status-row{display:flex;justify-content:space-between;align-items:center;padding:8px 28px;background:#fff;border-bottom:1px solid #d0d0d0;flex-wrap:wrap;gap:6px}
    .status-row .date{font-size:12px;color:#666;font-weight:500}
    .status-row .date strong{color:#1a1a1a;font-weight:700}
    .status-badge{display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:#333}
    .body{padding:14px 28px 10px;background:#fff}
    .section{margin-bottom:18px}
    .section:last-of-type{margin-bottom:0}
    .section-title{font-size:10px;font-weight:800;color:#1a1a1a;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid #ccc}
    .section-title .icon{margin-right:6px;font-size:13px}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px}
    .grid-3{grid-template-columns:repeat(3,1fr)}
    .card{background:#f5f5f5;border-radius:10px;padding:8px 14px;border:1px solid #d0d0d0}
    .card .label{font-size:9px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:.8px;margin-bottom:2px}
    .card .value{font-size:14px;font-weight:700;color:#1a1a1a}
    .card .value-sm{font-size:13px;font-weight:600;color:#1a1a1a}
    .highlight-box{background:#f0f0f0;border:2px solid #aaa;border-radius:10px;padding:10px 18px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-top:2px}
    .highlight-box .left .label,.highlight-box .right .label{font-size:10px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:1px}
    .highlight-box .left .value{font-size:16px;font-weight:800;color:#1a1a1a;margin-top:1px}
    .highlight-box .right{text-align:right}
    .highlight-box .right .value{font-size:18px;font-weight:900;color:#333;margin-top:1px}
    .company-address{background:#f5f5f5;padding:8px 18px;border-radius:10px;border:1px solid #d0d0d0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px}
    .company-address .address-text{font-size:10px;color:#666;line-height:1.5}
    .company-address .address-text strong{color:#1a1a1a}
    .stamp-section{display:flex;justify-content:flex-end;align-items:center;margin-top:8px;padding-top:8px;border-top:2px dashed #ccc}
    .stamp-box{display:flex;flex-direction:column;align-items:center;gap:2px}
    .stamp-box .stamp-label{font-size:7px;color:#888;text-transform:uppercase;letter-spacing:1px;font-weight:600}
    .stamp-box .stamp-image{width:120px;height:120px;object-fit:contain;border-radius:8px;background:#fff;padding:4px}
    .footer{background:#f5f5f5;padding:10px 28px 8px;text-align:center;border-top:2px solid #ccc}
    .footer .brand-name{font-size:14px;font-weight:800;color:#1a1a1a;letter-spacing:1px}
    .footer .brand-name span{color:#555}
    .footer .divider{width:25px;height:2px;background:#555;margin:4px auto;border-radius:2px}
    .footer p{font-size:10px;color:#1a1a1a;font-weight:500;line-height:1.4}
    .footer .note{font-size:7px;color:#888;font-weight:500;margin-top:3px}
    .brand-logo-span{color:#fff;font-weight:400;font-size:12px}
    @media (max-width:700px){.top-bar{flex-direction:column;gap:6px;padding:10px 16px;text-align:center}.top-bar .brand{align-items:center;width:100%}.top-bar .brand .logo-img{max-width:150px}.top-bar .invoice-tag{text-align:center}.header{padding:12px 16px}.header-content{flex-direction:column;align-items:flex-start}.header-right{text-align:left;width:100%}.header-right .amount-wrapper{justify-content:flex-start}.header-right .amount{font-size:24px}.body{padding:10px 16px}.grid-3{grid-template-columns:1fr 1fr}.status-row{padding:6px 16px;flex-direction:column;align-items:flex-start}.footer{padding:8px 16px}.stamp-section{justify-content:center}.company-address{flex-direction:column;text-align:center}.stamp-box .stamp-image{width:100px;height:100px}}
    @media (max-width:480px){.grid-3{grid-template-columns:1fr}.top-bar .brand .logo-img{max-width:120px}.header-left .greeting{font-size:17px}}
    @media print{body{background:#fff;padding:0;margin:0}.invoice{box-shadow:none;border-radius:0;max-width:100%}.top-bar{background:#1a1a1a!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}.top-bar .brand .logo-img{-webkit-print-color-adjust:exact;print-color-adjust:exact}.status-badge{color:#333!important}.highlight-box,.card,.footer,.header,.company-address,.stamp-image{-webkit-print-color-adjust:exact;print-color-adjust:exact}.stamp-section{page-break-inside:avoid;break-inside:avoid}}
    </style></head>
    <body>
    <div class="invoice">
      <div class="top-bar"><div class="brand"><img src="/logo.png" alt="Roventar Logo" class="logo-img" /><span class="brand-logo-span">Smart Trading · Better Future</span></div>
      <div class="invoice-tag"><div class="label">Invoice Number</div><div class="number">#${invoiceNo}</div></div></div>
      <div class="header"><div class="header-content"><div class="header-left"><div class="greeting">Hello, <span>${userName}</span></div><div class="sub">Thank you for investing with Roventar</div></div>
      <div class="header-right"><div class="amount-label">Total Investment</div><div class="amount-wrapper"><span class="amount">$${amount.toFixed(2)}</span><span class="currency">USD</span></div></div></div></div>
      <div class="status-row"><div class="date">📅 <strong>Transaction Date:</strong> ${orderDate}</div><div><span class="status-badge">${status}</span></div></div>
      <div class="body">
        <div class="section"><div class="section-title"><span class="icon">👤</span> User Details</div>
          <div class="grid"><div class="card"><div class="label">Username</div><div class="value">${userName}</div></div>
          <div class="card"><div class="label">User ID</div><div class="value value-sm">${userId}</div></div></div></div>
        <div class="section"><div class="section-title"><span class="icon">🤖</span> Package Details</div>
          <div class="grid grid-3"><div class="card"><div class="label">Strategy</div><div class="value">${d.CategoryName || d.bot || "N/A"}</div></div>
          <div class="card"><div class="label">Package</div><div class="value">${d.PackageName || d.package || "N/A"}</div></div>
          <div class="card"><div class="label">APY</div><div class="value">${typeof roiValue === 'number' ? roiValue.toFixed(2) : roiValue}%</div></div></div></div>
        <div class="section"><div class="section-title"><span class="icon">💰</span> Investment Summary</div>
          <div class="highlight-box"><div class="left"><div class="label">Package</div><div class="value">${d.PackageName || d.package || "N/A"}</div></div>
          <div class="right"><div class="label">Amount</div><div class="value">$${amount.toFixed(2)}</div></div></div></div>
        <div class="section" style="margin-bottom:4px"><div class="section-title"><span class="icon">🏢</span> Company Details</div>
          <div class="company-address"><div class="address-text"><strong>ROVENTAR TRADING LLC</strong><br />Registered Agent: As per Articles of Organization<br />State of Missouri, USA<br />Date Filed: 08/26/2026</div>
          <div class="address-text" style="text-align:right"><strong>Email:</strong> support@roventar.com<br /><strong>Phone:</strong> +1 (800) 555-0199</div></div></div>
        <div class="stamp-section"><div class="stamp-box"><span class="stamp-label">Company Stamp</span><img src="/stampbackremove.png" alt="Roventar CAPITAL MANAGEMENT LLC Stamp" class="stamp-image" /></div></div>
      </div>
      <div class="footer"><div class="brand-name">✦ Rove<span>ntar</span></div><div class="divider"></div>
        <p>Thank you for trusting Roventar with your investment.<br />Our AI-driven strategies are working to grow your wealth.</p>
        <div class="note">© ${new Date().getFullYear()} Roventar · All Rights Reserved · Computer Generated Invoice</div></div>
    </div></body></html>`;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = invoiceHTML;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);
    const element = tempDiv.querySelector('.invoice');
    const opt = {
      margin: 10,
      filename: `Roventar_Invoice_${invoiceNo}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    if (typeof html2pdf !== 'undefined') {
      html2pdf().set(opt).from(element).save().then(() => { document.body.removeChild(tempDiv); });
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => {
        html2pdf().set(opt).from(element).save().then(() => { document.body.removeChild(tempDiv); });
      };
      document.head.appendChild(script);
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
        if (amount >= 100 && amount <= 999) return "Basic";
        else if (amount >= 1000 && amount <= 4999) return "Standard";
        else if (amount >= 5000 && amount <= 9999) return "Elite";
        else if (amount >= 10000 && amount <= 14999) return "Growth";
        return null;
      };

      const o = {
        id: `R-${Date.now()}`,
        bot: bot.name,
        logo: bot.icon || "🤖",
        user: uname,
        package: transactionData?.PackageName || getPackageNameByAmount(amount),
        uid: uid.toUpperCase(),
        amount: amount,
        date: new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }),
        roi: bot.apr?.replace('%', '') || "20",
        status: "Active",
        color: bot.chartColor || "#6725cd",
        transactionId: transactionData?.RechargeId || transactionData?.transactionId || `TXN-${Date.now()}`
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
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">Loading Bot Strategy...</div>
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
              <CircleDollarSign size={20} className="text-blue-600 dark:text-blue-400 shrink-0" />
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 m-0">AI Trading Bots</h1>
            </div>
            <p className="text-[11px] text-slate-400 m-0 mt-0.5">Monitor your automated trading strategies</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 ml-auto">
            {/* Tabs */}
            <div className="flex gap-0.5 p-0.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0 flex-wrap max-sm:w-full max-sm:justify-stretch">
              <button
                className={`flex items-center gap-1 px-3 py-1.5 max-sm:flex-1 max-sm:justify-center max-sm:text-[11px] max-sm:px-2 max-sm:py-1.5 border-0 rounded-md text-xs font-medium cursor-pointer transition-all whitespace-nowrap ${
                  activeTab === 'bots'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'bg-transparent text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
                onClick={() => setActiveTab('bots')}
              >
                <Bot size={14} className="w-3.5 h-3.5 max-sm:w-3 max-sm:h-3 shrink-0" />
                Bots
              </button>
              <button
                className={`flex items-center gap-1 px-3 py-1.5 max-sm:flex-1 max-sm:justify-center max-sm:text-[11px] max-sm:px-2 max-sm:py-1.5 border-0 rounded-md text-xs font-medium cursor-pointer transition-all whitespace-nowrap ${
                  activeTab === 'history'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'bg-transparent text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
                onClick={() => setActiveTab('history')}
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
        {activeTab === 'bots' ? (
          <div className="px-4 py-3 max-sm:px-2.5">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
              {bots.map((bot) => (
                <BotCard
                  key={bot.name}
                  bot={bot}
                  marketPrices={marketPrices}
                  lastUpdate={lastUpdate}
                  chartData={chartData}
                  livePrice={livePrice}
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
          onClose={() => { setShowInvestModal(false); setSelectedBot(null); }}
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
          <div className="w-full max-w-[420px] rounded-2xl bg-white dark:bg-slate-800 p-5 shadow-2xl text-center animate-sb-slideUp">
            <div className="text-5xl mb-2.5">🎉</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Congratulations!</h3>
            <p className="text-[13px] text-slate-900 dark:text-slate-100 mb-3.5">
              Your AI bot investment is now live and running.
            </p>
            <div className="mb-3.5 p-3.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-left">
              {[
                { label: "Order ID", value: inv.id },
                { label: "Bot Strategy", value: inv.bot },
                { label: "User ID", value: inv.user },
                { label: "Package", value: inv.package },
                { label: "Amount", value: `$${inv.amount.toFixed(2)}`, highlight: true },
                { label: "Date", value: inv.date }
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-700 last:border-b-0 gap-2"
                >
                  <span className="text-xs font-medium text-slate-900 dark:text-slate-100">{item.label}</span>
                  <span className={`text-xs text-slate-900 dark:text-slate-100 break-words ${item.highlight ? "font-bold" : ""}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 w-full">
              <button
                className="w-full py-3 rounded-lg bg-slate-600 hover:bg-slate-700 text-white text-[13px] font-semibold cursor-pointer transition-all flex-1"
                onClick={() => handleDownloadInvoice(inv)}
              >
                <Download size={16} className="inline mr-1.5 align-middle" />
                Download Invoice
              </button>
              <button
                className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold cursor-pointer transition-all flex-1"
                onClick={() => setShowSuccess(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyframes (Tailwind can't express these inline) */}
      <style jsx global>{`
        @keyframes sb-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes sb-fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes sb-slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes sb-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-sb-pulse { animation: sb-pulse 1.5s ease-in-out infinite; }
        .animate-sb-fadeIn { animation: sb-fadeIn 0.3s ease-out; }
        .animate-sb-slideUp { animation: sb-slideUp 0.3s ease-out; }
        .animate-sb-bounce { animation: sb-bounce 1.5s ease-in-out infinite; }

        /* Modal scrollbar */
        .overflow-y-auto::-webkit-scrollbar { width: 4px; }
        .overflow-y-auto::-webkit-scrollbar-track { background: #f8fafc; }
        .overflow-y-auto::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}