// "use client"

// import React, { useEffect, useRef, useState } from "react"
// import { useTheme } from "next-themes"
// import {
//   Layers, Shield, Trophy, Rocket, Repeat, TrendingUp, UserPlus, Check, Crown, Gem, Moon, Sun, ArrowUpRight,
// } from "lucide-react"
// import { Line } from "react-chartjs-2"
// import {
//   Chart as ChartJS,
//   CategoryScale, LinearScale, PointElement, LineElement,
//   Title, Tooltip, Legend, Filler,
// } from "chart.js"
// import { getUserDashboardDetails } from "../../redux/slices/authSlice";
// import { getallusernotification } from "../../redux/slices/ticketSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { getUserId } from "@/app/api/auth";
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

// const C = {
//   navy900: "#0a1e45",
//   navy800: "#0e2a5c",
//   navy700: "#123468",
//   gold400: "#e0ac2e",
//   gold500: "#c98f1f",
//   blue500: "#2f6bff",
//   blue400: "#5b8bff",
//   ink: "#0c1c3d",
//   mute: "#4c5b7c",
//   line: "rgba(15,45,100,.13)",
//   green: "#2fbf7a",
//   red: "#ff6b7d",
// }

// /* Reusable Tailwind class strings */
// const CARD_CLS = "dashboard-card bg-gradient-to-br from-white/95 to-[#e8f0fb]/[.88] border border-[rgba(15,45,100,.13)] rounded-[22px] shadow-[0_1px_2px_rgba(15,45,100,.04),0_20px_40px_-28px_rgba(15,45,100,.25)]"
// const TAG_CLS = "dashboard-tag text-[10.5px] tracking-[.06em] text-[#e0ac2e] font-semibold bg-[rgba(212,166,58,.1)] border border-[rgba(212,166,58,.25)] rounded-full px-3 py-[5px]"
// const DISPLAY_FONT = "'Space Grotesk', sans-serif"

// const INITIAL_TICKER = [
//   { pair: "EUR/USD", price: "1.0842", chg: "+0.18%", up: true, numericPrice: 1.0842 },
//   { pair: "GBP/USD", price: "1.2634", chg: "-0.09%", up: false, numericPrice: 1.2634 },
//   { pair: "USD/JPY", price: "151.28", chg: "+0.24%", up: true, numericPrice: 151.28 },
//   { pair: "GOLD", price: "4,292.47", chg: "+0.62%", up: true, numericPrice: 4292.47 },
//   { pair: "ETH/USDT", price: "3,456.78", chg: "+2.34%", up: true, numericPrice: 3456.78 },
// ]

// const RANKS = [
//   { n: "Associate", id: 3, db: "—", mb: 5000, reward: 200, opt: "LDP" },
//   { n: "Specialist", id: "—", db: "—", mb: 10000, reward: 400, opt: "Domestic Tour" },
//   { n: "Strategist", id: "—", db: 1500, mb: 15000, reward: 700, opt: "Int'l Tour — Thailand" },
//   { n: "Vanguard", id: 6, db: 2000, mb: 20000, reward: 1000, opt: "Int'l Tour — Dubai" },
//   { n: "Professional", id: "—", db: 3000, mb: 50000, reward: 2500, opt: "Car" },
//   { n: "Executive", id: "—", db: 4000, mb: 100000, reward: 6000, opt: "Luxury Car" },
//   { n: "Expert", id: 9, db: 5000, mb: 200000, reward: 15000, opt: "Dream House" },
//   { n: "Master", id: "—", db: 5000, mb: 1000000, reward: 50000, opt: "Luxury Lifestyle" },
//   { n: "Elite", id: 12, db: 10000, mb: 2000000, reward: 100000, opt: "World Tour" },
//   { n: "Titan", id: "—", db: 10000, mb: 10000000, reward: 500000, opt: "Retirement Benefit" },
// ]
// const CURRENT_RANK_INDEX = 2

// const BOOSTERS = [
//   { n: "Booster 1", tag: "3 Directs · Week 1", reward: "5%", state: "done", progress: 100 },
//   { n: "Booster 2", tag: "Next 3 Directs · Week 2", reward: "+4%", state: "active", progress: 66 },
//   { n: "Booster 3", tag: "Next 3 Directs · Week 3", reward: "+3%", state: "locked", progress: 0 },
//   { n: "Booster 4", tag: "Next 3 Directs · Week 4", reward: "+2%", state: "locked", progress: 0 },
// ]
// const BOOSTER_COLOR = { done: C.green, active: C.gold400, locked: "#c7d1e6" }
// const BOOSTER_TEXT = { done: "Qualified", active: "In progress", locked: "Locked" }


//  const CircularGauge = ({ percent = 0, size = 120, stroke = 9, colorFrom = "#0ea5e9", colorTo = "#14b8a6", gradId, centerTop, centerBottom, track = true }) => {
//     const r = (size - stroke) / 2;
//     const c = 2 * Math.PI * r;
//     const off = c - (c * Math.min(100, Math.max(0, percent))) / 100;
//     const cx = size / 2, cy = size / 2;
//     return (
//       <div className="dx-gauge-wrap" style={{ width: size, height: size }}>
//         <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
//           <defs>
//             <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
//               <stop offset="0%" stopColor={colorFrom} />
//               <stop offset="100%" stopColor={colorTo} />
//             </linearGradient>
//           </defs>
//           {track && <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--dashboardroot-track)" strokeWidth={stroke} />}
//           <circle
//             cx={cx} cy={cy} r={r} fill="none"
//             stroke={`url(#${gradId})`} strokeWidth={stroke} strokeLinecap="round"
//             strokeDasharray={c} strokeDashoffset={off}
//             transform={`rotate(-90 ${cx} ${cy})`}
//           />
//         </svg>
//         <div className="dx-gauge-center">
//           <div className="dx-gauge-top">{centerTop}</div>
//           {centerBottom && <div className="dx-gauge-bottom">{centerBottom}</div>}
//         </div>
//       </div>
//     );
//   };

// const INCOME_STREAMS = [
//   { name: "Referral Income", icon: UserPlus, value: 1250, chg: "+12.5%", up: true, total: 8420, today: 42.5 },
//   { name: "Trading Profit Income", icon: TrendingUp, value: 986.4, chg: "+6.1%", up: true, total: 5310, today: 31.2 },
//   { name: "Booster Income", icon: Rocket, value: 412, chg: "+2.4%", up: true, total: 1980, today: 14.0 },
//   { name: "Level Income", icon: Layers, value: 634.8, chg: "-1.2%", up: false, total: 3120, today: 18.6 },
//   { name: "Growth Reward Income", icon: Trophy, value: 700, chg: "+100%", up: true, total: 1600, today: 0 },
//   { name: "Club Income", icon: Shield, value: 225, chg: "+3%", up: true, total: 900, today: 7.5 },
// ]

// const fmt = (n) => "$" + n.toLocaleString()
// const rand = (a, b) => Math.floor(a + Math.random() * (b - a))
// const rankSize = (mb) => (mb >= 1000000 ? `$${mb / 1000000}M` : `$${mb / 1000}K`)

// /* ============================================================
//    Live Chart
// ============================================================ */
// function LiveChart() {
//   const [chartData, setChartData] = useState({
//     labels: [],
//     datasets: [{
//       label: 'BTC/USDT',
//       data: [],
//       borderColor: '#4ade9a',
//       backgroundColor: 'rgba(74, 222, 154, 0.1)',
//       borderWidth: 2, fill: true, tension: 0.4,
//       pointRadius: 0, pointHoverRadius: 4,
//     }],
//   })
//   const [currentPrice, setCurrentPrice] = useState(0)
//   const [priceChange, setPriceChange] = useState({ value: 0, percentage: 0 })
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     const fetchLivePrice = async () => {
//       try {
//         const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
//         const data = await response.json()
//         const price = parseFloat(data.price)
//         setChartData(prev => {
//           const newLabels = [...prev.labels]
//           const newData = [...prev.datasets[0].data]
//           const newTime = new Date()
//           newLabels.push(newTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
//           if (newLabels.length > 31) newLabels.shift()
//           newData.push(price)
//           if (newData.length > 31) newData.shift()
//           setCurrentPrice(price)
//           if (newData.length > 1) {
//             const firstPrice = newData[0]
//             const change = price - firstPrice
//             const percentage = (change / firstPrice) * 100
//             setPriceChange({ value: change, percentage })
//             return {
//               ...prev, labels: newLabels,
//               datasets: [{
//                 ...prev.datasets[0], data: newData,
//                 borderColor: change >= 0 ? '#4ade9a' : '#ff6b7d',
//                 backgroundColor: change >= 0 ? 'rgba(74, 222, 154, 0.1)' : 'rgba(255, 107, 125, 0.1)',
//               }],
//             }
//           }
//           return { ...prev, labels: newLabels, datasets: [{ ...prev.datasets[0], data: newData }] }
//         })
//         setIsLoading(false)
//       } catch (error) {
//         console.error('Error fetching live price:', error)
//       }
//     }
//     fetchLivePrice()
//     const interval = setInterval(fetchLivePrice, 3000)
//     return () => clearInterval(interval)
//   }, [])

//   const options = {
//     responsive: true, maintainAspectRatio: false,
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         mode: 'index', intersect: false,
//         backgroundColor: 'rgba(6, 11, 22, 0.9)',
//         titleColor: '#8ea0c6', bodyColor: '#eef3fb',
//         borderColor: 'rgba(91, 139, 255, 0.3)', borderWidth: 1,
//         padding: 12, displayColors: false,
//         callbacks: { label: (ctx) => `$${ctx.parsed.y?.toFixed(2) || '0.00'}` },
//       },
//     },
//     scales: {
//       x: {
//         display: true, grid: { display: false },
//         ticks: { color: '#ffffff', font: { size: 9 }, maxTicksLimit: 6 },
//       },
//       y: {
//         display: true, grid: { color: 'rgba(15, 45, 100, 0.1)' },
//         ticks: {
//           color: '#ffffff', font: { size: 9 },
//           callback: (v) => '$' + (v?.toFixed(0) || '0'),
//         },
//       },
//     },
//     interaction: { mode: 'nearest', axis: 'x', intersect: false },
//   }

//   return (
//     <div className="h-full">
//       <div className="flex justify-between items-center mb-2">
//         <div>
//           <div className="text-[18px] font-semibold text-white" style={{ fontFamily: DISPLAY_FONT }}>
//             {isLoading ? 'Loading...' : `$${currentPrice.toFixed(2)}`}
//           </div>
//           <div className={`text-[11px] ${priceChange.value >= 0 ? 'text-[#4ade9a]' : 'text-[#ff6b7d]'}`}>
//             {!isLoading && (
//               <>
//                 {priceChange.value >= 0 ? '+' : ''}{priceChange.value.toFixed(2)} ({priceChange.percentage >= 0 ? '+' : ''}{priceChange.percentage.toFixed(2)}%)
//               </>
//             )}
//           </div>
//         </div>
//         <div className="text-[10px] text-white">BTC/USDT</div>
//       </div>
//       <div className="h-[140px]">
//         <Line data={chartData} options={options} />
//       </div>
//     </div>
//   )
// }

// /* ============================================================
//    Sparkline
// ============================================================ */
// function Sparkline({ up }) {
//   const ref = useRef(null)
//   useEffect(() => {
//     const canvas = ref.current
//     if (!canvas) return
//     const w = canvas.clientWidth, h = canvas.clientHeight
//     canvas.width = w; canvas.height = h
//     const ctx = canvas.getContext("2d")
//     let v = h * 0.45
//     const pts = []
//     for (let i = 0; i < 20; i++) {
//       v += (Math.random() - 0.4) * h * 0.2
//       v = Math.max(4, Math.min(h - 4, v))
//       pts.push(v)
//     }
//     ctx.beginPath()
//     pts.forEach((p, i) => {
//       const x = (i / (pts.length - 1)) * w
//       const y = h - p
//       i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
//     })
//     ctx.strokeStyle = up ? C.green : C.red
//     ctx.lineWidth = 2; ctx.lineJoin = "round"; ctx.lineCap = "round"
//     ctx.stroke()
//   }, [up])
//   return <canvas ref={ref} className="w-full block h-7 mt-2" />
// }

// /* ============================================================
//    CountUp
// ============================================================ */
// function CountUp({ value }) {
//   const [display_, setDisplay] = useState(0)
//   useEffect(() => {
//     const start = performance.now()
//     const dur = 1100
//     let raf
//     const step = (now) => {
//       const p = Math.min(1, (now - start) / dur)
//       setDisplay(value * (1 - Math.pow(1 - p, 3)))
//       if (p < 1) raf = requestAnimationFrame(step)
//     }
//     raf = requestAnimationFrame(step)
//     return () => cancelAnimationFrame(raf)
//   }, [value])
//   return <>${display_.toFixed(2)}</>
// }

// /* ============================================================
//    Particle Field
// ============================================================ */
// function ParticleField() {
//   const ref = useRef(null)
//   useEffect(() => {
//     const canvas = ref.current
//     if (!canvas) return
//     const ctx = canvas.getContext("2d")
//     let w, h, particles
//     const size = () => {
//       w = canvas.clientWidth; h = canvas.clientHeight
//       canvas.width = w; canvas.height = h
//     }
//     size()
//     particles = Array.from({ length: 24 }, () => ({
//       x: Math.random() * w, y: Math.random() * h,
//       vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
//       r: Math.random() * 1.8 + 0.5,
//     }))
//     let raf
//     const loop = () => {
//       ctx.clearRect(0, 0, w, h)
//       particles.forEach((p, i) => {
//         p.x += p.vx; p.y += p.vy
//         if (p.x < 0 || p.x > w) p.vx *= -1
//         if (p.y < 0 || p.y > h) p.vy *= -1
//         ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7)
//         ctx.fillStyle = "rgba(232,196,110,0.5)"; ctx.fill()
//         for (let j = i + 1; j < particles.length; j++) {
//           const q = particles[j]
//           const d = Math.hypot(p.x - q.x, p.y - q.y)
//           if (d < 70) {
//             ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y)
//             ctx.strokeStyle = `rgba(91,139,255,${0.12 * (1 - d / 70)})`; ctx.lineWidth = 1; ctx.stroke()
//           }
//         }
//       })
//       raf = requestAnimationFrame(loop)
//     }
//     loop()
//     window.addEventListener("resize", size)
//     return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", size) }
//   }, [])
//   return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none opacity-60" />
// }

// /* ============================================================
//    MAIN DASHBOARD
// ============================================================ */
// export default function JMFinexDashboard() {
//   const { resolvedTheme, setTheme } = useTheme()
//   const [themeReady, setThemeReady] = useState(false)
//   const [clock, setClock] = useState("")
//   const [selectedRank, setSelectedRank] = useState(CURRENT_RANK_INDEX)
//   const [barsOn, setBarsOn] = useState(false)
//   const [heroConf, setHeroConf] = useState(74)
//   const [live, setLive] = useState({ trend: "Bullish" })
//   const [ticker, setTicker] = useState(INITIAL_TICKER)

//   useEffect(() => {
//     setThemeReady(true)
//   }, [])

//   useEffect(() => {
//     const tick = () => setClock(new Date().toLocaleString(undefined, { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" }))
//     tick()
//     const id = setInterval(tick, 30000)
//     return () => clearInterval(id)
//   }, [])

//   useEffect(() => { const t = setTimeout(() => setBarsOn(true), 100); return () => clearTimeout(t) }, [])

//   useEffect(() => {
//     const id = setInterval(() => {
//       const trendUp = Math.random() > 0.35
//       setLive({ trend: trendUp ? "Bullish" : "Bearish" })
//       setHeroConf(rand(65, 88))
//     }, 2600)
//     return () => clearInterval(id)
//   }, [])

//   useEffect(() => {
//     const fetchTickerData = async () => {
//       try {
//         const [ethResponse, btcResponse] = await Promise.all([
//           fetch('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT'),
//           fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'),
//         ])
//         const ethData = await ethResponse.json()
//         const btcData = await btcResponse.json()
//         const ethPrice = parseFloat(ethData.price)
//         const btcPrice = parseFloat(btcData.price)
//         const goldPrice = 4294.51
//         const baseForex = { eurUsd: 1.0842, gbpUsd: 1.2634, usdJpy: 151.28 }
//         const eurUsd = (baseForex.eurUsd + (Math.random() - 0.5) * 0.001).toFixed(4)
//         const gbpUsd = (baseForex.gbpUsd + (Math.random() - 0.5) * 0.001).toFixed(4)
//         const usdJpy = (baseForex.usdJpy + (Math.random() - 0.5) * 0.1).toFixed(2)

//         setTicker(prev => {
//           const newTicker = [
//             { pair: "EUR/USD", price: eurUsd, chg: "0.00%", up: true, numericPrice: parseFloat(eurUsd) },
//             { pair: "GBP/USD", price: gbpUsd, chg: "0.00%", up: true, numericPrice: parseFloat(gbpUsd) },
//             { pair: "USD/JPY", price: parseFloat(usdJpy).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), chg: "0.00%", up: true, numericPrice: parseFloat(usdJpy) },
//             { pair: "GOLD", price: goldPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), chg: "0.00%", up: true, numericPrice: goldPrice },
//             { pair: "ETH/USDT", price: ethPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), chg: "0.00%", up: true, numericPrice: ethPrice },
//           ]
//           if (prev.length > 0) {
//             return newTicker.map((newItem, index) => {
//               const oldItem = prev[index]
//               if (oldItem && oldItem.numericPrice) {
//                 const change = newItem.numericPrice - oldItem.numericPrice
//                 const percentage = (change / oldItem.numericPrice) * 100
//                 return { ...newItem, chg: (percentage >= 0 ? '+' : '') + percentage.toFixed(2) + '%', up: percentage >= 0 }
//               }
//               return newItem
//             })
//           }
//           return newTicker
//         })
//       } catch (error) {
//         console.error('Error fetching ticker data:', error)
//       }
//     }
//     fetchTickerData()
//     const interval = setInterval(fetchTickerData, 5000)
//     return () => clearInterval(interval)
//   }, [])

//   const rank = RANKS[selectedRank]
//   const ringCirc = 2 * Math.PI * 41
//   const ringOffset = ringCirc - (ringCirc * 75) / 100

//   return (
//     <div
//       className={`dashboard-shell min-h-screen w-full flex ${themeReady && resolvedTheme === "dark" ? "dark" : "light"}`}
//       style={{ background: "linear-gradient(180deg,#eef3fb 0%,#f7f9fd 40%,#eef3fb 100%)", color: C.ink, fontFamily: "Inter, sans-serif" }}
//     >
     
//       <main className="flex-1 min-w-0">
//         <div className="px-4 sm:px-7 py-6 pb-20 max-w-[1440px] mx-auto">
//           {/* ================= HERO ================= */}
//           <section className="mb-11">
//             <div
//               className="relative rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 items-center gap-7 p-8"
//               style={{
//                 background: "linear-gradient(120deg, #14357a 0%, #1f57c9 55%, #2f6bff 100%)",
//                 border: "1px solid rgba(160,190,255,.35)",
//               }}
//             >
//               <ParticleField />
//               <div className="relative z-10">
//                 <div className="inline-flex items-center gap-2 rounded-full font-semibold px-3.5 py-[7px] text-[11px] bg-[rgba(62,207,142,.1)] border border-[rgba(62,207,142,.35)] text-[#6be0ac] mb-4">
//                   <span className="rounded-full w-[7px] h-[7px] bg-[#3ecf8e]" />
//                   AI TRADING SYSTEM: ACTIVE
//                 </div>
//                 <h1
//   className="font-bold text-[30px] leading-[1.2] text-white mb-3"
//   style={{ fontFamily: DISPLAY_FONT, color: "#ffffff" }}
// >
//                   Your financial command center, powered by <span className="text-white">AI intelligence.</span>
//                 </h1>
//                 <p className="text-sm max-w-[440px] leading-[1.7] text-[#dbe6ff]">
//                   Learn smarter. Trade with intelligence. Track every rupee of progress and grow your wealth with strategies built for real market conditions.
//                 </p>
//                 <div className="text-[11px] text-[#cfdcff] mt-3.5">
//                   Figures shown are demo / historical placeholders and update once your live account is connected.
//                 </div>
//                 <div className="flex flex-wrap gap-2.5 mt-5">
//                   {ticker.map((t) => (
//                     <div key={t.pair} className="rounded-xl px-3 py-2 min-w-[98px] bg-white/[.06] border border-[rgba(15,45,100,.13)]">
//                       <div className="text-[10.5px] text-[#cfdcff]">{t.pair}</div>
//                       <div className="font-semibold text-[13px] text-[#eef3fb] mt-0.5" style={{ fontFamily: DISPLAY_FONT }}>{t.price}</div>
//                       <div className={`text-[10.5px] mt-0.5 ${t.up ? 'text-[#4ade9a]' : 'text-[#ff8b96]'}`}>{t.chg}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="relative z-10 rounded-2xl h-[280px] p-[18px] bg-[rgba(255,255,255,.09)] border border-[rgba(160,190,255,.28)]">
//                 <div className="flex justify-between text-[10px] tracking-[.08em] text-[#ffffff] mb-2.5">
//                   <span>Live Market Feed</span>
//                   <b className="text-[#e0ac2e] font-semibold">LIVE</b>
//                 </div>
//                 <LiveChart />
//                 <div className="flex justify-between mt-2.5">
//                   <div className="text-center">
//                     <div className="font-semibold text-[15px] text-[#4ade9a]" style={{ fontFamily: DISPLAY_FONT }}>{live.trend}</div>
//                     <div className="text-[9.5px] text-[#cfdcff]">TREND</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="font-semibold text-[15px] text-[#eef3fb]" style={{ fontFamily: DISPLAY_FONT }}>{heroConf}%</div>
//                     <div className="text-[9.5px] text-[#cfdcff]">AI CONFIDENCE</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="font-semibold text-[15px] text-[#e0ac2e]" style={{ fontFamily: DISPLAY_FONT }}>Low</div>
//                     <div className="text-[9.5px] text-[#cfdcff]">RISK LEVEL</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* ================= ACTIVATED INVESTMENTS ================= */}
//           <Section title="Activated Investments" sub="Your live self-trading position." tagText="1 ACTIVE">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <InvestmentCard
//                 title="Self Trading"
//                 type="MANUAL / SELF-DIRECTED"
//                 investment="$1,500"
//                 start="12 Jun 2026"
//                 profit="$342.80"
//                 limit="3.0×"
//                 cycleDay={61}
//                 barsOn={barsOn}
//               />
//             </div>
//           </Section>

//            <div className="col-lg-6">
//               <div className="dx-card h-100">
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                   <div className="dx-card-title">Trading Package</div>
//                   <span className="dx-badge-soft">${dashboardData?.[0]?.TotalInvestment || "0.00"}</span>
//                 </div>

//                 <div className="d-flex justify-content-center my-3 position-relative">
//                   <CircularGauge percent={visualPercent} size={120} stroke={9} colorFrom="#0ea5e9" colorTo="#14b8a6" gradId="rg" centerTop={`${visualPercent}%`} centerBottom="used" />
//                 </div>

//                 <div className="row text-center g-3">
//                   <div className="col-4">
//                     <div className="dx-mini-stat-label">Total Income</div>
//                     <div className="fw-bold" style={{ color: "#14b8a6" }}>${(dashboardData?.[0]?.totatRoiLevelIncome || 0).toFixed(2) || "0.00"}</div>
//                   </div>
//                   <div className="col-4">
//                     <div className="dx-mini-stat-label">Max Limit</div>
//                     <div className="fw-bold" style={{ color: "#f59e0b" }}>${(dashboardData?.[0]?.GrandincomeLimit || 0).toFixed(2) || "0.00"}</div>
//                   </div>
//                   <div className="col-4">
//                     <div className="dx-mini-stat-label">Remaining</div>
//                     <div className="fw-bold" style={{ color: "#10b981" }}>${(dashboardData?.[0]?.RemainingLimit || 0).toFixed(2) || "0.00"}</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//           {/* ================= BOOSTER ================= */}
//           <Section title="Growth Booster" sub="Add up to 14% by hitting weekly direct targets in sequence." tagText="MAX +14% MONTHLY">
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//               {BOOSTERS.map((b) => {
//                 const circ = 2 * Math.PI * 33
//                 const offset = circ - (circ * b.progress) / 100
//                 return (
//                   <div key={b.n} className={`${CARD_CLS} text-center px-5 pt-[26px] pb-[22px]`}>
//                     <div className="relative mx-auto w-[78px] h-[78px] mb-3">
//                       <svg width="78" height="78" viewBox="0 0 78 78" className="-rotate-90">
//                         <circle cx="39" cy="39" r="33" strokeWidth="7" fill="none" stroke="rgba(15,45,100,.1)" />
//                         <circle
//                           cx="39" cy="39" r="33" strokeWidth="7" fill="none"
//                           stroke={BOOSTER_COLOR[b.state]}
//                           strokeDasharray={circ}
//                           strokeDashoffset={barsOn ? offset : circ}
//                           className="transition-[stroke-dashoffset] duration-[1.2s] ease-[cubic-bezier(.2,.8,.2,1)]"
//                         />
//                       </svg>
//                       <div className="absolute inset-0 flex items-center justify-center font-bold text-sm" style={{ fontFamily: DISPLAY_FONT }}>{b.progress}%</div>
//                     </div>
//                     <div className="font-semibold text-[13.5px]" style={{ fontFamily: DISPLAY_FONT }}>{b.n}</div>
//                     <div className="text-[10.5px] text-[#4c5b7c] mt-0.5">{b.tag}</div>
//                     <div className="font-semibold text-[11.5px] text-[#e0ac2e] mt-2">{b.reward} Monthly Profit</div>
//                     <div
//                       className={`inline-flex items-center font-bold rounded-full text-[10px] tracking-[.04em] px-[11px] py-1 mt-2.5 ${
//                         b.state === "done" ? "bg-[rgba(47,191,122,.12)] text-[#2fbf7a]"
//                         : b.state === "active" ? "bg-[rgba(47,107,255,.15)] text-[#2f6bff]"
//                         : "bg-[rgba(15,45,100,.08)] text-[#5c6c8c]"
//                       }`}
//                     >
//                       {BOOSTER_TEXT[b.state]}
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//             <div className="flex items-center justify-between flex-wrap gap-5 rounded-2xl px-[22px] py-[18px] bg-[rgba(47,107,255,.07)] border border-[rgba(91,139,255,.22)] mt-[18px]">
//               <div className="text-[12.5px] text-[#3a4a6b] max-w-[420px]">
//                 <b className="block text-[15px] text-[#0c1c3d] mb-0.5" style={{ fontFamily: DISPLAY_FONT }}>Booster 2 is 2 Directs away.</b>
//                 You're at 4 of 6 directs for Week 2 — bring in 2 more before the window closes to lock in an additional 4% monthly.
//               </div>
//               <div className="flex gap-[22px]">
//                 <MiniStat value="4/6" label="DIRECTS" />
//                 <MiniStat value="2" label="REMAINING" />
//                 <MiniStat value="6d" label="TIME LEFT" />
//               </div>
//             </div>
//           </Section>

//           {/* ================= INCOME CENTER ================= */}
//           <Section title="Income Overview" sub="Your earnings across all Roventar income streams">
//             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
//               {INCOME_STREAMS.map((s) => (
//                 <div key={s.name} className={`${CARD_CLS} p-7 min-h-[200px]`}>
//                   <div className="flex items-start justify-between">
//                     <div className="rounded-2xl flex items-center justify-center w-[52px] h-[52px] bg-[rgba(47,107,255,.12)] border border-[rgba(91,139,255,.12)]">
//                       <s.icon size={22} strokeWidth={1.8} className="text-[#2f6bff]" />
//                     </div>
//                     <span className="inline-flex items-center gap-0.5 rounded-full px-3 py-2 text-xs font-semibold text-[#16a866] bg-[rgba(47,191,122,.1)]">
//                       <ArrowUpRight size={13} strokeWidth={2.5} /> View
//                     </span>
//                   </div>
//                   <div className="text-[15px] text-[#617493] mt-7">{s.name}</div>
//                   <div className="font-bold text-[30px] leading-none mt-3" style={{ fontFamily: DISPLAY_FONT }}><CountUp value={s.value} /></div>
//                 </div>
//               ))}
//             </div>
//           </Section>

//           {/* ================= GROWTH REWARD JOURNEY ================= */}
//           <Section title="Growth Reward Journey" sub="Ten ranks. One clear path from Associate to Titan." tagText="10 RANKS">
//             <div className={`${CARD_CLS} p-6`}>
//               <div className="flex flex-wrap items-center gap-6 rounded-2xl p-6 bg-[linear-gradient(120deg,rgba(212,166,58,.1),rgba(47,107,255,.07))] border border-[rgba(212,166,58,.28)] mb-6">
//                 <div className="relative shrink-0 w-24 h-24">
//                   <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
//                     <circle cx="48" cy="48" r="41" strokeWidth="9" fill="none" stroke="rgba(15,45,100,.1)" />
//                     <circle
//                       cx="48" cy="48" r="41" strokeWidth="9" fill="none"
//                       stroke={C.gold400} strokeLinecap="round"
//                       strokeDasharray={ringCirc}
//                       strokeDashoffset={barsOn ? ringOffset : ringCirc}
//                       className="transition-[stroke-dashoffset] duration-[1.4s] ease-[cubic-bezier(.2,.8,.2,1)]"
//                     />
//                   </svg>
//                   <div className="absolute inset-0 flex flex-col items-center justify-center">
//                     <b className="text-[19px]" style={{ fontFamily: DISPLAY_FONT }}>75%</b>
//                     <span className="text-[9px] text-[#4c5b7c]">to Vanguard</span>
//                   </div>
//                 </div>
//                 <div className="flex-1 min-w-[220px]">
//                   <div className="text-[10.5px] tracking-[.07em] text-[#4c5b7c]">CURRENT RANK</div>
//                   <h3 className="text-[23px] my-1 mb-3" style={{ fontFamily: DISPLAY_FONT }}>Strategist</h3>
//                   <div className="flex flex-wrap gap-7">
//                     <StatMini label="Achieved" value="$15,000" />
//                     <StatMini label="Next Target" value="Vanguard — $20,000" />
//                     <StatMini label="Remaining" value="$5,000" color={C.gold400} />
//                   </div>
//                 </div>
//               </div>

//               <div className="overflow-x-auto pb-4 pt-1">
//                 <div className="flex items-start" style={{ minWidth: RANKS.length * 100 }}>
//                   {RANKS.map((r, i) => {
//                     const done = i < CURRENT_RANK_INDEX
//                     const current = i === CURRENT_RANK_INDEX
//                     return (
//                       <React.Fragment key={r.n}>
//                         {i > 0 && (
//                           <div
//                             className="shrink"
//                             style={{
//                               flex: 1, minWidth: 16, height: 2, marginTop: 19,
//                               background: i <= CURRENT_RANK_INDEX ? C.gold500 : "#d5deee",
//                             }}
//                           />
//                         )}
//                         <div onClick={() => setSelectedRank(i)} className="flex flex-col items-center cursor-pointer w-[92px]">
//                           <div
//                             className="rounded-full flex items-center justify-center font-semibold w-[38px] h-[38px] text-[13px]"
//                             style={{
//                               fontFamily: DISPLAY_FONT,
//                               background: done
//                                 ? `linear-gradient(135deg, ${C.gold400}, ${C.gold500})`
//                                 : current
//                                 ? `radial-gradient(circle, ${C.blue500}, ${C.navy700})`
//                                 : "#eef2fa",
//                               border: `2px solid ${done ? C.gold400 : current ? C.blue400 : "#c7d1e6"}`,
//                               color: done ? "#241a04" : current ? "#fff" : C.mute,
//                               boxShadow: current
//                                 ? "0 0 0 5px rgba(47,107,255,.18), 0 0 22px rgba(59,110,255,.35)"
//                                 : "none",
//                             }}
//                           >
//                             {done ? <Check size={16} /> : i + 1}
//                           </div>
//                           <div
//                             className={`font-semibold text-center text-xs mt-2.5 ${done ? "text-[#e0ac2e]" : current ? "text-[#2f6bff]" : "text-[#0c1c3d]"}`}
//                           >
//                             {r.n}
//                           </div>
//                           <div className="text-center text-[10px] mt-0.5 text-[#4c5b7c]">{rankSize(r.mb)}</div>
//                         </div>
//                       </React.Fragment>
//                     )
//                   })}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 md:grid-cols-4 gap-[18px] px-[22px] py-5 bg-[rgba(15,45,100,.035)] border border-[rgba(15,45,100,.13)] rounded-2xl mt-1">
//                 <RankDetailItem label="DIRECT ID REQUIREMENT" value={rank.id} />
//                 <RankDetailItem label="DIRECT BUSINESS" value={rank.db === "—" ? "—" : fmt(rank.db)} />
//                 <RankDetailItem label="MATCHING BUSINESS" value={fmt(rank.mb)} />
//                 <RankDetailItem label="REWARD BONUS AMOUNT" value={fmt(rank.reward)} color={C.gold400} />
//                 <div className="col-span-2 md:col-span-4">
//                   <span className="block text-[10px] tracking-[.06em] text-[#4c5b7c] mb-1">REWARD OPTION</span>
//                   <b className="text-[15px]" style={{ fontFamily: DISPLAY_FONT }}>{rank.opt}</b>
//                 </div>
//               </div>
//               <div className="text-center text-[11.5px] text-[#4c5b7c] mt-3.5">
//                 You receive either the Reward Bonus amount <b>or</b> the Reward Option — not both.
//               </div>
//             </div>

//             <div className={`${CARD_CLS} grid grid-cols-1 lg:grid-cols-2 p-6 mt-4 gap-5`}>
//               <div>
//                 <span className={`${TAG_CLS} inline-block mb-2.5`}>QUALIFICATION STATUS</span>
//                 <p className="text-[12.5px] leading-[1.7] text-[#3a4a6b]">
//                   Rewards are calculated and awarded next-to-next based on the applicable qualification criteria. Both team volumes below must satisfy the required qualification before a rank is confirmed.
//                 </p>
//               </div>
//               <div>
//                 <div className="flex rounded-xl overflow-hidden h-[34px] border border-[rgba(15,45,100,.13)]">
//                   <div
//                     className="flex items-center justify-center font-bold w-1/2 text-[11.5px] text-white"
//                     style={{ background: `linear-gradient(90deg, ${C.blue500}, ${C.blue400})` }}
//                   >
//                     Power Team 50%
//                   </div>
//                   <div
//                     className="flex items-center justify-center font-bold w-1/2 text-[11.5px] text-[#241a04]"
//                     style={{ background: `linear-gradient(90deg, rgba(212,166,58,.55), ${C.gold400})` }}
//                   >
//                     Weaker Team 50%
//                   </div>
//                 </div>
//                 <div className="flex justify-between mt-2 text-[10.5px] text-[#4c5b7c]">
//                   <span>$7,500 qualifying volume</span><span>$7,500 qualifying volume</span>
//                 </div>
//               </div>
//             </div>
//           </Section>

//           {/* ================= TEAM ================= */}
//           <Section title="My Team & Direct Network" sub="Direct line performance and level access.">
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
//               <StatTile value="12" label="DIRECT TEAM" />
//               <StatTile value="9" label="ACTIVE DIRECT" color={C.blue500} />
//               <StatTile value="3" label="INACTIVE DIRECT" color={C.red} />
//               <StatTile value="7/20" label="LEVEL OPEN" color={C.gold400} />
//             </div>
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//               <div className={`${CARD_CLS} p-6`}>
//                 <span className={`${TAG_CLS} inline-block mb-3.5`}>TEAM REPORT</span>
//                 <div className="grid grid-cols-2 gap-3.5">
//                   <TrItem label="TOTAL TEAM" value="486" />
//                   <TrItem label="ACTIVE TEAM" value="361" />
//                   <TrItem label="TEAM BUSINESS" value="$212,400" />
//                   <TrItem label="POWER TEAM" value="$106,200" />
//                   <TrItem label="POWER TEAM ID" value="JMF-10432" />
//                   <TrItem label="WEAKER TEAM" value="$106,200" />
//                 </div>
//               </div>
//               <div className={`${CARD_CLS} flex flex-col items-center justify-center p-6 gap-3.5`}>
//                 <span className={`self-start ${TAG_CLS}`}>POWER vs WEAKER</span>
//                 <div className="relative w-[140px] h-[140px]">
//                   <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
//                     <circle cx="70" cy="70" r="58" stroke="rgba(15,45,100,.1)" strokeWidth="16" fill="none" />
//                     <circle cx="70" cy="70" r="58" stroke="url(#balGrad)" strokeWidth="16" fill="none" strokeDasharray="364.4" strokeDashoffset="182.2" strokeLinecap="round" />
//                     <defs>
//                       <linearGradient id="balGrad" x1="0" y1="0" x2="1" y2="1">
//                         <stop offset="0%" stopColor={C.blue500} />
//                         <stop offset="100%" stopColor={C.gold400} />
//                       </linearGradient>
//                     </defs>
//                   </svg>
//                 </div>
//                 <div className="flex gap-[18px]">
//                   <div className="flex items-center gap-1.5 text-[11px] text-[#4c5b7c]">
//                     <span className="rounded-full w-2 h-2 bg-[#2f6bff]" />Power 50%
//                   </div>
//                   <div className="flex items-center gap-1.5 text-[11px] text-[#4c5b7c]">
//                     <span className="rounded-full w-2 h-2 bg-[#e0ac2e]" />Weaker 50%
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Section>

//           {/* ================= CLUB INCOME ================= */}
//           <Section title="Club Income" sub="Consistent matching volume unlocks recurring club rewards.">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <ClubCard icon={Crown} name="Achiever Club" reward="3% Reward" strong="$5K+" other="$5K" matching="$5K" next="$2.5K" iconBg="rgba(212,166,58,.14)" iconBorder="rgba(212,166,58,.3)" />
//               <ClubCard icon={Gem} name="Elite Achiever Club" reward="2% Reward" strong="$10K+" other="$10K" matching="$10K" next="$5K" iconBg="linear-gradient(135deg, rgba(91,139,255,.22), rgba(212,166,58,.2))" iconBorder="rgba(212,166,58,.4)" />
//             </div>
//           </Section>

//           {/* ================= WALLET ================= */}
//           <Section title="Wallet Summary" sub="Working balance and recent activity.">
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//               <StatTile value="$8,940.20" label="WORKING WALLET" color={C.gold400} />
//               <StatTile value="$2,453.56" label="TRADE WALLET BALANCE" />
//               <StatTile value="$5,346.20" label="DEPOSIT WALLET" color={C.blue500} />
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <WithdrawalTile value="$244.00" label="WORKING WITHDRAWAL" />
//               <WithdrawalTile value="$25.33" label="TRADE PROFIT WITHDRAWAL" />
//             </div>
//           </Section>

//           {/* ================= DISCLAIMER ================= */}
//           <div className="rounded-2xl p-5 text-[11px] leading-[1.9] bg-[rgba(15,45,100,.035)] border border-[rgba(15,45,100,.13)] text-[#4c5b7c]">
//             <b className="text-[#0e2a5c]">Risk notice —</b> Trading involves market risk. Past performance does not guarantee future results. AI strategies are designed to assist trading decisions and risk management, not to eliminate risk. Actual results depend on market conditions and strategy performance. All figures on this dashboard are demo/historical placeholders pending live backend connection.
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

// /* ============================================================
//    Subcomponents
// ============================================================ */
// function Section({ title, sub, tagText, children }) {
//   return (
//     <section className="mb-11">
//       <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4.5">
//         <div>
//           <h2 className="font-semibold text-[19px]" style={{ fontFamily: DISPLAY_FONT }}>{title}</h2>
//           {sub && <p className="text-[12.5px] text-[#4c5b7c] mt-1">{sub}</p>}
//         </div>
//         {tagText && <span className={TAG_CLS}>{tagText}</span>}
//       </div>
//       {children}
//     </section>
//   )
// }

// function StatMini({ label, value, color }) {
//   return (
//     <div>
//       <span className="block text-[10.5px] text-[#4c5b7c]">{label}</span>
//       <b className="text-[15px]" style={{ fontFamily: DISPLAY_FONT, color: color || C.ink }}>{value}</b>
//     </div>
//   )
// }

// function RankDetailItem({ label, value, color }) {
//   return (
//     <div>
//       <span className="block text-[10px] tracking-[.05em] text-[#4c5b7c] mb-1">{label}</span>
//       <b className="text-[15px]" style={{ fontFamily: DISPLAY_FONT, color: color || C.ink }}>{value}</b>
//     </div>
//   )
// }

// function MiniStat({ value, label }) {
//   return (
//     <div className="text-center">
//       <b className="block text-[22px] text-[#e0ac2e]" style={{ fontFamily: DISPLAY_FONT }}>{value}</b>
//       <span className="text-[10px] text-[#4c5b7c]">{label}</span>
//     </div>
//   )
// }

// function InvestmentCard({ title, type, investment, start, profit, limit, cycleDay, barsOn }) {
//   return (
//     <div className={`${CARD_CLS} p-6`}>
//       <div className="flex justify-between items-start mb-4">
//         <div>
//           <h4 className="text-base" style={{ fontFamily: DISPLAY_FONT }}>{title}</h4>
//           <div className="text-[10.5px] tracking-[.05em] text-[#e0ac2e] mt-0.5">{type}</div>
//         </div>
//         <span className="font-bold rounded-full text-[10px] tracking-[.04em] px-[11px] py-1 bg-[rgba(47,191,122,.12)] text-[#2fbf7a]">
//           ACTIVE
//         </span>
//       </div>
//       <div className="grid grid-cols-2 gap-3.5 mb-3.5">
//         <MiniField label="Investment" value={investment} />
//         <MiniField label="Start Date" value={start} />
//         <MiniField label="Accumulated Profit" value={profit} color={C.green} />
//         <MiniField label="Eligible Limit" value={limit} />
//       </div>
//       <span className="text-[10px] text-[#4c5b7c]">Cycle progress — Day {cycleDay} / 100</span>
//       <div className="rounded-full overflow-hidden h-2 mt-1.5 bg-[rgba(15,45,100,.08)]">
//         <div
//           className="h-full rounded-full transition-[width] duration-[1.4s]"
//           style={{
//             width: barsOn ? `${cycleDay}%` : "0%",
//             background: `linear-gradient(90deg, ${C.gold500}, ${C.gold400})`,
//           }}
//         />
//       </div>
//     </div>
//   )
// }

// function MiniField({ label, value, color }) {
//   return (
//     <div>
//       <span className="block text-[10px] text-[#4c5b7c]">{label}</span>
//       <b className="text-[14.5px]" style={{ fontFamily: DISPLAY_FONT, color: color || C.ink }}>{value}</b>
//     </div>
//   )
// }

// function StatTile({ value, label, color }) {
//   return (
//     <div className={`${CARD_CLS} text-center p-6`}>
//       <div className="font-bold text-2xl" style={{ fontFamily: DISPLAY_FONT, color: color || C.ink }}>{value}</div>
//       <div className="text-[10.5px] tracking-[.05em] text-[#4c5b7c] mt-1.5">{label}</div>
//     </div>
//   )
// }

// function WithdrawalTile({ value, label }) {
//   return (
//     <div className={`${CARD_CLS} flex items-center justify-between px-[22px] py-[18px]`}>
//       <div>
//         <div className="font-bold text-xl" style={{ fontFamily: DISPLAY_FONT }}>{value}</div>
//         <div className="text-[10.5px] tracking-[.05em] text-[#4c5b7c] mt-1">{label}</div>
//       </div>
//       <div className="rounded-xl flex items-center justify-center w-10 h-10 bg-[rgba(47,107,255,.1)] border border-[rgba(91,139,255,.22)]">
//         <Repeat size={17} className="text-[#2f6bff]" />
//       </div>
//     </div>
//   )
// }

// function TrItem({ label, value }) {
//   return (
//     <div className="rounded-2xl p-4 bg-[rgba(15,45,100,.035)] border border-[rgba(15,45,100,.13)]">
//       <span className="text-[10px] tracking-[.05em] text-[#4c5b7c]">{label}</span>
//       <b className="block text-[17px] mt-1" style={{ fontFamily: DISPLAY_FONT }}>{value}</b>
//     </div>
//   )
// }

// function ClubCard({ icon: Icon, name, reward, strong, other, matching, next, iconBg, iconBorder }) {
//   return (
//     <div className={`${CARD_CLS} p-6`}>
//       <div
//         className="rounded-xl flex items-center justify-center w-11 h-11 mb-3.5"
//         style={{ background: iconBg, border: `1px solid ${iconBorder}` }}
//       >
//         <Icon size={22} className="text-[#e0ac2e]" />
//       </div>
//       <div className="text-lg" style={{ fontFamily: DISPLAY_FONT }}>{name}</div>
//       <div className="font-semibold text-xs text-[#e0ac2e] mb-4">{reward}</div>
//       <div className="grid grid-cols-2 gap-3">
//         <MiniField label="Strong Business" value={strong} />
//         <MiniField label="Other Business" value={other} />
//         <MiniField label="Matching Business" value={matching} />
//         <MiniField label="Next Month" value={next} />
//       </div>
//     </div>
//   )
// }


"use client"

import React, { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import {
  Layers, Shield, Trophy, Rocket, Repeat, TrendingUp, UserPlus, Check, Crown, Gem, Moon, Sun, ArrowUpRight,
} from "lucide-react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler,
} from "chart.js"
import { getUserDashboardDetails } from "@/app/redux/slices/authSlice";
import { getallusernotification } from "@/app//redux/slices/ticketSlice";
import { useDispatch, useSelector } from "react-redux";
import { getUserId } from "@/app/api/auth";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const C = {
  navy900: "#0a1e45",
  navy800: "#0e2a5c",
  navy700: "#123468",
  gold400: "#e0ac2e",
  gold500: "#c98f1f",
  blue500: "#2f6bff",
  blue400: "#5b8bff",
  ink: "#0c1c3d",
  mute: "#4c5b7c",
  line: "rgba(15,45,100,.13)",
  green: "#2fbf7a",
  red: "#ff6b7d",
}

/* Reusable Tailwind class strings */
const CARD_CLS = "dashboard-card bg-gradient-to-br from-white/95 to-[#e8f0fb]/[.88] border border-[rgba(15,45,100,.13)] rounded-[22px] shadow-[0_1px_2px_rgba(15,45,100,.04),0_20px_40px_-28px_rgba(15,45,100,.25)]"
const TAG_CLS = "dashboard-tag text-[10.5px] tracking-[.06em] text-[#e0ac2e] font-semibold bg-[rgba(212,166,58,.1)] border border-[rgba(212,166,58,.25)] rounded-full px-3 py-[5px]"
const DISPLAY_FONT = "'Space Grotesk', sans-serif"

const INITIAL_TICKER = [
  { pair: "EUR/USD", price: "1.0842", chg: "+0.18%", up: true, numericPrice: 1.0842 },
  { pair: "GBP/USD", price: "1.2634", chg: "-0.09%", up: false, numericPrice: 1.2634 },
  { pair: "USD/JPY", price: "151.28", chg: "+0.24%", up: true, numericPrice: 151.28 },
  { pair: "GOLD", price: "4,292.47", chg: "+0.62%", up: true, numericPrice: 4292.47 },
  { pair: "ETH/USDT", price: "3,456.78", chg: "+2.34%", up: true, numericPrice: 3456.78 },
]

const RANKS = [
  { n: "Associate", id: 3, db: "—", mb: 5000, reward: 200, opt: "LDP" },
  { n: "Specialist", id: "—", db: "—", mb: 10000, reward: 400, opt: "Domestic Tour" },
  { n: "Strategist", id: "—", db: 1500, mb: 15000, reward: 700, opt: "Int'l Tour — Thailand" },
  { n: "Vanguard", id: 6, db: 2000, mb: 20000, reward: 1000, opt: "Int'l Tour — Dubai" },
  { n: "Professional", id: "—", db: 3000, mb: 50000, reward: 2500, opt: "Car" },
  { n: "Executive", id: "—", db: 4000, mb: 100000, reward: 6000, opt: "Luxury Car" },
  { n: "Expert", id: 9, db: 5000, mb: 200000, reward: 15000, opt: "Dream House" },
  { n: "Master", id: "—", db: 5000, mb: 1000000, reward: 50000, opt: "Luxury Lifestyle" },
  { n: "Elite", id: 12, db: 10000, mb: 2000000, reward: 100000, opt: "World Tour" },
  { n: "Titan", id: "—", db: 10000, mb: 10000000, reward: 500000, opt: "Retirement Benefit" },
]
const CURRENT_RANK_INDEX = 2

const BOOSTERS = [
  { n: "Booster 1", tag: "3 Directs · Week 1", reward: "5%", state: "done", progress: 100 },
  { n: "Booster 2", tag: "Next 3 Directs · Week 2", reward: "+4%", state: "active", progress: 66 },
  { n: "Booster 3", tag: "Next 3 Directs · Week 3", reward: "+3%", state: "locked", progress: 0 },
  { n: "Booster 4", tag: "Next 3 Directs · Week 4", reward: "+2%", state: "locked", progress: 0 },
]
const BOOSTER_COLOR = { done: C.green, active: C.gold400, locked: "#c7d1e6" }
const BOOSTER_TEXT = { done: "Qualified", active: "In progress", locked: "Locked" }

 const CircularGauge = ({ percent = 0, size = 120, stroke = 9, colorFrom = "#0ea5e9", colorTo = "#14b8a6", gradId, centerTop, centerBottom, track = true }) => {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const off = c - (c * Math.min(100, Math.max(0, percent))) / 100;
    const cx = size / 2, cy = size / 2;
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={colorFrom} />
              <stop offset="100%" stopColor={colorTo} />
            </linearGradient>
          </defs>
          {track && <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E5E7EB" className="dark:stroke-gray-700" strokeWidth={stroke} />}
          <circle
            cx={cx} cy={cy} r={r} fill="none"
            stroke={`url(#${gradId})`} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={off}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-base font-bold text-gray-900 dark:text-white">{centerTop}</div>
          {centerBottom && <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 text-center">{centerBottom}</div>}
        </div>
      </div>
    );
  };

const INCOME_STREAMS_STATIC = [
  { name: "Referral Income", icon: UserPlus, key: "DirectIncome" },
  { name: "Trading Profit Income", icon: TrendingUp, key: "DailyTradingProfit" },
  { name: "Booster Income", icon: Rocket, key: "BoostIncome" },
  { name: "Level Income", icon: Layers, key: "TierLevelIncome" },
  { name: "Growth Reward Income", icon: Trophy, key: "RewardIncome" },
  { name: "Club Income", icon: Shield, key: "ClubIncome" },
]

const fmt = (n) => "$" + Number(n || 0).toLocaleString()
const rand = (a, b) => Math.floor(a + Math.random() * (b - a))
const rankSize = (mb) => (mb >= 1000000 ? `$${mb / 1000000}M` : `$${mb / 1000}K`)

/* ============================================================
   Live Chart
============================================================ */
function LiveChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'BTC/USDT',
      data: [],
      borderColor: '#4ade9a',
      backgroundColor: 'rgba(74, 222, 154, 0.1)',
      borderWidth: 2, fill: true, tension: 0.4,
      pointRadius: 0, pointHoverRadius: 4,
    }],
  })
  const [currentPrice, setCurrentPrice] = useState(0)
  const [priceChange, setPriceChange] = useState({ value: 0, percentage: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLivePrice = async () => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
        const data = await response.json()
        const price = parseFloat(data.price)
        setChartData(prev => {
          const newLabels = [...prev.labels]
          const newData = [...prev.datasets[0].data]
          const newTime = new Date()
          newLabels.push(newTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
          if (newLabels.length > 31) newLabels.shift()
          newData.push(price)
          if (newData.length > 31) newData.shift()
          setCurrentPrice(price)
          if (newData.length > 1) {
            const firstPrice = newData[0]
            const change = price - firstPrice
            const percentage = (change / firstPrice) * 100
            setPriceChange({ value: change, percentage })
            return {
              ...prev, labels: newLabels,
              datasets: [{
                ...prev.datasets[0], data: newData,
                borderColor: change >= 0 ? '#4ade9a' : '#ff6b7d',
                backgroundColor: change >= 0 ? 'rgba(74, 222, 154, 0.1)' : 'rgba(255, 107, 125, 0.1)',
              }],
            }
          }
          return { ...prev, labels: newLabels, datasets: [{ ...prev.datasets[0], data: newData }] }
        })
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching live price:', error)
      }
    }
    fetchLivePrice()
    const interval = setInterval(fetchLivePrice, 3000)
    return () => clearInterval(interval)
  }, [])

  const options = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index', intersect: false,
        backgroundColor: 'rgba(6, 11, 22, 0.9)',
        titleColor: '#8ea0c6', bodyColor: '#eef3fb',
        borderColor: 'rgba(91, 139, 255, 0.3)', borderWidth: 1,
        padding: 12, displayColors: false,
        callbacks: { label: (ctx) => `$${ctx.parsed.y?.toFixed(2) || '0.00'}` },
      },
    },
    scales: {
      x: {
        display: true, grid: { display: false },
        ticks: { color: '#ffffff', font: { size: 9 }, maxTicksLimit: 6 },
      },
      y: {
        display: true, grid: { color: 'rgba(15, 45, 100, 0.1)' },
        ticks: {
          color: '#ffffff', font: { size: 9 },
          callback: (v) => '$' + (v?.toFixed(0) || '0'),
        },
      },
    },
    interaction: { mode: 'nearest', axis: 'x', intersect: false },
  }

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-2">
        <div>
          <div className="text-[18px] font-semibold text-white" style={{ fontFamily: DISPLAY_FONT }}>
            {isLoading ? 'Loading...' : `$${currentPrice.toFixed(2)}`}
          </div>
          <div className={`text-[11px] ${priceChange.value >= 0 ? 'text-[#4ade9a]' : 'text-[#ff6b7d]'}`}>
            {!isLoading && (
              <>
                {priceChange.value >= 0 ? '+' : ''}{priceChange.value.toFixed(2)} ({priceChange.percentage >= 0 ? '+' : ''}{priceChange.percentage.toFixed(2)}%)
              </>
            )}
          </div>
        </div>
        <div className="text-[10px] text-white">BTC/USDT</div>
      </div>
      <div className="h-[140px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}

/* ============================================================
   Sparkline
============================================================ */
function Sparkline({ up }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const w = canvas.clientWidth, h = canvas.clientHeight
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext("2d")
    let v = h * 0.45
    const pts = []
    for (let i = 0; i < 20; i++) {
      v += (Math.random() - 0.4) * h * 0.2
      v = Math.max(4, Math.min(h - 4, v))
      pts.push(v)
    }
    ctx.beginPath()
    pts.forEach((p, i) => {
      const x = (i / (pts.length - 1)) * w
      const y = h - p
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.strokeStyle = up ? C.green : C.red
    ctx.lineWidth = 2; ctx.lineJoin = "round"; ctx.lineCap = "round"
    ctx.stroke()
  }, [up])
  return <canvas ref={ref} className="w-full block h-7 mt-2" />
}

/* ============================================================
   CountUp
============================================================ */
function CountUp({ value }) {
  const [display_, setDisplay] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const dur = 1100
    let raf
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur)
      setDisplay(value * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value])
  return <>${display_.toFixed(2)}</>
}

/* ============================================================
   Particle Field
============================================================ */
function ParticleField() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let w, h, particles
    const size = () => {
      w = canvas.clientWidth; h = canvas.clientHeight
      canvas.width = w; canvas.height = h
    }
    size()
    particles = Array.from({ length: 24 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.8 + 0.5,
    }))
    let raf
    const loop = () => {
      ctx.clearRect(0, 0, w, h)
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7)
        ctx.fillStyle = "rgba(232,196,110,0.5)"; ctx.fill()
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const d = Math.hypot(p.x - q.x, p.y - q.y)
          if (d < 70) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(91,139,255,${0.12 * (1 - d / 70)})`; ctx.lineWidth = 1; ctx.stroke()
          }
        }
      })
      raf = requestAnimationFrame(loop)
    }
    loop()
    window.addEventListener("resize", size)
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", size) }
  }, [])
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none opacity-60" />
}

/* ============================================================
   MAIN DASHBOARD
============================================================ */
export default function JMFinexDashboard() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const [themeReady, setThemeReady] = useState(false)
  const [clock, setClock] = useState("")
  const [selectedRank, setSelectedRank] = useState(CURRENT_RANK_INDEX)
  const [barsOn, setBarsOn] = useState(false)
  const [heroConf, setHeroConf] = useState(74)
  const [live, setLive] = useState({ trend: "Bullish" })
  const [ticker, setTicker] = useState(INITIAL_TICKER)

  // ===== API state (mirrors the pattern from the other dashboard) =====
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const userURID = getUserId()
  const notifications = useSelector((state) => state.ticket?.notificationData)
  const notificationList = notifications?.notificationList ?? []

  // ===== Derived values from API =====
  const data = dashboardData?.[0] || {}

  // Trading Package card values
  const totalIncome = Number(data?.totatRoiLevelIncome ?? 0)
  const earningLimit = Number(data?.EarningLimit ?? data?.GrandincomeLimit ?? 0)
  const remainingLimit = Number(data?.RemainingLimit ?? Math.max(0, earningLimit - totalIncome))
  const usedPercentage = earningLimit > 0 ? Math.min(100, (totalIncome / earningLimit) * 100) : 0
  const visualPercent = Number(usedPercentage.toFixed(1))

  // Team / business
  const leftBiz = Number(data?.LeftBussiness ?? data?.LeftBusiness ?? 0)
  const rightBiz = Number(data?.RightBussiness ?? data?.RightBusiness ?? 0)
  const totalTeam = data?.TotalTeam ?? ((data?.LeftTeam || 0) + (data?.RightTeam || 0))
  const activeTeam = data?.ActiveTeam ?? 0
  const teamBusiness = data?.Teambusiness ?? (leftBiz + rightBiz)
  const strongTeamBusiness = data?.StrongLegID ?? Math.max(leftBiz, rightBiz)
  const otherLegBusiness = data?.StrongLegBus ?? Math.min(leftBiz, rightBiz)
  const weakTeamBussiness = data?.OtherLegBus ?? Math.min(leftBiz, rightBiz)

  // Direct team
  const directIds = data?.DirectIds ?? 0
  const activeDirectIds = data?.ActiveDirectIds ?? 0
  const inactiveDirectIds = Math.max(0, directIds - activeDirectIds)
  const directBusiness = data?.DirectBusiness ?? data?.DirectBussiness ?? 0
  const levelOpen = data?.LevelOpen ?? 0

  // Wallet
  const incomeWallet = Number(data?.IncomeWallet ?? 0)
  const tradingWallet = Number(data?.TradingWallet ?? 0)
  const depositWallet = Number(data?.DepositWallet ?? 0)
  const tradingWithdrawal = Number(data?.TradingWithdrawal ?? 0)
  const incomeWithdrawal = Number(data?.IncomeWithdrawal ?? 0)

  // Rank
  const userRank = data?.UserRank || "Associate"
  const nextRank = data?.NextRank || "—"
  const rankOrder = ['LT1', 'LT2', 'LT3', 'LT4', 'LT5', 'LT6', 'LT7', 'LT8', 'LT9', 'LT10', 'LT11']
  const currentRankIndex = rankOrder.indexOf(userRank)
  const rankPct = currentRankIndex >= 0
    ? Math.round((currentRankIndex / (rankOrder.length - 1)) * 100)
    : 0

  // ===== FETCH DASHBOARD (same pattern as the other file) =====
  useEffect(() => {
    const fetchDashboardDetails = async () => {
      setIsLoading(true)
      try {
        const result = await dispatch(getUserDashboardDetails()).unwrap()
        if (result?.data) {
          setDashboardData(result.data)
        } else if (result) {
          setDashboardData(result)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard details:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboardDetails()
  }, [dispatch])

  // ===== FETCH NOTIFICATIONS (same as other file) =====
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        await dispatch(getallusernotification()).unwrap()
      } catch (err) {
        try {
          dispatch(getallusernotification())
        } catch (e) {
          console.error('Failed to fetch user notifications:', e || err)
        }
      }
    }
    fetchNotifications()
  }, [dispatch])

  // ===== Build dynamic income streams from API =====
  const INCOME_STREAMS = INCOME_STREAMS_STATIC.map((s) => {
    const val = Number(data?.[s.key] ?? 0)
    return {
      name: s.name,
      icon: s.icon,
      value: val,
      chg: "—",
      up: true,
      total: val,
      today: 0,
    }
  })

  // ===== Dynamic current rank index in the RANKS ladder =====
  const liveRankIndex = (() => {
    const idx = RANKS.findIndex(r => r.n.toLowerCase() === String(userRank).toLowerCase())
    return idx >= 0 ? idx : CURRENT_RANK_INDEX
  })()

  useEffect(() => {
    setThemeReady(true)
  }, [])

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleString(undefined, { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" }))
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => { const t = setTimeout(() => setBarsOn(true), 100); return () => clearTimeout(t) }, [])

  useEffect(() => {
    const id = setInterval(() => {
      const trendUp = Math.random() > 0.35
      setLive({ trend: trendUp ? "Bullish" : "Bearish" })
      setHeroConf(rand(65, 88))
    }, 2600)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const fetchTickerData = async () => {
      try {
        const [ethResponse, btcResponse] = await Promise.all([
          fetch('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT'),
          fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'),
        ])
        const ethData = await ethResponse.json()
        const btcData = await btcResponse.json()
        const ethPrice = parseFloat(ethData.price)
        const btcPrice = parseFloat(btcData.price)
        const goldPrice = 4294.51
        const baseForex = { eurUsd: 1.0842, gbpUsd: 1.2634, usdJpy: 151.28 }
        const eurUsd = (baseForex.eurUsd + (Math.random() - 0.5) * 0.001).toFixed(4)
        const gbpUsd = (baseForex.gbpUsd + (Math.random() - 0.5) * 0.001).toFixed(4)
        const usdJpy = (baseForex.usdJpy + (Math.random() - 0.5) * 0.1).toFixed(2)

        setTicker(prev => {
          const newTicker = [
            { pair: "EUR/USD", price: eurUsd, chg: "0.00%", up: true, numericPrice: parseFloat(eurUsd) },
            { pair: "GBP/USD", price: gbpUsd, chg: "0.00%", up: true, numericPrice: parseFloat(gbpUsd) },
            { pair: "USD/JPY", price: parseFloat(usdJpy).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), chg: "0.00%", up: true, numericPrice: parseFloat(usdJpy) },
            { pair: "GOLD", price: goldPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), chg: "0.00%", up: true, numericPrice: goldPrice },
            { pair: "ETH/USDT", price: ethPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), chg: "0.00%", up: true, numericPrice: ethPrice },
          ]
          if (prev.length > 0) {
            return newTicker.map((newItem, index) => {
              const oldItem = prev[index]
              if (oldItem && oldItem.numericPrice) {
                const change = newItem.numericPrice - oldItem.numericPrice
                const percentage = (change / oldItem.numericPrice) * 100
                return { ...newItem, chg: (percentage >= 0 ? '+' : '') + percentage.toFixed(2) + '%', up: percentage >= 0 }
              }
              return newItem
            })
          }
          return newTicker
        })
      } catch (error) {
        console.error('Error fetching ticker data:', error)
      }
    }
    fetchTickerData()
    const interval = setInterval(fetchTickerData, 5000)
    return () => clearInterval(interval)
  }, [])

  const rank = RANKS[selectedRank]
  const ringCirc = 2 * Math.PI * 41
  const ringOffset = ringCirc - (ringCirc * rankPct) / 100

  return (
    <div
      className={`dashboard-shell min-h-screen w-full flex ${themeReady && resolvedTheme === "dark" ? "dark" : "light"}`}
      style={{ background: "linear-gradient(180deg,#eef3fb 0%,#f7f9fd 40%,#eef3fb 100%)", color: C.ink, fontFamily: "Inter, sans-serif" }}
    >
      <main className="flex-1 min-w-0">
        <div className="px-4 sm:px-7 py-6 pb-20 max-w-[1440px] mx-auto">
          {/* ================= HERO ================= */}
          <section className="mb-11">
            <div
              className="relative rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 items-center gap-7 p-8"
              style={{
                background: "linear-gradient(120deg, #14357a 0%, #1f57c9 55%, #2f6bff 100%)",
                border: "1px solid rgba(160,190,255,.35)",
              }}
            >
              <ParticleField />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full font-semibold px-3.5 py-[7px] text-[11px] bg-[rgba(62,207,142,.1)] border border-[rgba(62,207,142,.35)] text-[#6be0ac] mb-4">
                  <span className="rounded-full w-[7px] h-[7px] bg-[#3ecf8e]" />
                  AI TRADING SYSTEM: ACTIVE
                </div>
                <h1
                  className="font-bold text-[30px] leading-[1.2] text-white mb-3"
                  style={{ fontFamily: DISPLAY_FONT, color: "#ffffff" }}
                >
                  Your financial command center, powered by <span className="text-white">AI intelligence.</span>
                </h1>
                <p className="text-sm max-w-[440px] leading-[1.7] text-[#dbe6ff]">
                  Learn smarter. Trade with intelligence. Track every rupee of progress and grow your wealth with strategies built for real market conditions.
                </p>
                <div className="text-[11px] text-[#cfdcff] mt-3.5">
                  Figures shown are demo / historical placeholders and update once your live account is connected.
                </div>
                <div className="flex flex-wrap gap-2.5 mt-5">
                  {ticker.map((t) => (
                    <div key={t.pair} className="rounded-xl px-3 py-2 min-w-[98px] bg-white/[.06] border border-[rgba(15,45,100,.13)]">
                      <div className="text-[10.5px] text-[#cfdcff]">{t.pair}</div>
                      <div className="font-semibold text-[13px] text-[#eef3fb] mt-0.5" style={{ fontFamily: DISPLAY_FONT }}>{t.price}</div>
                      <div className={`text-[10.5px] mt-0.5 ${t.up ? 'text-[#4ade9a]' : 'text-[#ff8b96]'}`}>{t.chg}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 rounded-2xl h-[280px] p-[18px] bg-[rgba(255,255,255,.09)] border border-[rgba(160,190,255,.28)]">
                <div className="flex justify-between text-[10px] tracking-[.08em] text-[#ffffff] mb-2.5">
                  <span>Live Market Feed</span>
                  <b className="text-[#e0ac2e] font-semibold">LIVE</b>
                </div>
                <LiveChart />
                <div className="flex justify-between mt-2.5">
                  <div className="text-center">
                    <div className="font-semibold text-[15px] text-[#4ade9a]" style={{ fontFamily: DISPLAY_FONT }}>{live.trend}</div>
                    <div className="text-[9.5px] text-[#cfdcff]">TREND</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-[15px] text-[#eef3fb]" style={{ fontFamily: DISPLAY_FONT }}>{heroConf}%</div>
                    <div className="text-[9.5px] text-[#cfdcff]">AI CONFIDENCE</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-[15px] text-[#e0ac2e]" style={{ fontFamily: DISPLAY_FONT }}>Low</div>
                    <div className="text-[9.5px] text-[#cfdcff]">RISK LEVEL</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================= ACTIVATED INVESTMENTS ================= */}
          <Section title="Activated Investments" sub="Your live self-trading position." tagText="1 ACTIVE">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InvestmentCard
                title="Self Trading"
                type="MANUAL / SELF-DIRECTED"
                investment={`$${Number(data?.TotalInvestment ?? 0).toLocaleString()}`}
                start={data?.StartDate || "—"}
                profit={`$${Number(data?.DailyTradingProfit ?? 0).toLocaleString()}`}
                limit={data?.EarningLimit ? `${data.EarningLimit}×` : "—"}
                cycleDay={Number(data?.CycleDay ?? 0)}
                barsOn={barsOn}
              />
              <div className={`${CARD_CLS} p-6`}>
                <div className="flex justify-between items-center mb-3">
                  <div className="text-[15px] font-semibold" style={{ fontFamily: DISPLAY_FONT }}>Trading Package</div>
                  <span className={TAG_CLS}>${Number(data?.TotalInvestment || 0).toFixed(2)}</span>
                </div>

                <div className="flex justify-center my-3 relative">
                  <CircularGauge
                    percent={visualPercent}
                    size={120}
                    stroke={9}
                    colorFrom="#0ea5e9"
                    colorTo="#14b8a6"
                    gradId="rg"
                    centerTop={`${visualPercent}%`}
                    centerBottom="used"
                  />
                </div>

                <div className="grid grid-cols-3 text-center gap-3">
                  <div>
                    <div className="text-[10px] text-[#4c5b7c]">Total Income</div>
                    <div className="font-bold text-[#14b8a6]">${Number(data?.totatRoiLevelIncome || 0).toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#4c5b7c]">Max Limit</div>
                    <div className="font-bold text-[#f59e0b]">${Number(data?.GrandincomeLimit || 0).toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#4c5b7c]">Remaining</div>
                    <div className="font-bold text-[#10b981]">${Number(data?.RemainingLimit || 0).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          </Section>

        

          {/* ================= BOOSTER ================= */}
          <Section title="Growth Booster" sub="Add up to 14% by hitting weekly direct targets in sequence." tagText="MAX +14% MONTHLY">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {BOOSTERS.map((b) => {
                const circ = 2 * Math.PI * 33
                const offset = circ - (circ * b.progress) / 100
                return (
                  <div key={b.n} className={`${CARD_CLS} text-center px-5 pt-[26px] pb-[22px]`}>
                    <div className="relative mx-auto w-[78px] h-[78px] mb-3">
                      <svg width="78" height="78" viewBox="0 0 78 78" className="-rotate-90">
                        <circle cx="39" cy="39" r="33" strokeWidth="7" fill="none" stroke="rgba(15,45,100,.1)" />
                        <circle
                          cx="39" cy="39" r="33" strokeWidth="7" fill="none"
                          stroke={BOOSTER_COLOR[b.state]}
                          strokeDasharray={circ}
                          strokeDashoffset={barsOn ? offset : circ}
                          className="transition-[stroke-dashoffset] duration-[1.2s] ease-[cubic-bezier(.2,.8,.2,1)]"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-bold text-sm" style={{ fontFamily: DISPLAY_FONT }}>{b.progress}%</div>
                    </div>
                    <div className="font-semibold text-[13.5px]" style={{ fontFamily: DISPLAY_FONT }}>{b.n}</div>
                    <div className="text-[10.5px] text-[#4c5b7c] mt-0.5">{b.tag}</div>
                    <div className="font-semibold text-[11.5px] text-[#e0ac2e] mt-2">{b.reward} Monthly Profit</div>
                    <div
                      className={`inline-flex items-center font-bold rounded-full text-[10px] tracking-[.04em] px-[11px] py-1 mt-2.5 ${
                        b.state === "done" ? "bg-[rgba(47,191,122,.12)] text-[#2fbf7a]"
                        : b.state === "active" ? "bg-[rgba(47,107,255,.15)] text-[#2f6bff]"
                        : "bg-[rgba(15,45,100,.08)] text-[#5c6c8c]"
                      }`}
                    >
                      {BOOSTER_TEXT[b.state]}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center justify-between flex-wrap gap-5 rounded-2xl px-[22px] py-[18px] bg-[rgba(47,107,255,.07)] border border-[rgba(91,139,255,.22)] mt-[18px]">
              <div className="text-[12.5px] text-[#3a4a6b] max-w-[420px]">
                <b className="block text-[15px] text-[#0c1c3d] mb-0.5" style={{ fontFamily: DISPLAY_FONT }}>Booster 2 is 2 Directs away.</b>
                You're at 4 of 6 directs for Week 2 — bring in 2 more before the window closes to lock in an additional 4% monthly.
              </div>
              <div className="flex gap-[22px]">
                <MiniStat value="4/6" label="DIRECTS" />
                <MiniStat value="2" label="REMAINING" />
                <MiniStat value="6d" label="TIME LEFT" />
              </div>
            </div>
          </Section>

          {/* ================= INCOME CENTER ================= */}
          <Section title="Income Overview" sub="Your earnings across all Roventar income streams">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {INCOME_STREAMS.map((s) => (
                <div key={s.name} className={`${CARD_CLS} p-7 min-h-[200px]`}>
                  <div className="flex items-start justify-between">
                    <div className="rounded-2xl flex items-center justify-center w-[52px] h-[52px] bg-[rgba(47,107,255,.12)] border border-[rgba(91,139,255,.12)]">
                      <s.icon size={22} strokeWidth={1.8} className="text-[#2f6bff]" />
                    </div>
                    <span className="inline-flex items-center gap-0.5 rounded-full px-3 py-2 text-xs font-semibold text-[#16a866] bg-[rgba(47,191,122,.1)]">
                      <ArrowUpRight size={13} strokeWidth={2.5} /> View
                    </span>
                  </div>
                  <div className="text-[15px] text-[#617493] mt-7">{s.name}</div>
                  <div className="font-bold text-[30px] leading-none mt-3" style={{ fontFamily: DISPLAY_FONT }}><CountUp value={s.value} /></div>
                </div>
              ))}
            </div>
          </Section>

          {/* ================= GROWTH REWARD JOURNEY ================= */}
          <Section title="Growth Reward Journey" sub="Ten ranks. One clear path from Associate to Titan." tagText="10 RANKS">
            <div className={`${CARD_CLS} p-6`}>
              <div className="flex flex-wrap items-center gap-6 rounded-2xl p-6 bg-[linear-gradient(120deg,rgba(212,166,58,.1),rgba(47,107,255,.07))] border border-[rgba(212,166,58,.28)] mb-6">
                <div className="relative shrink-0 w-24 h-24">
                  <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
                    <circle cx="48" cy="48" r="41" strokeWidth="9" fill="none" stroke="rgba(15,45,100,.1)" />
                    <circle
                      cx="48" cy="48" r="41" strokeWidth="9" fill="none"
                      stroke={C.gold400} strokeLinecap="round"
                      strokeDasharray={ringCirc}
                      strokeDashoffset={barsOn ? ringOffset : ringCirc}
                      className="transition-[stroke-dashoffset] duration-[1.4s] ease-[cubic-bezier(.2,.8,.2,1)]"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <b className="text-[19px]" style={{ fontFamily: DISPLAY_FONT }}>{rankPct}%</b>
                    <span className="text-[9px] text-[#4c5b7c]">to {nextRank}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-[220px]">
                  <div className="text-[10.5px] tracking-[.07em] text-[#4c5b7c]">CURRENT RANK</div>
                  <h3 className="text-[23px] my-1 mb-3" style={{ fontFamily: DISPLAY_FONT }}>{userRank}</h3>
                  <div className="flex flex-wrap gap-7">
                    <StatMini label="Achieved" value={`$${Number(data?.QualifyRewardAmt ?? 0).toLocaleString()}`} />
                    <StatMini label="Next Target" value={`${nextRank} — $${Number(data?.NextRewardBusReq ?? 0).toLocaleString()}`} />
                    <StatMini label="Remaining" value={`$${Number(data?.RewardPendingPowerTeam ?? 0).toLocaleString()}`} color={C.gold400} />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto pb-4 pt-1">
                <div className="flex items-start" style={{ minWidth: RANKS.length * 100 }}>
                  {RANKS.map((r, i) => {
                    const done = i < liveRankIndex
                    const current = i === liveRankIndex
                    return (
                      <React.Fragment key={r.n}>
                        {i > 0 && (
                          <div
                            className="shrink"
                            style={{
                              flex: 1, minWidth: 16, height: 2, marginTop: 19,
                              background: i <= liveRankIndex ? C.gold500 : "#d5deee",
                            }}
                          />
                        )}
                        <div onClick={() => setSelectedRank(i)} className="flex flex-col items-center cursor-pointer w-[92px]">
                          <div
                            className="rounded-full flex items-center justify-center font-semibold w-[38px] h-[38px] text-[13px]"
                            style={{
                              fontFamily: DISPLAY_FONT,
                              background: done
                                ? `linear-gradient(135deg, ${C.gold400}, ${C.gold500})`
                                : current
                                ? `radial-gradient(circle, ${C.blue500}, ${C.navy700})`
                                : "#eef2fa",
                              border: `2px solid ${done ? C.gold400 : current ? C.blue400 : "#c7d1e6"}`,
                              color: done ? "#241a04" : current ? "#fff" : C.mute,
                              boxShadow: current
                                ? "0 0 0 5px rgba(47,107,255,.18), 0 0 22px rgba(59,110,255,.35)"
                                : "none",
                            }}
                          >
                            {done ? <Check size={16} /> : i + 1}
                          </div>
                          <div
                            className={`font-semibold text-center text-xs mt-2.5 ${done ? "text-[#e0ac2e]" : current ? "text-[#2f6bff]" : "text-[#0c1c3d]"}`}
                          >
                            {r.n}
                          </div>
                          <div className="text-center text-[10px] mt-0.5 text-[#4c5b7c]">{rankSize(r.mb)}</div>
                        </div>
                      </React.Fragment>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-[18px] px-[22px] py-5 bg-[rgba(15,45,100,.035)] border border-[rgba(15,45,100,.13)] rounded-2xl mt-1">
                <RankDetailItem label="DIRECT ID REQUIREMENT" value={rank.id} />
                <RankDetailItem label="DIRECT BUSINESS" value={rank.db === "—" ? "—" : fmt(rank.db)} />
                <RankDetailItem label="MATCHING BUSINESS" value={fmt(rank.mb)} />
                <RankDetailItem label="REWARD BONUS AMOUNT" value={fmt(rank.reward)} color={C.gold400} />
                <div className="col-span-2 md:col-span-4">
                  <span className="block text-[10px] tracking-[.06em] text-[#4c5b7c] mb-1">REWARD OPTION</span>
                  <b className="text-[15px]" style={{ fontFamily: DISPLAY_FONT }}>{rank.opt}</b>
                </div>
              </div>
              <div className="text-center text-[11.5px] text-[#4c5b7c] mt-3.5">
                You receive either the Reward Bonus amount <b>or</b> the Reward Option — not both.
              </div>
            </div>

            <div className={`${CARD_CLS} grid grid-cols-1 lg:grid-cols-2 p-6 mt-4 gap-5`}>
              <div>
                <span className={`${TAG_CLS} inline-block mb-2.5`}>QUALIFICATION STATUS</span>
                <p className="text-[12.5px] leading-[1.7] text-[#3a4a6b]">
                  Rewards are calculated and awarded next-to-next based on the applicable qualification criteria. Both team volumes below must satisfy the required qualification before a rank is confirmed.
                </p>
              </div>
              <div>
                <div className="flex rounded-xl overflow-hidden h-[34px] border border-[rgba(15,45,100,.13)]">
                  <div
                    className="flex items-center justify-center font-bold w-1/2 text-[11.5px] text-white"
                    style={{ background: `linear-gradient(90deg, ${C.blue500}, ${C.blue400})` }}
                  >
                    Power Team 50%
                  </div>
                  <div
                    className="flex items-center justify-center font-bold w-1/2 text-[11.5px] text-[#241a04]"
                    style={{ background: `linear-gradient(90deg, rgba(212,166,58,.55), ${C.gold400})` }}
                  >
                    Weaker Team 50%
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-[10.5px] text-[#4c5b7c]">
                  <span>${Number(data?.StrongLegBus ?? 0).toLocaleString()} qualifying volume</span>
                  <span>${Number(data?.OtherLegBus ?? 0).toLocaleString()} qualifying volume</span>
                </div>
              </div>
            </div>
          </Section>

          {/* ================= TEAM ================= */}
          <Section title="My Team & Direct Network" sub="Direct line performance and level access.">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              <StatTile value={directIds} label="DIRECT TEAM" />
              <StatTile value={activeDirectIds} label="ACTIVE DIRECT" color={C.blue500} />
              <StatTile value={inactiveDirectIds} label="INACTIVE DIRECT" color={C.red} />
              <StatTile value={`${levelOpen}/20`} label="LEVEL OPEN" color={C.gold400} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className={`${CARD_CLS} p-6`}>
                <span className={`${TAG_CLS} inline-block mb-3.5`}>TEAM REPORT</span>
                <div className="grid grid-cols-2 gap-3.5">
                  <TrItem label="TOTAL TEAM" value={totalTeam} />
                  <TrItem label="ACTIVE TEAM" value={activeTeam} />
                  <TrItem label="TEAM BUSINESS" value={`$${Number(teamBusiness).toLocaleString()}`} />
                  <TrItem label="POWER TEAM" value={`$${Number(otherLegBusiness).toLocaleString()}`} />
                  <TrItem label="POWER TEAM ID" value={strongTeamBusiness} />
                  <TrItem label="WEAKER TEAM" value={`$${Number(weakTeamBussiness).toLocaleString()}`} />
                </div>
              </div>
              <div className={`${CARD_CLS} flex flex-col items-center justify-center p-6 gap-3.5`}>
                <span className={`self-start ${TAG_CLS}`}>POWER vs WEAKER</span>
                <div className="relative w-[140px] h-[140px]">
                  <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
                    <circle cx="70" cy="70" r="58" stroke="rgba(15,45,100,.1)" strokeWidth="16" fill="none" />
                    <circle cx="70" cy="70" r="58" stroke="url(#balGrad)" strokeWidth="16" fill="none" strokeDasharray="364.4" strokeDashoffset="182.2" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="balGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={C.blue500} />
                        <stop offset="100%" stopColor={C.gold400} />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="flex gap-[18px]">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#4c5b7c]">
                    <span className="rounded-full w-2 h-2 bg-[#2f6bff]" />Power 50%
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#4c5b7c]">
                    <span className="rounded-full w-2 h-2 bg-[#e0ac2e]" />Weaker 50%
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* ================= CLUB INCOME ================= */}
          <Section title="Club Income" sub="Consistent matching volume unlocks recurring club rewards.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ClubCard icon={Crown} name="Achiever Club" reward="3% Reward" strong="$5K+" other="$5K" matching="$5K" next="$2.5K" iconBg="rgba(212,166,58,.14)" iconBorder="rgba(212,166,58,.3)" />
              <ClubCard icon={Gem} name="Elite Achiever Club" reward="2% Reward" strong="$10K+" other="$10K" matching="$10K" next="$5K" iconBg="linear-gradient(135deg, rgba(91,139,255,.22), rgba(212,166,58,.2))" iconBorder="rgba(212,166,58,.4)" />
            </div>
          </Section>

          {/* ================= WALLET ================= */}
          <Section title="Wallet Summary" sub="Working balance and recent activity.">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <StatTile value={`$${incomeWallet.toLocaleString()}`} label="WORKING WALLET" color={C.gold400} />
              <StatTile value={`$${tradingWallet.toLocaleString()}`} label="TRADE WALLET BALANCE" />
              <StatTile value={`$${depositWallet.toLocaleString()}`} label="DEPOSIT WALLET" color={C.blue500} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <WithdrawalTile value={`$${incomeWithdrawal.toLocaleString()}`} label="WORKING WITHDRAWAL" />
              <WithdrawalTile value={`$${tradingWithdrawal.toLocaleString()}`} label="TRADE PROFIT WITHDRAWAL" />
            </div>
          </Section>

          {/* ================= DISCLAIMER ================= */}
          <div className="rounded-2xl p-5 text-[11px] leading-[1.9] bg-[rgba(15,45,100,.035)] border border-[rgba(15,45,100,.13)] text-[#4c5b7c]">
            <b className="text-[#0e2a5c]">Risk notice —</b> Trading involves market risk. Past performance does not guarantee future results. AI strategies are designed to assist trading decisions and risk management, not to eliminate risk. Actual results depend on market conditions and strategy performance. All figures on this dashboard are demo/historical placeholders pending live backend connection.
          </div>
        </div>
      </main>
    </div>
  )
}

/* ============================================================
   Subcomponents
============================================================ */
function Section({ title, sub, tagText, children }) {
  return (
    <section className="mb-11">
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4.5">
        <div>
          <h2 className="font-semibold text-[19px]" style={{ fontFamily: DISPLAY_FONT }}>{title}</h2>
          {sub && <p className="text-[12.5px] text-[#4c5b7c] mt-1">{sub}</p>}
        </div>
        {tagText && <span className={TAG_CLS}>{tagText}</span>}
      </div>
      {children}
    </section>
  )
}

function StatMini({ label, value, color }) {
  return (
    <div>
      <span className="block text-[10.5px] text-[#4c5b7c]">{label}</span>
      <b className="text-[15px]" style={{ fontFamily: DISPLAY_FONT, color: color || C.ink }}>{value}</b>
    </div>
  )
}

function RankDetailItem({ label, value, color }) {
  return (
    <div>
      <span className="block text-[10px] tracking-[.05em] text-[#4c5b7c] mb-1">{label}</span>
      <b className="text-[15px]" style={{ fontFamily: DISPLAY_FONT, color: color || C.ink }}>{value}</b>
    </div>
  )
}

function MiniStat({ value, label }) {
  return (
    <div className="text-center">
      <b className="block text-[22px] text-[#e0ac2e]" style={{ fontFamily: DISPLAY_FONT }}>{value}</b>
      <span className="text-[10px] text-[#4c5b7c]">{label}</span>
    </div>
  )
}

function InvestmentCard({ title, type, investment, start, profit, limit, cycleDay, barsOn }) {
  return (
    <div className={`${CARD_CLS} p-6`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-base" style={{ fontFamily: DISPLAY_FONT }}>{title}</h4>
          <div className="text-[10.5px] tracking-[.05em] text-[#e0ac2e] mt-0.5">{type}</div>
        </div>
        <span className="font-bold rounded-full text-[10px] tracking-[.04em] px-[11px] py-1 bg-[rgba(47,191,122,.12)] text-[#2fbf7a]">
          ACTIVE
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3.5 mb-3.5">
        <MiniField label="Investment" value={investment} />
        <MiniField label="Start Date" value={start} />
        <MiniField label="Accumulated Profit" value={profit} color={C.green} />
        <MiniField label="Eligible Limit" value={limit} />
      </div>
      <span className="text-[10px] text-[#4c5b7c]">Cycle progress — Day {cycleDay} / 100</span>
      <div className="rounded-full overflow-hidden h-2 mt-1.5 bg-[rgba(15,45,100,.08)]">
        <div
          className="h-full rounded-full transition-[width] duration-[1.4s]"
          style={{
            width: barsOn ? `${cycleDay}%` : "0%",
            background: `linear-gradient(90deg, ${C.gold500}, ${C.gold400})`,
          }}
        />
      </div>
    </div>
  )
}

function MiniField({ label, value, color }) {
  return (
    <div>
      <span className="block text-[10px] text-[#4c5b7c]">{label}</span>
      <b className="text-[14.5px]" style={{ fontFamily: DISPLAY_FONT, color: color || C.ink }}>{value}</b>
    </div>
  )
}

function StatTile({ value, label, color }) {
  return (
    <div className={`${CARD_CLS} text-center p-6`}>
      <div className="font-bold text-2xl" style={{ fontFamily: DISPLAY_FONT, color: color || C.ink }}>{value}</div>
      <div className="text-[10.5px] tracking-[.05em] text-[#4c5b7c] mt-1.5">{label}</div>
    </div>
  )
}

function WithdrawalTile({ value, label }) {
  return (
    <div className={`${CARD_CLS} flex items-center justify-between px-[22px] py-[18px]`}>
      <div>
        <div className="font-bold text-xl" style={{ fontFamily: DISPLAY_FONT }}>{value}</div>
        <div className="text-[10.5px] tracking-[.05em] text-[#4c5b7c] mt-1">{label}</div>
      </div>
      <div className="rounded-xl flex items-center justify-center w-10 h-10 bg-[rgba(47,107,255,.1)] border border-[rgba(91,139,255,.22)]">
        <Repeat size={17} className="text-[#2f6bff]" />
      </div>
    </div>
  )
}

function TrItem({ label, value }) {
  return (
    <div className="rounded-2xl p-4 bg-[rgba(15,45,100,.035)] border border-[rgba(15,45,100,.13)]">
      <span className="text-[10px] tracking-[.05em] text-[#4c5b7c]">{label}</span>
      <b className="block text-[17px] mt-1" style={{ fontFamily: DISPLAY_FONT }}>{value}</b>
    </div>
  )
}

function ClubCard({ icon: Icon, name, reward, strong, other, matching, next, iconBg, iconBorder }) {
  return (
    <div className={`${CARD_CLS} p-6`}>
      <div
        className="rounded-xl flex items-center justify-center w-11 h-11 mb-3.5"
        style={{ background: iconBg, border: `1px solid ${iconBorder}` }}
      >
        <Icon size={22} className="text-[#e0ac2e]" />
      </div>
      <div className="text-lg" style={{ fontFamily: DISPLAY_FONT }}>{name}</div>
      <div className="font-semibold text-xs text-[#e0ac2e] mb-4">{reward}</div>
      <div className="grid grid-cols-2 gap-3">
        <MiniField label="Strong Business" value={strong} />
        <MiniField label="Other Business" value={other} />
        <MiniField label="Matching Business" value={matching} />
        <MiniField label="Next Month" value={next} />
      </div>
    </div>
  )
}