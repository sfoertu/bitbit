# BITBIT V2 — Responsive Principles

**Mobil, desktop'ın küçültülmüş hali değildir.** Her kompozisyon kalıbı (bkz. DESIGN_SYSTEM_V2 §4) için ayrı bir mobil karar gerekir — yalnızca `background-position` veya font-size değiştirerek "responsive" sayılmaz. Bu, önceki mobil-fix turlarında (Hero, How-It-Works) zaten uygulanan doğru pratik — V2'de tüm yeni section'lar için de zorunlu kılınıyor.

## Breakpoint'ler (mevcut Tailwind varsayılanları, değişmiyor)

| Breakpoint | Değer | Rol |
|---|---|---|
| (default) | 0-639px | Mobile |
| `sm:` | ≥640px | Büyük mobil / küçük tablet |
| `md:` | ≥768px | Tablet |
| `lg:` | ≥1024px | Desktop |

## Kompozisyon Kalıbı → Responsive Davranış

| Kalıp | Desktop | Tablet | Mobile |
|---|---|---|---|
| Split-stage | Sol metin / sağ obje, yan yana | Tek kolon, obje üstte veya altta (kalıba göre) | Tek mesaj + tek obje, dikey stack |
| Sequence | Objeler yatay, aralarında çizgi | Objeler yatay kalabilir (küçültülmüş) veya 2+1 | Dikey stack, bağlantı çizgisi kaldırılır (mobilde gizli, `hidden md:block`) |
| Poster panel | Tek büyük panel, içinde obje+timeline yan yana | Panel korunur, timeline sıkışabilir | Panel tek kolon, timeline dikey nokta listesine döner |
| Editorial grid | 3×3 veya 3×N | 2×N | Tek sıra (yatay scroll **olmadan**, tek kolon veya sabit-yükseklik carousel) |

## Zorunlu Kurallar

1. **Yatay scroll yasak.** Hiçbir section, hiçbir breakpoint'te yatay taşmaya sebep olmaz.
2. **Minimum touch target 44×44px.** Tüm tıklanabilir alanlar (buton, kart linki, filtre chip) bu ölçüyü karşılar.
3. **Bilgi hover'a bağlı değildir.** Mobilde hover yok — her bilgi (rozet, açıklama, CTA metni) varsayılan olarak görünür olmalı.
4. **Görsel/device mockup yeniden konumlandırılır, küçültülmez sadece.** Split-stage'de masaüstünde "sağda" duran obje, mobilde yalnızca küçülmüş halde sağda kalmaz — kompozisyon mobil için yeniden düşünülür (genelde: obje üstte tam genişlik, metin altta).
5. **Tek ana mesaj, tek ana obje.** Mobilde bir section'da birden fazla eşit ağırlıklı obje gösterilmez — biri öne çıkar, diğerleri (varsa) küçük/ikincil olur veya kaldırılır.
6. **Kontrollü crop.** Fotoğraf/obje mobilde kırpılırken kompozisyonun "konusu" (uçak kanadı, otel yatağı, araç ön yüzü gibi) çerçeve dışına taşmaz — `object-position` bilinçli seçilir.
7. **Büyük ama taşırmayan tipografi.** Display/Section Heading skalaları mobilde küçülür (bkz. TYPOGRAPHY.md) ama hiçbir başlık mobil genişlikte satır taşmasına/yatay scroll'a sebep olmaz.

## Test Kontrol Listesi (her yeni section için)

- [ ] 320px, 375px, 414px genişliklerde yatay scroll yok
- [ ] Tüm CTA'lar 44×44px üzeri
- [ ] Hover'a bağlı hiçbir bilgi yok
- [ ] Görsel kırpımı mobilde konuyu kesmiyor
- [ ] Bağlantı çizgisi/dekoratif motion mobilde ya gizli ya da performansı etkilemiyor
