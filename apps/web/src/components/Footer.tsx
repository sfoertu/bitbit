import Link from "next/link";

const platformLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/listings", label: "İlanlar" },
  { href: "/how-it-works", label: "Nasıl Çalışır?" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[#050E1F]">
      {/* Çok hafif radial gold glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[260px] w-[700px] -translate-x-1/2 rounded-full bg-[#D4A054]/[0.05] blur-[130px]" />

      <div className="relative mx-auto max-w-[1200px] px-6 pt-16 sm:pt-20">
        {/* Üst CTA bandı */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md sm:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-[280px] w-[280px] rounded-full bg-[#D4A054]/[0.08] blur-[110px]" />

          <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-[440px]">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4A054]/30 bg-[#D4A054]/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D4A054]">
                Seyahat Planın Değişti mi?
              </span>
              <h2 className="mt-4 font-display text-[24px] font-bold leading-[1.25] text-white sm:text-[28px]">
                Rezervasyonunun değerini
                <br />
                kaybetmesine izin verme.
              </h2>
              <p className="mt-3 text-[13.5px] leading-relaxed text-white/50">
                İlanları keşfet veya kullanamayacağın rezervasyonunu güvenli
                transfer sürecine hazırla.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-shrink-0 sm:flex-row">
              <Link
                href="/listings"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#D4A054] px-6 py-3 text-[14px] font-semibold text-[#0B2545] shadow-lg shadow-[#D4A054]/10 transition-all hover:bg-[#D4A054]/90 hover:shadow-[#D4A054]/20"
              >
                İlanları Keşfet
                <span className="font-mono text-[13px]" aria-hidden="true">
                  →
                </span>
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-[14px] font-semibold text-white backdrop-blur-sm transition-all hover:border-[#D4A054]/30 hover:bg-white/10"
              >
                Rezervasyonunu Listele
              </Link>
            </div>
          </div>
        </div>

        {/* Ana footer içeriği */}
        <div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-[1.4fr_1fr] sm:py-16">
          {/* Marka alanı */}
          <div className="max-w-[420px]">
            <Link href="/" className="flex items-center gap-2.5">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                className="text-[#D4A054]"
                aria-hidden="true"
                focusable="false"
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
            </Link>
            <p className="mt-4 text-[13.5px] leading-relaxed text-white/45">
              Kullanılmayan seyahat rezervasyonlarını güvenli ve şeffaf bir
              transfer deneyimine dönüştüren pazar yeri.
            </p>
          </div>

          {/* Platform linkleri */}
          <nav aria-label="Platform bağlantıları">
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-white/40">
              Platform
            </h3>
            <ul className="mt-4 space-y-1">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center py-2.5 text-[13.5px] text-white/60 transition-all duration-200 ease-out hover:translate-x-0.5 hover:text-[#D4A054]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Yasal alt bar */}
        <div className="flex flex-col gap-2 border-t border-white/5 py-6 text-[11.5px] text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} BITBIT. Tüm hakları saklıdır.</p>
          <p>Ödemeler, transfer tamamlanana kadar emanet sisteminde korunur.</p>
        </div>
      </div>
    </footer>
  );
}
