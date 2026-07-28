# BITBIT V2 — Typography System

Font ailesi **değişmiyor** (yeni dependency kararı bu dokümanın kapsamı dışında — yalnızca öneri olarak not düşülüyor). Mevcut:

- `font-display` → Space Grotesk (başlıklar)
- `font-body` → Inter (gövde metni)
- `font-mono` → JetBrains Mono (yalnızca gerçek ürün verisi: fiyat, tarih, adım no, istatistik)

## Ölçek

| Rol | Mobile | Desktop (lg) | clamp() önerisi | Kullanım |
|---|---|---|---|---|
| Display XL | 42px / 2.625rem | 76px / 4.75rem | `clamp(2.625rem, 1.9rem + 3.2vw, 4.75rem)` | Yalnızca Hero H1 — sayfada tek |
| Display L | 32px / 2rem | 48px / 3rem | `clamp(2rem, 1.5rem + 2.2vw, 3rem)` | Marketplace Experience gibi 5/5 ağırlıklı ikinci section başlığı (Hero'dan belirgin küçük) |
| Section Heading | 28px / 1.75rem | 36px / 2.25rem | `clamp(1.75rem, 1.5rem + 1.1vw, 2.25rem)` | Standart section h2 (How It Works, Trust, Final CTA) |
| Card Heading | 16px / 1rem | 18px / 1.125rem | sabit (clamp gerekmez) | Kart/panel içi h3 — **tek skala**, şu an 14/16/20px karışık kullanılıyor, V2'de bu tek değere iner |
| Body Large | 15px | 16px | sabit | Hero/hero-ağırlıklı section açıklaması |
| Body | 14px | 14px | sabit | Standart section açıklaması, kart açıklaması |
| Caption | 12px | 13px | sabit | İkincil satır, kart metadata |
| Eyebrow | 10px | 10px | sabit | Uppercase, `tracking-widest`, mono, gold — **zaten tutarlı, değişmiyor** |
| Metadata | 11-13px | 11-13px | sabit | Mono, `tabular-nums` — yalnızca fiyat/tarih/adım no/istatistik değeri |

## Kurallar

1. **Hero başlığı tek şampiyondur.** Sayfada başka hiçbir metin Display XL kullanmaz.
2. **Section başlıkları Hero ile yarışmaz.** Section Heading tavanı 36px'tir (mevcut kodda zaten bu şekilde — korunuyor).
3. **Card Heading tek skaladır.** Şu an `CategoryCard` (20-22px), `TrustCard` (14px), `ListingCard` (14-17px), `ProcessStepCard` (16px) birbirinden farklı — V2'de hepsi 16-18px aralığına normalize edilir.
4. **Paragraf genişliği kontrollüdür.** Body/Body Large her zaman `max-w` ile sınırlanır (mevcut kodda zaten `max-w-[400px]` / `max-w-[440px]` gibi değerler kullanılıyor — bu pratik korunur, satır uzunluğu ~60-75 karakteri geçmemeli).
5. **Uzun açıklama yerine kısa metin.** Bir section açıklaması 2 cümleyi geçmez.
6. **Gereksiz uppercase yok.** Yalnızca eyebrow ve rozet/badge metinlerinde uppercase kullanılır; başlık veya gövde metninde uppercase kullanılmaz.
7. **Eyebrow küçük ve kontrollüdür.** 10px sabit, büyütülmez.
8. **Metadata yalnızca gerçek veri içindir.** Süsleme amaçlı mono font kullanımı yasak — yalnızca fiyat, tarih, adım numarası, istatistik değeri gibi gerçek ürün verisi mono/tabular olur.

## Font Dependency Notu

Mevcut 3 font ailesi (Space Grotesk / Inter / JetBrains Mono) referans görsellerdeki (hero.png, digital.png) geometrik sans-serif hissiyle zaten uyumlu — **yeni font eklenmesi gerekmiyor.** Bu, bir öneri değil bir gözlemdir; yeni dependency kararı bu doküman kapsamında verilmez.
