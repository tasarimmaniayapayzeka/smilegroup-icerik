/* Smile Group DE — assembles translated drafts (_drafts/<slug>.js) into hizmet/<slug>.html
 * Mirrors ../site-en/build-en.js's escaping/validation approach, adapted for the DE schema
 * (slug,title,category,lead,faqs,closing,metaDescription) and centrally-set editor/date. */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DRAFTS = path.join(ROOT, '_drafts');
const HIZMET = path.join(ROOT, 'hizmet');
const TR_HIZMET = path.join(ROOT, '..', 'site', 'hizmet');
const INDEX = path.join(ROOT, 'index.html');
const DATE = '6 septembre 2026';
const EDITOR = 'Dr [Prénom Nom]';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function trTitleOf(slug) {
  const f = path.join(TR_HIZMET, slug + '.html');
  if (!fs.existsSync(f)) return null;
  const src = fs.readFileSync(f, 'utf8');
  const m = src.match(/<title>([\s\S]*?)<\/title>/);
  if (!m) return null;
  return m[1].replace(/\s*—\s*Smile Group.*$/, '').trim();
}

const FR_SLUGS = JSON.parse(fs.readFileSync(path.join(DRAFTS, 'fr-slug-map.json'), 'utf8')).hizmet;

const files = fs.readdirSync(DRAFTS).filter(f => f.endsWith('.js') && !f.startsWith('blog-') && !/^(sitewide-check|add-tr-labels|copy-fr-images)/.test(f));
console.log(`taslak dosya: ${files.length}`);

if (!fs.existsSync(HIZMET)) fs.mkdirSync(HIZMET, { recursive: true });

const articles = new Map();
const hatalar = [];

for (const f of files) {
  const slug = f.replace(/\.js$/, '');
  const src = fs.readFileSync(path.join(DRAFTS, f), 'utf8');
  let obj;
  try {
    const sandbox = { window: {} };
    new Function('window', src)(sandbox.window);
    obj = sandbox.window.ARTICLE_FR;
    if (!obj) throw new Error('window.ARTICLE_FR bulunamadı');
  } catch (e) {
    hatalar.push(`${slug}: taslak parse hatası — ${e.message}`);
    continue;
  }
  if (obj.slug !== slug) hatalar.push(`${slug}: obj.slug (${obj.slug}) dosya adıyla uyuşmuyor`);
  if (!Array.isArray(obj.faqs) || obj.faqs.length < 6) hatalar.push(`${slug}: sadece ${(obj.faqs||[]).length} FAQ`);
  articles.set(slug, obj);
}

let yazilan = 0;
for (const [slug, a] of articles) {
  const article = {
    slug: a.slug,
    frSlug: FR_SLUGS[a.slug] || null,
    title: a.title,
    trTitle: trTitleOf(a.slug),
    breadcrumb: ['Accueil', a.category, a.title],
    lead: String(a.lead).trim(),
    faqs: a.faqs.map(f => ({ q: f.q, a: f.a })),
    closing: String(a.closing).trim(),
    editor: { date: DATE, name: EDITOR },
  };
  const json = JSON.stringify(article, null, 2).replace(/<\//g, '<\\/');
  const desc = a.metaDescription || article.lead.slice(0, 155);

  const html = `<!DOCTYPE html>
<html lang="fr">
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
<script src="../assets/render-fr.js?v=1"></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(HIZMET, slug + '.html'), html, 'utf8');
  yazilan++;

  /* doğrula: new Function ile JS geçerliliği + link/FAQ sayımı */
  const m = html.match(/window\.ARTICLE = ([\s\S]*?);\n<\/script>/);
  if (!m) { hatalar.push(`${slug}: ARTICLE bloğu ayrıştırılamadı`); continue; }
  let obj2;
  try { obj2 = new Function('return ' + m[1])(); }
  catch (e) { hatalar.push(`${slug}: HTML çıktısı JS hatası — ${e.message}`); continue; }
  const linkler = [...html.matchAll(/href=\\?"\/de\/hizmet\/([^/"\\]+)\//g)].map(x => x[1]);
  const trLinkKalinti = [...html.matchAll(/href=\\?"\/hizmet\//g)].length;
  const enLinkKalinti = [...html.matchAll(/href=\\?"\/en\//g)].length;
  if (trLinkKalinti > 0) hatalar.push(`${slug}: ${trLinkKalinti} adet TR-stili /hizmet/ linki kalmış (olması gereken /fr/hizmet/)`);
  if (enLinkKalinti > 0) hatalar.push(`${slug}: ${enLinkKalinti} adet /en/ linki kalmış (olması gereken /de/)`);
  console.log(`  ✓ ${slug.padEnd(30)} ${String(obj2.faqs.length).padStart(2)} FAQ · ${linkler.length} iç link · kategori: ${a.category}`);
}

/* ---------- index.html DONE Set'ini hizmet/*.html'den yeniden hesapla ---------- */
const mevcut = fs.readdirSync(HIZMET).filter(f => f.endsWith('.html')).map(f => f.replace(/\.html$/, '')).sort();
let idx = fs.readFileSync(INDEX, 'utf8');
const RE_DONE = /const DONE = new Set\(\[[^\]]*\]\);/;
if (!RE_DONE.test(idx)) {
  hatalar.push('index.html: DONE Set bulunamadı, sayaç GÜNCELLENMEDİ');
} else {
  fs.writeFileSync(INDEX, idx.replace(RE_DONE, 'const DONE = new Set(' + JSON.stringify(mevcut) + ');'), 'utf8');
}

console.log(`\nyazılan sayfa: ${yazilan} / hedef 59 · index DONE: ${mevcut.length}`);
if (hatalar.length) {
  console.log('\n!! SORUNLAR:');
  hatalar.forEach(h => console.log('  - ' + h));
  process.exit(1);
}
console.log('sorun yok.');
