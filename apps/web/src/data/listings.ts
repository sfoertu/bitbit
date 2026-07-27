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
}

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
  },
];
