"use client";

import { useState, useEffect } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [educationDropdown, setEducationDropdown] = useState(false);

  const navItems = ["about", "services", "platform", "technology", "Learn & Trade", "vision", "faq"];

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* ============ HEADER ============ */}
      <header id="siteHeader" className="fixed top-0 left-0 right-0 z-50 py-[18px] border-b border-[rgba(120,160,220,0.16)] bg-[#080B18]/90 backdrop-blur-[12px] transition-[padding,background,border-color] duration-400">
        <div className="max-w-[1240px] mx-auto px-8 max-[720px]:px-5 flex items-center justify-between">
          <a href="/user" aria-label="JMFinex home" className="flex items-center gap-2.5 font-display text-[1.35rem] font-bold -tracking-[0.01em]">
            <img src="/logo.png" alt="JMFinex Logo" className="w-[240px] max-w-full block" />
          </a>

          <nav className="hidden max-[900px]:!hidden [@media(min-width:901px)]:flex items-center gap-[38px]">
            {navItems.map((id) => (
              id === "Learn & Trade" ? (
                <div
                  key={id}
                  className="relative"
                  onMouseEnter={() => setEducationDropdown(true)}
                  onMouseLeave={() => setEducationDropdown(false)}
                >
                  <div
                    className="relative text-[0.88rem] font-medium text-[#8B98B0] transition-colors duration-250 hover:text-[#EEF2F8] capitalize flex items-center gap-1 cursor-pointer after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-0 after:h-px after:[background:linear-gradient(90deg,#3B9EFF,#F0B429)] after:transition-[width] after:duration-350 hover:after:w-full"
                  >
                    {id}
                    <svg className="w-3 h-3 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {educationDropdown && (
                    <div className="absolute top-full left-0 mt-3 w-48 bg-[#050812] border border-[rgba(120,160,220,0.2)] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-50 overflow-hidden">
                      
                      <a
                        href="/user/education"
                        className="block px-5 py-3 text-[0.85rem] text-[#8B98B0] hover:text-[#EEF2F8] hover:bg-[rgba(59,158,255,0.12)] transition-colors border-b border-[rgba(120,160,220,0.1)]"
                      >
                        Education
                      </a>
                      <a
                        href="/user/course"
                        className="block px-5 py-3 text-[0.85rem] text-[#8B98B0] hover:text-[#EEF2F8] hover:bg-[rgba(59,158,255,0.12)] transition-colors border-b border-[rgba(120,160,220,0.1)]"
                      >
                        Academy
                      </a>
                      <a
                        href="/user/selftrade"
                        className="block px-5 py-3 text-[0.85rem] text-[#8B98B0] hover:text-[#EEF2F8] hover:bg-[rgba(59,158,255,0.12)] transition-colors"
                      >
                        Self Trade
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={id}
                  href={`/user#${id.toLowerCase()}`}
                  className="relative text-[0.88rem] font-medium text-[#8B98B0] transition-colors duration-250 hover:text-[#EEF2F8] after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-0 after:h-px after:[background:linear-gradient(90deg,#3B9EFF,#F0B429)] after:transition-[width] after:duration-350 hover:after:w-full capitalize"
                >
                  {id === "faq" ? "FAQ" : id}
                </a>
              )
            ))}
          </nav>

          <div className="hidden min-[901px]:flex items-center gap-3.5">
            <a href="/user/register"
              className="relative inline-flex items-center justify-center gap-2.5 rounded-full font-semibold text-[0.86rem] cursor-pointer border border-white/[0.22] bg-white/[0.02] overflow-hidden whitespace-nowrap py-[11px] px-6 text-[#EEF2F8] transition-transform duration-350 hover:border-[#F0B429] hover:bg-[#F0B429]/[0.14] hover:-translate-y-0.5"
            >
              <span className="relative z-[2]">Explore Platform</span>
            </a>
            <a href="/user/login"
              className="group relative inline-flex items-center justify-center gap-2.5 rounded-full font-semibold text-[0.86rem] cursor-pointer border border-transparent overflow-hidden whitespace-nowrap py-[11px] px-6 text-[#0A0E1A] [background:linear-gradient(135deg,#F0B429_0%,#D4A017_100%)] transition-transform duration-350 hover:-translate-y-0.5 hover:[box-shadow:0_12px_32px_-8px_rgba(240,180,41,.55),0_0_24px_-4px_rgba(255,215,0,.4)] before:content-[''] before:absolute before:top-0 before:-left-[75%] before:w-1/2 before:h-full before:z-[1] before:[background:linear-gradient(115deg,transparent,rgba(255,240,200,0.6),transparent)] before:[transform:skewX(-20deg)] before:transition-[left] before:duration-700 hover:before:left-[130%]"
            >
              <span className="relative z-[2]">Get SignIn</span>
            </a>
          </div>

          <div
            className="min-[901px]:hidden flex flex-col gap-[5px] cursor-pointer z-[60] w-[26px]"
            id="burger" aria-label="Open menu" aria-expanded={mobileMenuOpen} role="button" tabIndex={0}
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setMobileMenuOpen((isOpen) => !isOpen);
              }
            }}
          >
            <span className={`h-0.5 w-full bg-[#EEF2F8] rounded-[2px] transition-transform duration-350 ${mobileMenuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`h-0.5 w-full bg-[#EEF2F8] rounded-[2px] transition-opacity duration-350 ${mobileMenuOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`h-0.5 w-full bg-[#EEF2F8] rounded-[2px] transition-transform duration-350 ${mobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </div>
        </div>
      </header>

      {/* ============ MOBILE MENU ============ */}
      <div
        className={`mobile-menu fixed inset-0 z-[55] flex flex-col items-center justify-center gap-[34px] [background:rgba(8,11,24,0.98)] backdrop-blur-[20px] transition-[opacity,transform,visibility] duration-400 ${mobileMenuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-3"}`}
        id="mobileMenu"
      >
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center text-white hover:text-[#F0B429] transition-colors duration-300 bg-white/5 rounded-full hover:bg-white/10"
          aria-label="Close menu"
          style={{ color: "#ffffff" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {navItems.map((id) => (
          id === "Learn & Trade" ? (
            <div key={id} className="flex flex-col items-center gap-3">
              <span
                className={`mobile-menu-link font-display text-[1.6rem] transition-[opacity,transform] duration-500 capitalize ${mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ color: "#ffffff" }}
              >
                {id}
              </span>
              <div className="flex flex-col gap-2 pl-6 border-l-2 border-[rgba(59,158,255,0.3)]">
                <a
                  href="/user/education"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[1.1rem] text-[#8B98B0] hover:text-[#F0B429] transition-colors text-left"
                >
                  Education
                </a>
                <a
                  href="/user/course"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[1.1rem] text-[#8B98B0] hover:text-[#F0B429] transition-colors text-left"
                >
                  Academy
                </a>
                <a
                  href="/user/selftrade"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[1.1rem] text-[#8B98B0] hover:text-[#F0B429] transition-colors text-left"
                >
                  Self Trade
                </a>
              </div>
            </div>
          ) : (
            <a
              key={id}
              href={`/user#${id.toLowerCase()}`}
              onClick={() => setMobileMenuOpen(false)}
              className={`mobile-menu-link font-display text-[1.6rem] transition-[opacity,transform] duration-500 capitalize ${mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ color: "#ffffff" }}
            >
              {id === "faq" ? "FAQ" : id}
            </a>
          )
        ))}
        <a
          href="/user/login"
          onClick={() => setMobileMenuOpen(false)}
          className="mobile-menu-cta mt-2.5 relative inline-flex items-center justify-center gap-2.5 rounded-full font-semibold py-[15px] px-[30px] text-[0.94rem] [background:linear-gradient(135deg,#F0B429_0%,#D4A017_100%)]"
          style={{ color: "#0A0E1A" }}
        >
          <span style={{ color: "#0A0E1A" }}>Get SignIn</span>
        </a>
      </div>
    </>
  );
}