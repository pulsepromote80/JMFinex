// "use client";

// import { useState, useEffect } from 'react';
// import { useRouter } from "next/navigation";
// import { doUserLogout, getToken, getUserId } from '@/app/api/auth';
// import { getAllCountry, getUserDashboardDetails, sendOtpFundRequest, validateOtp, sendOtpRequestwalletaddress, updatePassword, getProfileDetails } from '@/app/redux/slices/authSlice';
// import { useDispatch, useSelector } from 'react-redux';
// import toast from 'react-hot-toast';
// import { useDispatch as useReduxDispatch } from 'react-redux';
// // import Loader from '../../components/Loader';
// import * as yup from "yup";
// import { useFormik } from "formik";
// import { FiUser, FiLock } from "react-icons/fi";
// import { BASE_URL } from '@/app/constants/constant';

// const isValidBep20Length = (value) => {
//   if (!value) return true;
//   return value && value.length >= 38 && value.length <= 44;
// };

// const passwordSchema = yup.object().shape({
//   oldPassword: yup.string().required('Current password is required'),
//   newPassword: yup.string()
//     .required('New password is required')
//     .min(4, 'Password must be at least 4 characters')
//     .notOneOf([yup.ref('oldPassword')], 'New password must be different from current password'),
//   confirmPassword: yup.string()
//     .required('Please confirm your password')
//     .oneOf([yup.ref('newPassword')], 'Passwords must match')
// });

// const labelStyle = {
//   display: "block",
//   marginBottom: "6px",
//   fontSize: "12px",
//   fontWeight: 500,
//   color: "#000",
//   textTransform: "uppercase",
//   letterSpacing: "0.04em",
// };

// const inputStyle = {
//   width: "100%",
//   padding: "10px 12px",
//   background: "var(--vi-card2, rgba(255,255,255,0.05))",
//   border: "1px solid var(--vi-border, #374151)",
//   borderRadius: "8px",
//   color: "#000",
//   fontSize: "13px",
//   outline: "none",
//   transition: "border-color 0.2s",
// };

// export default function Profile() {
//   const dispatch = useReduxDispatch();
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState('profile');
//   const [fName, setfName] = useState('');
//   const [lastName, setlastName] = useState("");
//   const [email, setEmail] = useState('');
//   const [loginId, setLoginId] = useState("");
//   const [phone, setPhone] = useState('');
//   const [country, setCountry] = useState('');

//   const [userData, setUserData] = useState(null);
//   const [greetingTime, setGreetingTime] = useState('');
//   const [walletAddress, setWalletAddress] = useState("");
//   const [originalWallet, setOriginalWallet] = useState("");
//   const [address, setAddress] = useState("");
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [otpError, setOtpError] = useState("");
//   const [isOtpLoading, setIsOtpLoading] = useState(false);
//   const [isSaveLoading, setIsSaveLoading] = useState(false);
//   const [isWalletSet, setIsWalletSet] = useState(false);
//   const [passwordError, setPasswordError] = useState(null);
//   const [isPasswordLoading, setIsPasswordLoading] = useState(false);

//   // Password OTP flow
//   const [isPasswordOtpSent, setIsPasswordOtpSent] = useState(false);
//   const [passwordOtp, setPasswordOtp] = useState("");
//   const [passwordOtpError, setPasswordOtpError] = useState("");
//   const [isPasswordOtpLoading, setIsPasswordOtpLoading] = useState(false);
//   const [isPasswordOtpVerified, setIsPasswordOtpVerified] = useState(false);

//   const token = getToken();
//   const { getAllCountryData, UserdashboardData, profileData } = useSelector((state) => state.auth);


//   // Password change formik
//   const AuthEmail = JSON.parse(localStorage.getItem("currentUserPlain"))?.userData?.AuthLogin;
//   const passwordFormik = useFormik({
//     initialValues: {
//       oldPassword: '',
//       newPassword: '',
//       confirmPassword: ''
//     },
//     validationSchema: passwordSchema,
//     onSubmit: async (values) => {
//       try {
//         setIsPasswordLoading(true);
//         setPasswordError(null);
//         const data = {
//           userId: loginId,
//           oldPassword: values.oldPassword,
//           newPass: values.newPassword
//         };
//         const result = await dispatch(updatePassword(data)).unwrap();
//         if (result.statusCode === 200) {
//           toast.success(result.message);
//           passwordFormik.resetForm();
          
//         } else if (result.statusCode === 409) {
//           toast.error(result.message);
//         } else if (result.error) {
//           throw new Error(result.error.message || 'Password update failed');
//         }
//       } catch (err) {
//         setPasswordError(err.message || 'An error occurred while updating password');
//         toast.error(err.message || 'An error occurred while updating password');
//       } finally {
//         setIsPasswordLoading(false);
//       }
//     }
//   });
//   const profileDataLoading = async () => {
//     try {
//       const result = await dispatch(getProfileDetails()).unwrap();
//       // Agar thunk response me data aa raha hai
//       if (result) {

//         const user = result?.[0] || result.payload;
//         setUserData(user);

//         setfName(user.FName || "");
//         setlastName(user.LName || "");
//         setEmail(user.Email || "");
//         setPhone(user.Mobile || "");
//         setCountry(user.CountryId || "");
//         setWalletAddress(user.WalletBep20 || "");
//         setOriginalWallet(user.WalletBep20 || "");
//         setLoginId(user.AuthLogin || "");
//         setAddress(user.Address || "");

//         // Check wallet
//         if (user.WalletBep20 && isValidBep20Length(user.WalletBep20)) {
//           setIsWalletSet(true);
//         }

//         // Greeting
//         const hour = new Date().getHours();

//         if (hour < 12) {
//           setGreetingTime("Good morning");
//         } else if (hour < 18) {
//           setGreetingTime("Good afternoon");
//         } else {
//           setGreetingTime("Good evening");
//         }
//       }
//     } catch (e) {
//       console.log("err =>", e);
//     }
//   };

//   useEffect(() => {
//     profileDataLoading();
//   }, []);

//   useEffect(() => {
//     dispatch(getAllCountry());
//     dispatch(getUserDashboardDetails());
//   }, [dispatch]);
//   const kid = UserdashboardData?.[0]?.Kid;

//   const copyAffiliateCode = () => {
//     const code = userData?.AuthLogin || '';
//     navigator.clipboard.writeText(code);
//     toast.success('Affiliate code copied');
//   };

//   const revealApiKey = () => {
//     const apiKey = userData?.token || 'arb_live_a9x7k2m3n4p5q6r7s8t9';
//     toast.success(`API Key: ${apiKey}`);
//   };

//   const signOut = (e) => {
//     e.preventDefault();
//     doUserLogout();
//     router.push('/user/login');
//   };

//   // Format wallet address for display
//   const formatWalletAddress = (address) => {
//     if (!address) return 'Not connected';
//     return `${address.slice(0, 6)}...${address.slice(-4)}`;
//   };

//   const handleSendOtp = async () => {
//     if (!walletAddress) {
//       toast.error("Please enter wallet address first");
//       return;
//     }

//     if (!isValidBep20Length(walletAddress)) {
//       toast.error("Wallet address must be 38-44 characters long");
//       return;
//     }

//     try {
//       setIsOtpLoading(true);
//       const response = await dispatch(
//         sendOtpRequestwalletaddress()
//       ).unwrap();

//       if (response?.statusCode === 200) {
//         setIsOtpSent(true);
//         toast.success(response?.data?.message || "OTP sent to your email");
//       } else {
//         toast.error(response?.message || "Failed to send OTP");
//       }
//     } catch (error) {
//       toast.error(error?.message || "Failed to send OTP");
//     } finally {
//       setIsOtpLoading(false);
//     }
//   };

//   const handleSendPasswordOtp = async () => {
//     const { oldPassword, newPassword, confirmPassword } = passwordFormik.values;
//     if (!oldPassword || !newPassword || !confirmPassword) {
//       toast.error("Please fill all password fields first");
//       return;
//     }

//     try {
//       setIsPasswordOtpLoading(true);
//       setPasswordOtpError("");

//       const emailId = email || JSON.parse(localStorage.getItem("currentUserPlain"))?.userData?.AuthLogin;
//       if (!emailId) {
//         toast.error("Email not found");
//         return;
//       }

//       const response = await dispatch(sendOtpFundRequest({ emailId })).unwrap();

//       if (response?.statusCode === 200) {
//         setIsPasswordOtpSent(true);
//         setIsPasswordOtpVerified(false);
//         toast.success("OTP sent to your email");
//       } else {
//         toast.error(response?.message || "Failed to send OTP");
//       }
//     } catch (error) {
//       toast.error(error?.message || "Failed to send OTP");
//     } finally {
//       setIsPasswordOtpLoading(false);
//     }
//   };

 

//   const saveChanges = async () => {
//     const walletChanged = originalWallet !== walletAddress;

//     // Validate wallet if changed
//     if (walletChanged) {
//       if (walletAddress !== "" && !isValidBep20Length(walletAddress)) {
//         toast.error("Please Enter a Valid BEP20 USDT Wallet Address");
//         return;
//       }

//       if (walletAddress !== "" && !isOtpSent) {
//         toast.error("Please verify your wallet address with OTP first");
//         return;
//       }

//       if (isOtpSent && !otp) {
//         setOtpError("Please enter the OTP");
//         return;
//       }
//     }

//     try {
//       setIsSaveLoading(true);

  
//       if (!userData) return;

//       // Find the selected country object to get its ID
//       const selectedCountry = getAllCountryData?.data?.find(
//         (c) => c.country_Name === parseInt(country)
//       );

//       const payload = {
//         loginID: loginId,
//         fName: fName,
//         lName: lastName,
//         address: address,
//         email: email,
//         mobile: phone,
//         countryid: parseInt(country) || null,
//         walletBep20: walletAddress,
//         updateprofileotp: otp
//       };

//       // Call update profile API
//       const response = await fetch(
//         `${BASE_URL}/Authentication/updateUserProfile`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const result = await response.json();

//       if (result.statusCode !== 200) {
//         throw new Error(result.message || 'Failed to update profile');
//       }

//       // Update localStorage after successful API response
//       const storedData = JSON.parse(
//         localStorage.getItem('currentUserPlain') || '{}'
//       );

//       localStorage.setItem(
//         'currentUserPlain',
//         JSON.stringify(storedData)
//       );

//       setOriginalWallet(walletAddress);

//       // Set wallet as set if it's valid
//       if (walletAddress && isValidBep20Length(walletAddress)) {
//         setIsWalletSet(true);
//       }

//       // Reset OTP state
//       setIsOtpSent(false);
//       setOtp("");

//       toast.success(result.message || 'Profile updated successfully');
//     } catch (error) {
//       console.error('Update Profile Error:', error);
//       toast.error(error.message || 'Something went wrong');
//     } finally {
//       setIsSaveLoading(false);
//     }
//   };

//   // Handle wallet address change
//   const handleWalletChange = (e) => {
//     const newValue = e.target.value;
//     setWalletAddress(newValue);

//     // Reset OTP state when wallet changes
//     if (originalWallet !== newValue) {
//       setIsOtpSent(false);
//       setOtp("");
//       setOtpError("");
//     }
//   };

//   // Check if wallet has been changed
//   const walletChanged = originalWallet !== walletAddress;

//   // Determine if save button should be disabled
//   const isSaveButtonDisabled = walletChanged
//     ? !isValidBep20Length(walletAddress) ||
//     (walletAddress !== "" && !isOtpSent)
//     : false;

//   const shouldShowOtpButton = walletChanged && walletAddress && !isOtpSent;

//   // Check if all password fields are filled
//   const arePasswordFieldsFilled = () => {
//     const { oldPassword, newPassword, confirmPassword } = passwordFormik.values;
//     return oldPassword && newPassword && confirmPassword;
//   };

//   return (
//     <>
//       <div id="p-profile" className="page">
//         <div className="g21">
//           <div>
//             <div className="scard scc" style={{ marginBottom: "12px" }}>
//               <div className='profile-flexing-heading'>
//                 <div className="pf-av">{fName?.charAt(0).toUpperCase() || 'A'}</div>
//                 <div style={{ width: "100%" }}>
//                   <div style={{ fontSize: "18px", fontWeight: 900, letterSpacing: "-.3px", marginBottom: "3px" }}>
//                     {fName || 'User'}
//                   </div>
//                   <div style={{ fontSize: "11.5px", color: "var(--t2)", marginBottom: "8px" }}>
//                     {email} · {formatWalletAddress(userData?.WalletBep20)}
//                   </div>
//                   <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
//                     <span className="tag tp">{userData?.Role === 'User' ? 'PRO' : userData?.Role}</span>
//                     <span className="tag tg">{userData?.Email ? 'Verified' : 'Pending'}</span>
//                     <span className="tag ta">Gold</span>
//                   </div>
//                 </div>

//                 <div className="flexing-tab-btn">
//                   <button
//                     onClick={() => setActiveTab("profile")}
//                     className="tag tg"
//                     style={{
//                       background: activeTab === "profile" ? "#672ACA" : "transparent",
//                       color: activeTab === "profile" ? "#fff" : "var(--t2)",
//                       cursor: "pointer",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "6px",
//                     }}
//                   >
//                     <FiUser size={16} />
//                     Profile Settings
//                   </button>

//                   <button
//                     onClick={() => setActiveTab("password")}
//                     className="tag tg"
//                     style={{
//                       background: activeTab === "password" ? "#672ACA" : "transparent",
//                       color: activeTab === "password" ? "#fff" : "var(--t2)",
//                       cursor: "pointer",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "6px",
//                     }}
//                   >
//                     <FiLock size={16} />
//                     Reset Password
//                   </button>
//                 </div>
//               </div>
//               <hr />

//               {/* Profile Form Fields - Only show when activeTab is 'profile' */}
//               {activeTab === 'profile' && (
//                 <>
//                   <div className="g2" style={{ gap: "10px", marginBottom: "12px", width: "100%" }}>

//                     <div className="fg" style={{ margin: 0 }}>
//                       <label className="fl">First Name</label>
//                       <input
//                         className="fi"
//                         type="text"
//                         value={fName}
//                         readOnly={kid === 1}
//                         style={{
//                           cursor: kid === 1 ? 'not-allowed' : 'text',
//                           backgroundColor: kid === 1 ? '#f5f5f5' : '#fff',
//                         }}
//                         onChange={(e) => setfName(e.target.value)}
//                         placeholder="First name"
//                       />
//                     </div>



//                     <div className="fg" style={{ margin: 0 }}>
//                       <label className="fl">Last Name</label>
//                       <input
//                         className="fi"
//                         type="text"
//                         value={lastName}
//                         readOnly={kid === 1}
//                         style={{
//                           cursor: kid === 1 ? 'not-allowed' : 'text',
//                           backgroundColor: kid === 1 ? '#f5f5f5' : '#fff',
//                         }}
//                         onChange={(e) => setlastName(e.target.value)}
//                         placeholder="Last name"
//                       />
//                     </div>

//                     <div className="fg" style={{ margin: 0 }}>
//                       <label className="fl">Phone</label>
//                       <input
//                         className="fi"
//                         type="tel"
//                         placeholder="+1 555 0000"
//                         value={phone}
//                         onChange={(e) => setPhone(e.target.value)}
//                       />
//                     </div>
//                     <div className="fg" style={{ margin: 0 }}>
//                       <label className="fl">Country</label>
//                       <select
//                         className="fi"
//                         value={country}
//                         onChange={(e) => setCountry(e.target.value)}
//                       >
//                         <option value="">Select Country</option>
//                         {getAllCountryData?.data?.map((item) => (
//                           <option key={item.country_Id} value={item.country_Id}>
//                             {item.country_Name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                   <div className="fg" style={{ margin: 0 }}>
//                     <label className="fl">Email</label>
//                     <input
//                       className="fi"
//                       type="email"
//                       value={email}
//                       readOnly={kid === 1}
//                       style={{
//                         cursor: kid === 1 ? 'not-allowed' : 'text',
//                         backgroundColor: kid === 1 ? '#f5f5f5' : '#fff',
//                       }}
//                       onChange={(e) => setEmail(e.target.value)}
//                     />
//                   </div>
//                   <div className="fg" style={{ margin: 0 }}>
//                     <label className="fl mt-2">Address</label>
//                     <input
//                       className="fi"
//                       type="text"
//                       value={address}
//                       onChange={(e) => setAddress(e.target.value)}
//                     />
//                   </div>

//                   {/* Wallet Address Section with OTP */}
//                   <div className="fg mb-4 mt-2" style={{ margin: 0 }}>
//                     <label className="fl">
//                       Wallet Address
//                       {isWalletSet && !walletChanged && (
//                         <span style={{ marginLeft: "8px", fontSize: "12px", color: "#10b981" }}>
//                           ✓ Wallet is set
//                         </span>
//                       )}
//                     </label>
//                     <div style={{ display: "flex", gap: "8px" }}>
//                       <input
//                         className="fi"
//                         type="text"
//                         placeholder="BEP20 USDT Wallet Address"
//                         value={walletAddress}
//                         onChange={handleWalletChange}
//                         disabled={isWalletSet && !walletChanged}
//                         style={{
//                           flex: 1,
//                           ...(isWalletSet && !walletChanged ? { backgroundColor: "#f5f5f5" } : {})
//                         }}
//                       />
//                       {shouldShowOtpButton && (
//                         <button
//                           type="button"
//                           onClick={handleSendOtp}
//                           disabled={
//                             !walletAddress ||
//                             !isValidBep20Length(walletAddress) ||
//                             isOtpLoading
//                           }
//                           className="btn btn-p"
//                           style={{
//                             padding: "8px 16px",
//                             whiteSpace: "nowrap",
//                             opacity:
//                               !walletAddress ||
//                                 !isValidBep20Length(walletAddress) ||
//                                 isOtpLoading
//                                 ? 0.6
//                                 : 1,
//                             cursor:
//                               !walletAddress ||
//                                 !isValidBep20Length(walletAddress) ||
//                                 isOtpLoading
//                                 ? "not-allowed"
//                                 : "pointer",
//                           }}
//                         >
//                           {isOtpLoading ? "Sending..." : "Send OTP"}
//                         </button>
//                       )}
//                     </div>
//                     {walletAddress && !isValidBep20Length(walletAddress) && (
//                       <p style={{ marginTop: "4px", fontSize: "12px", color: "#ef4444" }}>
//                         Please enter a valid BEP20 USDT wallet address (38-44 characters)
//                       </p>
//                     )}
//                   </div>

//                   {/* OTP Input Field */}
//                   {isOtpSent && walletChanged && (
//                     <div className="fg" style={{ margin: "0 0 12px 0" }}>
//                       <label className="fl">Enter OTP (Sent to Email)</label>
//                       <input
//                         className="fi"
//                         type="text"
//                         placeholder="Enter 6-digit OTP"
//                         value={otp}
//                         onChange={(e) => {
//                           const value = e.target.value.replace(/\D/g, "").slice(0, 6);
//                           setOtp(value);
//                           setOtpError("");
//                         }}
//                       />
//                       {otpError && (
//                         <p style={{ marginTop: "4px", fontSize: "12px", color: "#ef4444" }}>
//                           {otpError}
//                         </p>
//                       )}
//                     </div>
//                   )}

//                   <button
//                     className="btn btn-p"
//                     style={{ padding: "9px 24px" }}
//                     onClick={saveChanges}
//                     disabled={isSaveButtonDisabled || isSaveLoading}
//                   >
//                     {isSaveLoading ? "Saving..." : "Save Changes"}
//                   </button>
//                 </>
//               )}

//               {/* Reset Password Form - Only show when activeTab is 'password' */}
//               {activeTab === 'password' && (
//                 <>
//                   <div style={{ marginBottom: "20px", marginTop: "10px" }}>
//                     <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "4px" }}>Change Password</h3>
//                     <p style={{ fontSize: "13px", color: "var(--t2)" }}>Update your password to keep your account secure</p>
//                   </div>

//                   <form
//                     onSubmit={passwordFormik.handleSubmit}
//                     style={{ padding: "4px 0", display: "flex", flexDirection: "column", gap: "16px" }}
//                   >
//                     {/* Current Password */}
//                     <div>
//                       <label htmlFor="oldPassword" style={labelStyle}>Current Password</label>
//                       <input
//                         type="password"
//                         id="oldPassword"
//                         name="oldPassword"
//                         style={inputStyle}
//                         placeholder="Enter current password"
//                         onChange={passwordFormik.handleChange}
//                         onBlur={passwordFormik.handleBlur}
//                         value={passwordFormik.values.oldPassword}
//                         onFocus={e => e.target.style.borderColor = "#10b981"}
//                         onBlurCapture={e => e.target.style.borderColor = "var(--vi-border, #374151)"}
//                       />
//                       {passwordFormik.touched.oldPassword && passwordFormik.errors.oldPassword && (
//                         <p style={{ marginTop: "4px", fontSize: "11px", color: "#ef4444" }}>
//                           {passwordFormik.errors.oldPassword}
//                         </p>
//                       )}
//                     </div>

//                     {/* New + Confirm - side by side */}
//                     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
//                       <div>
//                         <label htmlFor="newPassword" style={labelStyle}>New Password</label>
//                         <input
//                           type="password"
//                           id="newPassword"
//                           name="newPassword"
//                           style={inputStyle}
//                           placeholder="Enter new password"
//                           onChange={passwordFormik.handleChange}
//                           onBlur={passwordFormik.handleBlur}
//                           value={passwordFormik.values.newPassword}
//                           onFocus={e => e.target.style.borderColor = "#10b981"}
//                           onBlurCapture={e => e.target.style.borderColor = "var(--vi-border, #374151)"}
//                         />
//                         {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword && (
//                           <p style={{ marginTop: "4px", fontSize: "11px", color: "#ef4444" }}>
//                             {passwordFormik.errors.newPassword}
//                           </p>
//                         )}
//                       </div>

//                       <div>
//                         <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password</label>
//                         <input
//                           type="password"
//                           id="confirmPassword"
//                           name="confirmPassword"
//                           style={inputStyle}
//                           placeholder="Confirm new password"
//                           onChange={passwordFormik.handleChange}
//                           onBlur={passwordFormik.handleBlur}
//                           value={passwordFormik.values.confirmPassword}
//                           onFocus={e => e.target.style.borderColor = "#10b981"}
//                           onBlurCapture={e => e.target.style.borderColor = "var(--vi-border, #374151)"}
//                         />
//                         {passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword && (
//                           <p style={{ marginTop: "4px", fontSize: "11px", color: "#ef4444" }}>
//                             {passwordFormik.errors.confirmPassword}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     {/* OTP Section - Clean Layout */}
//                     <div style={{
//                       display: "flex",
//                       flexDirection: "column",
//                       gap: "10px",
//                       marginTop: "8px",
//                       borderTop: "1px solid #e5e7eb",
//                       paddingTop: "16px"
//                     }}>
//                       {/* Send OTP Button - Only show if OTP not sent */}
                    
//                       {isPasswordOtpSent && !isPasswordOtpVerified && (
//                         <div style={{
//                           background: "#faf9fc",
//                           border: "1px solid #ece9f5",
//                           borderRadius: "10px",
//                           padding: "16px 18px",
//                         }}>
//                           <div style={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             alignItems: "baseline",
//                             marginBottom: "10px",
//                           }}>
//                             <label htmlFor="passwordOtp" style={{ ...labelStyle, marginBottom: 0 }}>
//                               Enter OTP
//                             </label>
//                             <span style={{ fontSize: "11px", color: "var(--t2, #6b7280)" }}>
//                               Sent to your email
//                             </span>
//                           </div>

//                           <div style={{ display: "flex", gap: "10px" }}>
//                             <input
//                               type="text"
//                               id="passwordOtp"
//                               name="passwordOtp"
//                               placeholder="6-digit code"
//                               value={passwordOtp}
//                               onChange={(e) => {
//                                 const value = e.target.value.replace(/\D/g, "").slice(0, 6);
//                                 setPasswordOtp(value);
//                                 setPasswordOtpError("");
//                               }}
//                               style={{
//                                 ...inputStyle,
//                                 flex: 1,
//                                 textAlign: "center",
//                                 letterSpacing: "3px",
//                                 fontWeight: 600,
//                                 border: passwordOtpError ? "1px solid #ef4444" : inputStyle.border,
//                               }}
//                             />
//                             <button
//                               type="button"
//                               disabled={isPasswordOtpLoading || !passwordOtp}
//                               style={{
//                                 padding: "0 22px",
//                                 fontSize: "13px",
//                                 fontWeight: 600,
//                                 color: "#fff",
//                                 background: isPasswordOtpLoading || !passwordOtp ? "#d1d5db" : "#672ACA",
//                                 border: "none",
//                                 borderRadius: "8px",
//                                 cursor: isPasswordOtpLoading || !passwordOtp ? "not-allowed" : "pointer",
//                                 transition: "all 0.2s",
//                                 whiteSpace: "nowrap",
//                               }}
//                             >
//                               {isPasswordOtpLoading ? "Verifying..." : "Verify"}
//                             </button>
//                           </div>

//                           {passwordOtpError && (
//                             <p style={{ fontSize: "12px", color: "#ef4444", margin: "8px 0 0" }}>
//                               {passwordOtpError}
//                             </p>
//                           )}

//                           {/* Resend OTP */}
//                           <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
//                             <button
//                               type="button"
//                               onClick={handleSendPasswordOtp}
//                               disabled={isPasswordOtpLoading}
//                               style={{
//                                 padding: 0,
//                                 fontSize: "12px",
//                                 fontWeight: 500,
//                                 color: "#672ACA",
//                                 background: "transparent",
//                                 border: "none",
//                                 cursor: isPasswordOtpLoading ? "not-allowed" : "pointer",
//                                 textDecoration: "underline",
//                               }}
//                             >
//                               {isPasswordOtpLoading ? "Sending..." : "Resend OTP"}
//                             </button>
//                           </div>
//                         </div>
//                       )}

//                       {/* Change Password Button - Show after OTP verified */}
//                       {/* {isPasswordOtpVerified && ( */}
//                         <button
//                           type="submit"
//                           disabled={isPasswordLoading}
//                           style={{
//                             width: "100%",
//                             padding: "12px 16px",
//                             fontWeight: 600,
//                             fontSize: "15px",
//                             color: "#fff",
//                             background: isPasswordLoading ? "#a78bfa" : "#10b981",
//                             border: "none",
//                             borderRadius: "8px",
//                             cursor: isPasswordLoading ? "not-allowed" : "pointer",
//                             transition: "all 0.2s",
//                             marginTop: "4px",
//                           }}
//                         >
//                           {isPasswordLoading ? 'Updating...' : 'Change Password'}
//                         </button>
//                       {/* )} */}
//                     </div>
//                   </form>

//                   {passwordError && (
//                     <p style={{ fontSize: "12px", color: "#ef4444", textAlign: "center", marginTop: "12px" }}>
//                       {passwordError}
//                     </p>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>

//           <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//             <div className="scard scc">
//               <div className="st" style={{ marginBottom: "10px" }}>Affiliate Code</div>
//               <div className="ref-link" style={{ marginBottom: "8px" }}>{userData?.AuthLogin || 'ARB-a9x7k2'}</div>
//               <button className="btn btn-g2" style={{ width: "100%", padding: "8px", fontSize: "12px" }} onClick={copyAffiliateCode}>
//                 📋 Copy Code
//               </button>
//             </div>

//             <button
//               className="btn btn-danger"
//               style={{ width: "100%", padding: "10px", textDecoration: "none" }}
//               onClick={signOut}
//             >
//               Sign Out
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }




"use client";

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { doUserLogout, getToken, getUserId } from '@/app/api/auth';
import { getAllCountry, getUserDashboardDetails, sendOtpFundRequest, validateOtp, sendOtpRequestwalletaddress, updatePassword, getProfileDetails } from '@/app/redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import * as yup from "yup";
import { useFormik } from "formik";
import { FiUser, FiLock } from "react-icons/fi";
import { BASE_URL } from '@/app/constants/constant';

const isValidBep20Length = (value) => {
  if (!value) return true;
  return value && value.length >= 38 && value.length <= 44;
};

const passwordSchema = yup.object().shape({
  oldPassword: yup.string().required('Current password is required'),
  newPassword: yup.string()
    .required('New password is required')
    .min(4, 'Password must be at least 4 characters')
    .notOneOf([yup.ref('oldPassword')], 'New password must be different from current password'),
  confirmPassword: yup.string()
    .required('Please confirm your password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
});

export default function Profile() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [fName, setfName] = useState('');
  const [lastName, setlastName] = useState("");
  const [email, setEmail] = useState('');
  const [loginId, setLoginId] = useState("");
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');

  const [userData, setUserData] = useState(null);
  const [greetingTime, setGreetingTime] = useState('');
  const [walletAddress, setWalletAddress] = useState("");
  const [originalWallet, setOriginalWallet] = useState("");
  const [address, setAddress] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isWalletSet, setIsWalletSet] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const [isPasswordOtpSent, setIsPasswordOtpSent] = useState(false);
  const [passwordOtp, setPasswordOtp] = useState("");
  const [passwordOtpError, setPasswordOtpError] = useState("");
  const [isPasswordOtpLoading, setIsPasswordOtpLoading] = useState(false);
  const [isPasswordOtpVerified, setIsPasswordOtpVerified] = useState(false);

  const token = getToken();
  const { getAllCountryData, UserdashboardData, profileData } = useSelector((state) => state.auth);

  const AuthEmail = JSON.parse(localStorage.getItem("currentUserPlain"))?.userData?.AuthLogin;
  const passwordFormik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: passwordSchema,
    onSubmit: async (values) => {
      try {
        setIsPasswordLoading(true);
        setPasswordError(null);
        const data = {
          userId: loginId,
          oldPassword: values.oldPassword,
          newPass: values.newPassword
        };
        const result = await dispatch(updatePassword(data)).unwrap();
        if (result.statusCode === 200) {
          toast.success(result.message);
          passwordFormik.resetForm();
          setIsPasswordOtpSent(false);
          setPasswordOtp("");
        } else if (result.statusCode === 409) {
          toast.error(result.message);
        } else if (result.error) {
          throw new Error(result.error.message || 'Password update failed');
        }
      } catch (err) {
        setPasswordError(err.message || 'An error occurred while updating password');
        toast.error(err.message || 'An error occurred while updating password');
      } finally {
        setIsPasswordLoading(false);
      }
    }
  });

  const profileDataLoading = async () => {
    try {
      const result = await dispatch(getProfileDetails()).unwrap();
      if (result) {
        const user = result?.[0] || result.payload;
        setUserData(user);
        setfName(user.FName || "");
        setlastName(user.LName || "");
        setEmail(user.Email || "");
        setPhone(user.Mobile || "");
        setCountry(user.CountryId || "");
        setWalletAddress(user.WalletBep20 || "");
        setOriginalWallet(user.WalletBep20 || "");
        setLoginId(user.AuthLogin || "");
        setAddress(user.Address || "");

        if (user.WalletBep20 && isValidBep20Length(user.WalletBep20)) {
          setIsWalletSet(true);
        }

        const hour = new Date().getHours();
        if (hour < 12) {
          setGreetingTime("Good morning");
        } else if (hour < 18) {
          setGreetingTime("Good afternoon");
        } else {
          setGreetingTime("Good evening");
        }
      }
    } catch (e) {
      console.log("err =>", e);
    }
  };

  useEffect(() => {
    profileDataLoading();
  }, []);

  useEffect(() => {
    dispatch(getAllCountry());
    dispatch(getUserDashboardDetails());
  }, [dispatch]);

  const kid = UserdashboardData?.[0]?.Kid;

  const copyAffiliateCode = () => {
    const code = userData?.AuthLogin || '';
    navigator.clipboard.writeText(code);
    toast.success('Affiliate code copied');
  };

  const revealApiKey = () => {
    const apiKey = userData?.token || 'arb_live_a9x7k2m3n4p5q6r7s8t9';
    toast.success(`API Key: ${apiKey}`);
  };

  const signOut = (e) => {
    e.preventDefault();
    doUserLogout();
    router.push('/user/login');
  };

  const formatWalletAddress = (address) => {
    if (!address) return 'Not connected';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleSendOtp = async () => {
    if (!walletAddress) {
      toast.error("Please enter wallet address first");
      return;
    }
    if (!isValidBep20Length(walletAddress)) {
      toast.error("Wallet address must be 38-44 characters long");
      return;
    }
    try {
      setIsOtpLoading(true);
      const response = await dispatch(sendOtpRequestwalletaddress()).unwrap();
      if (response?.statusCode === 200) {
        setIsOtpSent(true);
        toast.success(response?.data?.message || "OTP sent to your email");
      } else {
        toast.error(response?.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to send OTP");
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleSendPasswordOtp = async () => {
    const { oldPassword, newPassword, confirmPassword } = passwordFormik.values;
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all password fields first");
      return;
    }
    try {
      setIsPasswordOtpLoading(true);
      setPasswordOtpError("");
      const emailId = email || JSON.parse(localStorage.getItem("currentUserPlain"))?.userData?.AuthLogin;
      if (!emailId) {
        toast.error("Email not found");
        return;
      }
      const response = await dispatch(sendOtpFundRequest({ emailId })).unwrap();
      if (response?.statusCode === 200) {
        setIsPasswordOtpSent(true);
        setIsPasswordOtpVerified(false);
        toast.success("OTP sent to your email");
      } else {
        toast.error(response?.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to send OTP");
    } finally {
      setIsPasswordOtpLoading(false);
    }
  };

  const saveChanges = async () => {
    const walletChanged = originalWallet !== walletAddress;

    if (walletChanged) {
      if (walletAddress !== "" && !isValidBep20Length(walletAddress)) {
        toast.error("Please Enter a Valid BEP20 USDT Wallet Address");
        return;
      }
      if (walletAddress !== "" && !isOtpSent) {
        toast.error("Please verify your wallet address with OTP first");
        return;
      }
      if (isOtpSent && !otp) {
        setOtpError("Please enter the OTP");
        return;
      }
    }

    try {
      setIsSaveLoading(true);
      if (!userData) return;

      const selectedCountry = getAllCountryData?.data?.find(
        (c) => c.country_Name === parseInt(country)
      );

      const payload = {
        loginID: loginId,
        fName: fName,
        lName: lastName,
        address: address,
        email: email,
        mobile: phone,
        countryid: parseInt(country) || null,
        walletBep20: walletAddress,
        updateprofileotp: otp
      };

      const response = await fetch(`${BASE_URL}/Authentication/updateUserProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.statusCode !== 200) {
        throw new Error(result.message || 'Failed to update profile');
      }

      const storedData = JSON.parse(localStorage.getItem('currentUserPlain') || '{}');
      localStorage.setItem('currentUserPlain', JSON.stringify(storedData));

      setOriginalWallet(walletAddress);
      if (walletAddress && isValidBep20Length(walletAddress)) {
        setIsWalletSet(true);
      }

      setIsOtpSent(false);
      setOtp("");

      toast.success(result.message || 'Profile updated successfully');
    } catch (error) {
      console.error('Update Profile Error:', error);
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handleWalletChange = (e) => {
    const newValue = e.target.value;
    setWalletAddress(newValue);
    if (originalWallet !== newValue) {
      setIsOtpSent(false);
      setOtp("");
      setOtpError("");
    }
  };

  const walletChanged = originalWallet !== walletAddress;
  const isSaveButtonDisabled = walletChanged
    ? !isValidBep20Length(walletAddress) || (walletAddress !== "" && !isOtpSent)
    : false;

  const shouldShowOtpButton = walletChanged && walletAddress && !isOtpSent;

  return (
    <div className="page max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        {/* Left Column - Profile Card */}
        <div>
          <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl p-5 shadow-sm mb-3">
            {/* Profile Header */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 dark:from-teal-600 dark:to-cyan-400 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                {fName?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-[180px]">
                <div className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-[#eaf5f7]">
                  {fName || 'User'}
                </div>
                <div className="text-[11.5px] text-gray-500 dark:text-[#9db4be] mb-2">
                  {email} · {formatWalletAddress(userData?.WalletBep20)}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400">
                    {userData?.Role === 'User' ? 'PRO' : userData?.Role}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                    {userData?.Email ? 'Verified' : 'Pending'}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                    Gold
                  </span>
                </div>
              </div>

              {/* Tab Buttons */}
              <div className="flex flex-wrap gap-2 ml-auto">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                    activeTab === "profile"
                      ? "bg-teal-400 dark:bg-teal-500 text-gray-50"
                      : "bg-transparent text-gray-500 dark:text-[#9db4be] hover:bg-gray-100 dark:hover:bg-[rgba(255,255,255,0.05)]"
                  }`}
                >
                  <FiUser size={14} />
                  Profile Settings
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                    activeTab === "password"
                      ? "bg-teal-400 dark:bg-teal-500 text-gray-50"
                      : "bg-transparent text-gray-500 dark:text-[#9db4be] hover:bg-gray-100 dark:hover:bg-[rgba(255,255,255,0.05)]"
                  }`}
                >
                  <FiLock size={14} />
                  Reset Password
                </button>
              </div>
            </div>

            <hr className="border-gray-200 dark:border-[rgba(140,200,205,0.1)] my-4" />

            {/* Profile Form */}
            {activeTab === 'profile' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.04em] mb-1.5 block">First Name</label>
                    <input
                      className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-[#142936] border border-gray-300 dark:border-[rgba(140,200,205,0.16)] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-all"
                      type="text"
                      value={fName}
                      readOnly={kid === 1}
                      style={{ cursor: kid === 1 ? 'not-allowed' : 'text' }}
                      onChange={(e) => setfName(e.target.value)}
                      placeholder="First name"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.04em] mb-1.5 block">Last Name</label>
                    <input
                      className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-[#142936] border border-gray-300 dark:border-[rgba(140,200,205,0.16)] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-all"
                      type="text"
                      value={lastName}
                      readOnly={kid === 1}
                      style={{ cursor: kid === 1 ? 'not-allowed' : 'text' }}
                      onChange={(e) => setlastName(e.target.value)}
                      placeholder="Last name"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.04em] mb-1.5 block">Phone</label>
                    <input
                      className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-[#142936] border border-gray-300 dark:border-[rgba(140,200,205,0.16)] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-all"
                      type="tel"
                      placeholder="+1 555 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.04em] mb-1.5 block">Country</label>
                    <select
                      className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-[#142936] border border-gray-300 dark:border-[rgba(140,200,205,0.16)] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-all"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    >
                      <option value="">Select Country</option>
                      {getAllCountryData?.data?.map((item) => (
                        <option key={item.country_Id} value={item.country_Id}>
                          {item.country_Name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.04em] mb-1.5 block">Email</label>
                  <input
                    className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-[#142936] border border-gray-300 dark:border-[rgba(140,200,205,0.16)] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-all"
                    type="email"
                    value={email}
                    readOnly={kid === 1}
                    style={{ cursor: kid === 1 ? 'not-allowed' : 'text' }}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.04em] mb-1.5 block">Address</label>
                  <input
                    className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-[#142936] border border-gray-300 dark:border-[rgba(140,200,205,0.16)] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-all"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                {/* Wallet Address Section */}
                <div className="mb-3">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.04em] mb-1.5 block">
                    Wallet Address
                    {isWalletSet && !walletChanged && (
                      <span className="ml-2 text-xs text-green-600 dark:text-green-400">✓ Wallet is set</span>
                    )}
                  </label>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 px-3 py-2.5 rounded-lg bg-white dark:bg-[#142936] border border-gray-300 dark:border-[rgba(140,200,205,0.16)] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-all"
                      type="text"
                      placeholder="BEP20 USDT Wallet Address"
                      value={walletAddress}
                      onChange={handleWalletChange}
                      disabled={isWalletSet && !walletChanged}
                      style={isWalletSet && !walletChanged ? { backgroundColor: '#f5f5f5' } : {}}
                    />
                    {shouldShowOtpButton && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={!walletAddress || !isValidBep20Length(walletAddress) || isOtpLoading}
                        className={`px-4 py-2.5 rounded-lg text-white font-semibold text-sm whitespace-nowrap transition-all ${
                          !walletAddress || !isValidBep20Length(walletAddress) || isOtpLoading
                            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-60'
                            : 'bg-teal-600 hover:bg-teal-700'
                        }`}
                      >
                        {isOtpLoading ? "Sending..." : "Send OTP"}
                      </button>
                    )}
                  </div>
                  {walletAddress && !isValidBep20Length(walletAddress) && (
                    <p className="mt-1 text-xs text-red-500">Please enter a valid BEP20 USDT wallet address (38-44 characters)</p>
                  )}
                </div>

                {/* OTP Input */}
                {isOtpSent && walletChanged && (
                  <div className="mb-3">
                    <label className="text-[11px] font-bold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.04em] mb-1.5 block">Enter OTP (Sent to Email)</label>
                    <input
                      className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-[#142936] border border-gray-300 dark:border-[rgba(140,200,205,0.16)] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-all"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setOtp(value);
                        setOtpError("");
                      }}
                    />
                    {otpError && <p className="mt-1 text-xs text-red-500">{otpError}</p>}
                  </div>
                )}

                <button
                  className="px-6 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={saveChanges}
                  disabled={isSaveButtonDisabled || isSaveLoading}
                >
                  {isSaveLoading ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}

            {/* Reset Password Form */}
            {activeTab === 'password' && (
              <>
                <div className="mb-4 mt-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-[#eaf5f7] mb-1">Change Password</h3>
                  <p className="text-sm text-gray-500 dark:text-[#9db4be]">Update your password to keep your account secure</p>
                </div>

                <form onSubmit={passwordFormik.handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="oldPassword" className="text-[11px] font-bold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.04em] mb-1.5 block">Current Password</label>
                    <input
                      type="password"
                      id="oldPassword"
                      name="oldPassword"
                      className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-[#142936] border border-gray-300 dark:border-[rgba(140,200,205,0.16)] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-all"
                      placeholder="Enter current password"
                      onChange={passwordFormik.handleChange}
                      onBlur={passwordFormik.handleBlur}
                      value={passwordFormik.values.oldPassword}
                    />
                    {passwordFormik.touched.oldPassword && passwordFormik.errors.oldPassword && (
                      <p className="mt-1 text-xs text-red-500">{passwordFormik.errors.oldPassword}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="newPassword" className="text-[11px] font-bold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.04em] mb-1.5 block">New Password</label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-[#142936] border border-gray-300 dark:border-[rgba(140,200,205,0.16)] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-all"
                        placeholder="Enter new password"
                        onChange={passwordFormik.handleChange}
                        onBlur={passwordFormik.handleBlur}
                        value={passwordFormik.values.newPassword}
                      />
                      {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword && (
                        <p className="mt-1 text-xs text-red-500">{passwordFormik.errors.newPassword}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="text-[11px] font-bold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.04em] mb-1.5 block">Confirm Password</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-[#142936] border border-gray-300 dark:border-[rgba(140,200,205,0.16)] text-gray-900 dark:text-[#eaf5f7] text-sm outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-all"
                        placeholder="Confirm new password"
                        onChange={passwordFormik.handleChange}
                        onBlur={passwordFormik.handleBlur}
                        value={passwordFormik.values.confirmPassword}
                      />
                      {passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-500">{passwordFormik.errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  {/* OTP Section */}
                  <div className="border-t border-gray-200 dark:border-[rgba(140,200,205,0.1)] pt-4 mt-2">
                    {isPasswordOtpSent && !isPasswordOtpVerified && (
                      <div className="bg-gray-50 dark:bg-[#142936] border border-gray-200 dark:border-[rgba(140,200,205,0.1)] rounded-xl p-4 mb-3">
                        <div className="flex justify-between items-baseline mb-2.5">
                          <label htmlFor="passwordOtp" className="text-[11px] font-bold text-gray-500 dark:text-[#9db4be] uppercase tracking-[0.04em] block">Enter OTP</label>
                          <span className="text-[11px] text-gray-500 dark:text-[#9db4be]">Sent to your email</span>
                        </div>
                        <div className="flex gap-2.5">
                          <input
                            type="text"
                            id="passwordOtp"
                            name="passwordOtp"
                            placeholder="6-digit code"
                            value={passwordOtp}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                              setPasswordOtp(value);
                              setPasswordOtpError("");
                            }}
                            className={`flex-1 px-3 py-2.5 rounded-lg bg-white dark:bg-[#10222e] border ${passwordOtpError ? 'border-red-500' : 'border-gray-300 dark:border-[rgba(140,200,205,0.16)]'} text-gray-900 dark:text-[#eaf5f7] text-sm text-center tracking-[3px] font-semibold outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-all`}
                          />
                          <button
                            type="button"
                            disabled={isPasswordOtpLoading || !passwordOtp}
                            className={`px-5 py-2.5 rounded-lg text-white font-semibold text-sm transition-all whitespace-nowrap ${
                              isPasswordOtpLoading || !passwordOtp
                                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                                : 'bg-teal-600 hover:bg-teal-700'
                            }`}
                          >
                            {isPasswordOtpLoading ? "Verifying..." : "Verify"}
                          </button>
                        </div>
                        {passwordOtpError && (
                          <p className="mt-2 text-xs text-red-500">{passwordOtpError}</p>
                        )}
                        <div className="flex justify-end mt-3">
                          <button
                            type="button"
                            onClick={handleSendPasswordOtp}
                            disabled={isPasswordOtpLoading}
                            className="text-xs font-medium text-teal-600 dark:text-teal-400 bg-transparent border-none cursor-pointer hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isPasswordOtpLoading ? "Sending..." : "Resend OTP"}
                          </button>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isPasswordLoading}
                      className={`w-full px-4 py-3 rounded-lg text-white font-semibold text-sm transition-all ${
                        isPasswordLoading ? 'bg-teal-400 dark:bg-teal-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {isPasswordLoading ? 'Updating...' : 'Change Password'}
                    </button>
                  </div>
                </form>

                {passwordError && (
                  <p className="mt-3 text-xs text-red-500 text-center">{passwordError}</p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Column - Affiliate Code & Sign Out */}
        <div className="flex flex-col gap-3">
          <div className="bg-white dark:bg-[#10222e] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-2xl p-5 shadow-sm">
            <div className="text-sm font-bold text-gray-900 dark:text-[#eaf5f7] mb-2.5">Affiliate Code</div>
            <div className="font-mono text-xs bg-gray-100 dark:bg-[#142936] border border-gray-200 dark:border-[rgba(140,200,205,0.16)] rounded-xl px-3 py-2.5 text-gray-800 dark:text-[#eaf5f7] break-all mb-2">
              {userData?.AuthLogin || 'ARB-a9x7k2'}
            </div>
            <button
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-[rgba(140,200,205,0.16)] bg-white dark:bg-[#142936] text-gray-700 dark:text-[#eaf5f7] text-xs font-semibold hover:bg-gray-50 dark:hover:bg-[rgba(255,255,255,0.05)] transition-all"
              onClick={copyAffiliateCode}
            >
              📋 Copy Code
            </button>
          </div>

          <button
            className="w-full px-4 py-2.5 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 transition-all"
            onClick={signOut}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}