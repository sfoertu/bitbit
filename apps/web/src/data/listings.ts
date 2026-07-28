// NOT: `pricing` alanı ve altındaki Akıllı Teklif/Hemen Al modeli tamamen
// frontend prototipidir. Gerçek backend açık artırma motoru, ödeme veya
// rezervasyon transferi mantığı içermez — yalnızca mock veridir.
//
// BACKEND KARARI (henüz uygulanmadı): `checkInDate` (tarih-only, görüntüleme
// amaçlı) ve `SmartOfferPricing.reservationStartAt` (hassas ISO datetime, faz
// hesabı için) şu an kasıtlı olarak birbirinden bağımsız. Gerçek production
// modelinde rezervasyon başlangıcı için TEK canonical datetime alanı
// olmalı — bu iki alan kalıcı olarak ayrı bırakılmamalı.

export type PricingMode = "buy_now" | "smart_offer";

export interface BidRecord {
  id: string;
  bidderName: string;
  baseAmount: number;
  totalAmount: number;
  createdAt: string;
  isCurrentUser?: boolean;
}

export interface BuyNowPricing {
  pricingMode: "buy_now";
  basePrice: number;
}

export interface SmartOfferPricing {
  pricingMode: "smart_offer";
  startingBasePrice: number;
  currentBasePrice: number;
  buyNowBasePrice: number;
  minimumIncrementType: "fixed" | "percentage";
  minimumIncrementValue: number;
  /** Teklif dönemi bu anda başlar (offerStartsAt = publishedAt). */
  publishedAt: string;
  /** Rezervasyonun fiilen başladığı an — offerEndsAt bundan 12 saat öncesidir. */
  reservationStartAt: string;
  bidHistory: BidRecord[];
  watcherCount?: number;
}

export type ListingPricing = BuyNowPricing | SmartOfferPricing;

export interface Listing {
  id: string;
  title: string;
  provider: string;
  providerType: "hotel" | "airline" | "car_rental";
  originalPrice: number;
  listPrice: number;
  currency: string;
  checkInDate: string;
  checkOutDate?: string;
  location: string;
  imageUrl: string;
  /** Frontend-only prototip alanı — Hemen Al / Akıllı Teklif. Yoksa Hemen Al varsayılır. */
  pricing?: ListingPricing;
}

const HOUR = 60 * 60 * 1000;
const MINUTE = 60 * 1000;
const now = Date.now();

export const mockListings: Listing[] = [
  {
    id: "lst-001",
    title: "Kapadokya Butik Otel — 2 Gece",
    provider: "Sultan Cave Suites",
    providerType: "hotel",
    originalPrice: 12000,
    listPrice: 8400,
    currency: "TRY",
    checkInDate: "2026-08-15",
    checkOutDate: "2026-08-17",
    location: "Nevşehir, Türkiye",
    imageUrl: "/placeholder-hotel.svg",
    // Senaryo 1: Hemen Al ilanı
    pricing: { pricingMode: "buy_now", basePrice: 8400 },
  },
  {
    id: "lst-002",
    title: "İstanbul → Antalya Gidiş-Dönüş",
    provider: "Türk Hava Yolları",
    providerType: "airline",
    originalPrice: 4500,
    listPrice: 3150,
    currency: "TRY",
    checkInDate: "2026-09-01",
    location: "IST → AYT",
    imageUrl: "/placeholder-flight.svg",
    // Senaryo 2: Yeni yayınlanmış Akıllı Teklif, rezervasyona 60 saat var (LIVE_OFFER)
    pricing: {
      pricingMode: "smart_offer",
      startingBasePrice: 2200,
      currentBasePrice: 2200,
      buyNowBasePrice: 3150,
      minimumIncrementType: "fixed",
      minimumIncrementValue: 50,
      publishedAt: new Date(now - 5 * MINUTE).toISOString(),
      reservationStartAt: new Date(now + 60 * HOUR).toISOString(),
      watcherCount: 6,
      bidHistory: [],
    },
  },
  {
    id: "lst-003",
    title: "Bodrum Resort & Spa — 5 Gece Yarım Pansiyon",
    provider: "Hilton Bodrum",
    providerType: "hotel",
    originalPrice: 28000,
    listPrice: 19600,
    currency: "TRY",
    checkInDate: "2026-08-20",
    checkOutDate: "2026-08-25",
    location: "Bodrum, Muğla",
    imageUrl: "/placeholder-hotel.svg",
    // Senaryo 3: Aktif teklif, rezervasyona 30 saat var (LIVE_OFFER)
    pricing: {
      pricingMode: "smart_offer",
      startingBasePrice: 14000,
      currentBasePrice: 15400,
      buyNowBasePrice: 19600,
      minimumIncrementType: "percentage",
      minimumIncrementValue: 5,
      publishedAt: new Date(now - 20 * HOUR).toISOString(),
      reservationStartAt: new Date(now + 30 * HOUR).toISOString(),
      watcherCount: 14,
      bidHistory: [
        {
          id: "bid-lst003-1",
          bidderName: "Kullanıcı A",
          baseAmount: 14000,
          totalAmount: 14700,
          createdAt: new Date(now - 18 * HOUR).toISOString(),
        },
        {
          id: "bid-lst003-2",
          bidderName: "Kullanıcı B",
          baseAmount: 14700,
          totalAmount: 15435,
          createdAt: new Date(now - 10 * HOUR).toISOString(),
        },
        {
          id: "bid-lst003-3",
          bidderName: "Kullanıcı A",
          baseAmount: 15400,
          totalAmount: 16170,
          createdAt: new Date(now - 3 * HOUR).toISOString(),
        },
      ],
    },
  },
  {
    id: "lst-004",
    title: "Ankara → İzmir Tek Yön",
    provider: "AnadoluJet",
    providerType: "airline",
    originalPrice: 1800,
    listPrice: 1260,
    currency: "TRY",
    checkInDate: "2026-07-30",
    location: "ESB → ADB",
    imageUrl: "/placeholder-flight.svg",
    // Senaryo 4: Aktif teklif, rezervasyona 12 saat 30 dakika var (LIVE_OFFER — kapanışa 30 dk kalmış)
    pricing: {
      pricingMode: "smart_offer",
      startingBasePrice: 900,
      currentBasePrice: 1150,
      buyNowBasePrice: 1260,
      minimumIncrementType: "fixed",
      minimumIncrementValue: 20,
      publishedAt: new Date(now - 44 * HOUR).toISOString(),
      reservationStartAt: new Date(now + 12 * HOUR + 30 * MINUTE).toISOString(),
      watcherCount: 9,
      bidHistory: [
        {
          id: "bid-lst004-1",
          bidderName: "Kullanıcı A",
          baseAmount: 900,
          totalAmount: 945,
          createdAt: new Date(now - 40 * HOUR).toISOString(),
        },
        {
          id: "bid-lst004-2",
          bidderName: "Kullanıcı B",
          baseAmount: 1150,
          totalAmount: 1207.5,
          createdAt: new Date(now - 5 * HOUR).toISOString(),
        },
      ],
    },
  },
  {
    id: "lst-005",
    title: "Antalya Havalimanı — 7 Gün Araç Kiralama",
    provider: "Enterprise",
    providerType: "car_rental",
    originalPrice: 5600,
    listPrice: 3920,
    currency: "TRY",
    checkInDate: "2026-08-10",
    checkOutDate: "2026-08-17",
    location: "Antalya Havalimanı",
    imageUrl: "/placeholder-car.svg",
    // Senaryo 5: Son satış dönemi, rezervasyona 11 saat var (BUY_NOW_ONLY)
    pricing: {
      pricingMode: "smart_offer",
      startingBasePrice: 2800,
      currentBasePrice: 3400,
      buyNowBasePrice: 3920,
      minimumIncrementType: "fixed",
      minimumIncrementValue: 40,
      publishedAt: new Date(now - 40 * HOUR).toISOString(),
      reservationStartAt: new Date(now + 11 * HOUR).toISOString(),
      watcherCount: 4,
      bidHistory: [
        {
          id: "bid-lst005-1",
          bidderName: "Kullanıcı A",
          baseAmount: 2800,
          totalAmount: 2940,
          createdAt: new Date(now - 30 * HOUR).toISOString(),
        },
        {
          id: "bid-lst005-2",
          bidderName: "Kullanıcı B",
          baseAmount: 3400,
          totalAmount: 3570,
          createdAt: new Date(now - 14 * HOUR).toISOString(),
        },
      ],
    },
  },
  {
    id: "lst-006",
    title: "Trabzon Dağ Evi — 3 Gece",
    provider: "Zorlu Grand Hotel",
    providerType: "hotel",
    originalPrice: 7500,
    listPrice: 5250,
    currency: "TRY",
    checkInDate: "2026-09-10",
    checkOutDate: "2026-09-13",
    location: "Trabzon, Türkiye",
    imageUrl: "/placeholder-hotel.svg",
    // Senaryo 6: Son satış dönemi, rezervasyona 30 dakika var (BUY_NOW_ONLY, acil)
    pricing: {
      pricingMode: "smart_offer",
      startingBasePrice: 3800,
      currentBasePrice: 4600,
      buyNowBasePrice: 5250,
      minimumIncrementType: "fixed",
      minimumIncrementValue: 50,
      publishedAt: new Date(now - 50 * HOUR).toISOString(),
      reservationStartAt: new Date(now + 30 * MINUTE).toISOString(),
      watcherCount: 11,
      bidHistory: [
        {
          id: "bid-lst006-1",
          bidderName: "Kullanıcı A",
          baseAmount: 3800,
          totalAmount: 3990,
          createdAt: new Date(now - 48 * HOUR).toISOString(),
        },
        {
          id: "bid-lst006-2",
          bidderName: "Kullanıcı B",
          baseAmount: 4600,
          totalAmount: 4830,
          createdAt: new Date(now - 13 * HOUR).toISOString(),
        },
      ],
    },
  },
  {
    id: "lst-007",
    title: "Fethiye Yat Turu — Günübirlik",
    provider: "Blue Cruise Fethiye",
    providerType: "car_rental",
    originalPrice: 4200,
    listPrice: 3600,
    currency: "TRY",
    checkInDate: "2026-08-22",
    location: "Fethiye, Muğla",
    // Senaryo 7: Rezervasyon başlamış (RESERVATION_STARTED)
    pricing: {
      pricingMode: "smart_offer",
      startingBasePrice: 2600,
      currentBasePrice: 3450,
      buyNowBasePrice: 3600,
      minimumIncrementType: "fixed",
      minimumIncrementValue: 150,
      publishedAt: new Date(now - 70 * HOUR).toISOString(),
      reservationStartAt: new Date(now - 3 * HOUR).toISOString(),
      watcherCount: 17,
      bidHistory: [
        {
          id: "bid-lst007-1",
          bidderName: "Kullanıcı A",
          baseAmount: 2600,
          totalAmount: 2730,
          createdAt: new Date(now - 60 * HOUR).toISOString(),
        },
        {
          id: "bid-lst007-2",
          bidderName: "Kullanıcı B",
          baseAmount: 3450,
          totalAmount: 3622.5,
          createdAt: new Date(now - 16 * HOUR).toISOString(),
        },
      ],
    },
    imageUrl: "/placeholder-car.svg",
  },
  {
    id: "lst-008",
    title: "İzmir → Girne Gidiş-Dönüş",
    provider: "Pegasus",
    providerType: "airline",
    originalPrice: 3300,
    listPrice: 2850,
    currency: "TRY",
    checkInDate: "2026-09-05",
    location: "ADB → ECN",
    imageUrl: "/placeholder-flight.svg",
    // Senaryo 8: İlan yayınlandığında rezervasyona 8 saat kalan — doğrudan BUY_NOW_ONLY
    // (publishedAt anında reservationStartAt - 12s zaten geçmişti, hiç LIVE_OFFER olmadı)
    pricing: {
      pricingMode: "smart_offer",
      startingBasePrice: 1800,
      currentBasePrice: 1800,
      buyNowBasePrice: 2850,
      minimumIncrementType: "fixed",
      minimumIncrementValue: 60,
      publishedAt: new Date(now - 2 * HOUR).toISOString(),
      reservationStartAt: new Date(now - 2 * HOUR + 8 * HOUR).toISOString(),
      watcherCount: 8,
      bidHistory: [],
    },
  },
  {
    id: "lst-009",
    title: "Çeşme Butik Otel — 2 Gece",
    provider: "Alaçatı Beach Resort",
    providerType: "hotel",
    originalPrice: 9800,
    listPrice: 8200,
    currency: "TRY",
    checkInDate: "2026-08-28",
    checkOutDate: "2026-08-30",
    location: "Çeşme, İzmir",
    imageUrl: "/placeholder-hotel.svg",
    // Senaryo 9: Sonraki teklif Hemen Al tavanına yaklaşmış aktif ilan (LIVE_OFFER)
    pricing: {
      pricingMode: "smart_offer",
      startingBasePrice: 6000,
      currentBasePrice: 7850,
      buyNowBasePrice: 8200,
      minimumIncrementType: "fixed",
      minimumIncrementValue: 350,
      publishedAt: new Date(now - 30 * HOUR).toISOString(),
      reservationStartAt: new Date(now + 20 * HOUR).toISOString(),
      watcherCount: 19,
      bidHistory: [
        {
          id: "bid-lst009-1",
          bidderName: "Kullanıcı A",
          baseAmount: 6000,
          totalAmount: 6300,
          createdAt: new Date(now - 26 * HOUR).toISOString(),
        },
        {
          id: "bid-lst009-2",
          bidderName: "Kullanıcı B",
          baseAmount: 7850,
          totalAmount: 8242.5,
          createdAt: new Date(now - 4 * HOUR).toISOString(),
        },
      ],
    },
  },
  {
    id: "lst-010",
    title: "İzmir → Antalya Gidiş-Dönüş",
    provider: "SunExpress",
    providerType: "airline",
    originalPrice: 2600,
    listPrice: 2250,
    currency: "TRY",
    checkInDate: "2026-09-12",
    location: "ADB → AYT",
    imageUrl: "/placeholder-flight.svg",
    // Senaryo 10: Auto Bid aktif test senaryosu (LIVE_OFFER, orta vadeli)
    pricing: {
      pricingMode: "smart_offer",
      startingBasePrice: 1800,
      currentBasePrice: 2100,
      buyNowBasePrice: 2850,
      minimumIncrementType: "fixed",
      minimumIncrementValue: 60,
      publishedAt: new Date(now - 15 * HOUR).toISOString(),
      reservationStartAt: new Date(now + 25 * HOUR).toISOString(),
      watcherCount: 8,
      bidHistory: [
        {
          id: "bid-lst010-1",
          bidderName: "Kullanıcı A",
          baseAmount: 1800,
          totalAmount: 1890,
          createdAt: new Date(now - 14 * HOUR).toISOString(),
        },
        {
          id: "bid-lst010-2",
          bidderName: "Kullanıcı B",
          baseAmount: 1980,
          totalAmount: 2079,
          createdAt: new Date(now - 9 * HOUR).toISOString(),
        },
        {
          id: "bid-lst010-3",
          bidderName: "Kullanıcı A",
          baseAmount: 2100,
          totalAmount: 2205,
          createdAt: new Date(now - 2 * HOUR).toISOString(),
        },
      ],
    },
  },
];
