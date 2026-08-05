/* Smile Group — site tedavi içerikleri build betiği
 * Kullanım:  node build.js <journal.jsonl> [<journal2.jsonl> ...]
 *
 * Workflow scriptleri dosyaya yazamadığı için ajan çıktıları journal.jsonl'e düşer.
 * Bu betik: journal'ları okur → ARTICLE nesnelerini toplar (son kazanır = onarım > üretim)
 *           → hizmet/<slug>.html üretir → index.html içindeki DONE Set'ini yeniden hesaplar
 *           → her dosyayı `new Function` ile doğrular.
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const HIZMET = path.join(ROOT, 'hizmet');
const INDEX = path.join(ROOT, 'index.html');
const TARIH = '04.08.2026';
const EDITOR = 'Dt. [Ad Soyad]';

const journals = process.argv.slice(2);
if (!journals.length) {
  console.error('Kullanım: node build.js <journal.jsonl> [...]');
  process.exit(1);
}

/* ---------- 1) journal'lardan ARTICLE nesnelerini topla ---------- */
const articles = new Map(); // slug -> article (son kazanır)
let satir = 0, aday = 0;

for (const jp of journals) {
  if (!fs.existsSync(jp)) { console.error('! journal yok:', jp); continue; }
  for (const line of fs.readFileSync(jp, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    satir++;
    let rec;
    try { rec = JSON.parse(line); } catch { continue; }
    const r = rec && rec.result;
    if (!r || typeof r !== 'object') continue;
    if (!r.slug || !Array.isArray(r.faqs) || !r.faqs.length) continue; // VERDICT'leri ele
    aday++;
    articles.set(r.slug, r); // son kazanır
  }
}
console.log(`journal satırı: ${satir} · ARTICLE adayı: ${aday} · benzersiz slug: ${articles.size}`);

/* ---------- 2) HTML üret ---------- */
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* Ajanlar bazen closing'i <p>…</p> ile sarıyor, bazen sarmıyor; bazen de HTML'i
   entity'ye kaçırıyor (&lt;a href…&gt;) — o hâlde link tıklanamaz düz metin olur.
   İkisini de burada normalize et ki sayfalar arasında fark kalmasın. */
function normalize(html) {
  let s = String(html).trim();
  if (/&lt;a\s|&lt;em&gt;|&lt;strong&gt;|&lt;p&gt;/i.test(s)) {
    s = s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  }
  s = s.replace(/^<p[^>]*>/i, '').replace(/<\/p>\s*$/i, '').trim();
  s = s.replace(/<\/p>\s*<p[^>]*>/gi, ' ').replace(/<\/?(p|br|div|span)[^>]*>/gi, ' ');
  return s.replace(/\s{2,}/g, ' ').trim();
}

function sayfaUret(a) {
  const article = {
    slug: a.slug,
    title: a.title,
    breadcrumb: a.breadcrumb && a.breadcrumb.length ? a.breadcrumb : ['Anasayfa', 'Tedavilerimiz', a.title],
    lead: normalize(a.lead).replace(/<[^>]+>/g, ''),
    faqs: a.faqs.map(f => ({ q: f.q, a: normalize(f.a) })),
    closing: normalize(a.closing),
    editor: { date: TARIH, name: EDITOR },
  };
  // </script> kaçışı: JS string literali içinde <\/ === </
  const json = JSON.stringify(article, null, 2).replace(/<\//g, '<\\/');
  const desc = a.metaDescription || a.lead.slice(0, 155);

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(a.title)} — Smile Group</title>
<meta name="description" content="${esc(desc)}">
<link rel="stylesheet" href="../assets/style.css?v=2">
</head>
<body>
<script>
window.ARTICLE = ${json};
</script>
<script src="../assets/render.js?v=2"></script>
</body>
</html>
`;
}

if (!fs.existsSync(HIZMET)) fs.mkdirSync(HIZMET, { recursive: true });

let yazilan = 0;
const hatalar = [];
for (const [slug, a] of articles) {
  const html = sayfaUret(a);
  const dosya = path.join(HIZMET, slug + '.html');
  fs.writeFileSync(dosya, html, 'utf8');
  yazilan++;

  /* ---------- 3) doğrula: JS sözdizimi + içerik sayımları ---------- */
  const m = html.match(/window\.ARTICLE = ([\s\S]*?);\n<\/script>/);
  if (!m) { hatalar.push(`${slug}: ARTICLE bloğu ayrıştırılamadı`); continue; }
  let obj;
  try {
    obj = new Function('return ' + m[1])();
  } catch (e) {
    hatalar.push(`${slug}: JS sözdizimi hatası — ${e.message}`);
    continue;
  }
  const kelime = (obj.lead + ' ' + obj.faqs.map(f => f.q + ' ' + f.a).join(' ') + ' ' + obj.closing)
    .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').length;
  // JSON kaçışı yüzünden href=\" biçiminde olabilir
  const linkler = [...html.matchAll(/href=\\?"\/hizmet\/([^/"\\]+)\//g)].map(x => x[1]);
  if (obj.faqs.length < 6) hatalar.push(`${slug}: sadece ${obj.faqs.length} akordiyon`);
  if (kelime < 500) hatalar.push(`${slug}: sadece ${kelime} kelime`);
  console.log(`  ✓ ${slug.padEnd(30)} ${String(obj.faqs.length).padStart(2)} akordiyon · ${String(kelime).padStart(4)} kelime · ${linkler.length} iç link`);
}

/* ---------- 4) index.html DONE Set'ini hizmet/*.html'den yeniden hesapla ---------- */
const mevcut = fs.readdirSync(HIZMET).filter(f => f.endsWith('.html')).map(f => f.replace(/\.html$/, '')).sort();
let idx = fs.readFileSync(INDEX, 'utf8');
const RE_DONE = /const DONE = new Set\(\[[^\]]*\]\);/;
if (!RE_DONE.test(idx)) {
  hatalar.push('index.html: DONE Set bulunamadı, sayaç GÜNCELLENMEDİ');
} else {
  // not: yeni liste eskisiyle aynıysa dosya değişmez — bu hata değil
  fs.writeFileSync(INDEX, idx.replace(RE_DONE, 'const DONE = new Set(' + JSON.stringify(mevcut) + ');'), 'utf8');
}

/* ---------- 5) rapor ---------- */
console.log(`\nyazılan sayfa: ${yazilan} · hizmet/ toplam: ${mevcut.length} · index DONE: ${mevcut.length}`);
if (hatalar.length) {
  console.log('\n!! SORUNLAR:');
  hatalar.forEach(h => console.log('  - ' + h));
  process.exit(1);
}
console.log('sorun yok.');
