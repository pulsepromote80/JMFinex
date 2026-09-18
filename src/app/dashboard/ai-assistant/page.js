"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  return <AIAssistant />;
}

function AIAssistant() {
  // ----- STATE -----
  const [credits, setCredits] = useState(845);
  const [selectedCategory, setSelectedCategory] = useState("forex");
  const [selectedType, setSelectedType] = useState("quick");
  const [selectedRisk, setSelectedRisk] = useState("low");
  const [history, setHistory] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [hasReport, setHasReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [livePrice, setLivePrice] = useState(null);
  const [tradeLevels, setTradeLevels] = useState({
    entry: null,
    sl: null,
    tp1: null,
    tp2: null,
    rr: null,
  });

  const reportRef = useRef(null);
  const typingRef = useRef(null);
  const reasoningRef = useRef(null);
  const gaugeCircleRef = useRef(null);
  const confNumRef = useRef(null);
  const tvContainerRef = useRef(null);

  const assetMap = {
    forex: [
      "EUR/USD — Euro / US Dollar",
      "GBP/USD — British Pound / US Dollar",
      "USD/JPY — US Dollar / Japanese Yen",
      "AUD/USD — Australian Dollar / US Dollar",
      "USD/CAD — US Dollar / Canadian Dollar",
      "USD/CHF — US Dollar / Swiss Franc",
      "NZD/USD — New Zealand Dollar / US Dollar",
      "XAU/USD — Gold / US Dollar",
      "XAG/USD — Silver / US Dollar",
    ],
    crypto: [
      "BTC/USDT — Bitcoin / Tether",
      "ETH/USDT — Ethereum / Tether",
      "SOL/USDT — Solana / Tether",
      "BNB/USDT — BNB / Tether",
      "XRP/USDT — Ripple / Tether",
      "DOGE/USDT — Dogecoin / Tether",
      "ADA/USDT — Cardano / Tether",
      "AVAX/USDT — Avalanche / Tether",
    ],
    metals: [
      "XAU/USD — Gold / US Dollar",
      "XAG/USD — Silver / US Dollar",
      "XPT/USD — Platinum / US Dollar",
      "XPD/USD — Palladium / US Dollar",
      "COPPER — Copper CFD",
    ],
    indices: [
      "US30 — Dow Jones Industrial",
      "NAS100 — NASDAQ 100",
      "SP500 — S&P 500",
      "DAX — Germany DAX 40",
      "FTSE100 — UK FTSE 100",
      "NIKKEI — Japan Nikkei 225",
      "HSI — Hang Seng Index",
    ],
    commodities: [
      "WTI/USD — Crude Oil WTI",
      "BRENT/USD — Crude Oil Brent",
      "NGAS/USD — Natural Gas",
      "WHEAT — Wheat Futures",
      "CORN — Corn Futures",
      "SOYBEANS — Soybean Futures",
    ],
  };

  const tvMap = {
    "EUR/USD": "FX:EURUSD",
    "GBP/USD": "FX:GBPUSD",
    "USD/JPY": "FX:USDJPY",
    "AUD/USD": "FX:AUDUSD",
    "USD/CAD": "FX:USDCAD",
    "USD/CHF": "FX:USDCHF",
    "NZD/USD": "FX:NZDUSD",
    "XAU/USD": "OANDA:XAUUSD",
    "XAG/USD": "OANDA:XAGUSD",
    "XPT/USD": "OANDA:XPTUSD",
    "XPD/USD": "OANDA:XPDUSD",
    "BTC/USDT": "BINANCE:BTCUSDT",
    "ETH/USDT": "BINANCE:ETHUSDT",
    "SOL/USDT": "BINANCE:SOLUSDT",
    "BNB/USDT": "BINANCE:BNBUSDT",
    "XRP/USDT": "BINANCE:XRPUSDT",
    "DOGE/USDT": "BINANCE:DOGEUSDT",
    "ADA/USDT": "BINANCE:ADAUSDT",
    "AVAX/USDT": "BINANCE:AVAXUSDT",
    COPPER: "COMEX:HG1!",
    US30: "TVC:DJI",
    NAS100: "TVC:NDX",
    SP500: "TVC:SPX",
    DAX: "TVC:DAX",
    FTSE100: "TVC:UKX",
    NIKKEI: "TVC:NI225",
    HSI: "TVC:HSI",
    "WTI/USD": "TVC:USOIL",
    "BRENT/USD": "TVC:UKOIL",
    "NGAS/USD": "NYMEX:NG1!",
    WHEAT: "CBOT:ZW1!",
    CORN: "CBOT:ZC1!",
    SOYBEANS: "CBOT:ZS1!",
  };

  const loadingSteps = [
    "Scanning Markets...",
    "Analyzing Liquidity...",
    "Reading Economic Calendar...",
    "Checking Smart Money Flow...",
    "Calculating Risk Parameters...",
    "Evaluating News Sentiment...",
    "Generating Institutional Report...",
  ];

  function getMockResponse(cat, asset, type, risk) {
    const assetName = asset.split(" — ")[0] || asset;
    const isGold = assetName.includes("XAU") || assetName.includes("Gold");
    const isBTC = assetName.includes("BTC");
    const conf = Math.floor(78 + Math.random() * 18);
    const isBull = Math.random() > 0.35;
    const signal = isBull ? "BUY" : "SELL";
    const trend = isBull ? "Bullish" : "Bearish";

    let entry, sl, tp1, tp2, sup, res;
    if (isGold) {
      entry = 3365;
      sl = 3355;
      tp1 = 3378;
      tp2 = 3392;
      sup = 3358;
      res = 3388;
    } else if (isBTC) {
      entry = 67100;
      sl = 65800;
      tp1 = 68500;
      tp2 = 70000;
      sup = 66200;
      res = 68800;
    } else if (assetName.includes("EUR")) {
      entry = 1.0841;
      sl = isBull ? 1.081 : 1.0872;
      tp1 = isBull ? 1.088 : 1.08;
      tp2 = isBull ? 1.092 : 1.076;
      sup = 1.082;
      res = 1.09;
    } else if (assetName.includes("NAS")) {
      entry = 19720;
      sl = 19580;
      tp1 = 19900;
      tp2 = 20100;
      sup = 19600;
      res = 20000;
    } else {
      entry = 1.2741;
      sl = isBull ? 1.271 : 1.277;
      tp1 = isBull ? 1.279 : 1.27;
      tp2 = isBull ? 1.284 : 1.265;
      sup = 1.272;
      res = 1.28;
    }
    const rr = (Math.abs(tp2 - entry) / Math.abs(sl - entry) || 1).toFixed(1);

    const news = isBull
      ? [
          {
            text: "<strong>US Dollar Index</strong> weakened following softer-than-expected inflation data, boosting risk appetite.",
            sentiment: "Positive",
          },
          {
            text: `<strong>${assetName}</strong> gaining strength supported by institutional buying and declining treasury yields.`,
            sentiment: "Positive",
          },
        ]
      : [
          {
            text: "<strong>Federal Reserve</strong> hawkish commentary renewed USD strength, weighing on risk assets.",
            sentiment: "Negative",
          },
          {
            text: `<strong>${assetName}</strong> facing headwinds from profit-taking at key resistance levels.`,
            sentiment: "Negative",
          },
        ];

    const cal = [
      { time: "15:30", event: "US CPI (MoM)", impact: "high" },
      { time: "17:00", event: "Fed Member Speech", impact: "medium" },
      { time: "19:00", event: "US Crude Oil Inventories", impact: "medium" },
    ];

    const reasoning = isBull
      ? `Our AI identified a <strong>bullish continuation setup</strong> after detecting weakening USD strength, positive institutional order flow and a confirmed breakout above the key $${sup} support-turned-resistance level. Momentum indicators (RSI at ${Math.floor(
          52 + Math.random() * 12
        )}, MACD bullish crossover) support further upside. Smart money positioning data shows net-long accumulation for the third consecutive session. The upcoming economic events may increase short-term volatility — recommended risk per trade remains at 1% of account capital. Suggested to <strong>trail stop to breakeven</strong> once TP1 is reached.`
      : `Our AI identified a <strong>bearish reversal signal</strong> following deteriorating order flow and a confirmed rejection at the $${res} resistance zone. MACD shows bearish crossover on H4, RSI overbought at ${Math.floor(
          68 + Math.random() * 10
        )}. Institutional data reflects increased short positioning. News sentiment is negative, reinforcing downside probability. Monitor upcoming economic releases for volatility spikes. Recommended risk per trade: 1% of account capital.`;

    return {
      instrument: assetName,
      signal,
      trend,
      confidence: conf,
      entry,
      sl,
      tp1,
      tp2,
      rr: `1 : ${rr}`,
      riskLevel: risk.charAt(0).toUpperCase() + risk.slice(1),
      indicators: {
        rsi: Math.floor(48 + Math.random() * 28),
        macd: isBull ? "Bullish X" : "Bearish X",
        ema: isBull ? "Above 200" : "Below 200",
        atr: "High Vol",
        adx: conf > 85 ? "Very Strong" : "Strong",
      },
      structure: {
        trend,
        liquidity: isBull ? "Buy Side" : "Sell Side",
        support: sup,
        resistance: res,
        flow: isBull ? "Positive" : "Negative",
      },
      news,
      cal,
      reasoning,
      timestamp: new Date().toISOString(),
    };
  }

  function handleCategory(el, cat) {
    setSelectedCategory(cat);
  }

  function handleType(el, t) {
    setSelectedType(t);
  }

  function handleRisk(r) {
    setSelectedRisk(r);
  }

  function normalizeInstrument(instrument) {
    if (!instrument) return "";
    return instrument.split(" — ")[0].trim();
  }

  function getCryptoStream(instrument) {
    const clean = normalizeInstrument(instrument);
    const streams = {
      "BTC/USDT": "btcusdt@trade",
      "ETH/USDT": "ethusdt@trade",
      "SOL/USDT": "solusdt@trade",
      "BNB/USDT": "bnbusdt@trade",
      "XRP/USDT": "xrpusdt@trade",
      "DOGE/USDT": "dogeusdt@trade",
      "ADA/USDT": "adausdt@trade",
      "AVAX/USDT": "avaxusdt@trade",
      "EUR/USD": "eurusd",
      "GBP/USD": "gbpusd",
      "USD/JPY": "usdjpy",
      "AUD/USD": "audusd",
      "USD/CAD": "usdcad",
      "USD/CHF": "usdchf",
      "NZD/USD": "nzdusd",
      "XAU/USD": "xauusd",
      "XAG/USD": "xagusd",
      "XPT/USD": "xptusd",
      "XPD/USD": "xpdusd",
      COPPER: "copper",
      US30: "us30",
      NAS100: "nas100",
      SP500: "sp500",
      DAX: "dax",
      FTSE100: "ftse100",
      NIKKEI: "nikkei",
      HSI: "hsi",
      "WTI/USD": "wtiusd",
      "BRENT/USD": "brentusd",
      "NGAS/USD": "ngasusd",
      WHEAT: "wheat",
      CORN: "corn",
      SOYBEANS: "soybeans",
    };
    return streams[clean] || null;
  }

  useEffect(() => {
    if (!reportData?.instrument) {
      setLivePrice(null);
      return;
    }

    const stream = getCryptoStream(reportData.instrument);
    if (!stream) {
      setLivePrice(null);
      return;
    }

    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${stream}`);

    ws.onopen = () => {
      console.log("Connected:", stream);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const price = Number(data.p);
      if (Number.isFinite(price)) {
        setLivePrice(price);
        const levels = calculateTradeLevels(price, reportData?.trend);
        setTradeLevels(levels);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      ws.close();
    };
  }, [reportData?.instrument]);

  function calculateTradeLevels(price, trend = "Bullish") {
    const entry = Number(price);
    if (!Number.isFinite(entry) || entry <= 0) {
      return {
        entry: null,
        sl: null,
        tp1: null,
        tp2: null,
        rr: null,
      };
    }

    const lossPercent = 0.05;
    const profit1Percent = 0.08;
    const profit2Percent = 0.15;

    const lossDistance = entry * lossPercent;
    const profit1Distance = entry * profit1Percent;
    const profit2Distance = entry * profit2Percent;

    let sl, tp1, tp2;

    if (trend === "Bearish") {
      sl = entry + lossDistance;
      tp1 = entry - profit1Distance;
      tp2 = entry - profit2Distance;
    } else {
      sl = entry - lossDistance;
      tp1 = entry + profit1Distance;
      tp2 = entry + profit2Distance;
    }

    const risk = Math.abs(entry - sl);
    const reward = Math.abs(tp1 - entry);
    const rr = risk > 0 ? (reward / risk).toFixed(2) : "0.00";

    return {
      entry,
      sl,
      tp1,
      tp2,
      rr,
    };
  }

  useEffect(() => {
    if (!reportData) return;
    loadTradingView(reportData.instrument);
  }, [reportData]);

  function loadTradingView(instrument) {
    const container = tvContainerRef.current;
    if (!container) return;

    const cleanInstrument = normalizeInstrument(instrument);
    const symbol = tvMap[cleanInstrument] || "OANDA:XAUUSD";

    container.innerHTML = "";
    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container";
    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    widgetContainer.appendChild(widget);
    container.appendChild(widgetContainer);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [[cleanInstrument, symbol + "|1D"]],
      chartOnly: false,
      width: "100%",
      height: "380",
      locale: "en",
      colorTheme: "dark",
      autosize: true,
      showVolume: false,
      showMA: false,
      hideDateRanges: false,
      hideMarketStatus: false,
      hideSymbolLogo: false,
      scalePosition: "right",
      scaleMode: "Normal",
      fontFamily: "-apple-system,BlinkMacSystemFont,Trebuchet MS,Roboto,Ubuntu,sans-serif",
      fontSize: "10",
      noTimeScale: false,
      valuesTracking: "1",
      changeMode: "price-and-percent",
      chartType: "candlesticks",
      maLineColor: "#14b8a6",
      maLineWidth: 1,
      maLength: 9,
      headerFontSize: "medium",
      lineWidth: 2,
      lineType: 0,
      dateRanges: ["1d|1", "1m|30", "3m|60", "12m|1D", "60m|1W", "all|1M"],
    });
    widgetContainer.appendChild(script);
  }

  function renderReport(data) {
    setReportData(data);
    setHasReport(true);

    setTimeout(() => {
      const circle = gaugeCircleRef.current;
      const num = confNumRef.current;
      if (circle) {
        const circ = 276.46;
        const offset = circ - circ * (data.confidence / 100);
        circle.style.strokeDashoffset = String(offset);
      }
      if (num) {
        let cn = 0;
        const interval = setInterval(() => {
          cn = Math.min(cn + 2, data.confidence);
          num.textContent = cn + "%";
          if (cn >= data.confidence) clearInterval(interval);
        }, 20);
      }
    }, 200);

    const rt = reasoningRef.current;
    const typing = typingRef.current;
    if (rt && typing) {
      rt.innerHTML = "";
      typing.style.display = "inline-block";
      let idx = 0;
      const raw = data.reasoning;
      const stripped = raw.replace(/<[^>]+>/g, "");
      function typeNext() {
        if (idx < stripped.length) {
          rt.innerHTML = stripped.substring(0, idx + 1);
          idx++;
          if (idx < stripped.length) {
            setTimeout(typeNext, idx < 50 ? 30 : idx < 150 ? 18 : 12);
          } else {
            rt.innerHTML = raw;
            typing.style.display = "none";
          }
        }
      }
      setTimeout(typeNext, 200);
    }
  }

  async function handleGenerate() {
    if (generating) return;
    if (credits <= 0) {
      setShowModal(true);
      return;
    }
    setGenerating(true);
    setHasReport(false);
    setReportData(null);
    setCurrentStep(0);
    setLoadingProgress(0);

    setCredits((c) => Math.max(0, c - 1));

    const totalSteps = loadingSteps.length;
    for (let i = 0; i < totalSteps; i++) {
      setCurrentStep(i);
      const progress = Math.round(((i + 1) / totalSteps) * 100);
      setLoadingProgress(progress);
      const delay = 600 + Math.random() * 600;
      await new Promise((r) => setTimeout(r, delay));
    }

    await new Promise((r) => setTimeout(r, 500));

    const assetEl = document.getElementById("ata-asset");
    const asset = assetEl ? assetEl.value : "XAU/USD";
    const data = getMockResponse(selectedCategory, asset, selectedType, selectedRisk);

    const newEntry = {
      date: new Date(),
      instrument: data.instrument,
      category: selectedCategory,
      trend: data.trend,
      confidence: data.confidence,
      credits: 1,
      data,
    };
    setHistory((prev) => [newEntry, ...prev].slice(0, 20));

    renderReport(data);
    setGenerating(false);
  }

  function buyCredits(amount) {
    setCredits((c) => c + amount);
  }

  function copyReport() {
    const text = reportRef.current?.innerText || "No report";
    navigator.clipboard?.writeText(text).catch(() => {});
  }

  function loadHistory(index) {
    const entry = history[index];
    if (!entry) return;
    setHasReport(true);
    renderReport(entry.data);
  }

  useEffect(() => {
    const clockEl = document.getElementById("ata-clock");
    if (clockEl) {
      const tick = () => {
        const n = new Date();
        clockEl.textContent = n.toUTCString().split(" ").slice(4, 5)[0] + " UTC";
      };
      tick();
      const interval = setInterval(tick, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="min-h-screen text-gray-900 dark:text-[#eaf5f7] font-['Inter',sans-serif]">

      {/* MAIN CONTENT */}
      <div className="p-4 sm:p-5 lg:p-6 flex flex-col gap-5">
        {/* CREDITS BAR */}
        {/* <div className="flex flex-wrap items-center gap-3.5">
          <div className="flex items-center gap-3.5 bg-gradient-to-r from-blue-500/10 to-white/50 dark:from-[rgba(47,217,211,0.1)] dark:to-[rgba(255,255,255,0.05)] border border-blue-500/20 dark:border-[rgba(47,217,211,0.2)] rounded-xl px-4 sm:px-5 py-3.5 relative overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 dark:bg-[rgba(47,217,211,0.12)] flex items-center justify-center text-lg flex-shrink-0 text-blue-500 dark:text-[#2fd9d3]">⚡</div>
            <div>
              <div className="text-[10.5px] text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.7px] mb-0.5">Available Credits</div>
              <div className="font-['Space_Grotesk',sans-serif] text-2xl sm:text-[28px] font-bold text-blue-500 dark:text-[#2fd9d3] leading-none transition-all duration-400" id="ata-cred-display">{credits}</div>
              <div className="text-[10.5px] text-gray-500 dark:text-[#9db4be] mt-0.5">AI analysis credits</div>
            </div>
          </div>
          <button className="inline-flex items-center gap-1.5 bg-blue-500 dark:bg-[#2fd9d3] text-white dark:text-[#04131a] px-4 sm:px-5 py-2.5 rounded-lg text-sm font-bold border-none cursor-pointer transition-all hover:bg-blue-600 dark:hover:bg-[#18c7c2] hover:shadow-[0_4px_20px_rgba(20,184,166,0.35)] whitespace-nowrap" onClick={() => buyCredits(50)}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Buy Credits
          </button>
          <div className="ml-auto font-['Space_Grotesk',sans-serif] text-sm text-gray-500 dark:text-[#9db4be] flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span id="ata-clock">--:--:-- UTC</span>
          </div>
        </div> */}

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4 lg:gap-5 items-start">
          {/* LEFT PANEL */}
          <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl overflow-hidden sticky lg:top-[76px] md:top-[76px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
            <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-[rgba(140,200,205,0.16)] bg-gradient-to-r from-blue-500/5 to-transparent dark:from-[rgba(47,217,211,0.04)]">
              <div className="font-['Space_Grotesk',sans-serif] text-base font-bold text-gray-900 dark:text-[#eaf5f7] mb-0.5">✦ Generate AI Market Analysis</div>
              <div className="text-[11.5px] text-gray-500 dark:text-[#9db4be]">Configure your request · 1 credit per analysis</div>
            </div>

            {/* Step 1: Category */}
            <div className="p-6 border-b border-gray-200/5 dark:border-[rgba(140,200,205,0.06)]">
              <div className="text-[10.5px] font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.8px] mb-2.5 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-500 dark:bg-[#2fd9d3] text-white text-[9px] font-bold inline-flex items-center justify-center flex-shrink-0">1</span>
                Market Category
              </div>
              <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-1.5">
                {["forex", "crypto", "metals", "indices", "commodities"].map((cat) => (
                  <div
                    key={cat}
                    className={`p-2 bg-gray-100 dark:bg-[#142936] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-sm text-center cursor-pointer transition-all text-[11.5px] font-medium text-gray-500 dark:text-[#9db4be] hover:border-blue-500/30 dark:hover:border-[rgba(47,217,211,0.3)] ${
                      selectedCategory === cat ? "bg-blue-500/10 dark:bg-[rgba(47,217,211,0.12)] border-blue-500/40 dark:border-[rgba(47,217,211,0.4)] text-blue-500 dark:text-[#2fd9d3] font-semibold" : ""
                    }`}
                    onClick={(e) => handleCategory(e.currentTarget, cat)}
                  >
                    <span className="text-lg block mb-1">
                      {cat === "forex" && "💱"}
                      {cat === "crypto" && "₿"}
                      {cat === "metals" && "🥇"}
                      {cat === "indices" && "📈"}
                      {cat === "commodities" && "🛢"}
                    </span>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Asset */}
            <div className="p-4 border-b border-gray-200/5 dark:border-[rgba(140,200,205,0.06)]">
              <div className="text-[10.5px] font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.8px] mb-2.5 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-500 dark:bg-[#2fd9d3] text-white text-[9px] font-bold inline-flex items-center justify-center flex-shrink-0">2</span>
                Choose Asset
              </div>
              <select className="w-full bg-gray-100 dark:bg-[#142936] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-lg px-3.5 py-2.5 text-gray-900 dark:text-[#eaf5f7] text-sm outline-none font-['Inter',sans-serif] appearance-none cursor-pointer transition-colors focus:border-blue-500/40 dark:focus:border-[rgba(47,217,211,0.4)]" id="ata-asset">
                {assetMap[selectedCategory]?.map((asset) => (
                  <option key={asset} value={asset.split(" — ")[0]}>
                    {asset}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 3: Analysis Type */}
            <div className="p-4 border-b border-gray-200/5 dark:border-[rgba(140,200,205,0.06)]">
              <div className="text-[10.5px] font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.8px] mb-2.5 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-500 dark:bg-[#2fd9d3] text-white text-[9px] font-bold inline-flex items-center justify-center flex-shrink-0">3</span>
                Analysis Type
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "quick", label: "Quick Signal", icon: "⚡" },
                  { id: "intraday", label: "Intraday", icon: "📊" },
                  { id: "swing", label: "Swing Analysis", icon: "🔄" },
                  { id: "scalping", label: "Scalping", icon: "⚡" },
                  { id: "position", label: "Position Trade", icon: "📋" },
                  { id: "outlook", label: "Market Outlook", icon: "🌐" },
                ].map((t) => (
                  <div
                    key={t.id}
                    className={`p-2 bg-gray-100 dark:bg-[#142936] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-sm cursor-pointer transition-all text-[11.5px] font-medium text-gray-500 dark:text-[#9db4be] flex items-center gap-1.5 hover:border-blue-500/30 dark:hover:border-[rgba(47,217,211,0.3)] ${
                      selectedType === t.id ? "bg-blue-500/10 dark:bg-[rgba(47,217,211,0.12)] border-blue-500/40 dark:border-[rgba(47,217,211,0.4)] text-blue-500 dark:text-[#2fd9d3] font-semibold" : ""
                    }`}
                    onClick={(e) => handleType(e.currentTarget, t.id)}
                  >
                    <span className="text-sm flex-shrink-0">{t.icon}</span>
                    {t.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 4: Risk */}
            <div className="p-4 border-b border-gray-200/5 dark:border-[rgba(140,200,205,0.06)]">
              <div className="text-[10.5px] font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.8px] mb-2.5 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-500 dark:bg-[#2fd9d3] text-white text-[9px] font-bold inline-flex items-center justify-center flex-shrink-0">4</span>
                Risk Preference
              </div>
              <div className="flex gap-2">
                {[
                  { id: "low", label: "Low", emoji: "🟢" },
                  { id: "med", label: "Medium", emoji: "🟡" },
                  { id: "high", label: "High", emoji: "🔴" },
                ].map((r) => (
                  <div
                    key={r.id}
                    className={`flex-1 p-2 bg-gray-100 dark:bg-[#142936] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-sm text-center cursor-pointer text-xs font-medium text-gray-500 dark:text-[#9db4be] transition-all hover:border-blue-500/30 dark:hover:border-[rgba(47,217,211,0.3)] ${
                      selectedRisk === r.id
                        ? r.id === "low"
                          ? "bg-blue-500/10 dark:bg-[rgba(47,217,211,0.12)] border-blue-500/40 dark:border-[rgba(47,217,211,0.4)] text-blue-500 dark:text-[#2fd9d3]"
                          : r.id === "med"
                          ? "bg-amber-500/10 border-amber-500/40 text-amber-500"
                          : "bg-red-500/10 border-red-500/40 text-red-500"
                        : ""
                    }`}
                    onClick={() => handleRisk(r.id)}
                  >
                    {r.emoji}
                    <br />
                    <span className="text-[11px] font-semibold">{r.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate */}
            <div className="p-4">
              <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-[#142936] rounded-sm border border-gray-200 dark:border-[rgba(140,200,205,0.16)] mb-3">
                <span className="text-xs text-gray-500 dark:text-[#9db4be]">Credits Required</span>
                <span className="text-sm font-bold text-blue-500 dark:text-[#2fd9d3]">⚡ 1 Credit</span>
              </div>
              <button
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-[#2fd9d3] dark:to-[#18c7c2] text-white dark:text-[#04131a] border-none rounded-xl text-sm font-bold cursor-pointer transition-all flex items-center justify-center gap-2 font-['Inter',sans-serif] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(20,184,166,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? (
                  <>
                    <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 dark:border-[rgba(4,19,26,0.3)] border-t-white dark:border-t-[#04131a] rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M5 3l14 9-14 9V3z" />
                    </svg>
                    Generate AI Analysis
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="flex flex-col gap-4">
            {/* Empty State */}
            {!generating && !hasReport && (
              <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center gap-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
                <div className="w-20 h-20 rounded-full bg-blue-500/10 dark:bg-[rgba(47,217,211,0.12)] border border-blue-500/20 dark:border-[rgba(47,217,211,0.2)] flex items-center justify-center text-3xl text-blue-500 dark:text-[#2fd9d3] animate-[ata-float_3s_ease-in-out_infinite]">🤖</div>
                <div className="font-['Space_Grotesk',sans-serif] text-lg font-semibold text-gray-900 dark:text-[#eaf5f7]">Request Your First Analysis</div>
                <div className="text-sm text-gray-500 dark:text-[#9db4be] max-w-[320px] leading-relaxed">
                  Configure your market parameters on the left and click{" "}
                  <strong className="text-blue-500 dark:text-[#2fd9d3]">Generate AI Analysis</strong>{" "}
                  to receive institutional-grade intelligence.
                </div>
                <div className="flex gap-4 mt-2 flex-wrap justify-center">
                  <div className="text-center"><div className="text-xl mb-1">📊</div><div className="text-[11px] text-gray-500 dark:text-[#9db4be]">Technical Analysis</div></div>
                  <div className="text-center"><div className="text-xl mb-1">📰</div><div className="text-[11px] text-gray-500 dark:text-[#9db4be]">News Sentiment</div></div>
                  <div className="text-center"><div className="text-xl mb-1">📅</div><div className="text-[11px] text-gray-500 dark:text-[#9db4be]">Economic Calendar</div></div>
                  <div className="text-center"><div className="text-xl mb-1">🧠</div><div className="text-[11px] text-gray-500 dark:text-[#9db4be]">AI Reasoning</div></div>
                </div>
              </div>
            )}

            {/* Loading */}
            {generating && (
              <div className="bg-white dark:bg-[#10222e] border border-blue-500/20 dark:border-[rgba(47,217,211,0.2)] rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center gap-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
                <div className="relative w-[60px] h-[60px] rounded-full border-3 border-blue-500/15 dark:border-[rgba(47,217,211,0.15)] border-t-blue-500 dark:border-t-[#2fd9d3] animate-spin">
                  <div className="absolute inset-1.5 rounded-full border-3 border-blue-500/15 dark:border-[rgba(47,217,211,0.15)] border-b-blue-500 dark:border-b-[#2fd9d3] animate-spin-reverse"></div>
                </div>
                <div className="font-['Space_Grotesk',sans-serif] text-base font-semibold text-gray-900 dark:text-[#eaf5f7]">Initializing AI Analysis...</div>
                <div className="flex flex-col gap-1.5 w-full max-w-[320px] text-left">
                  {loadingSteps.map((label, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2.5 p-2 rounded-lg text-xs transition-all ${
                        i < currentStep
                          ? "text-blue-500 dark:text-[#2fd9d3] bg-blue-500/5 dark:bg-[rgba(47,217,211,0.06)]"
                          : i === currentStep
                          ? "text-gray-900 dark:text-[#eaf5f7] bg-gray-100/50 dark:bg-[rgba(255,255,255,0.03)] font-medium"
                          : "text-gray-500 dark:text-[#9db4be]"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
                        i < currentStep
                          ? "bg-blue-500 dark:bg-[#2fd9d3]"
                          : i === currentStep
                          ? "bg-blue-500 dark:bg-[#2fd9d3] animate-[blink_0.8s_infinite]"
                          : "bg-gray-400 dark:bg-[#4d626e]"
                      }`}></span>
                      {label}
                    </div>
                  ))}
                </div>
                <div className="w-full max-w-[320px] h-1 bg-gray-200 dark:bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 dark:from-[#2fd9d3] dark:to-[#18c7c2] rounded-full transition-all duration-500" style={{ width: `${loadingProgress}%` }}></div>
                </div>
                <div className="text-xs font-semibold text-blue-500 dark:text-[#2fd9d3] mt-[-8px]">{loadingProgress}% Complete</div>
              </div>
            )}

            {/* Report */}
            <div className={`bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl overflow-hidden ${hasReport ? "block" : "hidden"} animate-[ata-fadein_0.5s_ease] shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]`} ref={reportRef}>
              {reportData && (
                <>
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-500/5 to-white/50 dark:from-[rgba(47,217,211,0.05)] dark:to-[rgba(255,255,255,0.02)] border-b border-gray-200 dark:border-[rgba(140,200,205,0.16)] flex flex-wrap items-center justify-between gap-2.5 relative">
                    <div>
                      <div className="inline-flex items-center gap-1.5 bg-blue-500/10 dark:bg-[rgba(47,217,211,0.08)] border border-blue-500/20 dark:border-[rgba(47,217,211,0.2)] rounded-full px-3.5 py-1 text-xs font-semibold text-blue-500 dark:text-[#2fd9d3]">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-[#2fd9d3] inline-block"></span>
                        Analysis Complete
                      </div>
                      <div className="text-[11.5px] text-gray-500 dark:text-[#9db4be] mt-1.5">Generated <span id="rpt-time">just now</span> &nbsp;·&nbsp; via JMFINEX AI Engine</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-500 dark:text-[#9db4be]">⚡ 1 Credit Used</span>
                      <span className="px-2 py-0.5 rounded-full text-[10.5px] font-medium border border-gray-200 dark:border-[rgba(140,200,205,0.16)] text-gray-500 dark:text-[#9db4be] bg-white dark:bg-[#10222e]">
                        {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    {/* Chart */}
                    <div className="bg-gray-100 dark:bg-[#142936] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-xl mb-4 overflow-hidden">
                      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-gray-200 dark:border-[rgba(140,200,205,0.16)] bg-white dark:bg-[#10222e]">
                        <div className="text-[10.5px] text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.6px] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-[#2fd9d3] inline-block animate-[blink_1.6s_infinite]"></span>
                          Live Market Chart
                        </div>
                        <div className="text-[10px] text-gray-400 dark:text-[#4d626e]">Powered by TradingView</div>
                      </div>
                      <div className="p-0 bg-gray-50 dark:bg-[#0b1a24]" ref={tvContainerRef}></div>
                    </div>

                    {/* Instrument + Signal */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4">
                      <div>
                        <div className="text-[10.5px] text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.6px] mb-0.5">Instrument</div>
                        <div className="font-['Space_Grotesk',sans-serif] text-2xl font-bold text-gray-900 dark:text-[#eaf5f7]">{reportData.instrument}</div>
                      </div>
                      <div>
                        <div className="text-[10.5px] text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.6px] mb-1">AI Recommendation</div>
                        <span className={`px-4 py-1.5 rounded-lg text-sm font-bold tracking-[0.5px] ${
                          reportData.signal === "BUY"
                            ? "bg-blue-500/15 dark:bg-[rgba(47,217,211,0.15)] text-blue-500 dark:text-[#2fd9d3] border border-blue-500/30 dark:border-[rgba(47,217,211,0.3)]"
                            : "bg-red-500/15 text-red-500 border border-red-500/30"
                        }`}>
                          {reportData.signal}
                        </span>
                      </div>
                    </div>

                    {/* Trend + Confidence */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3.5 bg-gray-100 dark:bg-[#142936] rounded-xl border border-gray-200 dark:border-[rgba(140,200,205,0.16)]">
                          <div className="text-[10.5px] text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.6px] mb-1">Market Trend</div>
                          <div className={`font-['Space_Grotesk',sans-serif] text-xl font-bold ${reportData.trend === "Bullish" ? "text-blue-500 dark:text-[#2fd9d3]" : "text-red-500"}`}>{reportData.trend}</div>
                        </div>
                        <div className="p-3.5 bg-gray-100 dark:bg-[#142936] rounded-xl border border-gray-200 dark:border-[rgba(140,200,205,0.16)]">
                          <div className="text-[10.5px] text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.6px] mb-1">Risk Level</div>
                          <div className="font-['Space_Grotesk',sans-serif] text-xl font-bold text-amber-500">{reportData.riskLevel}</div>
                        </div>
                        <div className="p-3.5 bg-gray-100 dark:bg-[#142936] rounded-xl border border-gray-200 dark:border-[rgba(140,200,205,0.16)]">
                          <div className="text-[10.5px] text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.6px] mb-1">Risk Reward</div>
                          <div className="font-['Space_Grotesk',sans-serif] text-xl font-bold text-gray-900 dark:text-[#eaf5f7]">{reportData.rr}</div>
                        </div>
                        <div className="p-3.5 bg-gray-100 dark:bg-[#142936] rounded-xl border border-gray-200 dark:border-[rgba(140,200,205,0.16)]">
                          <div className="text-[10.5px] text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.6px] mb-1">Rec. Risk/Trade</div>
                          <div className="font-['Space_Grotesk',sans-serif] text-xl font-bold text-blue-500 dark:text-[#2fd9d3]">1%</div>
                        </div>
                      </div>
                      <div className="relative w-[110px] h-[110px] flex-shrink-0 mx-auto sm:mx-0">
                        <svg width="110" height="110" viewBox="0 0 110 110">
                          <circle cx="55" cy="55" r="44" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="8" className="dark:stroke-[rgba(47,217,211,0.15)]" />
                          <circle
                            ref={gaugeCircleRef}
                            cx="55"
                            cy="55"
                            r="44"
                            fill="none"
                            stroke="url(#ataGrad)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray="276.46"
                            strokeDashoffset="276.46"
                            transform="rotate(-90 55 55)"
                            style={{ transition: "stroke-dashoffset 1.4s ease" }}
                          />
                          <defs>
                            <linearGradient id="ataGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#14b8a6" />
                              <stop offset="100%" stopColor="#0d9488" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="font-['Space_Grotesk',sans-serif] text-xl font-bold text-blue-500 dark:text-[#2fd9d3] leading-none" ref={confNumRef}>{reportData.confidence}%</div>
                          <div className="text-[9.5px] text-gray-500 dark:text-[#9db4be] mt-0.5">Confidence</div>
                        </div>
                      </div>
                    </div>

                    {/* Levels */}
                    <div className="grid grid-cols-5 gap-2 mb-4">
                      {[
                        { label: "Entry Zone", value: tradeLevels.entry !== null ? tradeLevels.entry.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "--", color: "text-gray-900 dark:text-[#eaf5f7]" },
                        { label: "Stop Loss", value: tradeLevels.sl !== null ? tradeLevels.sl.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "--", color: "text-red-500", border: "border-red-500/20" },
                        { label: "Take Profit 1", value: tradeLevels.tp1 !== null ? tradeLevels.tp1.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "--", color: "text-blue-500 dark:text-[#2fd9d3]", border: "border-blue-500/20 dark:border-[rgba(47,217,211,0.2)]" },
                        { label: "Take Profit 2", value: tradeLevels.tp2 !== null ? tradeLevels.tp2.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "--", color: "text-blue-500 dark:text-[#2fd9d3]", border: "border-blue-500/30 dark:border-[rgba(47,217,211,0.3)]" },
                        { label: "Risk Reward", value: tradeLevels.rr !== null ? `1:${tradeLevels.rr}` : "--", color: "text-blue-500", border: "border-blue-500/20" },
                      ].map((item, i) => (
                        <div key={i} className={`bg-gray-100 dark:bg-[#142936] rounded-lg p-2.5 text-center border border-gray-200 dark:border-[rgba(140,200,205,0.16)] ${item.border || ""}`}>
                          <div className="text-[9.5px] text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.4px] mb-1">{item.label}</div>
                          <div className={`font-['Space_Grotesk',sans-serif] text-sm font-bold ${item.color}`}>{item.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Technical Indicators */}
                    <div className="text-[10.5px] font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.7px] mb-2">Technical Indicators</div>
                    <div className="grid grid-cols-5 gap-2 mb-4">
                      {[
                        { label: "RSI", value: reportData.indicators.rsi, sub: "Neutral", color: reportData.indicators.rsi > 70 ? "text-red-500" : reportData.indicators.rsi < 30 ? "text-blue-500 dark:text-[#2fd9d3]" : "text-amber-500" },
                        { label: "MACD", value: reportData.indicators.macd, sub: "Crossover", color: reportData.indicators.macd.includes("Bull") ? "text-blue-500 dark:text-[#2fd9d3]" : "text-red-500" },
                        { label: "EMA", value: reportData.indicators.ema, sub: "Trend", color: reportData.indicators.ema.includes("Above") ? "text-blue-500 dark:text-[#2fd9d3]" : "text-red-500" },
                        { label: "ATR", value: reportData.indicators.atr, sub: "Volatility", color: "text-amber-500" },
                        { label: "ADX", value: reportData.indicators.adx, sub: "Trend Str.", color: "text-blue-500 dark:text-[#2fd9d3]" },
                      ].map((ind, i) => (
                        <div key={i} className="bg-gray-100 dark:bg-[#142936] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-lg p-2 text-center">
                          <div className="text-[10px] text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.3px] mb-1">{ind.label}</div>
                          <div className={`text-[10px] font-bold ${ind.color}`}>{ind.value}</div>
                          <div className="text-[9.5px] text-gray-500 dark:text-[#9db4be]">{ind.sub}</div>
                        </div>
                      ))}
                    </div>

                    {/* Structure + News */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-100 dark:bg-[#142936] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-xl p-3.5">
                        <div className="text-[11px] font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.6px] mb-2.5 flex items-center gap-1.5">📐 Market Structure</div>
                        <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-500 dark:text-[#9db4be]">Trend</span><strong className={`${reportData.structure.trend === "Bullish" ? "text-blue-500 dark:text-[#2fd9d3]" : "text-red-500"}`}>{reportData.structure.trend}</strong></div>
                        <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-500 dark:text-[#9db4be]">Liquidity</span><strong className="text-gray-900 dark:text-[#eaf5f7]">{reportData.structure.liquidity}</strong></div>
                        <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-500 dark:text-[#9db4be]">Support</span><strong className="text-gray-900 dark:text-[#eaf5f7]">{reportData.structure.support}</strong></div>
                        <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-500 dark:text-[#9db4be]">Resistance</span><strong className="text-gray-900 dark:text-[#eaf5f7]">{reportData.structure.resistance}</strong></div>
                        <div className="flex justify-between text-xs"><span className="text-gray-500 dark:text-[#9db4be]">Order Flow</span><strong className={`${reportData.structure.flow === "Positive" ? "text-blue-500 dark:text-[#2fd9d3]" : "text-red-500"}`}>{reportData.structure.flow}</strong></div>
                      </div>
                      <div className="bg-gray-100 dark:bg-[#142936] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-xl p-3.5">
                        <div className="text-[11px] font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.6px] mb-2.5 flex items-center gap-1.5">📰 News Sentiment</div>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold mb-2.5 ${reportData.signal === "BUY" ? "bg-blue-500/10 dark:bg-[rgba(47,217,211,0.08)] text-blue-500 dark:text-[#2fd9d3] border border-blue-500/20 dark:border-[rgba(47,217,211,0.2)]" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>
                          {reportData.signal === "BUY" ? "● Positive" : "● Negative"} Sentiment
                        </div>
                        {reportData.news.map((n, i) => (
                          <div key={i} className="py-2 border-b border-gray-200/5 dark:border-[rgba(140,200,205,0.04)] text-xs leading-relaxed text-gray-500 dark:text-[#9db4be] last:border-b-0 last:pb-0" dangerouslySetInnerHTML={{ __html: n.text }} />
                        ))}
                      </div>
                    </div>

                    {/* Economic Calendar */}
                    <div className="bg-gray-100 dark:bg-[#142936] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-xl p-3.5 mb-4">
                      <div className="text-[11px] font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.6px] mb-2.5 flex items-center gap-1.5">📅 Economic Calendar — Today's Events</div>
                      {reportData.cal.map((c, i) => (
                        <div key={i} className="flex items-center gap-2.5 py-2 border-b border-gray-200/5 dark:border-[rgba(140,200,205,0.04)] text-xs last:border-b-0">
                          <span className="font-['Space_Grotesk',sans-serif] text-xs font-semibold text-gray-900 dark:text-[#eaf5f7] w-10 flex-shrink-0">{c.time}</span>
                          <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] flex-shrink-0 ${c.impact === "high" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"}`}>{c.impact === "high" ? "HIGH" : "MED"}</span>
                          <span className="text-xs font-medium text-gray-900 dark:text-[#eaf5f7]">{c.event}</span>
                        </div>
                      ))}
                    </div>

                    {/* AI Reasoning */}
                    <div className="bg-gradient-to-r from-blue-500/5 to-white/50 dark:from-[rgba(47,217,211,0.04)] dark:to-[rgba(255,255,255,0.02)] border border-blue-500/10 dark:border-[rgba(47,217,211,0.1)] rounded-xl p-4 mb-4 text-sm leading-relaxed text-gray-900 dark:text-[#eaf5f7]">
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-[#2fd9d3] dark:to-[#18c7c2] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">AI</div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-[#eaf5f7]">JMFINEX AI Reasoning</div>
                          <div className="text-[11px] text-gray-500 dark:text-[#9db4be]">Institutional Analysis Engine</div>
                        </div>
                      </div>
                      <div ref={reasoningRef}></div>
                      <span className="inline-block w-0.5 h-3.5 bg-blue-500 dark:bg-[#2fd9d3] animate-[blink_1s_infinite] rounded-sm ml-0.5" ref={typingRef}></span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[rgba(140,200,205,0.16)] bg-white/70 dark:bg-[rgba(255,255,255,0.04)] text-gray-700 dark:text-[#eaf5f7] text-xs font-medium cursor-pointer transition-all hover:border-gray-300 dark:hover:border-[rgba(140,200,205,0.3)]" onClick={copyReport}>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        Copy Analysis
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[rgba(140,200,205,0.16)] bg-white/70 dark:bg-[rgba(255,255,255,0.04)] text-gray-700 dark:text-[#eaf5f7] text-xs font-medium cursor-pointer transition-all hover:border-gray-300 dark:hover:border-[rgba(140,200,205,0.3)]">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download PDF
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-[#2fd9d3] dark:to-[#18c7c2] text-white dark:text-[#04131a] text-xs font-medium cursor-pointer transition-all hover:opacity-90" onClick={handleGenerate}>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Generate Again
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[rgba(140,200,205,0.16)] bg-white/70 dark:bg-[rgba(255,255,255,0.04)] text-gray-700 dark:text-[#eaf5f7] text-xs font-medium cursor-pointer transition-all hover:border-gray-300 dark:hover:border-[rgba(140,200,205,0.3)]">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                        Save Report
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)] mt-4">
                <div className="flex items-center justify-between mb-3.5">
                  <div className="font-['Space_Grotesk',sans-serif] text-sm font-semibold text-gray-900 dark:text-[#eaf5f7]">Previous Reports</div>
                  <span className="text-[11.5px] text-gray-500 dark:text-[#9db4be]">{history.length} request{history.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="text-[11px] font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.5px] px-3 py-2 text-left border-b-2 border-gray-200 dark:border-[rgba(140,200,205,0.16)]">Date & Time</th>
                        <th className="text-[11px] font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.5px] px-3 py-2 text-left border-b-2 border-gray-200 dark:border-[rgba(140,200,205,0.16)]">Instrument</th>
                        <th className="text-[11px] font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.5px] px-3 py-2 text-left border-b-2 border-gray-200 dark:border-[rgba(140,200,205,0.16)]">Category</th>
                        <th className="text-[11px] font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.5px] px-3 py-2 text-left border-b-2 border-gray-200 dark:border-[rgba(140,200,205,0.16)]">Trend</th>
                        <th className="text-[11px] font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.5px] px-3 py-2 text-left border-b-2 border-gray-200 dark:border-[rgba(140,200,205,0.16)]">Confidence</th>
                        <th className="text-[11px] font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.5px] px-3 py-2 text-left border-b-2 border-gray-200 dark:border-[rgba(140,200,205,0.16)]">Credits</th>
                        <th className="text-[11px] font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.5px] px-3 py-2 text-left border-b-2 border-gray-200 dark:border-[rgba(140,200,205,0.16)]">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((h, i) => (
                        <tr key={i} className="hover:bg-gray-100/50 dark:hover:bg-[rgba(255,255,255,0.02)]">
                          <td className="px-3 py-2.5 text-sm text-gray-600 dark:text-[#9db4be]">{h.date.toLocaleDateString()} {h.date.toLocaleTimeString()}</td>
                          <td className="px-3 py-2.5 text-sm font-semibold text-gray-900 dark:text-[#eaf5f7]">{h.instrument}</td>
                          <td className="px-3 py-2.5 text-sm">
                            <span className="px-2 py-0.5 rounded-full text-[10.5px] font-medium border border-gray-200 dark:border-[rgba(140,200,205,0.16)] text-gray-500 dark:text-[#9db4be] bg-white dark:bg-[#10222e] capitalize">{h.category}</span>
                          </td>
                          <td className={`px-3 py-2.5 text-sm font-semibold ${h.trend === "Bullish" ? "text-blue-500 dark:text-[#2fd9d3]" : "text-red-500"}`}>{h.trend}</td>
                          <td className="px-3 py-2.5 text-sm font-semibold text-blue-500 dark:text-[#2fd9d3]">{h.confidence}%</td>
                          <td className="px-3 py-2.5 text-sm text-amber-500">⚡ {h.credits}</td>
                          <td className="px-3 py-2.5 text-sm">
                            <button className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-[rgba(140,200,205,0.16)] bg-white/70 dark:bg-[rgba(255,255,255,0.04)] text-gray-700 dark:text-[#eaf5f7] text-[11px] font-medium cursor-pointer transition-all hover:border-gray-300 dark:hover:border-[rgba(140,200,205,0.3)]" onClick={() => loadHistory(i)}>Open</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <div className={`fixed inset-0 bg-gray-900/60 dark:bg-black/70 backdrop-blur-sm z-[999] ${showModal ? "flex" : "hidden"} items-center justify-center`}>
        <div className="bg-white dark:bg-[#10222e] border border-blue-500/20 dark:border-[rgba(47,217,211,0.2)] rounded-xl p-8 max-w-[380px] w-[90%] text-center animate-[ata-fadein_0.3s_ease] shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <div className="text-4xl mb-4 text-blue-500 dark:text-[#2fd9d3]">⚡</div>
          <div className="font-['Space_Grotesk',sans-serif] text-lg font-bold text-gray-900 dark:text-[#eaf5f7] mb-2">No AI Credits Available</div>
          <div className="text-sm text-gray-500 dark:text-[#9db4be] mb-5 leading-relaxed">You've used all your credits. Purchase more credits to continue receiving institutional AI market intelligence.</div>
          <div className="flex gap-2.5 justify-center">
            <button className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-[#2fd9d3] dark:to-[#18c7c2] text-white dark:text-[#04131a] font-bold text-sm border-none cursor-pointer transition-all hover:opacity-90" onClick={() => { buyCredits(50); setShowModal(false); }}>Buy Credits</button>
            <button className="px-5 py-2.5 rounded-lg border border-gray-200 dark:border-[rgba(140,200,205,0.16)] bg-white/70 dark:bg-[rgba(255,255,255,0.04)] text-gray-700 dark:text-[#eaf5f7] text-sm font-medium cursor-pointer transition-all hover:border-gray-300 dark:hover:border-[rgba(140,200,205,0.3)]" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      </div>

      {/* Keyframe Animations */}
      <style jsx global>{`
        @keyframes ata-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes ata-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes ata-fadein {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .animate-spin-reverse {
          animation: ata-spin 1.2s linear infinite reverse;
        }
      `}</style>
    </div>
  );
}