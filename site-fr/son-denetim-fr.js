/* SITE-FR SON DENETİM — İngilizce merkezle yapısal eşlik + hata taraması.
 * 1 dosya envanteri  2 dil/krom kalıntısı  3 title+meta  4 iç link bütünlüğü
 * 5 yerel görsel varlığı  6 paste /en/-kalıntısı  7 SSS sayısı EN==DE  8 şema
 * 9 slug haritaları  10 pano DONE + KURUMSAL linkleri  */
const fs = require('fs');
const path = require('path');
const DE = __dirname; // (FR kökü — değişken adı korunumlu)
const EN = path.join(DE, '..', 'site-en');
const H = []; // hatalar
const U = []; // uyarılar

function walk(dir, base, out) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const rel = path.join(base, f).replace(/\\/g, '/');
    if (fs.statSync(p).isDirectory()) { if (!/high-res|doctors|img/.test(f)) walk(p, rel, out); }
    else if (f.endsWith('.html')) out.push(rel);
  }
}

/* 1) envanter */
const enF = [], deF = [];
walk(EN, '', enF); walk(DE, '', deF);
const deSet = new Set(deF);
for (const f of enF) {
  if (f.startsWith('images/')) continue;
  if (!deSet.has(f)) H.push('ENVANTER: EN var, DE yok → ' + f);
}
console.log('EN html: ' + enF.length + ' · FR html: ' + deF.length);

/* stil dosyası */
if (!fs.existsSync(path.join(DE, 'assets', 'style.css'))) H.push('KRITIK: site-fr/assets/style.css YOK — tüm sayfalar stilsiz kalır');

/* 2-6) sayfa taraması */
const kromKalinti = /(EN edition|Corporate page|Import to WordPress|>Copy<|← All content|min read|View details|Read More|Read the story|Read the article|View All|Book an Appointment|weeks ago|Illustrative image|Representative image|internal use\.|lang="en"|lang="de"|DE-Ausgabe|Kopieren|Alle Inhalte)/;
const linkler = new Map(); // hedef -> [kaynaklar]
for (const f of deF) {
  const p = path.join(DE, f);
  const s = fs.readFileSync(p, 'utf8');
  const temiz = s.replace(/TR[-: ][^\n]*/g, '').replace(/https?:[^\s"']*/g, '');
  if (!s.includes('lang="fr"')) H.push('DİL: lang="fr" yok → ' + f);
  const m = temiz.match(kromKalinti);
  if (m) H.push('EN KALINTI: "' + m[1] + '" → ' + f);
  if (!/<title>[^<]+<\/title>/.test(s)) H.push('TITLE yok → ' + f);
  if (!/<meta name="description" content="[^"]{20,}">/.test(s)) U.push('meta description kısa/yok → ' + f);
  // iç linkler (görece .html) + yerel img
  const dirOf = path.dirname(f);
  for (const mm of s.matchAll(/(?:href|src)="((?:\.\.\/|\.\/)?[^"#:]*?\.(?:html|jpg|jpeg|png|webp|css|js))(?:\?[^"]*)?"/g)) {
    const hedef = mm[1];
    if (hedef.startsWith('http')) continue;
    if (hedef.includes("'+")) continue; // JS string birleştirme — gerçek yol değil
    const cozum = path.normalize(path.join(DE, dirOf, hedef));
    if (!fs.existsSync(cozum)) {
      const kayit = hedef + '  (kaynak: ' + f + ')';
      if (!linkler.has(kayit)) linkler.set(kayit, 0);
      linkler.set(kayit, linkler.get(kayit) + 1);
    }
  }
  // paste içinde /en/ kalıntısı
  if (/href="\/en\//.test(s) || /href=\\"\/en\//.test(s) || s.includes('href="/en/') || s.includes('&lt;a href="/en/')) H.push('PASTE /en/ kalıntı → ' + f);
}
for (const [k] of linkler) H.push('KIRIK LİNK: ' + k);

/* 7) SSS eşitliği (tedavi + blog taslakları) */
function draft(dir, file, g) {
  const sandbox = { window: {} };
  new Function('window', fs.readFileSync(path.join(dir, '_drafts', file), 'utf8'))(sandbox.window);
  return sandbox.window[g];
}
const hizmetTaslak = fs.readdirSync(path.join(DE, '_drafts'))
  .filter(x => x.endsWith('.js') && !x.startsWith('blog-') && !/^(sitewide-check|add-tr-labels|copy-de-images|fr-basliklar|fr-iskelet)/.test(x));
let sssEs = 0;
for (const t of hizmetTaslak) {
  const d = draft(DE, t, 'ARTICLE_FR');
  let e; try { e = draft(EN, t, 'ARTICLE_EN'); } catch { U.push('EN taslak yok (karşılaştırılamadı): ' + t); continue; }
  if (d.faqs.length !== e.faqs.length) H.push('SSS FARKI: ' + t + ' DE=' + d.faqs.length + ' EN=' + e.faqs.length);
  else sssEs++;
  if (d.slug !== t.replace(/\.js$/, '')) H.push('SLUG UYUMSUZ: ' + t);
}
let blogEs = 0;
for (const t of fs.readdirSync(path.join(DE, '_drafts')).filter(x => /^blog-.*\.js$/.test(x))) {
  const d = draft(DE, t, 'BLOG_FR');
  const e = draft(EN, t, 'BLOG_EN');
  if (d.faqs.length !== e.faqs.length) H.push('BLOG SSS FARKI: ' + t);
  else if (d.sections.length !== e.sections.length) H.push('BLOG BÖLÜM FARKI: ' + t);
  else blogEs++;
}
console.log('SSS eşit tedavi: ' + sssEs + '/' + hizmetTaslak.length + ' · blog eşit: ' + blogEs + '/9');

/* 8) şema (üretilmiş sayfalarda FAQPage) */
let sema = 0;
for (const f of deF.filter(x => x.startsWith('hizmet/') || (x.startsWith('blog/') && !x.endsWith('index.html')))) {
  const s = fs.readFileSync(path.join(DE, f), 'utf8');
  if (s.includes('render-fr.js') || s.includes('render-blog-fr.js')) sema++;
  else H.push('RENDER MOTORU YOK: ' + f);
}
console.log('render motorlu sayfa: ' + sema);

/* 9) slug haritaları */
const harita = JSON.parse(fs.readFileSync(path.join(DE, '_drafts', 'fr-slug-map.json'), 'utf8'));
if (Object.keys(harita.hizmet).length !== 59) H.push('HARİTA: hizmet ' + Object.keys(harita.hizmet).length + ' ≠ 59');
if (Object.keys(harita.blog || {}).length !== 9) H.push('HARİTA: blog ' + Object.keys(harita.blog || {}).length + ' ≠ 9');
const cift = new Set();
for (const v of [...Object.values(harita.hizmet), ...Object.values(harita.blog)]) {
  if (cift.has(v)) H.push('HARİTA: Fransızca slug ÇİFT → ' + v);
  cift.add(v);
  if (/[àâäéèêëîïôöùûüçœÀÂÄÉÈÊËÎÏÔÖÙÛÜÇŒ ]/.test(v)) H.push('HARİTA: slugda aksan/boşluk → ' + v);
}

/* 10) pano */
const pano = fs.readFileSync(path.join(DE, 'index.html'), 'utf8');
const done = (pano.match(/const DONE = new Set\(\[([^\]]*)\]\)/) || [, ''])[1].split(',').filter(x => x.trim()).length;
if (done !== 59) H.push('PANO: DONE=' + done + ' ≠ 59');
for (const mm of pano.matchAll(/\["[^"]+","((?:kurumsal|doktor)\/[a-z-]+\.html)"/g)) {
  if (!fs.existsSync(path.join(DE, mm[1]))) H.push('PANO KURUMSAL kırık: ' + mm[1]);
}

/* görsel sayımı */
const imgDe = fs.readdirSync(path.join(DE, 'images')).filter(x => x.endsWith('.jpg')).length;
console.log('site-fr/images .jpg: ' + imgDe + ' + doctors/: ' + fs.readdirSync(path.join(DE, 'images', 'doctors')).length);

console.log('\n=== SONUÇ ===');
console.log('HATA: ' + H.length);
H.forEach(x => console.log('  ✗ ' + x));
console.log('UYARI: ' + U.length);
U.slice(0, 10).forEach(x => console.log('  ? ' + x));
