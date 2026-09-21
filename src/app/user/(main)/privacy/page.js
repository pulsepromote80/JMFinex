import Image from "next/image";
import Link from "next/link";

const navigation = [
  ["About", "/user#about"],
  ["Services", "/user#services"],
  ["Platform", "/user#platform"],
  ["Technology", "/user#technology"],
  ["Heatmap", "/user#heatmap"],
  ["Vision", "/user#vision"],
  ["FAQ", "/user#faq"],
  ["Course", "/user/course"],
];

const policySections = [
  {
    title: "1. Information We Collect",
    paragraphs: [
      "When you create an account, contact us, or use JMFinex services, we may collect information such as your name, email address, phone number, account credentials, country, and other details you choose to provide.",
      "When you use the platform, we may collect technical and usage information including device type, browser, IP address, pages viewed, feature interactions, referral source, and session timestamps. We use this information to operate and improve the service.",
    ],
  },
  {
    title: "2. How We Use Information",
    paragraphs: [
      "We use information to create and maintain accounts, provide platform features, deliver academic and support content, respond to enquiries, personalize the user experience, and communicate important service updates.",
      "We may also use aggregated or de-identified information to understand market interest, monitor performance, improve security, and develop new tools. We do not use this information to make guaranteed trading or investment promises.",
    ],
  },
  {
    title: "3. Cookies and Similar Technologies",
    paragraphs: [
      "JMFinex may use cookies, local storage, pixels, and similar technologies to keep you signed in, remember preferences, understand page performance, and protect the platform from abuse.",
      "You can control cookies through your browser settings. Some essential features may not work correctly if required cookies or storage are disabled.",
    ],
  },
  {
    title: "4. Trading, Wallet, and Connected Services",
    paragraphs: [
      "If you use trading tools, market data, wallet features, AI assistants, or connected third-party services, we process the information needed to provide those features. This may include account identifiers, selected symbols, preferences, transaction or wallet details, and activity logs.",
      "Blockchain transactions and public wallet addresses may be visible on public networks. Please do not submit private keys, seed phrases, or passwords through JMFinex forms or support channels.",
    ],
  },
  {
    title: "5. When We Share Information",
    paragraphs: [
      "We may share information with service providers that help us host, secure, analyze, support, and operate the platform. These providers may process information only for the services they provide to us.",
      "We may also disclose information when required by law, to protect users and the platform, investigate fraud or security incidents, or support a merger, acquisition, or transfer of business assets. We do not sell personal information as a business practice.",
    ],
  },
  {
    title: "6. Data Security and Retention",
    paragraphs: [
      "We use reasonable administrative, technical, and organizational safeguards designed to protect personal information. No online service can guarantee absolute security, so please use a strong unique password and notify us promptly about suspicious activity.",
      "We keep information for as long as necessary to provide services, meet legal and accounting requirements, resolve disputes, enforce agreements, and maintain security records. Retention periods vary by the type and purpose of the information.",
    ],
  },
  {
    title: "7. Your Choices and Rights",
    paragraphs: [
      "Depending on where you live, you may have rights to access, correct, delete, restrict, or receive a copy of your personal information. You may also object to certain processing or withdraw consent where processing is based on consent.",
      "To make a privacy request, contact us using the details below. We may need to verify your identity before completing a request, and some information may need to be retained to meet legal obligations.",
    ],
  },
  {
    title: "8. Children’s Privacy",
    paragraphs: [
      "JMFinex is intended for adults and is not directed to children. We do not knowingly collect personal information from children. If you believe a child has provided information to us, please contact us so we can review and remove it where appropriate.",
    ],
  },
  {
    title: "9. Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy when our services, legal requirements, or data practices change. The updated version will be posted on this page with a revised effective date. Continued use of the service after an update means the updated policy applies to your use of JMFinex.",
    ],
  },
];

export const metadata = {
  title: "Privacy Policy | JMFINEX",
  description: "Learn how JMFINEX collects, uses, protects, and manages information across its trading technology platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#04060B] text-[#EEF3F8]">
      <video
        autoPlay muted loop playsInline id="bg-video"
        className="fixed top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -z-[3] -translate-x-1/2 -translate-y-1/2 object-cover [filter:brightness(0.28)_contrast(1.2)_saturate(1.3)_hue-rotate(180deg)]"
      >
        <source src="https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4" type="video/mp4" />
      </video>

      <div className="fixed inset-0 -z-[2] pointer-events-none [background:radial-gradient(ellipse_at_top,rgba(59,158,255,0.10),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(240,180,41,0.06),transparent_60%),linear-gradient(180deg,rgba(8,11,24,0.85),rgba(5,8,18,0.95))]" />

      <div className="fixed inset-0 -z-[1] pointer-events-none opacity-[0.035] [background-image:url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_width=%27120%27_height=%27120%27%3E%3Cfilter_id=%27n%27%3E%3CfeTurbulence_type=%27fractalNoise%27_baseFrequency=%270.9%27_numOctaves=%272%27_stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect_width=%27100%25%27_height=%27100%25%27_filter=%27url(%23n)%27/%3E%3C/svg%3E')]" />

      <div className="fixed inset-0 z-0 pointer-events-none [background-image:linear-gradient(rgba(59,158,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,158,255,0.05)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black_20%,transparent_75%)]" />

      <div id="cursor-glow" className="fixed top-0 left-0 w-[520px] h-[520px] rounded-full pointer-events-none z-[2] opacity-0 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 [background:radial-gradient(circle,rgba(59,158,255,0.12)_0%,rgba(59,158,255,0)_70%)]" />

      <header className="relative z-10 border-b border-white/[0.08] bg-[#04060B]/[0.94] py-[18px] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 sm:px-8">
          <Link href="/user" aria-label="JMFineX home" className="block">
            <Image src="/logo.png" alt="JMFinex Logo" width={240} height={123} className="block h-auto w-[240px] max-w-full" priority />
          </Link>
          <nav className="hidden items-center gap-8 min-[901px]:flex" aria-label="Primary navigation">
            {navigation.map(([label, href]) => (
              <Link key={label} href={href} className="relative -mx-2 -my-1 rounded-md px-2 py-1 text-[0.88rem] font-medium text-[#8B98B0] transition-colors duration-250 hover:bg-[#3B9EFF]/[0.08] hover:text-[#EEF3F8] after:absolute after:-bottom-0.5 after:left-2 after:h-px after:w-0 after:bg-gradient-to-r after:from-[#3B9EFF] after:to-[#F0B429] after:transition-[width] after:duration-350 hover:after:w-[calc(100%-1rem)]">{label}</Link>
            ))}
          </nav>
          <div className="hidden items-center gap-3.5 min-[901px]:flex">
            <Link href="/user/register" className="rounded-full border border-white/[0.22] bg-white/[0.02] px-6 py-[11px] text-[0.86rem] font-semibold text-[#EEF3F8] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F0B429] hover:bg-[#F0B429]/[0.14]">Explore Platform</Link>
            <Link href="/user/login" className="rounded-full bg-gradient-to-br from-[#F0B429] to-[#D4A017] px-6 py-[11px] text-[0.86rem] font-semibold text-[#0A0E1A] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(240,180,41,.55)]">Get Signup</Link>
          </div>
          <Link href="/user" aria-label="Return to JMFineX homepage" className="text-2xl text-[#EEF3F8] min-[901px]:hidden">☰</Link>
        </div>
      </header>

      <div className="relative z-[1] mx-auto max-w-[980px] px-5 py-20 sm:px-8 lg:py-28">
        <section className="mb-14 border-b border-white/[0.1] pb-10">
          {/* <Link href="/user" className="text-sm text-[#8B98B0] transition-colors hover:text-[#F0B429]">← Back to JMFinex</Link> */}
          <span className="mt-10 inline-flex items-center gap-2.5 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[#3B9EFF] before:h-px before:w-[22px] before:bg-[#3B9EFF]">Legal information</span>
          <h1 className="mt-5 font-display text-white font-semibold leading-[1.04] tracking-[-0.04em]">Privacy <span className="bg-gradient-to-br from-[#3B9EFF] via-[#8BC7FF] to-[#F0B429] bg-clip-text text-transparent">Policy</span></h1>
          <p className="mt-6 max-w-[700px] text-[1.05rem] leading-[1.75] text-[#8B98B0]">This policy explains how JMFinex collects, uses, protects, and manages information when you visit our website or use our trading technology, education, analytics, and account services.</p>
          <p className="mt-5 font-mono text-[0.7rem] uppercase tracking-[0.15em] text-[#5D6B85]">Effective date: September 18, 2026</p>
        </section>

        <div className="space-y-5">
          {policySections.map(({ title, paragraphs }) => (
            <section key={title} className="rounded-[18px] border border-white/[0.1] bg-[#0D1422]/[0.65] p-6 sm:p-8">
              <h2 className="font-display text-[1.35rem] font-semibold text-[#DAA41B]">{title}</h2>
              <div className="mt-4 space-y-3 text-[0.94rem] leading-[1.75] text-[#8B98B0]">
                {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          ))}
        </div>

       

        <p className="mt-10 text-[0.78rem] leading-[1.7] text-[#5D6B85]">This page provides general information about our data practices and should be reviewed with qualified legal counsel before publication as a final jurisdiction-specific privacy notice.</p>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-[rgba(120,160,220,0.16)] py-[70px] pb-[30px] bg-[#070C17]">
        <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5">
          <div className="grid gap-10 pb-[50px] [grid-template-columns:1.4fr_1fr_1fr_1fr] max-[820px]:!grid-cols-2 max-[520px]:!grid-cols-1">
            <div>
              <Link href="/user" className="flex items-center gap-2.5 font-display text-[1.35rem] font-bold -tracking-[0.01em]">
                <Image src="/logo.png" alt="JMFinex Logo" width={240} height={123} className="w-[240px] max-w-full block" />
              </Link>
              <p className="text-[#8B98B0] text-[0.86rem] leading-[1.6] mt-4 max-w-[280px]">
                An AI-powered trading technology ecosystem for global forex and digital asset markets.
              </p>
              <div className="flex gap-3 mt-[22px]">
                <a href="#" aria-label="X" className="w-9 h-9 rounded-full border border-[rgba(120,160,220,0.16)] flex items-center justify-center transition-[border-color,background] duration-300 hover:border-[#F0B429] hover:bg-[#F0B429]/[0.14]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px] text-[#8B98B0]"><path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.9L4.5 22H1.4l8.2-9.4L1 2h7l4.9 6.4L18.9 2Z" /></svg>
                </a>
                <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-full border border-[rgba(120,160,220,0.16)] flex items-center justify-center transition-[border-color,background] duration-300 hover:border-[#F0B429] hover:bg-[#F0B429]/[0.14]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px] text-[#8B98B0]"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2 3.77-2 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9Z" /></svg>
                </a>
                <a href="#" aria-label="Telegram" className="w-9 h-9 rounded-full border border-[rgba(120,160,220,0.16)] flex items-center justify-center transition-[border-color,background] duration-300 hover:border-[#F0B429] hover:bg-[#F0B429]/[0.14]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px] text-[#8B98B0]"><path d="M21.9 3.5 2.6 11c-1 .4-1 1.7.1 2l4.7 1.5 1.8 5.6c.3.9 1.4 1.1 2 .4l2.6-2.7 4.8 3.6c.9.7 2.2.2 2.4-.9l3-16.4c.2-1.2-1-2.1-2.1-1.6Z" /></svg>
                </a>
              </div>
            </div>
            <div>
              <h5 className="font-mono text-[0.72rem] tracking-[0.12em] uppercase text-[#5D6B85] mb-[18px]">Platform</h5>
              {[["/user#why", "Why JMFinex"], ["/user#technology", "Technology"], ["/user#global", "Global Network"], ["/user#how", "How It Works"]].map(([href, label]) => (
                <Link key={label} href={href} className="block text-[#8B98B0] text-[0.88rem] mb-3 transition-colors duration-250 hover:text-[#F0B429]">{label}</Link>
              ))}
            </div>
            <div>
              <h5 className="font-mono text-[0.72rem] tracking-[0.12em] uppercase text-[#5D6B85] mb-[18px]">Company</h5>
              {[["/user#vision", "Vision"], ["/user#faq", "FAQ"], ["#", "Contact"], ["#", "Careers"]].map(([href, label], i) => (
                <Link key={label + i} href={href} className="block text-[#8B98B0] text-[0.88rem] mb-3 transition-colors duration-250 hover:text-[#F0B429]">{label}</Link>
              ))}
            </div>
            <div>
              <h5 className="font-mono text-[0.72rem] tracking-[0.12em] uppercase text-[#5D6B85] mb-[18px]">Address</h5>
              <p className="text-[#8B98B0] text-[0.88rem] leading-[1.6] mb-5">
                <strong>Registered Office:</strong> 838, Castries, Rodney Court Building, Rodney Bay, St. Lucia
              </p>
              <p className="text-[#8B98B0] text-[0.88rem] leading-[1.6]">
                <strong>Corporate Presence:</strong> United States &amp; St. Lucia
              </p>
            </div>
          </div>
          <div className="text-[0.78rem] text-[#5D6B85] leading-[1.6] max-w-[900px] mt-[26px] pt-[26px] border-t border-[rgba(120,160,220,0.16)]">
            <strong className="text-[#8B98B0]">Risk Disclosure:</strong> Trading forex and digital assets involves substantial risk and may not be suitable for all users. Past performance is not indicative of future results, and no returns or outcomes are guaranteed. Figures and charts on this site are illustrative and for demonstration purposes only. Placeholder content — replace with verified regulatory and legal information before launch.
          </div>
          <div className="flex justify-between items-center flex-wrap gap-4 border-t border-[rgba(120,160,220,0.16)] pt-[26px] mt-[30px]">
            <p className="text-[0.78rem] text-[#5D6B85]">© 2026 JMFinex. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/user/termcondition" className="text-[0.78rem] text-[#5D6B85] hover:text-[#F0B429] transition-colors duration-250">Terms & Conditions</Link>
              <Link href="/user/privacy" className="text-[0.78rem] text-[#5D6B85] hover:text-[#F0B429] transition-colors duration-250">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}