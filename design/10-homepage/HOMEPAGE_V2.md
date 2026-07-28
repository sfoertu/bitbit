# BITBIT Homepage V2 — Kompozisyon Spesifikasyonu

Bu dosya bir **kod değişikliği değil, dokümantasyondur.** Aşağıdaki yapı, sonraki (henüz onaylanmamış) Homepage Redesign V2 çalışması için bağlayıcı kaynaktır. Uygulama sırasında önce [`../00-system/DESIGN_SYSTEM_V2.md`](../00-system/DESIGN_SYSTEM_V2.md) okunmalı.

## Section Listesi ve Ağırlık

| # | Section | Ağırlık | Kompozisyon kalıbı |
|---|---|---|---|
| 1 | Navbar | — (sabit, ağırlık dışı) | — |
| 2 | Hero | 5/5 | Split-stage |
| 3 | Marketplace Experience | 5/5 | Editorial grid (atmosfer) + gerçek ilan grid'i |
| 4 | How Transfer Works | 3/5 | Poster panel + Sequence |
| 5 | Trust / Infrastructure | 2/5 | Düz ikon satırı (kart değil) |
| 6 | Final CTA + Footer | 4/5 | Split-stage (kısa) |

**Not — Categories'in durumu:** Mevcut sitede "Kategoriler" ve "Öne Çıkan İlanlar" ayrı iki section, ikisi de aynı 3-kolon kart grid kalıbını tekrarlıyor (referans dilindeki "aynı yoğunluk, aynı grid" hatası). Seçilmiş görseller (`travel.png` editorial collage + gerçek `ListingCard` verisi) birlikte değerlendirildiğinde, **Categories'in ayrı bir ana section olarak kalmaması, "Marketplace Experience" içinde atmosfer katmanına dönüşmesi öneriliyor.** Bu yalnızca dokümante edilen bir öneridir — kod değişmedi, section silinmedi. Onay kullanıcıya aittir.

---

## 1. Navbar

Değişmiyor. Mevcut linkler (`Ana Sayfa`, `İlanlar`, `Nasıl Çalışır?`, `Giriş Yap`) ve aktif-sayfa vurgusu korunur.

---

## 2. Hero

- **Amacı:** İlk 3 saniyede "ne olduğunu" ve "neden güvenilir olduğunu" hissettirmek.
- **Ana mesajı:** *"Kullanamayacağın seyahat rezervasyonunun değerini kaybetme."* — mevcut "İadesiz Rezervasyonunu Güvenle Devret." başlığı bu kavramla uyumlu, korunabilir.
- **Kullanılacak görsel:** mevcut `hero.webp` (gece havalimanı/uçak) — **değişmiyor.**
- **Layout türü:** Split-stage.
- **Desktop kompozisyon:** Sol: eyebrow + 3 satır başlık + kısa açıklama + 2 CTA. Sağ: mevcut görsel, full-bleed arka plan olarak (mevcut yaklaşım korunur, ayrı bir "sağ obje" eklenmez — çünkü zaten arka plan görseli bu rolü üstleniyor).
- **Mobile kompozisyon:** Başlık → açıklama → CTA'lar → (varsa) istatistik satırı. Görsel, arka plan olarak kalır (mevcut çözüm zaten doğru).
- **Metin yoğunluğu:** Çok düşük — 1 başlık, 1 kısa açıklama cümlesi.
- **CTA:** Primary "İlanları Keşfet" (`/listings`), Secondary "Nasıl Çalışır?" (`/how-it-works`).
- **Section yüksekliği:** Geniş (mevcut `md:min-h-[700px]` civarı korunabilir).
- **Görsel ağırlığı:** Çok yüksek (tam arka plan).
- **Sonraki bölüme geçiş:** Marketplace Experience — koyu tondan koyu tona yumuşak geçiş, aradaki `border-white/5` ayracı korunur.

---

## 3. Marketplace Experience *(Categories + Featured Listings birleşim önerisi)*

- **Amacı:** "Burada gerçekten ne satılıyor" sorusunu tek bakışta cevaplamak — kategori atmosferi + gerçek, dolu ilan verisi birlikte.
- **Ana mesajı:** *"Uçuş, otel, araç — herhangi bir rezervasyonun ikinci bir değeri var."*
- **Kullanılacak görsel:** Atmosfer katmanı için `travel.png` kompozisyon dili (editorial collage) — **doğrudan travel.png kullanılmaz**, aynı dilde (grid, gün batımı/gece tonları, gerçek ürün fotoğrafı) yeni bir düzen önerilir; veri katmanında mevcut `ListingCard` (gerçek `mockListings` verisi) korunur.
- **Layout türü:** Üstte kısa editorial görsel şerit (atmosfer, veri taşımaz) + altta gerçek `ListingCard` grid'i (mevcut `variant="featured"` korunur).
- **Desktop kompozisyon:** Section header (eyebrow+başlık+açıklama, sol hizalı) → 3-4 görselli dar editorial şerit → 3 kolon gerçek ilan kartı.
- **Mobile kompozisyon:** Header → editorial şerit tek sıra (yatay scroll yerine sabit 2-3 görsel) → ilan kartları tek kolon.
- **Metin yoğunluğu:** Orta — başlık + 1 açıklama + kart başına kısa veri (mevcut `ListingCard` metni değişmiyor).
- **CTA:** "Tüm İlanları Gör" (`/listings`) — mevcut, korunur.
- **Section yüksekliği:** Geniş (5/5 ağırlık, Hero'dan sonra en yüksek öncelik).
- **Görsel ağırlığı:** Yüksek.
- **Sonraki bölüme geçiş:** How Transfer Works — yoğunluk düşer (3/5), section `py` küçülür, bu düşüş bilinçli bir "nefes alma" noktasıdır.

---

## 4. How Transfer Works

- **Amacı:** Sürecin 3 adımda, teknik olmayan dille anlatılması.
- **Ana mesajı:** *"Listele, eşleşme güvenle tamamlansın, transfer bitsin."*
- **Kullanılacak görsel:** Mevcut `payment-process.webp` / `reservation-process.webp` / `security-process.webp` (paymnet/reservation/security.png'nin canlı karşılıkları) — **değişmiyor**, zaten "poster panel" kalıbında.
- **Layout türü:** Poster panel + Sequence (3 adım, ince bağlantı çizgisiyle).
- **Desktop kompozisyon:** Sol: eyebrow+başlık+açıklama+CTA. Sağ: 3 adım, dikey sequence, ince bağlantı çizgisi (mevcut yaklaşım zaten bu kalıpta — korunur).
- **Mobile kompozisyon:** Header → 3 adım dikey stack, bağlantı çizgisi gizli (mevcut kod zaten `hidden md:block` kullanıyor — korunur).
- **Metin yoğunluğu:** Düşük-orta — adım başına 1 başlık + 1 cümle.
- **CTA:** "Detaylı Nasıl Çalışır?" (`/how-it-works`) — mevcut, korunur.
- **Section yüksekliği:** Kompakt (3/5 ağırlık).
- **Görsel ağırlığı:** Orta.
- **Sonraki bölüme geçiş:** Trust — ağırlık daha da düşer (2/5), bu section artık kart değil düz satır olacağı için görsel yoğunluk belirgin azalır.

---

## 5. Trust / Infrastructure

- **Amacı:** Güveni iddia değil, mekanizma ile göstermek.
- **Ana mesajı:** *"Ödeme, transfer tamamlanana kadar korunur."*
- **Kullanılacak görsel:** Yok / minimal — bu section bilinçli olarak "en az görsel ağırlıklı" section'dır (2/5). `digital.png`'deki düz ikon+etiket satırı kompozisyon referansıdır (kutu yok).
- **Layout türü:** Düz ikon satırı (kart grid değil) — mevcut 2x2 `TrustCard` grid'i yerine tek satır, 4 ikon+kısa etiket.
- **Desktop kompozisyon:** Yatay tek satır: ikon + kısa etiket + (varsa) 1 satır alt açıklama, 4 madde yan yana.
- **Mobile kompozisyon:** 2x2 veya tek kolon liste, kart/border olmadan.
- **Metin yoğunluğu:** Çok düşük — madde başına 2-4 kelime etiket + opsiyonel kısa alt satır.
- **CTA:** Gerekli değil (bu section kendi başına aksiyon taşımaz, Final CTA'ya bırakılır).
- **Section yüksekliği:** Kompakt (2/5, en düşük ağırlık).
- **Görsel ağırlığı:** Düşük.
- **Sonraki bölüme geçiş:** Final CTA — ağırlık tekrar yükselir (4/5), bu yükseliş sayfanın "güçlü kapanış" hissini kurar.

---

## 6. Final CTA + Footer

- **Amacı:** Güçlü, kısa bir kapanış aksiyonu.
- **Ana mesajı:** *"Rezervasyonunun değerini kaybetmesine izin verme."*
- **Kullanılacak görsel:** Yok veya çok hafif radial glow (mevcut Footer'daki gibi) — bu section obje değil, mesaj+aksiyon ağırlıklıdır.
- **Layout türü:** Split-stage (kısa) — mevcut Footer'ın üst CTA bandı zaten bu kalıpta, korunur.
- **Desktop kompozisyon:** Sol: başlık+açıklama. Sağ: 2 CTA (Primary+Secondary), yan yana.
- **Mobile kompozisyon:** Başlık → açıklama → CTA'lar dikey stack (mevcut kod zaten böyle).
- **Metin yoğunluğu:** Çok düşük.
- **CTA:** Primary "İlanları Keşfet", Secondary "Rezervasyonunu Listele" — mevcut Footer CTA bandı, korunur.
- **Section yüksekliği:** Orta-geniş (4/5).
- **Görsel ağırlığı:** Düşük (mesaj/aksiyon odaklı).
- **Önceki bölüme geçiş:** Trust'tan sonra ağırlık artışı ile güçlü kapanış.

---

## Homepage Ağırlık Eğrisi (özet)

```
Hero: ██████████ 5/5
Marketplace Experience: ██████████ 5/5
How Transfer Works: ██████ 3/5
Trust: ████ 2/5
Final CTA: ████████ 4/5
```

Bu eğri bilinçlidir: sayfa iki zirve (Hero, Marketplace) + bir vadi (Trust) + güçlü kapanış (Final CTA) şeklinde tasarlanır. Tüm section'ların aynı ağırlıkta olması (düz çizgi) yasaktır.
