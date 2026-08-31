/* Smile Group EN BLOG — assembles _drafts/blog-<slug>.js drafts into blog/<slug>.html + blog/index.html */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DRAFTS = path.join(ROOT, '_drafts');
const BLOG = path.join(ROOT, 'blog');
const TR_BLOG = path.join(ROOT, '..', 'site', 'blog');
const DATE = '30 August 2026';
const EDITOR = 'Dr [Full Name]';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function trTitleOf(slug) {
  const f = path.join(TR_BLOG, slug + '.html');
  if (!fs.existsSync(f)) return null;
  const src = fs.readFileSync(f, 'utf8');
  const m = src.match(/<title>([\s\S]*?)<\/title>/);
  if (!m) return null;
  return m[1].replace(/\s*—\s*Smile Group.*$/, '').trim();
}

const files = fs.readdirSync(DRAFTS).filter(f => /^blog-.*\.js$/.test(f));
console.log(`blog taslak dosya: ${files.length}`);

if (!fs.existsSync(BLOG)) fs.mkdirSync(BLOG, { recursive: true });

const articles = new Map();
const hatalar = [];

for (const f of files) {
  const slug = f.replace(/^blog-/, '').replace(/\.js$/, '');
  const src = fs.readFileSync(path.join(DRAFTS, f), 'utf8');
  let obj;
  try {
    const sandbox = { window: {} };
    new Function('window', src)(sandbox.window);
    obj = sandbox.window.BLOG_EN;
    if (!obj) throw new Error('window.BLOG_EN bulunamadı');
  } catch (e) {
    hatalar.push(`${slug}: taslak parse hatası — ${e.message}`);
    continue;
  }
  if (!Array.isArray(obj.sections) || !obj.sections.length) hatalar.push(`${slug}: section yok`);
  if (!Array.isArray(obj.faqs) || !obj.faqs.length) hatalar.push(`${slug}: FAQ yok`);
  articles.set(slug, obj);
}

let yazilan = 0;
for (const [slug, a] of articles) {
  const article = {
    slug: a.slug,
    title: a.title,
    trTitle: trTitleOf(a.slug),
    metaDescription: a.metaDescription,
    lead: String(a.lead).trim(),
    sections: a.sections.map(s => ({ h2: s.h2, html: s.html })),
    faqs: a.faqs.map(f => ({ q: f.q, a: f.a })),
    closing: String(a.closing).trim(),
    editor: { date: DATE, name: EDITOR },
  };
  const json = JSON.stringify(article, null, 2).replace(/<\//g, '<\\/');
  const desc = a.metaDescription || article.lead.slice(0, 155);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(a.title)} — Smile Group Blog</title>
<meta name="description" content="${esc(desc)}">
<link rel="stylesheet" href="../assets/style.css?v=3">
</head>
<body>
<script>
window.BLOG = ${json};
</script>
<script src="../assets/render-blog-en.js?v=1"></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(BLOG, slug + '.html'), html, 'utf8');
  yazilan++;

  const m = html.match(/window\.BLOG = ([\s\S]*?);\n<\/script>/);
  if (!m) { hatalar.push(`${slug}: BLOG bloğu ayrıştırılamadı`); continue; }
  let obj2;
  try { obj2 = new Function('return ' + m[1])(); }
  catch (e) { hatalar.push(`${slug}: HTML çıktısı JS hatası — ${e.message}`); continue; }
  const linkler = [...html.matchAll(/href=\\?"\/en\/hizmet\/([^/"\\]+)\//g)].map(x => x[1]);
  const trLinkKalinti = [...html.matchAll(/href=\\?"\/hizmet\//g)].length;
  if (trLinkKalinti > 0) hatalar.push(`${slug}: ${trLinkKalinti} adet TR-stili /hizmet/ linki kalmış`);
  console.log(`  ✓ ${slug.padEnd(42)} ${String(obj2.sections.length).padStart(2)} section · ${String(obj2.faqs.length).padStart(2)} FAQ · ${linkler.length} iç link`);
}

/* ---------- blog/index.html üret (TR ile aynı slug sırası) ---------- */
const ORDER = [
  '60-yas-ustu-dis-sagligi', 'cocuklarda-curuk-onleme', 'dis-beyazlatma-dogru-bilinen-yanlislar',
  'dis-kaplama-omru', 'hamilelikte-dis-sagligi', 'implant-iyilesme-sureci',
  'implant-mi-kopru-mu', 'seffaf-plak-mi-dis-teli-mi', 'stres-ve-dis-sagligi',
];
const cards = ORDER.filter(s => articles.has(s)).map(slug => {
  const a = articles.get(slug);
  const tr = trTitleOf(slug);
  const trLine = tr ? `<span class="btr">TR: ${esc(tr)}</span>` : '';
  return `  <a class="bcard" href="${slug}.html"><img class="bimg" src="../../site/gorseller/${slug}-detay-880x500.jpg" alt="" loading="lazy" onerror="this.remove()"><span class="bt">${esc(a.title)}</span>${trLine}<span class="bd">${esc(a.metaDescription || '')}</span></a>`;
}).join('\n');

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Blog — Smile Group</title>
<meta name="description" content="Smile Group blog articles — SEO/GEO-ready, regulation-safe content, English edition.">
<link rel="stylesheet" href="../assets/style.css?v=3">
<style>
  .bwrap{max-width:900px;margin:0 auto;padding:26px 20px 60px}
  .bwrap h1{font-size:26px;color:var(--navy)}
  .bwrap .sub{color:var(--muted);font-size:14px;margin:8px 0 22px;line-height:1.6}
  .bgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}
  .bcard{display:flex;flex-direction:column;gap:8px;border:1px solid var(--line-2);border-radius:12px;
    padding:14px 16px 16px;background:#fff;text-decoration:none;transition:border-color .15s,box-shadow .15s;overflow:hidden}
  .bcard .bimg{display:block;width:100%;height:130px;object-fit:cover;border-radius:8px;margin-bottom:2px}
  .bcard:hover{border-color:var(--gold);box-shadow:0 10px 26px rgba(15,36,64,.08);text-decoration:none}
  .bcard .bt{font-size:15px;font-weight:700;color:var(--navy);line-height:1.4}
  .bcard .btr{font-size:11px;color:var(--muted);font-style:italic}
  .bcard .bd{font-size:12.5px;color:var(--muted);line-height:1.55}
</style>
</head>
<body>
<div class="topband"><div class="in">
  <a class="brand" href="../index.html"><span class="logo">S</span><span>
    <span class="name">SMILE<span> GROUP</span></span><br>
    <span class="sub">Aesthetic &amp; Dental Clinic</span></span></a>
  <span class="tag">Blog · <b>9 articles</b></span>
</div></div>
<div class="bwrap">
  <h1>Blog Articles</h1>
  <p class="sub">Blog content that feeds the treatment pages — live-data-anchored and regulation-safe.
     Every article has ready-to-paste WordPress HTML plus Article/FAQPage schemas.</p>
  <div class="bgrid">
${cards}
  </div>
</div>
<div class="foot">
  <span>Smile Group · blog — internal use.</span>
  <span><a href="../index.html">← Treatment content</a></span>
</div>
</body>
</html>
`;
fs.writeFileSync(path.join(BLOG, 'index.html'), indexHtml, 'utf8');

console.log(`\nyazılan makale: ${yazilan} / beklenen 9 · blog/index.html üretildi (${ORDER.filter(s => articles.has(s)).length} kart)`);
if (hatalar.length) {
  console.log('\n!! SORUNLAR:');
  hatalar.forEach(h => console.log('  - ' + h));
  process.exit(1);
}
console.log('sorun yok.');
