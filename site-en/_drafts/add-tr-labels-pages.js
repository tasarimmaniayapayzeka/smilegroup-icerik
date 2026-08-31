const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

function insertAfter(src, anchor, insert, label) {
  if (!src.includes(anchor)) { console.error('ANCHOR YOK:', label, '->', anchor.slice(0, 70)); process.exit(1); }
  if (src.includes(insert)) { console.log('  (zaten var, atlandı:', label + ')'); return src; }
  return src.replace(anchor, anchor + insert);
}

// ---- yolculuk2 ----
const y2f = path.join(ROOT, 'yolculuk2', 'index.html');
let y2 = fs.readFileSync(y2f, 'utf8');
y2 = insertAfter(y2, '<h1>Smile Transformation Stories</h1>',
  '\n  <div class="tr-orig">TR original: <em>Değişim Hikayeleri</em></div>', 'y2-h1');
const y2map = [
  ["<h2>Elif's Transformation Story</h2>", "Elif Hanım'ın Değişim Hikayesi"],
  ["<h2>Murat's Transformation Story</h2>", "Murat Bey'in Değişim Hikayesi"],
  ["<h2>Zeynep's Transformation Story</h2>", "Zeynep Hanım'ın Değişim Hikayesi"],
  ["<h2>Emre's Transformation Story</h2>", "Emre Bey'in Değişim Hikayesi"],
];
for (const [anchor, tr] of y2map) {
  y2 = insertAfter(y2, anchor, '\n    <div class="tr-orig">TR: <em>' + tr + '</em></div>', 'y2:' + tr.slice(0, 12));
}
fs.writeFileSync(y2f, y2, 'utf8');
console.log('yolculuk2 OK');

// ---- yolculuk ----
const y1f = path.join(ROOT, 'yolculuk', 'index.html');
let y1 = fs.readFileSync(y1f, 'utf8');
const h1m = y1.match(/<h1>([^<]+)<\/h1>/);
console.log('yolculuk h1:', h1m && h1m[1]);
y1 = insertAfter(y1, h1m[0],
  '\n  <div class="tr-orig">TR original: <em>Tedavi Yolculukları</em></div>', 'y1-h1');
const h2s = [...y1.matchAll(/<h2>([^<]+)<\/h2>/g)].map(m => m[1]);
console.log('yolculuk h2ler:', JSON.stringify(h2s, null, 1));
fs.writeFileSync(y1f, y1, 'utf8');

// ---- hekimler ----
const hkf = path.join(ROOT, 'hekimler', 'index.html');
let hk = fs.readFileSync(hkf, 'utf8');
hk = insertAfter(hk, '<h1>Doctor Photos</h1>',
  '\n  <div class="tr-orig">TR original: <em>Hekim Fotoğrafları</em></div>', 'hk-h1');
fs.writeFileSync(hkf, hk, 'utf8');
console.log('hekimler OK');
