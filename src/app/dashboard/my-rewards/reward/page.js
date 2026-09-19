"use client";
import React, { useEffect } from "react";
import { RiMoneyDollarCircleLine, RiFlashlightLine, RiBatteryChargeLine } from "react-icons/ri";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useDispatch, useSelector } from "react-redux";
import { getPerformanceRewardListByURID } from "@/app/redux/slices/walletSlice";
import { getUserId } from "@/app/api/auth";

const Reward = () => {
  const dispatch = useDispatch();
  const { PerformanceRewardListData } = useSelector((state) => state.wallet);


  const salaryStrongLeg = PerformanceRewardListData?.performanceReward?.[0]?.RewardAchvd || "";
  const salarystrongLegBusines = PerformanceRewardListData?.performanceReward?.[0]?.BiggestLeg || "";
  const salaryweakerLegBusines = PerformanceRewardListData?.performanceReward?.[0]?.BiggestLegPending || "";
  const salarystrongLegBusinesId = PerformanceRewardListData?.performanceReward?.[0]?.Pending2ndLegTeam || "";
  const salaryweakerLegBusinesId = PerformanceRewardListData?.performanceReward?.[0]?.PendingOtherTeam || "";
  const legwisefreshbus = PerformanceRewardListData?.performanceReward?.[0]?.SecondLeg || "";
   const otherleg = PerformanceRewardListData?.performanceReward?.[0]?.OtherLegBusines || "";
  const remainingDirectBus = PerformanceRewardListData?.performanceReward?.[0]?.RemainingDirectBus || "";
  const NextReleaseDate = PerformanceRewardListData?.performanceReward?.[0]?.NextReleaseDate || "";

  useEffect(() => {
    const data = getUserId();
    dispatch(getPerformanceRewardListByURID(data));
  }, [dispatch]);

  // ✅ Export to Excel functionality
  const exportToExcel = () => {
    if (!PerformanceRewardListData?.performanceReward) return;
    const excelData = PerformanceRewardListData.performanceReward.map((rank) => ({
      Rank: rank.rRank,
      "Business Volume": rank.BusinessVolume,
      "Monthly Salary Duration": rank.MonthlySalaryDuration,
      "Speedy Reward": rank.SpeedyReward,
      Status: rank.Statusx,
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Performance Income");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Performance_Income_Report.xlsx");
  };

  

  return (
    <div className="mx-auto px-2 sm:px-6 py-6">


      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Achieved Rank Card */}
        <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider mb-1.5">
                Achieved Rank
              </p>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-[#eaf5f7]">
                {salaryStrongLeg || "—"}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-purple-100 dark:bg-purple-900/30">
              <RiFlashlightLine className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Power Team / Weaker Team Business Card */}
        <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider mb-1.5">
                Strong Leg Bus.
              </p>
              <p className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-[#eaf5f7]">
                {(salarystrongLegBusines || "—")}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-pink-100 dark:bg-pink-900/30">
              <RiBatteryChargeLine className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </div>
          </div>
        </div>

        {/* Pending Power / Weaker Team Business Card */}
        <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider mb-1.5">
                Second Leg Bus.
              </p>
              <p className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-[#eaf5f7]">
                {(legwisefreshbus || "—")} 
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-red-100 dark:bg-red-900/30">
              <RiMoneyDollarCircleLine className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider mb-1.5">
                Other Leg Bus.
              </p>
              <p className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-[#eaf5f7]">
                {(otherleg || "0")}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-red-100 dark:bg-red-900/30">
              <RiMoneyDollarCircleLine className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

         <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider mb-1.5">
                Strong Leg Pending
              </p>
              <p className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-[#eaf5f7]">
                {(salaryweakerLegBusines || "0")}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-red-100 dark:bg-red-900/30">
              <RiMoneyDollarCircleLine className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

         <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider mb-1.5">
                Second Leg Pending
              </p>
              <p className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-[#eaf5f7]">
                {(salarystrongLegBusinesId || "0")}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-red-100 dark:bg-red-900/30">
              <RiMoneyDollarCircleLine className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
         <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider mb-1.5">
                Other Leg Pending
              </p>
              <p className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-[#eaf5f7]">
                {(salaryweakerLegBusinesId || "0")}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-red-100 dark:bg-red-900/30">
              <RiMoneyDollarCircleLine className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

       
      </div>

      {/* Performance Ranks Table */}
      <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50 dark:bg-[#142936] border-b border-gray-200 dark:border-[rgba(140,200,205,0.1)]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap">#</th>
                {/* ✅ Fixed typo: "Titile" → "Title" */}
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap">Team Business</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap">Reward</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {PerformanceRewardListData?.performanceReward?.length > 0 ? (
                PerformanceRewardListData.performanceReward.map((rank, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-[rgba(140,200,205,0.06)] hover:bg-gray-50 dark:hover:bg-[rgba(47,217,211,0.04)] transition-colors">
                    <td className="px-4 py-3 text-gray-700 dark:text-[#eaf5f7] whitespace-nowrap">{index + 1}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-[#eaf5f7] whitespace-nowrap">{rank.RewardTitle}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-[#eaf5f7] whitespace-nowrap">${rank.RequiredBusiness}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-[#eaf5f7] whitespace-nowrap">{rank.RewardAmount}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        rank.Statusx === "Qualify" || rank.Statusx === "Qualify "
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-[#2ed99a] border border-green-200 dark:border-green-800"
                          : rank.Statusx === "Not Qualify" || rank.Statusx === "NotQualify"
                          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-[#f0708a] border border-red-200 dark:border-red-800"
                          : "bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-600"
                      }`}>
                        {rank.Statusx}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500 dark:text-[#9db4be]">
                    No performance reward data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reward;