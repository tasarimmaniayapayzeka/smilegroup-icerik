/* SEO-TR ÜRETİCİ — 57 TR tedavi sayfası için odak/long-tail revize sistemi.
 * Girdi: _ciftler/<slug>.js (module.exports = { odak, desen, odakKelime, ciftler:[[önce,sonra,semaMi],...], not? })
 *        + YEREL gövdeler (SEO_GOVDE ortam değişkeni → tr-govdeler klasörü; repoya konmaz).
 * Doğrulama: her ÖNCE gövdede BİREBİR TEK eşleşme · SONRA mevzuat taraması · sayfalar arası kopya SONRA yasak
 *            · yoğunluk bandı %1,5–2,5 (aşan sayfa HATA).
 * Çıktı: sayfa/<slug>.html (ÖNCE→SONRA incelemesi) + index.html (pano) + _wp/seo-tr-yuk.json (uygulama yükü). */
const fs = require('fs');
const path = require('path');
const KOK = __dirname;
const GOVDE = process.env.SEO_GOVDE || '';
const envanter = JSON.parse(fs.readFileSync(path.join(KOK, '_veri', 'envanter.json'), 'utf8')).filter(e => e.kelime);

const temizle = (t) => t.replace(/<[^>]+>/g, ' ').replace(/&#039;|&#8217;|&rsquo;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const kucuk = (t) => t.replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase(); // İ→i ÖNCE: toLowerCase(İ) "i"+U+0307 üretir, desen kaçar
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const MEVZUAT = /(fiyat|ücret|kampanya|indirim|en iyi|lider|önde gelen|garanti eder|kesin çözüm|%100|mucize|kalıcı çözüm vaat)/i;

function yogunluk(metin, desen, odakKelime) {
  const duz = temizle(metin);
  const n = duz.split(' ').filter(Boolean).length;
  const m = kucuk(duz).match(desen) || [];
  return { kelime: n, gecis: m.length, yuzde: n ? +(m.length * odakKelime / n * 100).toFixed(2) : 0, gecisler: m };
}

const hatalar = [];
const sonuclar = [];
const tumSonralar = new Map(); // kopya cümle engeli

for (const e of envanter) {
  const cdosya = path.join(KOK, '_ciftler', e.slug + '.js');
  if (!fs.existsSync(cdosya)) { sonuclar.push({ slug: e.slug, h1: e.h1, kelime: e.kelime, durum: 'BEKLIYOR' }); continue; }
  delete require.cache[require.resolve(cdosya)];
  const C = require(cdosya);
  const desen = new RegExp(C.desen, 'g');
  if (!GOVDE) { hatalar.push(e.slug + ': SEO_GOVDE tanımsız — doğrulama yapılamaz'); continue; }
  const govde = fs.readFileSync(path.join(GOVDE, e.slug + '.html'), 'utf8');

  // 1) her ÖNCE tek eşleşme + SONRA mevzuat + kopya kontrolü
  let sayfaHata = 0;
  for (const [i, [once, sonra, sema]] of C.ciftler.entries()) {
    const adet = govde.split(once).length - 1;
    if (adet !== 1) { hatalar.push(e.slug + ' #' + (i + 1) + ': eşleşme ' + adet + ' (1 olmalı) → ' + once.slice(0, 60)); sayfaHata++; }
    if (MEVZUAT.test(sonra)) { hatalar.push(e.slug + ' #' + (i + 1) + ': MEVZUAT kelimesi → ' + sonra.slice(0, 60)); sayfaHata++; }
    if (sonra.length > 30) {
      if (tumSonralar.has(sonra)) { hatalar.push(e.slug + ' #' + (i + 1) + ': KOPYA CÜMLE (aynısı ' + tumSonralar.get(sonra) + ' sayfasında) '); sayfaHata++; }
      tumSonralar.set(sonra, e.slug);
    }
  }

  // 2) yoğunluk önce/sonra
  let yeni = govde;
  for (const [once, sonra] of C.ciftler) yeni = yeni.replace(once, sonra);
  const onceY = yogunluk(govde, desen, C.odakKelime);
  const sonraY = yogunluk(yeni, desen, C.odakKelime);
  if (sonraY.yuzde > 2.5) { hatalar.push(e.slug + ': yoğunluk %' + sonraY.yuzde + ' > 2,5 SINIRI'); sayfaHata++; }
  if (sonraY.yuzde < 1.5) hatalar.push(e.slug + ': UYARI yoğunluk %' + sonraY.yuzde + ' < 1,5 bandı (kasıtlıysa not düş)');

  sonuclar.push({
    slug: e.slug, h1: e.h1, kelime: e.kelime, durum: sayfaHata ? 'HATA' : 'HAZIR',
    odak: C.odak, onceG: onceY.gecis, sonraG: sonraY.gecis, onceY: onceY.yuzde, sonraY: sonraY.yuzde,
    basHizmet: C.ciftler.filter(c => c[2]).length, govdeCumle: C.ciftler.filter(c => !c[2]).length, not: C.not || '',
  });

  // 3) inceleme sayfası
  const satirlar = C.ciftler.map(([once, sonra, sema], i) =>
    '<div class="c"><div class="n">' + (i + 1) + (sema ? ' · başlık+şema' : ' · gövde') + '</div>' +
    '<div class="o">ÖNCE: ' + esc(temizle(once)) + '</div><div class="s">SONRA: ' + esc(temizle(sonra)) + '</div></div>').join('\n');
  const sayfaHtml = '<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">' +
    '<title>' + esc(e.h1) + ' — SEO revize</title><style>body{font-family:system-ui;margin:0;padding:16px;background:#f6f7f9;color:#16233b;max-width:860px;margin:auto}' +
    'h1{font-size:19px}a{color:#0a5ec2}.kut{background:#fff;border:1px solid #dfe4ec;border-radius:10px;padding:14px 16px;margin-top:12px}' +
    '.c{border-bottom:1px dashed #e3e7ee;padding:10px 0}.c:last-child{border-bottom:0}.n{font-size:11px;font-weight:700;color:#8a6d1a;letter-spacing:.06em}' +
    '.o{font-size:13.5px;color:#7a2f2f;margin-top:4px}.s{font-size:13.5px;color:#1c5c34;margin-top:3px}.m{font-size:13px;color:#4a5568;line-height:1.6}</style></head><body>' +
    '<p><a href="../index.html">← Pano</a></p><h1>' + esc(e.h1) + '</h1>' +
    '<div class="kut m">Odak: <b>' + esc(C.odak) + '</b> · Geçiş: ' + onceY.gecis + ' → <b>' + sonraY.gecis + '</b> · Yoğunluk: %' + onceY.yuzde + ' → <b>%' + sonraY.yuzde + '</b> (hedef bant %1,8–2,4)' +
    '<br>Değişiklik: ' + C.ciftler.filter(c => c[2]).length + ' soru başlığı (şemayla birlikte) + ' + C.ciftler.filter(c => !c[2]).length + ' gövde cümlesi. Slug/link/meta DEĞİŞMEZ.' + (C.not ? '<br>Not: ' + esc(C.not) : '') + '</div>' +
    '<div class="kut">' + satirlar + '</div>' +
    '<p class="m">Canlı sayfa: <a href="https://www.smilegroup.com.tr/hizmet/' + e.slug + '/" rel="nofollow">smilegroup.com.tr/hizmet/' + e.slug + '/</a></p></body></html>';
  if (!fs.existsSync(path.join(KOK, 'sayfa'))) fs.mkdirSync(path.join(KOK, 'sayfa'));
  fs.writeFileSync(path.join(KOK, 'sayfa', e.slug + '.html'), sayfaHtml);
}

/* pano */
const hazir = sonuclar.filter(s => s.durum === 'HAZIR').length;
const rows = sonuclar.map(s => {
  const link = s.durum === 'BEKLIYOR' ? esc(s.h1) : '<a href="sayfa/' + s.slug + '.html">' + esc(s.h1) + '</a>';
  const oz = s.durum === 'BEKLIYOR' ? '<td colspan="3" class="bek">bekliyor</td>' :
    '<td>' + esc(s.odak) + '</td><td>' + s.onceG + '→<b>' + s.sonraG + '</b></td><td>%' + s.onceY + '→<b>%' + s.sonraY + '</b></td>';
  return '<tr class="' + s.durum.toLowerCase() + '"><td>' + link + '</td>' + oz + '<td>' + (s.durum === 'HAZIR' ? '✓' : s.durum === 'HATA' ? '✗' : '…') + '</td></tr>';
}).join('\n');
const pano = '<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">' +
  '<title>SEO-TR Revize Panosu — ' + hazir + '/' + envanter.length + '</title><style>body{font-family:system-ui;margin:0;padding:14px;background:#f6f7f9;color:#16233b}' +
  'h1{font-size:20px}.say{font-size:14px;color:#4a5568;margin:6px 0 14px}table{width:100%;border-collapse:collapse;background:#fff;border:1px solid #dfe4ec;border-radius:10px;overflow:hidden}' +
  'th,td{padding:8px 9px;font-size:12.5px;text-align:left;border-bottom:1px solid #eef1f5;vertical-align:top}th{background:#16233b;color:#fff;font-size:11px;letter-spacing:.05em}' +
  'a{color:#0a5ec2;text-decoration:none}.bek{color:#98a3b3}.hata td{background:#fdf0f0}tr:last-child td{border-bottom:0}.m{font-size:12px;color:#66717f;margin-top:12px;line-height:1.6}</style></head><body>' +
  '<h1>SEO-TR Revize Panosu <span style="color:#b58a1f">' + hazir + '/' + envanter.length + ' HAZIR</span></h1>' +
  '<div class="say">TR tedavi sayfaları · odak + long-tail revizesi · hedef bant %1,8–2,4 · içerik anlamı değişmez, slug/link/meta/şema yapısı korunur · CANLIYA UYGULANMADI — inceleme içindir.</div>' +
  '<table><tr><th>Sayfa</th><th>Odak</th><th>Geçiş</th><th>Yoğunluk</th><th></th></tr>' + rows + '</table>' +
  '<div class="m">Uygulama: PC gününde gorbit-seo-tr.php (kuru koşu → uygula → ölçüm → gerial mümkün). Bu klasör noindex etiketlidir.</div></body></html>';
fs.writeFileSync(path.join(KOK, 'index.html'), pano);

/* uygulama yükü */
const yuk = sonuclar.filter(s => s.durum === 'HAZIR').map(s => {
  const C = require(path.join(KOK, '_ciftler', s.slug + '.js'));
  return { tr_slug: s.slug, odak: C.odak, desen: C.desen, odakKelime: C.odakKelime, ciftler: C.ciftler };
});
if (!fs.existsSync(path.join(KOK, '_wp'))) fs.mkdirSync(path.join(KOK, '_wp'));
fs.writeFileSync(path.join(KOK, '_wp', 'seo-tr-yuk.json'), JSON.stringify({ surum: '1.0', uretim: 'uret-seo.js', ogeler: yuk }, null, 1));

console.log('HAZIR ' + hazir + '/' + envanter.length + ' · yük öğesi ' + yuk.length);
console.log('HATA/UYARI ' + hatalar.length);
hatalar.forEach(x => console.log('  - ' + x));
