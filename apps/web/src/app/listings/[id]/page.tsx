"use client";

import { useParams } from "next/navigation";
import { mockListings, type Listing } from "@/data/listings";
import { PurchaseFlow } from "@/components/PurchaseFlow";
import { PriceBreakdown } from "@/components/pricing/PriceBreakdown";
import { SmartOfferPanel } from "@/components/pricing/SmartOfferPanel";
import { calculatePlatformFee, calculateTotalAmount, formatMoney } from "@/lib/pricing";

export default function ListingDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const listing = mockListings.find((l) => l.id === id);

  if (!listing) {
    return (
      <div className="mx-auto max-w-[1200px] px-6 py-20 text-center">
        <h1 className="font-display text-[22px] font-bold text-white">
          İlan bulunamadı
        </h1>
        <p className="mt-2 text-[14px] text-white/40">
          Bu ilan mevcut değil veya kaldırılmış.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Sol: İlan detayı */}
        <div>
          <div className="boarding-pass">
            {/* Üst kısım */}
            <div className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="inline-flex items-center rounded-full border border-[#D4A054]/15 bg-[#D4A054]/5 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-[#D4A054]">
                  {providerTypeLabel(listing.providerType)}
                </span>
                <span className="rounded-full bg-[#1B7A6B]/90 px-2 py-0.5 font-mono text-[9px] font-bold text-white">
                  %{discountPercent(listing.originalPrice, listing.listPrice)}{" "}
                  İNDİRİM
                </span>
              </div>

              <h1 className="font-display text-[20px] font-bold text-white">
                {listing.title}
              </h1>
              <p className="mt-1.5 text-[13px] text-white/45">
                {listing.provider} · {listing.location}
              </p>

              {/* Tarihler */}
              <div className="mt-3 flex items-center gap-1.5 font-mono text-[12px] text-white/40">
                <span className="tabular-nums">{listing.checkInDate}</span>
                {listing.checkOutDate && (
                  <>
                    <span className="text-[#D4A054]/60">→</span>
                    <span className="tabular-nums">
                      {listing.checkOutDate}
                    </span>
                  </>
                )}
              </div>
            </div>

            {listing.pricing?.pricingMode !== "smart_offer" && (
              <>
                {/* Perforasyon */}
                <div className="perforation mx-2" />

                {/* Alt kısım */}
                <div className="p-5 pt-4">
                  <PriceBreakdown
                    rows={[
                      {
                        label: "Satış fiyatı",
                        value: formatMoney(listing.listPrice, listing.currency),
                      },
                      {
                        label: "Hizmet bedeli (%5)",
                        value: formatMoney(
                          calculatePlatformFee(listing.listPrice),
                          listing.currency
                        ),
                      },
                    ]}
                    totalLabel="Hemen Al Toplamı"
                    totalValue={formatMoney(
                      calculateTotalAmount(listing.listPrice),
                      listing.currency
                    )}
                    footnote="Toplam tutara %5 BITBIT hizmet bedeli dahildir."
                  />

                  <div className="mt-3 space-y-0.5 text-[12px] text-white/35">
                    <p>Ödeme yöntemi: Kredi kartı (3D Secure)</p>
                    <p>Teslim: USDC olarak escrow&apos;a kilitlenir</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sağ: Satın alma akışı */}
        <div>
          {listing.pricing?.pricingMode === "smart_offer" ? (
            <SmartOfferPanel listing={listing} pricing={listing.pricing} />
          ) : (
            <PurchaseFlow listing={listing} />
          )}
        </div>
      </div>
    </div>
  );
}

function discountPercent(original: number, list: number): number {
  return Math.round(((original - list) / original) * 100);
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
