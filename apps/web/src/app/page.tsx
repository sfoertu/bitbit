import Link from "next/link";
import heroImg from "@/assets/home/hero.webp";
import hotelImg from "@/assets/home/category-hotel.webp";
import flightImg from "@/assets/home/category-flight.webp";
import carImg from "@/assets/home/category-car.webp";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[540px] overflow-hidden">
        {/* Arka plan fotoğrafı */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${heroImg.src})`,
            backgroundPosition: "50% 35%",
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B2545]/95 via-[#0B2545]/60 to-[#0B2545]/10" />

        <div className="relative mx-auto flex h-full max-w-[1200px] items-center px-6">
          <div className="max-w-[620px]">
            {/* Badge */}
            <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-[#D4A054]/30 bg-[#D4A054]/10 px-3 py-1">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-[#D4A054]"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D4A054]">
                Smart Transfer System
              </span>
            </div>

            {/* Başlık — 2 satır hedefi */}
            <h1 className="font-display text-[48px] font-bold leading-[1.05] tracking-tight text-white sm:text-[56px]">
              İadesiz rezervasyonunu
              <br />
              <span className="text-[#D4A054]">başkasına devret.</span>
            </h1>

            {/* Alt metin */}
            <p className="mt-5 max-w-[440px] text-[14px] leading-[1.7] text-white/50">
              Seyahat planların değiştiyse, rezervasyonunu güvenle ikincil
              pazarda listele. Alıcılar avantajlı fiyatlarla satın alsın —
              emanet sistemi her iki tarafı da korur.
            </p>

            {/* CTA — reference ile aynı his */}
            <Link
              href="/listings"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#D4A054] px-6 py-3 text-[14px] font-semibold text-[#0B2545] shadow-lg shadow-[#D4A054]/10 transition-all hover:bg-[#D4A054]/90 hover:shadow-[#D4A054]/20"
            >
              İlanları Keşfet
              <span className="font-mono text-[13px]">→</span>
            </Link>
          </div>
        </div>

        {/* İstatistikler — hero içinde, alt kısım */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#0B2545]/60 backdrop-blur-sm">
          <div className="mx-auto flex h-[68px] max-w-[1200px] items-center gap-10 px-6">
            <StatItem
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#D4A054]">
                  <rect x="2" y="3" width="20" height="18" rx="2" />
                  <path d="M8 7h8M8 11h5" />
                </svg>
              }
              value="6"
              label="AKTİF İLAN"
            />
            <StatItem
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#D4A054]">
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#D4A054]">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              }
              value="%30+"
              label="TASARRUF"
            />
          </div>
        </div>
      </section>

      {/* Nasıl Çalışır */}
      <section id="nasil-calisir" className="bg-[#0A1E38] py-12">
        <div className="mx-auto max-w-[1100px] px-6">
          <h2 className="font-display text-center text-[22px] font-bold text-white">
            Nasıl Çalışır?
          </h2>
          <div className="mt-8 flex items-stretch gap-0">
            <StepCard
              step="1"
              title="Rezervasyonunu Listele"
              description="Kullanamayacağın rezervasyonunu gir, fiyatını belirle."
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#D4A054]">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 3v18M3 9h18" />
                </svg>
              }
            />
            <span className="flex flex-shrink-0 items-center px-1.5 text-[18px] font-light text-[#D4A054]/40">
              ›
            </span>
            <StepCard
              step="2"
              title="Güvenle Devret"
              description="Emanet sistemi devreye girer — para ve hak aynı anda el değiştirir."
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#D4A054]">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              }
            />
            <span className="flex flex-shrink-0 items-center px-1.5 text-[18px] font-light text-[#D4A054]/40">
              ›
            </span>
            <StepCard
              step="3"
              title="Ödemeni Al"
              description="İşlem tamamlandığında ödemen otomatik olarak hesabına ulaşır."
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#D4A054]">
                  <rect x="1" y="4" width="22" height="16" rx="2" />
                  <path d="M1 10h22" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* Kategoriler */}
      <section className="bg-[#071A33] py-12">
        <div className="mx-auto max-w-[1100px] px-6">
          <h2 className="font-display text-center text-[22px] font-bold text-white">
            Kategoriler
          </h2>
          <div className="mt-8 grid grid-cols-3 gap-5">
            <CategoryCard
              title="Otel"
              icon="🏨"
              count="3 ilan"
              image={hotelImg.src}
            />
            <CategoryCard
              title="Uçuş"
              icon="✈️"
              count="2 ilan"
              image={flightImg.src}
            />
            <CategoryCard
              title="Araç Kiralama"
              icon="🚗"
              count="1 ilan"
              image={carImg.src}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
  icon,
}: {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex-1 rounded-xl border border-[#D4A054]/10 bg-[#0B2545]/60 p-4">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D4A054]/15 bg-[#D4A054]/5">
          {icon}
        </div>
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D4A054] font-mono text-[11px] font-bold text-[#0B2545]">
          {step}
        </div>
      </div>
      <h3 className="mt-2.5 font-display text-[14px] font-bold text-white">
        {title}
      </h3>
      <p className="mt-1 text-[12px] leading-relaxed text-white/45">
        {description}
      </p>
    </div>
  );
}

function CategoryCard({
  title,
  icon,
  count,
  image,
}: {
  title: string;
  icon: string;
  count: string;
  image: string;
}) {
  return (
    <Link href="/listings" className="group relative block overflow-hidden rounded-xl border border-white/5">
      <div
        className="h-[220px] bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
        style={{
          backgroundImage: `url(${image})`,
          backgroundPosition: "center 40%",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545]/90 via-[#0B2545]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <span className="font-display text-[15px] font-bold text-white">
            {title}
          </span>
        </div>
        <span className="flex items-center gap-1 text-[13px] text-white/50 transition-colors group-hover:text-[#D4A054]">
          {count}
          <span className="font-mono text-[12px]">→</span>
        </span>
      </div>
    </Link>
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
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D4A054]/20 bg-[#D4A054]/5">
        {icon}
      </div>
      <div>
        <p className="font-mono text-[18px] font-bold text-[#D4A054] tabular-nums">
          {value}
        </p>
        <p className="font-mono text-[9px] font-semibold uppercase tracking-widest text-white/35">
          {label}
        </p>
      </div>
    </div>
  );
}
