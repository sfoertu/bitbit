export function PriceBreakdown({
  rows,
  totalLabel,
  totalValue,
  footnote,
  size = "lg",
}: {
  rows: { label: string; value: string; muted?: boolean }[];
  totalLabel: string;
  totalValue: string;
  footnote?: string;
  size?: "sm" | "lg";
}) {
  return (
    <div className="space-y-1.5 text-[13px]">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between">
          <span className="text-white/45">{row.label}</span>
          <span
            className={`font-mono tabular-nums ${row.muted ? "text-white/40" : "text-white"}`}
          >
            {row.value}
          </span>
        </div>
      ))}
      <div
        className={`flex items-center justify-between border-t border-white/10 pt-2 font-bold ${
          size === "lg" ? "text-[18px]" : "text-[15px]"
        }`}
      >
        <span className="text-white">{totalLabel}</span>
        <span className="font-mono tabular-nums text-[#D4A054]">
          {totalValue}
        </span>
      </div>
      {footnote && (
        <p className="pt-0.5 text-[10.5px] leading-relaxed text-white/35">
          {footnote}
        </p>
      )}
    </div>
  );
}
