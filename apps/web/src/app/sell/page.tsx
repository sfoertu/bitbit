import { PricingMethodSelector } from "@/components/pricing/PricingMethodSelector";

export default function SellPage() {
  return (
    <div className="mx-auto max-w-[720px] px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-[28px] font-bold text-white">
          Rezervasyonunu Listele
        </h1>
        <p className="mt-1.5 text-[14px] text-white/40">
          İlanın için fiyatlandırma yöntemini seç. Bu ekran bir frontend
          prototipidir — gerçek bir ilan yayınlanmaz.
        </p>
      </div>

      <PricingMethodSelector />
    </div>
  );
}
