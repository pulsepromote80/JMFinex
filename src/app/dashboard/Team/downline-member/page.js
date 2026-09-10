"use client";
import React, { useState, useEffect, useMemo } from "react";
import { ChevronRight, ChevronLeft, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AuthLogin } from "@/app/api/auth";
import { getPersonalTeamList } from "@/app/redux/slices/walletSlice";

const DownlineMember = ({ isDownline = false }) => {
    const dispatch = useDispatch();
    const authLogin = AuthLogin();

    const { personalTeamList, loading, error } = useSelector(
        (state) => state?.wallet || {}
    );

    const teamMembersRaw = personalTeamList || [];

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const itemsPerPage = 10;

    // Level options 1..25
    const levelOptions = useMemo(() => {
        const levels = [];
        for (let i = 1; i <= 25; i++) {
            levels.push({ value: i.toString(), label: `${i}` });
        }
        return levels;
    }, []);

    const fetchDownline = async (level = "") => {
        try {
            const authLoginValue = authLogin || authLogin?.urid || "";
            const requestBody = {
                authLogin: authLoginValue,
                lvl: level,
                statusId: "",
            };
            await dispatch(getPersonalTeamList(requestBody));
        } catch (error) {
            console.error("Error fetching downline:", error);
        }
    };

    useEffect(() => {
        fetchDownline(selectedLevel);
    }, [authLogin, selectedLevel]);

    const handleLevelChange = (e) => {
        const level = e.target.value;
        setSelectedLevel(level);
        setCurrentPage(1);
        fetchDownline(level);
    };

    // Filter members based on search term
    const filteredMembers = useMemo(() => {
        if (!searchTerm.trim()) return teamMembersRaw;

        const searchLower = searchTerm.toLowerCase().trim();
        return teamMembersRaw.filter((member) => {
            return (
                (member.Name && member.Name.toLowerCase().includes(searchLower)) ||
                (member.loginid && member.loginid.toLowerCase().includes(searchLower)) ||
                (member.SponserId && member.SponserId.toString().toLowerCase().includes(searchLower)) ||
                (member.Urid && member.Urid.toString().includes(searchLower))
            );
        });
    }, [teamMembersRaw, searchTerm]);

    const totalPages = Math.ceil(filteredMembers?.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentMembers = filteredMembers.slice(startIndex, endIndex);

    const handlePrevious = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const clearSearch = () => {
        setSearchTerm("");
        setCurrentPage(1);
    };

    return (
        <div className="mx-auto px-4 sm:px-6 py-6">
            {/* Header */}
            <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl shadow-sm p-5 mb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                        {isDownline ? "Downline Team" : "Direct Referral Team"}
                    </div>
                    <div className="relative">
                        <select
                            value={selectedLevel}
                            onChange={handleLevelChange}
                            className="px-4 py-2 pr-8 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#142936] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400 appearance-none cursor-pointer"
                        >
                            <option value="">Select Level</option>
                            {levelOptions.map((level) => (
                                <option key={level.value} value={level.value}>
                                    {level.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500">
                            ▼
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Box */}
            <div className="mb-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by Name, Login ID, or Sponsor ID..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full px-4 py-3 pl-11 pr-11 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#142936] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-all placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    {searchTerm && (
                        <button
                            onClick={clearSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-lg leading-none"
                        >
                            ✕
                        </button>
                    )}
                </div>
                {searchTerm && (
                    <div className="mt-2 text-sm text-gray-500 dark:text-[#9db4be]">
                        Found {filteredMembers.length} result(s) for "{searchTerm}"
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl shadow-sm overflow-hidden">
                {loading && (
                    <div className="p-4 text-gray-500 dark:text-[#9db4be]">
                        Loading team data...
                    </div>
                )}
                {error && (
                    <div className="p-4 text-red-500 dark:text-red-400">
                        Error: {error}
                    </div>
                )}
                <div className="p-4 sm:p-5">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="inline-block w-8 h-8 border-2 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <div className="inline-block min-w-full align-middle">
                                    <table className="w-full text-sm border-collapse">
                                        <thead className="bg-gray-50 dark:bg-[#142936] border-b border-gray-200 dark:border-[rgba(140,200,205,0.1)]">
                                            <tr>
                                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap">Sr No</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap">Login ID</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap">Country Flag</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap">Name</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap">Reg. Date</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">Topup Date</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap hidden xl:table-cell">Package</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap">Team Business</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap">Leadership Business</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentMembers && currentMembers.length > 0 ? (
                                                currentMembers.map((member, index) => (
                                                    <tr
                                                        key={member.Urid || index}
                                                        className="border-b border-gray-100 dark:border-[rgba(140,200,205,0.06)] hover:bg-gray-50 dark:hover:bg-[rgba(47,217,211,0.04)] transition-colors"
                                                    >
                                                        <td className="px-4 py-3 text-center text-gray-700 dark:text-[#eaf5f7] whitespace-nowrap">
                                                            {startIndex + index + 1}
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-gray-500 dark:text-[#9db4be] whitespace-nowrap">
                                                            {member.loginid || "-"}
                                                        </td>
                                                        <td className="px-4 py-3 text-center whitespace-nowrap">
                                                            <img
                                                                src={member.countryFlag || "/default-avatar.png"}
                                                                alt="User Avatar"
                                                                width="40"
                                                                height="40"
                                                                className="w-10 h-10 rounded-full object-cover inline-block"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-3 text-center font-bold text-teal-600 dark:text-teal-400 whitespace-nowrap">
                                                            {member.name || "-"}
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-gray-500 dark:text-[#9db4be] whitespace-nowrap">
                                                            {member.regDate || "-"}
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-gray-500 dark:text-[#9db4be] whitespace-nowrap hidden lg:table-cell">
                                                            {member.topupDate || "-"}
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-gray-500 dark:text-[#9db4be] whitespace-nowrap hidden xl:table-cell">
                                                            {member.package
                                                                ? `$${parseFloat(member.package).toLocaleString()}`
                                                                : "$0"}
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-gray-500 dark:text-[#9db4be] whitespace-nowrap">
                                                            ${Number(member.teambusiness || 0).toFixed(2)}
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-gray-500 dark:text-[#9db4be] whitespace-nowrap">
                                                            ${Number(member.leaseAmount || 0).toFixed(2)}
                                                        </td>
                                                        <td className="px-4 py-3 text-center whitespace-nowrap">
                                                            <span
                                                                className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                                                    member.Status === "Active"
                                                                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                                                                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
                                                                }`}
                                                            >
                                                                {member.status || "Active"}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="10"
                                                        className="px-4 py-8 text-center text-gray-500 dark:text-[#9db4be]"
                                                    >
                                                        {searchTerm
                                                            ? `No results found for "${searchTerm}"`
                                                            : "No team members found"}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Pagination */}
                            {filteredMembers?.length > 0 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 pt-4 border-t border-gray-200 dark:border-[rgba(140,200,205,0.1)]">
                                    <div className="text-sm text-gray-500 dark:text-[#9db4be]">
                                        Showing {startIndex + 1} to{" "}
                                        {Math.min(endIndex, filteredMembers?.length)} of{" "}
                                        {filteredMembers?.length} members
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handlePrevious}
                                            disabled={currentPage === 1}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#142936] text-gray-600 dark:text-[#9db4be] text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            <span className="hidden sm:inline">Previous</span>
                                        </button>
                                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-[#9db4be] px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600">
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {currentPage}
                                            </span>
                                            <span>/</span>
                                            <span>{totalPages}</span>
                                        </div>
                                        <button
                                            onClick={handleNext}
                                            disabled={currentPage === totalPages}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#142936] text-gray-600 dark:text-[#9db4be] text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <span className="hidden sm:inline">Next</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DownlineMember;