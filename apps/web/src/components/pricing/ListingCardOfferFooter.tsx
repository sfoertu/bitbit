"use client";

import { useEffect, useState } from "react";
import type { SmartOfferPricing } from "@/data/listings";
import {
  calculateNextBidBaseAmount,
  calculateTotalAmount,
  formatMoney,
  getOfferEndsAt,
  getOfferPhase,
} from "@/lib/pricing";
import { OfferCountdown } from "./OfferCountdown";

/**
 * Listing kartının alt fiyat bloğu — Akıllı Teklif ilanları için fazına göre
 * (LIVE_OFFER / BUY_NOW_ONLY / RESERVATION_STARTED) farklı görünüm üretir.
 * Kart sunucu bileşeni olduğu için faz hesabı ve saniyelik geçişler bu küçük
 * client sınırında izole edildi.
 */
export function ListingCardOfferFooter({
  pricing,
  currency,
}: {
  pricing: SmartOfferPricing;
  currency: string;
}) {
  // `now` sunucu render'ında Date.now() ile doldurulmaz — SSR anı ile
  // hydration anı farklı olabileceğinden faz seçimi (hangi bloğun render
  // edileceği) sunucu/istemci arasında sapıp React hydration uyuşmazlığı
  // üretebilirdi. İlk render'da her iki ortamda da aynı, zamana bağlı
  // olmayan bir iskelet gösterilir; gerçek faz yalnızca mount sonrası
  // effect'te hesaplanır.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const buyNowTotal = calculateTotalAmount(pricing.buyNowBasePrice);

  if (now === null) {
    return (
      <div className="p-4 pt-3">
        <div
          className="h-16 motion-safe:animate-pulse rounded-lg bg-white/[0.03]"
          aria-hidden="true"
        />
        <span className="sr-only">Fiyat bilgisi yükleniyor…</span>
      </div>
    );
  }

  const phase = getOfferPhase({
    publishedAt: pricing.publishedAt,
    reservationStartAt: pricing.reservationStartAt,
    currentTime: now,
  });

  if (phase === "reservation_started") {
    return (
      <div className="p-4 pt-3">
        <span className="rounded-full border border-white/15 bg-white/[0.04] px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-white/50">
          REZERVASYON BAŞLADI
        </span>
        <p className="mt-2 text-[11.5px] text-white/35">Satın alıma kapalı</p>
      </div>
    );
  }

  if (phase === "buy_now_only") {
    return (
      <div className="flex items-center justify-between p-4 pt-3">
        <div>
          <span className="rounded-full border border-white/15 bg-white/[0.04] px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-white/60">
            SON SATIŞ
          </span>
          <p className="mt-1.5 font-display text-[18px] font-bold tabular-nums text-white">
            {formatMoney(buyNowTotal, currency)}
          </p>
          <p className="mt-0.5 text-[9.5px] text-white/25">
            %5 hizmet bedeli dahil
          </p>
          <div className="mt-1">
            <OfferCountdown
              targetAt={pricing.reservationStartAt}
              label="Rezervasyona"
              size="sm"
            />
          </div>
        </div>
        <span className="rounded-lg bg-[#D4A054]/90 px-3.5 py-1.5 text-[11px] font-bold text-[#0B2545]">
          HEMEN AL →
        </span>
      </div>
    );
  }

  const offerEndsAt = getOfferEndsAt(pricing.reservationStartAt);
  const currentTotal = calculateTotalAmount(pricing.currentBasePrice);
  const nextBidTotal = calculateTotalAmount(calculateNextBidBaseAmount(pricing));

  return (
    <div className="p-4 pt-3">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full border border-[#D4A054]/25 bg-[#D4A054]/10 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-[#D4A054]">
          AKILLI TEKLİF
        </span>
        <OfferCountdown
          targetAt={offerEndsAt}
          label="Tekliflerin bitmesine"
          size="sm"
        />
      </div>
      <p className="mt-2.5 text-[9px] font-semibold uppercase tracking-widest text-white/25">
        Mevcut Toplam
      </p>
      <p className="mt-0.5 font-display text-[18px] font-bold tabular-nums text-white">
        {formatMoney(currentTotal, currency)}
      </p>
      <div className="mt-1.5 flex items-center justify-between font-mono text-[10.5px] tabular-nums text-white/40">
        <span>Sonraki: {formatMoney(nextBidTotal, currency)}</span>
        <span>Hemen Al: {formatMoney(buyNowTotal, currency)}</span>
      </div>
    </div>
  );
}
