import React from 'react';

const Loading = () => {
  return (
    <div className="loader-screen">
      <div className="loader-wrap">
        <div className="spinner-shell">
          <div className="spinner-ring ring-primary" />
          <div className="spinner-ring ring-secondary" />
          <div className="spinner-dot" />
        </div>

        <div className="loader-text">LOADING</div>

        <div className="loader-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>

      <style jsx>{`
        .loader-screen {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #040d22;
          overflow: hidden;
        }

        .loader-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transform: translateY(-6px);
        }

        .spinner-shell {
          position: relative;
          width: 118px;
          height: 118px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .spinner-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border-width: 2px;
          border-style: solid;
          opacity: 0.9;
        }

        .ring-primary {
          border-color: rgba(106, 149, 255, 0.22);
          box-shadow: inset 0 0 10px rgba(96, 160, 255, 0.08);
        }

        .ring-primary::before,
        .ring-secondary::before {
          content: "";
          position: absolute;
          inset: 9px;
          border-radius: 50%;
          border: 2px solid transparent;
        }

        .ring-primary::before {
          border-top-color: #60c8ff;
          border-right-color: #7aa7ff;
          animation: spin 1.5s linear infinite;
        }

        .ring-secondary {
          inset: 18px;
          border-color: rgba(5, 24, 52, 0.12);
          border-left-color: rgba(90, 160, 255, 0.3);
          border-bottom-color: rgba(212, 166, 51, 0.8);
          transform: rotate(180deg);
          animation: spinReverse 2s linear infinite;
        }

        .spinner-dot {
          position: absolute;
          top: 18px;
          left: 50%;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f8dc85 0%, #d5a537 100%);
          transform: translateX(-50%);
          box-shadow: 0 0 18px rgba(245, 214, 120, 0.85);
        }

        .loader-text {
          margin-top: 12px;
          font-size: 12px;
          letter-spacing: 0.28rem;
          font-weight: 700;
          color: #8ea9ff;
          text-transform: uppercase;
          text-shadow: 0 0 12px rgba(126, 160, 255, 0.35);
        }

        .loader-dots {
          display: flex;
          gap: 8px;
          align-items: center;
          justify-content: center;
          margin-top: 8px;
        }

        .loader-dots span {
          display: block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #79d6ff 0%, #d5a537 100%);
          box-shadow: 0 0 10px rgba(121, 214, 255, 0.5);
          animation: dotPulse 1.2s ease-in-out infinite;
        }

        .loader-dots span:nth-child(2) {
          animation-delay: 0.18s;
        }

        .loader-dots span:nth-child(3) {
          animation-delay: 0.36s;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes spinReverse {
          to { transform: rotate(-180deg); }
        }

        @keyframes dotPulse {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;