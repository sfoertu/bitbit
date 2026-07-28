import { OfferCountdown } from "./OfferCountdown";
import { formatMoney } from "@/lib/pricing";

export function SellerOfferSummary({
  currency,
  currentBaseAmount,
  buyerTotal,
  buyNowBasePrice,
  countdownTargetAt,
  bidCount,
  watcherCount,
  sellerReceives,
}: {
  currency: string;
  currentBaseAmount: number;
  buyerTotal: number;
  buyNowBasePrice: number;
  /** Rezervasyon başlangıcı — verilmezse (rezervasyon başladıysa) sayaç gösterilmez. */
  countdownTargetAt?: string;
  bidCount: number;
  watcherCount?: number;
  sellerReceives: number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-white/40">
          Satıcı Özeti
        </h3>
        <span className="font-mono text-[9px] uppercase tracking-widest text-white/25">
          Önizleme
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[12.5px]">
        <SummaryItem
          label="En yüksek taban teklif"
          value={formatMoney(currentBaseAmount, currency)}
        />
        <SummaryItem
          label="Alıcının ödeyeceği toplam"
          value={formatMoney(buyerTotal, currency)}
        />
        <SummaryItem label="Teklif sayısı" value={String(bidCount)} />
        <SummaryItem
          label="İzleyen sayısı"
          value={watcherCount != null ? `${watcherCount} (demo veri)` : "—"}
        />
        <SummaryItem
          label="Hemen Al taban fiyatı"
          value={formatMoney(buyNowBasePrice, currency)}
        />
        <SummaryItem
          label="Yaklaşık alacağın"
          value={formatMoney(sellerReceives, currency)}
        />
      </dl>

      {countdownTargetAt && (
        <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
          <span className="text-[11.5px] text-white/35">Rezervasyona kalan</span>
          <OfferCountdown targetAt={countdownTargetAt} size="sm" />
        </div>
      )}

      <p className="mt-2.5 text-[10px] leading-relaxed text-white/25">
        Hizmet bedeli alıcıdan tahsil edilir; satıcı taban satış fiyatını
        aynen alır, ikinci kez kesinti yapılmaz.
      </p>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10.5px] text-white/35">{label}</dt>
      <dd className="mt-0.5 font-mono tabular-nums text-white">{value}</dd>
    </div>
  );
}
