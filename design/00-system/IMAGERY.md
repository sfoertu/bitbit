# BITBIT V2 — Imagery Direction

Her görsel `design/` klasöründe olduğu haliyle incelendi (dosya adı değil, gerçek içerik). Hiçbir görsel değiştirilmedi, taşınmadı, yeniden adlandırılmadı. Aşağıdaki tablo her görseli **tek bir göreve** bağlar — aynı görsel iki section'da tekrar kullanılmaz.

## Yeni Eklenen Referanslar (bu round'da incelenen)

| Dosya | Görsel Tipi | Önerilen Section | Ana Görevi | Crop Davranışı | Desktop Kullanımı | Mobile Kullanımı | Üzerine Metin? | Negatif Alan Yönü | Kullanım Uyarısı |
|---|---|---|---|---|---|---|---|---|---|
| `hero.png` | Landing sayfa mockup (kompozisyon referansı) | — (referans, doğrudan kullanılmaz) | Split-stage kompozisyon örneği: sol metin blok, sağ 2 cihaz mockup | full-bleed poster | — | — | — | Sol | **Doğrudan asset olarak kullanılmaz** — yalnızca kompozisyon/layout referansı. İçindeki "Blockchain/Wallet" metni BITBIT'e taşınmaz (bkz. DESIGN_SYSTEM_V2 §10). |
| `digital.png` | Ürün/wallet poster mockup | Marketplace Experience veya How Transfer Works (kompozisyon referansı) | İki-taraflı transfer sahnesi: gönderen/alıcı cihaz + merkez bağlantı ikonu | full-bleed poster | Split-stage'de sağ obje olarak yeniden üretilecek (mevcut cihaz mockup birebir kopyalanmaz) | Tek cihaza indirgenir | — | Üst (başlık) | Aynı uyarı — kompozisyon alınır, blockchain/wallet dili alınmaz |
| `digital transfer.png` | 3 cihazlı sekans mockup | How Transfer Works | Bir sürecin 3 ekran üzerinden anlatımı (My Wallet → Transfer → Complete) | yatay sekans | 3 obje yan yana, ince bağlantı çizgisiyle | Sekans dikeye döner, mobilde tek adım vurgulanır | — | Objeler arası | Ekran içeriği referans; gerçek BITBIT akışına (rezervasyon listeleme → devir onayı → tamamlandı) uyarlanmalı, "Wallet" ekran başlıkları kopyalanmaz |
| `travel.png` | 3×3 editorial fotoğraf collage | Marketplace Experience (atmosfer/marka hissi) | Ürünün "hangi kategorilerde" çalıştığını atmosferik olarak anlatmak (uçuş, otel, araç, deneyim) | grid, eşit kare kırpım | 3×3 veya 3×2 grid, CTA/veri taşımaz | Tek sıra (3'lü) veya carousel'e indirgenir | Hayır | — | Yalnızca marka/atmosfer içindir; gerçek ilan verisi (fiyat, tarih) bu görsele **eklenmez** — o veri `ListingCard`'da zaten var |

## Zaten Üretime Alınmış Referanslar (mevcut yaşayan asset'lerin kaynağı)

| Dosya | Karşılığı (canlı asset) | Ana Görevi | Şu anki kullanım | V2 notu |
|---|---|---|---|---|
| `category car.png` | `apps/web/src/assets/home/category-car.webp` | Araç kiralama kategorisini/marka hissini anlatma | `CategoryCard` arka planı | Korunur — aynı kırpım/pozisyon iyi çalışıyor (gün batımı, şehir silueti, yansıma) |
| `category flight.png` | `apps/web/src/assets/home/category-flight.webp` | Uçuş kategorisi, "seyahat" duygusu | `CategoryCard` arka planı | Korunur |
| `category hotel.png` | `apps/web/src/assets/home/category-hotel.webp` | Otel kategorisi, premium konaklama hissi | `CategoryCard` arka planı | Korunur |
| `paymnet.png` | `apps/web/src/assets/how-it-works/payment-process.webp` | Ödeme/emanet adımını anlatma (poster panel kalıbının ilk örneği) | How-It-Works process card | Bu görsel zaten "poster panel" kalıbında (obje + alt mini-timeline) — V2 kompozisyon dilinin **kanıtı**, referans olarak diğer section'lara genişletilebilir |
| `reservation.png` | `apps/web/src/assets/how-it-works/reservation-process.webp` | Rezervasyon listeleme adımı | How-It-Works process card | Aynı |
| `security.png` | `apps/web/src/assets/how-it-works/security-process.webp` | Güvenli eşleşme/doğrulama adımı | How-It-Works process card | Aynı |

## Legacy (V1) Referanslar — artık ikincil

| Dosya | Durum |
|---|---|
| `reference.png` | V1 Home redesign'ın ilk referansı ("AKILLI TURAR" rozetli eski kompozisyon). V2'de kaynak önceliği düşük — bkz. DESIGN_SYSTEM_V2 §"Mevcut Dokümanlarla İlişki". |
| `screenshot-desktop.png` | `design/screenshot.mjs` ile alınmış otomatik ekran görüntüsü — V1 implementasyonunun canlı kaydı, tarihsel referans. |

## Genel Kural

- Her görsel yukarıdaki tabloda **tam olarak bir** section'a bağlıdır.
- `hero.png`, `digital.png`, `digital transfer.png` **doğrudan asset olarak kullanılmaz** — bunlar kompozisyon/sahne referanslarıdır (poster mockup'ları, gerçek yayınlanacak görsel değil). Gerçek uygulamada BITBIT kendi cihaz mockup'ı/gerçek ürün ekranı görüntüsü üretilecek (bu ayrı bir görev, bu doküman kapsamında **üretilmiyor**).
- `travel.png` yalnızca atmosfer içindir, veri/CTA taşımaz.
- `category *.png` ve `paymnet/reservation/security.png` zaten canlı, değiştirilmez, aynı rolde kalır.
