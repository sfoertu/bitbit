"use client";

import { useEffect, useRef, useState } from "react";
import type { Listing, SmartOfferPricing, BidRecord } from "@/data/listings";
import {
  calculateNextBidBaseAmount,
  calculateTotalAmount,
  calculatePlatformFee,
  maxBaseAmountFromTotalBudget,
  isNextBidAtBuyNow,
  getOfferEndsAt,
  getOfferPhase,
  formatMoney,
  type OfferPhase,
} from "@/lib/pricing";
import { OfferCountdown } from "./OfferCountdown";
import { PriceBreakdown } from "./PriceBreakdown";
import { BidHistory } from "./BidHistory";
import { AutoBidLimit } from "./AutoBidLimit";
import { BidConfirmationDialog } from "./BidConfirmationDialog";
import { SellerOfferSummary } from "./SellerOfferSummary";

let anonBidderSeq = 0;

export function SmartOfferPanel({
  listing,
  pricing,
}: {
  listing: Listing;
  pricing: SmartOfferPricing;
}) {
  const currency = listing.currency;
  const [state, setState] = useState(pricing);
  // `now` sunucu render'ında Date.now() ile doldurulmaz — SSR anı ile
  // hydration anı farklı olabileceğinden, faz seçimi (hangi JSX dalının
  // render edileceği) sunucu/istemci arasında sapıp React hydration
  // uyuşmazlığı üretebilirdi. Bunun yerine ilk render'da `now = null`
  // kalır (her iki ortamda da aynı, zamana bağlı olmayan iskelet
  // gösterilir) ve gerçek faz yalnızca mount sonrası effect'te hesaplanır.
  const [now, setNow] = useState<number | null>(null);
  const [dialogMode, setDialogMode] = useState<"bid" | "buy_now" | null>(null);
  const [autoBidMaxTotal, setAutoBidMaxTotal] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const prevPhaseRef = useRef<OfferPhase | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!toastMsg) return;
    const id = setTimeout(() => setToastMsg(null), 4000);
    return () => clearTimeout(id);
  }, [toastMsg]);

  const phase: OfferPhase | null =
    now === null
      ? null
      : getOfferPhase({
          publishedAt: state.publishedAt,
          reservationStartAt: state.reservationStartAt,
          currentTime: now,
        });
  const offerEndsAt = getOfferEndsAt(state.reservationStartAt);

  // Faz live_offer'dan çıktığında açık teklif dialogunu güvenle kapat ve bilgilendir.
  useEffect(() => {
    if (prevPhaseRef.current === "live_offer" && phase !== "live_offer") {
      setDialogMode((mode) => (mode === "bid" ? null : mode));
      setToastMsg(
        "Teklif dönemi sona erdi. Yalnızca Hemen Al seçeneği kullanılabilir."
      );
    }
    prevPhaseRef.current = phase;
  }, [phase]);

  const nextBidBase = calculateNextBidBaseAmount(state);
  const nextBidTotal = calculateTotalAmount(nextBidBase);
  const currentTotal = calculateTotalAmount(state.currentBasePrice);
  const buyNowTotal = calculateTotalAmount(state.buyNowBasePrice);
  const atBuyNow = isNextBidAtBuyNow(state);

  function applyUserBid(baseAmount: number) {
    const nowTs = Date.now();
    setState((prev) => {
      const record: BidRecord = {
        id: `bid-${nowTs}`,
        bidderName: "Sen",
        baseAmount,
        totalAmount: calculateTotalAmount(baseAmount),
        createdAt: new Date(nowTs).toISOString(),
        isCurrentUser: true,
      };
      return {
        ...prev,
        currentBasePrice: baseAmount,
        bidHistory: [record, ...prev.bidHistory],
      };
    });
  }

  function currentPhaseNow(): OfferPhase {
    return getOfferPhase({
      publishedAt: state.publishedAt,
      reservationStartAt: state.reservationStartAt,
      currentTime: Date.now(),
    });
  }

  function handleConfirmBid() {
    // Onay anında yeniden faz kontrolü — stale UI üzerinden teklif kaydetme.
    if (currentPhaseNow() !== "live_offer") {
      setDialogMode(null);
      setToastMsg(
        "Teklif süresi sona erdi. Bu rezervasyon artık yalnızca Hemen Al fiyatıyla satın alınabilir."
      );
      return;
    }
    applyUserBid(nextBidBase);
    setDialogMode(null);
    setToastMsg("Teklifin kaydedildi.");
  }

  function handleConfirmBuyNow() {
    if (currentPhaseNow() === "reservation_started") {
      setDialogMode(null);
      setToastMsg("Bu rezervasyon artık satın alınamaz.");
      return;
    }
    applyUserBid(state.buyNowBasePrice);
    setDialogMode(null);
    setToastMsg("Hemen Al ile satın alma prototipte tamamlandı.");
  }

  function handleSimulateCompetitor() {
    if (phase !== "live_offer" || atBuyNow) return;

    anonBidderSeq += 1;
    const competitorName = anonBidderSeq % 2 === 0 ? "Kullanıcı B" : "Kullanıcı A";
    const nowTs = Date.now();
    const competitorBase = calculateNextBidBaseAmount(state);

    const records: BidRecord[] = [
      {
        id: `bid-${nowTs}-c`,
        bidderName: competitorName,
        baseAmount: competitorBase,
        totalAmount: calculateTotalAmount(competitorBase),
        createdAt: new Date(nowTs).toISOString(),
        isCurrentUser: false,
      },
    ];

    let finalBase = competitorBase;
    let toast = `${competitorName} yeni bir teklif verdi (demo).`;

    if (autoBidMaxTotal != null && competitorBase < state.buyNowBasePrice) {
      const maxBase = maxBaseAmountFromTotalBudget(autoBidMaxTotal);
      const nextAutoBase = calculateNextBidBaseAmount({
        ...state,
        currentBasePrice: competitorBase,
      });
      if (nextAutoBase > competitorBase && nextAutoBase <= maxBase) {
        records.push({
          id: `bid-${nowTs}-auto`,
          bidderName: "Sen",
          baseAmount: nextAutoBase,
          totalAmount: calculateTotalAmount(nextAutoBase),
          createdAt: new Date(nowTs + 1).toISOString(),
          isCurrentUser: true,
        });
        finalBase = nextAutoBase;
        toast = `${competitorName} teklif verdi, otomatik teklifin devreye girdi.`;
      } else {
        toast = `${competitorName} teklif verdi. Otomatik teklif limitin bu kademeye yetmiyor.`;
      }
    }

    setState((prev) => ({
      ...prev,
      currentBasePrice: finalBase,
      bidHistory: [...records.reverse(), ...prev.bidHistory],
    }));
    setToastMsg(toast);
  }

  return (
    <div className="boarding-pass p-5">
      {phase === null && (
        <div
          className="h-40 motion-safe:animate-pulse rounded-lg bg-white/[0.03]"
          aria-hidden="true"
        />
      )}
      {phase === null && (
        <span className="sr-only">Fiyat ve teklif bilgisi yükleniyor…</span>
      )}

      {phase === "live_offer" && (
        <>
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center rounded-full border border-[#D4A054]/25 bg-[#D4A054]/10 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-widest text-[#D4A054]">
              Akıllı Teklif
            </span>
            <OfferCountdown targetAt={offerEndsAt} label="Tekliflerin bitmesine" />
          </div>

          <div className="mt-4">
            <PriceBreakdown
              rows={[
                {
                  label: "Taban teklif",
                  value: formatMoney(state.currentBasePrice, currency),
                },
                {
                  label: "Hizmet bedeli (%5)",
                  value: formatMoney(
                    calculatePlatformFee(state.currentBasePrice),
                    currency
                  ),
                },
              ]}
              totalLabel="Mevcut En Yüksek Toplam"
              totalValue={formatMoney(currentTotal, currency)}
              footnote="Toplam tutara %5 BITBIT hizmet bedeli dahildir."
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-white/[0.03] p-3 text-[12px]">
            <div>
              <p className="text-white/35">Sonraki Teklif Toplamı</p>
              <p className="mt-0.5 font-mono text-[14px] font-semibold tabular-nums text-white">
                {formatMoney(nextBidTotal, currency)}
              </p>
            </div>
            <div>
              <p className="text-white/35">Hemen Al Toplamı</p>
              <p className="mt-0.5 font-mono text-[14px] font-semibold tabular-nums text-white">
                {formatMoney(buyNowTotal, currency)}
              </p>
            </div>
          </div>

          {atBuyNow && (
            <p className="mt-3 text-[11px] leading-relaxed text-white/30">
              Sonraki kademe Hemen Al fiyatına ulaştı — doğrudan Hemen Al ile
              satın alabilirsin.
            </p>
          )}

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => setDialogMode("bid")}
              disabled={atBuyNow}
              className="btn-primary min-h-[44px] flex-1 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sonraki Teklifi Ver — {formatMoney(nextBidTotal, currency)}
            </button>
            <button
              onClick={() => setDialogMode("buy_now")}
              className="min-h-[44px] flex-1 rounded-lg border border-[#D4A054]/40 px-4 text-[13px] font-semibold text-[#D4A054] transition-colors hover:bg-[#D4A054]/10"
            >
              Hemen Al — {formatMoney(buyNowTotal, currency)}
            </button>
          </div>

          <div className="mt-5 border-t border-white/5 pt-4">
            <AutoBidLimit
              currency={currency}
              currentTotal={currentTotal}
              active={autoBidMaxTotal != null}
              maxTotal={autoBidMaxTotal}
              disabled={atBuyNow}
              onActivate={(value) => {
                setAutoBidMaxTotal(value);
                setToastMsg("Otomatik teklif aktif.");
              }}
              onDeactivate={() => setAutoBidMaxTotal(null)}
              onSimulateCompetitor={handleSimulateCompetitor}
            />
          </div>

          <div className="mt-5 border-t border-white/5 pt-4">
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-white/40">
              Teklif Geçmişi
            </h3>
            <div className="mt-3">
              <BidHistory bids={state.bidHistory} currency={currency} />
            </div>
          </div>
        </>
      )}

      {phase === "buy_now_only" && (
        <>
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-widest text-white/60">
              Son Satış Dönemi
            </span>
            <OfferCountdown
              targetAt={state.reservationStartAt}
              label="Rezervasyona kalan süre"
            />
          </div>

          <p className="mt-3 text-[12.5px] leading-relaxed text-white/45">
            Teklif süresi sona erdi. Bu rezervasyon artık yalnızca sabit Hemen
            Al fiyatıyla satın alınabilir.
          </p>

          <div className="mt-4">
            <PriceBreakdown
              rows={[
                {
                  label: "Hemen Al Fiyatı",
                  value: formatMoney(state.buyNowBasePrice, currency),
                },
                {
                  label: "BITBIT Hizmet Bedeli (%5)",
                  value: formatMoney(
                    calculatePlatformFee(state.buyNowBasePrice),
                    currency
                  ),
                },
              ]}
              totalLabel="Toplam"
              totalValue={formatMoney(buyNowTotal, currency)}
              footnote="Bu tutar rezervasyon başlangıcına kadar sabit kalır."
            />
          </div>

          <button
            onClick={() => setDialogMode("buy_now")}
            className="btn-primary mt-4 min-h-[44px] w-full"
          >
            Hemen Al — {formatMoney(buyNowTotal, currency)}
          </button>

          <details className="mt-5 border-t border-white/5 pt-4">
            <summary className="cursor-pointer font-mono text-[11px] font-semibold uppercase tracking-widest text-white/40">
              Teklif Geçmişi (kapandı)
            </summary>
            <div className="mt-3">
              <BidHistory bids={state.bidHistory} currency={currency} />
            </div>
          </details>
        </>
      )}

      {phase === "reservation_started" && (
        <>
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-widest text-white/60">
            Rezervasyon Başladı
          </span>
          <p className="mt-3 text-[13px] leading-relaxed text-white/50">
            Bu rezervasyon artık satın alınamaz.
          </p>

          <details className="mt-5 border-t border-white/5 pt-4">
            <summary className="cursor-pointer font-mono text-[11px] font-semibold uppercase tracking-widest text-white/40">
              Teklif Geçmişi (kapandı)
            </summary>
            <div className="mt-3">
              <BidHistory bids={state.bidHistory} currency={currency} />
            </div>
          </details>
        </>
      )}

      <div className="mt-5 border-t border-white/5 pt-4">
        <SellerOfferSummary
          currency={currency}
          currentBaseAmount={state.currentBasePrice}
          buyerTotal={currentTotal}
          buyNowBasePrice={state.buyNowBasePrice}
          countdownTargetAt={phase === "reservation_started" ? undefined : state.reservationStartAt}
          bidCount={state.bidHistory.length}
          watcherCount={state.watcherCount}
          sellerReceives={state.currentBasePrice}
        />
      </div>

      <p className="mt-4 text-center text-[10.5px] text-white/25">
        Bu bir frontend prototipidir; gerçek ödeme işlemi yapılmadı.
      </p>

      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-x-0 bottom-6 z-40 mx-auto w-fit max-w-[92vw] rounded-full border border-[#D4A054]/30 bg-[#0B2545] px-4 py-2.5 text-[12.5px] font-medium text-white shadow-xl"
        >
          {toastMsg}
        </div>
      )}

      <BidConfirmationDialog
        open={dialogMode === "bid"}
        title="Teklifini Onayla"
        description="Teklifin kabul edilirse belirtilen toplam tutar üzerinden satın alma sürecine geçersin. Bu bir frontend prototipidir; gerçek ödeme işlemi yapılmadı."
        baseAmount={nextBidBase}
        currency={currency}
        ctaLabel={`${formatMoney(nextBidTotal, currency)} Toplam ile Teklif Ver`}
        onConfirm={handleConfirmBid}
        onClose={() => setDialogMode(null)}
      />

      <BidConfirmationDialog
        open={dialogMode === "buy_now"}
        title="Hemen Al'ı Onayla"
        description="Hemen Al ile rezervasyonu anında devralırsın. Bu bir frontend prototipidir; gerçek ödeme işlemi yapılmadı."
        baseAmount={state.buyNowBasePrice}
        currency={currency}
        ctaLabel={`${formatMoney(buyNowTotal, currency)} Toplam ile Hemen Al`}
        onConfirm={handleConfirmBuyNow}
        onClose={() => setDialogMode(null)}
      />
    </div>
  );
}
