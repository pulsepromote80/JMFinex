'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { forgotPassword } from "@/app/redux/slices/authSlice";
import { Mail, ArrowLeft, User } from "lucide-react";

export default function ForgotPassword() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({ username: "", email: "" });
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // Force loader to show for at least 500ms
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const validateForm = () => {
    let newErrors = { username: "", email: "" };
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) {
      // Show error message
      const errorMessages = Object.values(newErrors).filter(msg => msg !== "");
      if (errorMessages.length > 0) {
        toast.error(errorMessages[0]);
      }
    }
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const res = await dispatch(forgotPassword({ 
        userId: username, 
        email: email 
      })).unwrap();

      if (res?.statusCode === 200) {
        toast.success(res?.message || "Reset link sent to your email!");
        setSubmitted(true);
      } else {
        throw new Error(res?.message || 'Failed to send reset link');
      }
    } catch (error) {
      toast.error(error?.message || error || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };



  if (pageLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: '#0B1120' }}>
        <div className="text-center">
          <div className="spinner-border" style={{ color: '#F59E0B', width: '3rem', height: '3rem' }} role="status" />
        </div>
      </div>
    );
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" />
      
      <style jsx global>{`
        body, html {
          background: #0B1120 !important;
          overflow: hidden !important;
        }
        .forgot-input::placeholder {
          color: #F59E0B !important;
        }
      `}</style>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#111827",
            color: "#f3f4f6",
            border: "1px solid rgba(245,158,11,0.3)",
            borderRadius: "12px",
            fontSize: "13px",
          },
          success: { iconTheme: { primary: "#F59E0B", secondary: "#0B1120" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#f3f4f6" } },
        }}
      />

      <div className="min-vh-100 d-flex align-items-center justify-content-center px-3 py-5 position-relative" style={{   background: `url('/bg.jpg') center/cover no-repeat`, 
        fontFamily: 'Geist, sans-serif',
        minHeight: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden' }}>
        
        {/* Decorative Orbs */}
        <div className="position-absolute rounded-circle" style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)', top: '-10%', left: '-10%' }} />
        <div className="position-absolute rounded-circle" style={{ width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%)', bottom: '-20%', right: '-10%' }} />

        {/* Card */}
        <div className="position-relative z-1 w-100" style={{ maxWidth: '440px' }}>
          <div className="p-4 p-md-5 rounded-4" style={{ 
            background: 'rgba(17, 24, 39, 0.0)', 
            backdropFilter: 'blur(20px)', 
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>

          {/* Logo */}
          <div className="d-flex justify-content-center mb-4">
            <Link href='/'>
              <img src="/logo.png" alt="JMFinex" style={{ height: '50px', objectFit: 'contain' }} />
            </Link>
          </div>

          <h2 className="text-center text-white fw-bold mb-1" style={{ fontSize: '24px' }}>Forgot Password</h2>
          <p className="text-center mb-4" style={{ color: '#94a3b8', fontSize: '14px' }}>Enter your username and email to reset your password</p>

          {!submitted ? (
            <>
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                {errors.username || errors.email ? (
                  <div className="alert alert-danger py-2 text-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: '13px' }}>
                    {errors.username || errors.email}
                  </div>
                ) : null}

                {/* Username Field */}
                <div className="mb-3">
                  <label className="form-label text-white-50 small fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Username</label>
                  <div className="position-relative">
                    <div className="position-absolute top-50 start-0 translate-middle-y ms-3" style={{ color: '#F59E0B' }}>
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (errors.username) setErrors({ ...errors, username: "" });
                      }}
                      placeholder="Enter Username"
                      className={`form-control bg-transparent text-white border border-white ps-5 py-3 forgot-input ${errors.username ? 'is-invalid' : ''}`}
                      style={{ 
                        background: 'rgba(255,255,255,0.03)', 
                        borderRadius: '10px',
                        border: errors.username ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                        boxShadow: 'none',
                        color: '#fff'
                      }}
                      onFocus={(e) => e.target.style.border = '1px solid #F59E0B'}
                    />
                  </div>
                  {errors.username && <div className="text-danger mt-1" style={{ fontSize: '12px' }}>⚠ {errors.username}</div>}
                </div>

                {/* Email Field */}
                <div className="mb-3">
                  <label className="form-label text-white-50 small fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Email Address</label>
                  <div className="position-relative">
                    <div className="position-absolute top-50 start-0 translate-middle-y ms-3" style={{ color: '#F59E0B' }}>
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: "" });
                      }}
                      placeholder="Enter Email"
                      className={`form-control bg-transparent text-white border border-white ps-5 py-3 forgot-input ${errors.email ? 'is-invalid' : ''}`}
                      style={{ 
                        background: 'rgba(255,255,255,0.03)', 
                        borderRadius: '10px',
                        border: errors.email ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                        boxShadow: 'none',
                        color: '#fff'
                      }}
                      onFocus={(e) => e.target.style.border = '1px solid #F59E0B'}
                    />
                  </div>
                  {errors.email && <div className="text-danger mt-1" style={{ fontSize: '12px' }}>⚠ {errors.email}</div>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn w-100 py-3 fw-bold text-uppercase mt-4"
                  style={{
                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#0B1120',
                    boxShadow: '0 10px 28px rgba(245,158,11,0.18)',
                    transition: 'all 0.3s ease'
                  }}
                  disabled={loading || !username || !email}
                  onMouseEnter={(e) => {
                    if (!loading && username && email) {
                      e.currentTarget.style.filter = 'brightness(1.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'brightness(1)';
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" style={{ color: '#0B1120' }} />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>

                {/* OR separator */}
                <div className="d-flex align-items-center gap-2 my-4">
                  <div className="flex-grow-1" style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                  <span style={{ color: '#94a3b8', fontSize: '12px' }}>or</span>
                  <div className="flex-grow-1" style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                </div>

                {/* Back to Login */}
                <Link href="/user/login" style={{ textDecoration: "none" }}>
                  <button 
                    className="btn w-100 py-3 fw-bold"
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '10px',
                      color: '#eef3f8',
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      gap: "8px",
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(245,158,11,0.08)';
                      e.currentTarget.style.borderColor = '#F59E0B';
                      e.currentTarget.style.color = '#F59E0B';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                      e.currentTarget.style.color = '#eef3f8';
                    }}
                  >
                    <ArrowLeft size={15} />
                    Back to Login
                  </button>
                </Link>
              </form>
            </>
          ) : (
            <>
              <div style={{ textAlign: "center" }}>
                <div style={{ marginBottom: "24px" }}>
                  <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="#F59E0B" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 style={{ color: "#fff", fontSize: "24px", fontWeight: "bold", marginBottom: "12px" }}>
                  Check Your Email
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "24px" }}>
                  We've sent a password reset link to <strong style={{ color: "#F59E0B" }}>{email}</strong>
                </p>
                
                <button
                  className="btn w-100 py-3 fw-bold"
                  onClick={() => {
                    setSubmitted(false);
                    setUsername('');
                    setEmail('');
                  }}
                  style={{
                    background: 'transparent',
                    border: '1px solid #F59E0B',
                    borderRadius: '10px',
                    color: '#F59E0B',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(245,158,11,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  Send to another email
                </button>
              </div>

              {/* OR separator */}
              <div className="d-flex align-items-center gap-2 my-4">
                <div className="flex-grow-1" style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <span style={{ color: '#94a3b8', fontSize: '12px' }}>or</span>
                <div className="flex-grow-1" style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              </div>

              {/* Back to Login */}
              <Link href="/user/login" style={{ textDecoration: "none" }}>
                <button 
                  className="btn w-100 py-3 fw-bold"
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    color: '#eef3f8',
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    gap: "8px",
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(245,158,11,0.08)';
                    e.currentTarget.style.borderColor = '#F59E0B';
                    e.currentTarget.style.color = '#F59E0B';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.color = '#eef3f8';
                  }}
                >
                  <ArrowLeft size={15} />
                  Back to Login
                </button>
              </Link>
            </>
          )}
          </div>
        </div>
      </div>
    </>
  );
}