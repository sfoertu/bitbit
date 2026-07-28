import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import heroImg from "@/assets/home/hero.webp";
import hotelImg from "@/assets/home/category-hotel.webp";
import flightImg from "@/assets/home/category-flight.webp";
import carImg from "@/assets/home/category-car.webp";
import categorySceneHotel from "@/assets/home/category-scene-hotel.png";
import categorySceneCar from "@/assets/home/category-scene-car.png";
import categorySceneFlight from "@/assets/home/category-scene-flight.png";
import { mockListings } from "@/data/listings";
import { ListingCard } from "@/components/ListingCard";

const featuredListings = mockListings.slice(0, 3);

export default function HomePage() {
  return (
    <div>
      {/* Hero — ürün lansmanı: 3 telefon mockup ana karakter, havaalanı yalnızca çok hafif doku */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0B2545] to-[#071A33]">
        {/* Havaalanı atmosferi — çok düşük opaklık, artık ana katman değil, yalnızca doku */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat opacity-[0.07]"
          style={{
            backgroundImage: `url(${heroImg.src})`,
            backgroundPosition: "65% 25%",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B2545]/40 via-[#0B2545]/80 to-[#071A33]" />
        {/* Radial glow — hafif, sol üstte başlığın arkasında */}
        <div className="pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-[#D4A054]/10 blur-[120px]" />
        {/* Vignette — kenarlarda hafif koyulaşma */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(7,26,51,0.55)_100%)]" />

        <div className="relative mx-auto flex w-full max-w-[1280px] flex-col gap-14 px-6 py-16 lg:min-h-[85vh] lg:flex-row lg:items-center lg:gap-8 lg:py-20">
          {/* Sol: mesaj — ürünün ne olduğu, sahnenin arkaplanı değil */}
          <div className="order-2 max-w-[460px] lg:order-1 lg:w-[34%] lg:flex-shrink-0">
            {/* Kategori sahneleri — telefon kümesiyle aynı fan tasarımı, eyebrow'un hemen üstünde */}
            <CategorySceneCluster />

            {/* Başlık — 3 satır, tek baskın mesaj. Metin sütunu daraldığı için (telefonlar %60-70) ölçek lg'de küçültüldü — metin ve görsel birbirini ezmesin diye */}
            <h1 className="font-display text-[40px] font-bold leading-[1.1] tracking-tight text-white sm:text-[56px] sm:leading-[1.06] lg:text-[34px] lg:leading-[1.15]">
              Kullanamayacağın
              <br />
              rezervasyonun
              <br />
              <span className="text-[#D4A054]">değerini kaybetme.</span>
            </h1>

            {/* Alt metin — tek fayda */}
            <p className="mt-6 max-w-[400px] text-[15px] leading-[1.75] text-white/55">
              Rezervasyonunu güvenle ikincil pazarda listele. Emanet sistemi
              transfer tamamlanana kadar her iki tarafı da korur.
            </p>

            {/* CTA'lar — en fazla 2 */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/listings"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#D4A054] px-7 py-3.5 text-[14px] font-semibold text-[#0B2545] shadow-lg shadow-[#D4A054]/10 transition-all hover:bg-[#D4A054]/90 hover:shadow-[#D4A054]/20"
              >
                İlanları Keşfet
                <span className="font-mono text-[13px]" aria-hidden="true">
                  →
                </span>
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-7 py-3.5 text-[14px] font-semibold text-white backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10"
              >
                Nasıl Çalışır?
              </Link>
            </div>

            {/* Metadata satırı — kart değil, ince tek satır */}
            <div className="mt-11 flex flex-wrap items-center gap-x-6 gap-y-3">
              <MetaItem
                icon={
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
                    <rect x="2" y="3" width="20" height="18" rx="2" />
                    <path d="M8 7h8M8 11h5" />
                  </svg>
                }
                value="6"
                label="Aktif İlan"
              />
              <span className="hidden h-4 w-px bg-white/15 sm:block" aria-hidden="true" />
              <MetaItem
                icon={
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
                    <circle cx="9" cy="7" r="4" />
                    <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
                    <circle cx="17" cy="7" r="4" />
                    <path d="M21 21v-2a4 4 0 00-3-3.87" />
                  </svg>
                }
                value="3"
                label="Kategori"
              />
              <span className="hidden h-4 w-px bg-white/15 sm:block" aria-hidden="true" />
              <MetaItem
                icon={
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                }
                value="%30+"
                label="Tasarruf"
              />
            </div>
          </div>

          {/* Sağ: 3 telefon mockup — Hero'nun ana karakteri, %60-70 ağırlık */}
          <div className="order-1 flex min-w-0 flex-1 items-center justify-center overflow-hidden lg:order-2 lg:w-[66%] lg:flex-none lg:justify-end">
            <div className="w-full lg:translate-x-6">
              <PhoneCluster />
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Experience — Categories + Featured Listings tek sahnede birleşti */}
      <section className="relative overflow-hidden border-y border-white/5 bg-[#071A33] py-28 sm:py-32">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[340px] w-[760px] -translate-x-1/2 rounded-full bg-[#D4A054]/[0.04] blur-[150px]" />

        <div className="relative mx-auto max-w-[1280px] px-6">
          {/* Section header */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-[600px]">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4A054]/30 bg-[#D4A054]/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D4A054]">
                Marketplace
              </span>
              <h2 className="mt-4 font-display text-[28px] font-bold leading-[1.2] text-white sm:text-[40px]">
                Uçuş, otel, araç —
                <br />
                her rezervasyonun ikinci bir değeri var.
              </h2>
              <p className="mt-4 max-w-[460px] text-[14px] leading-relaxed text-white/50">
                Doğrulanmış rezervasyonları avantajlı fiyatlarla keşfet veya
                kendi rezervasyonunu güvenle listele.
              </p>
            </div>

            <Link
              href="/listings"
              className="inline-flex flex-shrink-0 items-center gap-2 self-start rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-[13px] font-semibold text-white backdrop-blur-sm transition-all hover:border-[#D4A054]/30 hover:bg-white/10 sm:self-auto"
            >
              Tüm İlanları Gör
              <span className="font-mono text-[13px]" aria-hidden="true">
                →
              </span>
            </Link>
          </div>

          {/* Kategori rail — büyük premium preview chip'leri */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <CategoryChip
              title="Otel"
              icon="🏨"
              count="3 ilan"
              image={hotelImg}
              imageAlt="Otel kategorisi görseli"
            />
            <CategoryChip
              title="Uçuş"
              icon="✈️"
              count="2 ilan"
              image={flightImg}
              imageAlt="Uçuş kategorisi görseli"
            />
            <CategoryChip
              title="Araç Kiralama"
              icon="🚗"
              count="1 ilan"
              image={carImg}
              imageAlt="Araç kiralama kategorisi görseli"
            />
          </div>

          {/* Ana sahne — tek büyük featured ilan + iki destekleyici ilan */}
          <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
            <div className="lg:col-span-2">
              <ListingCard listing={featuredListings[0]} variant="featured" large />
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-1">
              <ListingCard listing={featuredListings[1]} variant="featured" />
              <ListingCard listing={featuredListings[2]} variant="featured" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Infrastructure — düz satır, 2x2 kart grid değil */}
      <section className="relative overflow-hidden border-y border-white/5 bg-[#0B2545] py-20 sm:py-24">
        <div className="pointer-events-none absolute -right-32 top-10 h-[420px] w-[420px] rounded-full bg-[#D4A054]/[0.06] blur-[130px]" />

        <div className="relative mx-auto max-w-[1100px] px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Sol — başlık, açıklama, CTA, süreç zaman çizelgesi */}
            <div className="flex flex-col justify-center">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#D4A054]/30 bg-[#D4A054]/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D4A054]">
                Neden BITBIT?
              </span>
              <h2 className="mt-4 font-display text-[28px] font-bold leading-[1.2] text-white sm:text-[36px]">
                Güven üzerine
                <br />
                tasarlanmış transfer deneyimi.
              </h2>
              <p className="mt-4 max-w-[440px] text-[14px] leading-relaxed text-white/50">
                Rezervasyon transferinin her adımı kullanıcı güveni ve
                şeffaflık düşünülerek tasarlanmıştır.
              </p>

              {/* Süreç zaman çizelgesi — yalnızca görsel anlatım, kart değil */}
              <div className="mt-8 flex items-center gap-2 text-white/40">
                {["Rezervasyon", "Doğrulama", "Transfer", "Tamamlandı"].map(
                  (label, i) => (
                    <div key={label} className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#D4A054]/50" />
                        <span className="font-mono text-[9px] font-semibold uppercase tracking-widest">
                          {label}
                        </span>
                      </div>
                      {i < 3 && (
                        <span
                          className="text-[12px] font-light text-[#D4A054]/30"
                          aria-hidden="true"
                        >
                          ›
                        </span>
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Sağ — düz satır listesi (kart değil) */}
            <div>
              <TrustRow
                title="Doğrulanmış Kullanıcılar"
                description="Kullanıcı kimliği ve rezervasyon bilgileri doğrulama süreçlerinden geçirilir."
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                }
              />
              <TrustRow
                title="Güvenli Ödeme"
                description="Ödeme, rezervasyon hakkı devredilene kadar emanet sisteminde güvenle tutulur."
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
                    <rect x="4" y="10" width="16" height="10" rx="2" />
                    <path d="M8 10V7a4 4 0 018 0v3" />
                  </svg>
                }
              />
              <TrustRow
                title="Şeffaf İşlem"
                description="Rezervasyon durumu ve transfer adımları bir Trace ID ile uçtan uca izlenebilir."
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                }
              />
              <TrustRow
                title="Atomik Takas"
                description="Para ve rezervasyon hakkı aynı işlemde el değiştirir — ara bir durum oluşmaz."
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
                    <path d="M17 3l4 4-4 4M3 7h18M7 21l-4-4 4-4M21 17H3" />
                  </svg>
                }
                last
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MetaItem({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[#D4A054]">{icon}</span>
      <span className="font-mono text-[15px] font-bold text-white tabular-nums">
        {value}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
        {label}
      </span>
    </div>
  );
}

function CategorySceneCluster() {
  // Genişlikler ebeveyn sütunun (max-w-460px / lg:34%) yüzdesi olarak
  // tanımlanır — bu sütun her zaman sabit/ölçülebilir genişliğe sahip
  // olduğundan (auto değil), yüzde tabanlı boyutlandırma burada güvenle
  // çalışır ve küme hiçbir viewport'ta ekranın dışına taşmaz.
  return (
    <div className="relative -mt-2 mb-8 flex w-full -translate-y-2 items-center sm:-translate-y-3" aria-hidden="true">
      <div className="relative z-0 -mr-[6%] w-[30%] flex-shrink-0 rotate-[-9deg] opacity-90 transition-all duration-300 ease-out hover:z-20 hover:scale-125 hover:opacity-100 lg:-mr-[8%] lg:w-[35%]">
        <div className="relative aspect-[3/2] overflow-hidden rounded-xl border border-white/15 shadow-lg shadow-black/40">
          <Image
            src={categorySceneHotel}
            alt=""
            fill
            sizes="(min-width: 1024px) 220px, 150px"
            className="object-cover"
          />
        </div>
      </div>
      <div className="relative z-10 w-[36%] flex-shrink-0 transition-transform duration-300 ease-out hover:z-20 hover:scale-125 lg:w-[44%]">
        <div className="relative aspect-[3/2] overflow-hidden rounded-xl border border-[#D4A054]/25 shadow-xl shadow-black/50">
          <Image
            src={categorySceneCar}
            alt=""
            fill
            sizes="(min-width: 1024px) 270px, 180px"
            className="object-cover"
          />
        </div>
      </div>
      <div className="relative z-0 -ml-[6%] w-[30%] flex-shrink-0 rotate-[9deg] opacity-90 transition-all duration-300 ease-out hover:z-20 hover:scale-125 hover:opacity-100 lg:-ml-[8%] lg:w-[35%]">
        <div className="relative aspect-[3/2] overflow-hidden rounded-xl border border-white/15 shadow-lg shadow-black/40">
          <Image
            src={categorySceneFlight}
            alt=""
            fill
            sizes="(min-width: 1024px) 220px, 150px"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}

function PhoneCluster() {
  // lg'de genişlikler ebeveyn sütunun (artık lg:flex-none lg:w-[66%] ile
  // sabit/tanımlı) yüzdesi olarak verilir. clamp(vw) denemesi hâlâ taşmaya
  // izin veriyordu çünkü sütun flex-1 (basis:0) yüzünden aslında hiçbir
  // zaman gerçek "%66" genişliğe sahip değildi — üst öğe artık kesin
  // genişlikli olduğundan yüzde burada güvenle çalışır ve küme matematiksel
  // olarak asla sütunu (dolayısıyla ekranı) aşamaz. Mobil/tablet (<lg)
  // boyutları zaten sorunsuzdu, dokunulmadı.
  return (
    <div className="relative mx-auto flex w-full items-center justify-center">
      <div className="relative z-0 w-[115px] flex-shrink-0 -mr-[30px] rotate-[-9deg] opacity-90 sm:w-[145px] sm:-mr-[38px] lg:w-[23%] lg:-mr-[4%]">
        <PhoneMockup variant="list" />
      </div>
      <div className="relative z-10 w-[150px] flex-shrink-0 sm:w-[195px] lg:w-[28%]">
        <PhoneMockup variant="transfer" />
      </div>
      <div className="relative z-0 w-[115px] flex-shrink-0 -ml-[30px] rotate-[9deg] opacity-90 sm:w-[145px] sm:-ml-[38px] lg:w-[23%] lg:-ml-[4%]">
        <PhoneMockup variant="complete" />
      </div>
    </div>
  );
}

function PhoneMockup({
  variant,
}: {
  variant: "list" | "transfer" | "complete";
}) {
  return (
    <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[1.75rem] border-[3px] border-white/15 bg-[#0A1930] shadow-2xl shadow-black/60 sm:rounded-[2.25rem]">
      {/* Dynamic island */}
      <div className="absolute left-1/2 top-2 z-10 h-[12px] w-[54px] -translate-x-1/2 rounded-full bg-black/70 sm:h-[14px] sm:w-[64px]" />

      {/* Durum çubuğu */}
      <div className="flex items-center justify-between px-3 pt-4 text-[10px] font-semibold text-white/60 sm:px-4 sm:text-[12px]">
        <span>9:41</span>
        <span className="flex items-center gap-0.5" aria-hidden="true">
          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
          <span className="h-1.5 w-2.5 rounded-sm bg-white/40" />
        </span>
      </div>

      {/* BITBIT marka satırı */}
      <div className="flex items-center gap-1.5 px-3 pt-2.5 sm:px-4 sm:pt-3">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          className="text-[#D4A054] sm:h-[14px] sm:w-[14px]"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
        <span className="font-display text-[9px] font-bold tracking-wide text-[#D4A054] sm:text-[10.5px]">
          BITBIT
        </span>
      </div>

      {variant === "list" && (
        <div className="px-2.5 pt-4 sm:px-4 sm:pt-5">
          <p className="font-display text-[12px] font-bold text-white sm:text-[14px]">
            Rezervasyonlarım
          </p>
          <div className="mt-2.5 space-y-1.5 sm:mt-3 sm:space-y-2">
            <MiniReservationRow icon="✈️" title="IST → AYT" meta="01 EYL" />
            <MiniReservationRow icon="🏨" title="Kapadokya Otel" meta="15-17 AĞU" />
            <MiniReservationRow icon="🚗" title="Antalya Kiralık" meta="10-17 AĞU" />
          </div>
        </div>
      )}

      {variant === "transfer" && (
        <div className="flex h-full flex-col px-2.5 pt-4 sm:px-4 sm:pt-5">
          <p className="font-display text-[12px] font-bold text-white sm:text-[14px]">
            Rezervasyon Devri
          </p>
          <div className="mt-2.5 rounded-lg border border-white/10 bg-white/5 p-2.5 sm:mt-3 sm:p-3">
            <p className="text-[10px] font-semibold text-white sm:text-[11px]">
              İstanbul → Antalya
            </p>
            <p className="mt-0.5 font-mono text-[9px] text-white/40 sm:text-[10px]">
              01 EYL 2026 · TK 0084
            </p>
          </div>

          <div className="mt-3 flex items-center justify-center gap-2.5 sm:mt-4 sm:gap-3">
            <span className="h-7 w-7 rounded-full bg-white/10 sm:h-9 sm:w-9" />
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-[#D4A054] sm:h-[18px] sm:w-[18px]"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
            <span className="h-7 w-7 rounded-full bg-[#D4A054]/30 sm:h-9 sm:w-9" />
          </div>

          <div className="mt-auto mb-4 sm:mb-5">
            <div className="rounded-lg bg-[#D4A054] py-2 text-center text-[10px] font-bold text-[#0B2545] sm:py-2.5 sm:text-[12px]">
              Devri Onayla
            </div>
          </div>
        </div>
      )}

      {variant === "complete" && (
        <div className="flex h-full flex-col items-center justify-center px-3 text-center sm:px-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1B7A6B]/20 sm:h-12 sm:w-12">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-[#1B7A6B] sm:h-[22px] sm:w-[22px]"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
          <p className="mt-2.5 font-display text-[12px] font-bold text-white sm:mt-3 sm:text-[14px]">
            Transfer Tamamlandı
          </p>
          <p className="mt-1 text-[9px] leading-relaxed text-white/45 sm:text-[10.5px]">
            Rezervasyon karşı tarafa aktarıldı.
          </p>
        </div>
      )}
    </div>
  );
}

function MiniReservationRow({
  icon,
  title,
  meta,
}: {
  icon: string;
  title: string;
  meta: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 sm:gap-2.5 sm:px-2.5 sm:py-2">
      <span className="text-[12px] sm:text-[14px]" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] font-semibold text-white sm:text-[11.5px]">
          {title}
        </p>
        <p className="font-mono text-[8.5px] text-white/40 sm:text-[9.5px]">
          {meta}
        </p>
      </div>
    </div>
  );
}

function CategoryChip({
  title,
  icon,
  count,
  image,
  imageAlt,
}: {
  title: string;
  icon: string;
  count: string;
  image: StaticImageData;
  imageAlt: string;
}) {
  return (
    <Link
      href="/listings"
      className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 pr-5 transition-all duration-300 ease-out hover:border-[#D4A054]/30 hover:bg-white/[0.06]"
    >
      <span className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-28">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(min-width: 640px) 112px, 96px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 font-display text-[15px] font-bold text-white sm:text-[16px]">
          <span aria-hidden="true">{icon}</span>
          {title}
        </p>
        <p className="mt-1 font-mono text-[11px] text-white/40">{count}</p>
      </div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="flex-shrink-0 text-white/30 transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:text-[#D4A054]"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}

function TrustRow({
  title,
  description,
  icon,
  last = false,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-4 py-5 ${last ? "" : "border-b border-white/5"}`}
    >
      <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center text-[#D4A054]">
        {icon}
      </span>
      <div>
        <h3 className="font-display text-[15px] font-bold text-white">
          {title}
        </h3>
        <p className="mt-1 text-[13px] leading-relaxed text-white/50">
          {description}
        </p>
      </div>
    </div>
  );
}
