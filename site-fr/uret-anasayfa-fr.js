/* EN kurumsal/anasayfa.html -> FR kurumsal/anasayfa.html
 * Kaynaklar: site-en/index.html DATA (EN başlık), site-fr/index.html DATA (FR başlık),
 * site-fr/_drafts/<slug>.js (ARTICLE_FR.lead = kart özeti), blog taslakları (başlık+metaDescription).
 * DE üreticisinin (uret-anasayfa-de.js) birebir FR uyarlaması. Ek: canlı FR URL tabanları
 * (/fr/hizmet/->/fr/traitement/, /fr/doktor/->/fr/dentiste/, hasta+blog+kurumsal slug haritaları). */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const EN = path.join(ROOT, '..', 'site-en');

function dataTriples(file) {
  const src = fs.readFileSync(file, 'utf8');
  const m = src.match(/const DATA = \[([\s\S]*?)\n\];/);
  if (!m) throw new Error('DATA yok: ' + file);
  const triples = [];
  for (const mm of m[1].matchAll(/\["((?:[^"\\]|\\.)*)","((?:[^"\\]|\\.)*)","((?:[^"\\]|\\.)*)"\]/g)) {
    triples.push([mm[1].replace(/\\"/g, '"'), mm[2], mm[3]]);
  }
  return triples;
}
const frTitles = {}, enTitles = {};
for (const [t, s] of dataTriples(path.join(ROOT, 'index.html'))) if (!(s in frTitles)) frTitles[s] = t;
for (const [t, s] of dataTriples(path.join(EN, 'index.html'))) if (!(s in enTitles)) enTitles[s] = t;

function draftField(dir, file, globalVar, field) {
  const src = fs.readFileSync(path.join(dir, '_drafts', file), 'utf8');
  const sandbox = { window: {} };
  new Function('window', src)(sandbox.window);
  return sandbox.window[globalVar][field];
}
const escTxt = (s) => s.replace(/&/g, '&amp;');

let s = fs.readFileSync(path.join(EN, 'kurumsal', 'anasayfa.html'), 'utf8');
const sorunlar = [];
function rep(a, b, zorunlu = true) {
  if (!s.includes(a)) { if (zorunlu) sorunlar.push('BULUNAMADI: ' + a.slice(0, 70)); return; }
  s = s.split(a).join(b);
}

/* ---- 1) tedavi kartları: görünen blok ---- */
const slugs = [...s.matchAll(/id="svc-([a-z0-9-]+)"/g)].map(m => m[1]);
console.log('svc kart: ' + slugs.length);
for (const slug of slugs) {
  const lead = draftField(ROOT, slug + '.js', 'ARTICLE_FR', 'lead');
  const blok = new RegExp(
    '(<div class="svc-card" id="svc-' + slug + '">[\\s\\S]*?<span class="svc-cat">)([^<]*)(</span>\\s*<p>)([\\s\\S]*?)(</p>\\s*<p class="svc-more">)'
  );
  const m = s.match(blok);
  if (!m) { sorunlar.push('svc blok yok: ' + slug); continue; }
  s = s.replace(blok, (_, a, kat, b, exc, c) => a + kat + b + lead + c);
}

/* ---- 2) tedavi kartları: textarea (h3 başlık + em kategori + özet) ---- */
for (const slug of slugs) {
  const lead = draftField(ROOT, slug + '.js', 'ARTICLE_FR', 'lead');
  const rx = new RegExp(
    '(&lt;h3&gt;&lt;a href="/en/hizmet/' + slug + '/"&gt;)([\\s\\S]*?)(&lt;/a&gt;&lt;/h3&gt;\\s*&lt;p&gt;&lt;em&gt;)([\\s\\S]*?)(&lt;/em&gt; — )([\\s\\S]*?)(&lt;/p&gt;)'
  );
  const m = s.match(rx);
  if (!m) { sorunlar.push('textarea blok yok: ' + slug); continue; }
  s = s.replace(rx, (_, a, ti, b, kat, c, exc, d) => a + escTxt(frTitles[slug] || ti) + b + kat + c + escTxt(lead) + d);
}

/* ---- 3) başlıklar (görünen alt/h3 metinleri) — uzundan kısaya ---- */
const titlePairs = slugs
  .filter(sl => enTitles[sl] && frTitles[sl] && enTitles[sl] !== frTitles[sl])
  .sort((a, b) => enTitles[b].length - enTitles[a].length);
for (const sl of titlePairs) {
  const en = enTitles[sl], fr = frTitles[sl];
  rep(en, fr, false);
  rep(en.replace(/&/g, '&amp;'), fr.replace(/&/g, '&amp;'), false);
}

/* ---- 4) kategoriler (svc-cat, filtre sekmeleri, textarea em) ---- */
const kat = [
  ['Digital Smile Design', 'Smile Design Numérique'],
  ['Implant Treatments', 'Traitements Implantaires'],
  ['Change My Smile', 'Changer Mon Sourire'],
  ['Sleep &amp;amp; Jaw Health', 'Sommeil &amp;amp; Santé de la Mâchoire'],
  ['Sleep &amp; Jaw Health', 'Sommeil &amp; Santé de la Mâchoire'],
  ['Cosmetic Treatments', 'Traitements Esthétiques'],
  ['General Treatments', 'Traitements Généraux'],
  ['Orthodontics', 'Orthodontie'],
  ["Children's Dentistry", 'Dentisterie Pédiatrique'],
  ['Comparison', 'Comparatif'],
];
for (const [a, b] of kat) rep(a, b, false);

/* ---- 5) blog kartları: başlık + özet ---- */
const blogSlugs = ['stres-ve-dis-sagligi','seffaf-plak-mi-dis-teli-mi','implant-mi-kopru-mu','implant-iyilesme-sureci','hamilelikte-dis-sagligi','dis-kaplama-omru'];
for (const bs of blogSlugs) {
  const enT = draftField(EN, 'blog-' + bs + '.js', 'BLOG_EN', 'title');
  const frT = draftField(ROOT, 'blog-' + bs + '.js', 'BLOG_FR', 'title');
  const enD = draftField(EN, 'blog-' + bs + '.js', 'BLOG_EN', 'metaDescription');
  const frD = draftField(ROOT, 'blog-' + bs + '.js', 'BLOG_FR', 'metaDescription');
  rep(enT, frT, false);
  rep(enD, frD, false);
}
rep('5 August 2026 · 8 min read', '5 août 2026 · 8 min de lecture', false);
rep('5 August 2026 · 9 min read', '5 août 2026 · 9 min de lecture', false);

/* ---- 6) sabit metin sözlüğü ---- */
const D = [
// baş
['<html lang="en">','<html lang="fr">'],
['<title>Home — Smile Group</title>','<title>Accueil — Smile Group</title>'],
['<meta name="description" content="Smile Group, Şişli, Istanbul: digital smile design, implants and cosmetic dentistry with personalised planning, robotic CAD/CAM production and aftercare.">','<meta name="description" content="Smile Group, Şişli, Istanbul : smile design numérique, implants et dentisterie esthétique — planification personnalisée, production robotique CAD/CAM et suivi.">'],
['<span class="sub">Aesthetic &amp; Dental Clinic</span>','<span class="sub">Clinique dentaire &amp; esthétique</span>'],
['Corporate page · <b>EN edition</b>','Page institutionnelle · <b>Édition FR</b>'],
['<div class="crumb">Home  ›  <span>Home</span></div>','<div class="crumb">Accueil  ›  <span>Accueil</span></div>'],
['<h1>Home</h1>','<h1>Accueil</h1>'],
['TR original:','Original TR :'],
// lead + about tekrar eden paragraf
["At Smile Group, we bring together cosmetic dentistry, implant treatments and digital dentistry with an approach built around planning for the individual. We listen to each patient's needs, assess the treatment process together, and plan every step with clear, open communication.","Chez Smile Group, nous réunissons dentisterie esthétique, traitements implantaires et dentisterie numérique dans une approche bâtie autour de la planification pour chaque personne. Nous écoutons les besoins de chaque patiente et patient, évaluons ensemble le parcours de traitement et planifions chaque étape avec une communication claire et ouverte."],
// hero
['<h2>Homepage Hero Slider</h2>','<h2>Slider héro de la page d’accueil</h2>'],
['The hero is an image-only slider of four banners (mobile variants swap in below 992px); it carries no written content. Slide navigation labels: “Slide 1…Slide 4”.','Le héro est un slider d’images de quatre bannières (les variantes mobiles prennent le relais sous 992px) ; il ne porte aucun contenu écrit. Libellés de navigation : « Slide 1…Slide 4 ».'],
['Mobile variant of banner 1','Variante mobile de la bannière 1'],
['Mobile variant of banner 2','Variante mobile de la bannière 2'],
['Mobile variant of banner 3','Variante mobile de la bannière 3'],
['Mobile variant of banner 4','Variante mobile de la bannière 4'],
// journey widget
['<span class="kur-badge">Digital Pre-Assessment Form</span>','<span class="kur-badge">Formulaire de pré-évaluation numérique</span>'],
['<h2>Start Your Treatment Journey</h2>','<h2>Commencez votre voyage de traitement</h2>'],
['&lt;h2&gt;Start Your Treatment Journey&lt;/h2&gt;','&lt;h2&gt;Commencez votre voyage de traitement&lt;/h2&gt;'],
['<b>Form fields (the live form is produced by WordPress):</b>','<b>Champs du formulaire (le formulaire réel est généré par WordPress) :</b>'],
['X-ray / photograph upload — “Choose a file” (max. 15MB) · Full name · Email address ·','Téléversement radio/photo — « Choisir un fichier » (max. 15 Mo) · Nom et prénom · Adresse e-mail ·'],
["Your concern — dropdown (“Select your concern”): I have toothache; I have a broken or cracked tooth; My gums are bleeding or swollen; I have a missing tooth; I have a loose tooth; My teeth are sensitive to hot/cold; I suspect decay or a painful filling; I'm unhappy with the colour of my teeth; My teeth are crooked or gappy; I'd like to improve the look of my smile; I have wisdom tooth pain or swelling; I'm considering an implant or a fixed restoration; My denture is uncomfortable or doesn't fit properly; I have bad breath or tartar build-up; I have jaw joint pain or jaw locking; Other / I'm not sure. ·","Votre préoccupation — liste déroulante (« Sélectionnez votre préoccupation ») : J’ai mal aux dents ; J’ai une dent cassée ou fissurée ; Mes gencives saignent ou sont gonflées ; Il me manque une dent ; J’ai une dent qui bouge ; Mes dents sont sensibles au chaud/froid ; Je soupçonne une carie ou un plombage douloureux ; Je suis mécontente de la couleur de mes dents ; Mes dents sont de travers ou écartées ; Je voudrais embellir mon sourire ; J’ai une douleur ou un gonflement de dent de sagesse ; J’envisage un implant ou une restauration fixe ; Ma prothèse est inconfortable ou mal ajustée ; J’ai mauvaise haleine ou du tartre ; J’ai des douleurs ou blocages de l’articulation ; Autre / Je ne suis pas sûre. ·"],
['Consent tick box: “The details you send are protected under our <a href="kvkk.html">KVKK Privacy Notice</a> and <a href="gizlilik-sozlesmesi.html">Privacy Policy</a>.” ·','Case de consentement : « Les informations que vous envoyez sont protégées par notre <a href="kvkk.html">texte d’information KVKK</a> et notre <a href="gizlilik-sozlesmesi.html">politique de confidentialité</a>. » ·'],
['“Submit application” button.','Bouton « Envoyer la demande ».'],
['<h3>Success message</h3>','<h3>Message de succès</h3>'],
['<b>Your Application Has Been Received Successfully</b><br>','<b>Votre demande a bien été reçue</b><br>'],
['Your application has reached us. Our team will review it as soon as possible and contact you with the outcome of the assessment.','Votre demande nous est parvenue. Notre équipe l’examinera au plus vite et vous contactera avec le résultat de l’évaluation.'],
// textarea journey (kaçışlı, tek satır)
['&lt;p&gt;&lt;strong&gt;Digital pre-assessment form.&lt;/strong&gt; Fields: X-ray / photograph upload — “Choose a file” (max. 15MB); Full name; Email address; Your concern — dropdown (“Select your concern”): I have toothache; I have a broken or cracked tooth; My gums are bleeding or swollen; I have a missing tooth; I have a loose tooth; My teeth are sensitive to hot/cold; I suspect decay or a painful filling; I\'m unhappy with the colour of my teeth; My teeth are crooked or gappy; I\'d like to improve the look of my smile; I have wisdom tooth pain or swelling; I\'m considering an implant or a fixed restoration; My denture is uncomfortable or doesn\'t fit properly; I have bad breath or tartar build-up; I have jaw joint pain or jaw locking; Other / I\'m not sure; consent tick box: “The details you send are protected under our &lt;a href="/en/kvkk/"&gt;KVKK Privacy Notice&lt;/a&gt; and &lt;a href="/en/gizlilik-sozlesmesi/"&gt;Privacy Policy&lt;/a&gt;.”; “Submit application” button.&lt;/p&gt;','&lt;p&gt;&lt;strong&gt;Formulaire de pré-évaluation numérique.&lt;/strong&gt; Champs : téléversement radio/photo — « Choisir un fichier » (max. 15 Mo) ; nom et prénom ; adresse e-mail ; votre préoccupation — liste déroulante (« Sélectionnez votre préoccupation ») : J’ai mal aux dents ; J’ai une dent cassée ou fissurée ; Mes gencives saignent ou sont gonflées ; Il me manque une dent ; J’ai une dent qui bouge ; Mes dents sont sensibles au chaud/froid ; Je soupçonne une carie ou un plombage douloureux ; Je suis mécontente de la couleur de mes dents ; Mes dents sont de travers ou écartées ; Je voudrais embellir mon sourire ; J’ai une douleur ou un gonflement de dent de sagesse ; J’envisage un implant ou une restauration fixe ; Ma prothèse est inconfortable ou mal ajustée ; J’ai mauvaise haleine ou du tartre ; J’ai des douleurs ou blocages de l’articulation ; Autre / Je ne suis pas sûre ; case de consentement : « Les informations que vous envoyez sont protégées par notre &lt;a href="/en/kvkk/"&gt;texte d’information KVKK&lt;/a&gt; et notre &lt;a href="/en/gizlilik-sozlesmesi/"&gt;politique de confidentialité&lt;/a&gt;. » ; bouton « Envoyer la demande ».&lt;/p&gt;'],
['&lt;p&gt;&lt;strong&gt;Your Application Has Been Received Successfully&lt;/strong&gt; — Your application has reached us. Our team will review it as soon as possible and contact you with the outcome of the assessment.&lt;/p&gt;','&lt;p&gt;&lt;strong&gt;Votre demande a bien été reçue&lt;/strong&gt; — Votre demande nous est parvenue. Notre équipe l’examinera au plus vite et vous contactera avec le résultat de l’évaluation.&lt;/p&gt;'],
// about
['<span class="kur-badge">A “New You” with Smile Group</span>','<span class="kur-badge">Un « nouveau vous » avec Smile Group</span>'],
['<h2>An Approach That Adds Value to Your Smile</h2>','<h2>Une approche qui donne de la valeur à votre sourire</h2>'],
['&lt;h2&gt;An Approach That Adds Value to Your Smile&lt;/h2&gt;','&lt;h2&gt;Une approche qui donne de la valeur à votre sourire&lt;/h2&gt;'],
['European quality, gold-standard smiles','Qualité européenne, sourires au standard d’or'],
['Watch the clinic tour (video)','Voir la visite de la clinique (vidéo)'],
['By pairing modern technology with the approach of our experienced clinical team, we aim to offer a treatment experience that is comfortable, predictable and reassuring.','En mariant technologie moderne et approche de notre équipe soignante expérimentée, nous visons une expérience de traitement confortable, prévisible et rassurante.'],
['<b>Digital Planning</b> — Your treatment is planned digitally before it ever begins.','<b>Planification numérique</b> — Votre traitement se planifie numériquement avant même de commencer.'],
['<b>A Personalised Approach</b> — A treatment plan is built around each patient\'s individual needs.','<b>Une approche personnalisée</b> — Le plan de traitement se construit autour des besoins individuels de chaque patiente et patient.'],
['<b>Open Communication</b> — Every stage of the process is shared clearly and plainly.','<b>Communication ouverte</b> — Chaque étape du parcours se partage clairement et simplement.'],
['<b>Up-to-Date Treatment Technology</b> — Treatments supported by modern equipment and a digital infrastructure.','<b>Technologie de traitement actuelle</b> — Des traitements appuyés sur un équipement moderne et une infrastructure numérique.'],
['<b>International Patient Experience</b> — Planned, coordinated care for patients travelling from abroad.','<b>Expérience patient internationale</b> — Des soins planifiés et coordonnés pour les patients venant de l’étranger.'],
['<b>Aftercare &amp; Follow-Up</b> — Communication and support continue well after your treatment ends.','<b>Suivi &amp; accompagnement</b> — Communication et soutien continuent bien après la fin de votre traitement.'],
['&lt;li&gt;&lt;strong&gt;Digital Planning&lt;/strong&gt; — Your treatment is planned digitally before it ever begins.&lt;/li&gt;','&lt;li&gt;&lt;strong&gt;Planification numérique&lt;/strong&gt; — Votre traitement se planifie numériquement avant même de commencer.&lt;/li&gt;'],
['&lt;li&gt;&lt;strong&gt;A Personalised Approach&lt;/strong&gt; — A treatment plan is built around each patient\'s individual needs.&lt;/li&gt;','&lt;li&gt;&lt;strong&gt;Une approche personnalisée&lt;/strong&gt; — Le plan de traitement se construit autour des besoins individuels de chaque patiente et patient.&lt;/li&gt;'],
['&lt;li&gt;&lt;strong&gt;Open Communication&lt;/strong&gt; — Every stage of the process is shared clearly and plainly.&lt;/li&gt;','&lt;li&gt;&lt;strong&gt;Communication ouverte&lt;/strong&gt; — Chaque étape du parcours se partage clairement et simplement.&lt;/li&gt;'],
['&lt;li&gt;&lt;strong&gt;Up-to-Date Treatment Technology&lt;/strong&gt; — Treatments supported by modern equipment and a digital infrastructure.&lt;/li&gt;','&lt;li&gt;&lt;strong&gt;Technologie de traitement actuelle&lt;/strong&gt; — Des traitements appuyés sur un équipement moderne et une infrastructure numérique.&lt;/li&gt;'],
['&lt;li&gt;&lt;strong&gt;International Patient Experience&lt;/strong&gt; — Planned, coordinated care for patients travelling from abroad.&lt;/li&gt;','&lt;li&gt;&lt;strong&gt;Expérience patient internationale&lt;/strong&gt; — Des soins planifiés et coordonnés pour les patients venant de l’étranger.&lt;/li&gt;'],
['&lt;li&gt;&lt;strong&gt;Aftercare &amp;amp; Follow-Up&lt;/strong&gt; — Communication and support continue well after your treatment ends.&lt;/li&gt;','&lt;li&gt;&lt;strong&gt;Suivi &amp;amp; accompagnement&lt;/strong&gt; — Communication et soutien continuent bien après la fin de votre traitement.&lt;/li&gt;'],
['Get to Know Our Clinic →','Découvrez notre clinique →'],
['&gt;Get to Know Our Clinic&lt;','&gt;Découvrez notre clinique&lt;'],
// treatments intro
['<span class="kur-badge">A New You</span>','<span class="kur-badge">Un nouveau vous</span>'],
['<h2>Our Treatments</h2>','<h2>Nos traitements</h2>'],
['&lt;h2&gt;Our Treatments&lt;/h2&gt;','&lt;h2&gt;Nos traitements&lt;/h2&gt;'],
['Digital dentistry and master laboratory artistry.','Dentisterie numérique et art magistral du laboratoire.'],
['<b>Filter tabs:</b> All ·','<b>Onglets de filtre :</b> Tous ·'],
['View details →','Voir le détail →'],
// doctors
['<span class="kur-badge">The Team Behind Your Smile</span>','<span class="kur-badge">L’équipe derrière votre sourire</span>'],
['<h2>Our Distinguished Clinical Team</h2>','<h2>Notre équipe soignante d’exception</h2>'],
['&lt;h2&gt;Our Distinguished Clinical Team&lt;/h2&gt;','&lt;h2&gt;Notre équipe soignante d’exception&lt;/h2&gt;'],
['<p>Cosmetic Dentist</p>','<p>Chirurgien-dentiste esthétique</p>'],
['<p>Specialist Orthodontist</p>','<p>Orthodontiste</p>'],
['<p>Specialist Oral &amp; Maxillofacial Surgeon</p>','<p>Chirurgien oral et maxillo-facial</p>'],
['<p>Dentist</p>','<p>Chirurgien-dentiste</p>'],
['View All Doctors →','Voir tous les dentistes →'],
['&gt;View All Doctors&lt;','&gt;Voir tous les dentistes&lt;'],
['— Cosmetic Dentist&lt;','— Chirurgien-dentiste esthétique&lt;'],
['— Specialist Orthodontist&lt;','— Orthodontiste&lt;'],
['— Specialist Oral &amp;amp; Maxillofacial Surgeon&lt;','— Chirurgien oral et maxillo-facial&lt;'],
['— Dentist&lt;','— Chirurgien-dentiste&lt;'],
// scheduler
['<span class="kur-badge">Free Online Consultation</span>','<span class="kur-badge">Consultation en ligne gratuite</span>'],
['<h2>Plan Your Appointment</h2>','<h2>Planifiez votre rendez-vous</h2>'],
['&lt;h2&gt;Plan Your Appointment&lt;/h2&gt;','&lt;h2&gt;Planifiez votre rendez-vous&lt;/h2&gt;'],
['Choose a date and time that suits you for a one-to-one consultation with our specialist clinical team.','Choisissez la date et l’heure qui vous conviennent pour un entretien individuel avec notre équipe soignante spécialisée.'],
['alt="Dental consultation"','alt="Consultation dentaire"'],
['<h3>Book a One-to-One Consultation with a Specialist</h3>','<h3>Réservez un entretien individuel avec une ou un spécialiste</h3>'],
['&lt;strong&gt;Book a One-to-One Consultation with a Specialist&lt;/strong&gt;','&lt;strong&gt;Réservez un entretien individuel avec une ou un spécialiste&lt;/strong&gt;'],
["Speak directly with our specialists, weigh up your treatment options and build a plan that's yours alone — with no obligation whatsoever.","Parlez directement avec nos spécialistes, pesez vos options de traitement et bâtissez un plan qui n’appartient qu’à vous — sans le moindre engagement."],
['<b>Booking widget fields (the live scheduler is produced by WordPress):</b>','<b>Champs du widget de réservation (le planificateur réel est généré par WordPress) :</b>'],
['Timezone: Europe/Istanbul (UTC+3) · Previous week / Next week navigation · “Choose a date” day picker · “Choose a time” slot picker ·','Fuseau : Europe/Istanbul (UTC+3) · Navigation semaine précédente / suivante · Choix du jour « Choisir une date » · Choix du créneau « Choisir une heure » ·'],
['Full name · Your concern (optional) · “Book Appointment” button.','Nom et prénom · Votre préoccupation (facultatif) · Bouton « Réserver le rendez-vous ».'],
['Timezone: Europe/Istanbul (UTC+3); date and time pickers; full name; your concern (optional); “Book Appointment”.','Fuseau : Europe/Istanbul (UTC+3) ; choix de date et d’heure ; nom et prénom ; votre préoccupation (facultatif) ; « Réserver le rendez-vous ».'],
// smile robot
['<span class="kur-badge">Smile Design Robot (CAD/CAM)</span>','<span class="kur-badge">Robot de smile design (CAD/CAM)</span>'],
['<h2>Robotic Precision in Digital Dentistry</h2>','<h2>La précision robotique en dentisterie numérique</h2>'],
['&lt;h2&gt;Robotic Precision in Digital Dentistry&lt;/h2&gt;','&lt;h2&gt;La précision robotique en dentisterie numérique&lt;/h2&gt;'],
['Millimetre-precise smile production with Exocad planning, laser scanning and 5-axis robotic milling.','Une fabrication du sourire au millimètre — planification Exocad, scan laser et fraisage robotique 5 axes.'],
['<b>CAD/CAM 3D Visual Planning</b> — Using Exocad® professional engineering algorithms and medical software, our head technicians design each ceramic tooth to match the golden-ratio parameters of your facial line.','<b>Planification 3D CAD/CAM</b> — Avec les algorithmes d’ingénierie professionnels et le logiciel médical d’Exocad®, nos chefs techniciens dessinent chaque dent en céramique selon les paramètres du nombre d’or de votre ligne faciale.'],
["<b>Comfortable Laser Intraoral Scanning</b> — We've binned the traditional putty-like silicone impression trays. A high-speed laser camera captures 3,000 reference points every second, scanning your smile in full-colour 3D.","<b>Scan intra-oral laser confortable</b> — Nous avons remisé les porte-empreintes en silicone pâteux d’autrefois. Une caméra laser à haute vitesse capture 3 000 points de référence par seconde et scanne votre sourire en 3D pleine couleur."],
['<b>5-Axis Robotic Ceramic Milling</b> — Our in-house robotic milling units machine each crown from solid monobloc German zirconia blocks, delivering flawless light transmission for harmony with the gums and natural enamel.','<b>Fraisage céramique robotique 5 axes</b> — Nos unités de fraisage robotiques internes usinent chaque couronne dans des blocs de zircone allemande monobloc massifs — pour une transmission de la lumière impeccable, en harmonie avec la gencive et l’émail naturel.'],
['&lt;li&gt;&lt;strong&gt;CAD/CAM 3D Visual Planning&lt;/strong&gt; — Using Exocad® professional engineering algorithms and medical software, our head technicians design each ceramic tooth to match the golden-ratio parameters of your facial line.&lt;/li&gt;','&lt;li&gt;&lt;strong&gt;Planification 3D CAD/CAM&lt;/strong&gt; — Avec les algorithmes d’ingénierie professionnels et le logiciel médical d’Exocad®, nos chefs techniciens dessinent chaque dent en céramique selon les paramètres du nombre d’or de votre ligne faciale.&lt;/li&gt;'],
["&lt;li&gt;&lt;strong&gt;Comfortable Laser Intraoral Scanning&lt;/strong&gt; — We've binned the traditional putty-like silicone impression trays. A high-speed laser camera captures 3,000 reference points every second, scanning your smile in full-colour 3D.&lt;/li&gt;","&lt;li&gt;&lt;strong&gt;Scan intra-oral laser confortable&lt;/strong&gt; — Nous avons remisé les porte-empreintes en silicone pâteux d’autrefois. Une caméra laser à haute vitesse capture 3 000 points de référence par seconde et scanne votre sourire en 3D pleine couleur.&lt;/li&gt;"],
['&lt;li&gt;&lt;strong&gt;5-Axis Robotic Ceramic Milling&lt;/strong&gt; — Our in-house robotic milling units machine each crown from solid monobloc German zirconia blocks, delivering flawless light transmission for harmony with the gums and natural enamel.&lt;/li&gt;','&lt;li&gt;&lt;strong&gt;Fraisage céramique robotique 5 axes&lt;/strong&gt; — Nos unités de fraisage robotiques internes usinent chaque couronne dans des blocs de zircone allemande monobloc massifs — pour une transmission de la lumière impeccable, en harmonie avec la gencive et l’émail naturel.&lt;/li&gt;'],
['alt="Robotic precision in digital dentistry"','alt="La précision robotique en dentisterie numérique"'],
// treatment guide
['<span class="kur-badge">Treatment Guide</span>','<span class="kur-badge">Guide des traitements</span>'],
["<h2>Let's Improve Your Quality of Life Together</h2>","<h2>Améliorons ensemble votre qualité de vie</h2>"],
["&lt;h2&gt;Let's Improve Your Quality of Life Together&lt;/h2&gt;","&lt;h2&gt;Améliorons ensemble votre qualité de vie&lt;/h2&gt;"],
["Choose the concern affecting your daily life, and let's explore the treatment options that might suit you — together.","Choisissez la préoccupation qui touche votre quotidien, et explorons ensemble les options de traitement qui pourraient vous convenir."],
["<b>Concern cards:</b> I'm Missing a Tooth · I'm Not Happy with My Smile · I Snore · My Tooth Hurts · I Have Bad Breath · I've Broken a Tooth · Cosmetic Dentistry · I Have Gum Problems","<b>Cartes de préoccupation :</b> Il me manque une dent · Je ne suis pas contente de mon sourire · Je ronfle · J’ai mal aux dents · J’ai mauvaise haleine · Je me suis cassé une dent · Dentisterie esthétique · J’ai des problèmes de gencives"],
['<h3>Treatments that may suit you — panels per concern</h3>','<h3>Les traitements qui pourraient vous convenir — panneaux par préoccupation</h3>'],
["<b>Treatment Options for a Missing Tooth</b> — Let's look at implant and bridge options for your missing teeth together. Related:","<b>Options de traitement pour une dent manquante</b> — Regardons ensemble les options d’implant et de bridge pour vos dents manquantes. Liés :"],
["<b>Treatment Options if You're Not Happy with Your Smile</b> — Explore cosmetic solutions with smile design, veneers and zirconia. Related:","<b>Options de traitement si votre sourire ne vous plaît pas</b> — Explorez les solutions esthétiques avec smile design, facettes et zircone. Liés :"],
['<b>Treatment Options for Snoring</b> — Dentist-led assessment and treatment options for your snoring. Related:','<b>Options de traitement du ronflement</b> — Évaluation menée par le dentiste et options de traitement de votre ronflement. Liés :'],
['<b>Treatment Options for Toothache</b> — Look into fillings, root canal treatment and clenching care for the conditions behind the pain. Related:','<b>Options de traitement du mal de dents</b> — Plombages, traitement de canal et prise en charge du serrement pour les causes derrière la douleur. Liés :'],
["<b>Treatment Options for Bad Breath</b> — Learn about the causes of bad breath and how it's treated. Related:","<b>Options de traitement de la mauvaise haleine</b> — Découvrez les causes de la mauvaise haleine et son traitement. Liés :"],
['<b>Treatment Options for a Broken Tooth</b> — Implant, zirconia and inlay/onlay filling options for broken teeth. Related:','<b>Options de traitement d’une dent cassée</b> — Options implant, zircone et inlay/onlay pour les dents cassées. Liés :'],
['<b>Treatment Options for Cosmetic Dentistry</b> — Options for a cosmetic transformation with veneers, smile design and whitening. Related:','<b>Options de dentisterie esthétique</b> — Les options d’une transformation esthétique avec facettes, smile design et blanchiment. Liés :'],
['<b>Treatment Options for Gum Problems</b> — A healthy gum line with gum aesthetics and a scale and polish. Related:','<b>Options de traitement des problèmes de gencives</b> — Une ligne gingivale saine avec l’esthétique gingivale et le détartrage. Liés :'],
['>Same-Day Implants</a>','>Implants en un jour</a>'],
['>All-on-4 Implants</a>','>Implants All-on-4</a>'],
['>Crown &amp; Bridge</a>','>Couronnes &amp; bridges</a>'],
['>Veneers</a>','>Facettes</a>'],
['>Zirconia</a>','>Zircone</a>'],
['>Snoring Treatment</a>','>Traitement du ronflement</a>'],
['>Fillings</a>','>Plombages</a>'],
['>Root Canal</a>','>Traitement de canal</a>'],
['>I Clench My Teeth</a>','>Je serre les dents</a>'],
['>Bad Breath</a>','>Mauvaise haleine</a>'],
['>Inlay/Onlay Fillings</a>','>Inlays/Onlays</a>'],
['>Teeth Whitening</a>','>Blanchiment dentaire</a>'],
['>Gum Aesthetics</a>','>Esthétique gingivale</a>'],
['>Scale and Polish</a>','>Détartrage</a>'],
['<em>Every treatment starts with the right assessment and a personalised plan.</em>','<em>Chaque traitement commence par la bonne évaluation et un plan personnalisé.</em>'],
// stories
['<span class="kur-badge">Real Patient Stories</span>','<span class="kur-badge">Histoires de vrais patients</span>'],
['<h2>Inspiring Transformation Stories</h2>','<h2>Des histoires de transformation inspirantes</h2>'],
['&lt;h2&gt;Inspiring Transformation Stories&lt;/h2&gt;','&lt;h2&gt;Des histoires de transformation inspirantes&lt;/h2&gt;'],
['Smile transformations that rebuild confidence.','Des transformations du sourire qui reconstruisent la confiance.'],
["Elif's Transformation Story","L’histoire de transformation d’Elif"],
["Murat's Transformation Story","L’histoire de transformation de Murat"],
["Zeynep's Transformation Story","L’histoire de transformation de Zeynep"],
["Emre's Transformation Story","L’histoire de transformation d’Emre"],
['<p><b>Veneers · Smile Design</b></p>','<p><b>Facettes · Smile Design</b></p>'],
['<p><b>Implant</b></p>','<p><b>Implant</b></p>'],
['<p><b>Zirconia</b></p>','<p><b>Zircone</b></p>'],
['<p><b>Teeth Whitening</b></p>','<p><b>Blanchiment</b></p>'],
['Elif came to our clinic not with a specific complaint, but to find out whether her smile could be given a more balanced, natural look. Our assessment considered the shape and colour of her teeth and her smile line…','Elif n’est pas venue à notre clinique avec une plainte précise, mais pour découvrir si son sourire pouvait recevoir un rendu plus équilibré et plus naturel. Notre évaluation a regardé la forme et la couleur de ses dents et sa ligne du sourire…'],
["Murat came to us with the gap left by a molar he'd lost years earlier. His first priority wasn't appearance — it was being able to chew comfortably. Our assessment looked beyond the missing tooth itself, at his chewing balance and the neighbouring teeth…","Murat est venu à nous avec l’espace d’une molaire perdue des années plus tôt. Sa première priorité n’était pas l’apparence — c’était de mâcher confortablement. Notre évaluation a regardé au-delà de la dent manquante : l’équilibre masticatoire et les dents voisines…"],
['Zeynep came to us with old crowns, fitted years earlier, that had discoloured over time. She felt her smile looked tired — yet the last thing she wanted was an overly white, uniform result that gives that “obviously done” impression…','Zeynep est venue à nous avec d’anciennes couronnes, posées des années plus tôt, dont la couleur avait viré avec le temps. Son sourire lui paraissait fatigué — et la dernière chose qu’elle voulait était un résultat ultra-blanc, uniforme, à l’impression « visiblement fait »…'],
["Emre came to us with the staining left on his teeth by the coffee habit that had grown alongside a demanding job. His teeth were healthy; what he wanted wasn't a sweeping change, but for his smile to get its old brightness back.","Emre est venu à nous avec les colorations laissées sur ses dents par l’habitude du café qui avait grandi avec un travail exigeant. Ses dents étaient saines ; ce qu’il voulait n’était pas un grand changement, mais rendre à son sourire son ancien éclat."],
['Read the story →','Lire l’histoire →'],
['View All Patient Stories →','Voir toutes les histoires de patients →'],
['&gt;View All Patient Stories&lt;','&gt;Voir toutes les histoires de patients&lt;'],
// how it works
['<h2>The Treatment Process</h2>','<h2>Le parcours de traitement</h2>'],
['&lt;h2&gt;The Treatment Process&lt;/h2&gt;','&lt;h2&gt;Le parcours de traitement&lt;/h2&gt;'],
["<b>1. Send Your Photos</b> — Send us your photos and we'll carry out a pre-assessment.","<b>1. Envoyez vos photos</b> — Envoyez-nous vos photos et nous menons une pré-évaluation."],
['<b>2. Online Consultation</b> — Our specialists get in touch and talk you through your options.','<b>2. Consultation en ligne</b> — Nos spécialistes vous contactent et parcourent vos options avec vous.'],
["<b>3. A Personalised Plan</b> — A treatment plan is drawn up around what suits you best.","<b>3. Un plan personnalisé</b> — Le plan de traitement se dessine autour de ce qui vous convient le mieux."],
['<b>4. Treatment</b> — Your planned treatment is carried out in comfort.','<b>4. Traitement</b> — Votre traitement planifié se déroule dans le confort.'],
["<b>5. Your New Smile</b> — Enjoy the smile you've been dreaming of.","<b>5. Votre nouveau sourire</b> — Profitez du sourire dont vous rêviez."],
["&lt;li&gt;&lt;strong&gt;1. Send Your Photos&lt;/strong&gt; — Send us your photos and we'll carry out a pre-assessment.&lt;/li&gt;","&lt;li&gt;&lt;strong&gt;1. Envoyez vos photos&lt;/strong&gt; — Envoyez-nous vos photos et nous menons une pré-évaluation.&lt;/li&gt;"],
['&lt;li&gt;&lt;strong&gt;2. Online Consultation&lt;/strong&gt; — Our specialists get in touch and talk you through your options.&lt;/li&gt;','&lt;li&gt;&lt;strong&gt;2. Consultation en ligne&lt;/strong&gt; — Nos spécialistes vous contactent et parcourent vos options avec vous.&lt;/li&gt;'],
["&lt;li&gt;&lt;strong&gt;3. A Personalised Plan&lt;/strong&gt; — A treatment plan is drawn up around what suits you best.&lt;/li&gt;","&lt;li&gt;&lt;strong&gt;3. Un plan personnalisé&lt;/strong&gt; — Le plan de traitement se dessine autour de ce qui vous convient le mieux.&lt;/li&gt;"],
['&lt;li&gt;&lt;strong&gt;4. Treatment&lt;/strong&gt; — Your planned treatment is carried out in comfort.&lt;/li&gt;','&lt;li&gt;&lt;strong&gt;4. Traitement&lt;/strong&gt; — Votre traitement planifié se déroule dans le confort.&lt;/li&gt;'],
["&lt;li&gt;&lt;strong&gt;5. Your New Smile&lt;/strong&gt; — Enjoy the smile you've been dreaming of.&lt;/li&gt;","&lt;li&gt;&lt;strong&gt;5. Votre nouveau sourire&lt;/strong&gt; — Profitez du sourire dont vous rêviez.&lt;/li&gt;"],
['<b>Take the first step!</b> <a href="#treatment-journey-widget">Send a Photo</a>','<b>Faites le premier pas !</b> <a href="#treatment-journey-widget">Envoyer une photo</a>'],
['&lt;strong&gt;Take the first step!&lt;/strong&gt; Send a Photo.','&lt;strong&gt;Faites le premier pas !&lt;/strong&gt; Envoyer une photo.'],
// faq
['<span class="kur-badge">Knowledge Bank &amp; Guides</span>','<span class="kur-badge">Base de connaissances &amp; guides</span>'],
['<h2>Frequently Asked Questions</h2>','<h2>Foire aux questions</h2>'],
['&lt;h2&gt;Frequently Asked Questions&lt;/h2&gt;','&lt;h2&gt;Foire aux questions&lt;/h2&gt;'],
['Everything about health tourism, travel and treatments.','Tout sur le tourisme de santé, le voyage et les traitements.'],
['How many days does smile design treatment take in total?','Combien de jours dure au total le traitement de smile design ?'],
['Smile design usually takes just 5 to 6 days. On the first day, digital intraoral scans and a try-in of the restoration are carried out. Within 2–3 days your porcelain or zirconia crowns are produced in our laboratory, and on day 5 the final comfortable try-in and bonding are completed.','Le smile design ne dure le plus souvent que 5 à 6 jours. Le premier jour : scans intra-oraux numériques et essayage de la restauration. En 2–3 jours, vos couronnes en céramique ou en zircone se produisent dans notre laboratoire, et le 5e jour se terminent l’essayage final confortable et le collage.'],
['How can I get a free treatment plan without visiting the clinic?','Comment obtenir un plan de traitement gratuit sans visiter la clinique ?'],
['Use the X-ray and photo upload area on our homepage to send us your panoramic X-ray or clear photos of your smile taken on a phone. Our lead clinicians prepare a personalised quotation within 24 hours.','Utilisez la zone de téléversement de radios et de photos de notre page d’accueil et envoyez-nous votre panoramique ou des photos nettes de votre sourire prises au téléphone. Nos chirurgiens-dentistes référents préparent une offre personnalisée sous 24 heures.'],
['Are flights, a 5-star hotel and VIP transfers included in the treatment package?','Vols, hôtel 5 étoiles et transferts VIP sont-ils inclus dans le forfait de traitement ?'],
['Yes! For all our international patients above a certain treatment threshold, luxury accommodation in a 5-star hotel, an airport welcome and VIP Mercedes transfers between the hotel and the clinic are provided with our compliments.','Oui ! Pour toutes nos patientes et tous nos patients internationaux au-delà d’un certain montant de traitement, l’hébergement de luxe en hôtel 5 étoiles, l’accueil à l’aéroport et les transferts VIP en Mercedes entre l’hôtel et la clinique sont offerts.'],
['What does the lifetime warranty cover if a crown fractures?','Comment fonctionne la garantie à vie si une couronne casse ?'],
['All Straumann titanium implants placed at our clinic carry a lifetime warranty certificate that is valid worldwide. Our zirconia and porcelain crowns are covered by a 7-year clinical warranty.','Tous les implants en titane Straumann posés dans notre clinique portent un certificat de garantie à vie valable dans le monde entier. Nos couronnes en zircone et en céramique sont couvertes par une garantie clinique de 7 ans.'],
['Is treatment painful? Will I need sedation or anaesthesia?','Le traitement est-il douloureux ? Faut-il une sédation ou une anesthésie ?'],
["Because every procedure is carried out under local anaesthetic, you won't feel pain during treatment. For patients who feel anxious about treatment, laughing-gas sedation is also offered at no extra charge.","Chaque geste se déroulant sous anesthésie locale, vous ne sentez aucune douleur pendant le traitement. Pour les patientes et patients anxieux, la sédation au gaz hilarant est aussi proposée sans supplément."],
['Clinic-approved information · Topic: Treatments','Information validée cliniquement · Thème : Traitements'],
['Clinic-approved information · Topic: Travel','Information validée cliniquement · Thème : Voyage'],
['Clinic-approved information · Topic: General','Information validée cliniquement · Thème : Général'],
['All Questions →','Toutes les questions →'],
['&gt;All Questions&lt;','&gt;Toutes les questions&lt;'],
['Got a different question about travelling for treatment? <a href="#treatment-journey-widget">Get a Free Assessment from Our Dentist</a>','Vous avez une autre question sur le voyage de soins ? <a href="#treatment-journey-widget">Obtenez l’évaluation gratuite de nos chirurgiens-dentistes</a>'],
['Got a different question about travelling for treatment? Get a Free Assessment from Our Dentist.','Vous avez une autre question sur le voyage de soins ? Obtenez l’évaluation gratuite de nos chirurgiens-dentistes.'],
// blog section
['<span class="kur-badge">Smile Guide</span>','<span class="kur-badge">Guide du sourire</span>'],
['<h2>Latest From the Blog</h2>','<h2>Le plus récent du blog</h2>'],
['&lt;h2&gt;Latest From the Blog&lt;/h2&gt;','&lt;h2&gt;Le plus récent du blog&lt;/h2&gt;'],
['Expert guides on implants, smile design and digital dentistry.','Des guides d’experts sur les implants, le smile design et la dentisterie numérique.'],
['Read the article →','Lire l’article →'],
['View All Articles →','Voir tous les articles →'],
['&gt;View All Articles&lt;','&gt;Voir tous les articles&lt;'],
['8 min read · Blog','8 min de lecture · Blog'],
['9 min read · Blog','9 min de lecture · Blog'],
// pre-footer
['<span class="kur-badge">Your journey starts here</span>','<span class="kur-badge">Votre voyage commence ici</span>'],
["<h2>Let's Reach Your Dream Smile Together</h2>","<h2>Atteignons ensemble le sourire de vos rêves</h2>"],
["&lt;h2&gt;Let's Reach Your Dream Smile Together&lt;/h2&gt;","&lt;h2&gt;Atteignons ensemble le sourire de vos rêves&lt;/h2&gt;"],
['<p>Is something on your mind?</p>','<p>Quelque chose vous trotte dans la tête ?</p>'],
['<p><b>Book Your Free Online Consultation</b> — button: “Arrange My Appointment” (opens the appointment window).</p>','<p><b>Réservez votre consultation en ligne gratuite</b> — bouton : « Organiser mon rendez-vous » (ouvre la fenêtre de rendez-vous).</p>'],
['Is something on your mind? &lt;strong&gt;Book Your Free Online Consultation&lt;/strong&gt; — “Arrange My Appointment”.','Quelque chose vous trotte dans la tête ? &lt;strong&gt;Réservez votre consultation en ligne gratuite&lt;/strong&gt; — « Organiser mon rendez-vous ».'],
// paste chrome + foot
['<h2>📋 Import to WordPress</h2>','<h2>📋 Reprendre dans WordPress</h2>'],
['Paste the HTML below into the corresponding WordPress page as a <b>Custom HTML</b> block.','Collez le HTML ci-dessous comme bloc <b>HTML personnalisé</b> dans la page WordPress correspondante.'],
['Links inside it already use the <b>/en/…</b> URL scheme.','Les liens qu’il contient utilisent déjà le schéma d’URL <b>/fr/…</b>.'],
['<span class="lab">Page HTML (body)</span>','<span class="lab">HTML de la page (corps)</span>'],
["this.textContent='Copied ✓';var b=this;setTimeout(function(){b.textContent='Copy'},1600)\">Copy</button>","this.textContent='Copié ✓';var b=this;setTimeout(function(){b.textContent='Copier'},1600)\">Copier</button>"],
['<span>Smile Group · EN corporate page preview — internal use.</span>','<span>Smile Group · Aperçu des pages institutionnelles FR — usage interne.</span>'],
['<span><a href="../index.html">← All content</a></span>','<span><a href="../index.html">← Tous les contenus</a></span>'],
];
for (const [a, b] of D) rep(a, b, false);

/* ---- 6b) kaçışlı/parça varyantlar (textarea içi, birebir anahtar tutmayan satırlar) ---- */
const D2 = [
['Fields: X-ray / photograph upload — “Choose a file” (max. 15MB); Full name; Email address; Your concern — dropdown (“Select your concern”):','Champs : téléversement radio/photo — « Choisir un fichier » (max. 15 Mo) ; nom et prénom ; adresse e-mail ; votre préoccupation — liste déroulante (« Sélectionnez votre préoccupation ») :'],
["I have toothache; I have a broken or cracked tooth; My gums are bleeding or swollen; I have a missing tooth; I have a loose tooth; My teeth are sensitive to hot/cold; I suspect decay or a painful filling; I'm unhappy with the colour of my teeth; My teeth are crooked or gappy; I'd like to improve the look of my smile; I have wisdom tooth pain or swelling; I'm considering an implant or a fixed restoration; My denture is uncomfortable or doesn't fit properly; I have bad breath or tartar build-up; I have jaw joint pain or jaw locking; Other / I'm not sure","J’ai mal aux dents ; J’ai une dent cassée ou fissurée ; Mes gencives saignent ou sont gonflées ; Il me manque une dent ; J’ai une dent qui bouge ; Mes dents sont sensibles au chaud/froid ; Je soupçonne une carie ou un plombage douloureux ; Je suis mécontente de la couleur de mes dents ; Mes dents sont de travers ou écartées ; Je voudrais embellir mon sourire ; J’ai une douleur ou un gonflement de dent de sagesse ; J’envisage un implant ou une restauration fixe ; Ma prothèse est inconfortable ou mal ajustée ; J’ai mauvaise haleine ou du tartre ; J’ai des douleurs ou blocages de l’articulation ; Autre / Je ne suis pas sûre"],
['; consent tick box: “The details you send are protected under our','; case de consentement : « Les informations que vous envoyez sont protégées par notre'],
['&gt;KVKK Privacy Notice&lt;/a&gt; and &lt;a href="/en/gizlilik-sozlesmesi/"&gt;Privacy Policy&lt;/a&gt;.”; “Submit application” button.','&gt;texte d’information KVKK&lt;/a&gt; et notre &lt;a href="/en/gizlilik-sozlesmesi/"&gt;politique de confidentialité&lt;/a&gt;. » ; bouton « Envoyer la demande ».'],
['Book a One-to-One Consultation with a Specialist.','Réservez un entretien individuel avec une ou un spécialiste.'],
['Treatment Options for a Missing Tooth','Options de traitement pour une dent manquante'],
["Treatment Options if You're Not Happy with Your Smile","Options de traitement si votre sourire ne vous plaît pas"],
['Treatment Options for Snoring','Options de traitement du ronflement'],
['Treatment Options for Toothache','Options de traitement du mal de dents'],
['Treatment Options for Mauvaise haleine (halitose)','Options de traitement de la mauvaise haleine'],
['Treatment Options for Bad Breath','Options de traitement de la mauvaise haleine'],
['Treatment Options for a Broken Tooth','Options de traitement d’une dent cassée'],
['Treatment Options for Cosmetic Dentistry','Options de dentisterie esthétique'],
['Treatment Options for Gum Problems','Options de traitement des problèmes de gencives'],
["— Let's look at implant and bridge options for your missing teeth together. Related:","— Regardons ensemble les options d’implant et de bridge pour vos dents manquantes. Liés :"],
['— Explore cosmetic solutions with smile design, veneers and zirconia. Related:','— Explorez les solutions esthétiques avec smile design, facettes et zircone. Liés :'],
['— Dentist-led assessment and treatment options for your snoring. Related:','— Évaluation menée par le dentiste et options de traitement de votre ronflement. Liés :'],
['— Look into fillings, root canal treatment and clenching care for the conditions behind the pain. Related:','— Plombages, traitement de canal et prise en charge du serrement pour les causes derrière la douleur. Liés :'],
["— Learn about the causes of bad breath and how it's treated. Related:","— Découvrez les causes de la mauvaise haleine et son traitement. Liés :"],
['— Implant, zirconia and inlay/onlay filling options for broken teeth. Related:','— Options implant, zircone et inlay/onlay pour les dents cassées. Liés :'],
['— Options for a cosmetic transformation with veneers, smile design and whitening. Related:','— Les options d’une transformation esthétique avec facettes, smile design et blanchiment. Liés :'],
['— A healthy gum line with gum aesthetics and a scale and polish. Related:','— Une ligne gingivale saine avec l’esthétique gingivale et le détartrage. Liés :'],
['Every treatment starts with the right assessment and a personalised plan.','Chaque traitement commence par la bonne évaluation et un plan personnalisé.'],
["&lt;strong&gt;Send Your Photos&lt;/strong&gt; — Send us your photos and we'll carry out a pre-assessment.","&lt;strong&gt;Envoyez vos photos&lt;/strong&gt; — Envoyez-nous vos photos et nous menons une pré-évaluation."],
['&lt;strong&gt;Online Consultation&lt;/strong&gt; — Our specialists get in touch and talk you through your options.','&lt;strong&gt;Consultation en ligne&lt;/strong&gt; — Nos spécialistes vous contactent et parcourent vos options avec vous.'],
["&lt;strong&gt;A Personalised Plan&lt;/strong&gt; — A treatment plan is drawn up around what suits you best.","&lt;strong&gt;Un plan personnalisé&lt;/strong&gt; — Le plan de traitement se dessine autour de ce qui vous convient le mieux."],
['&lt;strong&gt;Treatment&lt;/strong&gt; — Your planned treatment is carried out in comfort.','&lt;strong&gt;Traitement&lt;/strong&gt; — Votre traitement planifié se déroule dans le confort.'],
["&lt;strong&gt;Your New Smile&lt;/strong&gt; — Enjoy the smile you've been dreaming of.","&lt;strong&gt;Votre nouveau sourire&lt;/strong&gt; — Profitez du sourire dont vous rêviez."],
['&lt;strong&gt;Take the first step!&lt;/strong&gt; &lt;a href="#treatment-journey-widget"&gt;Send a Photo&lt;/a&gt;','&lt;strong&gt;Faites le premier pas !&lt;/strong&gt; &lt;a href="#treatment-journey-widget"&gt;Envoyer une photo&lt;/a&gt;'],
['View All Treatments','Voir tous les traitements'],
['Digital pre-assessment form.','Formulaire de pré-évaluation numérique.'],
["<b>Concern cards:</b> I'm Missing a Tooth · I'm Not Happy with My Smile · I Snore · Mal de dents · I Have Mauvaise haleine (halitose) · I've Broken a Tooth · Cosmetic Dentistry · I Have Gum Problems","<b>Cartes de préoccupation :</b> Il me manque une dent · Je ne suis pas contente de mon sourire · Je ronfle · J’ai mal aux dents · J’ai mauvaise haleine · Je me suis cassé une dent · Dentisterie esthétique · J’ai des problèmes de gencives"],
['Booking widget: timezone Europe/Istanbul (UTC+3); “Choose a date”; “Choose a time”; Full name; Your concern (optional); “Book Appointment” button.','Widget de réservation : fuseau Europe/Istanbul (UTC+3) ; « Choisir une date » ; « Choisir une heure » ; nom et prénom ; votre préoccupation (facultatif) ; bouton « Réserver le rendez-vous ».'],
];
for (const [a, b] of D2) rep(a, b, false);

/* ---- 7) /en/ -> /fr/ + canlı FR taban ve slug haritaları (textarea linkleri) ---- */
s = s.split('href="/en/').join('href="/fr/');
s = s.split('href="/fr/hizmet/').join('href="/fr/traitement/');
s = s.split('href="/fr/doktor/').join('href="/fr/dentiste/');
const hastaMap = [
  ['/fr/hasta-hikayesi/elif-lamine/', '/fr/histoire-patient/facettes-avant-apres/'],
  ['/fr/hasta-hikayesi/murat-implant/', '/fr/histoire-patient/implant-dentaire-avant-apres/'],
  ['/fr/hasta-hikayesi/zeynep-zirkonyum/', '/fr/histoire-patient/couronnes-zircone-avant-apres/'],
  ['/fr/hasta-hikayesi/emre-beyazlatma/', '/fr/histoire-patient/blanchiment-avant-apres/'],
];
for (const [a, b] of hastaMap) s = s.split(a).join(b);
const blogSlugFR = {
  '60-yas-ustu-dis-sagligi': 'sante-dentaire-apres-60-ans',
  'cocuklarda-curuk-onleme': 'prevention-caries-enfants',
  'dis-beyazlatma-dogru-bilinen-yanlislar': 'mythes-blanchiment-dentaire',
  'dis-kaplama-omru': 'duree-vie-couronnes',
  'hamilelikte-dis-sagligi': 'sante-dentaire-grossesse',
  'implant-iyilesme-sureci': 'cicatrisation-implant',
  'implant-mi-kopru-mu': 'implant-ou-bridge',
  'seffaf-plak-mi-dis-teli-mi': 'aligneurs-ou-appareil',
  'stres-ve-dis-sagligi': 'stress-et-sante-dentaire',
};
for (const [tr, fr] of Object.entries(blogSlugFR)) s = s.split('href="/fr/' + tr + '/"').join('href="/fr/' + fr + '/"');
const kurumsalMap = [
  ['/fr/hakkimizda/', '/fr/a-propos/'], ['/fr/iletisim/', '/fr/contact/'], ['/fr/sss/', '/fr/faq/'],
  ['/fr/kariyer/', '/fr/carriere/'], ['/fr/galeri/', '/fr/galerie/'], ['/fr/kvkk/', '/fr/protection-des-donnees/'],
  ['/fr/gizlilik-sozlesmesi/', '/fr/politique-de-confidentialite/'], ['/fr/garanti-politikamiz/', '/fr/politique-de-garantie/'],
  ['/fr/anlasmali-kurumlarimiz/', '/fr/institutions-partenaires/'], ['/fr/cozum-ortaklarimiz/', '/fr/partenaires-solutions/'],
  ['/fr/odullerimiz/', '/fr/distinctions/'], ['/fr/sosyal-sorumluluklarimiz/', '/fr/responsabilite-sociale/'],
  ['/fr/hekimlerimiz/', '/fr/nos-dentistes/'], ['/fr/hasta-hikayeleri/', '/fr/histoires-patients/'],
  ['/fr/hizmetler/', '/fr/traitements/'],
];
for (const [a, b] of kurumsalMap) s = s.split('href="' + a).join('href="' + b);

/* ---- 7b) bağlantı dönüşümü SONRASI kalan karma parçalar ---- */
const D3 = [
['&gt;KVKK Privacy Notice&lt;/a&gt; and &lt;a href="/fr/politique-de-confidentialite/"&gt;Privacy Policy&lt;/a&gt;.”;','&gt;texte d’information KVKK&lt;/a&gt; et notre &lt;a href="/fr/politique-de-confidentialite/"&gt;politique de confidentialité&lt;/a&gt;. » ;'],
['sûre; case de consentement','sûre ; case de consentement'],
];
for (const [a, b] of D3) rep(a, b, false);

/* ---- 8) yaz + kalinti taramasi ---- */
fs.writeFileSync(path.join(ROOT, 'kurumsal', 'anasayfa.html'), s);
const kalinti = [];
for (const [i, satir] of s.split('\n').entries()) {
  if (/tr-orig|Original TR|TR:/.test(satir)) continue;
  const m = satir.match(/\b(the|and with|your smile|our clinic|This page|is one of|are carried out|you can|we bring|with a|for the)\b/);
  if (m) kalinti.push((i + 1) + ': ' + satir.trim().slice(0, 110));
}
console.log('sorun: ' + sorunlar.length);
sorunlar.forEach(x => console.log('  - ' + x));
console.log('EN kalinti adayi satir: ' + kalinti.length);
kalinti.slice(0, 40).forEach(x => console.log('  ? ' + x));
