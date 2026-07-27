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

export function ListingCard({ listing }: { listing: Listing }) {
  const discount = discountPercent(listing.originalPrice, listing.listPrice);

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
