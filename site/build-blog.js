/* Smile Group — blog build betiği
 * Kullanım:  node build-blog.js <journal.jsonl> [...]
 * journal'daki BLOG nesnelerini (slug + sections içerenler) blog/<slug>.html'e döker,
 * blog/index.html listesini yeniden üretir, `new Function` ile doğrular.
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const BLOG = path.join(ROOT, 'blog');
const TARIH = '05.08.2026';
const EDITOR = 'Dt. [Ad Soyad]';

const journals = process.argv.slice(2);
if (!journals.length) { console.error('Kullanım: node build-blog.js <journal.jsonl> [...]'); process.exit(1); }

const posts = new Map(); // slug -> post (son kazanır = onarım > üretim)
let satir = 0;
for (const jp of journals) {
  if (!fs.existsSync(jp)) { console.error('! journal yok:', jp); continue; }
  for (const line of fs.readFileSync(jp, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    satir++;
    let rec; try { rec = JSON.parse(line); } catch { continue; }
    const r = rec && rec.result;
    if (!r || typeof r !== 'object') continue;
    if (!r.slug || !Array.isArray(r.sections) || !r.sections.length) continue;
    posts.set(r.slug, r);
  }
}
console.log(`journal satırı: ${satir} · benzersiz blog: ${posts.size}`);

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
/* entity kaçışı + gereksiz sarmalayıcıları normalize et */
function normalize(html, allowBlock) {
  let s = String(html).trim();
  if (/&lt;(p|ul|ol|li|a|em|strong)\b/i.test(s)) {
    s = s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  }
  if (!allowBlock) {
    s = s.replace(/^<p[^>]*>/i, '').replace(/<\/p>\s*$/i, '')
         .replace(/<\/?(p|br|div|span)[^>]*>/gi, ' ').replace(/\s{2,}/g, ' ').trim();
  }
  return s;
}

if (!fs.existsSync(BLOG)) fs.mkdirSync(BLOG, { recursive: true });

let yazilan = 0;
const hatalar = [];
const liste = [];
for (const [slug, a] of posts) {
  const post = {
    slug: a.slug,
    title: a.title,
    metaDescription: a.metaDescription || '',
    lead: normalize(a.lead, false).replace(/<[^>]+>/g, ''),
    sections: a.sections.map(s => ({ h2: s.h2, html: normalize(s.html, true) })),
    faqs: (a.faqs || []).map(f => ({ q: f.q, a: normalize(f.a, false) })),
    closing: normalize(a.closing, false),
    editor: { date: TARIH, name: EDITOR },
  };
  const json = JSON.stringify(post, null, 2).replace(/<\//g, '<\\/');
  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(post.title)} — Smile Group Blog</title>
<meta name="description" content="${esc(post.metaDescription || post.lead.slice(0, 155))}">
<link rel="stylesheet" href="../assets/style.css?v=3">
</head>
<body>
<script>
window.BLOG = ${json};
</script>
<script src="../assets/render-blog.js?v=2"></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(BLOG, slug + '.html'), html, 'utf8');
  yazilan++;

  // doğrulama
  const m = html.match(/window\.BLOG = ([\s\S]*?);\n<\/script>/);
  let obj;
  try { obj = new Function('return ' + m[1])(); }
  catch (e) { hatalar.push(`${slug}: JS hatası — ${e.message}`); continue; }
  const metin = (obj.lead + ' ' + obj.sections.map(s => s.h2 + ' ' + s.html).join(' ') + ' ' +
    obj.faqs.map(f => f.q + ' ' + f.a).join(' ') + ' ' + obj.closing).replace(/<[^>]+>/g, ' ');
  const kelime = metin.replace(/\s+/g, ' ').trim().split(' ').length;
  const linkler = [...html.matchAll(/href=\\?"\/hizmet\/([^/"\\]+)\//g)].map(x => x[1]);
  if (obj.sections.length < 4) hatalar.push(`${slug}: sadece ${obj.sections.length} bölüm`);
  if (kelime < 900) hatalar.push(`${slug}: sadece ${kelime} kelime`);
  console.log(`  ✓ ${slug.padEnd(38)} ${String(obj.sections.length).padStart(2)} bölüm · ${obj.faqs.length} SSS · ${String(kelime).padStart(4)} kelime · ${linkler.length} iç link`);
  liste.push({ slug, title: post.title, desc: post.metaDescription || post.lead.slice(0, 140) });
}

/* ---- blog/index.html listesi ---- */
liste.sort((a, b) => a.slug.localeCompare(b.slug));
const kartlar = liste.map(p =>
  `  <a class="bcard" href="${p.slug}.html">` +
  `<img class="bimg" src="../gorseller/${p.slug}-detay-880x500.jpg" alt="" loading="lazy" onerror="this.remove()">` +
  `<span class="bt">${esc(p.title)}</span><span class="bd">${esc(p.desc)}</span></a>`
).join('\n');
const idx = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Blog Yazıları — Smile Group</title>
<meta name="description" content="Smile Group blog yazıları — SEO/GEO uyumlu, mevzuat-güvenli içerikler.">
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
  .bcard .bd{font-size:12.5px;color:var(--muted);line-height:1.55}
</style>
</head>
<body>
<div class="topband"><div class="in">
  <a class="brand" href="../index.html"><span class="logo">S</span><span>
    <span class="name">SMILE<span> GROUP</span></span><br>
    <span class="sub">Aesthetic &amp; Dental Clinic</span></span></a>
  <span class="tag">Blog · <b>${liste.length} yazı</b></span>
</div></div>
<div class="bwrap">
  <h1>Blog Yazıları</h1>
  <p class="sub">Hizmet sayfalarını besleyen, canlı-veri kilitli ve mevzuat-güvenli blog içerikleri.
     Her yazıda WP'ye yapıştırılacak HTML + Article/FAQPage şemaları hazırdır.</p>
  <div class="bgrid">
${kartlar}
  </div>
</div>
<div class="foot">
  <span>Smile Group · blog — iç kullanım.</span>
  <span><a href="../index.html">← Tedavi içerikleri</a></span>
</div>
</body>
</html>
`;
fs.writeFileSync(path.join(BLOG, 'index.html'), idx, 'utf8');

console.log(`\nyazılan: ${yazilan} blog + index.html`);
if (hatalar.length) { console.log('!! SORUNLAR:'); hatalar.forEach(h => console.log('  - ' + h)); process.exit(1); }
console.log('sorun yok.');
