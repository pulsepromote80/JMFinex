
// "use client";
// import React, { useEffect } from "react";
// import { 
//   RiMoneyDollarCircleLine, 
//   RiFlashlightLine, 
//   RiBatteryChargeLine,
//   RiMedalLine,
//   RiTrophyLine,
//   RiGeminiLine,
//   RiStarLine,
//   RiShieldStarLine,
//   RiAwardLine,
//   RiDiamondLine
// } from "react-icons/ri";
// import { useDispatch, useSelector } from "react-redux";
// import { getrankAchivement } from "@/app/redux/slices/walletSlice";
// import { getUserId } from "@/app/api/auth";

// const Achievement = () => {
//   const dispatch = useDispatch();
//   const { AchivementListData } = useSelector((state) => state.wallet);


//   // Get the first object (MANAGER) for stats - or find the qualified one
//   const firstRank = AchivementListData?.leaderShip?.[0] || {};
  
//   // Find the current qualified rank (Statusx === "Qualify")
//   const currentQualifiedRank = AchivementListData?.leaderShip?.find(
//     (rank) => rank.Statusx === "Qualify"
//   ) || firstRank;
  
//   // Find the next rank (first "Not Qualify" after qualified ranks)
//   const nextRank = AchivementListData?.leaderShip?.find(
//     (rank) => rank.Statusx === "Not Qualify"
//   );

//   const achievedReward = firstRank?.YourRank || "—";
//   const leftBusiness = firstRank?.LeftBuss || 0;
//   const rightBusiness = firstRank?.RightBuss || 0;
  
//   // For next rank requirement - show MatchingBussReq from next rank
//   const nextRankRequired = nextRank?.MatchingBussReq || "—";
//   const currentBusiness = Math.max(leftBusiness, rightBusiness);
//   const businessNeeded = nextRankRequired !== "—" 
//     ? Math.max(0, parseFloat(nextRankRequired.replace(/,/g, '')) - currentBusiness)
//     : "—";

//   const salaryweakerLegBusinesId = AchivementListData?.leaderShip?.[0]?.PendingRight || "";
//   const legwisefreshbus = AchivementListData?.leaderShip?.[0]?.PendingLeft || "";
  
//   useEffect(() => {
//     const data = getUserId();
//     dispatch(getrankAchivement(data));
//   }, [dispatch]);

//   const formatCurrency = (value) => {
//     if (!value && value !== 0) return "$0";
//     const num = typeof value === "string" ? parseFloat(value) : value;
//     if (isNaN(num)) return "$0";
//     return `$${num.toLocaleString()}`;
//   };

//   const formatBusinessValue = (value) => {
//     if (!value && value !== 0) return "0";
//     if (typeof value === "string") return value;
//     return value.toLocaleString();
//   };

//   // Function to get icon based on rank title
//   const getRankIcon = (rankTitle, status) => {
//     const iconProps = { 
//       className: `rank-icon ${status === "Qualify" ? "qualified-icon" : "not-qualify-icon"}`,
//       size: 20
//     };
    
//     switch(rankTitle?.toUpperCase()) {
//       case "MANAGER":
//         return <RiMedalLine {...iconProps} />;
//       case "BRONZE":
//         return <RiShieldStarLine {...iconProps} />;
//       case "SILVER":
//         return <RiStarLine {...iconProps} />;
//       case "GOLD":
//         return <RiTrophyLine {...iconProps} />;
//       case "RUBY":
//         return <RiGeminiLine {...iconProps} />;
//       case "PLATINUM":
//         return <RiAwardLine {...iconProps} />;
//       case "DIAMOND":
//         return <RiDiamondLine {...iconProps} />;
//       default:
//         return <RiMedalLine {...iconProps} />;
//     }
//   };

//   return (
//     <div className="reward-dashboard">
//       <div className="stats-grid">
//         {/* Achieved Reward Card */}
//         <div className="it bg-p gl gl-p">
//           <div className="stat-card-content">
//             <div>
//               <p className="stat-label">Achieved Rank</p>
//               <p className="it-val">{achievedReward}</p>
//             </div>
//             <div className="stat-icon purple-bg">
//               <RiFlashlightLine className="stat-icon-svg purple" />
//             </div>
//           </div>
//         </div>

//         {/* Left/Right Business Card */}
//         <div className="it bg-p gl gl-p">
//           <div className="stat-card-content">
//             <div className="stat-text-wrapper">
//               <p className="stat-label">Left / Right Business</p>
//               <p className="it-val">
//                 {formatCurrency(leftBusiness)} / {formatCurrency(rightBusiness)}
//               </p>
//             </div>
//             <div className="stat-icon pink-bg">
//               <RiBatteryChargeLine className="stat-icon-svg pink" />
//             </div>
//           </div>
//         </div>

//         {/* Business Needed For Next Rank */}
//         <div className="it bg-p gl gl-p">
//           <div className="stat-card-content">
//             <div className="stat-text-wrapper">
//               <p className="stat-label">Business Needed For Next Rank (L/R)</p>
//               <p className="it-val">{formatCurrency(legwisefreshbus)} / {formatCurrency(salaryweakerLegBusinesId)}</p>
//             </div>
//             <div className="stat-icon red-bg">
//               <RiMoneyDollarCircleLine className="stat-icon-svg red" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Ranks Table */}
//      <div className="card">
//         <table className="data-table">
//           <thead className="table-header">
//             <tr>
//               <th className="table-header-cell">#</th>
//               <th className="table-header-cell">Title</th>
//               <th className="table-header-cell">Required Business</th>
//               <th className="table-header-cell">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {AchivementListData?.leaderShip?.length > 0 ? (
//               AchivementListData.leaderShip.map((rank, index) => (
//                 <tr key={index} className="table-row">
//                   <td className="td-cell">{index + 1}</td>
//                   <td className="td-cell rank-name">
//                     <div className="rank-title-container">
//                       {rank.RankIcon && (
//                         <img 
//                           src={rank.RankIcon} 
//                           alt={rank.LRank} 
//                           className="rank-icon-img"
//                           style={{ width: '30px', height: '30px' }}
//                         />
//                       )}
//                       <span>{rank.LRank}</span>
//                     </div>
//                   </td>
//                   <td className="td-cell">${rank.MatchingBussReq}</td>
//                   <td className="td-cell">
//                     <span className={`status-badge ${rank.Statusx === "Qualify" ? "qualify" : "not-qualify"}`}>
//                       {rank.Statusx}
//                     </span>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4" className="empty-row">
//                   No rank achievement data available
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div> 
//     </div>
//   );
// };

// export default Achievement;



"use client";
import React, { useEffect } from "react";
import { 
  RiMoneyDollarCircleLine, 
  RiFlashlightLine, 
  RiBatteryChargeLine,
  RiMedalLine,
  RiTrophyLine,
  RiGeminiLine,
  RiStarLine,
  RiShieldStarLine,
  RiAwardLine,
  RiDiamondLine
} from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { getrankAchivement } from "@/app/redux/slices/walletSlice";
import { getUserId } from "@/app/api/auth";

const Achievement = () => {
  const dispatch = useDispatch();
  const { AchivementListData } = useSelector((state) => state.wallet);

  const firstRank = AchivementListData?.leaderShip?.[0] || {};
  const currentQualifiedRank = AchivementListData?.leaderShip?.find(
    (rank) => rank.Statusx === "Qualify"
  ) || firstRank;
  const nextRank = AchivementListData?.leaderShip?.find(
    (rank) => rank.Statusx === "Not Qualify"
  );

  const achievedReward = firstRank?.YourRank || "—";
  const leftBusiness = firstRank?.LeftBuss || 0;
  const rightBusiness = firstRank?.RightBuss || 0;
  const nextRankRequired = nextRank?.MatchingBussReq || "—";
  const currentBusiness = Math.max(leftBusiness, rightBusiness);
  const businessNeeded = nextRankRequired !== "—" 
    ? Math.max(0, parseFloat(nextRankRequired.replace(/,/g, '')) - currentBusiness)
    : "—";

  const salaryweakerLegBusinesId = AchivementListData?.leaderShip?.[0]?.PendingRight || "";
  const legwisefreshbus = AchivementListData?.leaderShip?.[0]?.PendingLeft || "";
  
  useEffect(() => {
    const data = getUserId();
    dispatch(getrankAchivement(data));
  }, [dispatch]);

  const formatCurrency = (value) => {
    if (!value && value !== 0) return "$0";
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return "$0";
    return `$${num.toLocaleString()}`;
  };

  const formatBusinessValue = (value) => {
    if (!value && value !== 0) return "0";
    if (typeof value === "string") return value;
    return value.toLocaleString();
  };

  const getRankIcon = (rankTitle, status) => {
    const iconProps = { 
      className: `w-5 h-5 ${status === "Qualify" ? "text-amber-500 dark:text-amber-400" : "text-gray-400 dark:text-gray-500"}`,
      size: 20
    };
    
    switch(rankTitle?.toUpperCase()) {
      case "MANAGER": return <RiMedalLine {...iconProps} />;
      case "BRONZE": return <RiShieldStarLine {...iconProps} />;
      case "SILVER": return <RiStarLine {...iconProps} />;
      case "GOLD": return <RiTrophyLine {...iconProps} />;
      case "RUBY": return <RiGeminiLine {...iconProps} />;
      case "PLATINUM": return <RiAwardLine {...iconProps} />;
      case "DIAMOND": return <RiDiamondLine {...iconProps} />;
      default: return <RiMedalLine {...iconProps} />;
    }
  };

  return (
    <div className="mx-auto px-4 sm:px-6 py-6">
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
                {achievedReward}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-purple-100 dark:bg-purple-900/30">
              <RiFlashlightLine className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Left/Right Business Card */}
        <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider mb-1.5">
                Left / Right Business
              </p>
              <p className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-[#eaf5f7]">
                {formatCurrency(leftBusiness)} / {formatCurrency(rightBusiness)}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-pink-100 dark:bg-pink-900/30">
              <RiBatteryChargeLine className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </div>
          </div>
        </div>

        {/* Business Needed For Next Rank */}
        <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider mb-1.5">
                Business Needed For Next Rank (L/R)
              </p>
              <p className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-[#eaf5f7]">
                {formatCurrency(legwisefreshbus)} / {formatCurrency(salaryweakerLegBusinesId)}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-red-100 dark:bg-red-900/30">
              <RiMoneyDollarCircleLine className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Ranks Table */}
      <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50 dark:bg-[#142936] border-b border-gray-200 dark:border-[rgba(140,200,205,0.1)]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap">Required Business</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-wider whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {AchivementListData?.leaderShip?.length > 0 ? (
                AchivementListData.leaderShip.map((rank, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-[rgba(140,200,205,0.06)] hover:bg-gray-50 dark:hover:bg-[rgba(47,217,211,0.04)] transition-colors">
                    <td className="px-4 py-3 text-gray-700 dark:text-[#eaf5f7] whitespace-nowrap">{index + 1}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-[#eaf5f7] whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        {rank.RankIcon && (
                          <img 
                            src={rank.RankIcon} 
                            alt={rank.LRank} 
                            className="w-8 h-8 object-contain"
                          />
                        )}
                        <span>{rank.LRank}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-[#eaf5f7] whitespace-nowrap">${rank.MatchingBussReq}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        rank.Statusx === "Qualify"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-[#2ed99a] border border-green-200 dark:border-green-800"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-[#f0708a] border border-red-200 dark:border-red-800"
                      }`}>
                        {rank.Statusx}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-gray-500 dark:text-[#9db4be]">
                    No rank achievement data available
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

export default Achievement;