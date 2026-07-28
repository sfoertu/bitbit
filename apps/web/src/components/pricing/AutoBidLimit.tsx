"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/pricing";

export function AutoBidLimit({
  currency,
  currentTotal,
  active,
  maxTotal,
  onActivate,
  onDeactivate,
  onSimulateCompetitor,
  disabled,
}: {
  currency: string;
  currentTotal: number;
  active: boolean;
  maxTotal: number | null;
  onActivate: (maxTotalAmount: number) => void;
  onDeactivate: () => void;
  onSimulateCompetitor: () => void;
  disabled?: boolean;
}) {
  const [inputValue, setInputValue] = useState(
    maxTotal ? String(maxTotal) : ""
  );
  const [error, setError] = useState<string | null>(null);

  function handleActivate() {
    const value = Number(inputValue);
    if (!value || value <= currentTotal) {
      setError("Limit, mevcut toplam tutardan büyük olmalı.");
      return;
    }
    setError(null);
    onActivate(value);
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <h3 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-white/40">
        Otomatik Teklif Limiti
      </h3>

      {!active ? (
        <>
          <label
            htmlFor="auto-bid-max"
            className="mt-2.5 block text-[12.5px] text-white/50"
          >
            Maksimum Toplam Bütçem
          </label>
          <div className="mt-1.5 flex gap-2">
            <input
              id="auto-bid-max"
              type="number"
              min={0}
              step="0.01"
              inputMode="decimal"
              disabled={disabled}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="min-h-[44px] w-full rounded-lg border border-white/10 bg-[#0B2545] px-3 text-[14px] text-white disabled:opacity-40"
            />
            <button
              onClick={handleActivate}
              disabled={disabled}
              className="min-h-[44px] flex-shrink-0 rounded-lg bg-[#D4A054] px-4 text-[13px] font-bold text-[#0B2545] disabled:opacity-40"
            >
              Aktif Et
            </button>
          </div>
          {error && (
            <p className="mt-1.5 text-[11.5px] text-[#E0555F]">{error}</p>
          )}
          <p className="mt-2 text-[11px] leading-relaxed text-white/30">
            Limit, %5 hizmet bedeli dahil toplam tutar üzerindendir. Bu bir
            frontend demosudur — sayfa yenilenince limit sıfırlanır.
          </p>
        </>
      ) : (
        <div className="mt-2.5 flex items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1B7A6B]/15 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#1B7A6B]">
              Otomatik teklif aktif
            </span>
            <p className="mt-1.5 text-[12px] text-white/45">
              Maks. toplam: {formatMoney(maxTotal ?? 0, currency)}
            </p>
          </div>
          <button
            onClick={onDeactivate}
            className="min-h-[44px] flex-shrink-0 rounded-lg border border-white/10 px-3 text-[12px] text-white/50 transition-colors hover:bg-white/5"
          >
            Kapat
          </button>
        </div>
      )}

      {!disabled && (
        <div className="mt-4 border-t border-white/5 pt-3">
          <button
            onClick={onSimulateCompetitor}
            className="min-h-[44px] w-full rounded-lg border border-dashed border-white/15 text-[11.5px] font-medium text-white/40 transition-colors hover:border-[#D4A054]/30 hover:text-white/60"
          >
            Demo: Rakip teklifi simüle et
          </button>
          <p className="mt-1 text-[10px] text-white/25">
            Bu buton yalnızca prototipi test etmek içindir — gerçek kullanıcı
            teklifi değildir.
          </p>
        </div>
      )}
    </div>
  );
}
