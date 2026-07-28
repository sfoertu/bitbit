"use client";

import { useEffect, useState } from "react";
import { getCountdownParts } from "@/lib/pricing";

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

/**
 * Faz-agnostik geri sayım. `targetAt`in ne anlama geldiğini (teklif bitişi mi,
 * rezervasyon başlangıcı mı) çağıran belirler ve `label` ile iletir.
 */
export function OfferCountdown({
  targetAt,
  label,
  size = "lg",
  className = "",
}: {
  targetAt: string;
  label?: string;
  size?: "sm" | "lg";
  className?: string;
}) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // İlk sunucu render'ında (now === null) yalnızca targetAt'a bağlı, zamana
  // bağlı olmayan sabit bir önizleme göster — hydration mismatch yaratmadan.
  const parts = getCountdownParts(targetAt, now ?? Date.parse(targetAt) - 1);
  const { hours, minutes, seconds } = parts;

  const state = hours >= 24 ? "gold" : hours >= 6 ? "amber" : "red";

  const colorClass = {
    gold: "text-[#D4A054]",
    amber: "text-[#E08A3C]",
    red: "text-[#E0555F]",
  }[state];

  const isUrgentPulse = parts.totalMs < 30 * 60 * 1000;
  const textSize = size === "sm" ? "text-[11.5px]" : "text-[14px]";

  const valueText =
    size === "sm" ? `${hours} sa` : `${pad(hours)} sa ${pad(minutes)} dk ${pad(seconds)} sn`;

  // aria-label yalnızca dakika hassasiyetinde değişir — screen reader'ı
  // saniyede bir rahatsız etmemek için.
  const accessibleLabel = `${label ? `${label}: ` : ""}${hours} saat ${minutes} dakika`;

  return (
    <div
      role="timer"
      aria-label={accessibleLabel}
      className={`inline-flex items-center gap-1.5 font-mono tabular-nums ${colorClass} ${className}`}
    >
      <span
        aria-hidden="true"
        className={isUrgentPulse ? "motion-safe:animate-pulse" : ""}
      >
        ⌛
      </span>
      <span aria-hidden="true" className={`font-semibold ${textSize}`}>
        {label ? `${label} ` : ""}
        {valueText}
      </span>
    </div>
  );
}
