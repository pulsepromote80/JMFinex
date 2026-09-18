"use client";
import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getUserId } from "@/app/api/auth";
import { GetDirectMember } from "@/app/redux/slices/fundManagerSlice";
import { getUserSummaryDetails } from "@/app/redux/slices/authSlice";

import DownlineMember from "./downline-member/page";
import BinaryTree from "../binarytree/page";
import IntelligentTreeView from "../intelligent-tree-view/page";

const TeamReferral = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("team");
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);

    const { GetDirectMemberData, loading, error } = useSelector(
        (state) => state?.fund || {}
    );

    const [teamStatus, setTeamStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const tabLabels = {
        Summary: "Summary",
        team: "Direct Team",
        // binarytree: "Tree View",
        Downline: "Downline Team",
        AffiliateTree: "Affiliate Tree",
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const STATUS_OPTIONS = [
        { value: "all", label: "All Team" },
        { value: "active", label: "Active Team" },
        { value: "inactive", label: "Inactive Team" },
    ];

    const userId = getUserId();
    const teamParams = {
        statusId: "",
        loginid: "",
    };

    useEffect(() => {
        dispatch(GetDirectMember(teamParams));
    }, [dispatch]);

    // Fetch Dashboard Data when Summary tab is clicked
    useEffect(() => {
        if (activeTab === "Summary") {
            const fetchDashboardDetails = async () => {
                setIsLoadingDashboard(true);
                try {
                    const result = await dispatch(getUserSummaryDetails()).unwrap();
                    if (result) {
                        setDashboardData(result);
                    }
                } catch (error) {
                    console.error("Failed to fetch dashboard details:", error);
                } finally {
                    setIsLoadingDashboard(false);
                }
            };
            fetchDashboardDetails();
        }
    }, [activeTab, dispatch]);

    useEffect(() => {
        setCurrentPage(1);
    }, [teamStatus, searchTerm]);

    const teamMembers = GetDirectMemberData?.data || [];

    const filteredTeamMembers = teamMembers
        ?.filter((member) => {
            const topupStatus = member.topup?.toString().trim().toLowerCase();
            if (teamStatus === "active") return topupStatus === "activated";
            if (teamStatus === "inactive") return topupStatus !== "activated";
            return true;
        })
        .filter((member) => {
            if (!searchTerm.trim()) return true;
            const searchLower = searchTerm.toLowerCase().trim();
            return (
                (member.name && member.name.toLowerCase().includes(searchLower)) ||
                (member.loginid && member.loginid.toLowerCase().includes(searchLower)) ||
                (member.mobile && member.mobile.toLowerCase().includes(searchLower)) ||
                (member.email && member.email.toLowerCase().includes(searchLower)) ||
                (member.position && member.position.toLowerCase().includes(searchLower)) ||
                (member.topup && member.topup.toLowerCase().includes(searchLower))
            );
        });

    const totalPages = Math.ceil(filteredTeamMembers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentMembers = filteredTeamMembers.slice(startIndex, endIndex);

    const handlePrevious = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    return (
        <div className="mx-auto px-4 sm:px-6 py-6">
            {/* Tabs */}
            <div className="overflow-x-auto">
                <div className="flex gap-1 bg-gray-100 dark:bg-[#142936] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-xl p-1 mb-6 min-w-max">
                    {["Summary", "team", "Downline", "AffiliateTree"].map((tab) => (
                        <button
                            key={tab}
                            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                                activeTab === tab
                                    ? "bg-gradient-to-r from-blue-400 to-blue-400 text-white shadow-md shadow-blue-500/25"
                                    : "text-gray-600 dark:text-[#9db4be] hover:bg-gray-200 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
                            }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tabLabels[tab]}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === "binarytree" ? (
                <BinaryTree />
            ) : activeTab === "AffiliateTree" ? (
                <IntelligentTreeView />
            ) : activeTab === "Downline" ? (
                <DownlineMember isDownline={true} />
            ) : activeTab === "Summary" ? (
                <div className="summary-section">
                    {isLoadingDashboard ? (
                        <div className="text-center py-10">
                            <div className="text-lg text-gray-500 dark:text-[#9db4be]">
                                Loading network status...
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl shadow-sm p-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">

                                {/* Box 1 — Direct Network (with Active Direct Ids) */}
                                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-[#142936] rounded-2xl border border-gray-200 dark:border-[rgba(140,200,205,0.1)] min-w-[200px]">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 dark:text-amber-400">
                                        🎯
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-gray-900 dark:text-[#eaf5f7]">
                                            Direct Network
                                        </div>
                                        <div className="flex flex-col gap-1 text-[11px] text-gray-500 dark:text-[#9db4be]">
                                            <div>
                                                Direct Ids:{" "}
                                                <span className="text-gray-700 dark:text-[#eaf5f7]">
                                                    {dashboardData?.[0]?.DirectIds || 0}
                                                </span>
                                            </div>
                                            <div>
                                                Active Direct Ids:{" "}
                                                <span className="text-gray-700 dark:text-[#eaf5f7]">
                                                    {dashboardData?.[0]?.ActiveDirectIds || 0}
                                                </span>
                                            </div>
                                            <div>
                                                Direct Business:{" "}
                                                <span className="text-gray-700 dark:text-[#eaf5f7]">
                                                    $
                                                    {(
                                                        dashboardData?.[0]?.DirectBusiness ??
                                                        dashboardData?.[0]?.DirectBussiness ??
                                                        0
                                                    ).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Box 2 — Team Performance */}
                                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-[#142936] rounded-2xl border border-gray-200 dark:border-[rgba(140,200,205,0.1)] min-w-[200px]">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400">
                                        ◀
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-gray-900 dark:text-[#eaf5f7]">
                                            Team Performance
                                        </div>
                                        <div className="flex flex-col gap-1 text-[11px] text-gray-500 dark:text-[#9db4be]">
                                            <div>
                                                Total Team:{" "}
                                                <span className="text-gray-700 dark:text-[#eaf5f7]">
                                                    {dashboardData?.[0]?.TotalTeam || 0}
                                                </span>
                                            </div>
                                            <div>
                                                Active Team:{" "}
                                                <span className="text-gray-700 dark:text-[#eaf5f7]">
                                                    {dashboardData?.[0]?.ActiveTeam || 0}
                                                </span>
                                            </div>
                                            <div>
                                                Team Business:{" "}
                                                <span className="text-gray-700 dark:text-[#eaf5f7]">
                                                    ${(dashboardData?.[0]?.Teambusiness || 0).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Box 3 — Strong Leg Analytics */}
                                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-[#142936] rounded-2xl border border-gray-200 dark:border-[rgba(140,200,205,0.1)] min-w-[200px]">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-green-50 dark:bg-green-900/20 text-green-500 dark:text-green-400">
                                        ▶
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-gray-900 dark:text-[#eaf5f7]">
                                            Team Business
                                        </div>
                                        <div className="flex flex-col gap-1 text-[11px] text-gray-500 dark:text-[#9db4be]">
                                            <div>
                                                Biggest Leg Id:{" "}
                                                <span className="text-gray-700 dark:text-[#eaf5f7]">
                                                    {dashboardData?.[0]?.BiggestLegID || 0}
                                                </span>
                                            </div>
                                            <div>
                                                Biggest Leg Business:{" "}
                                                <span className="text-gray-700 dark:text-[#eaf5f7]">
                                                    ${(dashboardData?.[0]?.BiggestLegBuss || 0).toFixed(2)}
                                                </span>
                                            </div>
                                            <div>
                                                Second Leg Id:{" "}
                                                <span className="text-gray-700 dark:text-[#eaf5f7]">
                                                    {dashboardData?.[0]?.SecondLegID || 0}
                                                </span>
                                            </div>
                                            <div>
                                                Second Leg Business:{" "}
                                                <span className="text-gray-700 dark:text-[#eaf5f7]">
                                                    ${(dashboardData?.[0]?.SecondLegBuss || 0).toFixed(2)}
                                                </span>
                                            </div>
                                            <div>
                                                Other Leg Business:{" "}
                                                <span className="text-gray-700 dark:text-[#eaf5f7]">
                                                    ${(dashboardData?.[0]?.OtherLegBus || 0).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {/* Filter Card */}
                    <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl shadow-sm p-5 mb-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                Direct Referral Team
                            </div>
                            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
                                <select
                                    value={teamStatus}
                                    onChange={(e) => setTeamStatus(e.target.value)}
                                    className="px-3 py-2 bg-white dark:bg-[#142936] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none cursor-pointer"
                                >
                                    {STATUS_OPTIONS.map((level) => (
                                        <option key={level.value} value={level.value}>
                                            {level.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Search Input */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search by Name, Login ID, Mobile, Email..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-3 rounded-xl border border-[#D6E5F5] dark:border-[#1D4F91] bg-[#F7FBFF] dark:bg-[#10223F] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-[#0057D9] dark:focus:border-[#38BDF8] transition-all placeholder-gray-400 dark:placeholder-gray-500"
                        />
                    </div>

                    {/* Team Members Table */}
                        <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(56,189,248,0.18)] rounded-2xl shadow-sm overflow-hidden">
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
                                    <div className="inline-block w-8 h-8 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                                </div>
                            ) : (
                                          <>
                                    <div className="overflow-x-auto">
                                        <div className="inline-block min-w-full align-middle">
                                            <table className="w-full text-sm border-collapse">
                                                <thead className="bg-[#F1F7FD] dark:bg-[#10223F] border-b border-[#D6E5F5] dark:border-[rgba(56,189,248,0.16)]">
                                                    <tr>
                                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap">Sr No</th>
                                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap">Name</th>
                                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap">Login ID</th>
                                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">Mobile</th>
                                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap hidden md:table-cell">Email</th>
                                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap hidden md:table-cell">Reg. Date</th>
                                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap">Package</th>
                                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap hidden md:table-cell">Topup Date</th>
                                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap hidden md:table-cell">Team Business</th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentMembers && currentMembers.length > 0 ? (
                                                        currentMembers.map((member, index) => (
                                                            <tr
                                                                key={member.id}
                                                                className="border-b border-gray-100 dark:border-[rgba(56,189,248,0.08)] hover:bg-[#F7FBFF] dark:hover:bg-[rgba(56,189,248,0.06)] transition-colors"
                                                            >
                                                                <td className="px-4 py-3 text-center text-gray-700 dark:text-[#eaf5f7] whitespace-nowrap">
                                                                    <span className="font-bold text-[#0057D9] dark:text-[#38BDF8]">
                                                                        {startIndex + index + 1}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3 text-center text-gray-700 dark:text-[#eaf5f7] whitespace-nowrap">
                                                                    <span className="font-bold text-[#0057D9] dark:text-[#38BDF8]">
                                                                        {member.name}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3 text-center text-gray-500 dark:text-[#9db4be] whitespace-nowrap">
                                                                    {member.loginid || member.id}
                                                                </td>
                                                                <td className="px-4 py-3 text-center text-gray-500 dark:text-[#9db4be] whitespace-nowrap hidden lg:table-cell">
                                                                    {member.mobile || "N/A"}
                                                                </td>
                                                                <td className="px-4 py-3 text-center text-gray-500 dark:text-[#9db4be] whitespace-nowrap hidden md:table-cell">
                                                                    {member.email || "N/A"}
                                                                </td>
                                                                <td className="px-4 py-3 text-center text-gray-500 dark:text-[#9db4be] whitespace-nowrap hidden md:table-cell">
                                                                    {member.regDate || "Null"}
                                                                </td>
                                                                <td className="px-4 py-3 text-center text-gray-500 dark:text-[#9db4be] whitespace-nowrap">
                                                                    ${member.package ? Number(member.package).toFixed(3) : "0.000"}
                                                                </td>
                                                                <td className="px-4 py-3 text-center text-gray-500 dark:text-[#9db4be] whitespace-nowrap hidden md:table-cell">
                                                                    {member.topupDate || "Null"}
                                                                </td>
                                                                <td className="px-4 py-3 text-center text-gray-500 dark:text-[#9db4be] whitespace-nowrap hidden md:table-cell">
                                                                    ${member.teambusiness || "0"}
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
                                                                    ? `No team members found for "${searchTerm}"`
                                                                    : "No team members found"}
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Pagination */}
                                    {filteredTeamMembers?.length > 0 && (
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 pt-4 border-t border-gray-200 dark:border-[rgba(140,200,205,0.1)]">
                                            <div className="text-sm text-gray-500 dark:text-[#9db4be]">
                                                Showing {startIndex + 1} to{" "}
                                                {Math.min(endIndex, filteredTeamMembers?.length)} of{" "}
                                                {filteredTeamMembers?.length} members
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
                                                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-[#9db4be]">
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
                </>
            )}
        </div>
    );
};

export default TeamReferral;