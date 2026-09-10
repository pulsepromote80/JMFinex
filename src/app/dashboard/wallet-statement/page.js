"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllWalletTransType,
  getDepositWalletReport,
  getIncomeWalletReport,
  getRoiWalletReport,
  getWithdrawalHistory,
} from "@/app/redux/slices/walletSlice";
import { getUserId } from "@/app/api/auth";

const WalletStatement = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("Deposit");
  const [selectedTransType, setSelectedTransType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [withdrawalType, setWithdrawalType] = useState(1);

  const {
    walletData,
    loading,
    DepositWalletReportData,
    getIncomeWalletReportdata,
    roiWalletData,
    WithdrawalHistoryData,
  } = useSelector((state) => state.wallet);

  const userId = getUserId();
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(getAllWalletTransType());
  }, [dispatch]);

  // Reset type & fetch report when tab changes
  useEffect(() => {
    setSelectedTransType("");
    setCurrentPage(1);
    setSearchTerm("");
    fetchReportForTab(activeTab, "");
  }, [activeTab]);

  // Fetch report when selectedTransType changes
  useEffect(() => {
    if (activeTab) {
      fetchReportForTab(activeTab, selectedTransType);
    }
  }, [selectedTransType]);

  const fetchReportForTab = (tab, transtype) => {
    const payload = { transtype: transtype || "" };
    const withdrawalPayload = {
      transtype: "withdrawal",
      type: withdrawalType,
    };
    switch (tab) {
      case "Deposit":
        dispatch(getDepositWalletReport(payload));
        break;
      case "Income":
        dispatch(getIncomeWalletReport(payload));
        break;
      case "Trading":
        dispatch(getRoiWalletReport(payload));
        break;
      case "Withdrawal":
        dispatch(getWithdrawalHistory(withdrawalPayload));
        break;
      default:
        break;
    }
  };

  // Get current report data based on active tab
  const currentReportData = useMemo(() => {
    switch (activeTab) {
      case "Deposit":
        return DepositWalletReportData;
      case "Income":
        return getIncomeWalletReportdata;
      case "Withdrawal":
        return WithdrawalHistoryData;
      case "Trading":
        return roiWalletData;
      default:
        return [];
    }
  }, [
    activeTab,
    DepositWalletReportData,
    getIncomeWalletReportdata,
    roiWalletData,
    WithdrawalHistoryData,
  ]);

  // Get available transaction types for dropdown
  const transTypeOptions = useMemo(() => {
    if (!walletData) return [];
    switch (activeTab) {
      case "Deposit":
        return walletData.depositTransTypes || [];
      case "Income":
        return walletData.incomeTransTypes || [];
      case "Trading":
        return walletData.roiTransTypes || [];
      case "Withdrawal":
        return [
          { label: "Income", value: 1 },
          { label: "Trading", value: 2 },
        ];
      default:
        return [];
    }
  }, [activeTab, walletData]);

  // Filter & paginate data
  const filteredData = useMemo(() => {
    if (!currentReportData?.length) return [];
    return currentReportData.filter((item) =>
      Object.values(item).some((val) =>
        val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [currentReportData, searchTerm]);

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
  const paginatedData = filteredData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const tabs = ["Deposit", "Income", "Trading", "Withdrawal"];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleTransTypeChange = (e) => {
    const value = e.target.value;
    setSelectedTransType(value);
    if (activeTab === "Withdrawal") {
      setWithdrawalType(Number(value));
    }
  };

  // Dynamic colSpan based on active tab
  const getColSpan = () => {
    return activeTab === "Withdrawal" ? 7 : 7;
  };

  // Date formatter — shows only YYYY-MM-DD
  const formatDateOnly = (value) => {
    if (!value) return "-";
    return String(value).split("T")[0];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Tabs + Dropdown Row */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2.5">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 sm:px-5 py-2.5 rounded-sm text-sm font-medium border transition-all duration-200 ${
                activeTab === tab
                  ? "bg-teal-500 dark:bg-[#2fd9d3] text-gray-50 border-teal-500 dark:border-[#2fd9d3] shadow-[0_2px_6px_rgba(113,51,219,0.3)] dark:shadow-[0_2px_6px_rgba(139,92,246,0.3)]"
                  : "bg-white dark:bg-[#10222e] border-gray-200 dark:border-[rgba(255,255,255,0.07)] text-gray-600 dark:text-[#9ca3af] hover:bg-gray-50 dark:hover:bg-[rgba(255,255,255,0.04)] hover:border-teal-500 dark:hover:border-[#2fd9d3] hover:text-teal-500 dark:hover:text-[#2fd9d3]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative min-w-[140px] sm:min-w-[160px]">
          <select
            className="w-full px-4 py-2.5 pr-10 rounded-full border border-gray-200 dark:border-[rgba(255,255,255,0.07)] bg-white dark:bg-[#10222e] text-gray-900 dark:text-[#eef2ff] text-sm font-medium appearance-none cursor-pointer transition-all hover:border-teal-500 dark:hover:border-[#2fd9d3] focus:border-teal-500 dark:focus:border-[#2fd9d3] focus:outline-none focus:shadow-[0_0_0_2px_rgba(139,92,246,0.2)]"
            value={selectedTransType}
            onChange={handleTransTypeChange}
          >
            {activeTab === "Withdrawal"
              ? transTypeOptions.map((item, idx) => (
                  <option key={idx} value={item.value}>
                    {item.label}
                  </option>
                ))
              : transTypeOptions.map((item, idx) => (
                  <option key={idx} value={item.transtype}>
                    {item.transtype}
                  </option>
                ))}
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-[#6b7280] text-xs">
            ▼
          </span>
        </div>
      </div>

      {/* Wallet Card */}
      <div className="bg-white dark:bg-[#10222e] rounded-2xl border border-gray-200 dark:border-[rgba(255,255,255,0.07)] shadow-sm hover:shadow-md transition-all duration-200 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#eef2ff]">
            {activeTab} Statement
          </h2>
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[260px] px-4 py-2.5 pl-4 pr-10 rounded-full border border-gray-200 dark:border-[rgba(255,255,255,0.07)] bg-white dark:bg-[#10222e] text-gray-900 dark:text-[#eef2ff] text-sm outline-none focus:border-teal-500 dark:focus:border-[#2fd9d3] focus:shadow-[0_0_0_2px_rgba(139,92,246,0.2)] transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#6b7280] text-sm pointer-events-none">
              🔍
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(255,255,255,0.07)] backdrop-blur-sm rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-[rgba(255,255,255,0.06)]">
                  {activeTab === "Withdrawal" ? (
                    <>
                      <th className="text-left px-3 sm:px-4 py-3 text-xs font-semibold text-teal-600 dark:text-[#00d4ff] uppercase tracking-wider whitespace-nowrap">#</th>
                      <th className="text-left px-3 sm:px-4 py-3 text-xs font-semibold text-teal-600 dark:text-[#00d4ff] uppercase tracking-wider whitespace-nowrap">Date</th>
                      <th className="text-left px-3 sm:px-4 py-3 text-xs font-semibold text-teal-600 dark:text-[#00d4ff] uppercase tracking-wider whitespace-nowrap">Request</th>
                      <th className="text-left px-3 sm:px-4 py-3 text-xs font-semibold text-teal-600 dark:text-[#00d4ff] uppercase tracking-wider whitespace-nowrap">Charges</th>
                      <th className="text-left px-3 sm:px-4 py-3 text-xs font-semibold text-teal-600 dark:text-[#00d4ff] uppercase tracking-wider whitespace-nowrap">Release</th>
                      <th className="text-left px-3 sm:px-4 py-3 text-xs font-semibold text-teal-600 dark:text-[#00d4ff] uppercase tracking-wider whitespace-nowrap">TransactionHash</th>
                      <th className="text-left px-3 sm:px-4 py-3 text-xs font-semibold text-teal-600 dark:text-[#00d4ff] uppercase tracking-wider whitespace-nowrap">Status</th>
                    </>
                  ) : (
                    <>
                      <th className="text-left px-3 sm:px-4 py-3 text-xs font-semibold text-teal-600 dark:text-[#00d4ff] uppercase tracking-wider whitespace-nowrap">#</th>
                      <th className="text-left px-3 sm:px-4 py-3 text-xs font-semibold text-teal-600 dark:text-[#00d4ff] uppercase tracking-wider whitespace-nowrap">Date</th>
                      <th className="text-left px-3 sm:px-4 py-3 text-xs font-semibold text-teal-600 dark:text-[#00d4ff] uppercase tracking-wider whitespace-nowrap">Credit</th>
                      <th className="text-left px-3 sm:px-4 py-3 text-xs font-semibold text-teal-600 dark:text-[#00d4ff] uppercase tracking-wider whitespace-nowrap">Debit</th>
                      <th className="text-left px-3 sm:px-4 py-3 text-xs font-semibold text-teal-600 dark:text-[#00d4ff] uppercase tracking-wider whitespace-nowrap">Type</th>
                      <th className="text-left px-3 sm:px-4 py-3 text-xs font-semibold text-teal-600 dark:text-[#00d4ff] uppercase tracking-wider whitespace-nowrap">Remark</th>
                      <th className="text-left px-3 sm:px-4 py-3 text-xs font-semibold text-teal-600 dark:text-[#00d4ff] uppercase tracking-wider whitespace-nowrap">Status</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={getColSpan()}
                      className="text-center py-12 text-gray-500 dark:text-[#6b7280] text-sm"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-100 dark:border-[rgba(255,255,255,0.04)] hover:bg-gray-50 dark:hover:bg-[rgba(255,255,255,0.04)] transition-all"
                    >
                      {activeTab === "Withdrawal" ? (
                        <>
                          <td className="px-3 sm:px-4 py-3 text-gray-700 dark:text-[#eef2ff] whitespace-nowrap">
                            {(currentPage - 1) * itemsPerPage + idx + 1}
                          </td>
                          <td className="px-3 sm:px-4 py-3 font-semibold text-teal-600 dark:text-[#10d98a] whitespace-nowrap">
                            {formatDateOnly(item.CreatedDate || item.createdDate)}
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-gray-700 dark:text-[#eef2ff] whitespace-nowrap">
                            {item.TotWithdl || "-"}
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-gray-700 dark:text-[#eef2ff] whitespace-nowrap">
                            {item.AdminCharges || "-"}
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-gray-700 dark:text-[#eef2ff] whitespace-nowrap">
                            {item.debit || "-"}
                          </td>
                          <td className="px-3 sm:px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span
                                title={item.Transhash || "-"}
                                className="max-w-[140px] sm:max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap text-gray-600 dark:text-[#9ca3af] text-xs font-mono"
                              >
                                {item.Transhash || "-"}
                              </span>
                              {item.Transhash && (
                                <button
                                  type="button"
                                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                  title="Copy Transaction Hash"
                                  onClick={() =>
                                    navigator.clipboard.writeText(item.Transhash)
                                  }
                                >
                                  <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                item.status === "Success" ||
                                item.status === "Approved" ||
                                item.status === "Completed"
                                  ? "bg-green-100 dark:bg-[rgba(16,185,129,0.2)] text-green-700 dark:text-[#34d399]"
                                  : item.status === "Pending"
                                  ? "bg-amber-100 dark:bg-[rgba(251,191,36,0.2)] text-amber-700 dark:text-[#fbbf24]"
                                  : "bg-red-100 dark:bg-[rgba(255,77,109,0.2)] text-red-700 dark:text-[#ff4d6d]"
                              }`}
                            >
                              {item.status || "-"}
                            </span>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-3 sm:px-4 py-3 text-gray-700 dark:text-[#eef2ff] whitespace-nowrap">
                            {(currentPage - 1) * itemsPerPage + idx + 1}
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-gray-700 dark:text-[#eef2ff] whitespace-nowrap">
                            {item.CreatedDate || item.createdDate || "-"}
                          </td>
                          <td className="px-3 sm:px-4 py-3 font-semibold text-teal-600 dark:text-[#10d98a] whitespace-nowrap">
                            {item.credit ?? 0}
                          </td>
                          <td className="px-3 sm:px-4 py-3 font-semibold text-red-500 dark:text-[#ff4d6d] whitespace-nowrap">
                            {item.debit ?? 0}
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-gray-600 dark:text-[#9ca3af] whitespace-nowrap">
                            {item.transType || "-"}
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-gray-600 dark:text-[#9ca3af] max-w-[150px] truncate">
                            {item.remark || "-"}
                          </td>
                          <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                item.status === "Success" ||
                                item.status === "Approved" ||
                                item.status === "Completed"
                                  ? "bg-green-100 dark:bg-[rgba(16,185,129,0.2)] text-green-700 dark:text-[#34d399]"
                                  : item.status === "Pending"
                                  ? "bg-amber-100 dark:bg-[rgba(251,191,36,0.2)] text-amber-700 dark:text-[#fbbf24]"
                                  : "bg-red-100 dark:bg-[rgba(255,77,109,0.2)] text-red-700 dark:text-[#ff4d6d]"
                              }`}
                            >
                              {item.status || "-"}
                            </span>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={getColSpan()}
                      className="text-center py-12 text-gray-500 dark:text-[#6b7280] text-sm"
                    >
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {!loading && filteredData.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-5 border-t border-gray-200 dark:border-[rgba(255,255,255,0.06)]">
            <p className="text-sm text-gray-500 dark:text-[#6b7280]">
              Page{" "}
              <strong className="text-gray-700 dark:text-[#eef2ff]">
                {currentPage}
              </strong>{" "}
              of {totalPages || 1}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 sm:px-5 py-2 rounded-full border border-gray-200 dark:border-[rgba(255,255,255,0.07)] bg-white dark:bg-[#10222e] text-gray-700 dark:text-[#eef2ff] text-sm font-medium transition-all hover:bg-gray-50 dark:hover:bg-[rgba(255,255,255,0.04)] hover:border-teal-500 dark:hover:border-[#2fd9d3] hover:text-teal-500 dark:hover:text-[#2fd9d3] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 sm:px-5 py-2 rounded-full border border-gray-200 dark:border-[rgba(255,255,255,0.07)] bg-white dark:bg-[#10222e] text-gray-700 dark:text-[#eef2ff] text-sm font-medium transition-all hover:bg-gray-50 dark:hover:bg-[rgba(255,255,255,0.04)] hover:border-teal-500 dark:hover:border-[#2fd9d3] hover:text-teal-500 dark:hover:text-[#2fd9d3] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletStatement;