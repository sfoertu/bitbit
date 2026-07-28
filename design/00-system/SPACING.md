# BITBIT V2 — Spacing & Rhythm

8px taban birim. Tailwind spacing scale zaten bu tabanı kullanıyor (`p-1`=4px … `p-40`=160px) — yeni bir spacing sistemi kurulmuyor, **kullanım kuralı** tanımlanıyor.

## Ölçek ve Rolü

| px | Tailwind | Kullanım |
|---|---|---|
| 4 | `1` | ikon-metin arası mikro boşluk |
| 8 | `2` | badge iç boşluk, çok yakın öğe grupları |
| 12 | `3` | kart iç eleman aralığı |
| 16 | `4` | standart iç dolgu (küçük kart) |
| 24 | `6` | section içi yatay `px`, kart dolgusu (orta) |
| 32 | `8` | başlık-açıklama arası, grid `gap` |
| 48 | `12` | section header - içerik arası büyük boşluk |
| 64 | `16` | kompakt section `py` (How It Works, Trust) |
| 80 | `20` | orta section `py` |
| 96 | `24` | geniş section `py` (Marketplace Experience) |
| 128 | `32` | Hero `py` (desktop) |
| 160 | `40` | yalnızca Hero'nun en geniş nefes alanı gerektiği durumda üst sınır |

## Section `py` Kuralı

**Her section aynı `py` değerini kullanamaz.** Şu an homepage'deki tüm section'lar `py-20 sm:py-24` ile neredeyse birebir aynı — bu, hiyerarşiyi düzleştiriyor. V2 ritmi:

| Section | Ağırlık | Desktop `py` |
|---|---|---|
| Hero | 5/5 | 128-160px |
| Marketplace Experience | 5/5 | 96-128px |
| How Transfer Works | 3/5 | 64-80px |
| Trust / Infrastructure | 2/5 | 64-80px |
| Final CTA + Footer | 4/5 | 80-96px |

Yüksek ağırlıklı section'lar görsel olarak "nefes alır"; düşük ağırlıklı section'lar daha kompakt, sıkışık değil ama "hızlı okunur" hisси verir.

## İç Ritim Kuralları

- Section header (eyebrow+başlık+açıklama) ile içerik (görsel/kart) arası: minimum 32px (mobil) / 48px (desktop).
- Kart/panel iç dolgusu: küçük kart 16-20px, editorial panel 32-40px.
- Grid `gap`: standart kart grid'i 24px (`gap-6`), poster/split-stage kompozisyonda 48-64px (`gap-12`/`gap-16`) — bu şu an Hero ve How-It-Works split layout'ında zaten uygulanıyor (`md:gap-16`), korunur.

## Yasak

- Tüm section'ların birebir aynı `py` değerini kullanması yasak.
- Bir section içinde 3'ten fazla farklı `gap` değeri kullanılması (tutarsızlık sinyali) — section başına en fazla 2 farklı `gap` seviyesi (dış grid + iç eleman).
