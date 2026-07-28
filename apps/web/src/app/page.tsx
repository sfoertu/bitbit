import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import heroImg from "@/assets/home/hero.webp";
import hotelImg from "@/assets/home/category-hotel.webp";
import flightImg from "@/assets/home/category-flight.webp";
import carImg from "@/assets/home/category-car.webp";
import reservationImg from "@/assets/how-it-works/reservation-process.webp";
import securityImg from "@/assets/how-it-works/security-process.webp";
import paymentImg from "@/assets/how-it-works/payment-process.webp";
import { mockListings } from "@/data/listings";
import { ListingCard } from "@/components/ListingCard";

const featuredListings = mockListings.slice(0, 3);

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden md:flex md:min-h-[700px] md:items-center">
        {/* Arka plan fotoğrafı — mevcut asset, yalnızca konumlandırma güncellendi */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${heroImg.src})`,
            backgroundPosition: "60% 30%",
          }}
        />
        {/* Radial glow — hafif, sol üstte başlığın arkasında */}
        <div className="pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-[#D4A054]/10 blur-[120px]" />
        {/* Gradient overlay — solda okunabilirlik, sağda uçak/terminal görünür kalır */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B2545] via-[#0B2545]/80 to-transparent sm:from-[#0B2545]/98 sm:via-[#0B2545]/72 sm:to-[#0B2545]/5" />
        {/* Vignette — kenarlarda hafif koyulaşma */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(7,26,51,0.5)_100%)]" />

        <div className="relative mx-auto w-full max-w-[1200px] px-6 py-20 md:py-24">
          <div className="max-w-[640px]">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-[#D4A054]/30 bg-[#D4A054]/10 px-3 py-1">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-[#D4A054]"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D4A054]">
                Smart Transfer System
              </span>
            </div>

            {/* Başlık — 3 satır, büyük ve cesur */}
            <h1 className="font-display text-[42px] font-bold leading-[1.08] tracking-tight text-white sm:text-[64px] sm:leading-[1.04] lg:text-[76px]">
              İadesiz
              <br />
              Rezervasyonunu
              <br />
              <span className="text-[#D4A054]">Güvenle Devret.</span>
            </h1>

            {/* Alt metin */}
            <p className="mt-6 max-w-[400px] text-[15px] leading-[1.75] text-white/55">
              Seyahat planların değiştiyse rezervasyonunu güvenle ikincil
              pazarda listele. Emanet sistemi her iki tarafı da korur.
            </p>

            {/* CTA'lar */}
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

            {/* İstatistikler — glass, floating kartlar */}
            <div className="mt-12 grid max-w-[520px] grid-cols-3 gap-3">
              <StatItem
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#D4A054]" aria-hidden="true" focusable="false">
                    <rect x="2" y="3" width="20" height="18" rx="2" />
                    <path d="M8 7h8M8 11h5" />
                  </svg>
                }
                value="6"
                label="AKTİF İLAN"
              />
              <StatItem
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#D4A054]" aria-hidden="true" focusable="false">
                    <circle cx="9" cy="7" r="4" />
                    <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
                    <circle cx="17" cy="7" r="4" />
                    <path d="M21 21v-2a4 4 0 00-3-3.87" />
                  </svg>
                }
                value="3"
                label="KATEGORİ"
              />
              <StatItem
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#D4A054]" aria-hidden="true" focusable="false">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                }
                value="%30+"
                label="TASARRUF"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Nasıl Çalışır */}
      <section
        id="nasil-calisir"
        className="relative overflow-hidden border-y border-white/5 bg-[#0A1E38] py-20 sm:py-24"
      >
        {/* Section ayrımı — hafif glow */}
        <div className="pointer-events-none absolute -right-32 top-1/2 h-[360px] w-[360px] -translate-y-1/2 rounded-full bg-[#D4A054]/[0.05] blur-[140px]" />

        <div className="relative mx-auto max-w-[1100px] px-6">
          <div className="grid gap-12 md:grid-cols-[minmax(0,380px)_1fr] md:gap-16">
            {/* Sol: section header + CTA */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4A054]/30 bg-[#D4A054]/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D4A054]">
                Nasıl Çalışır?
              </span>
              <h2 className="mt-4 font-display text-[28px] font-bold leading-[1.2] text-white sm:text-[36px]">
                Rezervasyonunu üç adımda
                <br />
                değere dönüştür.
              </h2>
              <p className="mt-4 max-w-[400px] text-[14px] leading-relaxed text-white/50">
                Listele, güvenli eşleşmeyi tamamla ve rezervasyon transferini
                kolayca gerçekleştir.
              </p>

              <Link
                href="/how-it-works"
                className="mt-7 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-[13px] font-semibold text-white backdrop-blur-sm transition-all hover:border-[#D4A054]/30 hover:bg-white/10"
              >
                Detaylı Nasıl Çalışır?
                <span className="font-mono text-[13px]" aria-hidden="true">
                  →
                </span>
              </Link>

              <p className="mt-5 max-w-[360px] text-[12px] leading-relaxed text-white/35">
                Ödeme, transfer başarıyla tamamlanana kadar güvenli biçimde
                korunur.
              </p>
            </div>

            {/* Sağ: 3 adımlı süreç */}
            <div className="relative flex flex-col gap-5">
              {/* Bağlantı çizgisi — yalnızca desktop, kartların üzerine binmez */}
              <div className="pointer-events-none absolute left-[52px] top-10 bottom-10 hidden w-px bg-gradient-to-b from-[#D4A054]/35 via-[#D4A054]/10 to-transparent md:block" />

              <ProcessStepCard
                step="01"
                title="Rezervasyonunu Listele"
                description="Kullanamayacağın uçuş, otel veya araç rezervasyonunun bilgilerini ekle."
                image={reservationImg}
                imageAlt="Rezervasyon listeleme süreci görseli"
              />
              <ProcessStepCard
                step="02"
                title="Güvenli Eşleşme"
                description="Alıcı rezervasyonu inceler; ödeme güvenli süreç içinde korunur."
                image={securityImg}
                imageAlt="Güvenli eşleşme süreci görseli"
              />
              <ProcessStepCard
                step="03"
                title="Transferi Tamamla"
                description="Rezervasyon devri doğrulandıktan sonra ödeme satıcıya aktarılır."
                image={paymentImg}
                imageAlt="Ödeme transferi süreci görseli"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Güven */}
      <section className="relative overflow-hidden border-y border-white/5 bg-[#0B2545] py-20 sm:py-24">
        {/* Hafif radial glow — çok yoğun değil */}
        <div className="pointer-events-none absolute -right-32 top-10 h-[420px] w-[420px] rounded-full bg-[#D4A054]/[0.06] blur-[130px]" />
        {/* Çok hafif noise doku */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%272%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E")',
          }}
        />

        <div className="relative mx-auto max-w-[1100px] px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Sol — başlık, açıklama, CTA */}
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
              <Link
                href="/how-it-works"
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-[13px] font-semibold text-white backdrop-blur-sm transition-all hover:border-[#D4A054]/30 hover:bg-white/10"
              >
                Nasıl Çalıştığını İncele
                <span className="font-mono text-[13px]" aria-hidden="true">
                  →
                </span>
              </Link>

              {/* Süreç zaman çizelgesi — yalnızca görsel anlatım */}
              <div className="mt-10 flex items-center gap-2 text-white/40">
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

            {/* Sağ — 2x2 premium trust kartları */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TrustCard
                title="Doğrulanmış Kullanıcılar"
                description="Kullanıcı kimliği ve rezervasyon bilgileri doğrulama süreçlerinden geçirilir."
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#D4A054]" aria-hidden="true" focusable="false">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                }
              />
              <TrustCard
                title="Güvenli Ödeme"
                description="Ödeme, rezervasyon hakkı devredilene kadar emanet sisteminde güvenle tutulur."
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#D4A054]" aria-hidden="true" focusable="false">
                    <rect x="4" y="10" width="16" height="10" rx="2" />
                    <path d="M8 10V7a4 4 0 018 0v3" />
                  </svg>
                }
              />
              <TrustCard
                title="Şeffaf İşlem"
                description="Rezervasyon durumu ve transfer adımları süreç boyunca uçtan uca izlenebilir."
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#D4A054]" aria-hidden="true" focusable="false">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                }
              />
              <TrustCard
                title="Atomik Takas"
                description="Para ve rezervasyon hakkı aynı işlemde el değiştirir — ara bir durum oluşmaz."
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#D4A054]" aria-hidden="true" focusable="false">
                    <path d="M17 3l4 4-4 4M3 7h18M7 21l-4-4 4-4M21 17H3" />
                  </svg>
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* Kategoriler */}
      <section className="relative overflow-hidden border-y border-white/5 bg-[#071A33] py-20 sm:py-24">
        {/* Section ayrımı — hafif glow, önceki/sonraki bölümden yumuşak kopuş */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[640px] -translate-x-1/2 rounded-full bg-[#D4A054]/[0.04] blur-[140px]" />

        <div className="relative mx-auto max-w-[1100px] px-6">
          {/* Section header */}
          <div className="mx-auto max-w-[560px] text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4A054]/30 bg-[#D4A054]/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D4A054]">
              Seyahat Kategorileri
            </span>
            <h2 className="mt-4 font-display text-[28px] font-bold leading-[1.2] text-white sm:text-[36px]">
              Planın değiştiğinde
              <br />
              değerini kaybetme.
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-white/50">
              Uçuş, otel ve araç rezervasyonlarını güvenli şekilde listele
              veya avantajlı fırsatları keşfet.
            </p>
          </div>

          {/* Kart grid */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <CategoryCard
              title="Otel"
              icon="🏨"
              count="3 ilan"
              image={hotelImg}
              imageAlt="Otel kategorisi — konaklama rezervasyonu görseli"
              description="Kullanamayacağın konaklama rezervasyonunu güvenle devret."
            />
            <CategoryCard
              title="Uçuş"
              icon="✈️"
              count="2 ilan"
              image={flightImg}
              imageAlt="Uçuş kategorisi — uçak bileti rezervasyonu görseli"
              description="İadesiz uçuşunu listele veya avantajlı bir rota keşfet."
            />
            <CategoryCard
              title="Araç Kiralama"
              icon="🚗"
              count="1 ilan"
              image={carImg}
              imageAlt="Araç kiralama kategorisi — kiralık araç görseli"
              description="Araç kiralama rezervasyonunu değer kaybetmeden transfer et."
            />
          </div>
        </div>
      </section>

      {/* Öne Çıkan İlanlar */}
      <section className="bg-[#0A1E38] py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          {/* Section header */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-[520px]">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4A054]/30 bg-[#D4A054]/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D4A054]">
                Öne Çıkan Fırsatlar
              </span>
              <h2 className="mt-4 font-display text-[28px] font-bold leading-[1.2] text-white sm:text-[36px]">
                Seyahat planın değiştiğinde
                <br />
                değerini kaybetme.
              </h2>
              <p className="mt-4 text-[14px] leading-relaxed text-white/50">
                Doğrulanmış uçuş, otel ve araç rezervasyonlarını avantajlı
                fiyatlarla keşfet.
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

          {/* Kart grid */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} variant="featured" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProcessStepCard({
  step,
  title,
  description,
  image,
  imageAlt,
}: {
  step: string;
  title: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
}) {
  return (
    <div className="group relative flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0B2545]/40 p-5 backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#D4A054]/25">
      {/* İnce iç highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.04]" />

      {/* Görsel + adım numarası rozeti */}
      <div className="relative z-10 h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-white/10">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="64px"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
        />
        <span className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0B2545]/90 font-mono text-[9px] font-bold text-[#D4A054] ring-1 ring-[#D4A054]/40">
          {step}
        </span>
      </div>

      <div className="relative z-10 min-w-0 flex-1">
        <h3 className="font-display text-[16px] font-bold text-white">
          {title}
        </h3>
        <p className="mt-1 text-[13px] leading-relaxed text-white/50 line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
}

function CategoryCard({
  title,
  icon,
  count,
  image,
  imageAlt,
  description,
}: {
  title: string;
  icon: string;
  count: string;
  image: StaticImageData;
  imageAlt: string;
  description: string;
}) {
  return (
    <Link
      href="/listings"
      className="group relative block h-[300px] overflow-hidden rounded-2xl border border-white/10 shadow-xl shadow-black/20 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#D4A054]/30 hover:shadow-[0_0_30px_-6px_rgba(212,160,84,0.18)] sm:h-[380px] lg:h-[420px]"
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />

      {/* Gradient overlay — alt kısımda okunabilirlik */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545] via-[#0B2545]/55 to-transparent" />
      {/* İnce iç highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.06]" />

      {/* Üst rozet — mevcut ilan verisi */}
      <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/30 px-2.5 py-1 font-mono text-[11px] text-white/80 backdrop-blur-sm">
        {count}
      </span>

      {/* Alt metin alanı */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">
            {icon}
          </span>
          <h3 className="font-display text-[20px] font-bold text-white sm:text-[22px]">
            {title}
          </h3>
        </div>
        <p className="mt-2 max-w-[280px] text-[13px] leading-relaxed text-white/55 line-clamp-2">
          {description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#D4A054] transition-transform duration-300 ease-out group-hover:translate-x-1">
          Fırsatları Gör
          <span className="font-mono text-[13px]" aria-hidden="true">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

function TrustCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#D4A054]/30">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D4A054]/15 bg-[#D4A054]/5 transition-transform duration-300 ease-out group-hover:scale-110">
        {icon}
      </div>
      <h3 className="mt-3.5 font-display text-[14px] font-bold text-white">
        {title}
      </h3>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/45">
        {description}
      </p>
    </div>
  );
}

function StatItem({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-2 py-3 text-center backdrop-blur-md sm:flex-row sm:gap-3 sm:px-4 sm:text-left">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#D4A054]/20 bg-[#D4A054]/10 sm:h-9 sm:w-9">
        {icon}
      </div>
      <div>
        <p className="font-mono text-[15px] font-bold text-[#D4A054] tabular-nums sm:text-[18px]">
          {value}
        </p>
        <p className="font-mono text-[8px] font-semibold uppercase tracking-widest text-white/40 sm:text-[9px]">
          {label}
        </p>
      </div>
    </div>
  );
}
