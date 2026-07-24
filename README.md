# Smile Group — Hizmet İçerikleri

Diş kliniği hizmet sayfaları için **SEO / GEO / CEO uyumlu**, kopya olmayan, akordiyon soru-cevap içerik üretim deposu.

## Yapı
- `index.html` — üretim panosu (45 hizmet, ilerleme durumu)
- `hizmet/<slug>.html` — her hizmetin içeriği (tek veri kaynağı `window.ARTICLE`)
- `assets/render.js` — veriden hem önizleme hem **WP'ye yapıştırılacak HTML** hem **FAQPage JSON-LD** üretir
- `assets/style.css` — kurumsal aydınlık tema
- `server.js` — yerel önizleme (`node server.js` → :5601)

## İçerik kuralları
- Canlı-veri kilitli başlıklar (Google autocomplete + rakip başlık taraması)
- Soru-cevap başlıklar (sesli arama + AI cevap motorları için)
- İç linkleme (pillar–spoke)
- Yoast-yeşil: düşük edilgen, geçiş kelimeleri, kısa cümle
- **Mevzuat:** fiyat / hasta yorumu / garanti YOK · "son güncelleme + editör" satırı zorunlu

## Yayında
GitHub Pages önizleme: `https://tasarimmaniayapayzeka.github.io/smilegroup-icerik/`
