const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

function insertAfter(src, anchor, insert, label) {
  if (!src.includes(anchor)) { console.error('ANCHOR YOK:', label); process.exit(1); }
  if (src.includes(insert)) { console.log('  (zaten var:', label + ')'); return src; }
  return src.replace(anchor, anchor + insert);
}

const y1f = path.join(ROOT, 'yolculuk', 'index.html');
let y1 = fs.readFileSync(y1f, 'utf8');
const map = [
  ['<h2>A Comfortable Smile Again: The Implant Journey</h2>', 'Yeniden Rahat Bir Gülüş: İmplant Yolculuğu'],
  ['<h2>Without Compromising on a Natural Look: The Zirconia Journey</h2>', 'Doğallıktan Ödün Vermeden: Zirkonyum Yolculuğu'],
  ['<h2>Small Touch, Big Difference: The Veneers Journey</h2>', 'Küçük Dokunuş, Büyük Fark: Lamine Yolculuğu'],
  ['<h2>A Fresher Smile in a Single Session: The Whitening Journey</h2>', 'Tek Seansta Tazelenme: Beyazlatma Yolculuğu'],
];
for (const [anchor, tr] of map) {
  y1 = insertAfter(y1, anchor, '\n    <div class="tr-orig">TR: <em>' + tr + '</em></div>', tr.slice(0, 15));
}
fs.writeFileSync(y1f, y1, 'utf8');
console.log('yolculuk hikaye etiketleri OK');
