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

const termsSections = [
  {
    title: "1. Acceptance of Terms",
    paragraphs: [
      "By accessing or using the JMFinex website, platform, educational resources, trading tools, or related services, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you should not use the website or services.",
      "These terms apply to all visitors, registered users, subscribers, clients, and any person accessing JMFinex content or functionality. We may update these terms at any time, and continued use of the platform after an update constitutes your acceptance of the revised terms.",
    ],
  },
  {
    title: "2. Eligibility and Account Registration",
    paragraphs: [
      "You must be at least 18 years of age, or the legal age of majority in your jurisdiction, to use JMFinex services. You represent that you are legally capable of entering into binding agreements and that all information you submit is accurate and complete.",
      "When creating an account, you agree to provide truthful information, maintain the confidentiality of your login credentials, and notify us immediately if you suspect unauthorized access or misuse of your account. JMFinex may suspend or terminate access if we believe your information is inaccurate, incomplete, or used in violation of these terms.",
    ],
  },
  {
    title: "3. Use of the Website and Services",
    paragraphs: [
      "JMFinex provides educational content, trading tools, market information, analytics, alerts, account access, and related digital services for informational and educational purposes. These services may evolve over time, and access may vary depending on your subscription plan, region, eligibility, or account status.",
      "You agree to use the website only for lawful purposes. You may not use the platform to engage in fraud, impersonation, hacking, malicious activity, data extraction, spam, abusive behavior, or any conduct that disrupts the operation, security, or integrity of JMFinex services.",
    ],
  },
  {
    title: "4. Trading and Market Risk",
    paragraphs: [
      "Trading in forex, digital assets, indices, commodities, or other financial markets involves significant risk, including the risk of loss of capital. JMFinex does not guarantee profits, returns, or specific outcomes from any strategy, product, feature, education resource, or signal provided on the platform.",
      "Any performance examples, charts, screenshots, case studies, or educational material are for illustrative purposes only. They do not constitute investment advice, financial advice, or a promise of future performance. You are solely responsible for evaluating the risks involved before making financial decisions.",
    ],
  },
  {
    title: "5. Pricing, Subscriptions, and Payments",
    paragraphs: [
      "Certain features, courses, tools, or levels of access may require a paid subscription or one-time payment. Fees, billing schedules, and subscription details will be presented at the time of purchase and may be updated from time to time.",
      "By subscribing or purchasing access, you agree to pay all applicable fees and taxes in accordance with the selected billing method. JMFinex may suspend or cancel access for late or failed payments, and any renewal or automatic billing will be processed according to the plan selected at the time of purchase.",
    ],
  },
  {
    title: "6. Intellectual Property Rights",
    paragraphs: [
      "All content on the JMFinex website, including but not limited to text, graphics, software, audio, video, brand assets, dashboards, educational content, logos, designs, trading indicators, interfaces, and source code, is owned by JMFinex or its licensors and is protected by intellectual property laws.",
      "You may access and use the site for personal, non-commercial purposes only. You may not reproduce, modify, distribute, resell, reverse engineer, republish, or commercially exploit JMFinex content without prior written permission.",
    ],
  },
  {
    title: "7. Third-Party Links and Integrations",
    paragraphs: [
      "The platform may contain links to third-party websites, educational partners, payment providers, analytics services, wallets, or external tools. These websites are not controlled by JMFinex, and we are not responsible for their content, security practices, privacy policies, or business operations.",
      "If you access a third-party service through JMFinex, your use of that service is subject to the provider's own terms and conditions. JMFinex does not guarantee the availability, accuracy, or reliability of any external platform or partner service.",
    ],
  },
  {
    title: "8. Privacy and Data Protection",
    paragraphs: [
      "JMFinex processes personal and technical information in accordance with our Privacy Policy. By using the website, you consent to the collection, processing, storage, and use of your information in line with the Privacy Policy and applicable laws.",
      "We use reasonable administrative, technical, and organizational measures to protect user data, but no system is completely secure. You are responsible for maintaining the security of your own device, login details, and communications.",
    ],
  },
  {
    title: "9. Service Availability and Modifications",
    paragraphs: [
      "JMFinex aims to keep the website and services available and operational, but we do not guarantee uninterrupted access, error-free operation, or the availability of any specific feature at all times. Maintenance, outages, updates, and technical issues may temporarily affect functionality.",
      "We reserve the right to modify, suspend, discontinue, or replace any part of the website or service at our discretion, with or without notice, in order to improve performance, security, compliance, or user experience.",
    ],
  },
  {
    title: "10. Termination and Suspension",
    paragraphs: [
      "JMFinex may suspend, restrict, or terminate your access to the website or services if you breach these terms, misuse the platform, violate legal obligations, or engage in conduct that damages the platform, its users, or its reputation.",
      "Upon termination, your right to use the platform ends immediately, and any obligations to pay fees or comply with applicable laws remain in effect. Certain sections of these terms may survive termination to the extent necessary to enforce rights or clarify responsibilities.",
    ],
  },
  {
    title: "11. Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by law, JMFinex, its affiliates, officers, employees, agents, and partners shall not be liable for indirect, incidental, consequential, or special damages arising from your use of the website or services, including loss of profits, business interruption, data loss, or reputational harm.",
      "JMFinex's total liability for any claim arising under these terms shall not exceed the total fees paid by you to JMFinex in the 12 months preceding the event giving rise to the claim, or the amount actually paid for the specific service in question, whichever is lower.",
    ],
  },
  {
    title: "12. Disclaimers and Warranties",
    paragraphs: [
      "The website and services are provided on an 'as is' and 'as available' basis. JMFinex makes no warranties, express or implied, regarding merchantability, fitness for a particular purpose, accuracy, completeness, availability, cybersecurity, or uninterrupted operation of the platform.",
      "We do not warrant that the website will meet your expectations, that all content is free from errors, or that any educational, analytical, or market-related information will be complete or current at all times.",
    ],
  },
  {
    title: "13. Governing Law and Dispute Resolution",
    paragraphs: [
      "These Terms & Conditions are governed by the laws of the jurisdiction in which JMFinex operates, without regard to conflict of law principles. Any dispute arising out of or relating to these terms shall be subject to the exclusive jurisdiction of the competent courts in that jurisdiction, unless a different agreement or legal requirement applies.",
      "Where required by law, either party may seek remedies available under applicable consumer protection or regulatory frameworks. Nothing in these terms waives any rights that cannot lawfully be waived under applicable law.",
    ],
  },
  {
    title: "14. Changes to the Terms",
    paragraphs: [
      "JMFinex may revise these Terms & Conditions from time to time to reflect changes in our services, legal obligations, or business practices. Any update will be posted on this page with a revised effective date, and your continued use of the website after publication indicates acceptance of the revised terms.",
      "If an update significantly changes the terms or materially affects your rights, we may notify you through the site or by direct communication where appropriate and feasible.",
    ],
  },
];

export const metadata = {
  title: "Terms & Conditions | JMFINEX",
  description: "Review the JMFINEX website terms and conditions covering account use, trading risk, subscriptions, policies, and legal responsibilities.",
};

export default function TermsAndConditionsPage() {
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
              <Link key={label} href={href} className="relative -mx-2 -my-1 rounded-md px-2 py-1 text-[0.88rem] font-medium text-[#8B98B0] transition-colors duration-250 hover:bg-[#3B9EFF]/[0.08] hover:text-[#EEF3F8] after:absolute after:-bottom-0.5 after:left-2 after:h-px after:w-0 after:bg-gradient-to-r after:from-[#3B9EFF] after:to-[#F0B429] after:transition-[width] after:duration-350 hover:after:w-[calc(100%-1rem)]">
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3.5 min-[901px]:flex">
            <Link href="/user/register" className="rounded-full border border-white/[0.22] bg-white/[0.02] px-6 py-[11px] text-[0.86rem] font-semibold text-[#EEF3F8] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F0B429] hover:bg-[#F0B429]/[0.14]">Explore Platform</Link>
            <Link href="/user/login" className="rounded-full bg-gradient-to-br from-[#F0B429] to-[#D4A017] px-6 py-[11px] text-[0.86rem] font-semibold text-[#0A0E1A] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(240,180,41,.55)]">Get SignIn</Link>
          </div>

          <Link href="/user" aria-label="Return to JMFineX homepage" className="text-2xl text-[#EEF3F8] min-[901px]:hidden">☰</Link>
        </div>
      </header>

      <div className="relative z-[1] mx-auto max-w-[980px] px-4 py-16 sm:px-6 md:px-8 lg:py-28">
        <section className="mb-10 border-b border-white/[0.1] pb-8 sm:mb-14 sm:pb-10">
          <span className="mt-6 inline-flex items-center gap-2.5 font-mono text-[0.64rem] uppercase tracking-[0.2em] text-[#3B9EFF] before:h-px before:w-[18px] before:bg-[#3B9EFF] sm:text-[0.7rem] sm:tracking-[0.22em] sm:before:w-[22px]">Legal terms</span>
          <h1 className="mt-5 max-w-[700px] font-display text-[clamp(2.4rem,8vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-white">
            Terms &amp; <span className="bg-gradient-to-br from-[#3B9EFF] via-[#8BC7FF] to-[#F0B429] bg-clip-text text-transparent">Conditions</span>
          </h1>
          <p className="mt-5 max-w-[700px] text-[0.96rem] leading-[1.75] text-[#8B98B0] sm:text-[1.05rem]">
            These Terms &amp; Conditions explain how JMFinex provides access to its website, products, tools, educational content, and trading technology services. Please read them carefully before using the platform.
          </p>
          <p className="mt-5 font-mono text-[0.62rem] uppercase tracking-[0.15em] text-[#5D6B85] sm:text-[0.7rem]">Effective date: September 18, 2026</p>
        </section>

        <div className="space-y-4 sm:space-y-5">
          {termsSections.map(({ title, paragraphs }) => (
            <section key={title} className="rounded-[18px] border border-white/[0.1] bg-[#0D1422]/[0.65] p-4 sm:p-6 md:p-8">
              <h2 className="font-display text-[1.1rem] font-semibold text-[#D9A41B] sm:text-[1.35rem]">{title}</h2>
              <div className="mt-4 space-y-3 text-[0.9rem] leading-[1.75] text-white sm:text-[0.94rem]">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        

        <p className="mt-8 text-[0.76rem] leading-[1.7] text-[#5D6B85] sm:mt-10 sm:text-[0.78rem]">
          Risk Disclosure: Trading forex and digital assets involves substantial risk and may not be suitable for all users. Past performance is not indicative of future results, and no returns or outcomes are guaranteed. Figures and charts on this site are illustrative and for demonstration purposes only. Placeholder content — replace with verified regulatory and legal information before launch.
        </p>
      </div>
    </main>
  );
}