"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { getRequestWithToken, getUserId } from '@/app/api/auth';
import TradingViewWidget from '@/app/user/components/Tradeview';

export default function ArbionEngine() {
  const pnlChartRef = useRef(null);
  const dailyChartRef = useRef(null);
  const chainChartRef = useRef(null);
  const chartInstances = useRef([]);

  const [tradeHistory, setTradeHistory] = useState([]);
  const [loadingTrades, setLoadingTrades] = useState(false);
  const [tradeError, setTradeError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Date formatter function - returns "2/9/26" format
  const formatChartDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  // Derive chart data from trade history
  const chartData = useMemo(() => {
    if (!tradeHistory || tradeHistory.length === 0) {
      return {
        pnlData: Array.from({ length: 90 }, (_, i) => i * 91.57),
        pnlLabels: Array.from({ length: 90 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (89 - i));
          return formatChartDate(d);
        }),
        dailyData: Array.from({ length: 30 }, () => Math.floor(60 + Math.random() * 280)),
        dailyLabels: Array.from({ length: 30 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (29 - i));
          return formatChartDate(d);
        }),
        chainData: { solana: 52, ethereum: 31, bsc: 17 }
      };
    }

    const sortedTrades = [...tradeHistory].sort((a, b) => {
      return new Date(a.TradeDate) - new Date(b.TradeDate);
    });

    const dailyGroups = {};
    sortedTrades.forEach((trade) => {
      const date = new Date(trade.TradeDate);
      const dateKey = date.toISOString().split('T')[0];
      if (!dailyGroups[dateKey]) {
        dailyGroups[dateKey] = {
          date: date,
          trades: [],
          totalProfit: 0,
          totalPnL: 0
        };
      }
      dailyGroups[dateKey].trades.push(trade);
      dailyGroups[dateKey].totalProfit += parseFloat(trade.Profit) || 0;
      dailyGroups[dateKey].totalPnL += parseFloat(trade.PNL) || 0;
    });

    const sortedDates = Object.keys(dailyGroups).sort();

    const pnlData = [];
    const pnlLabels = [];
    let cumulativePnL = 0;

    const recentDates = sortedDates.slice(-90);
    recentDates.forEach((dateKey) => {
      const dayData = dailyGroups[dateKey];
      cumulativePnL += dayData.totalPnL;
      pnlData.push(cumulativePnL);
      pnlLabels.push(formatChartDate(dayData.date));
    });

    while (pnlData.length < 90) {
      const dummyDate = new Date();
      dummyDate.setDate(dummyDate.getDate() - (90 - pnlData.length));
      pnlData.unshift(pnlData[0] || 0);
      pnlLabels.unshift(formatChartDate(dummyDate));
    }

    const dailyData = [];
    const dailyLabels = [];
    const last30Dates = sortedDates.slice(-30);

    last30Dates.forEach((dateKey) => {
      const dayData = dailyGroups[dateKey];
      dailyData.push(dayData.totalProfit);
      dailyLabels.push(formatChartDate(dayData.date));
    });

    while (dailyData.length < 30) {
      const dummyDate = new Date();
      dummyDate.setDate(dummyDate.getDate() - (30 - dailyData.length));
      dailyData.unshift(0);
      dailyLabels.unshift(formatChartDate(dummyDate));
    }

    const chainDistribution = { Solana: 0, Ethereum: 0, BSC: 0 };
    sortedTrades.forEach((trade) => {
      const market = trade.Market || '';
      const profit = Math.abs(parseFloat(trade.Profit)) || 0;
      if (market.toLowerCase().includes('solana')) {
        chainDistribution.Solana += profit;
      } else if (market.toLowerCase().includes('ethereum') || market.toLowerCase().includes('eth')) {
        chainDistribution.Ethereum += profit;
      } else if (market.toLowerCase().includes('bsc') || market.toLowerCase().includes('binance')) {
        chainDistribution.BSC += profit;
      }
    });

    const totalChain = chainDistribution.Solana + chainDistribution.Ethereum + chainDistribution.BSC || 1;
    const chainPercentages = {
      solana: Math.round((chainDistribution.Solana / totalChain) * 100),
      ethereum: Math.round((chainDistribution.Ethereum / totalChain) * 100),
      bsc: Math.round((chainDistribution.BSC / totalChain) * 100)
    };

    const total = chainPercentages.solana + chainPercentages.ethereum + chainPercentages.bsc;
    if (total !== 100 && total > 0) {
      const diff = 100 - total;
      chainPercentages.solana += diff;
    }

    return {
      pnlData: pnlData.slice(-90),
      pnlLabels: pnlLabels.slice(-90),
      dailyData: dailyData.slice(-30),
      dailyLabels: dailyLabels.slice(-30),
      chainData: chainPercentages
    };
  }, [tradeHistory]);

  const metrics = useMemo(() => {
    if (!tradeHistory || tradeHistory.length === 0) {
      return {
        totalProfit: 8241,
        realizedPnL: 6847,
        totalTrades: 12847,
        winLoss: { wins: 1190, losses: 107 },
        avgProfit: 0.64,
        profitChange: 0.08,
        winRate: 91.8
      };
    }

    const totalProfit = tradeHistory.reduce((sum, trade) => {
      return sum + (parseFloat(trade.TotalProfit) || 0);
    }, 0);

    const realizedPnL = tradeHistory.reduce((sum, trade) => {
      const profit = parseFloat(trade.Profit) || 0;
      if (profit > 0) return sum + profit;
      return sum;
    }, 0);

    const totalTrades = tradeHistory.length;
    const wins = tradeHistory.filter(trade => parseFloat(trade.Profit) > 0).length;
    const losses = tradeHistory.filter(trade => parseFloat(trade.Profit) < 0).length;
    const avgProfit = totalTrades > 0 ? totalProfit / totalTrades : 0;

    const sortedByDate = [...tradeHistory].sort((a, b) => {
      return new Date(a.TradeDate) - new Date(b.TradeDate);
    });
    const firstProfit = sortedByDate.length > 0 ? parseFloat(sortedByDate[0].Profit) || 0 : 0;
    const lastProfit = sortedByDate.length > 0 ? parseFloat(sortedByDate[sortedByDate.length - 1].Profit) || 0 : 0;
    const profitChange = lastProfit - firstProfit;
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

    return {
      totalProfit: Math.round(totalProfit * 100) / 100,
      realizedPnL: Math.round(realizedPnL * 100) / 100,
      totalTrades,
      winLoss: { wins, losses },
      avgProfit: Math.round(avgProfit * 100) / 100,
      profitChange: Math.round(profitChange * 100) / 100,
      winRate: Math.round(winRate * 100) / 100
    };
  }, [tradeHistory]);

  const totalPnL = useMemo(() => {
    if (!tradeHistory || tradeHistory.length === 0) return 8241;
    return tradeHistory.reduce((sum, trade) => {
      return sum + (parseFloat(trade.Profit) || 0);
    }, 0);
  }, [tradeHistory]);

  useEffect(() => {
    chartInstances.current.forEach(chart => chart.destroy());
    chartInstances.current = [];

    if (pnlChartRef.current && chartData.pnlData) {
      const chart = new Chart(pnlChartRef.current, {
        type: 'line',
        data: {
          labels: chartData.pnlLabels,
          datasets: [{
            label: 'Cumulative PnL %',
            data: chartData.pnlData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `PnL: ${context.parsed.y.toFixed(2)}%`;
                }
              }
            }
          },
          scales: {
            x: { ticks: { maxTicksLimit: 10, font: { size: 9 } } },
            y: {
              ticks: {
                callback: function(value) { return value + '%'; }
              }
            }
          }
        }
      });
      chartInstances.current.push(chart);
    }

    if (dailyChartRef.current && chartData.dailyData) {
      const chart = new Chart(dailyChartRef.current, {
        type: 'bar',
        data: {
          labels: chartData.dailyLabels,
          datasets: [{
            label: 'Daily Profit ($)',
            data: chartData.dailyData,
            backgroundColor: chartData.dailyData.map(value =>
              value >= 0 ? 'rgba(16, 185, 129, 0.7)' : 'rgba(239, 68, 68, 0.7)'
            ),
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `Profit: $${context.parsed.y.toFixed(2)}`;
                }
              }
            }
          },
          scales: {
            x: { ticks: { maxTicksLimit: 10, font: { size: 9 } } },
            y: {
              ticks: {
                callback: function(value) { return '$' + value; }
              }
            }
          }
        }
      });
      chartInstances.current.push(chart);
    }

    if (chainChartRef.current && chartData.chainData) {
      const chart = new Chart(chainChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Solana', 'Ethereum', 'BSC'],
          datasets: [{
            data: [chartData.chainData.solana, chartData.chainData.ethereum, chartData.chainData.bsc],
            backgroundColor: ['#9945ff', '#627eea', '#f3ba2f'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: '#8a8f98', font: { size: 11 } }
            }
          }
        }
      });
      chartInstances.current.push(chart);
    }

    return () => {
      chartInstances.current.forEach(chart => chart.destroy());
      chartInstances.current = [];
    };
  }, [chartData]);

  const showToast = (title, message) => alert(`${title}: ${message}`);

  const urid = useMemo(() => {
    try { return getUserId(); } catch { return null; }
  }, []);

  const formatDate = (value) => {
    if (!value) return { date: '-', time: '' };
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return { date: String(value), time: '' };
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear().toString().slice(-2);
    return {
      date: `${day}/${month}/${year}`,
      time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
    };
  };

  const marketClass = (market) => {
    const m = (market || '').toLowerCase();
    if (m.includes('forex')) return 'bg-cyan-500/15 text-indigo-600';
    if (m.includes('metal')) return 'bg-amber-500/15 text-amber-500';
    if (m.includes('crypto')) return 'bg-blue-500/15 text-blue-300';
    if (m.includes('indic')) return 'bg-teal-500/15 text-teal-300';
    return 'bg-white/[0.06] text-gray-500';
  };

  const downloadCSV = () => {
    const rows = tradeHistory || [];
    const headers = [
      'TradeDate', 'BotFollow', 'TradeAction', 'Market', 'AssetCode', 'AssetName',
      'AIAgent', 'EntryPrice', 'ExitPrice', 'Profit', 'Capital',
      'PortfolioValue', 'Status',
    ];
    const escapeCSV = (val) => {
      const s = val === null || val === undefined ? '' : String(val);
      if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };
    const csv = [
      headers.join(','),
      ...rows.map((t) => [
        t.TradeDate, t.BotFollow, t.TradeAction, t.Market, t.AssetCode, t.AssetName,
        t.AIAgent, t.EntryPrice, t.ExitPrice, t.Profit, t.Capital,
        t.PortfolioValue, t.Status,
      ].map(escapeCSV).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trade_history.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    let cancelled = false;
    const fetchTrades = async () => {
      setLoadingTrades(true);
      setTradeError(null);
      try {
        const res = await getRequestWithToken(`/Authentication/getAgentAnalyticsUser`);
        if (cancelled) return;
        const candidates = [res?.data, res?.Data, res?.result, res?.Result, res?.trades, res?.tradeHistory, res];
        const list = candidates.find((x) => Array.isArray(x));
        setTradeHistory(list || []);
      } catch (e) {
        if (cancelled) return;
        setTradeError(e?.response?.data?.message || e?.message || 'Failed to load trade history');
      } finally {
        if (!cancelled) setLoadingTrades(false);
      }
    };
    fetchTrades();
    return () => { cancelled = true; };
  }, []);

  const totalPages = Math.max(1, Math.ceil((tradeHistory?.length || 0) / pageSize));
  const paginated = (tradeHistory || []).slice((page - 1) * pageSize, page * pageSize);

  return (
    <div id="p-analytics" className="p-4 bg-white text-gray-900">

      {/* DYNAMIC METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="text-xs text-gray-500 font-medium">Total Profit</div>
          <div
            className={`text-2xl font-bold my-1 ${metrics.totalProfit >= 0 ? 'text-gray-800' : 'text-red-400'}`}
          >
            ${metrics.totalProfit.toLocaleString()}
          </div>
          <div className="text-[11px] font-medium text-emerald-400">
            ▲ +{metrics.winRate.toFixed(1)}%
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="text-xs text-gray-500 font-medium">Realized PnL</div>
          <div
            className={`text-2xl font-bold my-1 ${metrics.realizedPnL >= 0 ? 'text-gray-800' : 'text-red-400'}`}
          >
            ${metrics.realizedPnL.toLocaleString()}
          </div>
          <div className="text-[11px] font-medium text-emerald-400">
            ▲ +${metrics.profitChange.toFixed(2)}
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="text-xs text-gray-500 font-medium">Total Trades</div>
          <div className="text-2xl font-bold my-1 text-gray-800">
            {metrics.totalTrades.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-500 mt-1.5 font-mono">
            {metrics.winLoss.wins}W · {metrics.winLoss.losses}L
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="text-xs text-gray-500 font-medium">Avg Profit</div>
          <div
            className={`text-2xl font-bold my-1 ${metrics.avgProfit >= 0 ? 'text-emerald-500' : 'text-red-400'}`}
          >
            ${metrics.avgProfit.toFixed(2)}
          </div>
          <div className="text-[11px] font-medium text-emerald-400">
            ▲ +${metrics.profitChange.toFixed(2)}
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm font-medium text-black">PnL Curve · 90d</div>
            <span className="text-xs px-2.5 py-1 rounded-md font-medium bg-emerald-500/15 text-emerald-400">
              +{Math.round(metrics.totalProfit).toLocaleString()}%
            </span>
          </div>
          <div className="relative w-full h-[210px]">
            <canvas ref={pnlChartRef} role="img" aria-label="90d PnL Percentage">
              Cumulative PnL percentage over 90 days.
            </canvas>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm font-medium text-black">Daily Profits · 30d</div>
          </div>
          <div className="relative w-full h-[210px]">
            <canvas ref={dailyChartRef} role="img" aria-label="Daily profits">
              Daily profit amounts over 30 days.
            </canvas>
          </div>
        </div>
      </div>

      {/* Trade History */}
      <div className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 pt-5 pb-4 box-border">
        <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
          <div>
            <div className="text-lg font-semibold text-black">Trade History</div>
            <div className="text-xs text-gray-500 mt-0.5">
              Detailed record of all AI trading activities and performance
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                if (!tradeHistory || tradeHistory.length === 0) {
                  showToast('Export CSV', 'No data to export');
                  return;
                }
                downloadCSV();
              }}
              className="text-xs px-3.5 py-2 rounded-lg cursor-pointer transition-colors
                bg-violet-500/15 border border-violet-500/30 text-violet-300
                hover:bg-violet-500/25"
            >
              Export CSV ↓
            </button>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-[12.5px] table-auto">
            <thead>
              <tr>
                {['Date', 'AI Agent', 'Market', 'Asset / Pair', 'Action', 'PnL %', 'Yours Profit', 'Total Profit', 'Portfolio Value', 'Status'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2.5 text-gray-500 font-medium text-[11px] tracking-wider uppercase border-b border-gray-200 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingTrades ? (
                <tr>
                  <td colSpan={10} className="text-center p-6 text-gray-500">
                    Loading trade history…
                  </td>
                </tr>
              ) : tradeError ? (
                <tr>
                  <td colSpan={10} className="text-center p-6 text-red-400">
                    {String(tradeError)}
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center p-6 text-gray-500">
                    No trade history found.
                  </td>
                </tr>
              ) : (
                paginated.map((t, idx) => {
                  const profit = t?.Profit ?? t?.profit ?? 0;
                  const isProfit = Number(profit) >= 0;
                  const action = (t?.TradeAction || '').toUpperCase();
                  const agentName = t?.AIAgent;
                  const botFollow = t?.BotFollow;
                  const capital = t?.Capital;
                  const { date } = formatDate(t?.TradeDate);

                  return (
                    <tr
                      key={t?.TradeId || t?.TradeDate || idx}
                      className="hover:bg-gray-100/60 transition-colors"
                    >
                      <td className="px-3 py-3 border-b border-gray-100 align-middle whitespace-nowrap">
                        <div className="font-medium text-gray-500">{date}</div>
                        <div className="text-[11px] text-gray-500 font-mono">${capital}</div>
                      </td>
                      <td className="px-3 py-3 border-b border-gray-100 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-2 text-gray-500">
                          <span className="w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-cyan-400 text-white text-xs font-semibold shrink-0">
                            {agentName?.charAt(0) || 'A'}
                          </span>
                          <div>
                            <div className="font-medium text-[12.5px]">{agentName}</div>
                            <div className="text-[10.5px] text-gray-500">{botFollow}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 border-b border-gray-100 align-middle whitespace-nowrap">
                        <span className={`text-[11px] px-2.5 py-0.5 rounded-md font-medium ${marketClass(t?.Market)}`}>
                          {t?.Market || '-'}
                        </span>
                      </td>
                      <td className="px-3 py-3 border-b border-gray-100 align-middle whitespace-nowrap">
                        <div className="font-medium text-gray-500">
                          {t?.AssetCode || t?.Pair || '-'}
                        </div>
                        <div className="text-[10.5px] text-gray-500">{t?.AssetName || ''}</div>
                      </td>
                      <td className="px-3 py-3 border-b border-gray-100 align-middle whitespace-nowrap">
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${
                            action === 'SELL'
                              ? 'bg-red-500/15 text-red-400'
                              : 'bg-emerald-500/15 text-emerald-400'
                          }`}
                        >
                          {action || '-'}
                        </span>
                      </td>
                      <td className="px-3 py-3 border-b border-gray-100 align-middle whitespace-nowrap font-mono text-gray-800">
                        {t?.PNL ?? '-'}%
                      </td>
                      <td
                        className={`px-3 py-3 border-b border-gray-100 align-middle whitespace-nowrap ${
                          isProfit ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {isProfit ? '+' : ''}${profit}
                      </td>
                      <td className="px-3 py-3 border-b border-gray-100 align-middle whitespace-nowrap font-mono text-gray-800">
                        {t?.TotalProfit ?? '-'}
                      </td>
                      <td className="px-3 py-3 border-b border-gray-100 align-middle whitespace-nowrap font-mono text-gray-800">
                        {t?.PortfolioValue ?? '-'}
                      </td>
                      <td className="px-3 py-3 border-b border-gray-100 align-middle whitespace-nowrap">
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 capitalize">
                          {t?.Status || 'Closed'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4 flex-wrap gap-2.5">
          <div className="text-xs text-gray-500">
            Showing {(tradeHistory?.length || 0) === 0 ? 0 : (page - 1) * pageSize + 1} to{' '}
            {Math.min(page * pageSize, tradeHistory?.length || 0)} of {tradeHistory?.length || 0} trades
          </div>
          <div className="flex items-center gap-1.5">
            <button
              className="min-w-[30px] h-[30px] rounded-md border border-gray-200 bg-gray-100 text-gray-500 text-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(0, 3)
              .map((n) => (
                <button
                  key={n}
                  className={`min-w-[30px] h-[30px] rounded-md border text-xs cursor-pointer transition-colors ${
                    page === n
                      ? 'bg-cyan-400 border-cyan-400 text-black font-semibold'
                      : 'border-gray-200 bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
            {totalPages > 3 && <span className="text-gray-500 text-xs">…</span>}
            <button
              className="min-w-[30px] h-[30px] rounded-md border border-gray-200 bg-gray-100 text-gray-500 text-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}