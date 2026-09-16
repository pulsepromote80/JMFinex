"use client";

import { useState, useMemo, useEffect } from "react";
import Loader from "@/app/user/components/Loader";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FaRegCopy } from "react-icons/fa";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";
import { getUsdtBalance, getSelfDepsiteDetailsByURID, sendUSDTDepositRequest } from "@/app/redux/slices/selfSlice";
import { getUserId } from "@/app/api/auth";
import { useDispatch, useSelector } from "react-redux";
import QRCode from "react-qr-code";

export default function SelfDeposit() {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const { usdtBalanceData, selfDepsiteDetailsData } = useSelector((state) => state.self);
  const usdtBalance = usdtBalanceData?.data?.usdtBalance || 0.0;
  const walletAddress = usdtBalanceData?.data?.walletAddress || "";
  const [copiedRowId, setCopiedRowId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = (value, rowId) => {
    try {
      navigator.clipboard
        .writeText(value)
        .then(() => {
          toast.success("Copied to clipboard!");
          setCopiedRowId(rowId);
          setTimeout(() => setCopiedRowId(null), 1000);
        })
        .catch(() => {
          toast.error("Failed to copy!");
        });
    } catch (err) {
      toast.error("Copy not supported!");
    }
  };

  useEffect(() => {
    dispatch(getUsdtBalance());
    dispatch(getSelfDepsiteDetailsByURID());
  }, [dispatch]);

  useEffect(() => {
    if (selfDepsiteDetailsData?.data && Array.isArray(selfDepsiteDetailsData.data)) {
      const formattedData = selfDepsiteDetailsData.data.map((item, index) => ({
        sno: index + 1,
        amount: item.usdAmount,
        status: item.status,
        date: item.creadtedDate,
        hash: item.transHash,
      }));
      setData(formattedData);
    }
  }, [selfDepsiteDetailsData]);

  const fnCopy = () => {
    toast.success("Wallet address copied to clipboard!");
    navigator.clipboard.writeText(walletAddress);
  };

  const handleClick = async () => {
    setIsLoading(true);

    try {
      if (usdtBalance < 10) {
        toast.error("Sorry, the minimum required deposit is $10. Please adjust your amount to continue.");
        return;
      }

      const result = await dispatch(sendUSDTDepositRequest()).unwrap();

      if (result.statusCode === 200) {
        toast.success(result.message || "Deposit request sent successfully!");
      } else {
        toast.error(result.message || "An error occurred while processing your deposit request.");
      }
    } catch (error) {
      console.error("Deposit error:", error);
      toast.error(error.message || "An error occurred while processing your deposit request.");
    } finally {
      setIsLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      { accessorKey: "sno", header: "#" },
      { accessorKey: "date", header: "Date" },
      { accessorKey: "amount", header: "Amount($)" },
      { accessorKey: "hash", header: "TransHash" },
      { accessorKey: "status", header: "Status" },
    ],
    []
  );

  const getStatusClasses = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800";
      case "Pending":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800";
      case "UnApproved":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800";
      default:
        return "bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-600";
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, pagination: { pageSize, pageIndex: 0 } },
    onPaginationChange: () => {},
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className=" mx-auto px-4 sm:px-6 py-6">
      {/* Deposit Card */}
      <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="flex flex-col lg:flex-row items-center justify-around gap-6 p-6">
          {/* QR Section */}
          <div className="flex-shrink-0 w-full max-w-xs">
            <div className="flex flex-col items-center mt-4">
              <div className="flex flex-col items-center">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                  <QRCode value={walletAddress} size={120} />
                </div>
                <p className="text-xs text-gray-500 dark:text-[#9db4be] mt-3 text-center">
                  Scan QR code to get wallet address
                </p>
              </div>

              <div className="flex flex-col items-center mt-5">
                <p className="text-lg font-bold text-gray-900 dark:text-[#eaf5f7]">
                  Deposit Balance: ${Number(usdtBalance || 0).toFixed(2)}
                </p>
              </div>

              <div className="text-center mt-6">
                <button
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold text-base transition-all disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto min-w-[150px]"
                  onClick={handleClick}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Processing
                    </>
                  ) : (
                    "Deposit"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="w-full lg:w-1/2 text-start">
            <div className="mb-4">
              <p className="text-[11px] font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.05em] pb-2">
                Network
              </p>
              <span className="inline-block px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-sm font-semibold text-blue-700 dark:text-blue-400">
                Binance Smart Chain
              </span>
            </div>

            <div className="mt-4">
              <p className="text-[11px] font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.05em] pb-2">
                Wallet Address
              </p>
              <div className="bg-gray-50 dark:bg-[#142936] px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-3">
                <span
                  className="text-sm font-mono text-gray-700 dark:text-[#eaf5f7] truncate"
                  title={walletAddress}
                >
                  {walletAddress}
                </span>
                <button
                  type="button"
                  onClick={fnCopy}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex-shrink-0"
                >
                  <FaRegCopy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <p className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-2.5">
                Important Notes:
              </p>
              <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 space-y-1.5">
                <li>Only send USDT to this address</li>
                <li>Make sure you are using the correct network</li>
                <li>Minimum deposit: $10 USD equivalent</li>
                <li>Deposits will be credited after network confirmation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Records Table */}
      <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-[#eaf5f7] mb-5">
            Fund Deposit Records
          </h1>

          {/* Table Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
            <div className="flex items-center gap-2">
              <select
                className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#142936] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  table.setPageSize(Number(e.target.value));
                }}
              >
                {[10, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label htmlFor="search" className="text-sm text-gray-600 dark:text-[#9db4be] font-medium">
                Search:
              </label>
              <input
                id="search"
                type="search"
                className="flex-1 sm:w-48 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#142936] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-all"
                placeholder="Search..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-50 dark:bg-[#142936] border-b border-gray-200 dark:border-[rgba(140,200,205,0.1)]">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 dark:border-[rgba(140,200,205,0.06)] hover:bg-gray-50 dark:hover:bg-[rgba(47,217,211,0.04)] transition-colors">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 text-gray-700 dark:text-[#eaf5f7] whitespace-nowrap">
                          {cell.column.id === "status" ? (
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(cell.getValue())}`}
                            >
                              {cell.getValue()}
                            </span>
                          ) : cell.column.id === "hash" ? (
                            <div className="relative inline-flex items-center gap-2 group">
                              <span className="font-mono text-gray-600 dark:text-gray-400">
                                {cell.getValue()?.slice(0, 15) + "..."}
                              </span>
                              <Copy
                                size={14}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors"
                                onClick={() => handleCopy(cell.getValue(), row.id)}
                                title={copiedRowId === row.id ? "Copied!" : "Copy"}
                              />
                              <span className="absolute bottom-full left-0 mb-2 px-2 py-1 text-xs font-mono bg-gray-900 dark:bg-gray-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {copiedRowId === row.id ? "Copied!" : cell.getValue()}
                              </span>
                            </div>
                          ) : cell.column.id === "amount" ? (
                            `$${cell.getValue()}`
                          ) : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-500 dark:text-[#9db4be]">
                      No data available in table
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-5 pt-4 border-t border-gray-200 dark:border-[rgba(140,200,205,0.1)]">
            <div className="text-sm text-gray-500 dark:text-[#9db4be]">
              Showing {table.getRowModel().rows.length} of {data.length} entries
            </div>
            <div className="flex items-center gap-1.5">
              <button
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#142936] text-gray-600 dark:text-[#9db4be] text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                «
              </button>
              <button
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#142936] text-gray-600 dark:text-[#9db4be] text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                ‹
              </button>
              <button
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#142936] text-gray-600 dark:text-[#9db4be] text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                ›
              </button>
              <button
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#142936] text-gray-600 dark:text-[#9db4be] text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}