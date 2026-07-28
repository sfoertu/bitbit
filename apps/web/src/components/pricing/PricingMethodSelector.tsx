"use client";

import { useState } from "react";
import {
  calculateTotalAmount,
  calculatePlatformFee,
  formatMoney,
  hasEnoughTimeForSmartOffer,
  BUY_NOW_ONLY_WINDOW_HOURS,
} from "@/lib/pricing";
import { PriceBreakdown } from "./PriceBreakdown";

type Mode = "buy_now" | "smart_offer";
type IncrementType = "fixed" | "percentage";

export function PricingMethodSelector({ currency = "TRY" }: { currency?: string }) {
  const [mode, setMode] = useState<Mode>("buy_now");
  const [publishedAt] = useState(() => Date.now());

  const [salePrice, setSalePrice] = useState("");

  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [buyNowPrice, setBuyNowPrice] = useState("");
  const [incrementType, setIncrementType] = useState<IncrementType>("fixed");
  const [incrementValue, setIncrementValue] = useState("20");

  const salePriceNum = Number(salePrice);
  const startingPriceNum = Number(startingPrice);
  const buyNowPriceNum = Number(buyNowPrice);
  const incrementValueNum = Number(incrementValue);

  const reservationStartMs =
    reservationDate && reservationTime
      ? new Date(`${reservationDate}T${reservationTime}`).getTime()
      : null;

  const errors: Record<string, string> = {};
  if (mode === "buy_now") {
    if (!salePrice || salePriceNum <= 0) {
      errors.salePrice = "Satış fiyatı 0'dan büyük olmalı.";
    }
  } else {
    if (!reservationDate || !reservationTime) {
      errors.reservation = "Rezervasyon başlangıç tarihi ve saati girilmeli.";
    } else if (reservationStartMs !== null && reservationStartMs <= Date.now()) {
      errors.reservation = "Rezervasyon zamanı geçmişte olamaz.";
    }
    if (!startingPrice || startingPriceNum <= 0) {
      errors.startingPrice = "Başlangıç fiyatı 0'dan büyük olmalı.";
    }
    if (!buyNowPrice || buyNowPriceNum <= startingPriceNum) {
      errors.buyNowPrice = "Hemen Al fiyatı, başlangıç fiyatından büyük olmalı.";
    }
    if (incrementType === "fixed" && incrementValueNum <= 0) {
      errors.incrementValue = "Sabit artış 0'dan büyük olmalı.";
    }
    if (
      incrementType === "percentage" &&
      (incrementValueNum <= 0 || incrementValueNum >= 100)
    ) {
      errors.incrementValue = "Yüzde artış 0 ile 100 arasında olmalı.";
    }
    if (
      !errors.incrementValue &&
      startingPriceNum > 0 &&
      buyNowPriceNum > startingPriceNum
    ) {
      const nextBid =
        incrementType === "fixed"
          ? startingPriceNum + incrementValueNum
          : startingPriceNum * (1 + incrementValueNum / 100);
      if (nextBid > buyNowPriceNum) {
        errors.incrementValue =
          "Hesaplanan sonraki teklif, Hemen Al fiyatını aşamaz.";
      }
    }
  }

  const notEnoughTimeForOffer =
    mode === "smart_offer" &&
    !errors.reservation &&
    reservationStartMs !== null &&
    !hasEnoughTimeForSmartOffer(
      new Date(reservationStartMs).toISOString(),
      new Date(publishedAt).toISOString()
    );

  return (
    <section className="boarding-pass p-5">
      <h2 className="font-display text-[16px] font-bold text-white">
        Fiyatlandırma Yöntemi
      </h2>
      <p className="mt-1 text-[12.5px] text-white/40">
        Bu bölüm bir frontend prototipidir — gerçek bir ilan yayınlanmaz.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <ModeCard
          active={mode === "buy_now"}
          onClick={() => setMode("buy_now")}
          title="Hemen Al"
          description="Belirlediğin toplam fiyat üzerinden ilk satın alan rezervasyonu devralır."
        />
        <ModeCard
          active={mode === "smart_offer"}
          onClick={() => setMode("smart_offer")}
          title="Akıllı Teklif"
          description={`İlan yayınlandığı anda teklif dönemi başlar ve rezervasyon başlangıcından ${BUY_NOW_ONLY_WINDOW_HOURS} saat önce otomatik olarak sona erer. Son ${BUY_NOW_ONLY_WINDOW_HOURS} saatte rezervasyon yalnızca sabit Hemen Al fiyatıyla satın alınabilir.`}
        />
      </div>

      {mode === "buy_now" ? (
        <div className="mt-5 space-y-3">
          <Field
            id="sale-price"
            label="Satış Fiyatı"
            value={salePrice}
            onChange={setSalePrice}
            error={errors.salePrice}
          />

          {salePriceNum > 0 && (
            <div className="rounded-lg bg-white/[0.03] p-4">
              <PriceBreakdown
                rows={[
                  { label: "Satış Fiyatı", value: formatMoney(salePriceNum, currency) },
                  {
                    label: "Hizmet Bedeli (%5)",
                    value: formatMoney(calculatePlatformFee(salePriceNum), currency),
                  },
                ]}
                totalLabel="Alıcının Ödeyeceği Toplam"
                totalValue={formatMoney(calculateTotalAmount(salePriceNum), currency)}
                size="sm"
                footnote="Toplam tutara %5 BITBIT hizmet bedeli dahildir."
              />
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="reservation-date" className="block text-[12.5px] text-white/50">
                Rezervasyon Başlangıç Tarihi
              </label>
              <input
                id="reservation-date"
                type="date"
                value={reservationDate}
                onChange={(e) => setReservationDate(e.target.value)}
                aria-invalid={Boolean(errors.reservation)}
                aria-describedby={errors.reservation ? "reservation-error" : undefined}
                className="mt-1.5 min-h-[44px] w-full rounded-lg border border-white/10 bg-[#0B2545] px-3 text-[14px] text-white"
              />
            </div>
            <div>
              <label htmlFor="reservation-time" className="block text-[12.5px] text-white/50">
                Rezervasyon Başlangıç Saati
              </label>
              <input
                id="reservation-time"
                type="time"
                value={reservationTime}
                onChange={(e) => setReservationTime(e.target.value)}
                aria-invalid={Boolean(errors.reservation)}
                aria-describedby={errors.reservation ? "reservation-error" : undefined}
                className="mt-1.5 min-h-[44px] w-full rounded-lg border border-white/10 bg-[#0B2545] px-3 text-[14px] text-white"
              />
            </div>
          </div>
          {errors.reservation && (
            <p id="reservation-error" className="text-[11.5px] text-[#E0555F]">
              {errors.reservation}
            </p>
          )}

          {notEnoughTimeForOffer && (
            <div className="rounded-lg border border-[#D4A054]/25 bg-[#D4A054]/5 p-3.5 text-[12.5px] leading-relaxed text-[#D4A054]">
              Akıllı Teklif için yeterli süre kalmadı. İlan yalnızca Hemen Al
              olarak yayınlanacaktır.
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              id="starting-price"
              label="Başlangıç Fiyatı"
              value={startingPrice}
              onChange={setStartingPrice}
              error={errors.startingPrice}
            />
            <Field
              id="buy-now-price"
              label="Hemen Al Fiyatı"
              value={buyNowPrice}
              onChange={setBuyNowPrice}
              error={errors.buyNowPrice}
            />
          </div>

          <div>
            <span className="block text-[12.5px] text-white/50">
              Teklif Artış Yöntemi
            </span>
            <div className="mt-1.5 flex gap-2">
              <button
                type="button"
                onClick={() => setIncrementType("fixed")}
                className={`min-h-[44px] flex-1 rounded-lg border px-3 text-[12.5px] font-medium transition-colors ${
                  incrementType === "fixed"
                    ? "border-[#D4A054]/50 bg-[#D4A054]/10 text-[#D4A054]"
                    : "border-white/10 text-white/50 hover:bg-white/5"
                }`}
              >
                Sabit Artış
              </button>
              <button
                type="button"
                onClick={() => setIncrementType("percentage")}
                className={`min-h-[44px] flex-1 rounded-lg border px-3 text-[12.5px] font-medium transition-colors ${
                  incrementType === "percentage"
                    ? "border-[#D4A054]/50 bg-[#D4A054]/10 text-[#D4A054]"
                    : "border-white/10 text-white/50 hover:bg-white/5"
                }`}
              >
                Yüzde Artış
              </button>
            </div>
          </div>

          <Field
            id="increment-value"
            label={incrementType === "fixed" ? "Artış Değeri (tutar)" : "Artış Değeri (%)"}
            value={incrementValue}
            onChange={setIncrementValue}
            error={errors.incrementValue}
          />

          <div className="grid grid-cols-3 gap-3 text-[12px]">
            <ReadonlyBadge label="Teklif başlangıcı" value="İlan yayınlandığında" />
            <ReadonlyBadge
              label="Teklif bitişi"
              value={`Rezervasyondan ${BUY_NOW_ONLY_WINDOW_HOURS} saat önce`}
            />
            <ReadonlyBadge
              label="Son satış dönemi"
              value={`Rezervasyondan önceki son ${BUY_NOW_ONLY_WINDOW_HOURS} saat`}
            />
          </div>

          {startingPriceNum > 0 && buyNowPriceNum > startingPriceNum && (
            <div className="rounded-lg bg-white/[0.03] p-4">
              <PriceBreakdown
                rows={[
                  {
                    label: "Başlangıç Fiyatı",
                    value: formatMoney(startingPriceNum, currency),
                  },
                  {
                    label: "Hizmet Bedeli (%5)",
                    value: formatMoney(calculatePlatformFee(startingPriceNum), currency),
                  },
                ]}
                totalLabel="Başlangıç Toplamı"
                totalValue={formatMoney(calculateTotalAmount(startingPriceNum), currency)}
                size="sm"
              />
              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3 text-[13px]">
                <span className="text-white/45">Hemen Al Toplamı</span>
                <span className="font-mono tabular-nums text-white">
                  {formatMoney(calculateTotalAmount(buyNowPriceNum), currency)}
                </span>
              </div>
              <p className="mt-2 text-[10.5px] text-white/35">
                Toplam tutara %5 BITBIT hizmet bedeli dahildir.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function ModeCard({
  active,
  onClick,
  title,
  description,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-[44px] rounded-xl border p-4 text-left transition-colors ${
        active
          ? "border-[#D4A054]/50 bg-[#D4A054]/10"
          : "border-white/10 bg-white/[0.02] hover:border-white/20"
      }`}
    >
      <span
        className={`font-display text-[14px] font-bold ${active ? "text-[#D4A054]" : "text-white"}`}
      >
        {title}
      </span>
      <p className="mt-1 text-[12px] leading-relaxed text-white/45">
        {description}
      </p>
    </button>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[12.5px] text-white/50">
        {label}
      </label>
      <input
        id={id}
        type="number"
        min={0}
        step="0.01"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="mt-1.5 min-h-[44px] w-full rounded-lg border border-white/10 bg-[#0B2545] px-3 text-[14px] text-white"
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-[11.5px] text-[#E0555F]">
          {error}
        </p>
      )}
    </div>
  );
}

function ReadonlyBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
      <p className="text-white/35">{label}</p>
      <p className="mt-0.5 font-semibold text-white/70">{value}</p>
    </div>
  );
}
