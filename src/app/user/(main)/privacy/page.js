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

      

      <div className="relative z-[1] mx-auto max-w-[980px] px-5 sm:px-8 pt-[180px] sm:pt-[200px] pb-10">
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

     
    </main>
  );
}