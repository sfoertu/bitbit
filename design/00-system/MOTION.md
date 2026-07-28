# BITBIT V2 — Motion Principles

Motion **minimal ve amaçlıdır.** Her animasyonun bir sebebi olmalı; "daha canlı görünsün diye" eklenen hareket yasak.

## İzin Verilen Hareketler

| Hareket | Ne zaman | Süre | Easing | Amaç |
|---|---|---|---|---|
| Image reveal | Görsel viewport'a girerken (scroll) | 400-600ms | `ease-out` | Sahne kompozisyonunun dikkatle "açılması" hissi |
| Subtle object float | Yalnızca Hero'daki tek device-mockup/hero-object üzerinde, sürekli çok hafif yukarı-aşağı | 3-4s döngü, ±4-6px | `ease-in-out` | Statik bir sahneyi "canlı" göstermek — **yalnızca bir yerde**, her objede değil |
| Text fade/slide | Başlık/açıklama ilk render'da | 300-400ms, 8-12px yukarı | `ease-out` | Girişte hafif odak |
| Card lift | Hover, yalnızca gerçek kart component'lerinde (`ListingCard`, `TrustCard`, `CategoryCard`) | 250-300ms | `ease-out` | Tıklanabilirlik sinyali |
| CTA hover | Arka plan/gölge/border değişimi | 200-250ms | `ease-out` | Standart etkileşim geri bildirimi |
| Route/bağlantı çizgisi | Sayfa/section ilk yüklendiğinde, bir kere çizilir | 500-700ms | `ease-out` | Sequence kalıbında (How Transfer Works) adımlar arası akışı göstermek |

## Yasak

- Her karta hover-glow eklemek (V1'de `CategoryCard`/`TrustCard` hover glow'u zaten var ve **kabul edilebilir** — ama bu, "her yeni component otomatik glow alır" kuralına dönüşmemeli, bilinçli seçim olmalı).
- Sürekli/dikkat dağıtan animasyon (yanıp sönme, sürekli parlama).
- Ağır parallax (mouse-move'a bağlı 3D katman kayması).
- 3D tilt/rotate hover efektleri.
- Ağır/çok katmanlı blur animasyonu (blur değerinin animasyonu GPU maliyeti yüksektir, mobilde performans düşürür).
- Mobilde performansı düşüren efektler (özellikle `filter`/`backdrop-filter` animasyonu — statik blur sorun değil, **animasyonlu** blur mobilde yasak).

## Reduced Motion

Tüm reveal/float/slide animasyonları `prefers-reduced-motion: reduce` durumunda:
- Float tamamen durur.
- Fade/slide, yalnızca opacity geçişine iner (pozisyon kayması olmadan).
- Hover lift/scale korunur (küçük, performansı etkilemez) ama süresi kısaltılabilir.

## Uygulama Notu

Motion, component'in **anlamına** bağlı olmalı: bir istatistik satırı float etmez (o bir veri, obje değil); yalnızca gerçek "hero object" (device mockup, ana görsel) float alabilir. Bir section'da en fazla bir float animasyonu olur.
