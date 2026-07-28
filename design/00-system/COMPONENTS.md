# BITBIT V2 — Surface, Card & Component Rules

## Kart Kullanım Testi

Bir öğeyi kart yapmadan önce sor:

> "Bu, gerçek birden çok alanlı bir bilgi grubu mu, yoksa tek bir ikon+cümle mi?"

- **Birden çok alan** (fiyat + tarih + sağlayıcı gibi) → kart doğru. Örnek: `ListingCard`, gerçek ilan verisi taşıyor.
- **Tek ikon + tek cümle** → kart yanlış. Düz satır kullanılır (`digital.png` trust-row modeli: ikon yan yana başlık+alt cümle, kutu/border yok).

## Mevcut Envanterde Tespit

| Component | Şu an | V2 değerlendirmesi |
|---|---|---|
| `StatItem` (Hero) | glass kart (border+bg+backdrop-blur) | Tek değer+etiket taşıyor → **kart fazla ağır**, düz ikon+değer satırına indirilebilir |
| `TrustCard` (Trust section) | glass kart, 2 satır açıklama | Gerçek 2 satırlık bilgi taşıyor → **kart doğru**, korunur |
| `CategoryCard` | görsel+overlay+rozet+açıklama | Çok alanlı, görsel odaklı → **kart doğru** (zaten "poster panel" kalıbına yakın) |
| `ListingCard` | fiyat+tarih+sağlayıcı+CTA | Gerçek çok alanlı veri → **kart doğru** |
| `ProcessStepCard` | küçük görsel+adım no+başlık+açıklama | Tek mesaj + destekleyici görsel → sınırda; poster panel'e yakınsa kart yerine "sequence" kalıbı denenebilir |

## Radius

Rol tabanlı sistem — rastgele `rounded-xl/2xl/3xl` karışımı yerine:

| Rol | Değer | Örnek kullanım |
|---|---|---|
| Small control | `rounded-md` (6px) | ikon kutusu, checkbox |
| Pill | `rounded-full` | eyebrow badge, filtre chip, rozet |
| Button | `rounded-lg` (8px) | tüm CTA'lar |
| Standard card | `rounded-xl` (12px) | `ListingCard`, `TrustCard` |
| Editorial panel | `rounded-2xl` (16px) | `CategoryCard`, poster panel, process card |
| Hero visual | `rounded-3xl` (24px) veya `0` | Hero görseli (full-bleed, radius yok), büyük device-mockup sahne çerçevesi |

**Nested radius:** iç öğe dış container'dan küçük radius kullanır. Örnek: 24px panel → içinde 12px kart → içinde 6px ikon kutusu.

## Surface Katmanları

| Katman | Arka plan | Border |
|---|---|---|
| Zemin (page) | `#071A33` | — |
| Panel/section | `#0B2545` veya `#0A1E38` (bkz. COLORS.md) | `border-white/5` (üst/alt ayraç) |
| Kart | `#0B2545/60` veya `white/[0.04]` (glass) | `border-white/10` |
| Overlay (görsel üstü) | `black/30` + `backdrop-blur-sm` | `border-white/15` |

## Glass Kullanım Sınırı

Glass (`bg-white/[0.04] backdrop-blur`) yalnızca:
1. Görsel üzerine binen küçük overlay/rozet
2. Floating kontrol (CTA üstü küçük etiket)
3. Görsel üstü metin okunabilirlik katmanı

için kullanılır. **Bir section'ın tamamını** glass card grid'ine çevirmek yasak — bu, mevcut V1'in en büyük sapması (Hero stat kartları, Trust 2x2 grid, hepsi glass) ve V2'de düzeltilecek ana nokta.

## Button Component Kuralı

Bkz. `DESIGN_SYSTEM_V2.md` §13. Ek not: butonun `aria`/`focus-visible` davranışı değişmez, yalnızca görsel hiyerarşi (primary/secondary/tertiary sıklığı) düzenlenir.
