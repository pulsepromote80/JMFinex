// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { getEncryptedLocalData } from "@/app/api/auth";
// import {
//   addTicketReplytest,
//   getTicketReplyByTicketId,
// } from "@/app/redux/slices/UserticketSlice";
// import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";
// import { X } from "lucide-react";

// export default function TicketDetailModal({ open, onClose, ticket }) {
//   const [reply, setReply] = useState("");
//   const [replies, setReplies] = useState([]);
//   const [user, setUser] = useState("");
//   const [userData, setUserData] = useState({});
//   const dispatch = useDispatch();
//   const { getTicketByTicketIdData } = useSelector((state) => state.userticket);

//   const modalRef = useRef();
//   useEffect(() => {
//     if (!open) return;

//     const handleKeyDown = (event) => {
//       if (event.key === "Escape") onClose();
//     };

//     document.addEventListener("keydown", handleKeyDown);
//     return () => document.removeEventListener("keydown", handleKeyDown);
//   }, [open, onClose]);

//   useEffect(() => {
//     const fName = getEncryptedLocalData("FName");
//     setUser(fName);
//     setUserData({ FName: fName });
//     const fetchData = async () => {
//       try {
//         await dispatch(getTicketReplyByTicketId(ticket.TicketId));
//       } catch (error) {
//         console.error("Error fetching ticket data:", error);
//       }
//     };
//     fetchData();
//   }, [dispatch, ticket?.TicketId]);

//   if (!open || !ticket) return null;

//   const ticketIndexZero = getTicketByTicketIdData?.ticket[0] || {};
//   const handleReply = async (e) => {
//     e.preventDefault();
//     const urid = getEncryptedLocalData("UserId");
//     try {
//       const data = {
//         ticketId: ticketIndexZero.TicketId,
//         createdBy: urid,
//         message: reply,
//         status: 1,
//         seen: 1,
//         imageFile: null,
//       };

//       await dispatch(addTicketReplytest(data)).unwrap();
//       setReply("");
//       await dispatch(getTicketReplyByTicketId(ticket.TicketId));
//     } catch (err) {
//       console.error("Failed to submit reply:", err);
//     }
//   };

//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffInMinutes = Math.floor((now - date) / (1000 * 60));

//     if (diffInMinutes < 60) {
//       return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
//     }

//     const diffInHours = Math.floor(diffInMinutes / 60);
//     if (diffInHours < 24) {
//       return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
//     }

//     const diffInDays = Math.floor(diffInHours / 24);
//     return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
//   };

//   const allMessages = [
//     ...(getTicketByTicketIdData?.replies?.length
//       ? getTicketByTicketIdData.replies.map((item) => ({
//         id: item.id,
//         message: item.Message,
//         timestamp: item.ReplyDate,
//         Name: item.Name,
//         Status: item.Status,
//         user: item.appUserId ? "User" : "Admin",
//       }))
//       : []),
//     ...replies,
//   ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

//   return (
//     <div
//       className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
//       onMouseDown={(event) => {
//         if (event.target === event.currentTarget) onClose();
//       }}
//     >
//       <div
//         ref={modalRef}
//         className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-sky-500/20 bg-[#081922] shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
//         role="dialog"
//         aria-modal="true"
//       >
//         {/* Close Button */}
//         <button
//           className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 hover:text-white"
//           onClick={onClose}
//           aria-label="Close ticket details"
//         >
//           <X className="w-4 h-4" />
//         </button>

//         {/* Title */}
//         <h2 className="border-b border-white/10 px-6 py-5 text-2xl font-bold text-white">
//           Ticket Details
//         </h2>

//         <div className="max-h-[80vh] overflow-y-auto p-6">
//           {/* Ticket Info */}
//           <div className="grid gap-4 md:grid-cols-2">
//             <div className="rounded-xl border border-white/10 bg-white/5 p-3">
//               <p className="text-[11px] uppercase tracking-[0.18em] text-sky-200/70">User</p>
//               <p className="mt-2 text-sm font-semibold text-white">{ticketIndexZero.UserName || "N/A"}</p>
//             </div>

//             <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-left md:text-right">
//               <p className="text-[11px] uppercase tracking-[0.18em] text-sky-200/70">Type</p>
//               <p className="mt-2 text-sm font-semibold text-white">{ticketIndexZero.TicketType || "N/A"}</p>
//             </div>

//             <div className="rounded-xl border border-white/10 bg-white/5 p-3">
//               <p className="text-[11px] uppercase tracking-[0.18em] text-sky-200/70">Subject</p>
//               <p className="mt-2 text-sm font-semibold text-white">{ticketIndexZero.Subject || "N/A"}</p>
//             </div>

//             <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-left md:text-right">
//               <p className="text-[11px] uppercase tracking-[0.18em] text-sky-200/70">Time</p>
//               <p className="mt-2 text-sm font-semibold text-white">{ticketIndexZero.CreatedDate || "N/A"}</p>
//             </div>

//             <div className="md:col-span-2 rounded-xl border border-white/10 bg-white/5 p-3 text-left md:text-right">
//               <p className="text-[11px] uppercase tracking-[0.18em] text-sky-200/70">Status</p>
//               <span
//                 className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
//                   ticketIndexZero.StatusType?.toLowerCase() === "open"
//                     ? "border border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
//                     : "border border-red-400/40 bg-red-500/10 text-red-300"
//                 }`}
//               >
//                 <span
//                   className={`h-2 w-2 rounded-full ${
//                     ticketIndexZero.StatusType?.toLowerCase() === "open" ? "bg-emerald-400" : "bg-red-400"
//                   }`}
//                 />
//                 {ticketIndexZero.StatusType || "N/A"}
//               </span>
//             </div>
//           </div>

//           {/* Image */}
//           {ticketIndexZero.ImagePath && (
//             <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-3">
//               <img
//                 src={ticketIndexZero.ImagePath}
//                 alt="Ticket"
//                 className="h-28 w-28 rounded-lg object-cover border border-white/10"
//               />
//             </div>
//           )}

//           {/* Conversation */}
//           <div className="mt-5 rounded-2xl border border-white/10 bg-[#0d1f2b] p-4">
//             <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-sky-200/80">Conversation</h3>

//             <div className="flex max-h-[260px] flex-col gap-3 overflow-y-auto rounded-xl border border-white/10 bg-[#0b1923] p-3">
//               {allMessages.length > 0 ? (
//                 allMessages.map((message, index) => {
//                   const isUser = message.Status === 1;

//                   return (
//                     <div
//                       key={message.id || index}
//                       className={`flex ${isUser ? "justify-end" : "justify-start"}`}
//                     >
//                       <div
//                         className={`max-w-[80%] rounded-2xl border px-3 py-2 ${
//                           isUser
//                             ? "border-sky-400/30 bg-gradient-to-r from-[#174a61] to-[#0d3d4d] text-white"
//                             : "border-white/10 bg-[#112635] text-slate-200"
//                         }`}
//                       >
//                         {!isUser && (
//                           <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-300/80">
//                             {message.Name || "Admin"}
//                           </p>
//                         )}

//                         <p
//                           className="break-words whitespace-pre-line text-sm leading-6 text-current"
//                           dangerouslySetInnerHTML={{ __html: message.message }}
//                         />

//                         <span className={`mt-2 block text-[10px] ${isUser ? "text-right text-sky-200/80" : "text-left text-gray-400"}`}>
//                           {message.timestamp || ""}
//                         </span>
//                       </div>
//                     </div>
//                   );
//                 })
//               ) : (
//                 <p className="py-8 text-center text-sm text-slate-400">No conversation found</p>
//               )}
//             </div>
//           </div>

//           {/* Reply Form */}
//           <form onSubmit={handleReply} className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
//             <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-sky-200/75">Activity</label>

//             <textarea
//               className="w-full rounded-xl border border-white/10 bg-[#0d1f2b] px-3 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/20"
//               rows={3}
//               value={reply}
//               onChange={(e) => setReply(e.target.value)}
//               placeholder="Type your reply..."
//               required
//             />

//             <div className="mt-4 flex justify-end">
//               <button
//                 type="submit"
//                 disabled={!reply.trim()}
//                 className="rounded-xl bg-gradient-to-r from-[#49d9d0] to-[#1ea7c1] px-4 py-2.5 text-sm font-bold text-[#04131a] shadow-[0_10px_20px_rgba(52,211,153,0.25)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 Send Reply
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";
import React, { useState, useEffect, useRef } from "react";
import { getEncryptedLocalData } from "@/app/api/auth";
import {
  addTicketReplytest,
  getTicketReplyByTicketId,
} from "@/app/redux/slices/UserticketSlice";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";

export default function TicketDetailModal({ open, onClose, ticket }) {
  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState([]);
  const [user, setUser] = useState("");
  const [userData, setUserData] = useState({});
  const dispatch = useDispatch();
  const { getTicketByTicketIdData } = useSelector((state) => state.userticket);

  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    const fName = getEncryptedLocalData("FName");
    setUser(fName);
    setUserData({ FName: fName });
    const fetchData = async () => {
      try {
        await dispatch(getTicketReplyByTicketId(ticket.TicketId));
      } catch (error) {
        console.error("Error fetching ticket data:", error);
      }
    };
    fetchData();
  }, [dispatch, ticket?.TicketId]);

  if (!open || !ticket) return null;

  const ticketIndexZero = getTicketByTicketIdData?.ticket[0] || {};

  const handleReply = async (e) => {
    e.preventDefault();
    const urid = getEncryptedLocalData("UserId");
    try {
      const data = {
        ticketId: ticketIndexZero.TicketId,
        createdBy: urid,
        message: reply,
        status: 1,
        seen: 1,
        imageFile: null,
      };
      await dispatch(addTicketReplytest(data)).unwrap();
      setReply("");
      await dispatch(getTicketReplyByTicketId(ticket.TicketId));
    } catch (err) {
      console.error("Failed to submit reply:", err);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  };

  const allMessages = [
    ...(getTicketByTicketIdData?.replies?.length
      ? getTicketByTicketIdData.replies.map((item) => ({
          id: item.id,
          message: item.Message,
          timestamp: item.ReplyDate,
          Name: item.Name,
          Status: item.Status,
          user: item.appUserId ? "User" : "Admin",
        }))
      : []),
    ...replies,
  ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const isOpenStatus =
    ticketIndexZero.StatusType?.toLowerCase() === "open";

  const hasValidImage = (() => {
    const imagePath = ticketIndexZero.ImagePath;
    if (!imagePath) return false;
    if (typeof imagePath !== "string") return false;
    const trimmed = imagePath.trim();
    if (!trimmed) return false;
    if (trimmed === "NaN" || trimmed === "null" || trimmed === "undefined") return false;
    if (!trimmed.startsWith("http") && !trimmed.startsWith("/")) return false;
    if (trimmed.includes("/NaN") || trimmed.endsWith("/NaN")) return false;
    return true;
  })();

  return (
    <div
      className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-gray-200 p-6 sm:p-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5">
          Ticket Details
        </h2>

        {/* Ticket Info */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-6">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-0.5">
              User
            </p>
            <p className="text-sm font-medium text-gray-900">
              {ticketIndexZero.UserName || "N/A"}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-0.5">
              Type
            </p>
            <p className="text-sm font-medium text-gray-900">
              {ticketIndexZero.TicketType || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-0.5">
              Subject
            </p>
            <p className="text-sm font-medium text-gray-900">
              {ticketIndexZero.Subject || "N/A"}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-0.5">
              Time
            </p>
            <p className="text-sm font-medium text-gray-900">
              {ticketIndexZero.CreatedDate || "N/A"}
            </p>
          </div>

          <div className="col-span-2 text-right">
            <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">
              Status
            </p>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                isOpenStatus
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isOpenStatus ? "bg-green-500" : "bg-red-500"
                }`}
              />
              {ticketIndexZero.StatusType || "N/A"}
            </span>
          </div>
        </div>

        {/* Image */}
        {hasValidImage && (
          <div className="mb-5 rounded-xl overflow-hidden border border-gray-200">
            <img
              src={ticketIndexZero.ImagePath}
              alt="Ticket"
              className="w-full max-h-72 object-contain bg-gray-50"
            />
          </div>
        )}

        {/* Conversation */}
        <div className="mb-5">
          <h3 className="text-base font-semibold text-gray-900 mb-3">
            Conversation
          </h3>

          <div className="max-h-80 overflow-y-auto flex flex-col gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
            {allMessages.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No messages yet.
              </p>
            )}

            {allMessages.map((message, index) => {
              const isUser = message.Status === 1;
              return (
                <div
                  key={message.id || index}
                  className={`flex ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                      isUser
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                    }`}
                  >
                    {!isUser && (
                      <p className="text-[11px] font-semibold text-gray-500 mb-1">
                        {message.Name || "Admin"}
                      </p>
                    )}

                    <p
                      className="leading-relaxed break-words"
                      dangerouslySetInnerHTML={{ __html: message.message }}
                    />

                    <span
                      className={`block mt-1.5 text-[10px] ${
                        isUser ? "text-blue-100 text-right" : "text-gray-400 text-left"
                      }`}
                    >
                      {message.timestamp || ""}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reply Form */}
        <form onSubmit={handleReply} className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Activity
          </label>

          <textarea
            rows={2}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your reply..."
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition"
          />

          <button
            type="submit"
            disabled={!reply.trim()}
            className="self-end px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Send Reply
          </button>
        </form>
      </div>
    </div>
  );
}