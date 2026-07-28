# BITBIT Design System V2

Kaynak: kullanıcı tarafından `design/` klasörüne eklenen referans görseller (`hero.png`, `digital.png`, `digital transfer.png`, `travel.png`) ve mevcut, zaten üretime alınmış referanslar (`category car.png`, `category flight.png`, `category hotel.png`, `paymnet.png`, `reservation.png`, `security.png`).

Bu doküman bir tasarım *önerisi* değil, sonraki Homepage Redesign V2 çalışması için **bağlayıcı kaynaktır**. Kod değişmedi — bu round yalnızca dokümantasyon üretir.

---

## 1. Design Vision

BITBIT bir ikinci el bilet sitesi ya da bir "Web3 dashboard" gibi görünmemeli. Referans görsellerin ortak sunduğu şey şu:

> Bir ürünü anlatmak için **sahne kurulur**, kutu doldurulmaz.

Her referans görsel (hero.png, digital.png, paymnet.png, reservation.png, security.png) aynı kalıbı tekrarlıyor: **tek bir baskın görsel obje** (iki telefon, bir kart+kalkan, bir clipboard+bavul) + onun etrafında az sayıda, yatay dizilmiş, kutusuz ikon+metin satırı. Kart grid'i yok; poster var.

BITBIT V2, bu sahne mantığını benimser: **Cards değil, scenes.**

## 2. Brand Personality

| Özellik | Karşılığı |
|---|---|
| Editorial | Dergi kapağı hissi — büyük görsel, az metin, güçlü kırpma |
| Cinematic | Altın saat / gece ışıkları / yansıma — mevcut hero.webp ve category görselleri zaten bunu yapıyor |
| Minimal | Bir section'da en fazla 1 baskın renk vurgusu, 1 baskın obje |
| Confident | Kısa cümle, büyük tipografi, açıklama satırı savunma yapmaz |
| Trustworthy | Güven, iddia ile değil, somut mekanizma anlatımıyla kurulur (bkz. Metin Kuralları) |
| Product-led | Gerçek ürün ekranı/akışı gösterilir, soyut illüstrasyon değil |
| Investor-ready | Sayfa bir demo günü sunumunda tek slayt gibi durabilmeli |

## 3. Visual Principles

1. **Tek obje kuralı** — her ana section'ın tek bir görsel odağı olur (bir cihaz mockup'ı, bir fotoğraf, bir poster panel). İkinci bir eşit ağırlıklı obje eklenmez.
2. **Negatif alan bir bileşendir** — dolu değil, boş alan section'ın "premium" hissini taşır. hero.png ve digital.png'de objelerin etrafında sayfanın büyük kısmı boş.
3. **Kutu yerine sahne** — bilgi iletmek için önce "gerçek bir sahne var mı" diye sorulur (bir ekran görüntüsü, bir fotoğraf, bir obje). Yoksa, ancak o zaman kart kullanılır.
4. **Vurgu tekildir** — bir section'da yalnızca bir yerde gold kullanılır (başlıkta bir kelime, bir CTA, bir ikon). Her satırda gold tekrar etmez.
5. **Fotoğraf düz kırpılmaz** — category görselleri gibi çapraz/diyagonal kompozisyon, ufuk çizgisi, yansıma kullanılır; ortalanmış "stock photo" kırpımı değil.

## 4. Composition System

Referanslardan çıkan 4 kompozisyon kalıbı:

| Kalıp | Örnek referans | Ne zaman kullanılır |
|---|---|---|
| **Split-stage** | hero.png, digital.png | Sol: eyebrow+başlık+açıklama+CTA. Sağ: tek büyük obje (cihaz/poster). Section'ın "hero" ağırlığında olduğu yerler. |
| **Sequence** | digital transfer.png | 2-3 obje yatay dizilir, aralarında ince bağlantı/ok. Bir süreci (transfer, adım adım) anlatan yerler. |
| **Poster panel** | paymnet.png, reservation.png, security.png | Tek büyük yuvarlatılmış panel içinde: üstte obje+başlık+açıklama, altta ince bir mini-timeline (kutu değil, nokta+çizgi). |
| **Editorial grid** | travel.png | 3×3 (veya 3×N) eşit fotoğraf gridi — yalnızca "atmosfer/marka hissi" anlatımı için, veri/CTA taşımaz. |

Homepage'in her section'ı bu 4 kalıptan birine karşılık gelmeli — hepsi aynı "3 kolon glass card" kalıbını tekrarlamamalı (bkz. HOMEPAGE_V2.md).

## 5. Hierarchy

Sayfa içinde her section'ın **ağırlığı farklı olmalı**. Bkz. bölüm 18.

Tek section içinde hiyerarşi kuralı:
1. Görsel/obje (en büyük)
2. Başlık
3. Açıklama (görsel ve başlıktan belirgin şekilde küçük/soluk)
4. CTA
5. Destekleyici metin (varsa) — en küçük, en soluk

## 6. Color Philosophy

Detay: [COLORS.md](COLORS.md).

Özet kural: **gold tek anlamlı vurgu rengidir.** Turkuaz yalnızca "olumlu durum" (indirim, tamamlandı) sinyali için var — dekoratif vurgu değil. Bordo şu an kullanımda değil, "hata" rolüne rezerve edilmiş durumda (öneri, onay bekliyor).

Mevcut 3 yakın-navy tonu (#071A33 / #0A1E38 / #0B2545) artık **dekoratif olarak sırayla değil, role göre** kullanılmalı.

## 7. Typography Philosophy

Detay: [TYPOGRAPHY.md](TYPOGRAPHY.md).

Özet: Hero başlığı tek şampiyon kalır (76px lg). Section başlıkları (36px sm tavanı) hiçbir zaman Hero'yla yarışmaz — bu kural zaten mevcut kodda uygulanıyor, V2'de korunur. Kart başlıkları şu an 3 farklı boyutta (14/16/20px) dağınık — V2'de tek "Card Heading" skalasına indirilir.

## 8. Spacing and Rhythm

Detay: [SPACING.md](SPACING.md).

Özet: 8px taban. Section'lar arası `py` **artık hepsi aynı olamaz** — Hero ve Marketplace Experience geniş nefes alır (96-160px), How It Works ve Trust daha kompakt (64-80px).

## 9. Imagery Direction

Detay: [IMAGERY.md](IMAGERY.md) — her görsel dosya adına, göreve ve crop davranışına bağlanmış tablo.

Özet kural: her görsel **bir** göreve bağlıdır. Aynı görsel iki farklı section'da tekrar kullanılmaz (örn. `category flight.png` hem Categories hem Marketplace Experience'ta aynı anda kullanılmaz — biri seçilir).

## 10. UI and Product Mockup Direction

`digital.png` / `digital transfer.png` / `hero.png` referanslarındaki telefon mockup'ları **kompozisyon örneği** olarak alınır (gerçekçi cihaz çerçevesi, gerçek uygulama ekranına benzer içerik, sahne içinde negatif alanla sunulmuş).

**Kritik uyarı:** bu üç referansın metni ve marka dili ("Digital Wallet", "Blockchain Powered", "Blockchain Secured", "Sender Wallet / Receiver Wallet") BITBIT'in mevcut ürün prensibiyle çelişir — CLAUDE.md §3: *"Kullanıcı asla ham blokzincir arayüzü görmez."* ve daha önceki How-It-Works görevinde açıkça yasaklanan blockchain/wallet jargonu.

→ Bu referanslardan yalnızca **kompozisyon/sahne dili** alınır (cihaz mockup + negatif alan + tek obje + minimal ikon satırı). "Wallet", "Blockchain", "Sender/Receiver" gibi kelimeler ve kavramlar BITBIT metnine **taşınmaz**. Bkz. bölüm 19 (Kullanıcı Kararı Gerektiren Noktalar).

Mockup kuralları:
- Mockup ekranı gerçek BITBIT akışına (rezervasyon listeleme, satın alma, transfer) dayanmalı — referanstaki "Sender/Receiver Wallet" ekranı birebir kopyalanmaz.
- Cihaz dekorasyon değildir; belirli bir adımı anlatır (örn. "rezervasyon devri onaylandı" ekranı).
- Var olmayan bir özellik göstermez (örn. henüz olmayan bir "instant settlement" göstergesi eklenmez).

## 11. Surface and Card Rules

Şu an homepage'de **her section bir kart grid'i**: Hero'nun stat'ları kart, Trust'ın 4 maddesi kart, Categories kart, Featured Listings kart, How-It-Works kart. Bu, referanslardaki dilden sapıyor.

Kart yalnızca şu durumda kullanılır:
- Gerçek, birden çok alanlı bir bilgi grubu taşıyorsa (örn. bir ilan: fiyat + tarih + sağlayıcı) → **kart doğru.**
- Yalnızca bir ikon + tek satır metin taşıyorsa → **kart yanlış**, düz ikon+metin satırı kullanılmalı (digital.png'deki "SECURE ENCRYPTION" satırı gibi, kutu yok).

Glass yalnızca:
- Görsel üzerine binen küçük overlay (rozet, sayaç)
- Floating kontrol (CTA üstündeki küçük etiket)
- Görsel üstü metin okunabilirliği için gradient+blur

için kullanılır. Bir section'ın **tamamını** glass card grid'e çevirmek yasaktır.

## 12. Border Radius Rules

Detay: [COMPONENTS.md](COMPONENTS.md#radius).

Rol tabanlı sistem (rastgele `rounded-xl/2xl/3xl` karışımı yerine):

| Rol | Değer | Kullanım |
|---|---|---|
| Small control | `rounded-md` (6px) | badge içi ikon kutusu, checkbox benzeri küçük UI |
| Pill / badge | `rounded-full` | eyebrow, rozet, filtre chip |
| Button | `rounded-lg` (8px) | tüm CTA'lar |
| Standard card | `rounded-xl` (12px) | gerçek çok-alanlı kartlar (ListingCard, TrustCard benzeri gerçek bilgi kartları) |
| Editorial panel | `rounded-2xl` (16px) | poster panel, process card |
| Hero visual | `rounded-3xl` (24px) veya `0` (full-bleed) | Hero görseli, büyük device-mockup sahne çerçevesi |

**Nested radius kuralı:** iç öğenin radius'u dış container'dan küçük olmalı (örn. 24px panel içinde 12px kart, 12px kart içinde 6px ikon kutusu — asla tersi).

## 13. Button Hierarchy

| Seviye | Stil | Kullanım sıklığı |
|---|---|---|
| Primary | Dolu gold, `text-[#0B2545]` | Sayfada en fazla 2 (Hero + Final CTA) |
| Secondary | `border-white/15 bg-white/5 backdrop-blur-sm` | Section başına en fazla 1 |
| Tertiary / link | Düz metin + ok, arka plan yok | Kart içi "detay" aksiyonları |

Kural: aynı section'da 2'den fazla Primary buton olmaz. Şu anki Hero'da (2 CTA: primary+secondary) bu kural zaten uygulanıyor — korunur.

## 14. Iconography

- Outline stroke ikonlar (`strokeWidth 1.5`), referanslardaki (digital.png trust row) ince çizgi ikon diliyle uyumlu.
- İkon **kutu içine alınmaz** eğer yalnızca bir etiketin parçasıysa (digital.png trust row modeli).
- İkon kutuya alınır yalnızca gerçek bir kart içindeyse (ör. TrustCard gerçek 2 satırlık açıklama taşıyorsa).
- Dekoratif ikonlar `aria-hidden="true" focusable="false"` (mevcut kod tabanında zaten uygulanan pratik — korunur).

## 15. Motion Principles

Detay: [MOTION.md](MOTION.md).

Özet: Motion **anlam taşımalı**. Her karta hover-glow eklemek yasak. İzin verilen hareketler: görsel reveal (scroll'da fade+slight-up), obje float (yalnızca hero mockup'ında, çok hafif, sürekli değil), CTA hover (arka plan/gölge), route/bağlantı çizgisi çizimi (bir kere, sayfa yüklenirken).

## 16. Responsive Principles

Detay: [RESPONSIVE.md](RESPONSIVE.md).

Özet: Mobil, desktop'ın küçültülmüş hali değildir — ayrı kompozisyon kararı gerektirir (özellikle split-stage kalıbı mobilde tek-obje + tek-mesaja indirgenir).

## 17. Accessibility

- Kontrast: gövde metni beyaz/navy üzerinde en az 4.5:1 (mevcut `white/50` gibi düşük opaklıklar yalnızca ikincil/meta metinde, birincil mesajda kullanılmaz).
- Heading hiyerarşisi atlanmaz (h1 → h2 → h3, sayfada bir h1).
- Sıra bilgisi (adım numaraları, "01/02/03") her zaman metin olarak var olur, yalnızca renk/çizgiyle anlatılmaz.
- Odaklanabilir her CTA `focus-visible` stiline sahip (mevcut global `*:focus-visible` kuralı korunur).
- Dekoratif görsel/ikonlar ekran okuyucudan gizlenir; anlam taşıyan görsellerde gerçek `alt` metni bulunur.

## 18. Homepage Section Rhythm

| Section | Ağırlık | Kompozisyon kalıbı | py (desktop) |
|---|---|---|---|
| Hero | 5/5 | Split-stage | 128-160px |
| Marketplace Experience | 5/5 | Split-stage veya Sequence | 96-128px |
| How Transfer Works | 3/5 | Poster panel + Sequence | 64-80px |
| Trust / Infrastructure | 2/5 | Editorial grid veya düz ikon satırı | 64-80px |
| Final CTA + Footer | 4/5 | Split-stage (kısa) | 80-96px |

Detay: [HOMEPAGE_V2.md](../10-homepage/HOMEPAGE_V2.md).

## 19. Do / Don't

**Do:**
- Her section'a girmeden önce sor: "bu bir sahne mi, yoksa kart grid'i mi?"
- Referans görsellerdeki obje-etrafı-boşluk oranını taklit et.
- Gerçek ürün verisini (fiyat, tarih, adım metni) mono/tabular kullan.
- Gold'u tek yerde, bilinçli kullan.

**Don't:**
- Her section'ı 3 eşit sütunlu glass card grid yapma.
- "Blockchain", "Wallet", "Sender/Receiver Wallet" gibi referans-kaynaklı jargonu metne taşıma.
- Yeni bir vurgu rengi icat etme (turkuaz zaten "başarı" rolünde, ikinci bir "premium" rengi gerekmiyor).
- Aynı görseli birden fazla section'da tekrar kullanma.
- Mobilde yalnızca `background-position` değiştirerek "responsive" deme — kompozisyonu yeniden düşün.

## 20. Claude Code Implementation Rules

Bu bölüm **bağlayıcıdır.** Homepage V2 kod uygulaması yapılacağı zaman:

1. Önce bu dosyayı (`DESIGN_SYSTEM_V2.md`) ve ardından `10-homepage/HOMEPAGE_V2.md` dosyasını oku.
2. Kullanıcı onayı olmadan section ekleme, section çıkarma veya section sırasını değiştirme.
3. Yeni görsel üretme veya referans görsel önerme — yalnızca `design/` içindeki mevcut, kullanıcı tarafından seçilmiş görselleri kullan.
4. Asset dosyalarını değiştirme, taşıma, yeniden adlandırma.
5. Bu dokümanda tanımlanmayan yeni bir renk uydurma.
6. Her section'ı otomatik olarak glass card grid'ine çevirme — önce Composition System (bölüm 4) kalıplarından hangisinin uygulanacağına bak.
7. Mevcut business logic, route, Supabase, API, purchase flow'a dokunma.
8. Tasarım referansını "yaklaşık" yorumlama — HOMEPAGE_V2.md'de belirtilen görsel/kompozisyon/CTA birebir kullanılır; belirsizlikte kullanıcıya sor, tahmin etme.
9. Çelişki durumunda kaynak önceliği: bkz. aşağıdaki "Mevcut Dokümanlarla İlişki".

### Mevcut Dokümanlarla İlişki (kaynak önceliği)

1. Kullanıcı tarafından seçilmiş görsel referanslar (`design/*.png`)
2. `DESIGN_SYSTEM_V2.md` (bu dosya)
3. `10-homepage/HOMEPAGE_V2.md`
4. Mevcut `PRODUCT.md` (varsa)
5. Mevcut legacy `design/reference.png` / `design/screenshot-desktop.png` (V1 referansı — artık ikincil)
6. Mevcut implementation (`apps/web/src/app/page.tsx` vb.)

Görsel/UI kararlarında bu sıra geçerlidir. **Business logic kararlarında** ise PRODUCT.md ve çalışan uygulama (mevcut implementation) önceliklidir — V2 dokümantasyonu iş kuralını değiştirmez, yalnızca sunumu değiştirir.
