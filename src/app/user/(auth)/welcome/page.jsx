"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
export default function WelcomePage() {
  const router = useRouter();
  const { userData } = useSelector((state) => state?.auth || {});
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!userData) {
      router.push("/user/login");
    }
  }, [userData, router]);

  if (pageLoading) {
    return (
      <>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        />
        <link rel="stylesheet" href="/assets/css/login.css" />
        <div className="fixed inset-0 z-[9999] m-0 p-0 flex items-center justify-center bg-[#040d22]">
          <div className="text-center">
            <div className="relative mx-auto mb-5 flex h-[90px] w-[90px] items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-[rgba(86,166,255,0.20)] shadow-[inset_0_0_14px_rgba(86,166,255,0.08)]" />

              <div className="absolute inset-[8px] rounded-full border-[2px] border-transparent border-t-[#5dc8ff] border-r-[#7ea6ff] animate-[spin_1.6s_linear_infinite] shadow-[0_0_14px_rgba(93,200,255,0.22)]" />

              <div className="absolute inset-[18px] rounded-full border-[2px] border-transparent border-b-[#d4a633] border-l-[#5aaef7] animate-[spinReverse_1.8s_linear_infinite] shadow-[0_0_12px_rgba(212,166,51,0.22)]" />

              <div className="absolute left-1/2 top-[18px] h-[9px] w-[9px] -translate-x-1/2 rounded-full bg-[linear-gradient(135deg,#f8dc85_0%,#d4a633_100%)] shadow-[0_0_18px_rgba(248,220,133,0.85)]" />
            </div>

            <div className="text-[12px] font-bold tracking-[0.28rem] text-[#9ab7ff] uppercase drop-shadow-[0_0_12px_rgba(126,160,255,0.38)]">
              LOADING
            </div>

            <div className="mt-3 flex justify-center gap-2">
              <div className="h-2 w-2 animate-[dotPulse_1.2s_ease-in-out_0s_infinite] rounded-full bg-[#60c5ff] shadow-[0_0_10px_rgba(96,197,255,0.8)]"></div>
              <div className="h-2 w-2 animate-[dotPulse_1.2s_ease-in-out_0.18s_infinite] rounded-full bg-[#7aaeff] shadow-[0_0_10px_rgba(122,174,255,0.8)]"></div>
              <div className="h-2 w-2 animate-[dotPulse_1.2s_ease-in-out_0.36s_infinite] rounded-full bg-[#d4a633] shadow-[0_0_10px_rgba(212,166,51,0.8)]"></div>
            </div>
          </div>
        </div>
        <style jsx global>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes spinReverse {
            to { transform: rotate(-360deg); }
          }
          @keyframes dotPulse {
            0%, 100% { transform: translateY(0); opacity: 0.5; }
            50% { transform: translateY(-4px); opacity: 1; }
          }
        `}</style>
      </>
    );
  }

  if (!userData) return null;

  const { name, authLogin, authPassword, email } = userData;

  return (
    <>
      {/* Bootstrap CDN */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      />
      <link rel="stylesheet" href="/assets/css/login.css" />

      {/* Full-screen container */}
      <div className="min-vh-100 d-flex align-items-center justify-content-center px-3 py-5 position-relative overflow-hidden login-bg">
        {/* Orb - purple top-left */}
        <div className="position-absolute rounded-circle pe-none orb-purple" />

        {/* Orb - cyan bottom-right */}
        <div className="position-absolute rounded-circle pe-none orb-cyan" />

        {/* Orb - center */}
        <div className="position-absolute top-50 start-50 translate-middle rounded-circle pe-none orb-center" />

        {/* Card */}
        <div className="position-relative z-1 w-100 px-4 px-md-5 py-5 rounded-4 login-card">
          {/* Top shimmer line */}
          <div className="position-absolute top-0 start-50 translate-middle-x shimmer-line" />

          {/* Logo */}
          <div className="d-flex justify-content-center mb-2">
            <a href='/'>
              <img src="/logo.png" alt="Logo" className="login-logo" />
            </a>
          </div>

          {/* Welcome divider */}

          <div className="d-flex align-items-center gap-3 mt-4 mb-4">
            <div className="flex-grow-1 divider-line" />
            <span className="signin-text">Welcome</span>
            <div className="flex-grow-1 divider-line" />
          </div>
          {/* Welcome message */}
          <p className="welcome-message">
            We're excited to have you join our community. Earn rewards and
            bonuses by referring friends and family.
          </p>

          {/* Sub heading */}
          <h2 className="welcome-subheading">Your Account Details</h2>

          {/* Info rows */}
          <div className="welcome-info-container">
            {/* Name */}
            <div className="welcome-info-row">
              <span className="welcome-label">Name:</span>
              <span className="welcome-value">{name || "Not provided"}</span>
            </div>

            {/* Email */}
            <div className="welcome-info-row">
              <span className="welcome-label">Email:</span>
              <span className="welcome-value">{email || "Not provided"}</span>
            </div>

            {/* User Id */}
            <div className="welcome-info-row">
              <span className="welcome-label">User Id:</span>
              <span className="welcome-value">{authLogin || "Not provided"}</span>
            </div>

            {/* Password */}
            <div className="welcome-info-row">
              <span className="welcome-label">Password:</span>
              <span className="welcome-password-value">{authPassword || "Not provided"}</span>
            </div>
          </div>

          {/* Login button */}
          <button
            type="button"
            onClick={() => router.push("/user/login")}
            className="btn w-100 d-flex align-items-center justify-content-center gap-2 fw-bold text-uppercase mt-2 login-submit "
          >
            Login Now
          </button>

          {/* Footer note */}
          <p className="welcome-footer-note">
            Congratulations! Your account has been successfully created. Check
            your inbox for an email that includes your login details. Make sure
            to store this email in a secure place.
          </p>
        </div>
      </div>
    </>
  );
}