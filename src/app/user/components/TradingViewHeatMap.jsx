"use client";

import { useEffect, useRef } from "react";

function TradingViewHeatmap() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && containerRef.current) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-forex-heat-map.js';
      script.async = true;
      script.type = 'text/javascript';
      script.innerHTML = JSON.stringify({
        "width": "100%",
        "height": "100%",
        "currencies": [
          "EUR",
          "USD",
          "JPY",
          "GBP",
          "AUD",
          "CAD",
          "CHF",
          "NZD",
          "CNY"
        ],
        "colorTheme": "dark",
        "locale": "en"
      });

      containerRef.current.appendChild(script);

      return () => {
        if (containerRef.current && containerRef.current.contains(script)) {
          containerRef.current.removeChild(script);
        }
      };
    }
  }, []);

  return (
    <div className="tradingview-widget-container" style={{ height: "100%", width: "100%" }}>
      <div ref={containerRef} className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
    </div>
  );
}

export default TradingViewHeatmap;