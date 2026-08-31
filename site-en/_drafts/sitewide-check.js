const fs = require('fs');
const path = require('path');
const HIZMET = path.join(__dirname, '..', 'hizmet');

const files = fs.readdirSync(HIZMET).filter(f => f.endsWith('.html'));
const validSlugs = new Set(files.map(f => f.replace(/\.html$/, '')));

let brokenLinks = [], trStyleLinks = [], turkishChars = [], missingEnPrefix = [];
const TR_CHARS = /[çğıöşüÇĞİÖŞÜ]/;

for (const f of files) {
  const slug = f.replace(/\.html$/, '');
  const html = fs.readFileSync(path.join(HIZMET, f), 'utf8');

  // every /en/hizmet/X/ link must point to a real slug
  for (const m of html.matchAll(/\/en\/hizmet\/([a-z0-9-]+)\//g)) {
    if (!validSlugs.has(m[1])) brokenLinks.push(`${slug} -> links to missing slug "${m[1]}"`);
  }
  // no leftover TR-style /hizmet/ (without /en) links
  const trLinks = [...html.matchAll(/href=\\?"\/hizmet\//g)];
  if (trLinks.length) trStyleLinks.push(`${slug}: ${trLinks.length} leftover /hizmet/ (no /en) link(s)`);

  // no /iletisim/ leftover
  if (/\/iletisim\//.test(html)) missingEnPrefix.push(`${slug}: leftover /iletisim/ link`);

  // no leftover Turkish characters in the ARTICLE content (title/lead/faq/closing)
  const m2 = html.match(/window\.ARTICLE = ([\s\S]*?);\n<\/script>/);
  if (m2) {
    const obj = new Function('return ' + m2[1])();
    const blob = obj.title + ' ' + obj.lead + ' ' + obj.faqs.map(x=>x.q+' '+x.a).join(' ') + ' ' + obj.closing;
    if (TR_CHARS.test(blob)) turkishChars.push(`${slug}: contains Turkish-specific characters`);
  }
}

console.log(`Toplam sayfa: ${files.length}`);
console.log(`Kırık iç link (var olmayan slug'a giden): ${brokenLinks.length}`);
brokenLinks.forEach(x => console.log('  ! ' + x));
console.log(`TR-stili /hizmet/ linki kalıntısı: ${trStyleLinks.length}`);
trStyleLinks.forEach(x => console.log('  ! ' + x));
console.log(`/iletisim/ kalıntısı: ${missingEnPrefix.length}`);
missingEnPrefix.forEach(x => console.log('  ! ' + x));
console.log(`Türkçe karakter kalıntısı (ARTICLE içeriğinde): ${turkishChars.length}`);
turkishChars.forEach(x => console.log('  ! ' + x));

const clean = !brokenLinks.length && !trStyleLinks.length && !missingEnPrefix.length && !turkishChars.length;
console.log(clean ? '\n✓ SİTE GENELİ TEMİZ' : '\n✗ SORUN VAR — yukarıya bak');
process.exit(clean ? 0 : 1);
