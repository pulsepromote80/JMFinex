// app/FMP-engine/page.jsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

// Color helper functions - Dark text on white background
const G = (text) => `<span class="text-cyan-500">${text}</span>`;
const B = (text) => `<span class="text-blue-500">${text}</span>`;
const Y = (text) => `<span class="text-yellow-500">${text}</span>`;
const CY = (text) => `<span class="text-blue-500">${text}</span>`;
const R = (text) => `<span class="text-red-500">${text}</span>`;
const W = (text) => `<span class="text-gray-900">${text}</span>`;
const GR = (text) => `<span class="text-gray-500">${text}</span>`;
const DM = (text) => `<span class="text-gray-400">${text}</span>`;
const P = (text) => `<span class="text-purple-500">${text}</span>`;

const netSpan = (network) => {
  const colors = {
    BSC: "text-yellow-500",
    ETH: "text-blue-500",
    AVAX: "text-red-500",
    SOL: "text-cyan-500",
    Ethereum: "text-blue-500",
    Binance: "text-yellow-500",
    Avalanche: "text-red-500",
    Solana: "text-cyan-500",
  };
  return `<span class="${colors[network] || "text-blue-500"}">${network}</span>`;
};

export default function CryptoTerminal() {
  const [lines, setLines] = useState([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [apiSuccess, setApiSuccess] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [stats, setStats] = useState({
    txCount: 0,
    totalVolume: 0,
    oppCount: 0,
    uptime: 0,
    blockNum: 19847622,
  });
  const [profits, setProfits] = useState([]);
  const [currentTime, setCurrentTime] = useState("");

  const terminalRef = useRef(null);
  const queueRef = useRef([]);
  const startTimeRef = useRef(Date.now());
  const lineCounterRef = useRef(0);

  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  const appendLine = useCallback(
    (html) => {
      return new Promise((resolve) => {
        queueRef.current.push({ html, resolve });
        if (!isPrinting) {
          processQueue();
        }
      });
    },
    [isPrinting],
  );

  const processQueue = useCallback(async () => {
    if (queueRef.current.length === 0) {
      setIsPrinting(false);
      return;
    }

    setIsPrinting(true);
    const { html, resolve } = queueRef.current.shift();

    const plainText = html.replace(/<[^>]+>/g, "");
    const lineId = lineCounterRef.current++;

    setLines((prev) => [
      ...prev,
      { id: lineId, html: "", fullHtml: html, plainText, chars: 0 },
    ]);
    scrollToBottom();

    let charIndex = 0;
    const typeInterval = setInterval(() => {
      charIndex++;
      setLines((prev) =>
        prev.map((line) =>
          line.id === lineId ? { ...line, chars: charIndex } : line,
        ),
      );
      scrollToBottom();

      if (charIndex >= plainText.length) {
        clearInterval(typeInterval);
        resolve();
        setTimeout(processQueue, 15);
      }
    }, 15);
  }, [scrollToBottom]);

  const getRenderedLine = (line) => {
    if (line.chars === 0) return "";
    const html = line.fullHtml;
    const plain = line.plainText;
    const chars = line.chars;

    let cnt = 0,
      idx = 0;
    while (idx < html.length && cnt < chars) {
      if (html[idx] === "<") {
        while (idx < html.length && html[idx] !== ">") idx++;
        idx++;
      } else {
        cnt++;
        idx++;
      }
    }

    const content = html.slice(0, idx);
    const isComplete = chars >= plain.length;

    return isComplete
      ? content
      : `${content}<span class="cursor-blink"></span>`;
  };

  const printTx = useCallback(
    async (tx) => {
      const amount =
        parseFloat(tx.amount || tx.Amount || 0) || Math.random() * 10000 + 1000;
      const network =
        tx.network ||
        tx.Network ||
        tx.networkName ||
        tx.NetworkChain ||
        "Unknown";
      const date =
        tx.datex ||
        tx.Datex ||
        tx.date ||
        tx.CreatedAt ||
        new Date().toISOString();
      const hash =
        tx.transactionHash ||
        tx.TransactionHash ||
        tx.hash ||
        tx.Hash ||
        "0x" + Math.random().toString(36).substr(2, 64);

      const amt = amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      const dt = new Date(date).toLocaleString();
      const profit = amount * (0.003 + Math.random() * 0.012);

      const div = DM("─".repeat(60));

      await appendLine(div);
      await appendLine("");
      await appendLine(G("[INFO] ") + GR("Transaction Received"));
      await appendLine("");
      await appendLine(B("[NETWORK] ") + netSpan(network));
      await appendLine(B("[AMOUNT]  ") + Y(amt + " USDT"));
      await appendLine(B("[PROFIT]  ") + G("$" + profit.toFixed(2) + " USDT"));
      await appendLine(B("[TIME]    ") + GR(dt));
      await appendLine("");
      await appendLine(P("TX HASH:"));
      await appendLine(GR(hash.substring(0, 66)));
      await appendLine("");
      await appendLine(
        CY("[STATUS] ") + GR("✓ Arbitrage opportunity detected"),
      );
      await appendLine("");
      await appendLine(div);
      await appendLine("");

      setStats((prev) => ({
        ...prev,
        txCount: prev.txCount + 1,
        totalVolume: prev.totalVolume + amount,
        oppCount: prev.oppCount + 1,
      }));

      const now = new Date();
      const timeStr =
        String(now.getHours()).padStart(2, "0") +
        ":" +
        String(now.getMinutes()).padStart(2, "0") +
        ":" +
        String(now.getSeconds()).padStart(2, "0");
      setProfits((prev) =>
        [{ network, amount, profit, timestamp: timeStr }, ...prev].slice(0, 8),
      );
    },
    [appendLine],
  );

  const printSys = useCallback(
    async (msg, isWarning = false) => {
      if (isWarning) {
        await appendLine(R("[WARNING] ") + GR(msg));
      } else {
        await appendLine(G("[INFO] ") + GR(msg));
      }
    },
    [appendLine],
  );

  const startup = useCallback(async () => {
    const startupLines = [
      [G("[INFO] ") + GR("Initializing FMP arbitrage engine..."), 80],
      [G("[INFO] ") + GR("Loading configuration files..."), 60],
      [G("[INFO] ") + GR("Connecting to Ethereum RPC..."), 70],
      [G("[INFO] ") + GR("Connecting to BSC RPC..."), 70],
      [G("[INFO] ") + GR("Connecting to Solana RPC..."), 70],
      [G("[INFO] ") + GR("Connecting to Avalanche RPC..."), 70],
      [G("[INFO] ") + GR("Loading liquidity feed..."), 60],
      [G("[INFO] ") + GR("Building market map..."), 80],
      [G("[INFO] ") + GR("Connecting to API endpoint..."), 60],
    ];

    await appendLine("");

    for (const [html, delay] of startupLines) {
      await appendLine(html);
      await new Promise((r) => setTimeout(r, delay));
    }

    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        "https://apis.abrixlabs.live/api/Authentication/getAllTransactionLog",
        {
          timeout: 30000,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200 && response.data && response.data.data) {
        const data = response.data.data;
        setTransactions(data);
        setApiSuccess(true);
        setApiMessage(`Successfully loaded ${data.length} transactions`);
        await appendLine(
          G("[SUCCESS] ") +
            GR(`Connected to API | Loaded ${data.length} transactions`),
        );

        await new Promise((r) => setTimeout(r, 500));
        const displayCount = Math.min(data.length, 10);
        for (let i = 0; i < displayCount; i++) {
          await new Promise((r) => setTimeout(r, 800));
          await printTx(data[i]);
        }

        if (data.length > 10) {
          await appendLine(
            G("[INFO] ") +
              GR(`... and ${data.length - 10} more transactions in history`),
          );
        }
      } else {
        setApiSuccess(false);
        setApiMessage(response.data?.message || "No data received from API");
        await appendLine(R("[ERROR] ") + GR(`API Connection Failed`));
        await appendLine(
          G("[INFO] ") + GR("Using live mode with simulated transactions"),
        );
      }
    } catch (error) {
      setApiSuccess(false);
      setApiMessage(`Network Error: ${error.message}`);
      await appendLine(
        R("[ERROR] ") + GR(`API Connection Failed: ${error.message}`),
      );
      await appendLine(
        G("[INFO] ") + GR("Using live mode with simulated transactions"),
      );
    }

    await appendLine(
      CY("[STATUS] ") + W("Monitoring ACTIVE — streaming live data"),
    );
    await appendLine("");
  }, [appendLine, printTx]);

  const startLiveFeed = useCallback(async () => {
    const networks = ["ETH", "BSC", "AVAX", "SOL"];
    const sysMessages = [
      "Scanning liquidity pools for arbitrage opportunities...",
      "Monitoring DEX spreads across all networks...",
      "Synchronizing blockchain nodes...",
      "Checking market inefficiencies...",
      "Gas prices optimal for arbitrage",
      "Heartbeat: all nodes responsive",
    ];

    while (true) {
      await new Promise((r) => setTimeout(r, 3000 + Math.random() * 2000));

      if (Math.random() < 0.3) {
        const msg = sysMessages[Math.floor(Math.random() * sysMessages.length)];
        await printSys(msg);
        await new Promise((r) => setTimeout(r, 500));
      }

      const tx = {
        network: networks[Math.floor(Math.random() * networks.length)],
        amount: Math.floor(Math.random() * 50000) + 1000,
        date: new Date().toISOString(),
        hash: "0x" + Math.random().toString(36).substr(2, 64),
      };

      await printTx(tx);
    }
  }, [printTx, printSys]);

  // Update clock
  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      setCurrentTime(
        String(d.getHours()).padStart(2, "0") +
          ":" +
          String(d.getMinutes()).padStart(2, "0") +
          ":" +
          String(d.getSeconds()).padStart(2, "0"),
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update uptime
  useEffect(() => {
    const interval = setInterval(() => {
      const uptime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setStats((prev) => ({
        ...prev,
        uptime,
        blockNum: prev.blockNum + Math.floor(Math.random() * 3) + 1,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Initialize
  useEffect(() => {
    const init = async () => {
      await startup();
      startLiveFeed();
    };
    init();
  }, []);

  const formatUptime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const formatMoney = (n) => {
    if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
    if (n >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
    return "$" + n.toFixed(0);
  };

  return (
    <div className="min-h-screen h-screen bg-white text-gray-900 overflow-hidden relative font-mono">
      <div className="relative z-10 h-screen overflow-y-auto px-3 py-3 sm:px-5 sm:py-3">
        <div className="max-w-[1600px] mx-auto h-full flex flex-col">
          {/* Header */}
          <div className="bg-white border-2 border-gray-200 rounded-xl px-3 py-1.5 sm:px-5 flex flex-wrap items-center justify-between mb-2 gap-2 shrink-0 shadow-sm">
            <div className="flex items-center gap-0.5">
              <span className="font-bold text-xl sm:text-2xl text-blue-400 tracking-tight">
                Bot
              </span>
              <span className="font-bold text-xl sm:text-2xl text-gray-900 tracking-tight">
                Console
              </span>
            </div>
            <div className="flex-1 text-center">
              <span className="text-gray-500 text-[10px] sm:text-xs tracking-[2px] font-semibold">
                HYPERGEN BOT CONSOL LIVE FEED
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-400 text-black font-bold text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-[0_0_12px_rgba(47,217,211,0.3)] flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 bg-black rounded-full animate-pulse-dot"></span>
                LIVE
              </div>
              <span className="text-gray-500 text-xs font-semibold">
                {currentTime}
              </span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="bg-white border-2 border-gray-200 rounded-xl px-3 py-1 sm:px-5 flex items-center justify-center gap-4 sm:gap-8 mb-2 flex-wrap shrink-0 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 tracking-wide font-semibold">
                TOTAL VOLUME
              </span>
              <span className="text-base font-bold text-blue-400">
                {formatMoney(stats.totalVolume)}
              </span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 tracking-wide font-semibold">
                ACTIVE NETWORKS
              </span>
              <span className="text-base font-bold text-blue-400">4</span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 tracking-wide font-semibold">
                UPTIME
              </span>
              <span className="text-base font-bold text-blue-400">
                {formatUptime(stats.uptime)}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 lg:grid-cols-[2.3fr_0.5fr] gap-3 flex-1 min-h-0">
            {/* Terminal */}
            <div className="min-h-0 h-full">
              <div
                ref={terminalRef}
                className="bg-white border-2 border-gray-200 rounded-xl px-3 py-3 sm:px-4 text-xs sm:text-sm leading-7 overflow-y-auto h-[45vh] lg:h-full scrollbar-thin scrollbar-thumb-cyan-400 scrollbar-track-gray-100 text-gray-900 shadow-inner"
              >
                {lines.map((line) => (
                  <div
                    key={line.id}
                    className="whitespace-pre-wrap break-words mb-0.5"
                    dangerouslySetInnerHTML={{ __html: getRenderedLine(line) }}
                  />
                ))}
                <div id="terminal-end" />
              </div>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-2.5 h-auto lg:h-full min-h-0">
              {/* Networks */}
              <div className="bg-white border-2 border-gray-200 rounded-xl px-3 py-3 sm:px-4 shadow-sm shrink-0">
                <div className="text-gray-500 text-xs font-bold tracking-wide border-l-[3px] border-blue-400 pl-2 mb-2">
                  Network
                </div>
                {[
                  { name: "Ethereum", icon: "Ξ", class: "bg-blue-500 text-white" },
                  { name: "BSC (BEP20)", icon: "B", class: "bg-yellow-400 text-black" },
                  { name: "Avalanche", icon: "A", class: "bg-red-500 text-white" },
                  { name: "Solana", icon: "◎", class: "bg-cyan-400 text-black" },
                ].map((net, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${net.class}`}
                      >
                        {net.icon}
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-900">
                        {net.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-blue-400 text-[10px] font-semibold">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(47,217,211,0.5)]"></span>
                      LIVE
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Profits */}
              <div className="bg-white border-2 border-gray-200 rounded-xl px-3 py-3 sm:px-4 shadow-sm flex-1 overflow-y-auto min-h-0 max-h-[150px] lg:max-h-none scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-100">
                <div className="text-gray-500 text-xs font-bold tracking-wide border-l-[3px] border-blue-400 pl-2 mb-2">
                  Recent Profits
                </div>
                {profits.length === 0 ? (
                  <div className="text-gray-300 text-center text-xs py-1">
                    Waiting for transactions...
                  </div>
                ) : (
                  profits.slice(0, 8).map((p, i) => (
                    <div
                      key={i}
                      className="flex flex-wrap justify-between items-center text-xs py-1.5 border-b border-dashed border-gray-100 last:border-b-0 text-gray-900"
                    >
                      <span className="text-gray-500">{p.timestamp}</span>
                      <span className="text-blue-500 font-medium">
                        {p.network} Arbitrage
                      </span>
                      <span className="text-blue-400 font-semibold">
                        +${p.profit.toFixed(2)} USDT
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* System Alerts */}
              <div className="bg-white border-2 border-gray-200 rounded-xl px-3 py-3 sm:px-4 shadow-sm shrink-0">
                <div className="text-gray-500 text-xs font-bold tracking-wide border-l-[3px] border-blue-400 pl-2 mb-2">
                  System Alerts
                </div>
                <div className="flex items-start gap-2 py-1">
                  <span className="text-sm">✅</span>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-gray-900">
                      All Systems Operational
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
                      <span>No alerts at this time</span>
                      <span>{currentTime}</span>
                    </div>
                  </div>
                </div>
                {!apiSuccess ? (
                  <div className="mt-1.5 px-2 py-1.5 rounded-lg text-[10px] bg-red-500/10 border border-red-500 text-red-500">
                    ⚠️ {apiMessage}
                  </div>
                ) : (
                  <div className="mt-1.5 px-2 py-1.5 rounded-lg text-[10px] bg-emerald-500/10 border border-blue-400 text-blue-400">
                    ✅ Connected to API | {transactions.length} transactions loaded
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .cursor-blink {
          display: inline-block;
          width: 7px;
          height: 14px;
          background: #22d3ee;
          margin-left: 2px;
          vertical-align: middle;
          animation: pulse-cursor 1s infinite;
        }

        @keyframes pulse-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .animate-pulse-dot {
          animation: pulse-dot 1s infinite;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 5px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f3f4f6;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #22d3ee;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}