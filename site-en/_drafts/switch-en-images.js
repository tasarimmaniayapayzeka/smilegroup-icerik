/* index.html thumb'larını + yolculuk/yolculuk2/hekimler statik sayfalarını EN-adlı görsellere geçirir. */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const map = JSON.parse(fs.readFileSync(path.join(__dirname, 'en-slug-map.json'), 'utf8'));

/* ---- 1) index.html: kart thumb'ı EN görsel; DATA'ya dokunma, render satırını değiştir ---- */
const idxF = path.join(ROOT, 'index.html');
let idx = fs.readFileSync(idxF, 'utf8');
const oldThumb = "'<img class=\"thumb\" src=\"../site/gorseller/'+slug+'-kapak-300x400.jpg\" alt=\"\" loading=\"lazy\" onerror=\"this.remove()\">'";
const newThumb = "'<img class=\"thumb\" src=\"images/'+(ENIMG[slug]||slug)+'-cover-300x400.jpg\" alt=\"'+label+' — cover\" loading=\"lazy\" onerror=\"this.remove()\">'";
if (idx.includes(oldThumb)) {
  idx = idx.replace(oldThumb, newThumb);
} else if (!idx.includes("images/'+(ENIMG[slug]")) {
  console.error('index thumb anchor bulunamadı'); process.exit(1);
}
// ENIMG haritasını script başına göm
if (!idx.includes('const ENIMG')) {
  idx = idx.replace('const DATA = [', 'const ENIMG = ' + JSON.stringify(map.hizmet) + ';\nconst DATA = [');
}
fs.writeFileSync(idxF, idx, 'utf8');
console.log('index.html: thumb EN görsele geçti');

/* ---- 2) yolculuk ---- */
const y1F = path.join(ROOT, 'yolculuk', 'index.html');
let y1 = fs.readFileSync(y1F, 'utf8');
for (const [tr, en] of Object.entries(map.yolculuk)) {
  y1 = y1.split('../../site/yolculuk/img/' + tr + '.jpg').join('../images/' + en + '.jpg');
  // yüksek çözünürlük kaynak PNG: src paylaşımlı kalır, download adı EN olur
  y1 = y1.replace(new RegExp('download="smilegroup-yolculuk-' + tr + '\\.jpg"', 'g'), 'download="smilegroup-' + en + '.jpg"');
  y1 = y1.replace(new RegExp('download="smilegroup-yolculuk-' + tr + '-yuksek\\.png"', 'g'), 'download="smilegroup-' + en + '-high-res.png"');
}
fs.writeFileSync(y1F, y1, 'utf8');
console.log('yolculuk: ' + (y1.match(/\.\.\/images\//g) || []).length + ' EN görsel referansı');

/* ---- 3) yolculuk2 ---- */
const y2F = path.join(ROOT, 'yolculuk2', 'index.html');
let y2 = fs.readFileSync(y2F, 'utf8');
for (const [tr, en] of Object.entries(map.yolculuk2)) {
  y2 = y2.split('../../site/yolculuk2/img/' + tr + '.jpg').join('../images/' + en + '.jpg');
  y2 = y2.replace(new RegExp('download="smilegroup-degisim-' + tr + '\\.jpg"', 'g'), 'download="smilegroup-' + en + '.jpg"');
  y2 = y2.replace(new RegExp('download="smilegroup-degisim-' + tr + '-yuksek\\.png"', 'g'), 'download="smilegroup-' + en + '-high-res.png"');
}
fs.writeFileSync(y2F, y2, 'utf8');
console.log('yolculuk2: ' + (y2.match(/\.\.\/images\//g) || []).length + ' EN görsel referansı');

/* ---- 4) hekimler ---- */
const hkF = path.join(ROOT, 'hekimler', 'index.html');
let hk = fs.readFileSync(hkF, 'utf8');
for (const [tr, en] of Object.entries(map.hekimler)) {
  for (const n of [1, 2]) {
    hk = hk.split('../../site/hekimler/img/' + tr + '-durus' + n + '.jpg').join('../images/doctors/' + en + '-pose-' + n + '.jpg');
    hk = hk.split('../../site/hekimler/img/yuksek/' + tr + '-durus' + n + '.jpg').join('../images/doctors/high-res/' + en + '-pose-' + n + '.jpg');
    hk = hk.replace(new RegExp('download="smilegroup-' + tr + '-durus' + n + '\\.jpg"', 'g'), 'download="smilegroup-' + en + '-pose-' + n + '.jpg"');
    hk = hk.replace(new RegExp('download="smilegroup-' + tr + '-durus' + n + '-yuksek\\.jpg"', 'g'), 'download="smilegroup-' + en + '-pose-' + n + '-high-res.jpg"');
  }
}
fs.writeFileSync(hkF, hk, 'utf8');
const kalanTR = (hk.match(/site\/hekimler\/img/g) || []).length;
console.log('hekimler: EN görsel referansı ' + (hk.match(/\.\.\/images\/doctors\//g) || []).length + ' · kalan TR yolu (beklenen 0): ' + kalanTR);

/* ---- 5) doğrula: tüm ../images/ referansları diske çözülüyor mu ---- */
let broken = [];
function checkFile(file, base) {
  const html = fs.readFileSync(file, 'utf8');
  for (const m of html.matchAll(/(?:src|href)="(\.\.\/images\/[^"]+|images\/[^"]+)"/g)) {
    const rel = m[1];
    if (rel.includes("'+")) continue; // JS şablon satırı, gerçek referans değil
    const p = rel.startsWith('../') ? path.join(path.dirname(file), rel) : path.join(ROOT, rel);
    if (!fs.existsSync(p)) broken.push(file.replace(ROOT, '') + ' -> ' + rel);
  }
}
checkFile(idxF);
checkFile(y1F); checkFile(y2F); checkFile(hkF);
for (const d of ['hizmet', 'blog']) {
  for (const f of fs.readdirSync(path.join(ROOT, d)).filter(x => x.endsWith('.html'))) checkFile(path.join(ROOT, d, f));
}
console.log('kırık görsel referansı: ' + broken.length);
broken.slice(0, 10).forEach(b => console.log('  ! ' + b));
process.exit(broken.length ? 1 : 0);
