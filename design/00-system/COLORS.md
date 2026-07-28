# BITBIT V2 — Color System

Kaynak: `apps/web/tailwind.config.ts`, `apps/web/src/app/globals.css` (mevcut, gerçek token'lar). Yeni hex uydurulmadı — yalnızca mevcut token'lara rol atanıyor veya kullanılmayan token'lara rol önerisi yapılıyor.

## Rol Tablosu

| Rol | Hex | Kaynak | Durum |
|---|---|---|---|
| Primary background | `#071A33` | `globals.css body{background}` | **Korunacak** |
| Secondary surface (koyu) | `#0B2545` | tailwind `navy.900` / `navy.DEFAULT` | **Korunacak** |
| Secondary surface (orta) | `#0A1E38` | mevcut section bg'lerinde kullanılıyor, tailwind config'de token yok | **Sadeleştirilecek** — bkz. aşağı |
| Primary text | `#FFFFFF` (heading) / `#E8EDF5` (gövde) | `globals.css body{color}` | **Korunacak** |
| Muted text | `white/50` | section açıklamaları | **Sadeleştirilecek** (bkz. aşağı) |
| Premium accent (tek vurgu) | `#D4A054` (`gold.DEFAULT`) | tailwind `gold` | **Korunacak** — biricik anlamlı vurgu |
| Success / olumlu durum | `#1B7A6B` (`turquoise.DEFAULT`) | tailwind `turquoise`, şu an `ListingCard` indirim rozetinde kullanılıyor | **Korunacak**, rolü netleştir: yalnızca "olumlu sinyal" (indirim, tamamlandı, doğrulandı) — dekoratif vurgu değil |
| Brand red / Error | `#8B1E3F` (`burgundy.DEFAULT`) | tailwind `burgundy`, **şu an UI'da hiç kullanılmıyor** | **Öneri (onay bekliyor)** — dormant token'a "hata/kritik" rolü verilmesi öneriliyor |
| Warning | `#A06E2E` (`gold.600`) | tailwind config'de mevcut, UI'da kullanılmıyor | **Öneri (onay bekliyor)** — yeni hex yerine mevcut `gold.600` kullanılması öneriliyor |
| Light editorial background | — | **yok** | **Kullanılmıyor** — BITBIT tamamen koyu tema marka kimliği; bu rol şu an için boş bırakılıyor (bkz. not) |
| Border (primary) | `white/10` | çoğu component border'ı | **Korunacak** |
| Border (subtle divider) | `white/5` | section ayraçları, Footer üst border | **Korunacak** |

## Not: Light Editorial Background

Genel template'lerde "açık zemin" rolü beklenir ama:
- Mevcut hiçbir section'da açık/light arkaplan kullanılmıyor.
- Yeni referans görsellerin (hero.png, digital.png, travel.png) tamamı koyu zemin üzerine kurulu.
- CLAUDE.md "genel koyu tema" korunmasını açıkça istiyor.

**Öneri:** bu rol V2'de kullanılmasın. Yalnızca gelecekte gerçek bir ihtiyaç doğarsa (ör. yazdırılabilir rezervasyon belgesi, e-posta şablonu) ayrı ele alınsın.

## Secondary Surface Sadeleştirmesi

Şu an 3 yakın navy tonu (#071A33 / #0A1E38 / #0B2545) section'lar arasında **dekoratif sırayla** (Hero→A→B→A→B) değişiyor, anlamlı bir role bağlı değil. V2 kuralı:

- `#071A33` → sayfa temel zemini (body, en dış katman)
- `#0B2545` → "yükseltilmiş" yüzey (kart arka planı, panel, Footer)
- `#0A1E38` → yalnızca ara katman ayrımı gereken yerlerde (iki `#0B2545` panel yan yana gelmesin diye) — dekoratif alternasyon için değil

## Muted Text Sadeleştirmesi

Şu an tespit edilen opaklık değerleri: `/55 /50 /45 /40 /38 /35 /30 /25` (8 farklı basamak, kodda dağınık). V2 için 3 basamağa indirilmesi önerilir:

| Basamak | Opaklık | Kullanım |
|---|---|---|
| Body muted | `white/60` | section açıklama paragrafı |
| Caption muted | `white/40` | kart açıklaması, metadata etiketi |
| Faint | `white/25` | telif hakkı, en düşük öncelikli metin |

Bu, mevcut kodu **değiştirmez** — yalnızca V2 uygulaması için hedef skalayı tanımlar.

## Section Başına Vurgu Rengi Kuralı

Her section'da **en fazla bir** anlamlı vurgu rengi olur:

- Varsayılan vurgu → gold.
- Turkuaz yalnızca gerçek bir "olumlu durum" verisi varsa görünür (indirim yüzdesi, "tamamlandı" işareti) — dekorasyon olarak eklenmez.
- Bordo (öneri onaylanırsa) yalnızca gerçek bir hata/uyarı durumunda görünür.
- Aynı section içinde gold + turkuaz + bordo aynı anda "vurgu" amacıyla kullanılmaz.
