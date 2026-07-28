"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/listings", label: "İlanlar" },
  { href: "/how-it-works", label: "Yönetici Özeti" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-white/5 bg-[#0B2545]/70 backdrop-blur-md">
      <div className="mx-auto flex h-[60px] max-w-[1200px] items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex flex-shrink-0 items-center gap-2.5">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#D4A054]"
          >
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-display text-lg font-bold tracking-wide text-[#D4A054]">
            BITBIT
          </span>
          <span className="hidden font-mono text-[11px] font-semibold uppercase tracking-widest text-[#D4A054] drop-shadow-[0_0_6px_rgba(212,160,84,0.6)] sm:inline">
            Smart Transfer System
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-3 sm:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-[11px] font-medium transition-colors sm:text-[13px] ${
                pathname === link.href
                  ? "text-[#D4A054]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-[#D4A054]" />
              )}
            </Link>
          ))}

          {/* Giriş Yap */}
          <button className="ml-1 flex flex-shrink-0 items-center gap-2 rounded-lg border border-[#D4A054]/40 px-2.5 py-1.5 text-[13px] font-medium text-[#D4A054] transition-colors hover:bg-[#D4A054]/10 sm:ml-2 sm:px-4">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="hidden sm:inline">Giriş Yap</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
