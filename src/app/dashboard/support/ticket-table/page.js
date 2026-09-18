"use client";
import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  getAllTicketBYURID,
  getAdminReplyCount,
  updateAdminReplyCount,
} from "@/app/redux/slices/UserticketSlice";
import { getEncryptedLocalData } from "@/app/api/auth";
import TicketDetailModal from "./TicketDetailModal";
import ViewTicketModal from "../view-detail-modal/ViewTicketModal";

export default function TicketTable() {
  const dispatch = useDispatch();
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const { getAllTicketDataNew, adminReplyCounts } =
    useSelector((state) => state.userticket) || {};

  const ticketData = useMemo(
    () => getAllTicketDataNew || [],
    [getAllTicketDataNew]
  );

  useEffect(() => {
    if (!isLoaded) {
      dispatch(getAllTicketBYURID());
      setIsLoaded(true);
    }
  }, [dispatch, isLoaded]);

  useEffect(() => {
    if (ticketData.length > 0) {
      ticketData.forEach((ticket) => {
        if (ticket.StatusType === "Open") {
          dispatch(
            getAdminReplyCount({ ticketId: ticket.TicketId })
          );
        }
      });
    }
  }, [dispatch, ticketData]);

  useEffect(() => {
    if (adminReplyCounts) {
      const existingCounts = JSON.parse(
        localStorage.getItem("replyCounts") || "{}"
      );
      const updatedCounts = { ...existingCounts, ...adminReplyCounts };
      localStorage.setItem("replyCounts", JSON.stringify(updatedCounts));
    }
  }, [adminReplyCounts]);

  const columnHelper = createColumnHelper();

  const columns = useMemo(
    () => [
      columnHelper.accessor((row, idx) => idx + 1, {
        id: "sno",
        header: "S.No.",
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: "action",
        header: "Action",
        cell: (info) => {
          const row = info.row.original;
          const storedCounts = JSON.parse(
            localStorage.getItem("replyCounts") || "{}"
          );
          const replyCount =
            storedCounts[row.TicketId]?.adminReplyCount?.[0]?.ReplyCount || 0;

          return (
            <div className="relative flex items-center justify-center">
              {row.StatusType === "Open" && (
                <div className="relative inline-block">
                  <button
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-500 dark:from-blue-300 dark:to-blue-400 text-white dark:text-[#04131a] font-bold text-xs border-none cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(20,184,166,0.3)]"
                    onClick={async () => {
                      setSelectedTicket(row);
                      setModalOpen(true);

                      await dispatch(
                        updateAdminReplyCount({
                          ticketId: row.TicketId,
                        })
                      );

                      const updatedCounts = JSON.parse(
                        localStorage.getItem("replyCounts") || "{}"
                      );

                      updatedCounts[row.TicketId] = {
                        adminReplyCount: [{ ReplyCount: 0 }],
                      };

                      localStorage.setItem(
                        "replyCounts",
                        JSON.stringify(updatedCounts)
                      );

                      dispatch(getAllTicketBYURID());
                    }}
                  >
                    Reply
                  </button>

                  {replyCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none shadow-[0_2px_8px_rgba(255,48,64,0.4)] z-10">
                      {replyCount}
                    </span>
                  )}
                </div>
              )}
              {row.StatusType === "Closed" && (
                <button
                  className="px-4 py-1.5 rounded-xl border border-red-500/30 bg-transparent text-red-500 dark:text-red-400 font-bold text-xs cursor-pointer transition-all hover:bg-red-500/10 hover:-translate-y-0.5"
                  onClick={() => {
                    setSelectedTicket(row);
                    setViewModalOpen(true);
                  }}
                >
                  View Detail
                </button>
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor("TicketType", {
        header: "Ticket Type",
        cell: (info) =>
          info.getValue() === "Payment" ? "User Transfer" : info.getValue(),
      }),
      columnHelper.accessor("StatusType", {
        header: "Status",
        cell: (info) => (
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            info.getValue() === "Open" 
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-[#2ed99a] border border-green-200 dark:border-green-800" 
              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-[#f0708a] border border-red-200 dark:border-red-800"
          }`}>
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("Subject", {
        header: "Subject",
      }),
      columnHelper.accessor("CreatedDate", {
        header: "Time",
        cell: (info) => info.getValue() || "",
      }),
    ],
    []
  );

  const table = useReactTable({
    data: ticketData,
    columns,
    state: { globalFilter },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="mx-auto px-4 sm:px-6 py-6">
      <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl shadow-md overflow-hidden transition-all">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 sm:px-7 py-5 bg-gradient-to-r from-gray-50 to-white dark:from-[#0b1a24] dark:to-[#10222e] border-b border-gray-200 dark:border-[rgba(140,200,205,0.16)]">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-[#2fd9d3] dark:to-[#18c7c2] text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
              <line x1="8" y1="10" x2="16" y2="10" />
              <line x1="8" y1="14" x2="12" y2="14" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-[#eaf5f7] tracking-wide">Support Tickets</h1>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-[rgba(140,200,205,0.16)] to-transparent" />

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <select
                className="px-3 py-2 rounded-xl border border-gray-300 dark:border-[rgba(140,200,205,0.16)] bg-white dark:bg-[#142936] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-all"
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
              >
                {[10, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size} entries
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-300 dark:border-[rgba(140,200,205,0.16)] bg-white dark:bg-[#142936] focus-within:border-teal-500 dark:focus-within:border-teal-400 transition-all w-full sm:w-auto">
              <svg className="text-gray-400 dark:text-[#6b6359]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="search"
                className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-[#eaf5f7] text-sm placeholder:text-gray-400 dark:placeholder:text-[#4d626e]"
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search tickets..."
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-[rgba(140,200,205,0.16)]">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-50 dark:bg-[#142936] border-b border-gray-200 dark:border-[rgba(140,200,205,0.16)]">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap">
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center justify-center gap-1.5">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>
                        )}
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
                        <td key={cell.id} className="px-4 py-3 text-center text-gray-700 dark:text-[#eaf5f7] whitespace-nowrap">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-[#9db4be]">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 8v4M12 16h.01" />
                        </svg>
                        <p className="text-sm">No tickets found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-5 pt-4 border-t border-gray-200 dark:border-[rgba(140,200,205,0.1)]">
            <div className="text-sm text-gray-500 dark:text-[#9db4be]">
              {table.getFilteredRowModel().rows.length > 0
                ? `Showing ${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to ${Math.min(
                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                    table.getFilteredRowModel().rows.length
                  )} of ${table.getFilteredRowModel().rows.length} entries`
                : "No entries"}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-[rgba(140,200,205,0.16)] bg-white dark:bg-[#142936] text-gray-600 dark:text-[#9db4be] text-sm hover:bg-gray-100 dark:hover:bg-[rgba(255,255,255,0.05)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                «
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-[rgba(140,200,205,0.16)] bg-white dark:bg-[#142936] text-gray-600 dark:text-[#9db4be] text-sm hover:bg-gray-100 dark:hover:bg-[rgba(255,255,255,0.05)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                ‹
              </button>
              <span className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-[#eaf5f7]">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
              </span>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-[rgba(140,200,205,0.16)] bg-white dark:bg-[#142936] text-gray-600 dark:text-[#9db4be] text-sm hover:bg-gray-100 dark:hover:bg-[rgba(255,255,255,0.05)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                ›
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-[rgba(140,200,205,0.16)] bg-white dark:bg-[#142936] text-gray-600 dark:text-[#9db4be] text-sm hover:bg-gray-100 dark:hover:bg-[rgba(255,255,255,0.05)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modalOpen && selectedTicket && (
        <TicketDetailModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedTicket(null);
          }}
          ticket={selectedTicket}
        />
      )}
      {viewModalOpen && selectedTicket && (
        <ViewTicketModal
          open={viewModalOpen}
          ticket={selectedTicket}
          onClose={() => {
            setViewModalOpen(false);
            setSelectedTicket(null);
          }}
        />
      )}
    </div>
  );
}