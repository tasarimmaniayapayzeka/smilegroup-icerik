/* EN kurumsal/anasayfa.html -> DE kurumsal/anasayfa.html
 * Kaynaklar: site-en/index.html DATA (EN başlık), site-de/index.html DATA (DE başlık),
 * site-de/_drafts/<slug>.js (ARTICLE_DE.lead = kart özeti), blog taslakları (başlık+metaDescription).
 * Görünen kart özeti ve textarea özeti FARKLI metinlerdir; ikisi de slug bazında DE lead ile değişir. */
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
const deTitles = {}, enTitles = {};
for (const [t, s] of dataTriples(path.join(ROOT, 'index.html'))) if (!(s in deTitles)) deTitles[s] = t;
for (const [t, s] of dataTriples(path.join(EN, 'index.html'))) if (!(s in enTitles)) enTitles[s] = t;

function draftField(dir, file, globalVar, field) {
  const src = fs.readFileSync(path.join(dir, '_drafts', file), 'utf8');
  const sandbox = { window: {} };
  new Function('window', src)(sandbox.window);
  return sandbox.window[globalVar][field];
}
const escTxt = (s) => s.replace(/&/g, '&amp;'); // textarea içinde & çift kaçışlanır

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
  const lead = draftField(ROOT, slug + '.js', 'ARTICLE_DE', 'lead');
  const blok = new RegExp(
    '(<div class="svc-card" id="svc-' + slug + '">[\\s\\S]*?<span class="svc-cat">)([^<]*)(</span>\\s*<p>)([\\s\\S]*?)(</p>\\s*<p class="svc-more">)'
  );
  const m = s.match(blok);
  if (!m) { sorunlar.push('svc blok yok: ' + slug); continue; }
  s = s.replace(blok, (_, a, kat, b, exc, c) => a + kat + b + lead + c);
}

/* ---- 2) tedavi kartları: textarea (h3 başlık + em kategori + özet) ---- */
for (const slug of slugs) {
  const lead = draftField(ROOT, slug + '.js', 'ARTICLE_DE', 'lead');
  const rx = new RegExp(
    '(&lt;h3&gt;&lt;a href="/en/hizmet/' + slug + '/"&gt;)([\\s\\S]*?)(&lt;/a&gt;&lt;/h3&gt;\\s*&lt;p&gt;&lt;em&gt;)([\\s\\S]*?)(&lt;/em&gt; — )([\\s\\S]*?)(&lt;/p&gt;)'
  );
  const m = s.match(rx);
  if (!m) { sorunlar.push('textarea blok yok: ' + slug); continue; }
  s = s.replace(rx, (_, a, ti, b, kat, c, exc, d) => a + escTxt(deTitles[slug] || ti) + b + kat + c + escTxt(lead) + d);
}

/* ---- 3) başlıklar (görünen alt/h3 metinleri) — uzundan kısaya ---- */
const titlePairs = slugs
  .filter(sl => enTitles[sl] && deTitles[sl] && enTitles[sl] !== deTitles[sl])
  .sort((a, b) => enTitles[b].length - enTitles[a].length);
for (const sl of titlePairs) {
  const en = enTitles[sl], de = deTitles[sl];
  rep(en, de, false);
  rep(en.replace(/&/g, '&amp;'), de.replace(/&/g, '&amp;'), false); // gövde entity biçimi
}

/* ---- 4) kategoriler (svc-cat, filtre sekmeleri, textarea em) ---- */
const kat = [
  ['Digital Smile Design', 'Digitales Smile Design'],
  ['Implant Treatments', 'Implantat-Behandlungen'],
  ['Change My Smile', 'Mein Lächeln verändern'],
  ['Sleep &amp;amp; Jaw Health', 'Schlaf- &amp;amp; Kiefergesundheit'],
  ['Sleep &amp; Jaw Health', 'Schlaf- &amp; Kiefergesundheit'],
  ['Cosmetic Treatments', 'Ästhetische Behandlungen'],
  ['General Treatments', 'Allgemeine Behandlungen'],
  ['Orthodontics', 'Kieferorthopädie'],
  ["Children's Dentistry", 'Kinderzahnheilkunde'],
  ['Comparison', 'Vergleich'],
];
for (const [a, b] of kat) rep(a, b, false);

/* ---- 5) blog kartları: başlık + özet ---- */
const blogSlugs = ['stres-ve-dis-sagligi','seffaf-plak-mi-dis-teli-mi','implant-mi-kopru-mu','implant-iyilesme-sureci','hamilelikte-dis-sagligi','dis-kaplama-omru'];
for (const bs of blogSlugs) {
  const enT = draftField(EN, 'blog-' + bs + '.js', 'BLOG_EN', 'title');
  const deT = draftField(ROOT, 'blog-' + bs + '.js', 'BLOG_DE', 'title');
  const enD = draftField(EN, 'blog-' + bs + '.js', 'BLOG_EN', 'metaDescription');
  const deD = draftField(ROOT, 'blog-' + bs + '.js', 'BLOG_DE', 'metaDescription');
  rep(enT, deT, false);
  rep(enD, deD, false);
}
rep('5 August 2026 · 8 min read', '5. August 2026 · 8 Min. Lesezeit', false);
rep('5 August 2026 · 9 min read', '5. August 2026 · 9 Min. Lesezeit', false);

/* ---- 6) sabit metin sözlüğü (görünen + textarea düz-metin çiftleri) ---- */
const D = [
// baş
['<html lang="en">','<html lang="de">'],
['<title>Home — Smile Group</title>','<title>Startseite — Smile Group</title>'],
['<meta name="description" content="Smile Group, Şişli, Istanbul: digital smile design, implants and cosmetic dentistry with personalised planning, robotic CAD/CAM production and aftercare.">','<meta name="description" content="Smile Group, Şişli, Istanbul: digitales Smile Design, Implantate und ästhetische Zahnmedizin mit persönlicher Planung, CAD/CAM-Robotik und Nachsorge.">'],
['<span class="sub">Aesthetic &amp; Dental Clinic</span>','<span class="sub">Klinik für Zahnmedizin &amp; Ästhetik</span>'],
['Corporate page · <b>EN edition</b>','Unternehmensseite · <b>DE-Ausgabe</b>'],
['<div class="crumb">Home  ›  <span>Home</span></div>','<div class="crumb">Startseite  ›  <span>Startseite</span></div>'],
['<h1>Home</h1>','<h1>Startseite</h1>'],
['TR original:','TR-Original:'],
// lead + about tekrar eden paragraf (2 kez: lead + about + textarea)
["At Smile Group, we bring together cosmetic dentistry, implant treatments and digital dentistry with an approach built around planning for the individual. We listen to each patient's needs, assess the treatment process together, and plan every step with clear, open communication.","Bei der Smile Group führen wir ästhetische Zahnmedizin, Implantatbehandlungen und digitale Zahnmedizin mit einem Ansatz zusammen, der um die Planung für den einzelnen Menschen gebaut ist. Wir hören auf die Bedürfnisse jeder Patientin und jedes Patienten, beurteilen den Behandlungsweg gemeinsam und planen jeden Schritt mit klarer, offener Kommunikation."],
// hero
['<span class="kur-badge">Hero</span>','<span class="kur-badge">Hero</span>'],
['<h2>Homepage Hero Slider</h2>','<h2>Hero-Slider der Startseite</h2>'],
['The hero is an image-only slider of four banners (mobile variants swap in below 992px); it carries no written content. Slide navigation labels: “Slide 1…Slide 4”.','Der Hero ist ein reiner Bild-Slider aus vier Bannern (unter 992px greifen die Mobilvarianten); er trägt keinen Textinhalt. Navigationsbeschriftungen: „Slide 1…Slide 4“.'],
['Mobile variant of banner 1','Mobilvariante von Banner 1'],
['Mobile variant of banner 2','Mobilvariante von Banner 2'],
['Mobile variant of banner 3','Mobilvariante von Banner 3'],
['Mobile variant of banner 4','Mobilvariante von Banner 4'],
// journey widget
['<span class="kur-badge">Digital Pre-Assessment Form</span>','<span class="kur-badge">Digitales Voranalyse-Formular</span>'],
['<h2>Start Your Treatment Journey</h2>','<h2>Starten Sie Ihre Behandlungsreise</h2>'],
['&lt;h2&gt;Start Your Treatment Journey&lt;/h2&gt;','&lt;h2&gt;Starten Sie Ihre Behandlungsreise&lt;/h2&gt;'],
['<b>Form fields (the live form is produced by WordPress):</b>','<b>Formularfelder (das Live-Formular erzeugt WordPress):</b>'],
['X-ray / photograph upload — “Choose a file” (max. 15MB) · Full name · Email address ·','Röntgen-/Foto-Upload — „Datei auswählen“ (max. 15 MB) · Vor- und Nachname · E-Mail-Adresse ·'],
["Your concern — dropdown (“Select your concern”): I have toothache; I have a broken or cracked tooth; My gums are bleeding or swollen; I have a missing tooth; I have a loose tooth; My teeth are sensitive to hot/cold; I suspect decay or a painful filling; I'm unhappy with the colour of my teeth; My teeth are crooked or gappy; I'd like to improve the look of my smile; I have wisdom tooth pain or swelling; I'm considering an implant or a fixed restoration; My denture is uncomfortable or doesn't fit properly; I have bad breath or tartar build-up; I have jaw joint pain or jaw locking; Other / I'm not sure. ·","Ihr Anliegen — Dropdown („Wählen Sie Ihr Anliegen“): Ich habe Zahnschmerzen; Ich habe einen abgebrochenen oder gerissenen Zahn; Mein Zahnfleisch blutet oder ist geschwollen; Mir fehlt ein Zahn; Ich habe einen lockeren Zahn; Meine Zähne sind heiß-/kaltempfindlich; Ich vermute Karies oder eine schmerzende Füllung; Ich bin mit meiner Zahnfarbe unzufrieden; Meine Zähne stehen schief oder mit Lücken; Ich möchte mein Lächeln schöner machen; Ich habe Weisheitszahnschmerzen oder eine Schwellung; Ich denke über ein Implantat oder festen Zahnersatz nach; Meine Prothese sitzt unbequem oder passt nicht richtig; Ich habe Mundgeruch oder Zahnsteinbildung; Ich habe Kiefergelenkschmerzen oder Kieferblockaden; Sonstiges / Ich bin mir nicht sicher. ·"],
['Consent tick box: “The details you send are protected under our <a href="kvkk.html">KVKK Privacy Notice</a> and <a href="gizlilik-sozlesmesi.html">Privacy Policy</a>.” ·','Einwilligungs-Häkchen: „Die von Ihnen gesendeten Angaben sind durch unseren <a href="kvkk.html">KVKK-Informationstext</a> und unsere <a href="gizlilik-sozlesmesi.html">Datenschutzerklärung</a> geschützt.“ ·'],
['“Submit application” button.','Schaltfläche „Bewerbung absenden“.'],
['<h3>Success message</h3>','<h3>Erfolgsmeldung</h3>'],
['<b>Your Application Has Been Received Successfully</b><br>','<b>Ihre Anfrage ist erfolgreich eingegangen</b><br>'],
['Your application has reached us. Our team will review it as soon as possible and contact you with the outcome of the assessment.','Ihre Anfrage hat uns erreicht. Unser Team sieht sie sich so schnell wie möglich an und meldet sich mit dem Ergebnis der Beurteilung bei Ihnen.'],
// textarea journey (kaçışlı, tek satır)
['&lt;p&gt;&lt;strong&gt;Digital pre-assessment form.&lt;/strong&gt; Fields: X-ray / photograph upload — “Choose a file” (max. 15MB); Full name; Email address; Your concern — dropdown (“Select your concern”): I have toothache; I have a broken or cracked tooth; My gums are bleeding or swollen; I have a missing tooth; I have a loose tooth; My teeth are sensitive to hot/cold; I suspect decay or a painful filling; I\'m unhappy with the colour of my teeth; My teeth are crooked or gappy; I\'d like to improve the look of my smile; I have wisdom tooth pain or swelling; I\'m considering an implant or a fixed restoration; My denture is uncomfortable or doesn\'t fit properly; I have bad breath or tartar build-up; I have jaw joint pain or jaw locking; Other / I\'m not sure; consent tick box: “The details you send are protected under our &lt;a href="/en/kvkk/"&gt;KVKK Privacy Notice&lt;/a&gt; and &lt;a href="/en/gizlilik-sozlesmesi/"&gt;Privacy Policy&lt;/a&gt;.”; “Submit application” button.&lt;/p&gt;','&lt;p&gt;&lt;strong&gt;Digitales Voranalyse-Formular.&lt;/strong&gt; Felder: Röntgen-/Foto-Upload — „Datei auswählen“ (max. 15 MB); Vor- und Nachname; E-Mail-Adresse; Ihr Anliegen — Dropdown („Wählen Sie Ihr Anliegen“): Ich habe Zahnschmerzen; Ich habe einen abgebrochenen oder gerissenen Zahn; Mein Zahnfleisch blutet oder ist geschwollen; Mir fehlt ein Zahn; Ich habe einen lockeren Zahn; Meine Zähne sind heiß-/kaltempfindlich; Ich vermute Karies oder eine schmerzende Füllung; Ich bin mit meiner Zahnfarbe unzufrieden; Meine Zähne stehen schief oder mit Lücken; Ich möchte mein Lächeln schöner machen; Ich habe Weisheitszahnschmerzen oder eine Schwellung; Ich denke über ein Implantat oder festen Zahnersatz nach; Meine Prothese sitzt unbequem oder passt nicht richtig; Ich habe Mundgeruch oder Zahnsteinbildung; Ich habe Kiefergelenkschmerzen oder Kieferblockaden; Sonstiges / Ich bin mir nicht sicher; Einwilligungs-Häkchen: „Die von Ihnen gesendeten Angaben sind durch unseren &lt;a href="/de/kvkk/"&gt;KVKK-Informationstext&lt;/a&gt; und unsere &lt;a href="/de/gizlilik-sozlesmesi/"&gt;Datenschutzerklärung&lt;/a&gt; geschützt.“; Schaltfläche „Bewerbung absenden“.&lt;/p&gt;'],
['&lt;p&gt;&lt;strong&gt;Your Application Has Been Received Successfully&lt;/strong&gt; — Your application has reached us. Our team will review it as soon as possible and contact you with the outcome of the assessment.&lt;/p&gt;','&lt;p&gt;&lt;strong&gt;Ihre Anfrage ist erfolgreich eingegangen&lt;/strong&gt; — Ihre Anfrage hat uns erreicht. Unser Team sieht sie sich so schnell wie möglich an und meldet sich mit dem Ergebnis der Beurteilung bei Ihnen.&lt;/p&gt;'],
// about
['<span class="kur-badge">A “New You” with Smile Group</span>','<span class="kur-badge">Ein „neues Ich" mit der Smile Group</span>'],
['<h2>An Approach That Adds Value to Your Smile</h2>','<h2>Ein Ansatz, der Ihrem Lächeln Wert verleiht</h2>'],
['&lt;h2&gt;An Approach That Adds Value to Your Smile&lt;/h2&gt;','&lt;h2&gt;Ein Ansatz, der Ihrem Lächeln Wert verleiht&lt;/h2&gt;'],
['European quality, gold-standard smiles','Europäische Qualität, Lächeln nach Goldstandard'],
['Watch the clinic tour (video)','Kliniktour ansehen (Video)'],
['By pairing modern technology with the approach of our experienced clinical team, we aim to offer a treatment experience that is comfortable, predictable and reassuring.','Indem wir moderne Technologie mit dem Ansatz unseres erfahrenen Behandlungsteams verbinden, wollen wir ein Behandlungserlebnis bieten, das komfortabel, vorhersehbar und beruhigend ist.'],
['<b>Digital Planning</b> — Your treatment is planned digitally before it ever begins.','<b>Digitale Planung</b> — Ihre Behandlung wird digital geplant, bevor sie überhaupt beginnt.'],
['<b>A Personalised Approach</b> — A treatment plan is built around each patient\'s individual needs.','<b>Ein persönlicher Ansatz</b> — Der Behandlungsplan entsteht um die individuellen Bedürfnisse jeder Patientin und jedes Patienten.'],
['<b>Open Communication</b> — Every stage of the process is shared clearly and plainly.','<b>Offene Kommunikation</b> — Jede Etappe des Ablaufs wird klar und verständlich geteilt.'],
['<b>Up-to-Date Treatment Technology</b> — Treatments supported by modern equipment and a digital infrastructure.','<b>Aktuelle Behandlungstechnologie</b> — Behandlungen, gestützt auf moderne Ausstattung und eine digitale Infrastruktur.'],
['<b>International Patient Experience</b> — Planned, coordinated care for patients travelling from abroad.','<b>Internationale Patientenerfahrung</b> — Geplante, koordinierte Versorgung für Patientinnen und Patienten aus dem Ausland.'],
['<b>Aftercare &amp; Follow-Up</b> — Communication and support continue well after your treatment ends.','<b>Nachsorge &amp; Begleitung</b> — Kommunikation und Unterstützung laufen weit über das Behandlungsende hinaus weiter.'],
['&lt;li&gt;&lt;strong&gt;Digital Planning&lt;/strong&gt; — Your treatment is planned digitally before it ever begins.&lt;/li&gt;','&lt;li&gt;&lt;strong&gt;Digitale Planung&lt;/strong&gt; — Ihre Behandlung wird digital geplant, bevor sie überhaupt beginnt.&lt;/li&gt;'],
['&lt;li&gt;&lt;strong&gt;A Personalised Approach&lt;/strong&gt; — A treatment plan is built around each patient\'s individual needs.&lt;/li&gt;','&lt;li&gt;&lt;strong&gt;Ein persönlicher Ansatz&lt;/strong&gt; — Der Behandlungsplan entsteht um die individuellen Bedürfnisse jeder Patientin und jedes Patienten.&lt;/li&gt;'],
['&lt;li&gt;&lt;strong&gt;Open Communication&lt;/strong&gt; — Every stage of the process is shared clearly and plainly.&lt;/li&gt;','&lt;li&gt;&lt;strong&gt;Offene Kommunikation&lt;/strong&gt; — Jede Etappe des Ablaufs wird klar und verständlich geteilt.&lt;/li&gt;'],
['&lt;li&gt;&lt;strong&gt;Up-to-Date Treatment Technology&lt;/strong&gt; — Treatments supported by modern equipment and a digital infrastructure.&lt;/li&gt;','&lt;li&gt;&lt;strong&gt;Aktuelle Behandlungstechnologie&lt;/strong&gt; — Behandlungen, gestützt auf moderne Ausstattung und eine digitale Infrastruktur.&lt;/li&gt;'],
['&lt;li&gt;&lt;strong&gt;International Patient Experience&lt;/strong&gt; — Planned, coordinated care for patients travelling from abroad.&lt;/li&gt;','&lt;li&gt;&lt;strong&gt;Internationale Patientenerfahrung&lt;/strong&gt; — Geplante, koordinierte Versorgung für Patientinnen und Patienten aus dem Ausland.&lt;/li&gt;'],
['&lt;li&gt;&lt;strong&gt;Aftercare &amp;amp; Follow-Up&lt;/strong&gt; — Communication and support continue well after your treatment ends.&lt;/li&gt;','&lt;li&gt;&lt;strong&gt;Nachsorge &amp;amp; Begleitung&lt;/strong&gt; — Kommunikation und Unterstützung laufen weit über das Behandlungsende hinaus weiter.&lt;/li&gt;'],
['Get to Know Our Clinic →','Lernen Sie unsere Klinik kennen →'],
['&gt;Get to Know Our Clinic&lt;','&gt;Lernen Sie unsere Klinik kennen&lt;'],
// treatments intro
['<span class="kur-badge">A New You</span>','<span class="kur-badge">Ein neues Ich</span>'],
['<h2>Our Treatments</h2>','<h2>Unsere Behandlungen</h2>'],
['&lt;h2&gt;Our Treatments&lt;/h2&gt;','&lt;h2&gt;Unsere Behandlungen&lt;/h2&gt;'],
['Digital dentistry and master laboratory artistry.','Digitale Zahnmedizin und meisterhafte Laborkunst.'],
['<b>Filter tabs:</b> All ·','<b>Filter-Tabs:</b> Alle ·'],
['View details →','Details ansehen →'],
// doctors
['<span class="kur-badge">The Team Behind Your Smile</span>','<span class="kur-badge">Das Team hinter Ihrem Lächeln</span>'],
['<h2>Our Distinguished Clinical Team</h2>','<h2>Unser ausgezeichnetes Behandlungsteam</h2>'],
['&lt;h2&gt;Our Distinguished Clinical Team&lt;/h2&gt;','&lt;h2&gt;Unser ausgezeichnetes Behandlungsteam&lt;/h2&gt;'],
['<p>Cosmetic Dentist</p>','<p>Zahnarzt für ästhetische Zahnmedizin</p>'],
['<p>Specialist Orthodontist</p>','<p>Fachzahnärztin für Kieferorthopädie</p>'],
['<p>Specialist Oral &amp; Maxillofacial Surgeon</p>','<p>Facharzt für Mund-, Kiefer- und Gesichtschirurgie</p>'],
['<p>Dentist</p>','<p>Zahnarzt / Zahnärztin</p>'],
['Dr Yasin Gökcegözoğlu','Dr. Yasin Gökcegözoğlu'],
['Dr Cemile Uysal','Dr. Cemile Uysal'],
['Dr Arda Öztan','Dr. Arda Öztan'],
['Dr Kadir Can Sakur','Dr. Kadir Can Sakur'],
['Dr İhsan Erik','Dr. İhsan Erik'],
['Dr Zeynep Nas','Dr. Zeynep Nas'],
['View All Doctors →','Alle Zahnärztinnen und Zahnärzte ansehen →'],
['&gt;View All Doctors&lt;','&gt;Alle Zahnärztinnen und Zahnärzte ansehen&lt;'],
['— Cosmetic Dentist&lt;','— Zahnarzt für ästhetische Zahnmedizin&lt;'],
['— Specialist Orthodontist&lt;','— Fachzahnärztin für Kieferorthopädie&lt;'],
['— Specialist Oral &amp;amp; Maxillofacial Surgeon&lt;','— Facharzt für Mund-, Kiefer- und Gesichtschirurgie&lt;'],
['— Dentist&lt;','— Zahnarzt / Zahnärztin&lt;'],
// scheduler
['<span class="kur-badge">Free Online Consultation</span>','<span class="kur-badge">Kostenlose Online-Beratung</span>'],
['<h2>Plan Your Appointment</h2>','<h2>Planen Sie Ihren Termin</h2>'],
['&lt;h2&gt;Plan Your Appointment&lt;/h2&gt;','&lt;h2&gt;Planen Sie Ihren Termin&lt;/h2&gt;'],
['Choose a date and time that suits you for a one-to-one consultation with our specialist clinical team.','Wählen Sie Datum und Uhrzeit, die Ihnen passen — für ein persönliches Gespräch mit unserem spezialisierten Behandlungsteam.'],
['alt="Dental consultation"','alt="Zahnärztliche Beratung"'],
['<h3>Book a One-to-One Consultation with a Specialist</h3>','<h3>Buchen Sie ein persönliches Gespräch mit einer Spezialistin oder einem Spezialisten</h3>'],
['&lt;strong&gt;Book a One-to-One Consultation with a Specialist&lt;/strong&gt;','&lt;strong&gt;Buchen Sie ein persönliches Gespräch mit einer Spezialistin oder einem Spezialisten&lt;/strong&gt;'],
["Speak directly with our specialists, weigh up your treatment options and build a plan that's yours alone — with no obligation whatsoever.","Sprechen Sie direkt mit unseren Spezialistinnen und Spezialisten, wägen Sie Ihre Behandlungsoptionen ab und bauen Sie einen Plan, der nur Ihnen gehört — völlig unverbindlich."],
['<b>Booking widget fields (the live scheduler is produced by WordPress):</b>','<b>Buchungs-Widget-Felder (den Live-Planer erzeugt WordPress):</b>'],
['Timezone: Europe/Istanbul (UTC+3) · Previous week / Next week navigation · “Choose a date” day picker · “Choose a time” slot picker ·','Zeitzone: Europe/Istanbul (UTC+3) · Navigation Vorige Woche / Nächste Woche · Tagwahl „Datum wählen“ · Slotwahl „Uhrzeit wählen“ ·'],
['Full name · Your concern (optional) · “Book Appointment” button.','Vor- und Nachname · Ihr Anliegen (optional) · Schaltfläche „Termin buchen“.'],
['Timezone: Europe/Istanbul (UTC+3); date and time pickers; full name; your concern (optional); “Book Appointment”.','Zeitzone: Europe/Istanbul (UTC+3); Datums- und Uhrzeitwahl; Vor- und Nachname; Ihr Anliegen (optional); „Termin buchen“.'],
// smile robot
['<span class="kur-badge">Smile Design Robot (CAD/CAM)</span>','<span class="kur-badge">Smile-Design-Roboter (CAD/CAM)</span>'],
['<h2>Robotic Precision in Digital Dentistry</h2>','<h2>Robotische Präzision in der digitalen Zahnmedizin</h2>'],
['&lt;h2&gt;Robotic Precision in Digital Dentistry&lt;/h2&gt;','&lt;h2&gt;Robotische Präzision in der digitalen Zahnmedizin&lt;/h2&gt;'],
['Millimetre-precise smile production with Exocad planning, laser scanning and 5-axis robotic milling.','Millimetergenaue Lächeln-Fertigung mit Exocad-Planung, Laserscan und 5-Achsen-Robotikfräsung.'],
['<b>CAD/CAM 3D Visual Planning</b> — Using Exocad® professional engineering algorithms and medical software, our head technicians design each ceramic tooth to match the golden-ratio parameters of your facial line.','<b>CAD/CAM-3D-Planung</b> — Mit den professionellen Engineering-Algorithmen und der Medizinsoftware von Exocad® entwerfen unsere Cheftechniker jeden Keramikzahn passend zu den Goldener-Schnitt-Parametern Ihrer Gesichtslinie.'],
["<b>Comfortable Laser Intraoral Scanning</b> — We've binned the traditional putty-like silicone impression trays. A high-speed laser camera captures 3,000 reference points every second, scanning your smile in full-colour 3D.","<b>Komfortabler Laser-Intraoralscan</b> — Die klassischen knetartigen Silikon-Abformlöffel haben wir aussortiert. Eine Hochgeschwindigkeits-Laserkamera erfasst 3.000 Referenzpunkte pro Sekunde und scannt Ihr Lächeln in vollfarbigem 3D."],
['<b>5-Axis Robotic Ceramic Milling</b> — Our in-house robotic milling units machine each crown from solid monobloc German zirconia blocks, delivering flawless light transmission for harmony with the gums and natural enamel.','<b>5-Achsen-Robotik-Keramikfräsung</b> — Unsere hauseigenen Robotik-Fräseinheiten arbeiten jede Krone aus massiven deutschen Monoblock-Zirkonrohlingen — für makellosen Lichtdurchlass in Harmonie mit Zahnfleisch und natürlichem Schmelz.'],
['&lt;li&gt;&lt;strong&gt;CAD/CAM 3D Visual Planning&lt;/strong&gt; — Using Exocad® professional engineering algorithms and medical software, our head technicians design each ceramic tooth to match the golden-ratio parameters of your facial line.&lt;/li&gt;','&lt;li&gt;&lt;strong&gt;CAD/CAM-3D-Planung&lt;/strong&gt; — Mit den professionellen Engineering-Algorithmen und der Medizinsoftware von Exocad® entwerfen unsere Cheftechniker jeden Keramikzahn passend zu den Goldener-Schnitt-Parametern Ihrer Gesichtslinie.&lt;/li&gt;'],
["&lt;li&gt;&lt;strong&gt;Comfortable Laser Intraoral Scanning&lt;/strong&gt; — We've binned the traditional putty-like silicone impression trays. A high-speed laser camera captures 3,000 reference points every second, scanning your smile in full-colour 3D.&lt;/li&gt;","&lt;li&gt;&lt;strong&gt;Komfortabler Laser-Intraoralscan&lt;/strong&gt; — Die klassischen knetartigen Silikon-Abformlöffel haben wir aussortiert. Eine Hochgeschwindigkeits-Laserkamera erfasst 3.000 Referenzpunkte pro Sekunde und scannt Ihr Lächeln in vollfarbigem 3D.&lt;/li&gt;"],
['&lt;li&gt;&lt;strong&gt;5-Axis Robotic Ceramic Milling&lt;/strong&gt; — Our in-house robotic milling units machine each crown from solid monobloc German zirconia blocks, delivering flawless light transmission for harmony with the gums and natural enamel.&lt;/li&gt;','&lt;li&gt;&lt;strong&gt;5-Achsen-Robotik-Keramikfräsung&lt;/strong&gt; — Unsere hauseigenen Robotik-Fräseinheiten arbeiten jede Krone aus massiven deutschen Monoblock-Zirkonrohlingen — für makellosen Lichtdurchlass in Harmonie mit Zahnfleisch und natürlichem Schmelz.&lt;/li&gt;'],
['alt="Robotic precision in digital dentistry"','alt="Robotische Präzision in der digitalen Zahnmedizin"'],
// treatment guide
['<span class="kur-badge">Treatment Guide</span>','<span class="kur-badge">Behandlungswegweiser</span>'],
["<h2>Let's Improve Your Quality of Life Together</h2>","<h2>Verbessern wir Ihre Lebensqualität gemeinsam</h2>"],
["&lt;h2&gt;Let's Improve Your Quality of Life Together&lt;/h2&gt;","&lt;h2&gt;Verbessern wir Ihre Lebensqualität gemeinsam&lt;/h2&gt;"],
["Choose the concern affecting your daily life, and let's explore the treatment options that might suit you — together.","Wählen Sie das Anliegen, das Ihren Alltag betrifft — und sehen wir uns gemeinsam die Behandlungsoptionen an, die zu Ihnen passen könnten."],
["<b>Concern cards:</b> I'm Missing a Tooth · I'm Not Happy with My Smile · I Snore · My Tooth Hurts · I Have Bad Breath · I've Broken a Tooth · Cosmetic Dentistry · I Have Gum Problems","<b>Anliegen-Karten:</b> Mir fehlt ein Zahn · Ich bin mit meinem Lächeln unzufrieden · Ich schnarche · Mein Zahn schmerzt · Ich habe Mundgeruch · Mir ist ein Zahn abgebrochen · Ästhetische Zahnmedizin · Ich habe Zahnfleischprobleme"],
['<h3>Treatments that may suit you — panels per concern</h3>','<h3>Behandlungen, die zu Ihnen passen könnten — Panels je Anliegen</h3>'],
["<b>Treatment Options for a Missing Tooth</b> — Let's look at implant and bridge options for your missing teeth together. Related:","<b>Behandlungsoptionen beim fehlenden Zahn</b> — Sehen wir uns Implantat- und Brückenoptionen für Ihre fehlenden Zähne gemeinsam an. Verwandt:"],
["<b>Treatment Options if You're Not Happy with Your Smile</b> — Explore cosmetic solutions with smile design, veneers and zirconia. Related:","<b>Behandlungsoptionen bei Unzufriedenheit mit dem Lächeln</b> — Entdecken Sie ästhetische Lösungen mit Smile Design, Veneers und Zirkon. Verwandt:"],
['<b>Treatment Options for Snoring</b> — Dentist-led assessment and treatment options for your snoring. Related:','<b>Behandlungsoptionen beim Schnarchen</b> — Zahnärztlich geführte Beurteilung und Behandlungsoptionen für Ihr Schnarchen. Verwandt:'],
['<b>Treatment Options for Toothache</b> — Look into fillings, root canal treatment and clenching care for the conditions behind the pain. Related:','<b>Behandlungsoptionen bei Zahnschmerzen</b> — Füllungen, Wurzelbehandlung und die Versorgung des Pressens für die Ursachen hinter dem Schmerz. Verwandt:'],
["<b>Treatment Options for Bad Breath</b> — Learn about the causes of bad breath and how it's treated. Related:","<b>Behandlungsoptionen bei Mundgeruch</b> — Erfahren Sie die Ursachen des Mundgeruchs und wie er behandelt wird. Verwandt:"],
['<b>Treatment Options for a Broken Tooth</b> — Implant, zirconia and inlay/onlay filling options for broken teeth. Related:','<b>Behandlungsoptionen beim abgebrochenen Zahn</b> — Implantat-, Zirkon- und Inlay/Onlay-Optionen für abgebrochene Zähne. Verwandt:'],
['<b>Treatment Options for Cosmetic Dentistry</b> — Options for a cosmetic transformation with veneers, smile design and whitening. Related:','<b>Behandlungsoptionen der ästhetischen Zahnmedizin</b> — Optionen für die ästhetische Verwandlung mit Veneers, Smile Design und Bleaching. Verwandt:'],
['<b>Treatment Options for Gum Problems</b> — A healthy gum line with gum aesthetics and a scale and polish. Related:','<b>Behandlungsoptionen bei Zahnfleischproblemen</b> — Ein gesunder Zahnfleischverlauf mit Zahnfleischästhetik und professioneller Zahnreinigung. Verwandt:'],
['>Same-Day Implants</a>','>Sofortimplantate</a>'],
['>All-on-4 Implants</a>','>All-on-4-Implantate</a>'],
['>Crown &amp; Bridge</a>','>Kronen &amp; Brücken</a>'],
['>Veneers</a>','>Veneers</a>'],
['>Zirconia</a>','>Zirkon</a>'],
['>Snoring Treatment</a>','>Schnarchbehandlung</a>'],
['>Fillings</a>','>Füllungen</a>'],
['>Root Canal</a>','>Wurzelbehandlung</a>'],
['>I Clench My Teeth</a>','>Ich presse die Zähne zusammen</a>'],
['>Bad Breath</a>','>Mundgeruch</a>'],
['>Inlay/Onlay Fillings</a>','>Inlays/Onlays</a>'],
['>Teeth Whitening</a>','>Bleaching</a>'],
['>Gum Aesthetics</a>','>Zahnfleischästhetik</a>'],
['>Scale and Polish</a>','>Professionelle Zahnreinigung</a>'],
['<em>Every treatment starts with the right assessment and a personalised plan.</em>','<em>Jede Behandlung beginnt mit der richtigen Beurteilung und einem persönlichen Plan.</em>'],
// stories
['<span class="kur-badge">Real Patient Stories</span>','<span class="kur-badge">Echte Patientengeschichten</span>'],
['<h2>Inspiring Transformation Stories</h2>','<h2>Inspirierende Verwandlungsgeschichten</h2>'],
['&lt;h2&gt;Inspiring Transformation Stories&lt;/h2&gt;','&lt;h2&gt;Inspirierende Verwandlungsgeschichten&lt;/h2&gt;'],
['Smile transformations that rebuild confidence.','Lächeln-Verwandlungen, die Selbstvertrauen zurückbauen.'],
["Elif's Transformation Story","Elifs Verwandlungsgeschichte"],
["Murat's Transformation Story","Murats Verwandlungsgeschichte"],
["Zeynep's Transformation Story","Zeyneps Verwandlungsgeschichte"],
["Emre's Transformation Story","Emres Verwandlungsgeschichte"],
['<p><b>Veneers · Smile Design</b></p>','<p><b>Veneers · Smile Design</b></p>'],
['<p><b>Implant</b></p>','<p><b>Implantat</b></p>'],
['<p><b>Zirconia</b></p>','<p><b>Zirkon</b></p>'],
['<p><b>Teeth Whitening</b></p>','<p><b>Bleaching</b></p>'],
['Elif came to our clinic not with a specific complaint, but to find out whether her smile could be given a more balanced, natural look. Our assessment considered the shape and colour of her teeth and her smile line…','Elif kam nicht mit einer konkreten Beschwerde in unsere Klinik, sondern um herauszufinden, ob sich ihrem Lächeln ein ausgewogeneres, natürlicheres Bild geben lässt. Unsere Beurteilung betrachtete Zahnform, Farbe und Lachlinie…'],
["Murat came to us with the gap left by a molar he'd lost years earlier. His first priority wasn't appearance — it was being able to chew comfortably. Our assessment looked beyond the missing tooth itself, at his chewing balance and the neighbouring teeth…","Murat kam mit der Lücke eines vor Jahren verlorenen Backenzahns zu uns. Seine erste Priorität war nicht das Aussehen — sondern wieder bequem kauen zu können. Unsere Beurteilung blickte über den fehlenden Zahn hinaus auf Kaubalance und Nachbarzähne…"],
['Zeynep came to us with old crowns, fitted years earlier, that had discoloured over time. She felt her smile looked tired — yet the last thing she wanted was an overly white, uniform result that gives that “obviously done” impression…','Zeynep kam mit alten, vor Jahren eingesetzten Kronen zu uns, die sich mit der Zeit verfärbt hatten. Ihr Lächeln wirkte auf sie müde — und doch war das Letzte, was sie wollte, ein überweißes, uniformes Ergebnis mit diesem „offensichtlich gemacht“-Eindruck…'],
["Emre came to us with the staining left on his teeth by the coffee habit that had grown alongside a demanding job. His teeth were healthy; what he wanted wasn't a sweeping change, but for his smile to get its old brightness back.","Emre kam mit den Verfärbungen zu uns, die die mit einem fordernden Job gewachsene Kaffeegewohnheit auf seinen Zähnen hinterlassen hatte. Seine Zähne waren gesund; er wollte keine große Veränderung — sondern seinem Lächeln seine alte Helligkeit zurückgeben."],
['Read the story →','Geschichte lesen →'],
['View All Patient Stories →','Alle Patientengeschichten ansehen →'],
['&gt;View All Patient Stories&lt;','&gt;Alle Patientengeschichten ansehen&lt;'],
// how it works
['<h2>The Treatment Process</h2>','<h2>Der Behandlungsablauf</h2>'],
['&lt;h2&gt;The Treatment Process&lt;/h2&gt;','&lt;h2&gt;Der Behandlungsablauf&lt;/h2&gt;'],
["<b>1. Send Your Photos</b> — Send us your photos and we'll carry out a pre-assessment.","<b>1. Senden Sie Ihre Fotos</b> — Schicken Sie uns Ihre Fotos, und wir führen eine Voranalyse durch."],
['<b>2. Online Consultation</b> — Our specialists get in touch and talk you through your options.','<b>2. Online-Beratung</b> — Unsere Spezialistinnen und Spezialisten melden sich und gehen Ihre Optionen mit Ihnen durch.'],
["<b>3. A Personalised Plan</b> — A treatment plan is drawn up around what suits you best.","<b>3. Ein persönlicher Plan</b> — Der Behandlungsplan entsteht um das, was am besten zu Ihnen passt."],
['<b>4. Treatment</b> — Your planned treatment is carried out in comfort.','<b>4. Behandlung</b> — Ihre geplante Behandlung wird komfortabel durchgeführt.'],
["<b>5. Your New Smile</b> — Enjoy the smile you've been dreaming of.","<b>5. Ihr neues Lächeln</b> — Genießen Sie das Lächeln, von dem Sie geträumt haben."],
["&lt;li&gt;&lt;strong&gt;1. Send Your Photos&lt;/strong&gt; — Send us your photos and we'll carry out a pre-assessment.&lt;/li&gt;","&lt;li&gt;&lt;strong&gt;1. Senden Sie Ihre Fotos&lt;/strong&gt; — Schicken Sie uns Ihre Fotos, und wir führen eine Voranalyse durch.&lt;/li&gt;"],
['&lt;li&gt;&lt;strong&gt;2. Online Consultation&lt;/strong&gt; — Our specialists get in touch and talk you through your options.&lt;/li&gt;','&lt;li&gt;&lt;strong&gt;2. Online-Beratung&lt;/strong&gt; — Unsere Spezialistinnen und Spezialisten melden sich und gehen Ihre Optionen mit Ihnen durch.&lt;/li&gt;'],
["&lt;li&gt;&lt;strong&gt;3. A Personalised Plan&lt;/strong&gt; — A treatment plan is drawn up around what suits you best.&lt;/li&gt;","&lt;li&gt;&lt;strong&gt;3. Ein persönlicher Plan&lt;/strong&gt; — Der Behandlungsplan entsteht um das, was am besten zu Ihnen passt.&lt;/li&gt;"],
['&lt;li&gt;&lt;strong&gt;4. Treatment&lt;/strong&gt; — Your planned treatment is carried out in comfort.&lt;/li&gt;','&lt;li&gt;&lt;strong&gt;4. Behandlung&lt;/strong&gt; — Ihre geplante Behandlung wird komfortabel durchgeführt.&lt;/li&gt;'],
["&lt;li&gt;&lt;strong&gt;5. Your New Smile&lt;/strong&gt; — Enjoy the smile you've been dreaming of.&lt;/li&gt;","&lt;li&gt;&lt;strong&gt;5. Ihr neues Lächeln&lt;/strong&gt; — Genießen Sie das Lächeln, von dem Sie geträumt haben.&lt;/li&gt;"],
['<b>Take the first step!</b> <a href="#treatment-journey-widget">Send a Photo</a>','<b>Machen Sie den ersten Schritt!</b> <a href="#treatment-journey-widget">Foto senden</a>'],
['&lt;strong&gt;Take the first step!&lt;/strong&gt; Send a Photo.','&lt;strong&gt;Machen Sie den ersten Schritt!&lt;/strong&gt; Foto senden.'],
// faq
['<span class="kur-badge">Knowledge Bank &amp; Guides</span>','<span class="kur-badge">Wissensbank &amp; Ratgeber</span>'],
['<h2>Frequently Asked Questions</h2>','<h2>Häufig gestellte Fragen</h2>'],
['&lt;h2&gt;Frequently Asked Questions&lt;/h2&gt;','&lt;h2&gt;Häufig gestellte Fragen&lt;/h2&gt;'],
['Everything about health tourism, travel and treatments.','Alles rund um Gesundheitstourismus, Anreise und Behandlungen.'],
['How many days does smile design treatment take in total?','Wie viele Tage dauert die Smile-Design-Behandlung insgesamt?'],
['Smile design usually takes just 5 to 6 days. On the first day, digital intraoral scans and a try-in of the restoration are carried out. Within 2–3 days your porcelain or zirconia crowns are produced in our laboratory, and on day 5 the final comfortable try-in and bonding are completed.','Das Smile Design dauert meist nur 5 bis 6 Tage. Am ersten Tag werden digitale Intraoralscans und eine Anprobe der Versorgung durchgeführt. Binnen 2–3 Tagen entstehen Ihre Keramik- oder Zirkonkronen in unserem Labor, und am 5. Tag folgen die finale, komfortable Einprobe und das Einsetzen.'],
['How can I get a free treatment plan without visiting the clinic?','Wie bekomme ich einen kostenlosen Behandlungsplan ohne Klinikbesuch?'],
['Use the X-ray and photo upload area on our homepage to send us your panoramic X-ray or clear photos of your smile taken on a phone. Our lead clinicians prepare a personalised quotation within 24 hours.','Nutzen Sie den Upload-Bereich für Röntgenbilder und Fotos auf unserer Startseite und senden Sie uns Ihre Panoramaaufnahme oder klare Handyfotos Ihres Lächelns. Unsere leitenden Zahnärztinnen und Zahnärzte erstellen binnen 24 Stunden ein persönliches Angebot.'],
['Are flights, a 5-star hotel and VIP transfers included in the treatment package?','Sind Flüge, ein 5-Sterne-Hotel und VIP-Transfers im Behandlungspaket enthalten?'],
['Yes! For all our international patients above a certain treatment threshold, luxury accommodation in a 5-star hotel, an airport welcome and VIP Mercedes transfers between the hotel and the clinic are provided with our compliments.','Ja! Für alle internationalen Patientinnen und Patienten oberhalb eines bestimmten Behandlungswerts sind die luxuriöse Unterbringung im 5-Sterne-Hotel, der Empfang am Flughafen und VIP-Mercedes-Transfers zwischen Hotel und Klinik unser Geschenk.'],
['What does the lifetime warranty cover if a crown fractures?','Wie greift die lebenslange Garantie, wenn eine Krone bricht?'],
['All Straumann titanium implants placed at our clinic carry a lifetime warranty certificate that is valid worldwide. Our zirconia and porcelain crowns are covered by a 7-year clinical warranty.','Alle in unserer Klinik gesetzten Straumann-Titanimplantate tragen ein weltweit gültiges lebenslanges Garantiezertifikat. Unsere Zirkon- und Keramikkronen sind durch eine 7-jährige Klinikgarantie abgedeckt.'],
['Is treatment painful? Will I need sedation or anaesthesia?','Ist die Behandlung schmerzhaft? Brauche ich Sedierung oder Narkose?'],
["Because every procedure is carried out under local anaesthetic, you won't feel pain during treatment. For patients who feel anxious about treatment, laughing-gas sedation is also offered at no extra charge.","Weil jeder Eingriff unter örtlicher Betäubung stattfindet, spüren Sie während der Behandlung keinen Schmerz. Für Patientinnen und Patienten mit Behandlungsangst steht zudem die Lachgas-Sedierung ohne Aufpreis bereit."],
['Clinic-approved information · Topic: Treatments','Klinisch geprüfte Information · Thema: Behandlungen'],
['Clinic-approved information · Topic: Travel','Klinisch geprüfte Information · Thema: Anreise'],
['Clinic-approved information · Topic: General','Klinisch geprüfte Information · Thema: Allgemein'],
['All Questions →','Alle Fragen →'],
['&gt;All Questions&lt;','&gt;Alle Fragen&lt;'],
['Got a different question about travelling for treatment? <a href="#treatment-journey-widget">Get a Free Assessment from Our Dentist</a>','Haben Sie eine andere Frage zur Behandlungsreise? <a href="#treatment-journey-widget">Kostenlose Einschätzung von unseren Zahnärztinnen und Zahnärzten</a>'],
['Got a different question about travelling for treatment? Get a Free Assessment from Our Dentist.','Haben Sie eine andere Frage zur Behandlungsreise? Kostenlose Einschätzung von unseren Zahnärztinnen und Zahnärzten.'],
// blog section
['<span class="kur-badge">Smile Guide</span>','<span class="kur-badge">Lächeln-Ratgeber</span>'],
['<h2>Latest From the Blog</h2>','<h2>Das Neueste aus dem Blog</h2>'],
['&lt;h2&gt;Latest From the Blog&lt;/h2&gt;','&lt;h2&gt;Das Neueste aus dem Blog&lt;/h2&gt;'],
['Expert guides on implants, smile design and digital dentistry.','Fachratgeber zu Implantaten, Smile Design und digitaler Zahnmedizin.'],
['Read the article →','Artikel lesen →'],
['View All Articles →','Alle Artikel ansehen →'],
['&gt;View All Articles&lt;','&gt;Alle Artikel ansehen&lt;'],
['8 min read · Blog','8 Min. Lesezeit · Blog'],
['9 min read · Blog','9 Min. Lesezeit · Blog'],
// pre-footer
['<span class="kur-badge">Your journey starts here</span>','<span class="kur-badge">Ihre Reise beginnt hier</span>'],
["<h2>Let's Reach Your Dream Smile Together</h2>","<h2>Erreichen wir Ihr Traumlächeln gemeinsam</h2>"],
["&lt;h2&gt;Let's Reach Your Dream Smile Together&lt;/h2&gt;","&lt;h2&gt;Erreichen wir Ihr Traumlächeln gemeinsam&lt;/h2&gt;"],
['<p>Is something on your mind?</p>','<p>Geht Ihnen etwas durch den Kopf?</p>'],
['<p><b>Book Your Free Online Consultation</b> — button: “Arrange My Appointment” (opens the appointment window).</p>','<p><b>Buchen Sie Ihre kostenlose Online-Beratung</b> — Schaltfläche: „Meinen Termin vereinbaren“ (öffnet das Terminfenster).</p>'],
['Is something on your mind? &lt;strong&gt;Book Your Free Online Consultation&lt;/strong&gt; — “Arrange My Appointment”.','Geht Ihnen etwas durch den Kopf? &lt;strong&gt;Buchen Sie Ihre kostenlose Online-Beratung&lt;/strong&gt; — „Meinen Termin vereinbaren“.'],
// paste chrome + foot
['<h2>📋 Import to WordPress</h2>','<h2>📋 In WordPress übernehmen</h2>'],
['Paste the HTML below into the corresponding WordPress page as a <b>Custom HTML</b> block.','Fügen Sie das HTML unten als <b>Custom-HTML</b>-Block in die entsprechende WordPress-Seite ein.'],
['Links inside it already use the <b>/en/…</b> URL scheme.','Die Links darin verwenden bereits das <b>/de/…</b>-URL-Schema.'],
['<span class="lab">Page HTML (body)</span>','<span class="lab">Seiten-HTML (Body)</span>'],
["this.textContent='Copied ✓';var b=this;setTimeout(function(){b.textContent='Copy'},1600)\">Copy</button>","this.textContent='Kopiert ✓';var b=this;setTimeout(function(){b.textContent='Kopieren'},1600)\">Kopieren</button>"],
['<span>Smile Group · EN corporate page preview — internal use.</span>','<span>Smile Group · DE-Unternehmensseiten-Vorschau — interner Gebrauch.</span>'],
['<span><a href="../index.html">← All content</a></span>','<span><a href="../index.html">← Alle Inhalte</a></span>'],
];
for (const [a, b] of D) rep(a, b, false);

/* ---- 7) /en/ -> /de/ (textarea linkleri) ---- */
s = s.split('href="/en/').join('href="/de/');

/* ---- 8) yaz + kalinti taramasi ---- */
fs.writeFileSync(path.join(ROOT, 'kurumsal', 'anasayfa.html'), s);
const kalinti = [];
const enDesen = /\b(the|and|your|with|our|treatment(?!-journey)|smile design is|this page|we)\b/gi;
for (const [i, satir] of s.split('\n').entries()) {
  if (/tr-orig|TR-Original|TR:/.test(satir)) continue;
  if (/(Slide 1|Europe\/Istanbul|Exocad|All-on|CAD\/CAM|CRM|VIP|CTA)/.test(satir) && !enDesen.test(satir)) continue;
  const m = satir.match(/\b(the|and with|your smile|our clinic|This page|is one of|are carried out|you can|we bring)\b/);
  if (m) kalinti.push((i + 1) + ': ' + satir.trim().slice(0, 110));
}
console.log('sorun: ' + sorunlar.length);
sorunlar.forEach(x => console.log('  - ' + x));
console.log('EN kalinti adayi satir: ' + kalinti.length);
kalinti.slice(0, 40).forEach(x => console.log('  ? ' + x));
