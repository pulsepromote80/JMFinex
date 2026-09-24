export default function Footer() {
  return (
    <footer className="border-t border-[rgba(120,160,220,0.16)] py-[70px] pb-[30px] bg-[#070C17]">
      <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5">
        <div className="grid gap-10 pb-[50px] [grid-template-columns:1.4fr_1fr_1fr_1fr] max-[820px]:!grid-cols-2 max-[520px]:!grid-cols-1">
          <div>
            <a href="#top" className="flex items-center gap-2.5 font-display text-[1.35rem] font-bold -tracking-[0.01em]">
              <img src="/logo.png" alt="JMFinex Logo" className="w-[240px] max-w-full block" />
            </a>
            <p className="text-[#C9D2DC] text-[0.86rem] leading-[1.6] mt-4 max-w-[280px]">
              An AI-powered trading technology ecosystem for global forex and digital asset markets.
            </p>
            <div className="flex gap-3 mt-[22px]">
              <a href="#" aria-label="X" className="w-9 h-9 rounded-full border border-[rgba(120,160,220,0.16)] flex items-center justify-center transition-[border-color,background] duration-300 hover:border-[#F0B429] hover:bg-[#F0B429]/[0.14]">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px] text-[#C9D2DC]"><path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.9L4.5 22H1.4l8.2-9.4L1 2h7l4.9 6.4L18.9 2Z" /></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-full border border-[rgba(120,160,220,0.16)] flex items-center justify-center transition-[border-color,background] duration-300 hover:border-[#F0B429] hover:bg-[#F0B429]/[0.14]">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px] text-[#C9D2DC]"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2 3.77-2 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9Z" /></svg>
              </a>
              <a href="#" aria-label="Telegram" className="w-9 h-9 rounded-full border border-[rgba(120,160,220,0.16)] flex items-center justify-center transition-[border-color,background] duration-300 hover:border-[#F0B429] hover:bg-[#F0B429]/[0.14]">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px] text-[#C9D2DC]"><path d="M21.9 3.5 2.6 11c-1 .4-1 1.7.1 2l4.7 1.5 1.8 5.6c.3.9 1.4 1.1 2 .4l2.6-2.7 4.8 3.6c.9.7 2.2.2 2.4-.9l3-16.4c.2-1.2-1-2.1-2.1-1.6Z" /></svg>
              </a>
            </div>
          </div>
          <div>
            <h5 className="font-mono text-[0.72rem] tracking-[0.12em] uppercase text-[#EAC766] mb-[18px]">Platform</h5>
            {[["#why", "Why JMFinex"], ["#technology", "Technology"], ["#global", "Global Network"], ["#how", "How It Works"]].map(([href, label]) => (
              <a key={label} href={href} className="block text-[#C9D2DC] text-[0.88rem] mb-3 transition-colors duration-250 hover:text-[#F0B429]">{label}</a>
            ))}
          </div>
          <div>
            <h5 className="font-mono text-[0.72rem] tracking-[0.12em] uppercase text-[#EAC766] mb-[18px]">Company</h5>
            {[["#vision", "Vision"], ["#faq", "FAQ"], ["#", "Contact"], ["#", "Careers"]].map(([href, label], i) => (
              <a key={label + i} href={href} className="block text-[#C9D2DC] text-[0.88rem] mb-3 transition-colors duration-250 hover:text-[#F0B429]">{label}</a>
            ))}
          </div>
          <div>
            <h5 className="font-mono text-[0.72rem] tracking-[0.12em] uppercase text-[#EAC766] mb-[18px]">Address</h5>
            <p className="text-[#C9D2DC] text-[0.88rem] leading-[1.6] mb-5">
              <strong>Registered Office:</strong> 838, Castries, Rodney Court Building, Rodney Bay, St. Lucia
            </p>
            <p className="text-[#C9D2DC] text-[0.88rem] leading-[1.6]">
              <strong>Corporate Presence:</strong> United States &amp; St. Lucia
            </p>
          </div>
        </div>
        <div className="text-[0.78rem] text-[#9BA3B0] leading-[1.6] max-w-[900px] mt-[26px] pt-[26px] border-t border-[rgba(120,160,220,0.16)]">
          <strong className="text-[#C9D2DC]">Risk Disclosure:</strong> Trading forex and digital assets involves substantial risk and may not be suitable for all users. Past performance is not indicative of future results, and no returns or outcomes are guaranteed. Figures and charts on this site are illustrative and for demonstration purposes only. Placeholder content — replace with verified regulatory and legal information before launch.
        </div>
        <div className="flex justify-between items-center flex-wrap gap-4 border-t border-[rgba(120,160,220,0.16)] pt-[26px] mt-[30px]">
          <p className="text-[0.78rem] text-[#9BA3B0]">© 2026 JMFinex. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/user/termcondition" className="text-[0.78rem] text-[#9BA3B0] hover:text-[#F0B429] transition-colors duration-250">Terms & Conditions</a>
            <a href="/user/privacy" className="text-[0.78rem] text-[#9BA3B0] hover:text-[#F0B429] transition-colors duration-250">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}