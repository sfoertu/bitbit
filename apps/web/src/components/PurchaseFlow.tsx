"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  getQuote,
  executeOnramp,
  getOnrampStatus,
  type QuoteResponse,
  type ExecuteResponse,
} from "@/lib/api";
import type { Listing } from "@/data/listings";

type FlowStep = "quote" | "confirm" | "processing" | "completed" | "failed";

export function PurchaseFlow({ listing }: { listing: Listing }) {
  const [step, setStep] = useState<FlowStep>("quote");
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [result, setResult] = useState<ExecuteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  async function handleGetQuote() {
    setLoading(true);
    setError(null);
    try {
      const q = await getQuote(
        listing.listPrice,
        listing.currency,
        listing.providerType
      );
      setQuote(q);
      setStep("confirm");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    setStep("processing");
    setLoading(true);
    setError(null);

    const idempotencyKey = uuidv4();

    try {
      const res = await executeOnramp({
        idempotency_key: idempotencyKey,
        amount_fiat: listing.listPrice,
        currency: listing.currency,
        provider_type: listing.providerType,
        card_token: "tok_test_visa_4242",
        reservation_hash: `0x${idempotencyKey.replace(/-/g, "")}`,
      });

      setResult(res);

      if (res.onramp_status === "completed") {
        setStep("completed");
      } else {
        setStep("failed");
        setIsFailed(true);
      }
    } catch (err: any) {
      setError(err.message);
      setStep("failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckStatus() {
    if (!result) return;
    setLoading(true);
    try {
      const status = await getOnrampStatus(result.idempotency_key);
      if (status.status === "completed") {
        setStep("completed");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="boarding-pass">
      {/* Başlık */}
      <div className="border-b border-white/5 p-5">
        <h2 className="font-display text-[16px] font-bold text-white">
          Satın Alma
        </h2>
      </div>

      <div className="p-5">
        {/* Adım 1: Quote */}
        {step === "quote" && (
          <div>
            <p className="text-[13px] text-white/45">
              {formatPrice(listing.listPrice)} karşılığında rezervasyon
              satın alınacak.
            </p>
            <button
              onClick={handleGetQuote}
              disabled={loading}
              className="btn-primary mt-4 w-full"
            >
              {loading ? "Hesaplanıyor..." : "Ücret Hesapla"}
            </button>
          </div>
        )}

        {/* Adım 2: Onay */}
        {step === "confirm" && quote && (
          <div className="space-y-3">
            <div className="rounded-lg bg-[#0B2545]/60 p-4 text-[13px]">
              <h3 className="font-display font-bold text-white">
                Ücret Dağılımı
              </h3>
              <div className="mt-2 space-y-1">
                <Row
                  label="İşlem tutarı"
                  value={formatPrice(quote.amount_fiat)}
                />
                <Row
                  label="Döviz kuru"
                  value={`${quote.exchange_rate} TRY/USDC`}
                />
                <Row
                  label="Kart ücreti"
                  value={formatPrice(quote.fee_breakdown.card_fee)}
                />
                <Row
                  label="Gas ücreti"
                  value={formatPrice(quote.fee_breakdown.gas_fee)}
                />
                <Row
                  label="Platform (%5)"
                  value={formatPrice(quote.fee_breakdown.platform_fee)}
                />
                <div className="border-t border-white/5 pt-1 font-semibold">
                  <Row
                    label="Net USDC"
                    value={`${quote.amount_usdc.toFixed(2)} USDC`}
                  />
                </div>
                <div className="border-t border-white/10 pt-2 text-[14px] font-bold">
                  <Row
                    label="Toplam Tutar"
                    value={formatPrice(quote.amount_fiat)}
                  />
                </div>
              </div>
              <p className="mt-2 font-mono text-[10px] text-white/25">
                Teklif{" "}
                {new Date(quote.expires_at).toLocaleTimeString("tr-TR")} kadar
                geçerli.
              </p>
              <p className="mt-1 text-[10.5px] text-white/35">
                Toplam tutara tüm vergiler dahildir.
              </p>
            </div>

            <button
              onClick={handleConfirm}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "İşleniyor..." : "Ödemeyi Onayla"}
            </button>
          </div>
        )}

        {/* Adım 3: İşleniyor */}
        {step === "processing" && (
          <div className="py-8 text-center">
            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-[3px] border-[#D4A054]/20 border-t-[#D4A054]" />
            <p className="mt-3 text-[13px] text-white/45">Ödeme işleniyor...</p>
            <button
              onClick={handleCheckStatus}
              disabled={loading}
              className="mt-3 font-mono text-[11px] text-[#D4A054] hover:underline"
            >
              Durumu yenile
            </button>
          </div>
        )}

        {/* Tamamlandı */}
        {step === "completed" && (
          <div className="rounded-lg border border-[#1B7A6B]/20 bg-[#1B7A6B]/5 p-4 text-center">
            <p className="font-display text-[16px] font-bold text-[#1B7A6B]">
              ✓ Satın Alma Tamamlandı
            </p>
            <p className="mt-1 text-[13px] text-[#1B7A6B]/70">
              Rezervasyonunuz escrow&apos;a kilitlendi. Satıcıya USDC
              gönderildi.
            </p>
            {result && (
              <p className="mt-2 font-mono text-[10px] text-[#1B7A6B]/40">
                Referans: {result.provider_reference}
              </p>
            )}
          </div>
        )}

        {/* Başarısız */}
        {step === "failed" && (
          <div className="rounded-lg border border-[#8B1E3F]/20 bg-[#8B1E3F]/5 p-4 text-center">
            <p className="font-display text-[16px] font-bold text-[#8B1E3F]">
              ✕ İşlem Başarısız
            </p>
            <p className="mt-1 text-[13px] text-[#8B1E3F]/70">
              {error || "Ödeme işlenirken bir hata oluştu."}
            </p>
            <button
              onClick={() => {
                setStep("quote");
                setResult(null);
                setError(null);
              }}
              className="mt-3 font-mono text-[11px] text-[#D4A054] hover:underline"
            >
              Tekrar dene
            </button>
          </div>
        )}

        {error && step !== "failed" && (
          <p className="mt-3 text-[13px] text-[#8B1E3F]">{error}</p>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-white/45">{label}</span>
      <span className="font-mono tabular-nums text-white">{value}</span>
    </div>
  );
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
  }).format(price);
}
