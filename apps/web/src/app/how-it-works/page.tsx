import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import heroSceneImg from "@/assets/how-it-works/product-launch-hero.png";
import reservationImg from "@/assets/how-it-works/reservation-process.webp";
import securityImg from "@/assets/how-it-works/security-process.webp";
import paymentImg from "@/assets/how-it-works/payment-process.webp";
import videoCoverListeleme from "@/assets/how-it-works/video-cover-listeleme.png";
import videoCoverAltyapi from "@/assets/how-it-works/video-cover-altyapi.png";
import videoCoverAnaliz from "@/assets/how-it-works/video-cover-analiz.png";

const videoGuides = [
  {
    url: "https://youtu.be/DO-lewmjS0I",
    title: "Uçak biletlerinde blokzincir tabanlı ikincil pazar",
    duration: "12 dk",
    cover: videoCoverListeleme,
  },
  {
    url: "https://youtu.be/ClEakBRbm80",
    title: "BITBIT İkincil Uçak Bileti Altyapı Analizi",
    duration: "12 dk",
    cover: videoCoverAltyapi,
  },
  {
    url: "https://youtu.be/jK8xZ9GeOFY",
    title: "BITBIT Projesinde Teknik ve Psikolojik Analiz",
    duration: "13 dk",
    cover: videoCoverAnaliz,
  },
];

const platformGuides = [
  {
    href: "/documents/bitbit-hybrid-infrastructure.pdf",
    title: "Hibrit Altyapı Rehberi",
    description: "Web2/Web3 hibrit mimarinin nasıl işlediğine dair teknik doküman.",
    cta: "Hibrit Altyapı Rehberini Aç",
  },
  {
    href: "/documents/bitbit-reservation-yield-engine.pdf",
    title: "Rezervasyon Getiri Motoru Rehberi",
    description: "Akıllı Teklif ve fiyatlandırma motorunun işleyişine dair teknik doküman.",
    cta: "Getiri Motoru Rehberini Aç",
  },
];

export default function HowItWorksPage() {
  return (
    <div>
      {/* Hero — ürün lansmanı sahnesi, görsel kırpılmadan tam kompozisyonuyla kullanılıyor */}
      <section className="relative bg-[#071A33] pb-16 pt-14 sm:pb-20 sm:pt-20">
        <div className="mx-auto max-w-[1280px] px-6">
          {/* Gerçek H1 — SEO/accessibility, görselin üstüne binmez, görseldeki başlığı tekrar etmez */}
          <div className="mx-auto max-w-[620px] text-center">
            <h1 className="font-display text-[30px] font-bold leading-tight text-white sm:text-[40px]">
              Rezervasyon transferi nasıl çalışır?
            </h1>
            <p className="mx-auto mt-4 text-[14px] leading-relaxed text-white/55">
              Rezervasyonunu listele, güvenli transfer sürecini tamamla ve
              yeni sahibine devret.
            </p>
          </div>

          {/* Ana sahne — tamamlanmış ürün lansmanı görseli, doğal en-boy oranıyla, kırpılmadan */}
          <div className="relative mt-10 w-full sm:mt-14">
            <Image
              src={heroSceneImg}
              alt="BITBIT Travel Wallet ürün sunumu — rezervasyonlarını listele, güvenle transfer et, yeni sahibine devret"
              priority
              sizes="(min-width: 1280px) 1232px, 100vw"
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      {/* Üç adımlı süreç — editorial timeline, kart değil */}
      <section className="relative overflow-hidden border-y border-white/5 bg-[#0A1E38] py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="mx-auto max-w-[560px] text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4A054]/30 bg-[#D4A054]/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D4A054]">
              Süreç
            </span>
            <h2 className="mt-4 font-display text-[26px] font-bold leading-[1.2] text-white sm:text-[32px]">
              Üç adımda tamamlanan transfer.
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
            <EditorialStep
              step="01"
              title="Rezervasyonunu Listele"
              description="Rezervasyon bilgilerini ekle ve uygunluğunu doğrula."
              image={reservationImg}
              imageAlt="Rezervasyon listeleme süreci görseli"
            />
            <EditorialStep
              step="02"
              title="Transferi Güvenle Tamamla"
              description="Alıcıyla eşleş, ödeme ve doğrulama adımlarını tamamla."
              image={securityImg}
              imageAlt="Güvenli transfer süreci görseli"
            />
            <EditorialStep
              step="03"
              title="Yeni Sahibe Devret"
              description="Transfer tamamlandığında rezervasyon yeni kullanıcının hesabında aktifleşir."
              image={paymentImg}
              imageAlt="Ödeme ve devir süreci görseli"
            />
          </div>
        </div>
      </section>

      {/* Güven ve doğrulama — düz satır, kart grid değil */}
      <section className="bg-[#0B2545] py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="mx-auto max-w-[560px] text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4A054]/30 bg-[#D4A054]/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D4A054]">
              Güven
            </span>
            <h2 className="mt-4 font-display text-[26px] font-bold leading-[1.2] text-white sm:text-[32px]">
              Doğrulama üzerine kurulu bir süreç.
            </h2>
          </div>

          <div className="mx-auto mt-12 max-w-[720px]">
            <TrustLine
              title="Emanet Koruması"
              description="Ödeme, rezervasyon hakkı devredilene kadar güvenli şekilde tutulur."
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              }
            />
            <TrustLine
              title="Atomik İşlem"
              description="Para ve hak aynı transaction'da el değiştirir — ya hep ya hiç."
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
                  <path d="M17 3l4 4-4 4M3 7h18M7 21l-4-4 4-4M21 17H3" />
                </svg>
              }
            />
            <TrustLine
              title="İzlenebilirlik"
              description="Her adım bir Trace ID ile izlenebilir, şeffaf bir süreç sunar."
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              }
              last
            />
          </div>
        </div>
      </section>

      {/* Video Rehberleri */}
      <section className="bg-[#071A33] py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="mx-auto max-w-[680px] text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4A054]/30 bg-[#D4A054]/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D4A054]">
              Video Rehberleri
            </span>
            <h2 className="mt-4 font-display text-[24px] font-bold leading-[1.25] text-white sm:text-[30px]">
              Nedir Bu Bitbit? Teknik Analiz ve Eleştiriler...
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {videoGuides.map((video) => (
              <a
                key={video.url}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#D4A054]/30"
              >
                {/* Video kapak görseli — büyük */}
                <div className="relative h-[200px] w-full overflow-hidden sm:h-[220px]">
                  <Image
                    src={video.cover}
                    alt={`${video.title} — video kapağı`}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover:bg-black/10" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#D4A054]/40 bg-[#0A1E38]/80 backdrop-blur-sm transition-transform duration-300 ease-out group-hover:scale-110">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="ml-1 text-[#D4A054]" aria-hidden="true" focusable="false">
                        <path d="M6 4l14 8-14 8V4z" />
                      </svg>
                    </span>
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-display text-[14.5px] font-bold leading-snug text-white group-hover:text-[#D4A054]">
                    {video.title}
                  </h3>
                  <p className="mt-1.5 font-mono text-[11px] text-white/40">
                    {video.duration} · YouTube
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* PDF Platform Rehberi */}
      <section className="bg-[#0A1E38] py-16 sm:py-20">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="mb-8 text-center">
            <h2 className="font-display text-[20px] font-bold text-white sm:text-[24px]">
              BITBIT Platform Rehberi
            </h2>
            <p className="mx-auto mt-2 max-w-[420px] text-[13.5px] leading-relaxed text-white/50">
              Platformun işleyişini iki dokümanda incele.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {platformGuides.map((guide) => (
              <div
                key={guide.href}
                className="flex flex-col items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#D4A054]/25 bg-[#D4A054]/10">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#D4A054]" aria-hidden="true" focusable="false">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <path d="M14 2v6h6" />
                  </svg>
                </span>
                <div>
                  <h3 className="font-display text-[16px] font-bold text-white">
                    {guide.title}
                  </h3>
                  <p className="mx-auto mt-1.5 max-w-[320px] text-[13px] leading-relaxed text-white/50">
                    {guide.description}
                  </p>
                </div>
                <a
                  href={guide.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#D4A054] px-6 py-3 text-[14px] font-semibold text-[#0B2545] shadow-lg shadow-[#D4A054]/10 transition-all hover:bg-[#D4A054]/90 hover:shadow-[#D4A054]/20"
                >
                  {guide.cta}
                  <span className="font-mono text-[13px]" aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Son CTA */}
      <section className="bg-[#071A33] py-16 sm:py-20">
        <div className="mx-auto max-w-[1100px] px-6 text-center">
          <h2 className="font-display text-[22px] font-bold text-white sm:text-[26px]">
            Hazır mısın?
          </h2>
          <p className="mt-2 text-[14px] text-white/50">
            Rezervasyonunu listele veya avantajlı ilanları keşfet.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 rounded-lg bg-[#D4A054] px-6 py-3 text-[14px] font-semibold text-[#0B2545] shadow-lg shadow-[#D4A054]/10 transition-all hover:bg-[#D4A054]/90 hover:shadow-[#D4A054]/20"
            >
              İlanları Keşfet
              <span className="font-mono text-[13px]" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function EditorialStep({
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
    <div className="relative text-center sm:text-left">
      <div className="relative z-10 h-[220px] w-full overflow-hidden rounded-2xl border border-[#D4A054]/25 sm:h-[240px]">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(min-width: 640px) 33vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1E38]/70 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#0A1E38]/90 font-mono text-[12px] font-bold text-[#D4A054] ring-1 ring-[#D4A054]/40">
          {step}
        </span>
      </div>
      <h3 className="mt-5 font-display text-[17px] font-bold leading-snug text-white">
        {title}
      </h3>
      <p className="mt-2 text-[13.5px] leading-relaxed text-white/50">
        {description}
      </p>
    </div>
  );
}

function TrustLine({
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
