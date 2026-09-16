"use client";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEncryptedLocalData, AuthLogin } from "@/app/api/auth";
import {
  getProfileDetails,
  sendWithdrawalOtpRequest,
  validateOtp,
} from "@/app/redux/slices/authSlice";
import { addUserWithdrawalRequest } from "../../../redux/slices/fundManagerSlice";
import { getTransferIncomeToDepositWalletReport } from "../../../redux/slices/fundManagerSlice";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getEmailId, getUserId } from "@/app/api/auth";
import { usernameByLoginId } from "../../../redux/slices/fundManagerSlice";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";

const WithdrawalRequest = () => {
  const dispatch = useDispatch();
  const [urid, setUrid] = useState("");
  const [email, setEmail] = useState("");
  const [walletStatus, setWalletStatus] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [ipAddress, setIpAddress] = useState("");
  const [pendingWithdrawalData, setPendingWithdrawalData] = useState(null);
  const [walletType, setWalletType] = useState("Select Wallet");
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const { getTransferIncomeToDepositWalletReportData } = useSelector(
    (state) => state.fund
  );

  const data = useSelector((state) => state.fund?.usernameData?.data);

  const performanceWalletBalance =
    getTransferIncomeToDepositWalletReportData?.walletBalance?.[0]
      ?.incomeWallet || 0;
  const yieldWalletBalance =
    getTransferIncomeToDepositWalletReportData?.walletBalance?.[0]
      ?.roiWallet || 0;

  const selectedWalletBalance =
    walletType === "income"
      ? performanceWalletBalance
      : walletType === "trade"
        ? yieldWalletBalance
        : 0;

  const selectedWalletName =
    walletType === "income"
      ? "Income Wallet Balance"
      : walletType === "trade"
        ? "Trade Wallet Balance"
        : "Selected Wallet";

  const limitInputLength = (input, maxLength) => {
    if (input.value.length > maxLength) {
      input.value = input.value.slice(0, maxLength);
    }
  };

  const validationSchema = useMemo(() => Yup.object({
    amount: Yup.number()
      .typeError("Amount must be a number")
      .min(10, "Minimum withdrawal is $10")
      .required("Amount is required")
      .test(
        "wallet-selected",
        "Please select a wallet first",
        function (value) {
          return walletType !== "Select Wallet";
        }
      ),
    walletAddress: Yup.string()
      .required("Wallet address is required")
      .test(
        "hashcode-length",
        "Please Enter a Valid Wallet Address",
        function (value) {
          return value && value.length >= 38 && value.length <= 44;
        }
      )
      .test(
        "wallet-from-profile",
        "Please set wallet from edit profile",
        function (value) {
          return value !== "walletBep20" && value !== "";
        }
      ),
    otp: Yup.string()
      .required("OTP is required")
      .length(6, "OTP must be 6 digits"),
  }), [walletType]);

  const profileDataLoading = async () => {
    try {
      const result = await dispatch(getProfileDetails()).unwrap();
      if (result) {
        const user = result?.[0] || result.payload;
        setEmail(user.Email || "");
      }
    } catch (e) {
      console.log("err =>", e);
    }
  };

  useEffect(() => {
    profileDataLoading();
  }, []);

  useEffect(() => {
    const AuthId = AuthLogin();
    if (AuthId) {
      dispatch(usernameByLoginId(AuthId));
    }
  }, [dispatch]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "AuthLogin" || e.key === "FName" || e.key === "LName" || e.key === "walletBep20") {
        const AuthId = AuthLogin();
        if (AuthId) {
          dispatch(usernameByLoginId(AuthId));
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [dispatch]);

  useEffect(() => {
    const urid = getUserId();
    const emailId = getEmailId();
    setUrid(urid);
    setEmail(emailId);

    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setIpAddress(data.ip))
      .catch(() => setIpAddress(""));

    dispatch(getTransferIncomeToDepositWalletReport());
  }, [dispatch]);

  useEffect(() => {
    const readWalletFromLocalStorage = () => {
      try {
        const raw = localStorage.getItem("currentUserPlain");
        if (!raw) return "";
        const parsed = JSON.parse(raw);
        return parsed?.userData?.WalletBep20 || "";
      } catch {
        return "";
      }
    };

    const walletFromProfile =
      data?.walletBep20 || readWalletFromLocalStorage();

    if (walletFromProfile) {
      formik.setFieldValue("walletAddress", walletFromProfile);
      setWalletStatus("Wallet set from profile");
    } else {
      formik.setFieldValue("walletAddress", "");
      setWalletStatus("");
    }
  }, [data?.walletBep20]);

  const fnSendOTP = async () => {
    if (!isOtpLoading) setIsOtpLoading(true);

    formik.setTouched({
      amount: true,
      walletAddress: true,
    });

    if (isOtpLoading) return;

    const errors = await formik.validateForm();
    if (errors.amount || errors.walletAddress) {
      return;
    }

    if (isOtpSent) return;

    setIsOtpLoading(true);
    try {
      const toastId = toast.loading("Sending OTP...");
      const otpResult = await dispatch(sendWithdrawalOtpRequest()).unwrap();

      if (otpResult.statusCode === 200) {
        toast.dismiss(toastId);

        setIsOtpSent(true);
        toast.success(otpResult?.data?.message);

        setPendingWithdrawalData({
          amount: formik.values.amount,
          walletAddress: formik.values.walletAddress,
          walletType: walletType === "income" ? 1 : walletType === "trade" ? 2 : 0,
        });
      } else {
        toast.error(otpResult.message || "Failed to send OTP");
      }
    } catch (e) {
      toast.dismiss();
      toast.error(e?.message || "Failed to send OTP");
    } finally {
      setIsOtpLoading(false);
    }
  };

  const fnSendWithdrawalRequest = async (values) => {
    const withdrawalData = {
      withdrawalotp: values.otp,
      secureCode: "xoxofx#4343%ReliGence#22023",
      ipAddress: ipAddress,
      amount: parseInt(values.amount),
      emailid: email,
      walletAdress: values.walletAddress,
      payMode: 1,
      walletType: walletType === "income" ? 1 : walletType === "trade" ? 2 : 0,
    };

    try {
      const result = await dispatch(addUserWithdrawalRequest(withdrawalData)).unwrap();

      if (result.statusCode === 200) {
        toast.success(result.message);
        setIsOtpSent(false);
        setPendingWithdrawalData(null);
        await dispatch(getTransferIncomeToDepositWalletReport(getUserId()));
        return true;
      } else {
        toast.error(result.message || "Withdrawal request failed");
        return false;
      }
    } catch (e) {
      console.error("Withdrawal error:", e);
      toast.error(e?.message || "An error occurred during withdrawal");
      return false;
    }
  };

  const formik = useFormik({
    initialValues: {
      amount: "",
      walletAddress: data?.walletBep20 || "",
      otp: "",
    },
    validationSchema,
    validate: (values) => {
      const errors = {};
      if (walletType === "Select Wallet" && values.amount) {
        errors.amount = "Please select a wallet first";
      }
      if (values.amount) {
        const amountNum = parseFloat(values.amount);
        if (amountNum > selectedWalletBalance) {
          errors.amount = `Amount cannot exceed ${selectedWalletName}`;
        }
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const withdrawalSuccess = await fnSendWithdrawalRequest(values);

        if (withdrawalSuccess) {
          resetForm();
          setWalletType("Select Wallet");
          setPendingWithdrawalData(null);
        }

        setSubmitting(false);
      } catch (error) {
        console.error("Withdrawal failed:", error);
        toast.error("Withdrawal process failed");
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="mx-auto px-4 sm:px-6 py-6">
      {/* Withdrawal Card */}
      <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-[#eaf5f7] relative z-10">
              Withdrawal
            </h2>
            {walletType === "income" && (
              <h2 className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                Balance: ${(performanceWalletBalance || 0).toFixed(2)}
              </h2>
            )}
            {walletType === "trade" && (
              <h2 className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                Balance: ${(yieldWalletBalance || 0).toFixed(2)}
              </h2>
            )}
          </div>

          {/* Form */}
          <form className="w-full" onSubmit={formik.handleSubmit}>
            <div className="flex flex-wrap gap-4">
              {/* Wallet Type */}
              <div className="flex-1 min-w-[200px]">
                <div className="mb-4">
                  <label className="text-sm font-semibold text-gray-700 dark:text-[#9db4be] block mb-1.5" htmlFor="Wallet Type">
                    Wallet Type
                  </label>
                  <select
                    id="wallet-type"
                    name="walletType"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#142936] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-all"
                    value={walletType}
                    onChange={(e) => setWalletType(e.target.value)}
                  >
                    <option value="Select Wallet" className="text-gray-400 dark:text-gray-500">
                      Select Wallet
                    </option>
                    <option value="income">Income Wallet</option>
                    <option value="trade">Trading Wallet</option>
                  </select>
                </div>
              </div>

              {/* Amount */}
              <div className="flex-1 min-w-[150px]">
                <div className="mb-4">
                  <label className="text-sm font-semibold text-gray-700 dark:text-[#9db4be] block mb-1.5" htmlFor="amount">
                    Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#142936] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder={
                      walletType === "Select Wallet"
                        ? "Select Wallet First"
                        : "Enter Amount"
                    }
                    value={formik.values.amount}
                    min={0}
                    step="0.0001"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    onInput={(e) => limitInputLength(e.target, 8)}
                    disabled={walletType === "Select Wallet"}
                  />
                  {formik.touched.amount && formik.errors.amount && (
                    <div className="mt-1 text-xs text-red-500 dark:text-red-400">
                      {formik.errors.amount}
                    </div>
                  )}
                </div>
              </div>

              {/* Wallet Address */}
              <div className="flex-1 min-w-[200px]">
                <div className="mb-4">
                  <label className="text-sm font-semibold text-gray-700 dark:text-[#9db4be] block mb-1.5" htmlFor="walletAddress">
                    Enter BEP20 USDT Wallet
                  </label>
                  <input
                    id="walletAddress"
                    name="walletAddress"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-[#142936] text-gray-700 dark:text-[#eaf5f7] text-sm cursor-not-allowed outline-none"
                    placeholder="BEP20 USDT Wallet Address"
                    value={formik.values.walletAddress}
                    maxLength={44}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    readOnly
                  />
                  {formik.touched.walletAddress &&
                    formik.errors.walletAddress && (
                      <div className="mt-1 text-xs text-red-500 dark:text-red-400">
                        {formik.errors.walletAddress}
                      </div>
                    )}
                  <label className="text-xs text-blue-600 dark:text-blue-400 block mt-1" id="lblWalletStatus">
                    {walletStatus}
                  </label>
                  {(!formik.values.walletAddress) && (
                    <div className="mt-2">
                      <Link
                        href="/dashboard/profile"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                      >
                        <span>Add your BEP20 wallet address in your profile before requesting a withdrawal.</span>
                        <FaExternalLinkAlt className="text-[10px]" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Send OTP Button */}
              <div className="flex items-end min-w-[100px]">
                <button
                  type="button"
                  onClick={fnSendOTP}
                  className={`w-full px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all ${
                    isOtpSent || walletType === "Select Wallet" || !formik.values.amount || !formik.values.walletAddress
                      ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-60'
                      : 'bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-700'
                  }`}
                  disabled={
                    isOtpLoading ||
                    isOtpSent ||
                    walletType === "Select Wallet" ||
                    !formik.values.amount ||
                    !formik.values.walletAddress ||
                    !getEmailId()
                  }
                >
                  {isOtpLoading ? "Sending..." : isOtpSent ? "OTP Sent" : "Send OTP"}
                </button>
              </div>
            </div>

            {/* OTP Section */}
            {isOtpSent && (
              <div className="flex flex-wrap gap-4 items-end mt-4">
                <div className="flex-1 min-w-[150px]">
                  <div className="mb-1">
                    <label className="text-sm font-semibold text-gray-700 dark:text-[#9db4be] block mb-1.5" htmlFor="otp">
                      Enter OTP (Sent to Email)
                    </label>
                    <input
                      type="text"
                      name="otp"
                      id="otp"
                      maxLength={6}
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#142936] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all font-mono tracking-wider"
                      value={formik.values.otp}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      onInput={(e) => {
                        e.target.value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6);
                      }}
                    />
                    {formik.touched.otp && formik.errors.otp && (
                      <div className="mt-1 text-xs text-red-500 dark:text-red-400">
                        {formik.errors.otp}
                      </div>
                    )}
                  </div>
                </div>
                <div className="min-w-[100px]">
                  <button
                    type="submit"
                    className="w-full px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={formik.isSubmitting || !formik.values.otp || formik.values.otp.length !== 6}
                  >
                    {formik.isSubmitting ? "Processing..." : "Withdraw"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalRequest;