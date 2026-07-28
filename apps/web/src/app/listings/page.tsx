import { mockListings } from "@/data/listings";
import { ListingCard } from "@/components/ListingCard";

export default function ListingsPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-[28px] font-bold text-white">
          İlanlar
        </h1>
        <p className="mt-1.5 text-[14px] text-white/40">
          Mevcut ikincil pazar ilanlarını keşfedin.
        </p>
      </div>

      {/* Filtre */}
      <div className="mb-6 flex flex-wrap gap-2">
        <FilterChip label="Tümü" active />
        <FilterChip label="🏨 Otel" />
        <FilterChip label="✈️ Uçuş" />
        <FilterChip label="🚗 Araç" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {mockListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
        active
          ? "bg-[#D4A054] text-[#0B2545]"
          : "border border-white/10 bg-transparent text-white/50 hover:border-[#D4A054]/30 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
