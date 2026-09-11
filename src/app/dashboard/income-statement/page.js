"use client";

import { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactionHistory } from '@/app/redux/slices/walletSlice';
import { useSearchParams } from 'next/navigation';
import { getUserId } from '@/app/api/auth';

const TABS = [
  'Trading Profit',
  'Direct Income',
  'Tier Reward',
  'Growth Reward',
  'Leadership Income'
];

const KEY_TO_LABEL = {
  GrowthReward: 'Growth Reward',
  TradingProfit: 'Trading Profit',
  TierReward: 'Tier Reward',
  DirectIncome: 'Direct Income'
};

export default function IncomeStatement() {
  const userId = getUserId();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { transactionhistorydata, loading: isLoading } = useSelector(state => state.wallet || {});

  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Activate tab from ?tab=Key or ?tab=Label
  useEffect(() => {
    const tabParam = searchParams?.get('tab');
    if (!tabParam) return;
    if (KEY_TO_LABEL[tabParam]) {
      setActiveTab(KEY_TO_LABEL[tabParam]);
      return;
    }
    if (TABS.includes(tabParam)) setActiveTab(tabParam);
  }, [searchParams]);

  const transactions = useMemo(() => {
    if (!Array.isArray(transactionhistorydata)) return [];

    return transactionhistorydata.map(item => ({
      id: item.ID,
      urid: item.URID,
      date: item.CreatedDate,
      credit: Number(item.credit || 0),
      transType: item.transType,
      remark: item.Remark || '',
      statusCode: item.statusCode,
      message: item.message,
      rawDate: new Date(item.CreatedDate)
    })).sort((a, b) => b.rawDate - a.rawDate);
  }, [transactionhistorydata]);

  // Fetch transactions when tab changes
  useEffect(() => {
    dispatch(getTransactionHistory({ transtype: activeTab }));
  }, [activeTab, dispatch, userId]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return transactions;

    const term = searchTerm.toLowerCase();
    return transactions.filter(item =>
      item.remark.toLowerCase().includes(term) ||
      item.credit.toString().includes(term) ||
      item.date.includes(term) ||
      item.id.toString().includes(term)
    );
  }, [transactions, searchTerm]);

  // Pagination logic
  const totalFiltered = filteredData.length;
  const totalPages = Math.ceil(totalFiltered / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalFiltered);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Reset page when search or tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Calculate total visible sum for current filter
  const visibleTotal = filteredData.reduce((sum, t) => sum + (t.credit || 0), 0).toFixed(4);

  return (
    <div className="mx-auto px-4 sm:px-6 py-6">
      <div className="w-full">

        {/* Tabs Navigation */}
        <div className="overflow-x-auto scrollbar-thin mb-4">
          <div className="flex gap-1 bg-gray-100 dark:bg-[#142936] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-xl p-1">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-teal-400 to-teal-400 text-white shadow-md shadow-purple-500/25"
                    : "text-gray-600 dark:text-[#9db4be] hover:bg-gray-200 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Search + Summary Section */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-4">
          {/* Summary Card */}
          <div className="flex-1 min-w-[200px] bg-gradient-to-r from-blue-500/10 to-purple-500/5 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center border border-blue-500/20 flex-wrap gap-2">
            <span className="text-xs sm:text-sm text-gray-500 dark:text-[#9db4be] uppercase tracking-[1px]">
              📊 Current Filter Total • {activeTab}
            </span>
            <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
              ${visibleTotal} USD
            </span>
          </div>

          {/* Search */}
          <div className="flex-1 flex justify-end min-w-[200px]">
            <div className="relative w-full max-w-[200px] sm:max-w-[240px]">
              <input
                type="text"
                placeholder="Search transactions (ID, amount, remark...)"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-2.5 pl-10 rounded-full bg-gray-100 dark:bg-[#142936] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.2)] transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white dark:bg-[#10222e] rounded-2xl border border-gray-200 dark:border-[rgba(140,200,205,0.16)] overflow-hidden backdrop-blur-sm shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 dark:bg-[#142936] text-gray-500 dark:text-[#9db4be] text-xs font-medium uppercase tracking-[0.5px] border-b border-gray-200 dark:border-[rgba(140,200,205,0.1)] whitespace-nowrap">#</th>
                  <th className="text-left px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 dark:bg-[#142936] text-gray-500 dark:text-[#9db4be] text-xs font-medium uppercase tracking-[0.5px] border-b border-gray-200 dark:border-[rgba(140,200,205,0.1)] whitespace-nowrap">Date</th>
                  <th className="text-left px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 dark:bg-[#142936] text-gray-500 dark:text-[#9db4be] text-xs font-medium uppercase tracking-[0.5px] border-b border-gray-200 dark:border-[rgba(140,200,205,0.1)] whitespace-nowrap">Credit (USD)</th>
                  <th className="text-left px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 dark:bg-[#142936] text-gray-500 dark:text-[#9db4be] text-xs font-medium uppercase tracking-[0.5px] border-b border-gray-200 dark:border-[rgba(140,200,205,0.1)] whitespace-nowrap">Remarks / Description</th>
                  <th className="text-left px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 dark:bg-[#142936] text-gray-500 dark:text-[#9db4be] text-xs font-medium uppercase tracking-[0.5px] border-b border-gray-200 dark:border-[rgba(140,200,205,0.1)] whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500 dark:text-[#9db4be]">
                      <span>Loading transactions...</span>
                    </td>
                  </tr>
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((item, idx) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 dark:border-[rgba(140,200,205,0.06)] hover:bg-blue-50/50 dark:hover:bg-[rgba(47,217,211,0.04)] transition-colors"
                    >
                      <td className="px-4 sm:px-5 py-3 sm:py-4 text-gray-700 dark:text-[#eaf5f7] whitespace-nowrap">
                        {startIndex + idx + 1}
                      </td>
                      <td className="px-4 sm:px-5 py-3 sm:py-4 text-gray-700 dark:text-[#eaf5f7] whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="px-4 sm:px-5 py-3 sm:py-4 font-semibold text-teal-600 dark:text-[#2ed99a] whitespace-nowrap">
                        ${Number(item.credit).toFixed(4)}
                      </td>
                      <td
                        className="px-4 sm:px-5 py-3 sm:py-4 text-gray-600 dark:text-[#9db4be] max-w-[200px] truncate"
                        title={item.remark}
                      >
                        {item.remark}
                      </td>
                      <td className="px-4 sm:px-5 py-3 sm:py-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            item.statusCode === 1 ||
                            item.statusCode === 'success' ||
                            item.message === 'Success'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-[#2ed99a] border border-green-200 dark:border-green-800'
                              : item.statusCode === 0 ||
                                item.statusCode === 'pending' ||
                                item.message === 'Pending'
                              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-[#f0708a] border border-red-200 dark:border-red-800'
                          }`}
                        >
                          {item.message}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500 dark:text-[#9db4be]">
                      <span>📭 No transactions found</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalFiltered > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-[rgba(140,200,205,0.1)]">
              <div className="text-sm text-gray-500 dark:text-[#9db4be] font-medium">
                Showing {startIndex + 1} to {endIndex} of {totalFiltered} transactions
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-teal-500 to-purple-600 hover:from-purple-600 hover:to-teal-500 text-white font-semibold text-sm transition-all duration-300 shadow-[0_4px_15px_rgba(113,51,219,0.25)] hover:shadow-[0_6px_20px_rgba(113,51,219,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:translate-y-0 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400"
                >
                  ← Prev
                </button>
                <span className="text-gray-900 dark:text-white font-semibold text-sm min-w-[100px] text-center">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-teal-500 to-purple-600 hover:from-purple-600 hover:to-teal-500 text-white font-semibold text-sm transition-all duration-300 shadow-[0_4px_15px_rgba(113,51,219,0.25)] hover:shadow-[0_6px_20px_rgba(113,51,219,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:translate-y-0 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}