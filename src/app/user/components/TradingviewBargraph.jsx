"use client"
import React, { useEffect, useRef, useState, memo } from "react";

const instruments = [
  { name: "Gold", symbol: "OANDA:XAUUSD", icon: "🥇" },
  { name: "Silver", symbol: "OANDA:XAGUSD", icon: "🥈" },
  { name: "Crude Oil", symbol: "TVC:USOIL", icon: "🛢️" },
  { name: "Bitcoin", symbol: "COINBASE:BTCUSD", icon: "₿" },
  { name: "Ethereum", symbol: "COINBASE:ETHUSD", icon: "Ξ" },
  { name: "EUR/USD", symbol: "OANDA:EURUSD", icon: "💵" },
  { name: "GBP/USD", symbol: "OANDA:GBPUSD", icon: "💷" },
  { name: "USD/JPY", symbol: "OANDA:USDJPY", icon: "💴" },
  { name: "Apple", symbol: "NASDAQ:AAPL", icon: "" },
  { name: "Tesla", symbol: "NASDAQ:TSLA", icon: "T" },
  { name: "S&P 500", symbol: "SP:SPX", icon: "📊" },
  { name: "Nasdaq 100", symbol: "NASDAQ:NDX", icon: "📈" },
];

function TradingViewWidget() {
  const container = useRef(null);
  const [activeInstrument, setActiveInstrument] = useState(instruments[0]);

  useEffect(() => {
    if (!container.current) return;

    container.current.innerHTML = "";

    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    widget.style.height = "100%";
    widget.style.width = "100%";
    container.current.appendChild(widget);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      allow_symbol_change: true,
      calendar: false,
      details: false,
      hide_side_toolbar: true,
      hide_top_toolbar: false,
      hide_legend: false,
      hide_volume: false,
      hotlist: false,
      interval: "D",
      locale: "en",
      save_image: true,
      style: "1",
      symbol: activeInstrument.symbol,
      theme: "dark",
      timezone: "Etc/UTC",
      backgroundColor: "#0b0f14",
      gridColor: "rgba(255,255,255,0.06)",
      watchlist: [],
      withdateranges: false,
      compareSymbols: [],
      studies: [],
      autosize: true,
    });
    container.current.appendChild(script);

    return () => {
      if (container.current) {
        container.current.innerHTML = "";
      }
    };
  }, [activeInstrument]);

  return (
    <div className="w-full h-full bg-[#0b0f14] dark:bg-[#0b0f14] rounded-xl overflow-hidden border border-gray-200 dark:border-[rgba(140,200,205,0.16)] flex flex-col">
      {/* Instrument Tabs */}
      <div className="w-full border-b border-gray-200/10 dark:border-white/[0.06] bg-[#0b0f14] dark:bg-[#0b0f14] flex-shrink-0">
        <div className="flex items-center gap-1 px-3 py-2 overflow-x-auto scrollbar-hide">
          {instruments.map((instrument) => {
            const active = activeInstrument.symbol === instrument.symbol;
            return (
              <button
                key={instrument.symbol}
                onClick={() => setActiveInstrument(instrument)}
                className={`
                  group relative flex items-center gap-2 shrink-0 px-3 py-2 rounded-lg text-sm transition-all duration-200
                  ${
                    active
                      ? "bg-white/[0.08] text-white"
                      : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]"
                  }
                `}
              >
                <span
                  className={`text-base transition-transform duration-200 ${
                    active ? "scale-110" : ""
                  }`}
                >
                  {instrument.icon}
                </span>
                <span className={`font-medium ${active ? "text-white" : "text-gray-400"}`}>
                  {instrument.name}
                </span>
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart - takes remaining height */}
      <div
        ref={container}
        className="tradingview-widget-container flex-1"
        style={{
          width: "100%",
          minHeight: "300px",
        }}
      />
    </div>
  );
}

export default memo(TradingViewWidget);