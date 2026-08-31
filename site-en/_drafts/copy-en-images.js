/* EN adlı görsel kopyaları üretir: site/... → site-en/images/...
 * Kaynak PNG'ler (kaynak/, yuksek/ HARİÇ yuksek kopyalanır çünkü küçük) — yolculuk/yolculuk2 kaynak PNG'leri KOPYALANMAZ. */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, '..', 'site');
const IMG = path.join(ROOT, 'images');
const map = JSON.parse(fs.readFileSync(path.join(__dirname, 'en-slug-map.json'), 'utf8'));

if (!fs.existsSync(IMG)) fs.mkdirSync(IMG, { recursive: true });
fs.mkdirSync(path.join(IMG, 'doctors'), { recursive: true });
fs.mkdirSync(path.join(IMG, 'doctors', 'high-res'), { recursive: true });

let copied = 0, missing = [];
function cp(src, dst) {
  if (!fs.existsSync(src)) { missing.push(src); return; }
  fs.copyFileSync(src, dst);
  copied++;
}

// 1) hizmet + blog görselleri (site/gorseller düz klasör)
for (const grp of ['hizmet', 'blog']) {
  for (const [tr, en] of Object.entries(map[grp])) {
    cp(path.join(SITE, 'gorseller', tr + '-kapak-300x400.jpg'), path.join(IMG, en + '-cover-300x400.jpg'));
    cp(path.join(SITE, 'gorseller', tr + '-detay-880x500.jpg'), path.join(IMG, en + '-detail-880x500.jpg'));
  }
}

// 2) yolculuk (4 web JPG)
for (const [tr, en] of Object.entries(map.yolculuk)) {
  cp(path.join(SITE, 'yolculuk', 'img', tr + '.jpg'), path.join(IMG, en + '.jpg'));
}

// 3) yolculuk2 (4 web JPG)
for (const [tr, en] of Object.entries(map.yolculuk2)) {
  cp(path.join(SITE, 'yolculuk2', 'img', tr + '.jpg'), path.join(IMG, en + '.jpg'));
}

// 4) hekimler: orta (16) + yüksek (16); durus → pose
for (const [tr, en] of Object.entries(map.hekimler)) {
  for (const n of [1, 2]) {
    cp(path.join(SITE, 'hekimler', 'img', tr + '-durus' + n + '.jpg'), path.join(IMG, 'doctors', en + '-pose-' + n + '.jpg'));
    cp(path.join(SITE, 'hekimler', 'img', 'yuksek', tr + '-durus' + n + '.jpg'), path.join(IMG, 'doctors', 'high-res', en + '-pose-' + n + '.jpg'));
  }
}

console.log('kopyalanan:', copied);
console.log('bulunamayan:', missing.length);
missing.forEach(m => console.log('  ! ' + m));
const total = fs.readdirSync(IMG).filter(f => f.endsWith('.jpg')).length
  + fs.readdirSync(path.join(IMG, 'doctors')).filter(f => f.endsWith('.jpg')).length
  + fs.readdirSync(path.join(IMG, 'doctors', 'high-res')).filter(f => f.endsWith('.jpg')).length;
console.log('images/ toplam jpg:', total);
