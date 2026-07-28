import Link from "next/link";
import Image from "next/image";
import type { Listing } from "@/data/listings";
import hotelImg from "@/assets/home/category-hotel.webp";
import flightImg from "@/assets/home/category-flight.webp";
import carImg from "@/assets/home/category-car.webp";
import { ListingCardOfferFooter } from "@/components/pricing/ListingCardOfferFooter";
import { calculateTotalAmount, formatMoney } from "@/lib/pricing";

function providerImage(type: Listing["providerType"]) {
  switch (type) {
    case "hotel":
      return hotelImg;
    case "airline":
      return flightImg;
    case "car_rental":
      return carImg;
  }
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
  }).format(price);
}

function providerTypeLabel(type: Listing["providerType"]): string {
  switch (type) {
    case "hotel":
      return "OTEL";
    case "airline":
      return "UÇUŞ";
    case "car_rental":
      return "ARAÇ KİRALAMA";
  }
}

function discountPercent(original: number, list: number): number {
  return Math.round(((original - list) / original) * 100);
}

export function ListingCard({
  listing,
  variant = "default",
  large = false,
}: {
  listing: Listing;
  variant?: "default" | "featured";
  large?: boolean;
}) {
  const discount = discountPercent(listing.originalPrice, listing.listPrice);

  if (variant === "featured") {
    return (
      <Link
        href={`/listings/${listing.id}`}
        className="group block h-full rounded-2xl"
      >
        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E2A4D] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-[#D4A054]/30 group-hover:shadow-[0_20px_45px_-18px_rgba(0,0,0,0.6)]">
          {/* Büyük rezervasyon görseli — birincil (large) kartta belirgin daha yüksek */}
          <div
            className={`relative w-full flex-shrink-0 overflow-hidden ${
              large
                ? "h-[280px] sm:h-[360px] lg:h-[440px]"
                : "h-[220px] sm:h-[260px]"
            }`}
          >
            <Image
              src={providerImage(listing.providerType)}
              alt={`${listing.title} — ${listing.provider}`}
              fill
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E2A4D] via-[#0E2A4D]/20 to-transparent" />

            {/* Kategori + bilet no rozeti — görsel üzerinde */}
            <div className="absolute inset-x-4 top-4 flex items-center justify-between">
              <span className="inline-flex items-center rounded-full border border-[#D4A054]/25 bg-black/40 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-widest text-[#D4A054] backdrop-blur-sm">
                {providerTypeLabel(listing.providerType)}
              </span>
              <span className="rounded-full border border-white/15 bg-black/40 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-white/70 backdrop-blur-sm">
                #{listing.id.toUpperCase()}
              </span>
            </div>

            {/* Başlık + sağlayıcı — görsel üzerinde, en dikkat çeken alan */}
            <div className="absolute inset-x-0 bottom-0 p-5">
              <h3 className="font-display text-[19px] font-bold leading-snug text-white sm:text-[22px]">
                {listing.title}
              </h3>
              <p className="mt-1 text-[12.5px] text-white/60">
                {listing.provider}
              </p>
            </div>
          </div>

          {/* Bilgi grubu */}
          <div className="flex flex-1 flex-col p-5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-white/50">
              <span className="flex items-center gap-1.5">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                  className="flex-shrink-0 text-[#D4A054]/60"
                >
                  <path d="M12 22s8-4.5 8-12a8 8 0 10-16 0c0 7.5 8 12 8 12z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {listing.location}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[11px] tabular-nums">
                {listing.checkInDate}
                {listing.checkOutDate && (
                  <>
                    <span aria-hidden="true" className="text-[#D4A054]/50">
                      →
                    </span>
                    {listing.checkOutDate}
                  </>
                )}
              </span>
            </div>

            {/* Güven etiketi */}
            <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-[#1B7A6B]/20 bg-[#1B7A6B]/10 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-widest text-[#1B7A6B]">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              Emanet Korumalı
            </span>

            {/* Perforasyon */}
            <div className="perforation perforation--featured mx-0 mt-5" />

            {/* Fiyat + CTA */}
            <div className="mt-5 flex items-end justify-between">
              <div>
                <p className="font-mono text-[9px] font-semibold uppercase tracking-widest text-white/25">
                  Satış Fiyatı
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-[24px] font-bold text-white tabular-nums">
                    {formatPrice(listing.listPrice)}
                  </span>
                  <span className="font-mono text-[11px] text-white/25 line-through tabular-nums">
                    {formatPrice(listing.originalPrice)}
                  </span>
                </div>
                {discount > 0 && (
                  <span className="mt-1.5 inline-flex items-center rounded-full bg-[#1B7A6B]/15 px-2 py-0.5 font-mono text-[9px] font-bold text-[#1B7A6B]">
                    %{discount} TRANSFER AVANTAJI
                  </span>
                )}
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#D4A054]/90 px-3.5 py-2 text-[12px] font-bold text-[#0B2545] transition-all duration-300 group-hover:gap-2.5 group-hover:bg-[#D4A054]">
                Detayları Gör
                <span
                  aria-hidden="true"
                  className="font-mono text-[13px] transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/listings/${listing.id}`} className="block">
      <div className="boarding-pass group cursor-pointer">
        {/* Üst Kısım */}
        <div className="p-4">
          {/* Badge + İndirim */}
          <div className="mb-2.5 flex items-center justify-between">
            <span className="inline-flex items-center rounded-full border border-[#D4A054]/15 bg-[#D4A054]/5 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-[#D4A054]">
              {providerTypeLabel(listing.providerType)}
            </span>
            {discount > 0 && (
              <span className="rounded-full bg-[#1B7A6B]/90 px-2 py-0.5 font-mono text-[9px] font-bold text-white">
                %{discount} İNDİRİM
              </span>
            )}
          </div>

          {/* Başlık */}
          <h3 className="font-display text-[14px] font-bold leading-snug text-white group-hover:text-[#D4A054]">
            {listing.title}
          </h3>

          {/* Sağlayıcı + Konum */}
          <p className="mt-1 text-[12px] text-white/35">{listing.provider}</p>
          <p className="mt-0.5 text-[12px] text-white/35">
            {listing.location}
          </p>

          {/* Tarihler */}
          <div className="mt-2.5 flex items-center gap-1.5 font-mono text-[11px] text-white/40">
            <span className="tabular-nums">{listing.checkInDate}</span>
            {listing.checkOutDate && (
              <>
                <span className="text-[#D4A054]/60">→</span>
                <span className="tabular-nums">{listing.checkOutDate}</span>
              </>
            )}
          </div>
        </div>

        {/* Perforasyon */}
        <div className="perforation mx-2" />

        {/* Alt Kısım — Fiyat */}
        {listing.pricing?.pricingMode === "smart_offer" ? (
          <ListingCardOfferFooter
            pricing={listing.pricing}
            currency={listing.currency}
          />
        ) : (
          <div className="flex items-center justify-between p-4 pt-3">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-white/25">
                Hemen Al
              </p>
              <div className="mt-0.5 flex items-baseline gap-1.5">
                <span className="font-display text-[18px] font-bold text-white tabular-nums">
                  {formatMoney(calculateTotalAmount(listing.listPrice), listing.currency)}
                </span>
                <span className="text-[10px] text-white/30">toplam</span>
              </div>
              <p className="mt-0.5 text-[9.5px] text-white/25">
                %5 hizmet bedeli dahil
              </p>
            </div>

            <span className="rounded-lg bg-[#D4A054]/90 px-3.5 py-1.5 text-[11px] font-bold text-[#0B2545] transition-colors group-hover:bg-[#D4A054]">
              SATIN AL →
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
