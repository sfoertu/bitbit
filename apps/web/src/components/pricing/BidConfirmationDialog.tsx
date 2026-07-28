"use client";

import { useEffect, useRef } from "react";
import { PriceBreakdown } from "./PriceBreakdown";
import { formatMoney } from "@/lib/pricing";

export function BidConfirmationDialog({
  open,
  title,
  description,
  baseAmount,
  currency,
  ctaLabel,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  baseAmount: number;
  currency: string;
  ctaLabel: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement;
    const dialogEl = dialogRef.current;
    const focusable = dialogEl
      ? Array.from(
          dialogEl.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        )
      : [];
    focusable[0]?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && focusable.length > 0) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const fee = baseAmount * 0.05;
  const total = baseAmount + fee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bid-confirm-title"
        className="relative w-full max-w-[380px] rounded-2xl border border-white/10 bg-[#0E2A4D] p-6 shadow-2xl"
      >
        <h2
          id="bid-confirm-title"
          className="font-display text-[17px] font-bold text-white"
        >
          {title}
        </h2>

        <div className="mt-4">
          <PriceBreakdown
            rows={[
              {
                label: title.includes("Hemen Al") ? "Hemen Al Fiyatı" : "Yeni teklif",
                value: formatMoney(baseAmount, currency),
              },
              {
                label: "Hizmet bedeli (%5)",
                value: formatMoney(fee, currency),
              },
            ]}
            totalLabel="Ödeyeceğin toplam"
            totalValue={formatMoney(total, currency)}
            size="sm"
          />
        </div>

        <p className="mt-3 text-[12.5px] leading-relaxed text-white/45">
          {description}
        </p>

        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={onConfirm}
            className="btn-primary min-h-[44px] w-full"
          >
            {ctaLabel}
          </button>
          <button
            onClick={onClose}
            className="min-h-[44px] w-full rounded-lg border border-white/10 text-[13px] font-medium text-white/60 transition-colors hover:bg-white/5"
          >
            Vazgeç
          </button>
        </div>
      </div>
    </div>
  );
}
