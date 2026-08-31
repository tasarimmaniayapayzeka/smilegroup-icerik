# Smile Group — Kurumsal Sayfa EN Çeviri Talimatı (v1)

Bu talimat, canlı smilegroup.com.tr sitesinin **kurumsal sayfalarının** (anasayfa, hakkımızda, iletişim, hekim sayfaları, KVKK vb.) İngilizce önizleme sayfalarına çevrilmesi içindir. Hizmet/blog çevirilerinde kullanılan `BRIEF.md`'nin (aynı klasörde) **dil, üslup ve terminoloji kuralları burada da aynen geçerlidir** — önce onu oku: İngiliz yazımı (colour/anaesthetic/-ise), native "Londra kliniği" tonu, tıbbi ihtiyat asla yumuşatılmaz, fiyat/hasta yorumu/"en iyi-garanti" eklenmez.

## Girdi
Her sayfanın TR kaynağı şu klasörde temizlenmiş hâlde duruyor (nav/script ayıklandı):
`C:\Users\İHSAN\AppData\Local\Temp\claude\C--Users--HSAN-Desktop-estetouch-yapay-zeka-web\1dc9b582-cbfb-4d21-9595-3f1635823d31\scratchpad\kurumsal\<slug>.clean.html`
Tema markup'ı (gorbit-* sınıfları) girdi dosyasında duruyor — İÇERİĞİ oku, tema sınıflarını KOPYALAMA.

## Çıktı — dosya yolu ve şablon
Kurumsal sayfalar: `C:\Users\İHSAN\Desktop\Claude-Projeler\02-SmileGroup\smilegroup-icerik\site-en\kurumsal\<slug>.html`
Hekim detayları: `C:\Users\İHSAN\Desktop\Claude-Projeler\02-SmileGroup\smilegroup-icerik\site-en\doktor\<slug>.html`
(slug = TR slug AYNEN, ör. hakkimizda.html, dr-arda-oztan.html)

Şablonu birebir şu örnekten al (yapı, topband, tr-orig etiketi, paste bölümü, foot):
`C:\Users\İHSAN\Desktop\Claude-Projeler\02-SmileGroup\smilegroup-icerik\site-en\kurumsal\_SABLON.html`

## Kurallar
1. **Tam çeviri** — kaynaktaki HER görünür metin bloğu (başlık, paragraf, liste, buton etiketi, form alan adları, tablo) çevrilecek. Hiçbir bölüm atlanmaz, özetlenmez.
2. **TR etiketleri**: h1 altına `<div class="tr-orig">TR original: <em>{TR sayfa başlığı}</em></div>`; büyük bölüm başlıklarının (h2) altına da kısa `<div class="tr-orig">TR: <em>{TR başlık}</em></div>` koy.
3. **Link dönüşümü (WP paste bloğu içinde)**: `/hizmet/X/` → `/en/hizmet/X/` · `/iletisim/` → `/en/contact/` · diğer kurumsal linkler `/en/<aynı-slug>/` (ör. `/hakkimizda/` → `/en/hakkimizda/`). Önizleme gövdesindeki linkler ise göreceli dosyalara gitsin: hizmet → `../hizmet/<slug>.html`, kurumsal → `<slug>.html`, doktor → `../doktor/<slug>.html`.
4. **Görseller**: kaynaktaki `<img>` src'leri canlı mutlak URL (https://www.smilegroup.com.tr/wp-content/...) — AYNEN koru (hotlink, önizleme için yeterli). alt metinlerini İngilizceye çevir.
5. **Kişi/kurum adları**: hekim adları, kurum adları (Axa, Allianz vb. anlaşmalı kurumlar) AYNEN kalır. Unvan: Dt./Uzm. Dr./Dr. hepsi sade "Dr" (İngiliz kullanımı). "Hanım/Bey" düşür.
6. **İletişim bilgileri**: telefon, adres, e-posta, harita embed'i AYNEN korunur (gerçek veri, çevrilmez; adresteki "Mahallesi/Caddesi" gibi kelimeler de adres bütünlüğü için aynen kalır).
7. **Form alanları** (iletişim/kariyer): görünür etiketleri çevir ([FORM] işareti görürsen kaynakta form vardı demektir — şablondaki gibi statik temsilini yaz: alan adlarını listeleyen küçük bir kutu + "the live form is produced by WordPress" notu).
8. **Hukuki sayfalar (kvkk, gizlilik-sozlesmesi, garanti-politikamiz)**: birebir sadık çeviri; Türk hukuku terimlerinde ilk geçişte parantezle açıklama ver — ör. "KVKK (Türkiye'nin kişisel veri koruma kanunu / Turkey's Personal Data Protection Law, Law No. 6698)". Hukuki anlamı ASLA değiştirme, cümle atlama.
9. **WP paste bölümü**: her sayfanın altına şablondaki `paste` bölümünü koy — textarea içinde sayfanın SAF İngilizce gövde HTML'i (tr-orig etiketleri OLMADAN, tema sınıfsız temiz `<h2>/<p>/<ul>` markup; linkler kural 3'teki /en/... mutlak formda).
10. **Doğrulama (her sayfa için zorunlu)**: yazdıktan sonra Node ile (a) dosyada `çğıöşü` kalmadığını (izinli özel adlar hariç: hekim adları, mahalle/cadde adları, "Değişim Hikayeleri" gibi tr-orig etiket içerikleri), (b) TR kaynaktaki paragraf sayısı ≈ EN paragraf sayısı olduğunu, (c) title/meta description dolu olduğunu kontrol et.

## Sayfa başlığı haritası (EN başlıklar — tutarlılık için bunları kullan)
- anasayfa → "Home" (h1 yok, hero başlıklarını çevir) — dosya adı `anasayfa.html`
- hakkimizda → "About Us" (TR: Hakkımızda)
- anlasmali-kurumlarimiz → "Insurance & Institutional Partners" (TR: Anlaşmalı Kurumlarımız)
- cozum-ortaklarimiz → "Solution Partners" (TR: Çözüm Ortaklarımız)
- odullerimiz → "Our Awards" (TR: Ödüllerimiz)
- sosyal-sorumluluklarimiz → "Social Responsibility" (TR: Sosyal Sorumluluklarımız)
- kariyer → "Careers" (TR: Kariyer)
- galeri → "Gallery" (TR: Galeri)
- kvkk → "Personal Data Protection (KVKK)" (TR: KVKK)
- gizlilik-sozlesmesi → "Privacy Policy" (TR: Gizlilik Sözleşmesi)
- garanti-politikamiz → "Our Warranty Policy" (TR: Garanti Politikamız)
- iletisim → "Contact" (TR: İletişim)
- hasta-hikayeleri → "Patient Stories" (TR: Hasta Hikayeleri) — 4 hikaye kartı yolculuk2'deki EN başlıklarla eşleşsin ("Elif's Transformation Story" vb.), kart linkleri `../yolculuk2/index.html`e
- hekimlerimiz → "Our Doctors" (TR: Hekimlerimiz) — kartlar `../doktor/<slug>.html`e linklesin
- sss → "Frequently Asked Questions" (TR: SSS)
- blog → "Blog" — kartlar bizim `../blog/<slug>.html` sayfalarına linklesin (9 yazı zaten çevrili; kart başlıklarını çevrilmiş EN başlıklarla eşleştir, site-en/blog/index.html'den bakabilirsin)
- hizmetler → "Our Treatments" (TR: Tedavilerimiz) — kategori/kart başlıkları BRIEF.md'deki 59'luk EN başlık haritasıyla birebir aynı olsun, kartlar `../hizmet/<slug>.html`e linklesin
- doktor/dt-yasin-gokcegozoglu → "Dr Yasin Gökcegözoğlu" (diğer 5 hekim aynı kalıp; sayfa içi "Uzmanlık Alanları/Eğitim/Deneyim" gibi bölüm başlıklarını çevir)

## Yasaklar
- Yeni içerik/iddia üretme; kaynakta olmayan hizmet, rakam, unvan ekleme.
- "back-translation" kokusu: cümle cümle mekanik çeviri yerine anlamı koruyan doğal İngiliz nesri (BRIEF.md kalite çıtası).
- Tema class'larını (gorbit-*, elementor-*) çıktıya taşıma.
