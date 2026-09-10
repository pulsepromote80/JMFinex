"use client";
import { useMemo, useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { usernameByLoginId } from "@/app/redux/slices/fundManagerSlice";
import Cookies from "js-cookie";
import { getProfileDetails, sendOtpFundRequest, validateOtp } from "@/app/redux/slices/authSlice";
import { fundTransferDepositToDeposit } from "@/app/redux/slices/fundManagerSlice";
import { getfundTransferDepositToDepositReport } from "@/app/redux/slices/fundManagerSlice";
import toast from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getUserId, getEmailId, AuthLogin } from "@/app/api/auth";

const UserTransfer = () => {
  const dispatch = useDispatch();
  const { usernameData } = useSelector((state) => state.fund);
  const [name, setName] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [tableData, setTableData] = useState([]);
  const [email, setEmail] = useState("");
  const [urid, setUrid] = useState("");
  const { getIncomeToDepositWalletReportData } = useSelector(
    (state) => state.fund
  );
  const depositWallet =
    getIncomeToDepositWalletReportData?.walletBalance[0]?.DepositWallet;
  const [otpError, setOtpError] = useState("");

  const profileDataLoading = async () => {
    try {
      const result = await dispatch(getProfileDetails()).unwrap();
      if (result) {
        const user = result?.[0] || result.payload;
        setEmail(user?.Email);
      }
    } catch (e) {
      console.log("err =>", e);
    }
  };

  useEffect(() => {
    profileDataLoading();
  }, []);

  useEffect(() => {
    if (usernameData) {
      setName(usernameData?.data?.name);
    }
    const urid = getUserId();
    const emailId = getEmailId();
    setUrid(urid);
  }, [usernameData]);

  useEffect(() => {
    (async () => {
      try {
        const result = await dispatch(
          getfundTransferDepositToDepositReport(getUserId())
        ).unwrap();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    if (
      getIncomeToDepositWalletReportData?.depositWalletReport &&
      Array.isArray(getIncomeToDepositWalletReportData.depositWalletReport)
    ) {
      const mappedData =
        getIncomeToDepositWalletReportData?.depositWalletReport?.map(
          (item, idx) => ({
            id: idx + 1,
            transDate: item.CreatedDate,
            credit: item.Credit,
            debit: item.Debit,
            status: item.TrStatus,
            remark: item.Remark,
          })
        );
      setTableData(mappedData);
    }
  }, [getIncomeToDepositWalletReportData]);

  const data = useMemo(() => tableData, [tableData]);

  const columns = useMemo(
    () => [
      { header: "#", accessorKey: "id" },
      { header: "Date", accessorKey: "transDate" },
      {
        header: "Credit",
        accessorKey: "credit",
        cell: (info) => (
          <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold text-xs">
            ${info.getValue()}
          </span>
        ),
      },
      {
        header: "Debit",
        accessorKey: "debit",
        cell: (info) => (
          <span className="inline-block px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-semibold text-xs">
            ${info.getValue()}
          </span>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => {
          const value = info.getValue();
          const isApproved = value === "Approve";
          return (
            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
              isApproved 
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
            }`}>
              {value}
            </span>
          );
        },
      },
      { header: "Remark", accessorKey: "remark" },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
  });

  const limitInputLength = useCallback((input, maxLength) => {
    if (input.value.length > maxLength) {
      input.value = input.value.slice(0, maxLength);
    }
  }, []);

  const validatenumerics = useCallback((event) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
    return true;
  }, []);

  const fnSendOTP = async (formik) => {
    formik.setTouched({
      userId: true,
      amount: true,
    });
    const errors = await formik.validateForm();
    if (errors.userId || errors.amount) {
      return;
    }
    if (isOtpSent) return;
    try {
      const result = await dispatch(sendOtpFundRequest()).unwrap();
      if (result.statusCode === 200) {
        setIsOtpSent(true);
        toast.success(result?.data?.message);
      }
    } catch (e) {
      setOtpError("Failed to send OTP. Please try again.");
      console.error(e);
    }
  };

  const validationSchema = Yup.object({
    userId: Yup.string()
      .required("Username is required")
      .test("not-self-transfer", "Cannot transfer to your own account", function (value) {
        const authLogin = AuthLogin();
        return value !== authLogin;
      }),
    amount: Yup.string()
      .required("Amount is required")
      .matches(
        /^(?:\d{1,7})(?:\.\d{1,4})?$/,
        "Please enter a valid amount. Only up to 7 digits before and 4 digits after decimal are allowed."
      )
      .test(
        'min-amount',
        'Amount must be at least 1',
        function (value) {
          if (!value) return true;
          const amountNum = parseFloat(value);
          return !isNaN(amountNum) && amountNum >= 1;
        }
      ),
    otp: Yup.string()
      .length(6, "OTP must be 6 digits")
      .required("OTP is required"),
  });

  const initialValues = {
    userId: "",
    amount: "",
    otp: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setOtpError("");
   
    const data = {
      email: email || "",
      authLoginReciver: values.userId,
      trnsamount: parseInt(values.amount),
      p2potp: values.otp || ""
    };
    try {
      const result = await dispatch(
        fundTransferDepositToDeposit(data)
      ).unwrap();
      if (result.statusCode === 200) {
        console.log("result====>", result)
        toast.success(result.message);
        await dispatch(getfundTransferDepositToDepositReport());
        resetForm();
        setName("");
        setIsOtpSent(false);
      } else {
        toast.error(result.message);
      }
    } catch (e) {
      console.error("Transfer failed:", e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto px-4 sm:px-6 py-6">
      {/* Transfer Card */}
      <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="p-6">
          {/* Transfer Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-[#eaf5f7] relative z-10">
              Deposit Wallet Transfer
            </h2>
            <h2 className="text-sm font-semibold text-teal-600 dark:text-teal-400">
              Balance: ${(depositWallet || 0).toFixed(2)}
            </h2>
          </div>

          {/* Transfer Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            validate={(values) => {
              const errors = {};
              if (values.amount) {
                const amountNum = parseFloat(values.amount);
                if (amountNum < 1) {
                  errors.amount = `Amount must be at least 1`;
                } else if (amountNum > depositWallet) {
                  errors.amount = `Amount Cannot Exceed Deposit Wallet Balance`;
                }
              }
              return errors;
            }}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {(formik) => {
              const { values, handleChange, setFieldValue, handleBlur } = formik;
              return (
                <Form className="w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Username Field */}
                    <div className="form-field">
                      <label className="text-sm font-semibold text-gray-700 dark:text-[#9db4be] block mb-1.5">
                        Username
                      </label>
                      <Field
                        name="userId"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#142936] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-all"
                        placeholder="Enter Username"
                        type="text"
                        value={values.userId}
                        onChange={async (e) => {
                          handleChange(e);
                          const newUserId = e.target.value;
                          setFieldValue("userId", newUserId);
                          const result = await dispatch(
                            usernameByLoginId(newUserId)
                          ).unwrap();
                          if (
                            result &&
                            result.statusCode === 200 &&
                            result.data
                          ) {
                            setName(result.data.name);
                          } else if (result.statusCode === 409) {
                            setName(result.message);
                          }
                        }}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="userId"
                        component="div"
                        className="mt-1 text-xs text-red-500 dark:text-red-400"
                      />
                    </div>

                    {/* Name Field (Readonly) */}
                    <div className="form-field">
                      <label className="text-sm font-semibold text-gray-700 dark:text-[#9db4be] block mb-1.5">
                        Name
                      </label>
                      <input
                        name="Name"
                        placeholder="Name"
                        type="text"
                        readOnly
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-[#142936] text-gray-700 dark:text-[#eaf5f7] text-sm cursor-not-allowed outline-none"
                        value={name || ""}
                      />
                    </div>

                    {/* Amount Field */}
                    <div className="form-field">
                      <label className="text-sm font-semibold text-gray-700 dark:text-[#9db4be] block mb-1.5">
                        Amount
                      </label>
                      <input
                        type="text"
                        name="amount"
                        value={values.amount}
                        min={1}
                        step="0.0001"
                        onChange={(e) => {
                          const input = e.target.value;
                          formik.setFieldTouched("amount", true);
                          const regex = /^\d{0,7}(\.\d{0,4})?$/;
                          if (input === "") {
                            formik.setFieldValue("amount", "");
                            formik.setFieldError("amount", undefined);
                            return;
                          }
                          if (regex.test(input)) {
                            if (depositWallet !== "Select Wallet") {
                              const amountNum = parseFloat(input);
                              if (
                                !isNaN(amountNum) &&
                                amountNum > depositWallet
                              ) {
                                formik.setFieldError(
                                  "amount",
                                  `Amount Cannot Exceed Deposit Wallet Balance ($${depositWallet})`
                                );
                              } else {
                                formik.setFieldError("amount", undefined);
                              }
                            }
                            formik.setFieldValue("amount", input);
                          }
                        }}
                        placeholder="Enter Amount"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#142936] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-all"
                      />
                      {formik.errors.amount && formik.touched.amount && (
                        <div className="mt-1 text-xs text-red-500 dark:text-red-400">
                          {formik.errors.amount}
                        </div>
                      )}
                    </div>

                    {/* Send OTP Button */}
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => fnSendOTP(formik)}
                        className={`w-full px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all ${
                          isOtpSent 
                            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-60' 
                            : 'bg-gradient-to-r from-teal-400 to-teal-400 hover:from-teal-700 hover:to-teal-700'
                        }`}
                        disabled={isOtpSent}
                      >
                        Send OTP
                      </button>
                    </div>
                  </div>

                  {/* OTP Section */}
                  {isOtpSent && (
                    <div className="flex flex-wrap gap-4 items-end mt-4">
                      <div className="flex-1 min-w-[150px]">
                        <label className="text-sm font-semibold text-gray-700 dark:text-[#9db4be] block mb-1.5">
                          OTP
                        </label>
                        <Field
                          type="text"
                          name="otp"
                          maxLength={6}
                          inputMode="numeric"
                          pattern="[0-9]{6}"
                          placeholder="Enter OTP"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#142936] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-all font-mono tracking-wider"
                          onInput={(e) => {
                            e.target.value = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 6);
                          }}
                          onKeyDown={(e) => {
                            if (
                              e.key === "-" ||
                              e.key === "e" ||
                              (e.key.length === 1 && !/[0-9]/.test(e.key))
                            ) {
                              e.preventDefault();
                            }
                          }}
                        />
                        <ErrorMessage
                          name="otp"
                          component="div"
                          className="mt-1 text-xs text-red-500 dark:text-red-400"
                        />
                      </div>
                      <div className="min-w-[100px]">
                        <button
                          type="submit"
                          className="w-full px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                          disabled={formik.isSubmitting}
                        >
                          Transfer
                        </button>
                      </div>
                    </div>
                  )}

                  {otpError && (
                    <div className="mt-3 text-sm font-semibold text-red-500 dark:text-red-400">
                      {otpError}
                    </div>
                  )}
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>

      {/* P2P Transfer Report */}
      <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-[#eaf5f7] mb-5">
            P2P Transfer Report
          </h1>

          {/* Table Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
            <div className="flex items-center gap-2">
              <select
                className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#142936] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400"
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
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
                onChange={(e) => setGlobalFilter(String(e.target.value))}
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
                  table.getRowModel().rows.map((row, idx) => (
                    <tr key={row.id} className="border-b border-gray-100 dark:border-[rgba(140,200,205,0.06)] hover:bg-gray-50 dark:hover:bg-[rgba(47,217,211,0.04)] transition-colors">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 text-gray-700 dark:text-[#eaf5f7] whitespace-nowrap">
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
                    <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-500 dark:text-[#9db4be]">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTransfer;