"use client";
import React from "react";
import { motion } from "framer-motion";

export default function Loader({ className = "", text = "LOADING" }) {
  const isCompact = /(?:^|\s)(w-|h-|size-|mr-|ml-|mb-|mt-|gap-)/.test(className);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={isCompact ? "loader-inline" : "loader-overlay"}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, ease: "linear", duration: 1.5 }}
          className={`loader-shell ${className}`.trim()}
        >
          <div className="loader-ring">
            <span className="loader-dot" />
          </div>
        </motion.div>

        {!isCompact && <span className="loader-text">{text}</span>}
        {!isCompact && (
          <div className="loader-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        )}
      </motion.div>

      <style jsx>{`
        .loader-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.85rem;
          background: #050d1f;
        }

        .loader-inline {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.7rem;
        }

        .loader-shell {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 7rem;
          height: 7rem;
        }

        .loader-ring {
          position: relative;
          width: 6.2rem;
          height: 6.2rem;
          border-radius: 50%;
          background: rgba(71, 90, 148, 0.08);
          border: 2px solid rgba(110, 149, 255, 0.22);
          box-shadow: inset 0 0 0 1px rgba(122, 146, 255, 0.08), 0 0 25px rgba(80, 125, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loader-ring::before,
        .loader-ring::after {
          content: "";
          position: absolute;
          inset: 0.7rem;
          border-radius: 50%;
          border: 2px solid transparent;
        }

        .loader-ring::before {
          border-top-color: #65d9ff;
          border-right-color: #8ab3ff;
          animation: spin 1.4s linear infinite;
        }

        .loader-ring::after {
          inset: 1.1rem;
          border-left-color: #d38cff;
          border-bottom-color: #8ae3ff;
          animation: spinReverse 1.8s linear infinite;
        }

        .loader-dot {
          position: absolute;
          top: 0.75rem;
          left: 50%;
          width: 0.7rem;
          height: 0.7rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #8de8ff 0%, #d38cff 100%);
          transform: translateX(-50%);
          box-shadow: 0 0 16px rgba(141, 232, 255, 0.8);
        }

        .loader-text {
          font-size: 0.73rem;
          font-weight: 700;
          letter-spacing: 0.28rem;
          color: #a5b9ff;
          text-transform: uppercase;
          text-shadow: 0 0 10px rgba(123, 153, 255, 0.5);
        }

        .loader-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.38rem;
          margin-top: -0.15rem;
        }

        .loader-dots span {
          width: 0.42rem;
          height: 0.42rem;
          border-radius: 50%;
          display: block;
          animation: dotPulse 1.2s ease-in-out infinite;
          background: linear-gradient(135deg, #5bd8ff 0%, #d38cff 100%);
          box-shadow: 0 0 10px rgba(131, 178, 255, 0.7);
        }

        .loader-dots span:nth-child(2) {
          animation-delay: 0.15s;
        }

        .loader-dots span:nth-child(3) {
          animation-delay: 0.3s;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spinReverse {
          to {
            transform: rotate(-360deg);
          }
        }

        @keyframes dotPulse {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}