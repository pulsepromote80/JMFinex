"use client";

import React from "react";
import { useEffect, useState } from "react";
import {
  Download,
} from "lucide-react";
import { useDispatch } from "react-redux";
import {
  getRechargetransactionHIstory,
  addWithdrawalPrinciple,
} from "@/app/redux/slices/fundManagerSlice";
import { getUserId } from "@/app/api/auth";
import toast from "react-hot-toast";

/* =========================
   HISTORY CARD
========================= */
function HistoryCard({ transaction, index }) {
  const dispatch = useDispatch();

  const getStatus = () => ({ label: "Active", class: "success" });
  const status = getStatus();

  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [remark, setRemark] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  /* ----- Helpers (unchanged) ----- */
  const getPackageColor = (packageName) => {
    if (!packageName) return "bg-blue-100 dark:bg-[#1e3a5f] text-blue-600 dark:text-blue-400";
    const name = packageName.toLowerCase();
    if (name.includes("start")) return "bg-blue-100 dark:bg-[#1e3a5f] text-blue-600 dark:text-blue-400";
    if (name.includes("titan")) return "bg-purple-100 dark:bg-[#2e1065] text-purple-600 dark:text-purple-400";
    if (name.includes("quantum")) return "bg-orange-100 dark:bg-[#431407] text-orange-600 dark:text-orange-400";
    if (name.includes("megabull") || name.includes("mega bull")) return "bg-amber-100 dark:bg-[#451a03] text-amber-600 dark:text-amber-400";
    if (name.includes("growth")) return "bg-green-100 dark:bg-[#14532d] text-green-600 dark:text-green-400";
    return "bg-blue-100 dark:bg-[#1e3a5f] text-blue-600 dark:text-blue-400";
  };

  const getIconBg = (categoryName) => {
    if (!categoryName) return "bg-blue-100 dark:bg-[#1e3a5f]";
    const name = categoryName.toLowerCase();
    if (name.includes("scalper")) return "bg-blue-100 dark:bg-[#1e3a5f]";
    if (name.includes("forex")) return "bg-purple-100 dark:bg-[#2e1065]";
    if (name.includes("phantom") || name.includes("stealth") || name.includes("mario")) return "bg-orange-100 dark:bg-[#431407]";
    if (name.includes("sniper")) return "bg-green-100 dark:bg-[#14532d]";
    if (name.includes("gold")) return "bg-yellow-100 dark:bg-[#422006]";
    return ["bg-blue-100 dark:bg-[#1e3a5f]", "bg-green-100 dark:bg-[#14532d]", "bg-purple-100 dark:bg-[#2e1065]", "bg-orange-100 dark:bg-[#431407]", "bg-yellow-100 dark:bg-[#422006]"][index % 5];
  };

  const getBotIcon = (categoryName) => {
    if (!categoryName) return "🤖";
    const name = categoryName.toLowerCase();
    if (name.includes("scalper")) return "🤖";
    if (name.includes("forex")) return "🧠";
    if (name.includes("phantom") || name.includes("stealth")) return "🥷";
    if (name.includes("sniper")) return "🎯";
    if (name.includes("gold")) return "🪙";
    if (name.includes("mario")) return "🍄";
    return "🤖";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const parts = dateString.split("-");
      if (parts.length === 3) {
        const date = new Date(parts[2], parts[1] - 1, parts[0]);
        return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
      }
      return dateString;
    } catch { return dateString; }
  };

  const formatAmount = (amount) => {
    if (!amount && amount !== 0) return "$0.00";
    const num = parseFloat(amount);
    if (isNaN(num)) return `$${amount}`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <>
      <div className="border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all overflow-visible flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start px-3.5 py-3 border-b border-slate-200 dark:border-slate-700 gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className={`flex w-9 h-9 items-center justify-center rounded-[10px] text-base shrink-0 ${getIconBg(transaction.CategoryName)}`}>
              {getBotIcon(transaction.CategoryName)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 m-0 tracking-wide truncate">
                {transaction.CategoryName || "AI Bot"}
              </h3>
              <p className="text-[10px] text-slate-400 m-0 mt-0.5 truncate">
                {transaction.productName || transaction.CategoryName || "Bot"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-semibold shrink-0">
            <span className="w-2 h-2 rounded-full shrink-0 bg-green-500" />
            <span className="text-green-500 dark:text-green-400">{status.label}</span>
          </div>
        </div>

        {/* Body */}
        <div className="px-3.5 py-3 flex-1 flex flex-col gap-2.5">
          {/* Invested Amount */}
          <div className="flex justify-between items-center px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900">
            <span className="text-[10px] text-slate-400 font-medium">Invested Amount</span>
            <span className="text-xs font-semibold text-green-500 dark:text-green-400">
              {formatAmount(transaction.Rkprice)}
            </span>
          </div>

          {/* Package */}
          <div className="flex justify-between items-center px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900">
            <span className="text-[10px] text-slate-400 font-medium">Package</span>
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${getPackageColor(transaction.PackageName)}`}>
              {transaction.PackageName ? transaction.PackageName.split(",")[0].trim() : "Basic"}
            </span>
          </div>

          {/* Details — 2 cols */}
          <div className="grid grid-cols-2 gap-1.5 px-2.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg max-[400px]:grid-cols-1 max-[400px]:gap-1">
            <div className="flex flex-col gap-0.5 pr-2.5 border-r border-slate-200 dark:border-slate-700 max-[400px]:border-r-0 max-[400px]:pr-0">
              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Activated By</span>
              <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                {transaction.AuthLogin || "Welcome"}
              </span>
            </div>
            <div className="flex flex-col gap-0.5 pl-2.5 max-[400px]:pl-0">
              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Date</span>
              <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                {formatDate(transaction.OrderDate)}
              </span>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 mt-1 max-sm:grid-cols-1">
            <div className="px-1 py-1.5 text-center">
              <p className="text-[9px] text-slate-400 m-0 uppercase tracking-wider">APY</p>
              <p className="text-[11px] font-semibold text-green-500 dark:text-green-400 m-0 mt-0.5">
                {transaction?.APY}
              </p>
            </div>
            <div className="px-1 py-1.5 text-center border-x border-slate-200 dark:border-slate-700 max-sm:border-x-0 max-sm:border-t max-sm:border-b max-sm:border-slate-200 dark:max-sm:border-slate-700">
              <p className="text-[9px] text-slate-400 m-0 uppercase tracking-wider">Status</p>
              <p className="text-[11px] font-semibold text-green-500 dark:text-green-400 m-0 mt-0.5">Active</p>
            </div>
            <div className="px-1 py-1.5 text-center">
              <p className="text-[9px] text-slate-400 m-0 uppercase tracking-wider">Limit</p>
              <p className="text-[11px] font-semibold text-amber-500 dark:text-amber-400 m-0 mt-0.5">
                {transaction.PackageName ? transaction.PackageName.split(",")[1].trim() : "Basic"}
              </p>
            </div>
          </div>

          {/* Withdrawal section */}
          {transaction.LeftDaysWithdrawal != 0 && (
            <div className="grid grid-cols-1 gap-1 px-2.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-center">
              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider leading-tight">
                Days Until Principal Withdrawal
              </span>
              <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 leading-tight -mt-0.5">
                Available in {transaction.LeftDaysWithdrawal || "30"} days
              </span>
              <div className="flex items-center justify-center gap-2 mt-2">
                <button
                  onClick={() => setShowWithdrawalModal(true)}
                  className="px-3 py-1 border border-blue-600 rounded-md bg-blue-600 text-white text-[11px] font-medium cursor-pointer transition-all hover:bg-blue-700 hover:border-blue-700"
                >
                  Withdrawal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawalModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-5 bg-black/50 dark:bg-black/70"
          onClick={() => setShowWithdrawalModal(false)}
        >
          <div
            className="w-full max-w-[400px] rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="m-0 mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
              Principal Withdrawal
            </h3>

            <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="mb-2 text-xs text-slate-400 font-medium">Amount</div>
              <div className="text-xl font-bold text-green-500 dark:text-green-400">
                {formatAmount(transaction.Rkprice)}
              </div>
            </div>

            <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="mb-2 text-xs text-slate-400 font-medium">Package</div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {transaction.PackageName ? transaction.PackageName.split(",")[0].trim() : "Basic"}
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-1.5 text-xs text-slate-400 font-medium">Remark</label>
              <textarea
                className="w-full px-2.5 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-[13px] min-h-[80px] resize-y font-inherit focus:outline-none focus:border-blue-500 transition-colors"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Enter your remark..."
              />
            </div>

            <div className="flex gap-2.5 justify-end">
              <button
                className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-[13px] font-medium cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => { setShowWithdrawalModal(false); setRemark(""); }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-[13px] font-medium cursor-pointer transition-all hover:bg-blue-700 border border-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={async () => {
                  try {
                    setIsWithdrawing(true);
                    const withdrawalData = {
                      remark: remark,
                      rechargeid: transaction.RechargeId || transaction.id || transaction.rechargeid || "",
                    };
                    const result = await dispatch(addWithdrawalPrinciple(withdrawalData)).unwrap();
                    if (result?.statusCode === 200 || result?.success) {
                      toast.success(result.message);
                      setShowWithdrawalModal(false);
                      setRemark("");
                    } else {
                      toast.error(result?.message || "Failed to submit withdrawal request");
                    }
                  } catch (error) {
                    console.error("Withdrawal error:", error);
                    toast.error(error?.message || "An error occurred during withdrawal");
                  } finally {
                    setIsWithdrawing(false);
                  }
                }}
                disabled={isWithdrawing}
              >
                {isWithdrawing ? "Processing..." : "Confirm Withdrawal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* =========================
   MAIN PAGE
========================= */
export default function InvestmentHistory() {
  const dispatch = useDispatch();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [packageFilter, setPackageFilter] = useState("all");

  // Fetch
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const result = await dispatch(getRechargetransactionHIstory()).unwrap();
        let historyData = [];
        if (result?.data && Array.isArray(result.data)) historyData = result.data;
        else if (Array.isArray(result)) historyData = result;
        else if (result?.transactions && Array.isArray(result.transactions)) historyData = result.transactions;
        else {
          const data = result?.data || result;
          if (Array.isArray(data)) historyData = data;
          else if (data && typeof data === "object") {
            if (data.Rkprice !== undefined || data.CategoryName) historyData = [data];
          }
        }
        historyData = historyData.filter(
          (item) => item && typeof item === "object" && (item.Rkprice !== undefined || item.CategoryName)
        );
        setTransactions(historyData);
      } catch (err) {
        console.error("Error fetching investment history:", err);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [dispatch]);

  // Filter
  const filteredTransactions = transactions.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (item.CategoryName || "").toLowerCase().includes(searchLower) ||
      (item.productName || "").toLowerCase().includes(searchLower) ||
      (item.PackageName || "").toLowerCase().includes(searchLower) ||
      (item.AuthLogin || "").toLowerCase().includes(searchLower);
    const matchesPackage = packageFilter === "all" || (item.PackageName || "").toLowerCase().includes(packageFilter.toLowerCase());
    const matchesStatus = statusFilter === "all" || statusFilter === "active";
    return matchesSearch && matchesStatus && matchesPackage;
  });

  const getUniquePackages = () => {
    const packages = new Set();
    transactions.forEach((item) => {
      if (item.PackageName) packages.add(item.PackageName.split(",")[0].trim());
    });
    return Array.from(packages);
  };

  const getSummaryStats = () => {
    if (transactions.length === 0) return { total: 0, count: 0, income: 0, limit: 0, remaining: 0 };
    const first = transactions[0];
    return {
      total: first.TotalInvestment || transactions.reduce((sum, item) => {
        const amount = parseFloat(item.Rkprice || 0);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0),
      count: transactions.length,
      income: first.TotalIncome || 0,
      limit: first.EarningLimit || 0,
      remaining: first.RemainingLimit || 0,
    };
  };

  const stats = getSummaryStats();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="text-[40px] mb-4">📊</div>
          <div className="text-lg text-slate-900 dark:text-slate-100">Loading Investment History...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 font-[system-ui,-apple-system,'Segoe_UI',sans-serif]">
      <div className="px-5 py-4 max-sm:px-3 max-sm:py-3">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3 mb-5 max-sm:grid-cols-1">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition-all">
            <p className="text-[11px] text-slate-400 font-medium m-0 mb-1 uppercase tracking-wider">Active Bots</p>
            <p className="text-[22px] font-bold m-0 text-blue-600 dark:text-blue-400 max-sm:text-lg">{stats.count}</p>
            <p className="text-[11px] text-slate-400 m-0 mt-0.5">Bots</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition-all">
            <p className="text-[11px] text-slate-400 font-medium m-0 mb-1 uppercase tracking-wider">Total Investment</p>
            <p className="text-[22px] font-bold m-0 text-green-500 dark:text-green-400 max-sm:text-lg">
              ${typeof stats.total === "number" ? stats.total.toFixed(2) : "0.00"}
            </p>
            <p className="text-[11px] text-slate-400 m-0 mt-0.5">User Investment</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2.5 mb-4 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm max-sm:flex-col">
          <div className="flex flex-wrap items-center gap-1.5 flex-1 max-sm:flex-col max-sm:items-stretch">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">🔍 Search</span>
            <input
              className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-[13px] text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 min-w-[120px] focus:outline-none focus:border-blue-500 transition-colors max-sm:w-full max-sm:min-w-0"
              placeholder="Search by bot, package..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5 flex-1 max-sm:flex-col max-sm:items-stretch">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">📦 Package</span>
            <select
              className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-[13px] text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 min-w-[110px] cursor-pointer focus:outline-none focus:border-blue-500 transition-colors max-sm:w-full max-sm:min-w-0"
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
            >
              <option value="all">All Packages</option>
              {getUniquePackages().map((pkg) => (
                <option key={pkg} value={pkg}>{pkg}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 flex-1 max-sm:flex-col max-sm:items-stretch">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">📊 Status</span>
            <select
              className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-[13px] text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 min-w-[110px] cursor-pointer focus:outline-none focus:border-blue-500 transition-colors max-sm:w-full max-sm:min-w-0"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
          <p className="text-[13px] text-slate-400 m-0">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </p>
          <button
            className="flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-slate-700"
            onClick={() => window.print()}
          >
            <Download size={14} />
            Export
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-5">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction, index) => (
              <HistoryCard
                key={transaction.id || transaction.transactionId || index}
                transaction={transaction}
                index={index}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 px-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl">
              <div className="text-5xl mb-3">📭</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1.5">No Transactions Found</h3>
              <p className="text-[13px] text-slate-400">
                {searchTerm || packageFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Start investing in AI bots to see your history"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Keyframes only */}
      <style jsx global>{`
        @keyframes sb-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes sb-fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-sb-pulse { animation: sb-pulse 1.5s ease-in-out infinite; }
        .animate-sb-fadeIn { animation: sb-fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}