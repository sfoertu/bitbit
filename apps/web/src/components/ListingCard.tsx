import Link from "next/link";
import type { Listing } from "@/data/listings";

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
}: {
  listing: Listing;
  variant?: "default" | "featured";
}) {
  const discount = discountPercent(listing.originalPrice, listing.listPrice);

  if (variant === "featured") {
    return (
      <Link
        href={`/listings/${listing.id}`}
        className="group block h-full rounded-2xl"
      >
        <article
          className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#0E2A4D] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-[#D4A054]/30 group-hover:shadow-[0_20px_45px_-18px_rgba(0,0,0,0.6)]"
        >
          {/* Üst Kısım */}
          <div className="p-5">
            {/* Kategori + Bilet No */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-full border border-[#D4A054]/20 bg-[#D4A054]/10 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-widest text-[#D4A054]">
                {providerTypeLabel(listing.providerType)}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-white/25">
                #{listing.id.toUpperCase()}
              </span>
            </div>

            {/* Başlık */}
            <h3 className="mt-3 font-display text-[17px] font-bold leading-snug text-white transition-colors group-hover:text-[#D4A054]">
              {listing.title}
            </h3>

            {/* Sağlayıcı */}
            <p className="mt-1.5 text-[12px] text-white/40">
              {listing.provider}
            </p>

            {/* Konum */}
            <div className="mt-3.5 flex items-center gap-1.5 text-[12px] text-white/50">
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
              <span>{listing.location}</span>
            </div>

            {/* Tarihler */}
            <div className="mt-2 flex items-center gap-1.5 font-mono text-[11px] text-white/40">
              <span className="tabular-nums">{listing.checkInDate}</span>
              {listing.checkOutDate && (
                <>
                  <span aria-hidden="true" className="text-[#D4A054]/50">
                    →
                  </span>
                  <span className="tabular-nums">
                    {listing.checkOutDate}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Perforasyon */}
          <div className="perforation perforation--featured mx-3" />

          {/* Alt Kısım — Fiyat */}
          <div className="mt-auto flex items-end justify-between p-5 pt-4">
            <div>
              <p className="font-mono text-[9px] font-semibold uppercase tracking-widest text-white/25">
                Satış Fiyatı
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-[20px] font-bold text-white tabular-nums">
                  {formatPrice(listing.listPrice)}
                </span>
                <span className="font-mono text-[11px] text-white/25 line-through tabular-nums">
                  {formatPrice(listing.originalPrice)}
                </span>
              </div>
              {discount > 0 && (
                <span className="mt-1.5 inline-flex items-center rounded-full bg-[#1B7A6B]/15 px-2 py-0.5 font-mono text-[9px] font-bold text-[#1B7A6B]">
                  %{discount} TASARRUF
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
        <div className="flex items-center justify-between p-4 pt-3">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-white/25">
              SATIŞ FİYATI
            </p>
            <div className="mt-0.5 flex items-baseline gap-2">
              <span className="font-display text-[18px] font-bold text-white tabular-nums">
                {formatPrice(listing.listPrice)}
              </span>
              <span className="font-mono text-[11px] text-white/15 line-through tabular-nums">
                {formatPrice(listing.originalPrice)}
              </span>
            </div>
          </div>

          <span className="rounded-lg bg-[#D4A054]/90 px-3.5 py-1.5 text-[11px] font-bold text-[#0B2545] transition-colors group-hover:bg-[#D4A054]">
            SATIN AL →
          </span>
        </div>
      </div>
    </Link>
  );
}
