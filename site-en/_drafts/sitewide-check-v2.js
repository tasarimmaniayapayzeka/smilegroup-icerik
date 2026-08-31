const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const HIZMET = path.join(ROOT, 'hizmet');
const BLOG = path.join(ROOT, 'blog');

const validSlugs = new Set(fs.readdirSync(HIZMET).filter(f => f.endsWith('.html')).map(f => f.replace(/\.html$/, '')));
const TR_CHARS = /[çğıöşüÇĞİÖŞÜ]/;
// Turkish given names / honorifics that are intentionally kept as-is — excluded from the TR-char scan.
const ALLOWED_TR_WORDS = /(İlayda|Ançin|Zeynep|Gökcegözoğlu|Öztan|Uysal|Kadir|Sakur|İhsan|Erik|Nadide|Nur|Yüksel|Çiğdem|Elif|Emre)/g;

let issues = [];

function scanFile(label, file, opts = {}) {
  const html = fs.readFileSync(file, 'utf8');
  // TR-style /hizmet/ (no /en/) leftover
  const trLinks = [...html.matchAll(/href=\\?"\/hizmet\//g)];
  if (trLinks.length) issues.push(`${label}: ${trLinks.length} leftover /hizmet/ (no /en) link(s)`);
  // /iletisim/ leftover
  if (/\/iletisim\//.test(html)) issues.push(`${label}: leftover /iletisim/ link`);
  // broken /en/hizmet/X/ links
  for (const m of html.matchAll(/\/en\/hizmet\/([a-z0-9-]+)\//g)) {
    if (!validSlugs.has(m[1])) issues.push(`${label}: links to missing slug "${m[1]}"`);
  }
  // leftover Turkish characters (excluding allowed proper names AND intentional "TR original" reference labels)
  let stripped = html.replace(ALLOWED_TR_WORDS, '');
  stripped = stripped.replace(/"trTitle":\s*"(?:[^"\\]|\\.)*"/g, '"trTitle":""');
  stripped = stripped.replace(/<span class="(trtag|btr)"[^>]*>[\s\S]*?<\/span>/g, '');
  stripped = stripped.replace(/<div class="tr-orig">[\s\S]*?<\/div>/g, '');
  if (opts.stripDataArray) stripped = stripped.replace(/const DATA = \[[\s\S]*?\n\];/, 'const DATA = [];');
  if (TR_CHARS.test(stripped)) {
    const sample = (stripped.match(new RegExp('.{0,20}' + TR_CHARS.source + '.{0,20}', 'g')) || []).slice(0, 3);
    if (opts.trCharsWarnOnly) {
      console.log(`    (uyarı — TR karakter, özel ad olabilir) ${label}: ${JSON.stringify(sample)}`);
    } else {
      issues.push(`${label}: Turkish characters found — sample: ${JSON.stringify(sample)}`);
    }
  }
  // lang attribute
  if (!/<html lang="en"/.test(html)) issues.push(`${label}: <html lang="en"> missing`);
  console.log(`  checked ${label} (${html.length} bytes)`);
}

console.log('--- hizmet/ (59) ---');
for (const f of fs.readdirSync(HIZMET).filter(f => f.endsWith('.html'))) {
  scanFile('hizmet/' + f, path.join(HIZMET, f));
}

console.log('--- blog/ (10: 9 makale + index) ---');
for (const f of fs.readdirSync(BLOG).filter(f => f.endsWith('.html'))) {
  scanFile('blog/' + f, path.join(BLOG, f));
}

console.log('--- yolculuk/ ---');
scanFile('yolculuk/index.html', path.join(ROOT, 'yolculuk', 'index.html'));

console.log('--- yolculuk2/ ---');
scanFile('yolculuk2/index.html', path.join(ROOT, 'yolculuk2', 'index.html'));

console.log('--- hekimler/ ---');
scanFile('hekimler/index.html', path.join(ROOT, 'hekimler', 'index.html'));

console.log('--- kurumsal/ (17) ---');
const KUR = path.join(ROOT, 'kurumsal');
for (const f of fs.readdirSync(KUR).filter(f => f.endsWith('.html') && !f.startsWith('_'))) {
  scanFile('kurumsal/' + f, path.join(KUR, f), { trCharsWarnOnly: true });
}

console.log('--- doktor/ (6) ---');
const DOK = path.join(ROOT, 'doktor');
for (const f of fs.readdirSync(DOK).filter(f => f.endsWith('.html'))) {
  scanFile('doktor/' + f, path.join(DOK, f), { trCharsWarnOnly: true });
}

console.log('--- index.html (ana pano) ---');
scanFile('index.html', path.join(ROOT, 'index.html'), { stripDataArray: true, trCharsWarnOnly: true });

console.log(`\nToplam sorun: ${issues.length}`);
issues.forEach(x => console.log('  ! ' + x));
console.log(issues.length === 0 ? '\n✓ SİTE GENELİ (genişletilmiş) TEMİZ' : '\n✗ SORUN VAR');
process.exit(issues.length === 0 ? 0 : 1);
