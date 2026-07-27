import Link from "next/link";
import reservationImg from "@/assets/how-it-works/reservation-process.webp";
import securityImg from "@/assets/how-it-works/security-process.webp";
import paymentImg from "@/assets/how-it-works/payment-process.webp";

export default function HowItWorksPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0A1E38] py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B2545]/80 via-[#0A1E38] to-[#071A33]" />
        <div className="relative mx-auto max-w-[1100px] px-6 text-center">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-[#D4A054]/30 bg-[#D4A054]/10 px-3 py-1">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D4A054]">
              Süreç
            </span>
          </div>
          <h1 className="font-display text-[40px] font-bold leading-[1.1] tracking-tight text-white sm:text-[48px]">
            BITBIT nasıl çalışır?
          </h1>
          <p className="mx-auto mt-5 max-w-[560px] text-[14px] leading-[1.7] text-white/50">
            Rezervasyonunu listelemekten ödemeni almana kadar, tüm süreç
            emanet sistemiyle güvence altında — üç basit adımda.
          </p>
          <Link
            href="/listings"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#D4A054] px-6 py-3 text-[14px] font-semibold text-[#0B2545] shadow-lg shadow-[#D4A054]/10 transition-all hover:bg-[#D4A054]/90 hover:shadow-[#D4A054]/20"
          >
            İlanları Keşfet
            <span className="font-mono text-[13px]">→</span>
          </Link>
        </div>
      </section>

      {/* Section 1 — Reservation Process */}
      <ProcessSection
        eyebrow="Adım 1"
        title="Rezervasyon Süreci"
        description="Kullanamayacağın otel, uçuş veya araç kiralama rezervasyonunu birkaç dakikada listele. Rezervasyon bilgilerini gir, satış fiyatını belirle ve ilanın anında ikincil pazarda yayına alınsın."
        bullets={[
          "Rezervasyon detaylarını gir",
          "Satış fiyatını belirle",
          "İlan anında yayına alınır",
        ]}
        image={reservationImg.src}
        imageAlt="Rezervasyon süreci"
        imageSide="right"
        background="bg-[#071A33]"
      />

      {/* Section 2 — Security */}
      <ProcessSection
        eyebrow="Adım 2"
        title="Güvenlik"
        description="Her işlem emanet (escrow) sistemi üzerinden yürür. Alıcının ödemesi güvenli şekilde tutulur; rezervasyon hakkı doğrulanmadan hiçbir taraf mağdur olmaz. Atomik takas ile para ve hak aynı anda el değiştirir."
        bullets={[
          "Emanet sistemiyle korunan ödemeler",
          "Doğrulanmış rezervasyon devri",
          "All-or-nothing atomik takas",
        ]}
        image={securityImg.src}
        imageAlt="Güvenlik süreci"
        imageSide="left"
        background="bg-[#0A1E38]"
      />

      {/* Section 3 — Payment & Escrow */}
      <ProcessSection
        eyebrow="Adım 3"
        title="Ödeme & Emanet"
        description="İşlem tamamlandığında ödeme otomatik olarak satıcının hesabına aktarılır. Emanet sistemi, her iki tarafın da haklarını işlem tamamlanana kadar koruma altında tutar."
        bullets={[
          "Otomatik ödeme aktarımı",
          "İşlem tamamlanana kadar emanet koruması",
          "Şeffaf ve izlenebilir süreç",
        ]}
        image={paymentImg.src}
        imageAlt="Ödeme ve emanet süreci"
        imageSide="right"
        background="bg-[#071A33]"
      />

      {/* Trust + FAQ + CTA */}
      <section className="bg-[#0A1E38] py-16">
        <div className="mx-auto max-w-[1100px] px-6">
          <h2 className="font-display text-center text-[26px] font-bold text-white">
            Neden Güvenebilirsin?
          </h2>
          <div className="mt-10 grid grid-cols-3 gap-5">
            <TrustCard
              title="Emanet Koruması"
              description="Ödeme, rezervasyon hakkı devredilene kadar güvenli şekilde tutulur."
            />
            <TrustCard
              title="Atomik İşlem"
              description="Para ve hak aynı transaction'da el değiştirir — ya hep ya hiç."
            />
            <TrustCard
              title="İzlenebilirlik"
              description="Her adım trace ID ile izlenebilir, şeffaf bir süreç sunar."
            />
          </div>
        </div>
      </section>

      <section className="bg-[#071A33] py-16">
        <div className="mx-auto max-w-[1100px] px-6">
          <h2 className="font-display text-center text-[26px] font-bold text-white">
            Sıkça Sorulan Sorular
          </h2>
          <div className="mx-auto mt-10 max-w-[720px] space-y-3">
            <FaqItem
              question="Rezervasyonumu sattıktan sonra ödemem ne zaman gelir?"
              answer="Alıcı rezervasyon hakkını devraldığında emanet sistemi ödemeyi otomatik olarak hesabına aktarır."
            />
            <FaqItem
              question="Alıcı olarak ödemem güvende mi?"
              answer="Evet. Ödemen, rezervasyon hakkının doğrulanmış şekilde sana devredilmesine kadar emanet sisteminde tutulur."
            />
            <FaqItem
              question="İşlem başarısız olursa ne olur?"
              answer="Atomik takas prensibi gereği işlem ya tam olarak gerçekleşir ya da hiç gerçekleşmez — ara bir durum oluşmaz."
            />
          </div>
        </div>
      </section>

      <section className="bg-[#0A1E38] py-14">
        <div className="mx-auto max-w-[1100px] px-6 text-center">
          <h2 className="font-display text-[24px] font-bold text-white">
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
              <span className="font-mono text-[13px]">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProcessSection({
  eyebrow,
  title,
  description,
  bullets,
  image,
  imageAlt,
  imageSide,
  background,
}: {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  image: string;
  imageAlt: string;
  imageSide: "left" | "right";
  background: string;
}) {
  const textBlock = (
    <div className="flex-1">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D4A054]">
        {eyebrow}
      </span>
      <h2 className="mt-2 font-display text-[28px] font-bold leading-tight text-white sm:text-[32px]">
        {title}
      </h2>
      <p className="mt-4 max-w-[440px] text-[14px] leading-[1.7] text-white/50">
        {description}
      </p>
      <ul className="mt-6 space-y-3">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-[#D4A054]/20 bg-[#D4A054]/10">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-[#D4A054]">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </span>
            <span className="text-[13px] leading-relaxed text-white/70">
              {bullet}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  const imageBlock = (
    <div className="flex-1">
      <div
        role="img"
        aria-label={imageAlt}
        className="h-[280px] w-full rounded-xl border border-white/5 bg-cover bg-center sm:h-[340px]"
        style={{ backgroundImage: `url(${image})` }}
      />
    </div>
  );

  return (
    <section className={`${background} py-14`}>
      <div
        className={`mx-auto flex max-w-[1100px] flex-col items-center gap-10 px-6 md:gap-14 ${
          imageSide === "left" ? "md:flex-row" : "md:flex-row-reverse"
        }`}
      >
        {imageBlock}
        {textBlock}
      </div>
    </section>
  );
}

function TrustCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-[#D4A054]/10 bg-[#0B2545]/60 p-5">
      <h3 className="font-display text-[15px] font-bold text-white">
        {title}
      </h3>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/45">
        {description}
      </p>
    </div>
  );
}

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#0B2545]/40 p-5">
      <h3 className="font-display text-[14px] font-bold text-white">
        {question}
      </h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-white/50">
        {answer}
      </p>
    </div>
  );
}
