/* SITE-FR WP YÜK PAKETLERİ ÜRETİCİSİ
 * DE _wp paketlerini yapısal gerçek kaynak alır; FR kayıtlarını üretir.
 * Önce DE-eşlik testleri (govde/sema kurulum kuralının doğruluğu), sonra 8 FR paketi.
 * Canlıya DOKUNMAZ — yalnız site-fr/_wp/*.json yazar. */
const fs = require('fs');
const path = require('path');
const FR = __dirname;
const DE = path.join(FR, '..', 'site-de');
const KOK = 'https://tasarimmaniayapayzeka.github.io/smilegroup-icerik/site-fr/images/';

function draft(dir, f, g) { const sb = { window: {} }; new Function('window', fs.readFileSync(path.join(dir, '_drafts', f), 'utf8'))(sb.window); return sb.window[g]; }
const frHarita = JSON.parse(fs.readFileSync(path.join(FR, '_drafts', 'fr-slug-map.json'), 'utf8'));
const deHarita = JSON.parse(fs.readFileSync(path.join(DE, '_drafts', 'de-slug-map.json'), 'utf8'));
const FRIMG = JSON.parse((fs.readFileSync(path.join(FR, 'index.html'), 'utf8').match(/const FRIMG = (\{[^;]*\});/) || [])[1]);

const KURUMSAL_SLUG = {
  hakkimizda: 'a-propos', iletisim: 'contact', sss: 'faq', kariyer: 'carriere', galeri: 'galerie',
  kvkk: 'protection-des-donnees', 'gizlilik-sozlesmesi': 'politique-de-confidentialite',
  'garanti-politikamiz': 'politique-de-garantie', 'anlasmali-kurumlarimiz': 'institutions-partenaires',
  'cozum-ortaklarimiz': 'partenaires-solutions', odullerimiz: 'distinctions',
  'sosyal-sorumluluklarimiz': 'responsabilite-sociale', anasayfa: 'accueil', blog: 'blog',
  hizmetler: 'traitements', hekimlerimiz: 'nos-dentistes', 'hasta-hikayeleri': 'histoires-patients',
};
const HASTA_SLUG = { 'elif-lamine': 'facettes-avant-apres', 'murat-implant': 'implant-dentaire-avant-apres', 'zeynep-zirkonyum': 'couronnes-zircone-avant-apres', 'emre-beyazlatma': 'blanchiment-avant-apres' };
const HASTA_IMG = { 'elif-lamine': 'histoire-elif-facettes.jpg', 'murat-implant': 'histoire-murat-implant.jpg', 'zeynep-zirkonyum': 'histoire-zeynep-zircone.jpg', 'emre-beyazlatma': 'histoire-emre-blanchiment.jpg' };
const HASTA_YOLCULUK = { 'elif-lamine': 'lamine-yolculugu', 'murat-implant': 'implant-yolculugu', 'zeynep-zirkonyum': 'zirkonyum-yolculugu', 'emre-beyazlatma': 'beyazlatma-yolculugu' };

function linkFR(html) {
  return html.replace(/\/fr\/hizmet\/([a-z0-9-]+)\//g, (m, tr) => '/fr/traitement/' + (frHarita.hizmet[tr] || tr) + '/');
}
function linkDE(html) {
  return html.replace(/\/de\/hizmet\/([a-z0-9-]+)\//g, (m, tr) => '/de/behandlung/' + (deHarita.hizmet[tr] || tr) + '/');
}
function metinYap(html) { return html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim(); }
function hizmetGovde(art, baslikAlt, linkFn) {
  let h = '<div class="gorbit-service-faq">\n<p class="gorbit-service-faq__lead">' + art.lead + '</p>\n';
  h += '<figure class="gorbit-service-detail__inline-media gorbit-service-faq__media"><img src="{{DETAY_URL}}" alt="' + baslikAlt + '" loading="lazy" width="880" height="500"></figure>\n';
  for (const f of art.faqs) h += '<details class="gorbit-service-faq__item">\n<summary class="gorbit-service-faq__question">' + f.q + '</summary>\n<div class="gorbit-service-faq__answer">' + f.a + '</div>\n</details>\n';
  h += '<div class="gorbit-service-faq__closing">' + art.closing + '</div>\n</div>';
  return linkFn(h);
}
function hizmetSema(art, linkFn) {
  return JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: art.faqs.map(f => ({ '@type': 'Question', name: metinYap(f.q), acceptedAnswer: { '@type': 'Answer', text: metinYap(linkFn(f.a)) } })) });
}
function blogGovde(b, sssBaslik, linkFn) {
  let h = '<div class="gorbit-blog-imported">\n<p class="gorbit-blog-imported__lead">' + b.lead + '</p>\n';
  for (const s of b.sections) h += '<section class="gorbit-blog-imported__section">\n<h2>' + s.h2 + '</h2>\n' + s.html + '\n</section>\n';
  h += '<section class="gorbit-blog-imported__faqs">\n<h2>' + sssBaslik + '</h2>\n';
  for (const f of b.faqs) h += '<details class="gorbit-blog-imported__faq-item">\n<summary>' + f.q + '</summary>\n<div class="gorbit-blog-imported__faq-a">' + f.a + '</div>\n</details>\n';
  h += '</section>\n<p class="gorbit-blog-imported__closing">' + b.closing + '</p>\n</div>';
  return linkFn(h);
}
function slugifyFR(t) {
  return t.toLowerCase()
    .replace(/[àâä]/g, 'a').replace(/[éèêë]/g, 'e').replace(/[îï]/g, 'i').replace(/[ôö]/g, 'o')
    .replace(/[ùûü]/g, 'u').replace(/ç/g, 'c').replace(/œ/g, 'oe').replace(/['’]/g, '-')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function textareaAl(dosya, kacinci = 0) {
  const s = fs.readFileSync(dosya, 'utf8');
  const m = [...s.matchAll(/<textarea[^>]*>([\s\S]*?)<\/textarea>/g)];
  return m[kacinci] ? m[kacinci][1] : null;
}

/* ================= DE EŞLİK TESTLERİ ================= */
const deHizmetK = require(path.join(DE, '_wp', 'hizmet-yuk.json')).ogeler;
const dolguDE = deHizmetK.find(x => x.tr_slug === 'dolgu');
const aD = draft(DE, 'dolgu.js', 'ARTICLE_DE');
console.log('EŞLİK hizmet-govde:', hizmetGovde(aD, dolguDE.baslik, linkDE) === dolguDE.govde_sablon ? '✓' : '✗✗✗');
console.log('EŞLİK hizmet-sema :', hizmetSema(aD, linkDE) === dolguDE.sema ? '✓' : '✗✗✗');
const deBlogK = require(path.join(DE, '_wp', 'blog-yuk.json')).ogeler;
const b60DE = deBlogK.find(x => x.tr_slug === '60-yas-ustu-dis-sagligi');
const bD = draft(DE, 'blog-60-yas-ustu-dis-sagligi.js', 'BLOG_DE');
console.log('EŞLİK blog-govde  :', blogGovde(bD, 'Häufig gestellte Fragen', linkDE) === b60DE.govde_sablon ? '✓' : '✗✗✗');
// kurumsal: DE kvkk kaydı == DE textarea?
const deKurK = require(path.join(DE, '_wp', 'kurumsal-yuk.json')).ogeler;
const kvkkDE = deKurK.find(x => x.tr_slug === 'kvkk');
const kvkkTA = textareaAl(path.join(DE, 'kurumsal', 'kvkk.html'));
console.log('EŞLİK kurumsal    :', kvkkDE.govde_sablon.trim() === kvkkTA.trim() ? '✓' : '✗ (kural farklı — FR tarafında DE kuralına bak)');
// hekim: DE kaydı == DE doktor textarea?
const deHekimK = require(path.join(DE, '_wp', 'hekim-yuk.json')).ogeler;
const ardaDE = deHekimK.find(x => x.tr_slug === 'dr-arda-oztan');
const ardaTA = textareaAl(path.join(DE, 'doktor', 'dr-arda-oztan.html'));
console.log('EŞLİK hekim       :', ardaDE.govde_sablon.trim() === (ardaTA || '').trim() ? '✓' : '✗ (uzunluk kayit=' + ardaDE.govde_sablon.length + ' ta=' + (ardaTA || '').length + ')');
// sss: DE slug kuralı
const deSssK = require(path.join(DE, '_wp', 'sss-yuk.json')).ogeler;
console.log('EŞLİK sss-slug    :', deSssK.every(o => o.slug === slugifyFR(o.baslik).replace(/ae/g, 'ae')) ? '✓' : '~ (DE umlaut kuralı farklı olabilir — FR kendi kuralını kullanır)');

/* ================= FR PAKETLERİ ================= */
const SURUM = '1.0.0-fr';
function yaz(ad, grup, ogeler) {
  const j = { surum: SURUM, grup, uretim: 'uret-wp-fr.js', ogeler };
  fs.writeFileSync(path.join(FR, '_wp', ad), JSON.stringify(j, null, 1));
  console.log('YAZILDI ' + ad + ' · öğe: ' + ogeler.length);
}
if (!fs.existsSync(path.join(FR, '_wp'))) fs.mkdirSync(path.join(FR, '_wp'));
const frBasliklar = JSON.parse(fs.readFileSync(path.join(FR, '_drafts', 'fr-basliklar.json'), 'utf8'));

/* 1) hizmet-yuk (DE sırası ve kapsamıyla — 58) */
const hizmetOgeler = [];
for (const d of deHizmetK) {
  const tr = d.tr_slug;
  const art = draft(FR, tr + '.js', 'ARTICLE_FR');
  const img = FRIMG[tr];
  if (!img) { console.log('UYARI: FRIMG yok → ' + tr); }
  const baslik = (frBasliklar[tr] && frBasliklar[tr][1]) || art.title;
  hizmetOgeler.push({
    tip: d.tip, tr_slug: tr, slug: frHarita.hizmet[tr], baslik,
    metadesc: art.metaDescription, kategori_fr: art.category,
    govde_sablon: hizmetGovde(art, baslik, linkFR), sema: hizmetSema(art, linkFR),
    kapak_kaynak: KOK + img + '-cover-300x400.jpg ', detay_kaynak: KOK + img + '-detail-880x500.jpg ',
    og_kaynak: KOK + img + '-detail-1200x682.jpg ', icerik_slug: tr, sss_sayisi: art.faqs.length,
  });
}
yaz('hizmet-yuk.json', 'hizmet', hizmetOgeler);

/* 2) blog-yuk */
const frBlogSlug = frHarita.blog;
const blogOgeler = [];
for (const d of deBlogK) {
  const tr = d.tr_slug;
  const b = draft(FR, 'blog-' + tr + '.js', 'BLOG_FR');
  const img = frBlogSlug[tr];
  blogOgeler.push({
    tip: d.tip, tr_slug: tr, slug: frBlogSlug[tr], baslik: b.title, metadesc: b.metaDescription,
    govde_sablon: blogGovde(b, 'Foire aux questions', linkFR),
    kapak_kaynak: KOK + img + '-cover-300x400.jpg ', og_kaynak: KOK + img + '-detail-1200x682.jpg ',
    icerik_slug: tr, sss_sayisi: b.faqs.length, bolum_sayisi: b.sections.length,
  });
}
yaz('blog-yuk.json', 'blog', blogOgeler);

/* 3) kurumsal-yuk (10 düz sayfa — FR textarea gövdeleriyle) */
const kurOgeler = [];
for (const d of deKurK) {
  const tr = d.tr_slug;
  const dosya = path.join(FR, 'kurumsal', tr + '.html');
  const s = fs.readFileSync(dosya, 'utf8');
  const govde = textareaAl(dosya);
  const baslik = (s.match(/<h1>([^<]+)<\/h1>/) || [])[1];
  const metadesc = (s.match(/<meta name="description" content="([^"]+)"/) || [])[1];
  kurOgeler.push({ tip: d.tip, tr_slug: tr, slug: KURUMSAL_SLUG[tr], baslik, metadesc, govde_sablon: govde, icerik_slug: tr });
}
yaz('kurumsal-yuk.json', 'kurumsal-duz', kurOgeler);

/* 4) hekim-yuk — FR doktor textarea + metalar çevirisi */
const ROL_FR = {
  'Facharzt für Mund-, Kiefer- und Gesichtschirurgie': 'Chirurgien oral et maxillo-facial',
  'Fachzahnärztin für Kieferorthopädie': 'Orthodontiste',
  'Zahnarzt für ästhetische Zahnmedizin': 'Chirurgien-dentiste esthétique',
  'Zahnarzt': 'Chirurgien-dentiste', 'Zahnärztin': 'Chirurgienne-dentiste',
};
const DENEYIM_FR = (t) => t.replace(/(\d+) Jahre klinische Erfahrung/, "$1 ans d'expérience clinique");
const UZM_FR = {
  'Implantate': 'Implants', 'All-on-4': 'All-on-4', 'Sinuslift': 'Sinus lift', 'Digitale OP-Planung': 'Planification chirurgicale numérique',
  'Digitale Zahnmedizin': 'Dentisterie numérique', 'Ästhetische Zahnmedizin': 'Dentisterie esthétique', 'Restaurative Behandlungen': 'Traitements restaurateurs',
  'Kieferorthopädie': 'Orthodontie', 'Aligner-Behandlungen': 'Traitements par aligneurs', 'Kiefer- und Bissfehlstellungen': 'Troubles des mâchoires et de l’occlusion',
  'Zahnspangen-Behandlungen': 'Traitements par bagues', 'Zirkonkronen': 'Couronnes en zircone', 'Keramik-Veneers': 'Facettes en céramique', 'Ästhetische Füllungen': 'Plombages esthétiques',
  'Aligner-Therapie': 'Traitements par aligneurs', 'Kiefer- und Bissprobleme': 'Troubles des mâchoires et de l’occlusion', 'Zahnspangen': 'Bagues dentaires', 'Zirkon': 'Zircone', 'ästhetische Füllungen': 'Plombages esthétiques',
};
const EDU_FR = { 'Erciyes-Universität': 'Université Erciyes' };
const hekimOgeler = [];
for (const d of deHekimK) {
  const dosya = path.join(FR, 'doktor', d.tr_slug + '.html');
  const s = fs.readFileSync(dosya, 'utf8');
  const baslik = (s.match(/<h1>([^<]+)<\/h1>/) || [])[1] || d.baslik.replace(/^Dr\./, 'Dr');
  const metadesc = (s.match(/<meta name="description" content="([^"]+)"/) || [])[1];
  // DE kaydı kısa biyografi: h2 "À propos" + İLK paragraf + gezinme satırı
  const bio = s.match(/<h2>(À propos du Dr[^<]*)<\/h2>[\s\S]*?<p>([\s\S]*?)<\/p>/);
  if (!bio) throw new Error('bio yok: ' + d.tr_slug);
  const ilkP = bio[2].replace(/\s+/g, ' ').trim();
  const govde = '<h2>' + bio[1] + '</h2>\n<p>' + ilkP + '</p>\n<p><a href="#about">Voir la biographie</a> · <a href="#booking">Prendre rendez-vous</a></p>';
  const metalar = JSON.parse(JSON.stringify(d.metalar || {}));
  if (metalar._gorbit_doctor_role) metalar._gorbit_doctor_role = ROL_FR[metalar._gorbit_doctor_role] || metalar._gorbit_doctor_role;
  if (metalar._gorbit_doctor_experience) metalar._gorbit_doctor_experience = DENEYIM_FR(metalar._gorbit_doctor_experience);
  if (metalar._gorbit_doctor_specialties) metalar._gorbit_doctor_specialties = metalar._gorbit_doctor_specialties.split(/,\s*\n?/).map(x => UZM_FR[x.trim()] || x.trim()).join(',\n');
  if (metalar._gorbit_doctor_education) metalar._gorbit_doctor_education = EDU_FR[metalar._gorbit_doctor_education] || metalar._gorbit_doctor_education;
  const kapakDosya = (d.kapak_kaynak || '').trim().split('/').pop();
  const kapak = KOK + 'doctors/' + kapakDosya + ' ';
  hekimOgeler.push({ tip: d.tip, tr_slug: d.tr_slug, slug: d.slug, baslik, metadesc, govde_sablon: govde, kapak_kaynak: kapak, icerik_slug: d.icerik_slug, metalar });
}
yaz('hekim-yuk.json', 'hekim', hekimOgeler);

/* 5) hasta-yuk — FR yolculuk hikayelerinden (DE kuralı: yolculuk içerik + not) */
const deHastaK = require(path.join(DE, '_wp', 'hasta-yuk.json')).ogeler;
const yolS = fs.readFileSync(path.join(FR, 'yolculuk', 'index.html'), 'utf8');
const NOT_FR = '<p class="yolculuk-not"><em>Ce récit est illustratif ; il ne décrit aucun patient précis. Le déroulé et le résultat du traitement varient d\'une personne à l\'autre ; la décision se prend après un examen clinique.</em></p>';
function yolculukGovde(id) {
  const m = yolS.match(new RegExp('<article class="story" id="' + id + '">([\\s\\S]*?)</article>'));
  if (!m) throw new Error('yolculuk yok: ' + id);
  const ic = m[1];
  const h2 = (ic.match(/<h2>([^<]+)<\/h2>/) || [])[1];
  const ps = [...ic.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(x => x[1].replace(/\s+/g, ' ').replace(/<[^>]+>/g, '').trim());
  const rel = (ic.match(/<div class="rel">([\s\S]*?)<\/div>/) || [])[1] || '';
  const relLinks = [...rel.matchAll(/href="\.\.\/hizmet\/([a-z0-9-]+)\.html">([^<]+)</g)]
    .map(x => '<a href="/fr/traitement/' + frHarita.hizmet[x[1]] + '/">' + x[2] + '</a>').join(' · ');
  let h = '<div class="gorbit-patient-imported">\n';
  for (const p of ps) h += '<p>' + p + '</p>\n';
  h += '<p>' + relLinks + '</p>\n' + NOT_FR + '\n</div>';
  return { h2, govde: h };
}
const hastaOgeler = [];
for (const d of deHastaK) {
  const tr = d.tr_slug;
  const yolId = HASTA_YOLCULUK[tr];
  const { govde } = yolculukGovde(yolId);
  // FR başlık: kurumsal hasta-hikayeleri sayfasındaki h2'ler
  const hh = fs.readFileSync(path.join(FR, 'kurumsal', 'hasta-hikayeleri.html'), 'utf8');
  const kartlar = [...hh.matchAll(/id="blocks"|<h2>(L’histoire[^<]+)<\/h2>/g)];
  const adEs = { 'elif-lamine': "L'histoire de transformation d'Elif", 'murat-implant': "L'histoire de transformation de Murat", 'zeynep-zirkonyum': "L'histoire de transformation de Zeynep", 'emre-beyazlatma': "L'histoire de transformation d'Emre" };
  const metalar = JSON.parse(JSON.stringify(d.metalar || {}));
  if (metalar._gorbit_patient_source_url) metalar._gorbit_patient_source_url = metalar._gorbit_patient_source_url.replace('/site-de/', '/site-fr/');
  const metadescDE = d.metadesc || '';
  const METADESC_FR = {
    'elif-lamine': 'Un parcours facettes et smile design représentatif : évaluation, mock-up, résultat naturel — le déroulé typique chez Smile Group.',
    'murat-implant': "Un parcours d'implant unitaire représentatif : planification 3D, pose, cicatrisation et couronne — le déroulé typique chez Smile Group.",
    'zeynep-zirkonyum': 'Un parcours zircone représentatif : choix de teinte à la lumière du jour, essayage et pose — le déroulé typique chez Smile Group.',
    'emre-beyazlatma': 'Un parcours de blanchiment représentatif : détartrage, séance unique contrôlée et suivi — le déroulé typique chez Smile Group.',
  };
  const PARCOURS = { 'elif-lamine': 'parcours-facettes', 'murat-implant': 'parcours-implant', 'zeynep-zirkonyum': 'parcours-zircone', 'emre-beyazlatma': 'parcours-blanchiment' };
  hastaOgeler.push({
    tip: d.tip, tr_slug: tr, slug: HASTA_SLUG[tr], baslik: adEs[tr].replace(/'/g, '’'),
    metadesc: METADESC_FR[tr], govde_sablon: govde,
    kapak_kaynak: KOK + PARCOURS[tr] + '.jpg ', og_kaynak: KOK + PARCOURS[tr] + '-1200x630.jpg ',
    icerik_slug: tr, metalar,
  });
}
yaz('hasta-yuk.json', 'hasta', hastaOgeler);

/* 6) liste-yuk */
const deListeK = require(path.join(DE, '_wp', 'liste-yuk.json')).ogeler;
const LISTE_FR = {
  hizmetler: { baslik: 'Nos traitements', metadesc: 'Le catalogue de traitements de Smile Group : smile design numérique, traitements esthétiques et implantologie — étendue, déroulé, risques et suivi.', focuskw: 'soins dentaires istanbul' },
  hekimlerimiz: { baslik: 'Nos dentistes', metadesc: "Rencontrez l'équipe soignante de Smile Group, certifiée à l'international et centrée sur le patient — esthétique, orthodontie, chirurgie et plus.", focuskw: 'dentiste istanbul' },
  'hasta-hikayeleri': { baslik: 'Histoires de patients', metadesc: 'Parcours de traitement représentatifs chez Smile Group — facettes, implant, zircone et blanchiment — et le déroulé typique de chaque parcours.', focuskw: 'soins dentaires avant après' },
  sss: { baslik: 'Foire aux questions', metadesc: 'Réponses aux questions les plus fréquentes des patients de Smile Group — planification du traitement, voyage, garanties, confort et soins plus vacances.', focuskw: 'questions soins dentaires' },
};
const listeOgeler = deListeK.map(d => {
  const f = LISTE_FR[d.tr_slug];
  const metalar = JSON.parse(JSON.stringify(d.metalar || {}));
  if (metalar._yoast_wpseo_focuskw) metalar._yoast_wpseo_focuskw = f.focuskw;
  const LISTE_OG = { hizmetler: 'traitements-og.jpg', hekimlerimiz: 'nos-dentistes-og.jpg', 'hasta-hikayeleri': 'histoires-patients-og.jpg', sss: 'faq-og.jpg' };
  return { tip: d.tip, tr_slug: d.tr_slug, slug: KURUMSAL_SLUG[d.tr_slug], baslik: f.baslik, metadesc: f.metadesc, govde_sablon: d.govde_sablon || '', og_kaynak: KOK + LISTE_OG[d.tr_slug], icerik_slug: d.icerik_slug, metalar };
});
yaz('liste-yuk.json', 'liste', listeOgeler);

/* 7) sss-yuk — FR kurumsal/sss sayfasından 7 soru */
const sssS = fs.readFileSync(path.join(FR, 'kurumsal', 'sss.html'), 'utf8');
const sssParca = [...sssS.matchAll(/<h2><span class="faq-num">\d+<\/span>([^<]+)<\/h2>[\s\S]*?<p>([\s\S]*?)<\/p>/g)];
const sssOgeler = deSssK.map((d, i) => {
  const q = sssParca[i][1].trim();
  const a = sssParca[i][2].replace(/\s+/g, ' ').trim();
  return { tip: d.tip, tr_slug: d.tr_slug, slug: slugifyFR(q), baslik: q, govde_sablon: '<p>' + a + '</p>', icerik_slug: d.icerik_slug, metalar: d.metalar };
});
yaz('sss-yuk.json', 'sss', sssOgeler);

/* 8) cekirdek-yuk — Avia verisi TR kalır (çeviri tabanlar sözlüğünde); slug+metadesc FR */
const deCekK = require(path.join(DE, '_wp', 'cekirdek-yuk.json')).ogeler;
const CEK_META_FR = {
  iletisim: 'Contacter Smile Group à Şişli, Istanbul : formulaire de contact, téléphone, e-mail, horaires, carte et itinéraire vers la clinique.',
  anasayfa: 'Smile Group, Şişli, Istanbul : smile design numérique, implants et dentisterie esthétique — planification personnalisée, production robotique CAD/CAM et suivi.',
  blog: "Blog et guides de Smile Group : articles spécialisés sur l'implantologie, la dentisterie esthétique et les parcours de soins numériques.",
};
const FOCUS_FR = { 'zahngesundheit blog': 'blog santé dentaire', 'zahnklinik istanbul kontakt': 'clinique dentaire istanbul contact', 'zahnklinik istanbul': 'clinique dentaire istanbul' };
const CEK_OG = { iletisim: 'contact-og.jpg', anasayfa: 'accueil-og.jpg', blog: 'blog-og.jpg' };
const cekOgeler = deCekK.map(d => {
  const metalar = JSON.parse(JSON.stringify(d.metalar || {}));
  for (const k of Object.keys(metalar)) {
    if (typeof metalar[k] === 'string' && FOCUS_FR[metalar[k]]) metalar[k] = FOCUS_FR[metalar[k]];
  }
  return { tip: d.tip, tr_slug: d.tr_slug, slug: KURUMSAL_SLUG[d.tr_slug], baslik: { iletisim: 'Contact', anasayfa: 'Accueil', blog: 'Blog & guides' }[d.tr_slug], metadesc: CEK_META_FR[d.tr_slug], govde_sablon: d.govde_sablon, og_kaynak: d.og_kaynak ? KOK + CEK_OG[d.tr_slug] : d.og_kaynak, icerik_slug: d.icerik_slug, metalar };
});
yaz('cekirdek-yuk.json', 'cekirdek', cekOgeler);

/* ================= SAĞLAMA ================= */
let toplam = 0;
for (const f of fs.readdirSync(path.join(FR, '_wp')).filter(x => x.endsWith('.json'))) {
  const j = require(path.join(FR, '_wp', f));
  toplam += j.ogeler.length;
  // Almanca kalıntı taraması (Fransızca 'termin*' kökleri hariç)
  const metin = JSON.stringify(j.ogeler);
  const de = metin.match(/(?:Zahn|Behandl|ästhet|Kiefer|Füllung|zahnarzt|Woche|Lächeln|Verwandl|Übersicht|für |über )[a-zäöüßA-ZÄÖÜ-]*/g);
  const kotu = (de || []).filter(x => !/Behandlung\b/.test(x));
  if (kotu.length) console.log('DE KALINTI? ' + f + ': ' + [...new Set(kotu)].slice(0, 6).join(', '));
  if (metin.includes('/site-de/')) console.log('site-de URL KALDI → ' + f);
  if (metin.includes('/de/')) console.log('/de/ LINK KALDI → ' + f);
  if (/\/fr\/hizmet\//.test(metin)) console.log('/fr/hizmet KALDI (traitement olmalıydı) → ' + f);
}
console.log('TOPLAM FR öğe: ' + toplam + ' (DE: 101)');
