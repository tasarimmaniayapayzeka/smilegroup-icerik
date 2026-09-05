/* Mevcut DE taslakları için görselleri site-en/images'tan Almanca dosya adıyla kopyalar.
 * EN görsel adı = en-slug-map, DE görsel adı = de-slug-map. cover + detail çifti. */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const EN_IMG = path.join(ROOT, '..', 'site-en', 'images');
const DE_IMG = path.join(ROOT, 'images');

const DE = JSON.parse(fs.readFileSync(path.join(__dirname, 'de-slug-map.json'), 'utf8')).hizmet;
const EN = JSON.parse(fs.readFileSync(path.join(ROOT, '..', 'site-en', '_drafts', 'en-slug-map.json'), 'utf8')).hizmet;

const taslaklar = fs.readdirSync(__dirname)
  .filter(f => f.endsWith('.js') && !f.startsWith('blog-') && !/^(sitewide-check|add-tr-labels|copy-de-images)/.test(f))
  .map(f => f.replace(/\.js$/, ''));

if (!fs.existsSync(DE_IMG)) fs.mkdirSync(DE_IMG, { recursive: true });

let kopyalanan = 0, atlanan = 0, eksik = 0;
for (const slug of taslaklar) {
  const en = EN[slug];
  const de = DE[slug];
  if (!en || !de) { console.log(`!! eslem yok: ${slug}`); eksik++; continue; }
  for (const tur of ['cover-300x400', 'detail-880x500']) {
    const kaynak = path.join(EN_IMG, `${en}-${tur}.jpg`);
    const hedef = path.join(DE_IMG, `${de}-${tur}.jpg`);
    if (!fs.existsSync(kaynak)) { console.log(`!! EN gorsel yok: ${en}-${tur}.jpg`); eksik++; continue; }
    if (fs.existsSync(hedef)) { atlanan++; continue; }
    fs.copyFileSync(kaynak, hedef);
    kopyalanan++;
  }
}
console.log(`kopyalanan: ${kopyalanan} · zaten var: ${atlanan} · sorun: ${eksik}`);
