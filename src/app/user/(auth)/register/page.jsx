'use client'

import React, { useState, useEffect, Suspense, useMemo } from "react"
import { useRouter } from "next/navigation"
import Select from "react-select"
import { userRegistration, getAllCountry, getReferralDataByLoginId, sendOtpForUserRegistration } from "@/app/redux/slices/authSlice"
import { Toaster, toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { User, Mail, Lock, Phone, UserPlus, Shield, Check } from "lucide-react"

const SimpleCaptcha = ({ onVerify, isVerified }) => {
  const [isChecking, setIsChecking] = useState(false)

  const handleCheck = () => {
    if (isVerified) return
    setIsChecking(true)
    setTimeout(() => {
      setIsChecking(false)
      onVerify(true)
    }, 800)
  }

  return (
    <div
      className="d-flex align-items-center justify-content-between p-3 rounded-3"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div className="d-flex align-items-center gap-3">
        <div
          onClick={handleCheck}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '4px',
            cursor: 'pointer',
            border: isVerified ? 'none' : '2px solid rgba(255,255,255,0.3)',
            background: isVerified ? '#F59E0B' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
        >
          {isChecking && (
            <div
              style={{
                width: '14px',
                height: '14px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid #F59E0B',
                borderRadius: '50%',
                animation: 'spin 0.6s linear infinite',
              }}
            />
          )}
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

// ---------------------------------------------------------------------------
// PASSWORD STRENGTH CHECKER
// ---------------------------------------------------------------------------
const passwordRules = (pwd = "") => ({
  upper: /[A-Z]/.test(pwd),
  lower: /[a-z]/.test(pwd),
  number: /\d/.test(pwd),
  special: /[^A-Za-z0-9]/.test(pwd),
  length: pwd.length >= 8,
})

const isStrongPassword = (pwd = "") => {
  const r = passwordRules(pwd)
  return r.upper && r.lower && r.number && r.special && r.length
}

function SignupContent() {
  const router = useRouter()
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  const initialReferralId = searchParams.get('ref') || ''
  const initialIntroSide = (() => {
    const pos = searchParams.get('Position')
    if (pos === 'L') return 'L'
    if (pos === 'R') return 'R'
    return ''
  })()
  const [pageLoading, setPageLoading] = useState(true)

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "",
    password: "", phoneNo: "", countryId: "",
    referralId: initialReferralId,
    introSide: initialIntroSide,
  })

  const [countryOptions, setCountryOptions] = useState([])
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [referralData, setReferralData] = useState(null)
  const [referralLoading, setReferralLoading] = useState(false)
  const [referralError, setReferralError] = useState("")
  const [referralBlurCalled, setReferralBlurCalled] = useState(!!initialReferralId)
  const [riskDisclosureAccepted, setRiskDisclosureAccepted] = useState(false)
  const [showRiskDisclosure, setShowRiskDisclosure] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpValue, setOtpValue] = useState("")
  const [otpLoading, setOtpLoading] = useState(false)

  const [errors, setErrors] = useState({
    firstName: "", lastName: "", email: "",
    password: "", phoneNo: "", countryId: "", captcha: "", referralId: "", otp: "", riskDisclosure: "",
  })

  // ✅ Live password rule flags
  const pwdRules = useMemo(() => passwordRules(formData.password), [formData.password])

  // ✅ Check if all required fields are filled → enable Send OTP button
  const isFormReadyForOtp = useMemo(() => {
    const { firstName, lastName, countryId, email, phoneNo, password, referralId } = formData

    const allFilled =
      firstName?.trim().length >= 2 &&
      lastName?.trim().length >= 2 &&
      !!countryId &&
      /^\S+@\S+\.\S+$/.test(email || "") &&
      phoneNo?.length >= 8 &&
      phoneNo?.length <= 13 &&
      isStrongPassword(password) &&
      referralId?.trim().length > 0

    const referralValid = !!referralData && !referralError

    return allFilled && referralValid
  }, [formData, referralData, referralError])

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (initialReferralId) validateReferralId(initialReferralId)
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const res = await dispatch(getAllCountry()).unwrap()
        if (res?.statusCode === 200 && res.data) {
          const options = res.data
            .filter((c) => c.isActive)
            .map((c) => ({
              value: c.country_Id,
              label: c.country_Name,
              dialCode: c.phonecode,
              flagUrl: c.countryFlag,
              countryCode: c.country_Code?.trim(),
              phonecode: c.phonecode,
            }))
            .sort((a, b) => a.label.localeCompare(b.label))
          setCountryOptions(options)
        }
      } catch (err) {
        toast.error("Failed to load countries. Please refresh.")
      }
    })()
  }, [])

  const validateReferralId = async (referralId) => {
    if (!referralId.trim()) {
      setReferralError("")
      setReferralData(null)
      return false
    }
    setReferralLoading(true)
    setReferralError("")
    try {
      const res = await dispatch(getReferralDataByLoginId(referralId)).unwrap()
      if (res?.statusCode === 200 && res?.data) {
        setReferralData(res.data)
        setReferralError("")
        setErrors(prev => ({ ...prev, referralId: "" }))
        return true
      } else {
        setReferralData(null)
        setReferralError(res?.message || "Invalid referral ID")
        setErrors(prev => ({ ...prev, referralId: res?.message || "Invalid referral ID" }))
        return false
      }
    } catch (err) {
      setReferralData(null)
      setReferralError(err?.toString() || "Failed to validate referral ID")
      setErrors(prev => ({ ...prev, referralId: err?.toString() || "Failed to validate referral ID" }))
      return false
    } finally {
      setReferralLoading(false)
    }
  }

  const [typingTimer, setTypingTimer] = useState(null)
  const handleReferralChange = (e) => {
    const { value } = e.target
    setFormData(prev => ({ ...prev, referralId: value }))
    if (typingTimer) clearTimeout(typingTimer)
    setReferralBlurCalled(false)
    setReferralData(null)
    setReferralError("")
    setOtpSent(false)
    setOtpValue("")
    if (value.trim()) {
      setTypingTimer(
        setTimeout(() => {
          setReferralBlurCalled(true)
          validateReferralId(value)
        }, 1000)
      )
    } else {
      setErrors(prev => ({ ...prev, referralId: "" }))
    }
  }

  // ✅ SEND OTP HANDLER
  const handleSendOtp = async () => {
    if (!isFormReadyForOtp) {
      toast.error("Please fill all fields correctly first")
      return
    }
    if (!referralData || referralError) {
      toast.error("Please enter a valid referral ID first")
      return
    }
    if (!formData.email?.trim()) {
      toast.error("Please enter your email first")
      return
    }

    setOtpLoading(true)
    try {
      const res = await dispatch(sendOtpForUserRegistration(formData.email)).unwrap()
      if (res?.statusCode === 200) {
        setOtpSent(true)
        setErrors(prev => ({ ...prev, otp: "" }))
        toast.success("OTP sent successfully!")
      } else {
        toast.error(res?.message || "Failed to send OTP")
      }
    } catch (err) {
      toast.error(err?.message || "Failed to send OTP")
    } finally {
      setOtpLoading(false)
    }
  }

  // ✅ OTP INPUT HANDLER
  const handleOtpChange = (e) => {
    const { value } = e.target
    if (!/^\d*$/.test(value)) return
    if (value.length > 6) return
    setOtpValue(value)
    if (errors.otp) setErrors(prev => ({ ...prev, otp: "" }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "phoneNo") {
      if (!/^\d*$/.test(value)) return
      if (value.length > 13) return
    }
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleCountryChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      countryId: selectedOption?.value || "",
      phonecode: selectedOption?.phonecode || "",
    }))
    if (errors.countryId) setErrors(prev => ({ ...prev, countryId: "" }))
  }

  const handleCaptchaVerify = (isVerified) => {
    setCaptchaVerified(isVerified)
    if (isVerified) setErrors(prev => ({ ...prev, captcha: "" }))
  }

  const validateForm = () => {
    let newErrors = {
      firstName: "", lastName: "", email: "", password: "",
      phoneNo: "", countryId: "", captcha: "", referralId: "", otp: "", riskDisclosure: ""
    }
    if (!formData.firstName?.trim()) newErrors.firstName = "First name is required"
    else if (formData.firstName.trim().length < 2) newErrors.firstName = "At least 2 characters"

    if (!formData.lastName?.trim()) newErrors.lastName = "Last name is required"
    else if (formData.lastName.trim().length < 2) newErrors.lastName = "At least 2 characters"

    if (!formData.email?.trim()) newErrors.email = "Email is required"
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Enter a valid email"

    // ✅ Strong password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Min 8 characters"
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Add at least 1 uppercase letter"
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Add at least 1 lowercase letter"
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = "Add at least 1 number"
    } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
      newErrors.password = "Add at least 1 special character"
    }

    if (!formData.phoneNo) newErrors.phoneNo = "Mobile number is required"
    else if (formData.phoneNo.length < 8 || formData.phoneNo.length > 13) newErrors.phoneNo = "Phone number must be 8-13 digits"

    if (!formData.countryId) newErrors.countryId = "Please select a country"

    if (!formData.referralId?.trim()) newErrors.referralId = "Referral ID is required"
    else if (referralError) newErrors.referralId = referralError

    if (!captchaVerified) newErrors.captcha = "Please verify you are not a robot"

    if (!riskDisclosureAccepted) newErrors.riskDisclosure = "Please accept the Risk Disclosure"

    // ✅ OTP VALIDATION
    if (!otpSent) newErrors.otp = "Please send OTP first"
    else if (!otpValue.trim()) newErrors.otp = "OTP is required"
    else if (otpValue.length < 6) newErrors.otp = "OTP must be 6 digits"

    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error !== "")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    if (!referralData && formData.referralId.trim()) {
      const isValid = await validateReferralId(formData.referralId)
      if (!isValid) {
        toast.error("Please enter a valid referral ID")
        return
      }
    }
    setLoading(true)
    try {
      const payload = {
        introAuthlogin: formData.referralId || "",
        password: formData.password,
        fName: formData.firstName,
        lName: formData.lastName,
        mobile: formData.phoneNo,
        email: formData.email,
        countryId: parseInt(formData.countryId),
        address: "",
        introSide: formData.introSide || "L",
        otPregpage: otpValue || ""
      }
      const res = await dispatch(userRegistration(payload)).unwrap()
      if (res?.statusCode !== 200) throw new Error(res?.message || "Signup failed")
      toast.success("Account created successfully!")
      if (typeof window !== "undefined") {
        localStorage.setItem("welcomeData", JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          authLogin: formData.email,
          authPassword: formData.password,
        }))
      }
      setFormData({
        firstName: "", lastName: "", email: "", password: "",
        phoneNo: "", countryId: "", referralId: "", introSide: ""
      })
      setReferralData(null)
      setCaptchaVerified(false)
      setOtpSent(false)
      setOtpValue("")
      setTimeout(() => router.push("/user/welcome"), 1500)
    } catch (err) {
      toast.error(err.message || err || "Signup failed")
      setCaptchaVerified(false)
    } finally {
      setLoading(false)
    }
  }

  // ── react-select styles (Gold Theme, transparent) ──
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "transparent",
      borderColor: state.isFocused ? "#F59E0B" : "rgba(255,255,255,0.1)",
      borderRadius: "0.75rem",
      minHeight: "48px",
      boxShadow: "none",
      transition: "all 0.2s",
      cursor: "pointer",
      "&:hover": { borderColor: "rgba(245,158,11,0.55)" },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#111827",
      border: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      zIndex: 9999,
    }),
    menuList: (base) => ({ ...base, padding: "4px", maxHeight: "200px", backgroundColor: "#111827" }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "rgba(245,158,11,0.1)" : "transparent",
      color: "#eef3f8",
      fontSize: "13px",
      borderRadius: "8px",
      cursor: "pointer",
      padding: "8px 10px",
    }),
    singleValue: (base) => ({ ...base, color: "#eef3f8", fontSize: "14px" }),
    placeholder: (base) => ({ ...base, color: "#F59E0B", fontSize: "14px" }),
    input: (base) => ({ ...base, color: "#eef3f8", fontSize: "14px" }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#8ea0b5",
      "&:hover": { color: "#F59E0B" },
    }),
  }

  const formatOptionLabel = ({ label, dialCode, flagUrl }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <img src={flagUrl} alt={label} className="country-flag" />
      <span className="country-label">{label}</span>
      <span className="country-dial-code">+{dialCode}</span>
    </div>
  )

  const handleFocus = (e) => {
    e.target.style.borderColor = "#F59E0B"
    e.target.style.boxShadow = "none"
  }

  const handleBlurStyle = (e, hasError) => {
    e.target.style.borderColor = hasError ? "rgba(239,68,68,0.45)" : "rgba(255,255,255,0.1)"
    e.target.style.boxShadow = "none"
  }

  const errorStyle = {
    color: "#f87171",
    fontSize: "11px",
    marginTop: "4px",
    fontFamily: "monospace",
  }

  const iconStyle = {
    position: "absolute",
    left: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#F59E0B",
    pointerEvents: "none",
  }

  if (pageLoading) {
    return (
      <>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" />
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
    )
  }

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" />
      <link rel="stylesheet" href="/assets/css/login.css" />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#111827", color: "#f3f4f6",
            border: "1px solid rgba(245,158,11,0.3)",
            borderRadius: "12px", fontSize: "13px",
          },
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
        overflow: 'auto'
      }}>

        <div className="position-absolute inset-0" style={{ background: 'rgba(11, 17, 32, 0.4)', zIndex: 0 }} />

        <div className="position-absolute rounded-circle pe-none orb-purple" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)', zIndex: 0 }} />
        <div className="position-absolute rounded-circle pe-none orb-cyan" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)', zIndex: 0 }} />
        <div className="position-absolute top-50 start-50 translate-middle rounded-circle pe-none orb-center" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%)', zIndex: 0 }} />

        <div className="position-relative z-1 w-100 px-4 px-md-5 py-5 rounded-4 signup-card login-card"
          style={{
            background: 'rgba(17, 24, 39, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            zIndex: 1
          }}>
          <div className="position-absolute top-0 start-50 translate-middle-x shimmer-line" style={{ background: 'linear-gradient(90deg, transparent, #F59E0B, transparent)' }} />

          <div className="d-flex justify-content-center mb-2">
            <Link href='/'>
              <img src="/logo.png" alt="Logo" className="login-logo" />
            </Link>
          </div>

          <div className="d-flex align-items-center gap-3 mt-4 mb-4">
            <div className="flex-grow-1 divider-line" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <span className="login-label" style={{ color: '#94a3b8' }}>Create Account</span>
            <div className="flex-grow-1 divider-line" style={{ background: 'rgba(255,255,255,0.08)' }} />
          </div>

          <form onSubmit={handleSubmit}>
            {/* First + Last Name */}
            <div className="row g-3 mb-3">
              {[
                { name: "firstName", label: "First Name", placeholder: "Enter First Name", error: errors.firstName },
                { name: "lastName", label: "Last Name", placeholder: "Enter Last Name", error: errors.lastName },
              ].map(({ name, label, placeholder, error }) => (
                <div className="col-12 col-sm-6" key={name}>
                  <label className="form-label text-white-50 small fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>{label}</label>
                  <div className="position-relative">
                    <div className="position-absolute top-50 start-0 translate-middle-y ms-3" style={{ color: '#F59E0B', zIndex: 2 }}>
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      name={name}
                      placeholder={placeholder}
                      value={formData[name]}
                      onChange={handleChange}
                      className="form-control bg-transparent text-white ps-5 py-3"
                      style={{
                        borderRadius: '10px',
                        border: error ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                        boxShadow: 'none',
                        color: '#fff',
                        transition: 'border 0.2s ease',
                      }}
                      onFocus={(e) => (e.target.style.border = '1px solid #F59E0B')}
                      onBlur={(e) =>
                      (e.target.style.border = error
                        ? '1px solid #ef4444'
                        : '1px solid rgba(255,255,255,0.1)')
                      }
                    />
                  </div>
                  {error && <div className="text-danger mt-1" style={{ fontSize: '12px' }}>⚠ {error}</div>}
                </div>
              ))}
            </div>

            {/* Country + Email */}
            <div className="row g-3 mb-3">
              <div className="col-12 col-sm-6">
                <label className="login-label" style={{ color: '#cbd5e1' }}>Country</label>
                <Select
                  options={countryOptions}
                  onChange={handleCountryChange}
                  formatOptionLabel={formatOptionLabel}
                  placeholder="Select country..."
                  isSearchable
                  styles={selectStyles}
                  value={countryOptions.find((o) => o.value === formData.countryId) || null}
                  classNamePrefix="rs"
                />
                {errors.countryId && <div className="error-message" style={errorStyle}>{errors.countryId}</div>}
              </div>
              <div className="col-12 col-sm-6">
                <label className="form-label text-white-50 small fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Email</label>
                <div className="position-relative">
                  <div className="position-absolute top-50 start-0 translate-middle-y ms-3" style={{ color: '#F59E0B', zIndex: 2 }}>
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control bg-transparent text-white ps-5 py-3"
                    style={{
                      borderRadius: '10px',
                      border: errors.email ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                      boxShadow: 'none',
                      color: '#fff',
                      transition: 'border 0.2s ease',
                    }}
                    onFocus={(e) => (e.target.style.border = '1px solid #F59E0B')}
                    onBlur={(e) => {
                      e.target.style.border = errors.email
                        ? '1px solid #ef4444'
                        : '1px solid rgba(255,255,255,0.1)'
                    }}
                  />
                </div>
                {errors.email && <div className="text-danger mt-1" style={{ fontSize: '12px' }}>⚠ {errors.email}</div>}
              </div>
            </div>

            {/* Mobile + Password */}
            <div className="row g-3 mb-3">
              <div className="col-12 col-sm-6">
                <label className="login-label" style={{ color: '#cbd5e1' }}>Mobile Number</label>
                <div className="position-relative">
                  <span style={iconStyle}><Phone size={15} /></span>
                  <input
                    type="text"
                    name="phoneNo"
                    placeholder="Enter Mobile Number"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    className="form-control bg-transparent text-white pe-5 py-3"
                    style={{
                      borderRadius: '10px',
                      border: errors.phoneNo ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                      boxShadow: 'none',
                      color: '#fff',
                      paddingLeft: '2.25rem',
                      transition: 'border 0.2s ease',
                    }}
                    onFocus={handleFocus}
                    onBlur={(e) => handleBlurStyle(e, errors.phoneNo)}
                  />
                </div>
                {errors.phoneNo && <div className="error-message" style={errorStyle}>{errors.phoneNo}</div>}
              </div>

              {/* PASSWORD with strength hint */}
              <div className="col-12 col-sm-6">
                <label className="login-label" style={{ color: '#cbd5e1' }}>Password</label>
                <div className="position-relative">
                  <span style={iconStyle}><Lock size={15} /></span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter Strong password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control bg-transparent text-white pe-5 py-3"
                    style={{
                      borderRadius: '10px',
                      border: errors.password ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                      boxShadow: 'none',
                      color: '#fff',
                      paddingLeft: '2.25rem',
                      paddingRight: '2.5rem',
                      transition: 'border 0.2s ease',
                    }}
                    onFocus={handleFocus}
                    onBlur={(e) => handleBlurStyle(e, errors.password)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="password-toggle-btn"
                    style={{ color: '#F59E0B' }}
                  >
                    {showPassword ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <line x1="2" x2="22" y1="2" y2="22" />
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* ✅ Strong password hint + live checklist */}
                <div style={{ marginTop: '6px' }}>
                  <div style={{ fontSize: '10.5px', color: '#94a3b8', marginBottom: '4px' }}>
                    Must contain: uppercase, lowercase, number &amp; special character (min 8 chars)
                  </div>

                </div>

                {errors.password && <div className="error-message" style={errorStyle}>{errors.password}</div>}
              </div>
            </div>

            {/* Referral + OTP */}
            <div className="row g-3 mb-3">
              <div className="col-12 col-sm-6">
                <label className="login-label" style={{ color: '#cbd5e1' }}>Referral ID</label>
                <div className="position-relative">
                  <span style={iconStyle}><UserPlus size={15} /></span>
                  <input
                    type="text"
                    name="referralId"
                    placeholder="Enter Referral ID"
                    value={formData.referralId}
                    onChange={handleReferralChange}
                    className="form-control bg-transparent text-white pe-5 py-3"
                    style={{
                      borderRadius: '10px',
                      border: errors.referralId ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                      boxShadow: 'none',
                      color: '#fff',
                      paddingLeft: '2.25rem',
                      transition: 'border 0.2s ease',
                    }}
                    onFocus={handleFocus}
                    onBlur={(e) => handleBlurStyle(e, errors.referralId)}
                  />
                </div>

                {referralBlurCalled && (
                  <div>
                    {referralLoading ? (
                      <div className="referral-loading">
                        <span className="referral-spinner"></span>
                        <span className="referral-validating-text" style={{ color: '#94a3b8' }}>Validating referral...</span>
                      </div>
                    ) : referralError ? (
                      <p className="error-message" style={errorStyle}>{referralError}</p>
                    ) : referralData ? (
                      <div className="referral-success">
                        <p className="referral-name" style={{ color: '#22c55e' }}>
                          {referralData.fullName || `${referralData.fName} ${referralData.lName}` || "Referral found"}
                        </p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* OTP */}
              <div className="col-12 col-sm-6">
                <label className="login-label" style={{ color: '#cbd5e1' }}>OTP</label>
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpLoading || !isFormReadyForOtp}
                    title={!isFormReadyForOtp ? "Fill all fields correctly to enable" : "Send OTP"}
                    className="btn w-100 d-flex align-items-center justify-content-center gap-2 fw-bold text-uppercase"
                    style={{
                      height: "48px",
                      background: (otpLoading || !isFormReadyForOtp)
                        ? "rgba(140,180,200,0.2)"
                        : "linear-gradient(135deg, #F59E0B, #d97706)",
                      border: "1px solid rgba(245,158,11,0.25)",
                      color: "#0B1120",
                      borderRadius: "10px",
                      cursor: (otpLoading || !isFormReadyForOtp) ? "not-allowed" : "pointer",
                      opacity: (otpLoading || !isFormReadyForOtp) ? 0.5 : 1,
                      fontSize: "14px",
                      letterSpacing: "1px",
                    }}
                  >
                    {otpLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" style={{ color: '#0B1120' }} />
                        Sending OTP...
                      </>
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                ) : (
                  <div className="position-relative">
                    <span style={iconStyle}><Lock size={15} /></span>
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otpValue}
                      onChange={handleOtpChange}
                      className="form-control bg-transparent text-white pe-5 py-3"
                      style={{
                        borderRadius: '10px',
                        border: errors.otp ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                        boxShadow: 'none',
                        color: '#fff',
                        paddingLeft: '2.25rem',
                        transition: 'border 0.2s ease',
                      }}
                      onFocus={handleFocus}
                      onBlur={(e) => handleBlurStyle(e, errors.otp)}
                      maxLength={6}
                    />
                  </div>
                )}
                {errors.otp && <div className="error-message" style={errorStyle}>{errors.otp}</div>}
              </div>
            </div>
             <div className="row g-3 mb-4">
              <div className="col-12">
                <div
                  className="d-flex align-items-center justify-content-between p-3 rounded-3"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div
                      onClick={() => {
                        const newValue = !riskDisclosureAccepted
                        setRiskDisclosureAccepted(newValue)
                        setShowRiskDisclosure(newValue)
                        if (newValue && errors.riskDisclosure) {
                          setErrors(prev => ({ ...prev, riskDisclosure: "" }))
                        }
                      }}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        border: riskDisclosureAccepted ? 'none' : '2px solid rgba(255,255,255,0.3)',
                        background: riskDisclosureAccepted ? '#F59E0B' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {riskDisclosureAccepted && <Check size={16} color="#0B1120" strokeWidth={3} />}
                    </div>
                    <Link
                      href="/user/termcondition"
                      target="_blank"
                      style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}
                    >
                      I acknowledge the risks outlined in the Risk Disclosure.
                    </Link>
                  </div>
                 
                </div>
                {errors.riskDisclosure && <div className="error-message text-center" style={errorStyle}>{errors.riskDisclosure}</div>}
              </div>
            </div>

            {/* Captcha */}
            <div className="row g-3 mb-4">
              <div className="col-12">
                <SimpleCaptcha
                  isVerified={captchaVerified}
                  onVerify={handleCaptchaVerify}
                />
                {errors.captcha && <div className="error-message text-center" style={errorStyle}>{errors.captcha}</div>}
              </div>
            </div>
           

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !otpSent || !riskDisclosureAccepted || !captchaVerified}
              className={`btn w-100 d-flex align-items-center justify-content-center gap-2 fw-bold text-uppercase mt-2 ${loading ? 'login-submit-loading' : ''}`}
              style={{
                background: '#F59E0B',
                color: '#0B1120',
                borderRadius: '10px',
                fontSize: '14px',
                letterSpacing: '1px',
                padding: '12px',
                border: 'none',
                opacity: (!otpSent || loading || !riskDisclosureAccepted || !captchaVerified) ? 0.6 : 1,
                cursor: (!otpSent || loading || !riskDisclosureAccepted || !captchaVerified) ? 'not-allowed' : 'pointer',
              }}
            >
              {loading && (
                <span className="spinner-border spinner-border-sm" style={{ color: '#0B1120' }} />
              )}
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="d-flex align-items-center gap-2 my-4">
            <div className="flex-grow-1 or-divider" style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <span className="or-text" style={{ color: '#64748b', fontSize: '12px' }}>or</span>
            <div className="flex-grow-1 or-divider" style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          <button
            onClick={() => router.push("/user/login")}
            className="btn w-100"
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              borderRadius: '10px',
              padding: '12px',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.border = '1px solid #F59E0B'; e.currentTarget.style.color = '#F59E0B'; e.currentTarget.style.background = 'rgba(245,158,11,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'transparent'; }}
          >
            Already have an account? Sign In
          </button>
        </div>
      </div>

      <style jsx global>{`
        /* ========== FORCE ALL INPUTS TRANSPARENT ========== */
        .signup-card .form-control,
        .signup-card input:not([type="checkbox"]),
        .signup-card input[type="text"],
        .signup-card input[type="email"],
        .signup-card input[type="password"] {
          background: transparent !important;
          background-color: transparent !important;
          color: #fff !important;
          box-shadow: none !important;
        }

        /* ✅ PLACEHOLDER GOLD */
        .signup-card .form-control::placeholder,
        .signup-card input::placeholder {
          color: #F59E0B !important;
          opacity: 1 !important;
        }

        /* Autofill override */
        .signup-card input:-webkit-autofill,
        .signup-card input:-webkit-autofill:hover,
        .signup-card input:-webkit-autofill:focus {
          -webkit-text-fill-color: #fff !important;
          -webkit-box-shadow: 0 0 0 1000px rgba(17,24,39,0.9) inset !important;
          box-shadow: 0 0 0 1000px rgba(17,24,39,0.9) inset !important;
          transition: background-color 5000s ease-in-out 0s !important;
          caret-color: #fff !important;
        }

        /* ========== CARD BACKGROUND ========== */
        .signup-card,
        .login-card {
          background: rgba(17, 24, 39, 0.9) !important;
        }

        /* ========== REACT-SELECT (Country) ========== */
        .signup-card [class*="-control"] {
          background-color: transparent !important;
          background: transparent !important;
          border-color: rgba(255,255,255,0.1) !important;
          box-shadow: none !important;
          min-height: 48px;
        }

        .signup-card [class*="-control"]:hover {
          border-color: rgba(245,158,11,0.55) !important;
        }

        .signup-card [class*="-control"][class*="is-focused"] {
          border-color: #F59E0B !important;
        }

        /* ✅ COUNTRY PLACEHOLDER GOLD */
        .signup-card [class*="-placeholder"] {
          color: #F59E0B !important;
          opacity: 1 !important;
        }

        .signup-card [class*="-singleValue"] {
          color: #ffffff !important;
        }

        .signup-card [class*="-input"] input,
        .signup-card [class*="-Input"] input {
          color: #ffffff !important;
          background: transparent !important;
          box-shadow: none !important;
        }

        .signup-card [class*="-indicatorContainer"],
        .signup-card [class*="-dropdownIndicator"] {
          color: #8ea0b5 !important;
        }

        .signup-card [class*="-dropdownIndicator"]:hover {
          color: #F59E0B !important;
        }

        .signup-card [class*="-indicatorSeparator"] {
          display: none !important;
        }

        /* Dropdown menu */
        .signup-card [class*="-menu"] {
          background-color: #111827 !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
          z-index: 9999 !important;
        }

        .signup-card [class*="-menuList"] {
          background-color: #111827 !important;
        }

        /* ========== DROPDOWN OPTIONS — TEXT WHITE ========== */
        .signup-card [class*="-option"] {
          background-color: transparent !important;
          color: #ffffff !important;
          cursor: pointer !important;
        }

        .signup-card [class*="-option"]:hover,
        .signup-card [class*="-option"][class*="-focused"],
        .signup-card [class*="-option"][class*="focused"] {
          background-color: rgba(245, 158, 11, 0.15) !important;
          color: #ffffff !important;
        }

        .signup-card [class*="-option"][class*="is-selected"],
        .signup-card [class*="-option"][class*="isSelected"] {
          background-color: rgba(245, 158, 11, 0.25) !important;
          color: #ffffff !important;
        }

        /* ========== COUNTRY LABEL + DIAL CODE ========== */
        .signup-card .country-label {
          color: #ffffff !important;
        }

        .signup-card .country-dial-code {
          color: #ffffff !important;
        }

        .signup-card .country-flag {
          border-radius: 2px;
        }

        /* ========== NO OPTIONS MESSAGE ========== */
        .signup-card [class*="-noOptionsMessage"] {
          color: #ffffff !important;
          background-color: #111827 !important;
        }

        /* ========== LOADING MESSAGE ========== */
        .signup-card [class*="-loadingMessage"] {
          color: #ffffff !important;
          background-color: #111827 !important;
        }

        /* ========== BASE ========== */
        html, body {
          margin: 0;
          padding: 0;
          background: #0B1120;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B1120] flex items-center justify-center text-[#F59E0B]">Loading...</div>}>
      <SignupContent />
    </Suspense>
  )
}