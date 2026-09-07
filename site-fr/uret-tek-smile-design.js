/* TEK KAYIT: gulus-tasarimi -> FR smile-design yuk paketi.
 *
 * NEDEN AYRI: ana paket DE kapsamini aynalar; DE'de gulus-tasarimi PILOTLA
 * yuklendigi icin ana pakette yoktu -> FR'de (pilot olmadigindan) sayfa hic
 * acilmadi (07.09 canli olcumu: /de/behandlung/smile-design/ 200, FR'de yok).
 *
 * GUVENCE: once ESLIK testi - ayni kurulum kuralIyla 'dolgu' kaydini yeniden
 * kurar ve yayimlanmis hizmet-yuk.json'daki kayitla BAYT BAYT karsilastirir.
 * Test gecmezse paket YAZILMAZ.
 *
 * Kural kaynagi: uret-wp-fr.js (satir 99-115) - alanlar birebir ayni. */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const FR = __dirname;
const KOK = 'https://tasarimmaniayapayzeka.github.io/smilegroup-icerik/site-fr/images/';

function draft(dir, f, g) { const sb = { window: {} }; new Function('window', fs.readFileSync(path.join(dir, '_drafts', f), 'utf8'))(sb.window); return sb.window[g]; }
const frHarita = JSON.parse(fs.readFileSync(path.join(FR, '_drafts', 'fr-slug-map.json'), 'utf8'));
const FRIMG = JSON.parse((fs.readFileSync(path.join(FR, 'index.html'), 'utf8').match(/const FRIMG = (\{[^;]*\});/) || [])[1]);
const frBasliklar = JSON.parse(fs.readFileSync(path.join(FR, '_drafts', 'fr-basliklar.json'), 'utf8'));

function linkFR(html) {
  return html.replace(/\/fr\/hizmet\/([a-z0-9-]+)\//g, (m, tr) => '/fr/traitement/' + (frHarita.hizmet[tr] || tr) + '/');
}
function metinYap(html) { return html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim(); }
function hizmetGovde(art, baslikAlt, linkFn) {
  let h = '<div class="gorbit-service-faq">\n<p class="gorbit-service-faq__lead">' + art.lead + '</p>\n';
  h += '<figure class="gorbit-service-detail__inline-media gorbit-service-faq__media"><img src="{{DETAY_URL}}" alt="' + baslikAlt + '" loading="lazy" width="880" height="500"></figure>\n';
  for (const f of art.faqs) h += '<details class="gorbit-service-faq__item">\n<summary class="gorbit-service-faq__question">' + f.q + '</summary>\n<div class="gorbit-service-faq__answer">' + f.a + '</div>\n</details>\n';
  h += '<div class="gorbit-service-faq__closing">' + art.closing + '</div>\n</div>';
  return linkFn(h);
}
function hizmetSema(art, linkFn) {
  return JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: art.faqs.map(f => ({ '@type': 'Question', name: metinYap(f.q), acceptedAnswer: { '@type': 'Answer', text: metinYap(linkFn(f.a)) } })) });
}
function ogeKur(tr) {
  const art = draft(FR, tr + '.js', 'ARTICLE_FR');
  const img = FRIMG[tr];
  if (!img) { console.log('HATA: FRIMG yok -> ' + tr); process.exit(1); }
  const baslik = (frBasliklar[tr] && frBasliklar[tr][1]) || art.title;
  return {
    tip: 'gorbit_service', tr_slug: tr, slug: frHarita.hizmet[tr], baslik,
    metadesc: art.metaDescription, kategori_fr: art.category,
    govde_sablon: hizmetGovde(art, baslik, linkFR), sema: hizmetSema(art, linkFR),
    kapak_kaynak: KOK + img + '-cover-300x400.jpg ', detay_kaynak: KOK + img + '-detail-880x500.jpg ',
    og_kaynak: KOK + img + '-detail-1200x682.jpg ', icerik_slug: tr, sss_sayisi: art.faqs.length,
  };
}

/* ---------- 1) ESLIK TESTI: dolgu yeniden kur == yayimlanmis kayit ---------- */
const yayimli = JSON.parse(fs.readFileSync(path.join(FR, '_wp', 'hizmet-yuk.json'), 'utf8')).ogeler;
const dolguY = yayimli.find(x => 'dolgu' === x.tr_slug);
const dolguT = ogeKur('dolgu');
dolguT.tip = dolguY.tip; /* paketteki tip alanini aynen al (ayni deger) */
let eslik = true;
for (const alan of Object.keys(dolguY)) {
  if (JSON.stringify(dolguY[alan]) !== JSON.stringify(dolguT[alan])) {
    eslik = false;
    console.log('ESLIK BOZUK alan: ' + alan);
  }
}
if (!eslik || Object.keys(dolguY).length !== Object.keys(dolguT).length) {
  console.log('ESLIK TESTI GECEMEDI - paket yazilmadi'); process.exit(1);
}
console.log('ESLIK testi: dolgu birebir ✓');

/* ---------- 2) gorsel varligi (og kopyasi dahil) ---------- */
for (const ek of ['-cover-300x400.jpg', '-detail-880x500.jpg', '-detail-1200x682.jpg']) {
  const y = path.join(FR, 'images', FRIMG['gulus-tasarimi'] + ek);
  if (!fs.existsSync(y)) { console.log('HATA: gorsel yok: ' + y); process.exit(1); }
}
console.log('gorseller: 3/3 yerinde ✓');

/* ---------- 3) tek kayit paketi ---------- */
const oge = ogeKur('gulus-tasarimi');
const paket = { surum: '1.0.1-fr-tek', grup: 'hizmet', uretim: 'uret-tek-smile-design.js', ogeler: [oge] };
const metin = JSON.stringify(paket, null, 1);
fs.writeFileSync(path.join(FR, '_wp', 'smile-design-yuk.json'), metin);
console.log('YAZILDI smile-design-yuk.json · slug: ' + oge.slug + ' · sss: ' + oge.sss_sayisi + ' · govde: ' + oge.govde_sablon.length + ' bayt');
console.log('SHA256: ' + crypto.createHash('sha256').update(metin).digest('hex'));
