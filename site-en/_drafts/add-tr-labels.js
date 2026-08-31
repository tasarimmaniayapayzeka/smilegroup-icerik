const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TR_HIZMET = path.join(ROOT, '..', 'site', 'hizmet');
const INDEX = path.join(ROOT, 'index.html');

function trTitleOf(slug) {
  const f = path.join(TR_HIZMET, slug + '.html');
  if (!fs.existsSync(f)) return null;
  const src = fs.readFileSync(f, 'utf8');
  const m = src.match(/<title>([\s\S]*?)<\/title>/);
  if (!m) return null;
  return m[1].replace(/\s*—\s*Smile Group.*$/, '').trim();
}

let idx = fs.readFileSync(INDEX, 'utf8');
const m = idx.match(/const DATA = (\[[\s\S]*?\n\]);/);
if (!m) { console.error('DATA array bulunamadı'); process.exit(1); }

const DATA = new Function('return ' + m[1])();

let missing = [];
for (const branch of DATA) {
  branch.items = branch.items.map(([label, slug]) => {
    const tr = trTitleOf(slug);
    if (!tr) missing.push(slug);
    return [label, slug, tr];
  });
}
console.log('Eksik TR başlık (slug bulunamadı):', missing.length ? missing : 'yok');

// yeniden yazdır — kompakt ama okunaklı
function fmtBranch(b) {
  const items = b.items.map(it => JSON.stringify(it)).join(',');
  return `  { name:${JSON.stringify(b.name)}, kind:${JSON.stringify(b.kind)}, items:[\n    ${items.replace(/,(?=\[)/g, ',\n    ')} ]},`;
}
const newBlock = 'const DATA = [\n' + DATA.map(fmtBranch).join('\n\n') + '\n];';

idx = idx.replace(/const DATA = \[[\s\S]*?\n\];/, newBlock);
fs.writeFileSync(INDEX, idx, 'utf8');
console.log('index.html DATA array TR başlıklarıyla güncellendi.');

// doğrula: hâlâ geçerli JS mi
const check = fs.readFileSync(INDEX, 'utf8');
const m2 = check.match(/const DATA = (\[[\s\S]*?\n\]);/);
const DATA2 = new Function('return ' + m2[1])();
const total = DATA2.reduce((n, b) => n + b.items.length, 0);
const withTr = DATA2.reduce((n, b) => n + b.items.filter(it => it[2]).length, 0);
console.log(`Toplam madde: ${total} · TR başlığı olan: ${withTr}`);
