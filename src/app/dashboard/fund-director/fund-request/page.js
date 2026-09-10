// "use client";

// import { useState, useMemo, useCallback, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { FundRequestColumns, currencies } from "@/app/constants/funddirector.js";
// import { Copy } from "lucide-react";
// import { IoMdArrowBack } from "react-icons/io";
// import {
//   useReactTable,
//   getCoreRowModel,
//   getPaginationRowModel,
//   getFilteredRowModel,
//   getSortedRowModel,
//   flexRender,
// } from "@tanstack/react-table";
// import { useDispatch } from "react-redux";
// import {
//   addFundRequest,
//   getFundRequestReport,
// } from "@/app/redux/slices/fundManagerSlice";
// import toast from "react-hot-toast";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import { getUserId } from "@/app/api/auth";
// import QRCode from "react-qr-code";

// export default function FundRequest() {
//   const dispatch = useDispatch();
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [showForm, setShowForm] = useState(true);
//   const [urid, setUrid] = useState("");
//   const [formStep, setFormStep] = useState(1);
//   const [selectedCurrency, setSelectedCurrency] = useState(null);
//   const { getFundRequestReportData } = useSelector((state) => state.fund);
//   const [copiedRowId, setCopiedRowId] = useState(null);

//   const handleCopy = (value, rowId) => {
//     try {
//       navigator.clipboard
//         .writeText(value)
//         .then(() => {
//           toast.success("Copied to clipboard!");
//           setCopiedRowId(rowId);
//           setTimeout(() => setCopiedRowId(null), 1000);
//         })
//         .catch(() => {
//           toast.error("Failed to copy!");
//         });
//     } catch (err) {
//       toast.error("Copy not supported!");
//     }
//   };

//   const data = useMemo(() => {
//     if (!getFundRequestReportData?.fundRequests) return [];
//     return getFundRequestReportData.fundRequests.map((item, idx) => ({
//       id: idx + 1,
//       rf_Status: item.Rf_Status,
//       amount: `$${item.Amount}`,
//       date: item.PaymentDate,
//       adminRemark: item.AdminRemark,
//       transactionHash: item.RefrenceNo,
//       mode: currencies.find((c) => c.name === item.PaymentMode)?.name || "",
//     }));
//   }, [getFundRequestReportData]);

//   const columns = useMemo(() => FundRequestColumns, []);

//   const initialValues = {
//     paymentMode: "",
//     amount: "",
//     transactionHash: "",
//     remark: "",
//   };

//   const validationSchema = Yup.object({
//     paymentMode: Yup.string().required("Payment mode is required"),
//     amount: Yup.string()
//       .required("Amount is required")
//       .matches(
//         /^(?:\d{1,7})(?:\.\d{1,4})?$/,
//         "Please enter a valid amount. Only up to 7 digits before and 4 digits after decimal are allowed."
//       ),
//     transactionHash: Yup.string()
//       .required("Transaction hash is required")
//       .test(
//         "hashcode-length",
//         "Please Enter a Valid Hash Code",
//         function (value) {
//           return value && value.length >= 38 && value.length <= 70;
//         }
//       ),
//     remark: Yup.string(),
//   });

//   useEffect(() => {
//     const urid = getUserId();
//     setUrid(urid);
//     dispatch(getFundRequestReport());
//   }, [dispatch]);

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       globalFilter,
//     },
//     onGlobalFilterChange: setGlobalFilter,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//   });

//   const handlePaymentModeChange = (setFieldValue, value) => {
//     setFieldValue("paymentMode", value);
//   };

//   const handleFormikSubmit = async (
//     values,
//     { setSubmitting, resetForm, setErrors }
//   ) => {
//     if (!selectedCurrency) {
//       toast.error("Please select a payment mode");
//       setSubmitting(false);
//       return;
//     }

//     const data = {
//       urid: urid,
//       paymentMode: selectedCurrency.name,
//       amount: values.amount,
//       refrenceNo: values.transactionHash,
//       depositDetails: selectedCurrency.walletAddress,
//       remark: values.remark,
//     };

//     try {
//       const result = await dispatch(addFundRequest(data)).unwrap();
//       if (result.statusCode === 200) {
//         toast.success("Fund Request Added Successfully");
//         dispatch(getFundRequestReport());
//         resetForm();
//         setFormStep(1);
//         setSelectedCurrency(null);
//       } else if (result.statusCode === 417) {
//         toast.error(result.message || "Minimum fund request amount is 10 dollar");
//       } else {
//         setErrors({
//           transactionHash: result?.message || "Unexpected error occurred.",
//         });
//       }
//     } catch (error) {
//       toast.error("Failed to add fund request");
//     }
//     setSubmitting(false);
//   };

//   const fnCopy = () => {
//     if (selectedCurrency && selectedCurrency.walletAddress) {
//       navigator.clipboard.writeText(selectedCurrency.walletAddress);
//       toast.success("Wallet Address Copied to clipboard");
//     } else {
//       toast.error("No wallet address to copy");
//     }
//   };

//   const handleSearchChange = useCallback((e) => {
//     setGlobalFilter(String(e.target.value));
//   }, []);

//   const handlePageSizeChange = useCallback(
//     (e) => {
//       table.setPageSize(Number(e.target.value));
//     },
//     [table]
//   );

//   const getStatusClasses = (rf_Status) => {
//     switch (rf_Status) {
//       case "Approved":
//         return "status-approved";
//       case "Reject":
//       case "UnApproved":
//         return "status-rejected";
//       case "Rejected":
//         return "status-pending";
//       default:
//         return "";
//     }
//   };

//   return (
//     <div className="">
//       <div className="fund-request-wrapper">
//         <div className="fund-request-card">
//           <div className="fund-request-card-body">
//             {showForm ? (
//               <Formik
//                 initialValues={initialValues}
//                 validationSchema={validationSchema}
//                 onSubmit={handleFormikSubmit}
//               >
//                 {({
//                   values,
//                   setFieldValue,
//                   isSubmitting,
//                   isValid,
//                   handleChange,
//                   errors,
//                   touched,
//                 }) => (
//                   <Form>
//                     {formStep === 1 ? (
//                       <div className="form-step-1">
//                         {selectedCurrency ? (
//                           <div className="selected-currency-container">
//                             <div className="selected-currency-content">
//                               <div className="qr-code-section">
//                                 <QRCode
//                                   value={selectedCurrency?.walletAddress}
//                                   size={120}
//                                   className="qr-code"
//                                 />
//                                 <p className="qr-code-text">
//                                   Scan QR code to get wallet address
//                                 </p>
//                               </div>
//                               <div className="wallet-info-section">
//                                 <div>
//                                   <h1 className="wallet-info-label">
//                                     Selected Payment Mode
//                                   </h1>
//                                   <div className="wallet-info-value">
//                                     <span className="payment-mode-badge">
//                                       {selectedCurrency.name}
//                                     </span>
//                                   </div>
//                                   <div className="mt-3">
//                                     <h1 className="wallet-info-label">
//                                       Network
//                                     </h1>
//                                     <div className="wallet-info-value">
//                                       <span className="network-badge">
//                                         {selectedCurrency.network}
//                                       </span>
//                                     </div>
//                                   </div>
//                                 </div>
//                                 <div className="wallet-address-section">
//                                   <p className="wallet-address-label">
//                                     Wallet Address
//                                   </p>
//                                   <div className="wallet-address-box">
//                                     <p className="wallet-address-text">
//                                       {currencies.find(
//                                         (currency) =>
//                                           currency.name === selectedCurrency.name
//                                       )?.walletAddress ||
//                                         "Wallet address not found"}
//                                     </p>
//                                     <div className="copy-button-wrapper">
//                                       <button
//                                         type="button"
//                                         onClick={fnCopy}
//                                         className="copy-address-btn"
//                                       >
//                                         Copy Address
//                                       </button>
//                                     </div>
//                                   </div>
//                                 </div>
//                                 <div className="important-notes">
//                                   <p className="notes-title">
//                                     Important Notes:
//                                   </p>
//                                   <ul className="notes-list">
//                                     <li>Only send USDT to this address</li>
//                                     <li>
//                                       Make sure you are using the correct
//                                       network
//                                     </li>
//                                     <li>
//                                       Minimum deposit: $10 USD equivalent
//                                     </li>
//                                     <li>
//                                       Deposits will be credited after network
//                                       confirmation
//                                     </li>
//                                   </ul>
//                                 </div>
//                               </div>
//                               <button
//                                 type="button"
//                                 onClick={() => setSelectedCurrency(null)}
//                                 className="back-button"
//                               >
//                                 <IoMdArrowBack />
//                                 Back
//                               </button>
//                             </div>
//                             <div className="deposit-button-container">
//                               <button
//                                 type="button"
//                                 className="deposit-button"
//                                 onClick={() => {
//                                   setFormStep(2);
//                                 }}
//                               >
//                                 I&apos;ve Made the Transfer
//                               </button>
//                             </div>
//                           </div>
//                         ) : (
//                           <div className="payment-mode-selection">
//                             <label
//                               className="payment-mode-label"
//                               htmlFor="PaymentMode"
//                             >
//                               Payment Mode
//                             </label>
//                             <div className="currencies-grid">
//                               {currencies.map((currency, idx) => (
//                                 <div
//                                   key={idx}
//                                   onClick={() => {
//                                     setSelectedCurrency(currency);
//                                     handlePaymentModeChange(
//                                       setFieldValue,
//                                       currency.name
//                                     );
//                                   }}
//                                   className={`currency-card ${
//                                     selectedCurrency === currency.name
//                                       ? "currency-card-selected"
//                                       : ""
//                                   }`}
//                                 >
//                                   {currency.icon}
//                                   <div>
//                                     <p className="currency-name">
//                                       {currency.name}
//                                     </p>
//                                     <p className="currency-network">
//                                       {currency.network}
//                                     </p>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     ) : (
//                       <div className="form-step-2">
//                         <div className="form-step-2-content">
//                           <div className="step-2-header">
//                             <div>
//                               <label className="step-2-label">
//                                 Selected Currency
//                               </label>
//                               <div className="selected-currency-badge">
//                                 {selectedCurrency?.name}
//                               </div>
//                             </div>
//                             <button
//                               type="button"
//                               onClick={() => setFormStep(1)}
//                               className="back-button-step2"
//                             >
//                               <IoMdArrowBack />
//                               Back
//                             </button>
//                           </div>

//                           <div className="form-field">
//                             <label className="form-label">
//                               Amount Sent *
//                             </label>
//                             <input
//                               type="number"
//                               name="amount"
//                               value={values.amount}
//                               min={0}
//                               step="0.0001"
//                               onKeyDown={(e) => {
//                                 if (["e", "E", "+", "-"].includes(e.key)) {
//                                   e.preventDefault();
//                                 }
//                               }}
//                               onChange={(e) => {
//                                 const input = e.target.value;
//                                 if (input === "") {
//                                   setFieldValue("amount", "");
//                                   return;
//                                 }
//                                 const regex = /^\d{0,7}(\.\d{0,4})?$/;
//                                 if (regex.test(input)) {
//                                   setFieldValue("amount", input);
//                                 }
//                               }}
//                               placeholder="Enter the amount you sent"
//                               className="form-input"
//                             />
//                             {errors.amount && touched.amount && (
//                               <div className="error-message">
//                                 {errors.amount}
//                               </div>
//                             )}
//                           </div>

//                           <div className="form-field">
//                             <label className="form-label">
//                               Transaction Hash *
//                             </label>
//                             <input
//                               type="text"
//                               name="transactionHash"
//                               value={values.transactionHash}
//                               onChange={handleChange}
//                               maxLength={70}
//                               placeholder="Enter your transaction hash/ID"
//                               className="form-input"
//                             />
//                             {errors.transactionHash &&
//                               touched.transactionHash && (
//                                 <div className="error-message">
//                                   {errors.transactionHash}
//                                 </div>
//                               )}
//                             <p className="form-hint">
//                               You can find the transaction hash in your
//                               wallet&apos;s transaction history
//                             </p>
//                           </div>

//                           <div className="next-steps-box">
//                             <h1 className="next-steps-title">Next Steps:</h1>
//                             <p>• We will verify your transaction on the blockchain</p>
//                             <p>• Your funds will be credited within 1–24 hours</p>
//                             <p>• You'll receive a confirmation email once processed</p>
//                             <p>• Contact support if you need assistance</p>
//                           </div>

//                           <button
//                             className="submit-deposit-btn"
//                             type="submit"
//                             disabled={isSubmitting}
//                           >
//                             {isSubmitting ? "Submitting..." : "Submit Deposit"}
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </Form>
//                 )}
//               </Formik>
//             ) : (
//               <div className="add-fund-button-container">
//                 <button
//                   type="button"
//                   className="add-fund-btn"
//                   onClick={() => {
//                     setShowForm(true);
//                     setFormStep(1);
//                   }}
//                 >
//                   Add Fund Request
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="fund-request-table-container">
//         <div className="fund-request-table-wrapper">
//           <h1 className="table-title">Fund Request List</h1>
//           <div className="table-controls">
//             <div className="page-size-selector">
//               <select
//                 className="page-size-select"
//                 value={table.getState().pagination.pageSize}
//                 onChange={handlePageSizeChange}
//               >
//                 {[10, 25, 50, 100].map((pageSize) => (
//                   <option key={pageSize} value={pageSize}>
//                     {pageSize}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="search-container">
//               <label className="search-label">Search:</label>
//               <input
//                 type="search"
//                 className="search-input"
//                 value={globalFilter ?? ""}
//                 onChange={handleSearchChange}
//                 placeholder="Search..."
//               />
//             </div>
//           </div>

//           <div className="table-responsive">
//             <table className="data-table">
//               <thead className="table-header">
//                 {table.getHeaderGroups().map((headerGroup) => (
//                   <tr key={headerGroup.id}>
//                     {headerGroup.headers.map((header) => (
//                       <th key={header.id} className="table-header-cell">
//                         {header.isPlaceholder ? null : (
//                           <div className="header-content">
//                             {flexRender(
//                               header.column.columnDef.header,
//                               header.getContext()
//                             )}
//                           </div>
//                         )}
//                       </th>
//                     ))}
//                   </tr>
//                 ))}
//               </thead>
//               <tbody>
//                 {table.getRowModel().rows.length > 0 ? (
//                   table.getRowModel().rows.map((row) => (
//                     <tr key={row.id} className="table-row">
//                       {row.getVisibleCells().map((cell) => (
//                         <td key={cell.id} className="table-cell">
//                           {cell.column.id === "rf_Status" ? (
//                             <span
//                               className={`status-badge ${getStatusClasses(
//                                 cell.getValue()
//                               )}`}
//                             >
//                               {cell.getValue()}
//                             </span>
//                           ) : cell.column.id === "transactionHash" ? (
//                             <span className="hash-container">
//                               <span className="hash-text">
//                                 {cell.getValue()?.slice(0, 10)}...
//                               </span>
//                               <Copy
//                                 size={14}
//                                 className="copy-icon"
//                                 onClick={() =>
//                                   handleCopy(cell.getValue(), row.id)
//                                 }
//                                 title={
//                                   copiedRowId === row.id ? "Copied!" : "Copy"
//                                 }
//                               />
//                               <span className="hash-tooltip">
//                                 {copiedRowId === row.id
//                                   ? "Copied!"
//                                   : cell.getValue()}
//                               </span>
//                             </span>
//                           ) : (
//                             flexRender(
//                               cell.column.columnDef.cell,
//                               cell.getContext()
//                             )
//                           )}
//                         </td>
//                       ))}
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={columns.length} className="no-data-cell">
//                       No data available in table
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <div className="pagination-container">
//             <div className="entries-info">
//               Showing {table.getRowModel().rows.length} of {data.length} entries
//             </div>
//             <div className="pagination-controls">
//               <button
//                 className="pagination-btn"
//                 onClick={() => table.setPageIndex(0)}
//                 disabled={!table.getCanPreviousPage()}
//               >
//                 «
//               </button>
//               <button
//                 className="pagination-btn"
//                 onClick={() => table.previousPage()}
//                 disabled={!table.getCanPreviousPage()}
//               >
//                 ‹
//               </button>
//               <button
//                 className="pagination-btn"
//                 onClick={() => table.nextPage()}
//                 disabled={!table.getCanNextPage()}
//               >
//                 ›
//               </button>
//               <button
//                 className="pagination-btn"
//                 onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//                 disabled={!table.getCanNextPage()}
//               >
//                 »
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { FundRequestColumns, currencies } from "@/app/constants/funddirector.js";
import { Copy } from "lucide-react";
import { IoMdArrowBack } from "react-icons/io";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useDispatch } from "react-redux";
import {
  addFundRequest,
  getFundRequestReport,
} from "@/app/redux/slices/fundManagerSlice";
import toast from "react-hot-toast";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { getUserId } from "@/app/api/auth";
import QRCode from "react-qr-code";

export default function FundRequest() {
  const dispatch = useDispatch();
  const [globalFilter, setGlobalFilter] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [urid, setUrid] = useState("");
  const [formStep, setFormStep] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const { getFundRequestReportData } = useSelector((state) => state.fund);
  const [copiedRowId, setCopiedRowId] = useState(null);

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

  const data = useMemo(() => {
    if (!getFundRequestReportData?.fundRequests) return [];
    return getFundRequestReportData.fundRequests.map((item, idx) => ({
      id: idx + 1,
      rf_Status: item.Rf_Status,
      amount: `$${item.Amount}`,
      date: item.PaymentDate,
      adminRemark: item.AdminRemark,
      transactionHash: item.RefrenceNo,
      mode: currencies.find((c) => c.name === item.PaymentMode)?.name || "",
    }));
  }, [getFundRequestReportData]);

  const columns = useMemo(() => FundRequestColumns, []);

  const initialValues = {
    paymentMode: "",
    amount: "",
    transactionHash: "",
    remark: "",
  };

  const validationSchema = Yup.object({
    paymentMode: Yup.string().required("Payment mode is required"),
    amount: Yup.string()
      .required("Amount is required")
      .matches(
        /^(?:\d{1,7})(?:\.\d{1,4})?$/,
        "Please enter a valid amount. Only up to 7 digits before and 4 digits after decimal are allowed."
      ),
    transactionHash: Yup.string()
      .required("Transaction hash is required")
      .test(
        "hashcode-length",
        "Please Enter a Valid Hash Code",
        function (value) {
          return value && value.length >= 38 && value.length <= 70;
        }
      ),
    remark: Yup.string(),
  });

  useEffect(() => {
    const urid = getUserId();
    setUrid(urid);
    dispatch(getFundRequestReport());
  }, [dispatch]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handlePaymentModeChange = (setFieldValue, value) => {
    setFieldValue("paymentMode", value);
  };

  const handleFormikSubmit = async (
    values,
    { setSubmitting, resetForm, setErrors }
  ) => {
    if (!selectedCurrency) {
      toast.error("Please select a payment mode");
      setSubmitting(false);
      return;
    }

    const data = {
      urid: urid,
      paymentMode: selectedCurrency.name,
      amount: values.amount,
      refrenceNo: values.transactionHash,
      depositDetails: selectedCurrency.walletAddress,
      remark: values.remark,
    };

    try {
      const result = await dispatch(addFundRequest(data)).unwrap();
      if (result.statusCode === 200) {
        toast.success("Fund Request Added Successfully");
        dispatch(getFundRequestReport());
        resetForm();
        setFormStep(1);
        setSelectedCurrency(null);
      } else if (result.statusCode === 417) {
        toast.error(result.message || "Minimum fund request amount is 10 dollar");
      } else {
        setErrors({
          transactionHash: result?.message || "Unexpected error occurred.",
        });
      }
    } catch (error) {
      toast.error("Failed to add fund request");
    }
    setSubmitting(false);
  };

  const fnCopy = () => {
    if (selectedCurrency && selectedCurrency.walletAddress) {
      navigator.clipboard.writeText(selectedCurrency.walletAddress);
      toast.success("Wallet Address Copied to clipboard");
    } else {
      toast.error("No wallet address to copy");
    }
  };

  const handleSearchChange = useCallback((e) => {
    setGlobalFilter(String(e.target.value));
  }, []);

  const handlePageSizeChange = useCallback(
    (e) => {
      table.setPageSize(Number(e.target.value));
    },
    [table]
  );

  const getStatusClasses = (rf_Status) => {
    switch (rf_Status) {
      case "Approved":
        return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800";
      case "Reject":
      case "UnApproved":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800";
      case "Rejected":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800";
      default:
        return "bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-600";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Fund Request Card */}
      <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="p-6 sm:p-7">
          {showForm ? (
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleFormikSubmit}
            >
              {({
                values,
                setFieldValue,
                isSubmitting,
                isValid,
                handleChange,
                errors,
                touched,
              }) => (
                <Form className="w-full">
                  {formStep === 1 ? (
                    // Step 1: Select Payment Mode
                    <div className="w-full">
                      {selectedCurrency ? (
                        // Selected Currency Details
                        <div className="w-full">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 mb-7">
                            {/* QR Code Section */}
                            <div className="text-center p-5 bg-gray-50 dark:bg-[#142936] rounded-2xl border border-gray-200 dark:border-[rgba(140,200,205,0.16)]">
                              <div className="bg-white dark:bg-gray-800 p-3 rounded-xl inline-block mb-3">
                                <QRCode
                                  value={selectedCurrency?.walletAddress}
                                  size={120}
                                  className="mx-auto"
                                />
                              </div>
                              <p className="text-xs text-gray-500 dark:text-[#9db4be]">
                                Scan QR code to get wallet address
                              </p>
                            </div>

                            {/* Wallet Info Section */}
                            <div className="flex-1">
                              <div>
                                <p className="text-[11px] font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.05em] mb-1.5">
                                  Selected Payment Mode
                                </p>
                                <div className="mb-4">
                                  <span className="inline-block px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 text-sm font-semibold text-purple-700 dark:text-purple-400">
                                    {selectedCurrency.name}
                                  </span>
                                </div>
                                <div className="mb-4">
                                  <p className="text-[11px] font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.05em] mb-1.5">
                                    Network
                                  </p>
                                  <div>
                                    <span className="inline-block px-3 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800 text-sm font-semibold text-cyan-700 dark:text-cyan-400">
                                      {selectedCurrency.network}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Wallet Address */}
                              <div className="bg-gray-50 dark:bg-[#142936] rounded-xl p-4 mb-5">
                                <p className="text-[11px] font-semibold text-gray-500 dark:text-[#9db4be] mb-2">
                                  Wallet Address
                                </p>
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 break-all">
                                  <p className="text-sm text-teal-600 dark:text-teal-400 font-mono">
                                    {currencies.find(
                                      (currency) =>
                                        currency.name === selectedCurrency.name
                                    )?.walletAddress ||
                                      "Wallet address not found"}
                                  </p>
                                  <div className="flex justify-end mt-2">
                                    <button
                                      type="button"
                                      onClick={fnCopy}
                                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                      Copy Address
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Important Notes */}
                              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
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

                              <button
                                type="button"
                                onClick={() => setSelectedCurrency(null)}
                                className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-sm font-semibold hover:border-purple-500 dark:hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                              >
                                <IoMdArrowBack />
                                Back
                              </button>
                            </div>
                          </div>

                          {/* Deposit Button */}
                          <div className="text-center mt-5">
                            <button
                              type="button"
                              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold px-8 py-3.5 rounded-full text-base transition-all"
                              onClick={() => {
                                setFormStep(2);
                              }}
                            >
                              I&apos;ve Made the Transfer
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Payment Mode Selection
                        <div>
                          <label
                            className="text-sm font-semibold text-gray-600 dark:text-[#9db4be] mb-4 block"
                            htmlFor="PaymentMode"
                          >
                            Payment Mode
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {currencies.map((currency, idx) => (
                              <div
                                key={idx}
                                onClick={() => {
                                  setSelectedCurrency(currency);
                                  handlePaymentModeChange(
                                    setFieldValue,
                                    currency.name
                                  );
                                }}
                                className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all hover:-translate-y-0.5 ${
                                  selectedCurrency === currency.name
                                    ? "border-2 border-teal-500 dark:border-teal-400 bg-teal-50 dark:bg-teal-900/20"
                                    : "border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#142936] hover:border-purple-500 dark:hover:border-purple-400"
                                }`}
                              >
                                <span className="text-2xl">{currency.icon}</span>
                                <div>
                                  <p className="font-bold text-sm text-gray-900 dark:text-[#eaf5f7]">
                                    {currency.name}
                                  </p>
                                  <p className="text-[11px] text-gray-500 dark:text-[#9db4be]">
                                    {currency.network}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Step 2: Enter Transfer Details
                    <div className="w-full max-w-xl mx-auto">
                      <div className="flex justify-between items-center mb-7">
                        <div>
                          <p className="text-[11px] font-semibold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.05em] mb-1.5">
                            Selected Currency
                          </p>
                          <div className="inline-block px-4 py-1.5 rounded-full bg-teal-100 dark:bg-teal-900/30 text-sm font-semibold text-teal-700 dark:text-teal-400">
                            {selectedCurrency?.name}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormStep(1)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-sm font-semibold hover:border-purple-500 dark:hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                          <IoMdArrowBack />
                          Back
                        </button>
                      </div>

                      {/* Amount Field */}
                      <div className="mb-5">
                        <label className="text-sm font-semibold text-gray-700 dark:text-[#9db4be] block mb-2">
                          Amount Sent *
                        </label>
                        <input
                          type="number"
                          name="amount"
                          value={values.amount}
                          min={0}
                          step="0.0001"
                          onKeyDown={(e) => {
                            if (["e", "E", "+", "-"].includes(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          onChange={(e) => {
                            const input = e.target.value;
                            if (input === "") {
                              setFieldValue("amount", "");
                              return;
                            }
                            const regex = /^\d{0,7}(\.\d{0,4})?$/;
                            if (regex.test(input)) {
                              setFieldValue("amount", input);
                            }
                          }}
                          placeholder="Enter the amount you sent"
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#142936] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400 focus:shadow-[0_0_0_3px_rgba(20,184,166,0.1)] transition-all"
                        />
                        {errors.amount && touched.amount && (
                          <div className="mt-1.5 text-xs text-red-500 dark:text-red-400">
                            {errors.amount}
                          </div>
                        )}
                      </div>

                      {/* Transaction Hash Field */}
                      <div className="mb-5">
                        <label className="text-sm font-semibold text-gray-700 dark:text-[#9db4be] block mb-2">
                          Transaction Hash *
                        </label>
                        <input
                          type="text"
                          name="transactionHash"
                          value={values.transactionHash}
                          onChange={handleChange}
                          maxLength={70}
                          placeholder="Enter your transaction hash/ID"
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#142936] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400 focus:shadow-[0_0_0_3px_rgba(20,184,166,0.1)] transition-all"
                        />
                        {errors.transactionHash &&
                          touched.transactionHash && (
                            <div className="mt-1.5 text-xs text-red-500 dark:text-red-400">
                              {errors.transactionHash}
                            </div>
                          )}
                        <p className="mt-1.5 text-[11px] text-gray-500 dark:text-[#9db4be]">
                          You can find the transaction hash in your wallet&apos;s transaction history
                        </p>
                      </div>

                      {/* Next Steps Box */}
                      <div className="bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800 rounded-xl p-4 mb-7">
                        <h1 className="text-sm font-bold text-teal-700 dark:text-teal-400 mb-3">
                          Next Steps:
                        </h1>
                        <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                          <li>• We will verify your transaction on the blockchain</li>
                          <li>• Your funds will be credited within 1–24 hours</li>
                          <li>• You'll receive a confirmation email once processed</li>
                          <li>• Contact support if you need assistance</li>
                        </ul>
                      </div>

                      <button
                        className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold py-3.5 rounded-full text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Deposit"}
                      </button>
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          ) : (
            <div className="text-center">
              <button
                type="button"
                className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold px-8 py-3.5 rounded-full text-sm transition-all"
                onClick={() => {
                  setShowForm(true);
                  setFormStep(1);
                }}
              >
                Add Fund Request
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fund Request Table */}
      <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 sm:p-7">
          <h1 className="text-xl font-bold text-gray-900 dark:text-[#eaf5f7] mb-5">
            Fund Request List
          </h1>

          {/* Table Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
            <div className="flex items-center gap-2">
              <select
                className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#142936] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400"
                value={table.getState().pagination.pageSize}
                onChange={handlePageSizeChange}
              >
                {[10, 25, 50, 100].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-sm text-gray-600 dark:text-[#9db4be] font-medium">
                Search:
              </label>
              <input
                type="search"
                className="flex-1 sm:w-48 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#142936] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-all"
                value={globalFilter ?? ""}
                onChange={handleSearchChange}
                placeholder="Search..."
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
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center gap-1">
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
                        <td key={cell.id} className="px-4 py-3 text-gray-700 dark:text-[#eaf5f7] whitespace-nowrap">
                          {cell.column.id === "rf_Status" ? (
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(
                                cell.getValue()
                              )}`}
                            >
                              {cell.getValue()}
                            </span>
                          ) : cell.column.id === "transactionHash" ? (
                            <span className="relative inline-flex items-center gap-2 group">
                              <span className="font-mono text-gray-600 dark:text-gray-400">
                                {cell.getValue()?.slice(0, 10)}...
                              </span>
                              <Copy
                                size={14}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors"
                                onClick={() =>
                                  handleCopy(cell.getValue(), row.id)
                                }
                                title={
                                  copiedRowId === row.id ? "Copied!" : "Copy"
                                }
                              />
                              <span className="absolute bottom-full left-0 mb-2 px-2 py-1 text-xs font-mono bg-gray-900 dark:bg-gray-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {copiedRowId === row.id
                                  ? "Copied!"
                                  : cell.getValue()}
                              </span>
                            </span>
                          ) : (
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )
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