// BITBIT — Hemen Al / Akıllı Teklif fiyatlandırma ve zamanlama yardımcıları.
// Frontend-only prototip: gerçek ödeme veya açık artırma motoru içermez.

export const PLATFORM_FEE_RATE = 0.05;

/** Rezervasyon başlangıcından önceki son N saat: yalnızca sabit Hemen Al geçerli. */
export const BUY_NOW_ONLY_WINDOW_HOURS = 12;
const BUY_NOW_ONLY_WINDOW_MS = BUY_NOW_ONLY_WINDOW_HOURS * 60 * 60 * 1000;

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculatePlatformFee(baseAmount: number): number {
  return round2(baseAmount * PLATFORM_FEE_RATE);
}

export function calculateTotalAmount(baseAmount: number): number {
  return round2(baseAmount + calculatePlatformFee(baseAmount));
}

export function maxBaseAmountFromTotalBudget(maxTotalAmount: number): number {
  return round2(maxTotalAmount / (1 + PLATFORM_FEE_RATE));
}

export interface NextBidInput {
  currentBasePrice: number;
  buyNowBasePrice: number;
  minimumIncrementType: "fixed" | "percentage";
  minimumIncrementValue: number;
}

export function calculateNextBidBaseAmount(pricing: NextBidInput): number {
  const raw =
    pricing.minimumIncrementType === "fixed"
      ? pricing.currentBasePrice + pricing.minimumIncrementValue
      : pricing.currentBasePrice * (1 + pricing.minimumIncrementValue / 100);
  return Math.min(round2(raw), pricing.buyNowBasePrice);
}

export function isNextBidAtBuyNow(pricing: NextBidInput): boolean {
  return calculateNextBidBaseAmount(pricing) >= pricing.buyNowBasePrice;
}

export function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// ─── Teklif Zaman Modeli ────────────────────────────────────────────
//
// Akıllı Teklif ilan yayınlandığı anda başlar (offerStartsAt = publishedAt) ve
// rezervasyon başlangıcından tam BUY_NOW_ONLY_WINDOW_HOURS saat önce kesin
// olarak kapanır (offerEndsAt = reservationStartAt - 12s). Sabit 48 saatlik
// açık artırma süresi bu modelde kullanılmaz.

export type OfferPhase = "live_offer" | "buy_now_only" | "reservation_started";

export function getOfferStartsAt(publishedAt: string): string {
  return publishedAt;
}

export function getOfferEndsAt(reservationStartAt: string): string {
  return new Date(
    new Date(reservationStartAt).getTime() - BUY_NOW_ONLY_WINDOW_MS
  ).toISOString();
}

export function getOfferPhase({
  reservationStartAt,
  currentTime,
}: {
  publishedAt: string;
  reservationStartAt: string;
  currentTime: number;
}): OfferPhase {
  const reservationStartMs = new Date(reservationStartAt).getTime();
  const offerEndsMs = reservationStartMs - BUY_NOW_ONLY_WINDOW_MS;

  if (currentTime >= reservationStartMs) return "reservation_started";
  if (currentTime >= offerEndsMs) return "buy_now_only";
  return "live_offer";
}

/** İlan yayınlanırken Akıllı Teklif başlatmaya yetecek kadar süre var mı. */
export function hasEnoughTimeForSmartOffer(
  reservationStartAt: string,
  publishedAt: string
): boolean {
  const reservationStartMs = new Date(reservationStartAt).getTime();
  const publishedMs = new Date(publishedAt).getTime();
  return reservationStartMs - publishedMs > BUY_NOW_ONLY_WINDOW_MS;
}

export interface CountdownParts {
  totalMs: number;
  hours: number;
  minutes: number;
  seconds: number;
  reached: boolean;
}

export function getCountdownParts(targetAt: string, now: number = Date.now()): CountdownParts {
  const diff = new Date(targetAt).getTime() - now;
  const reached = diff <= 0;
  const totalMs = Math.max(0, diff);
  const totalSeconds = Math.floor(totalMs / 1000);
  return {
    totalMs,
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    reached,
  };
}
