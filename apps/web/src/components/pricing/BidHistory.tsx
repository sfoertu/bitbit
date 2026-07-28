import type { BidRecord } from "@/data/listings";
import { formatMoney } from "@/lib/pricing";

function relativeTime(iso: string): string {
  const diffMinutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (diffMinutes < 1) return "az önce";
  if (diffMinutes < 60) return `${diffMinutes} dakika önce`;
  const hours = Math.round(diffMinutes / 60);
  if (hours < 24) return `${hours} saat önce`;
  return `${Math.round(hours / 24)} gün önce`;
}

export function BidHistory({
  bids,
  currency,
}: {
  bids: BidRecord[];
  currency: string;
}) {
  if (bids.length === 0) {
    return (
      <p className="text-[12.5px] text-white/35">
        Henüz teklif verilmedi. İlk teklifi sen verebilirsin.
      </p>
    );
  }

  const leaderId = bids[0]?.id;

  return (
    <ol className="space-y-3.5">
      {bids.map((bid) => (
        <li key={bid.id} className="relative border-l border-white/10 pl-4">
          <span
            aria-hidden="true"
            className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ${
              bid.id === leaderId ? "bg-[#D4A054]" : "bg-white/20"
            }`}
          />
          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-[13px] font-semibold ${
                bid.isCurrentUser ? "text-[#D4A054]" : "text-white"
              }`}
            >
              {bid.bidderName}
            </span>
            {bid.id === leaderId && (
              <span className="rounded-full bg-[#D4A054]/15 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-[#D4A054]">
                Lider
              </span>
            )}
          </div>
          <p className="mt-0.5 font-mono text-[12px] tabular-nums text-white/50">
            {formatMoney(bid.baseAmount, currency)} taban ·{" "}
            {formatMoney(bid.totalAmount, currency)} toplam
          </p>
          <p className="mt-0.5 text-[11px] text-white/30">
            {relativeTime(bid.createdAt)}
          </p>
        </li>
      ))}
    </ol>
  );
}
