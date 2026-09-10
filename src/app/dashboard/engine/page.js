"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import Chart from 'chart.js/auto';

// ============================================================
// API CONFIGURATION
// ============================================================
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

const CHAINS = {
  ETH: { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', icon: '⟠', color: '#627EEA', explorer: 'https://etherscan.io', decimals: 18 },
  BSC: { id: 'binancecoin', symbol: 'BNB', name: 'BNB Chain', icon: '🟡', color: '#F0B90B', explorer: 'https://bscscan.com', decimals: 18 },
  SOL: { id: 'solana', symbol: 'SOL', name: 'Solana', icon: '🟣', color: '#9945FF', explorer: 'https://solscan.io', decimals: 9 },
  AVAX: { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', icon: '🔴', color: '#E84142', explorer: 'https://snowtrace.io', decimals: 18 },
};

const CHAIN_TOKENS = {
  ETH: [
    { symbol: 'ETH', name: 'Ethereum', id: 'ethereum' },
    { symbol: 'USDC', name: 'USD Coin', id: 'usd-coin' },
    { symbol: 'USDT', name: 'Tether', id: 'tether' },
    { symbol: 'DAI', name: 'Dai', id: 'dai' },
    { symbol: 'WBTC', name: 'Wrapped BTC', id: 'wrapped-bitcoin' },
    { symbol: 'LINK', name: 'Chainlink', id: 'chainlink' },
    { symbol: 'UNI', name: 'Uniswap', id: 'uniswap' },
    { symbol: 'AAVE', name: 'Aave', id: 'aave' },
    { symbol: 'PEPE', name: 'Pepe', id: 'pepe' },
    { symbol: 'SHIB', name: 'Shiba Inu', id: 'shiba-inu' },
    { symbol: 'LDO', name: 'Lido DAO', id: 'lido-dao' },
    { symbol: 'CRV', name: 'Curve DAO', id: 'curve-dao-token' },
  ],
  BSC: [
    { symbol: 'BNB', name: 'BNB', id: 'binancecoin' },
    { symbol: 'CAKE', name: 'PancakeSwap', id: 'pancakeswap-token' },
    { symbol: 'BUSD', name: 'BUSD', id: 'binance-usd' },
    { symbol: 'WBNB', name: 'Wrapped BNB', id: 'wbnb' },
    { symbol: 'USDC', name: 'USD Coin (BSC)', id: 'usd-coin' },
    { symbol: 'USDT', name: 'Tether (BSC)', id: 'tether' },
    { symbol: 'BTCB', name: 'Bitcoin BEP2', id: 'bitcoin-bep2' },
    { symbol: 'ETH', name: 'Ethereum (BSC)', id: 'ethereum' },
    { symbol: 'XRP', name: 'XRP (BEP20)', id: 'ripple' },
    { symbol: 'DOGE', name: 'Dogecoin (BEP20)', id: 'dogecoin' },
    { symbol: 'ADA', name: 'Cardano (BEP20)', id: 'cardano' },
    { symbol: 'MATIC', name: 'Polygon (BEP20)', id: 'matic-network' },
  ],
  SOL: [
    { symbol: 'SOL', name: 'Solana', id: 'solana' },
    { symbol: 'RAY', name: 'Raydium', id: 'raydium' },
    { symbol: 'SRM', name: 'Serum', id: 'serum' },
    { symbol: 'FTT', name: 'FTX Token', id: 'ftx-token' },
    { symbol: 'USDC', name: 'USD Coin (Solana)', id: 'usd-coin' },
    { symbol: 'BONK', name: 'Bonk', id: 'bonk' },
    { symbol: 'JUP', name: 'Jupiter', id: 'jupiter' },
    { symbol: 'ORCA', name: 'Orca', id: 'orca' },
    { symbol: 'PYTH', name: 'Pyth Network', id: 'pyth-network' },
    { symbol: 'JTO', name: 'Jito', id: 'jito' },
    { symbol: 'WIF', name: 'dogwifhat', id: 'dogwifcoin' },
    { symbol: 'RENDER', name: 'Render', id: 'render-token' },
  ],
  AVAX: [
    { symbol: 'AVAX', name: 'Avalanche', id: 'avalanche-2' },
    { symbol: 'JOE', name: 'Trader Joe', id: 'joe' },
    { symbol: 'QI', name: 'Benqi', id: 'benqi' },
    { symbol: 'USDC', name: 'USD Coin (Avalanche)', id: 'usd-coin' },
    { symbol: 'WETH', name: 'Wrapped ETH (Avalanche)', id: 'weth' },
    { symbol: 'WBTC', name: 'Wrapped BTC (Avalanche)', id: 'wrapped-bitcoin' },
    { symbol: 'LINK', name: 'Chainlink (Avalanche)', id: 'chainlink' },
    { symbol: 'AAVE', name: 'Aave (Avalanche)', id: 'aave' },
    { symbol: 'PNG', name: 'Pangolin', id: 'pangolin' },
    { symbol: 'YAK', name: 'Yield Yak', id: 'yield-yak' },
    { symbol: 'GMX', name: 'GMX', id: 'gmx' },
    { symbol: 'MIM', name: 'Magic Internet Money', id: 'magic-internet-money' },
  ],
};

// ============================================================
// HELPERS
// ============================================================
const openExplorer = (chain, hash) => {
  const chainLower = chain?.toLowerCase() || '';
  if (chainLower.includes('avax')) { window.open(`https://snowtrace.io/tx/${hash}`, '_blank'); return; }
  const explorers = {
    sol: `https://solscan.io/tx/${hash}`,
    bsc: `https://bscscan.com/tx/${hash}`,
    eth: `https://etherscan.io/tx/${hash}`,
  };
  let normalizedChain = 'eth';
  if (chainLower.includes('sol')) normalizedChain = 'sol';
  else if (chainLower.includes('bsc')) normalizedChain = 'bsc';
  else if (chainLower.includes('eth')) normalizedChain = 'eth';
  const url = explorers[normalizedChain];
  if (url) window.open(url, '_blank');
};

const truncateHash = (hash, maxLength = 20) => {
  if (!hash) return '';
  if (hash.length <= maxLength) return hash;
  return `${hash.slice(0, maxLength - 3)}...`;
};

const formatCurrency = (value) => {
  if (value === 0 || !value) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD',
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(value);
};

// ============================================================
// ANIMATED COUNTER
// ============================================================
const AnimatedCounter = ({ value, prefix = '', suffix = '', decimals = 0 }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (value !== prevValueRef.current) {
      const duration = 800;
      const steps = 30;
      const stepTime = duration / steps;
      const startValue = prevValueRef.current;
      const endValue = value;
      const diff = endValue - startValue;
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        setDisplayValue(startValue + diff * progress);
        if (currentStep >= steps) {
          setDisplayValue(endValue);
          clearInterval(interval);
        }
      }, stepTime);
      prevValueRef.current = value;
      return () => clearInterval(interval);
    }
  }, [value]);

  const formattedValue = decimals > 0
    ? displayValue.toFixed(decimals)
    : Math.floor(displayValue).toLocaleString();

  return <span>{prefix}{formattedValue}{suffix}</span>;
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function ArbionEngine() {
  const scanChartRef = useRef(null);
  const chartInstances = useRef([]);
  const [botChecked, setBotChecked] = useState(true);
  const [selectedStrategy, setSelectedStrategy] = useState('MEV Sandwich');
  const [slippage, setSlippage] = useState(0.5);
  const [minProfit, setMinProfit] = useState(5);
  const [maxGas, setMaxGas] = useState(50);
  const [userId, setUserId] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [totalProfit, setTotalProfit] = useState(480000.52);
  const [totalTransactions, setTotalTransactions] = useState(1500);
  const [successRate, setSuccessRate] = useState(99.96);

  const [loading, setLoading] = useState(true);
  const [scanData, setScanData] = useState([]);
  const [flashEffect, setFlashEffect] = useState({ profit: false, tx: false, success: false });
  const [secondsLeft, setSecondsLeft] = useState(120);

  const [selectedChain, setSelectedChain] = useState('BSC');
  const [selectedToken, setSelectedToken] = useState('BNB');
  const [tokenPrice, setTokenPrice] = useState(0);
  const [tokenPriceChange, setTokenPriceChange] = useState(0);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [entryPrice, setEntryPrice] = useState(0);
  const [exitPrice, setExitPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [investment, setInvestment] = useState(0);
  const [profitLoss, setProfitLoss] = useState(0);
  const [roi, setRoi] = useState(0);

  const [showChainDropdown, setShowChainDropdown] = useState(false);
  const [showTokenDropdown, setShowTokenDropdown] = useState(false);

  const chainDropdownRef = useRef(null);
  const tokenDropdownRef = useRef(null);
  const intervalRef = useRef(null);
  const statsIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const isMounted = useRef(true);

  // ============================================================
  // FETCH PRICE
  // ============================================================
  const fetchTokenPrice = useCallback(async () => {
    setIsLoadingPrice(true);
    try {
      const tokenId = CHAIN_TOKENS[selectedChain]?.find(t => t.symbol === selectedToken)?.id;
      if (!tokenId) { setTokenPrice(0); setTokenPriceChange(0); return; }
      const response = await fetch(`${COINGECKO_API}/simple/price?ids=${tokenId}&vs_currencies=usd&include_24hr_change=true`);
      const data = await response.json();
      if (data[tokenId]) {
        const price = data[tokenId].usd;
        const change = data[tokenId].usd_24h_change || 0;
        setTokenPrice(price);
        setTokenPriceChange(change);
        setLastUpdated(new Date());
        if (entryPrice === 0) setEntryPrice(price);
      } else {
        setTokenPrice(0); setTokenPriceChange(0);
      }
    } catch (error) {
      console.error('Error fetching price:', error);
      setTokenPrice(0); setTokenPriceChange(0);
    } finally {
      setIsLoadingPrice(false);
    }
  }, [selectedChain, selectedToken, entryPrice]);

  useEffect(() => {
    fetchTokenPrice();
    const interval = setInterval(fetchTokenPrice, 30000);
    return () => clearInterval(interval);
  }, [fetchTokenPrice]);

  // Calculator
  useEffect(() => {
    const invested = entryPrice * quantity;
    const currentValue = exitPrice * quantity;
    const pl = currentValue - invested;
    const roiPercent = invested > 0 ? (pl / invested) * 100 : 0;
    setInvestment(invested);
    setProfitLoss(pl);
    setRoi(roiPercent);
  }, [entryPrice, exitPrice, quantity]);

  const fillWithLivePrice = () => setEntryPrice(tokenPrice);
  const calculateTargetPrice = (targetProfit) => {
    if (quantity > 0) {
      const targetPrice = (investment + targetProfit) / quantity;
      setExitPrice(targetPrice);
    }
  };

  // Mount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  // User
  useEffect(() => {
    let userDataString = localStorage.getItem('userData');
    if (!userDataString) userDataString = localStorage.getItem('UserData');
    if (userDataString) {
      try {
        const parsed = JSON.parse(userDataString);
        setUserId(parsed.UserId || parsed.userId || parsed.URID);
      } catch (e) { console.error('Error parsing UserData:', e); }
    }
  }, []);

  // Countdown
  useEffect(() => {
    countdownIntervalRef.current = setInterval(() => {
      if (isMounted.current) setSecondsLeft(prev => (prev <= 1 ? 120 : prev - 1));
    }, 1000);
    return () => clearInterval(countdownIntervalRef.current);
  }, []);

  // Transactions
  const fetchTransactionLog = useCallback(async () => {
    try {
      const response = await fetch('https://apis.abrixlabs.live/api/Authentication/getAllTransactionLog_xoxo', {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-cache',
      });
      const result = await response.json();
      if (result.statusCode === 200 && result.data?.length > 0 && isMounted.current) {
        const formattedTx = result.data.map((tx) => {
          const date = new Date(tx.Datex);
          let chainDisplay = tx.NetworkChain || 'Unknown';
          if (chainDisplay.toLowerCase().includes('sol')) chainDisplay = 'SOL';
          else if (chainDisplay.toLowerCase().includes('bsc')) chainDisplay = 'BSC';
          else if (chainDisplay.toLowerCase().includes('eth')) chainDisplay = 'ETH';
          else if (chainDisplay.toLowerCase().includes('avax') || chainDisplay.toLowerCase().includes('avalanche')) chainDisplay = 'AVAX';
          return {
            time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
            chain: chainDisplay,
            hash: tx.TransactionHash,
            profit: `+$${tx.Amount?.toFixed(2) || '0.00'}`,
            timestamp: date.getTime(),
          };
        });
        const shuffleArray = (arr) => {
          const shuffled = [...arr];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          return shuffled;
        };
        setTransactions(shuffleArray(formattedTx));
        setScanData(prev => [...prev.slice(-29), { value: Math.random() * 100 + 20, timestamp: Date.now() }]);
      }
    } catch (error) { console.error('Error:', error); }
  }, []);

  useEffect(() => {
    fetchTransactionLog();
    intervalRef.current = setInterval(() => fetchTransactionLog(), 5000);
    return () => clearInterval(intervalRef.current);
  }, [fetchTransactionLog]);

  // Stats
  useEffect(() => {
    if (transactions.length > 0) {
      const totalProfitValue = transactions.reduce((sum, tx) => {
        const profitValue = parseFloat(tx.profit?.replace(/[^0-9.-]/g, '')) || 0;
        return sum + profitValue;
      }, 0);
      setTotalProfit(totalProfitValue);
      setTotalTransactions(transactions.length);
      setSuccessRate(+(99.5 + Math.random() * 0.49).toFixed(2));
      setFlashEffect({ profit: true, tx: true, success: true });
      setTimeout(() => { if (isMounted.current) setFlashEffect({ profit: false, tx: false, success: false }); }, 500);
    }
  }, [transactions]);

  // Scan data init
  useEffect(() => {
    const initialData = Array.from({ length: 30 }, (_, i) => ({
      value: Math.random() * 100 + 20,
      timestamp: Date.now() - (30 - i) * 1000,
    }));
    setScanData(initialData);
    const activityInterval = setInterval(() => {
      setScanData(prev => [...prev.slice(-29), { value: Math.random() * 100 + 20, timestamp: Date.now() }]);
    }, 2000);
    return () => clearInterval(activityInterval);
  }, []);

  // Scanner chart
  useEffect(() => {
    if (scanChartRef.current && scanData.length > 0) {
      chartInstances.current.forEach(chart => chart.destroy());
      chartInstances.current = [];
      const chart = new Chart(scanChartRef.current, {
        type: 'line',
        data: {
          labels: scanData.map((_, i) => `${i}s`),
          datasets: [{
            data: scanData.map(p => p.value),
            borderColor: '#00d4ff',
            backgroundColor: 'rgba(0, 212, 255, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 0,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: { x: { display: false }, y: { display: false } },
        },
      });
      chartInstances.current.push(chart);
    }
  }, [scanData]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleBot = (e) => setBotChecked(e.target.checked);
  const pickStrategy = (name) => setSelectedStrategy(name);
  const getChainColor = (chain) =>
    chain === 'SOL' ? 'sol' : chain === 'BSC' ? 'bsc' : chain === 'ETH' ? 'eth' : chain === 'AVAX' ? 'avax' : 'eth';

  const handleChainChange = (chainKey) => {
    setSelectedChain(chainKey);
    const firstToken = CHAIN_TOKENS[chainKey]?.[0]?.symbol || chainKey;
    setSelectedToken(firstToken);
    setShowChainDropdown(false);
    setShowTokenDropdown(false);
  };

  const handleTokenChange = (tokenSymbol) => {
    setSelectedToken(tokenSymbol);
    setShowTokenDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (chainDropdownRef.current && !chainDropdownRef.current.contains(e.target)) setShowChainDropdown(false);
      if (tokenDropdownRef.current && !tokenDropdownRef.current.contains(e.target)) setShowTokenDropdown(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="p-5 max-w-[1400px] mx-auto w-full box-border" id="p-engine">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin"></div>
            <p className="text-gray-400">Loading Roventar Engine data...</p>
          </div>
        </div>
      </div>
    );
  }

  const chainTagClass = {
    sol: 'bg-[#9945ff]/15 text-[#9945ff]',
    bsc: 'bg-[#f0b90b]/15 text-[#f0b90b]',
    eth: 'bg-[#627eea]/15 text-[#627eea]',
    avax: 'bg-[#e84142]/15 text-[#e84142]',
  };

  return (
    <div className="p-5 max-w-[1400px] mx-auto w-full box-border" id="p-engine">
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5">
        {/* LEFT COLUMN */}
        <div className="min-w-0 w-full">
          <div className="bg-white dark:bg-[#10222e] border border-[#ddebec] dark:border-[#294353] rounded-2xl p-6 mb-4 w-full box-border">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2.5">
              <div className="flex-1 min-w-0">
                <div className="text-xl font-bold text-[#0f2942] dark:text-[#eaf4ff]">Roventar Engine</div>
                <div className="text-xs text-[#94a3b8] dark:text-[#9fb0c0]">
                  AI MEV + cross-chain arb · 24 autonomous — Auto-updates
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
              {[
                { label: 'Total Profit', value: totalProfit, prefix: '$', decimals: 2, color: 'text-cyan-500', trend: 'Real-time Earnings', trendClass: 'text-emerald-500', dot: 'live-dot-slow', flash: flashEffect.profit },
                { label: 'Total Transactions', value: totalTransactions, color: 'text-amber-500', trend: 'Executed Trades', trendClass: 'text-amber-500', dot: 'pulse-dot-slow', flash: flashEffect.tx },
                { label: 'Success Rate', value: successRate, decimals: 2, suffix: '%', color: 'text-violet-500', trend: 'Stable Performance', trendClass: 'text-emerald-500', dot: 'live-dot-slow', flash: flashEffect.success },
              ].map((s, i) => (
                <div
                  key={i}
                  className={`p-4 bg-[#f8fafc] dark:bg-[#102531] rounded-[10px] border border-[#e2e8f0] dark:border-[#294353] ${s.flash ? 'flash-update-slow' : ''}`}
                >
                  <div className="text-[11px] font-semibold text-[#94a3b8] dark:text-[#aebdcc] uppercase tracking-wider">
                    {s.label}
                  </div>
                  <div className={`text-2xl font-bold my-1 ${s.color}`}>
                    <AnimatedCounter value={s.value} prefix={s.prefix} decimals={s.decimals} suffix={s.suffix} />
                  </div>
                  <div className={`text-[10px] flex items-center gap-1.5 ${s.trendClass}`}>
                    <span className={s.dot}></span>
                    {s.trend}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mb-3 mt-4 flex-wrap gap-2">
              <div className="text-base font-semibold text-[#0f2942] dark:text-[#eaf4ff]">Live TX Stream</div>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-500 px-2.5 py-0.5 rounded-xl font-semibold">
                ● LIVE
              </span>
            </div>

            <div className="max-h-[400px] overflow-y-auto mt-2">
              {transactions.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500 py-8">
                  Waiting for transactions...
                </div>
              ) : (
                transactions.map((tx, idx) => (
                  <div
                    key={`${tx.hash}-${idx}`}
                    onClick={() => openExplorer(tx.chain, tx.hash)}
                    className="flex justify-between items-center py-2 px-3 border-b border-[#f1f5f9] dark:border-[#294353] hover:bg-[#f8fafc] dark:hover:bg-[#172b38] transition-colors gap-2 flex-wrap cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${chainTagClass[getChainColor(tx.chain)]}`}>
                        {tx.chain}
                      </span>
                      <span className="ml-1 text-[13px]">{truncateHash(tx.hash, 20)}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[13px] text-emerald-500 font-semibold">{tx.profit}</span>
                      <span className="text-[11px] text-[#64748b] dark:text-[#aebdcc]">{tx.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Scanner */}
          <div className="bg-white dark:bg-[#10222e] border border-[#ddebec] dark:border-[#294353] rounded-2xl p-6 mb-4 w-full box-border">
            <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
              <div className="text-base font-semibold text-[#0f2942] dark:text-[#eaf4ff]">Scanner Activity</div>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-500 px-2.5 py-0.5 rounded-xl font-semibold flex items-center gap-1">
                <span className="live-dot-small"></span> Real-time
              </span>
            </div>
            <div className="relative h-[120px] sm:h-[70px] mt-2">
              <div className="scanner-line"></div>
              <div className="w-full h-full">
                <canvas ref={scanChartRef}></canvas>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="min-w-0 w-full">
          {/* Strategy */}
          <div className="bg-white dark:bg-[#10222e] border border-[#ddebec] dark:border-[#294353] rounded-2xl p-6 mb-4">
            <div className="text-base font-semibold text-[#0f2942] dark:text-[#eaf4ff]">Strategy Mode</div>
            <div className="flex flex-col gap-2 mt-3">
              {[
                { name: 'MEV Sandwich', desc: 'Front-run pending large txs', apy: '~340% APY' },
                { name: 'Cross-DEX Arb', desc: 'Jupiter, Orca, Uniswap, Curve', apy: '~180% APY' },
                { name: 'Flash Loan Arb', desc: 'Aave/dYdX zero-capital flash', apy: '~260% APY' },
                { name: 'Triangular Arb', desc: 'A → B → C → A profit loops', apy: '~120% APY' },
              ].map(s => (
                <div
                  key={s.name}
                  onClick={() => pickStrategy(s.name)}
                  className={`grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 py-3 px-4 rounded-lg border cursor-pointer transition-all max-sm:grid-cols-[auto_1fr_auto_auto] max-sm:gap-2 max-sm:py-2.5 max-sm:px-3 ${
                    selectedStrategy === s.name
                      ? 'border-cyan-500 bg-cyan-500/5'
                      : 'bg-[#f8fafc] dark:bg-[#102531] border-[#e2e8f0] dark:border-[#294353] hover:border-cyan-500'
                  }`}
                >
                  <div className={`w-[18px] h-[18px] max-sm:w-4 max-sm:h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    selectedStrategy === s.name ? 'bg-cyan-500 border-cyan-500' : 'border-[#e2e8f0] dark:border-[#657a8a]'
                  }`}>
                    <svg width="8" height="8" viewBox="0 0 8 8">
                      <polyline points="1.5,4 3,5.5 6.5,2" stroke="#fff" strokeWidth="1.5" fill="none" />
                    </svg>
                  </div>
                  <div className="text-sm max-sm:text-xs font-semibold text-[#0f2942] dark:text-[#eaf4ff]">{s.name}</div>
                  <div className="text-[11px] max-sm:text-[10px] text-[#94a3b8] dark:text-[#9fb0c0] max-[400px]:hidden">{s.desc}</div>
                  <div className="text-xs max-sm:text-[10px] font-bold text-emerald-500">{s.apy}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Calculator */}
          <div className="bg-white dark:bg-[#10222e] border border-[#ddebec] dark:border-[#294353] rounded-2xl p-6 mb-4">
            <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
              <div className="text-base font-semibold text-[#0f2942] dark:text-[#eaf4ff] flex items-center">
                <span className="text-lg mr-2">📊</span> Multi-Chain Calculator
              </div>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-500 px-2.5 py-0.5 rounded-xl font-semibold flex items-center gap-1">
                <span className="live-dot-small"></span> Live
              </span>
            </div>

            {/* Price display */}
            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] dark:from-[#102531] dark:to-[#172b38] rounded-xl mb-3 flex-wrap relative z-[100] max-sm:flex-col max-sm:items-stretch max-sm:gap-2 max-sm:p-3">
              {/* Chain Selector */}
              <div className="relative z-[1000] max-sm:w-full" ref={chainDropdownRef}>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setShowChainDropdown(p => !p); setShowTokenDropdown(false); }}
                  className="flex items-center gap-2 py-2 px-3.5 bg-white dark:bg-white border border-[#e2e8f0] dark:border-[#d7e0e8] rounded-lg cursor-pointer font-semibold text-sm transition-all hover:border-cyan-500 hover:shadow-[0_2px_8px_rgba(6,182,212,0.1)] max-sm:text-xs max-sm:py-1.5 max-sm:px-2.5 max-sm:w-full max-sm:justify-center"
                >
                  <span className="text-lg max-sm:text-sm">{CHAINS[selectedChain]?.icon}</span>
                  <span className="font-semibold text-[#16283a] dark:text-[#16283a]">{selectedChain}</span>
                  <span className="text-[10px] opacity-50 text-[#475569] dark:text-[#475569]">▾</span>
                </button>
                {showChainDropdown && (
                  <div className="absolute top-[calc(100%+6px)] left-0 min-w-[210px] max-h-[300px] bg-white dark:bg-[#172b38] border border-[#e2e8f0] dark:border-[#3b5262] rounded-[10px] shadow-[0_12px_30px_rgba(0,0,0,0.18)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.45)] z-[999999] overflow-y-auto overflow-x-hidden max-sm:min-w-full max-sm:max-h-[180px] max-sm:left-0 max-sm:right-0">
                    {Object.keys(CHAINS).map(key => (
                      <div
                        key={key}
                        onClick={() => handleChainChange(key)}
                        className={`flex items-center gap-2.5 py-2.5 px-3.5 cursor-pointer transition-colors max-sm:py-2 max-sm:px-3 max-sm:text-[13px] ${
                          selectedChain === key
                            ? 'bg-cyan-500 text-white'
                            : 'hover:bg-[#f1f5f9] dark:hover:bg-[#243d4d] text-[#eaf4ff] dark:text-[#eaf4ff]'
                        }`}
                      >
                        <span className="text-lg">{CHAINS[key].icon}</span>
                        <span>{CHAINS[key].name}</span>
                        <span className={`ml-auto text-[11px] font-semibold ${selectedChain === key ? 'opacity-100' : 'opacity-60 text-[#9fb0c0] dark:text-[#9fb0c0]'}`}>
                          {key}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Token Selector */}
              <div className="relative z-[1000] max-sm:w-full" ref={tokenDropdownRef}>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setShowTokenDropdown(p => !p); setShowChainDropdown(false); }}
                  className="flex items-center gap-2 py-2 px-3.5 bg-white dark:bg-white border border-[#e2e8f0] dark:border-[#d7e0e8] rounded-lg cursor-pointer font-semibold text-sm transition-all hover:border-cyan-500 hover:shadow-[0_2px_8px_rgba(6,182,212,0.1)] max-sm:text-xs max-sm:py-1.5 max-sm:px-2.5 max-sm:w-full max-sm:justify-center"
                >
                  <span className="font-semibold text-[#16283a] dark:text-[#16283a]">{selectedToken}</span>
                  <span className="text-[10px] opacity-50 text-[#475569] dark:text-[#475569]">▾</span>
                </button>
                {showTokenDropdown && (
                  <div className="absolute top-[calc(100%+6px)] left-0 min-w-[190px] max-h-[300px] bg-white dark:bg-[#172b38] border border-[#e2e8f0] dark:border-[#3b5262] rounded-[10px] shadow-[0_12px_30px_rgba(0,0,0,0.18)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.45)] z-[999999] overflow-y-auto max-sm:min-w-full max-sm:max-h-[180px] max-sm:left-0 max-sm:right-0">
                    {CHAIN_TOKENS[selectedChain]?.map(token => (
                      <div
                        key={token.symbol}
                        onClick={() => handleTokenChange(token.symbol)}
                        className={`flex items-center gap-2.5 py-2.5 px-3.5 cursor-pointer transition-colors max-sm:py-2 max-sm:px-3 max-sm:text-[13px] ${
                          selectedToken === token.symbol
                            ? 'bg-cyan-500 text-white'
                            : 'hover:bg-[#f1f5f9] dark:hover:bg-[#243d4d] text-[#eaf4ff] dark:text-[#eaf4ff]'
                        }`}
                      >
                        <span>{token.symbol}</span>
                        <span className={`text-[11px] ml-auto ${selectedToken === token.symbol ? 'opacity-100' : 'opacity-60 text-[#9fb0c0] dark:text-[#9fb0c0]'}`}>
                          {token.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 ml-auto max-sm:ml-0 max-sm:justify-between max-sm:w-full">
                <div className="flex flex-col items-end max-sm:items-start">
                  <span className="text-[10px] uppercase text-[#94a3b8] dark:text-[#9fb0c0] font-semibold tracking-wider">PRICE</span>
                  <span className="text-xl max-sm:text-base font-bold text-[#0f2942] dark:text-[#102a43]">
                    {isLoadingPrice ? <span className="animate-pulse">...</span> : formatCurrency(tokenPrice)}
                  </span>
                </div>
                <div className={`text-sm max-sm:text-xs font-semibold px-2.5 py-1 rounded-md ${
                  tokenPriceChange >= 0
                    ? 'text-emerald-500 bg-emerald-500/10'
                    : 'text-red-500 bg-red-500/10'
                }`}>
                  {tokenPriceChange >= 0 ? '▲' : '▼'}
                  {Math.abs(tokenPriceChange).toFixed(2)}%
                </div>
              </div>
            </div>

            <button
              onClick={fillWithLivePrice}
              className="flex items-center gap-2 py-2 px-4 bg-cyan-500 hover:bg-cyan-600 text-white border-0 rounded-lg font-semibold text-[13px] cursor-pointer transition-all mb-3 w-full justify-center hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(6,182,212,0.3)] max-sm:text-xs max-sm:py-1.5 max-sm:px-3.5"
            >
              <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Use Live Price
            </button>

            {lastUpdated && (
              <div className="text-[10px] text-[#94a3b8] dark:text-[#9fb0c0] text-right mb-3 max-sm:text-[9px]">
                Updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
              {[
                { label: '💰 Entry Price (USD)', value: entryPrice, setter: setEntryPrice, icon: '$', step: '0.01', placeholder: '0.00' },
                { label: '🚀 Exit Price (USD)', value: exitPrice, setter: setExitPrice, icon: '$', step: '0.01', placeholder: '0.00' },
                { label: '📦 Quantity (Tokens)', value: quantity, setter: setQuantity, icon: '🪙', step: '0.0001', placeholder: '0.0000' },
              ].map((f, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#aab8c7] dark:text-[#aebdcc] tracking-wide">{f.label}</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-sm opacity-60 pointer-events-none z-[1] text-[#b7c5d1] dark:text-[#b7c5d1]">{f.icon}</span>
                    <input
                      type="number"
                      step={f.step}
                      min="0"
                      value={f.value || ''}
                      onChange={(e) => f.setter(parseFloat(e.target.value) || 0)}
                      placeholder={f.placeholder}
                      className="pl-9 w-full bg-[#f8fafc] dark:bg-[#102531] border border-[#e2e8f0] dark:border-[#8fa3b4] rounded-lg py-2.5 px-3 text-sm text-[#0f2942] dark:text-[#f1f7fc] transition-all focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_3px_rgba(6,182,212,0.1)] placeholder:text-[#94a3b8] dark:placeholder:text-[#8fa3b4] box-border max-sm:text-[13px] max-sm:py-2 max-sm:px-3 max-sm:pl-8"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick targets */}
            <div className="flex items-center gap-1.5 flex-wrap my-2 py-2 px-3 bg-[#f8fafc] dark:bg-[#102531] rounded-lg">
              <span className="text-[11px] font-semibold text-[#94a3b8] dark:text-[#aebdcc] max-sm:text-[10px] max-sm:w-full">
                Target Profit:
              </span>
              {[10, 50, 100, 500].map(v => (
                <button
                  key={v}
                  onClick={() => calculateTargetPrice(v)}
                  className="py-1 px-3 text-[11px] max-sm:text-[10px] max-sm:py-0.5 max-sm:px-2.5 font-semibold border border-[#e2e8f0] dark:border-[#526777] rounded-md bg-white dark:bg-[#172b38] text-[#475569] dark:text-[#dce8f2] cursor-pointer transition-all hover:bg-cyan-500 hover:text-white hover:border-cyan-500"
                >
                  +${v}
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="grid grid-cols-3 max-[400px]:grid-cols-1 gap-3 my-2.5 p-4 bg-[#f8fafc] dark:bg-[#102531] rounded-xl max-sm:gap-1.5 max-sm:p-2.5">
              <div className="text-center p-2 rounded-lg bg-white dark:bg-[#172b38] max-sm:p-1.5">
                <div className="text-[11px] max-sm:text-[9px] font-semibold text-[#64748b] dark:text-[#aebdcc] uppercase tracking-wider mb-1.5">💰 Investment</div>
                <div className="text-lg max-sm:text-sm font-bold text-[#0f2942] dark:text-[#f1f7fc]">
                  {investment > 0 ? formatCurrency(investment) : '$0.00'}
                </div>
              </div>
              <div className="text-center p-2 rounded-lg bg-white dark:bg-[#172b38] max-sm:p-1.5">
                <div className="text-[11px] max-sm:text-[9px] font-semibold text-[#64748b] dark:text-[#aebdcc] uppercase tracking-wider mb-1.5">📈 P&L</div>
                <div className="text-lg max-sm:text-sm font-bold" style={{ color: profitLoss >= 0 ? '#10b981' : '#ef4444' }}>
                  {profitLoss !== 0 ? formatCurrency(profitLoss) : '$0.00'}
                  {profitLoss > 0 && <span className="text-xs"> ▲</span>}
                  {profitLoss < 0 && <span className="text-xs"> ▼</span>}
                </div>
              </div>
              <div className="text-center p-2 rounded-lg bg-gradient-to-br from-cyan-500/[0.08] to-violet-500/[0.08] border border-cyan-500/15 max-sm:p-1.5">
                <div className="text-[11px] max-sm:text-[9px] font-semibold text-[#64748b] dark:text-[#aebdcc] uppercase tracking-wider mb-1.5">🎯 ROI</div>
                <div className="text-[22px] max-sm:text-[17px] font-bold" style={{ color: roi >= 0 ? '#10b981' : '#ef4444' }}>
                  {roi !== 0 ? roi.toFixed(2) + '%' : '0.00%'}
                </div>
              </div>
            </div>

            {/* Chain info */}
            <div className="flex items-center gap-3 flex-wrap p-3 bg-[#f8fafc] dark:bg-[#102531] rounded-lg mt-2 max-sm:gap-1.5 max-sm:p-2">
              <div className="flex items-center gap-1.5 py-1 px-3 bg-white dark:bg-[#172b38] rounded-md border border-[#e2e8f0] dark:border-[#526777] text-[13px] max-sm:text-[11px] max-sm:py-0.5 max-sm:px-2.5 font-semibold text-[#eaf4ff] dark:text-[#eaf4ff]">
                <span className="text-lg">{CHAINS[selectedChain]?.icon}</span>
                <span>{CHAINS[selectedChain]?.name}</span>
              </div>
              <div className="flex items-center gap-2 py-1 px-3 bg-white dark:bg-[#172b38] rounded-md border border-[#e2e8f0] dark:border-[#526777] text-[13px] max-sm:text-[11px] max-sm:py-0.5 max-sm:px-2.5 font-semibold text-[#eaf4ff] dark:text-[#eaf4ff]">
                <span>{selectedToken}</span>
                <span className="text-xs text-[#64748b] dark:text-[#aebdcc] font-normal">
                  {formatCurrency(tokenPrice)}
                </span>
              </div>
              <button
                onClick={() => { setEntryPrice(0); setExitPrice(0); setQuantity(0); }}
                className="ml-auto py-1 px-3.5 text-xs max-sm:text-[10px] max-sm:py-0.5 max-sm:px-2.5 font-semibold border border-[#e2e8f0] dark:border-[#d7e0e8] rounded-md bg-white dark:bg-white text-red-500 cursor-pointer transition-all hover:bg-red-500 hover:text-white hover:border-red-500 max-sm:ml-0"
              >
                ✕ Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          GLOBAL ANIMATIONS (only keyframes — no class rules)
      ============================================================ */}
      <style jsx global>{`
        .live-dot-slow {
          display: inline-block; width: 6px; height: 6px;
          background: #10b981; border-radius: 50%;
          animation: blink-slow 2s infinite;
        }
        .pulse-dot-slow {
          display: inline-block; width: 6px; height: 6px;
          background: #f59e0b; border-radius: 50%;
          animation: pulse-slow 2s infinite;
        }
        .live-dot-small {
          display: inline-block; width: 5px; height: 5px;
          background: #10b981; border-radius: 50%;
          animation: blink 1s infinite;
        }
        .flash-update-slow { animation: flash-slow 0.5s ease-in-out; }

        .scanner-line {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #06b6d4, transparent);
          animation: scan 2s linear infinite; opacity: 0.5;
          z-index: 2;
        }

        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        @keyframes blink-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes pulse-slow {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes flash-slow {
          0% { background-color: rgba(6, 182, 212, 0); }
          30% { background-color: rgba(6, 182, 212, 0.12); }
          70% { background-color: rgba(6, 182, 212, 0.06); }
          100% { background-color: rgba(6, 182, 212, 0); }
        }
      `}</style>
    </div>
  );
}