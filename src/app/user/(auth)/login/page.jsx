'use client'

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { appLogin } from "@/app/redux/slices/authSlice"
import { RotateCcw, User, Lock, Shield, Check, ArrowRight, Eye, EyeOff } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import Link from "next/link"
import { decryptData } from "@/app/constants/encryption"

// --- Naya Captcha Logic (Simple Checkbox) ---
const SimpleCaptcha = ({ onVerify, isVerified, onRefresh }) => {
  const [isChecking, setIsChecking] = useState(false)

  const handleCheck = () => {
    if (isVerified) return
    setIsChecking(true)
    setTimeout(() => {
      setIsChecking(false)
      onVerify(true)
    }, 800) // Fake loading for realism
  }

  return (
    <div className="d-flex align-items-center justify-content-between p-3 rounded-3 mb-4" 
         style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="d-flex align-items-center gap-3">
        <div 
          onClick={handleCheck}
          style={{
            width: '24px', height: '24px', borderRadius: '4px', cursor: 'pointer',
            border: isVerified ? 'none' : '2px solid rgba(255,255,255,0.3)',
            background: isVerified ? '#F59E0B' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
        >
          {isChecking && <div className="spinner-border spinner-border-sm text-warning" role="status" />}
          {isVerified && <Check size={16} color="#0B1120" strokeWidth={3} />}
        </div>
        <span style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>
          I'm not a robot
        </span>
      </div>
      <div className="d-flex flex-column align-items-center opacity-50">
        <Shield size={20} color="#F59E0B" />
        <span style={{ fontSize: '10px', color: '#94a3b8' }}>Privacy</span>
      </div>
    </div>
  )
}

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  const [touched, setTouched] = useState({ username: false, password: false, captcha: false })
  const [validationErrors, setValidationErrors] = useState({ username: "", password: "", captcha: "" })

  // Naya Captcha State
  const [isVerified, setIsVerified] = useState(false)

  const router = useRouter()
  const dispatch = useDispatch()
  const { loading: authLoading, error: authError } = useSelector((state) => state.auth)



  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  // ---- Validation Logic ----
  const validateUsername = (value) => !value.trim() ? "Username is required" : ""
  const validatePassword = (value) => !value.trim() ? "Password is required" : ""
  const validateCaptcha = () => !isVerified ? "Please verify you are not a robot" : ""

  const validateField = (field, value) => {
    let errorMsg = ""
    switch (field) {
      case "username": errorMsg = validateUsername(value); break
      case "password": errorMsg = validatePassword(value); break
      case "captcha": errorMsg = validateCaptcha(); break
    }
    setValidationErrors(prev => ({ ...prev, [field]: errorMsg }))
    return errorMsg === ""
  }

  const autoLogin = async (user, pass) => {
    try {
      const result = await dispatch(appLogin({ username: user, password: pass })).unwrap()
      if (result.statusCode == 200) window.location.replace('/dashboard')
      else toast.error(result.message || "Login failed")
    } catch (err) { toast.error(err || "Login failed") }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlUsername = urlParams.get("username");
    const urlPassword = urlParams.get("password");
    if (urlUsername && urlPassword) {
      try {
        const decryptedUsername = decryptData(urlUsername);
        const decryptedPassword = decryptData(urlPassword);
        const finalUsername = decryptedUsername;
        setUsername(finalUsername); setPassword(decryptedPassword); setIsVerified(true);
        setTimeout(() => autoLogin(finalUsername, decryptedPassword), 300);
      } catch (error) { toast.error("Invalid login link"); }
    }
  }, []);

  const handleFieldChange = (field, value) => {
    if (field === "username") setUsername(value)
    if (field === "password") setPassword(value)
    if (touched[field]) validateField(field, value)
  }

  const handleFieldBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    let value = field === "username" ? username : password
    validateField(field, value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setTouched({ username: true, password: true, captcha: true })
    const isUsernameValid = validateField("username", username)
    const isPasswordValid = validateField("password", password)
    const isCaptchaValid = validateField("captcha")

    if (!isUsernameValid || !isPasswordValid || !isCaptchaValid) {
      toast.error("Please fix the validation errors")
      return
    }

    try {
      const result = await dispatch(appLogin({ username, password })).unwrap()
      if (result.statusCode == 200) window.location.replace('/dashboard')
      else toast.error(result.message || "Login failed")
    } catch (err) {
      toast.error(err || "Login failed")
      setIsVerified(false) // Reset captcha on failure
    }
  }

  if (pageLoading) {
    return (
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
      </div>
    )
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" />
      
      <style jsx global>{`
        .password-input::placeholder {
          color: #F59E0B !important;
        }
        .username-input::placeholder {
          color: #F59E0B !important;
        }
      `}</style>
      
      <Toaster position="top-right" toastOptions={{
          style: { background: "#111827", color: "#f3f4f6", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "12px" },
          success: { iconTheme: { primary: "#F59E0B", secondary: "#0B1120" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#f3f4f6" } },
        }} 
      />

      <div className="d-flex align-items-center justify-content-center px-3 py-5 position-relative" style={{ 
        background: `url('/bg.jpg') center/cover no-repeat`, 
        fontFamily: 'Geist, sans-serif',
        minHeight: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
      }}>
        
        {/* Dark overlay to reduce background opacity */}
        <div className="position-absolute inset-0" style={{ background: 'rgba(11, 17, 32, 0.4)', zIndex: 0 }} />
        
        {/* Decorative Orbs */}
        <div className="position-absolute rounded-circle" style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)', top: '-10%', left: '-10%', zIndex: 0 }} />
        <div className="position-absolute rounded-circle" style={{ width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%)', bottom: '-20%', right: '-10%', zIndex: 0 }} />

        {/* Login Card */}
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

            <h2 className="text-center text-white fw-bold mb-1" style={{ fontSize: '24px' }}>Welcome Back</h2>
            <p className="text-center mb-4" style={{ color: '#94a3b8', fontSize: '14px' }}>Log in to continue to your dashboard</p>

            <form onSubmit={handleSubmit}>
              {error && <div className="alert alert-danger py-2 text-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: '13px' }}>{error}</div>}

              {/* Username */}
              <div className="mb-3">
                <label className="form-label text-white-50 small fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Username</label>
                <div className="position-relative">
                  <div className="position-absolute top-50 start-0 translate-middle-y ms-3" style={{ color: '#F59E0B' }}>
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => handleFieldChange("username", e.target.value)}
                    onBlur={() => handleFieldBlur("username")}
                    placeholder="Enter Username"
                    className={`form-control bg-transparent text-white border border-white ps-5 py-3 username-input ${touched.username && validationErrors.username ? 'is-invalid' : ''}`}
                    style={{ 
                      background: 'rgba(255,255,255,0.03)', 
                      borderRadius: '10px',
                      border: touched.username && validationErrors.username ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                      boxShadow: 'none',
                      color: '#fff'
                    }}
                    onFocus={(e) => e.target.style.border = '1px solid #F59E0B'}
                  />
                </div>
                {touched.username && validationErrors.username && <div className="text-danger mt-1" style={{ fontSize: '12px' }}>⚠ {validationErrors.username}</div>}
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label text-white-50 small fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Password</label>
                <div className="position-relative">
                  <div className="position-absolute top-50 start-0 translate-middle-y ms-3" style={{ color: '#F59E0B' }}>
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => handleFieldChange("password", e.target.value)}
                    onBlur={() => handleFieldBlur("password")}
                    placeholder="Enter Password"
                    className={`form-control bg-transparent text-white border border-white ps-5 pe-5 py-3 password-input ${touched.password && validationErrors.password ? 'is-invalid' : ''}`}
                    style={{ 
                      background: 'rgba(255,255,255,0.03)', 
                      borderRadius: '10px',
                      border: touched.password && validationErrors.password ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                      boxShadow: 'none',
                      color: '#fff'
                    }}
                    onFocus={(e) => e.target.style.border = '1px solid #F59E0B'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent me-3"
                    style={{ color: '#94a3b8' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {touched.password && validationErrors.password && <div className="text-danger mt-1" style={{ fontSize: '12px' }}>⚠ {validationErrors.password}</div>}
                <div className="d-flex justify-content-end mt-2">
                  <button type="button" onClick={() => router.push('/user/forgot')} className="border-0 bg-transparent p-0" style={{ color: '#F59E0B', fontSize: '13px', fontWeight: '500' }}>
                    Forgot password?
                  </button>
                </div>
              </div>

              {/* --- NAYA CAPTCHA --- */}
              <SimpleCaptcha 
                isVerified={isVerified} 
                onVerify={(val) => { setIsVerified(val); if(touched.captcha) setValidationErrors(prev => ({...prev, captcha: ""})) }} 
                onRefresh={() => setIsVerified(false)}
              />
              {touched.captcha && validationErrors.captcha && <div className="text-danger mb-3" style={{ fontSize: '12px' }}>⚠ {validationErrors.captcha}</div>}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={authLoading}
                className="btn w-100 py-3 fw-bold text-uppercase d-flex align-items-center justify-content-center gap-2"
                style={{
                  background: authLoading ? 'rgba(245,158,11,0.5)' : '#F59E0B',
                  color: '#0B1120',
                  borderRadius: '10px',
                  fontSize: '14px',
                  letterSpacing: '1px',
                  transition: 'all 0.3s ease'
                }}
              >
                {authLoading && <span className="spinner-border spinner-border-sm" />}
                {authLoading ? "Logging In..." : "Login Now"}
              </button>
            </form>

            {/* Divider */}
            <div className="d-flex align-items-center gap-3 my-4">
              <div className="flex-grow-1" style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ color: '#64748b', fontSize: '12px' }}>OR</span>
              <div className="flex-grow-1" style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            </div>

            {/* Signup Button */}
            <button
              onClick={() => router.push('/user/register')}
              className="btn w-100 py-3 fw-bold"
              style={{
                background: 'transparent',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '10px',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => { e.target.style.border = '1px solid #F59E0B'; e.target.style.color = '#F59E0B'; }}
              onMouseLeave={(e) => { e.target.style.border = '1px solid rgba(255,255,255,0.2)'; e.target.style.color = '#fff'; }}
            >
              Create an account
            </button>

          </div>
        </div>
      </div>
    </>
  )
}