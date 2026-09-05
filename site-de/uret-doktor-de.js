/* site-en/doktor/*.html -> site-de/doktor/*.html (6 hekim)
 * Sıra önemli: dosyaya özel uzun çiftler -> ortak uzun çiftler -> genel kısa değişimler. */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const ENDIR = path.join(ROOT, '..', 'site-en', 'doktor');
const DEDIR = path.join(ROOT, 'doktor');
if (!fs.existsSync(DEDIR)) fs.mkdirSync(DEDIR, { recursive: true });

const ORTAK = [
// biyografi/başlık ortakları
['Home  ›  Our Doctors  ›','Startseite  ›  Unsere Zahnärztinnen und Zahnärzte  ›'],
['TR original:','TR-Original:'],
['View Biography','Biografie ansehen'],
['Book an Appointment','Termin vereinbaren'],
['View Profile','Profil ansehen'],
['About Dr','Über Dr'],
['Academic Education &amp; Degrees','Akademische Ausbildung &amp; Abschlüsse'],
['Academic Education and Degrees','Akademische Ausbildung und Abschlüsse'],
['Clinical Areas of Expertise','Klinische Schwerpunkte'],
['<li>Digital Dentistry</li>','<li>Digitale Zahnmedizin</li>'],
['<li>Cosmetic Dentistry</li>','<li>Ästhetische Zahnmedizin</li>'],
['<li>Restorative Treatments</li>','<li>Restaurative Behandlungen</li>'],
['<li>Orthodontics</li>','<li>Kieferorthopädie</li>'],
['<li>Clear Aligner Treatments</li>','<li>Aligner-Behandlungen</li>'],
['<li>Jaw and Bite Disorders</li>','<li>Kiefer- und Bissfehlstellungen</li>'],
['<li>Braces Treatments</li>','<li>Zahnspangen-Behandlungen</li>'],
['<li>Implants</li>','<li>Implantate</li>'],
['<li>Sinus Lift</li>','<li>Sinuslift</li>'],
['<li>Digital Surgical Planning</li>','<li>Digitale OP-Planung</li>'],
['<li>Zirconia</li>','<li>Zirkonkronen</li>'],
['<li>Porcelain Veneers</li>','<li>Keramik-Veneers</li>'],
['<li>Cosmetic Fillings</li>','<li>Ästhetische Füllungen</li>'],
// mutlu gülüşler
['Happy Patient Smiles','Glückliche Patientenlächeln'],
['Because of patient confidentiality within Turkey, the images shown here are blurred. Fill in the form to see detailed results.','Wegen der Patientenvertraulichkeit innerhalb der Türkei werden die Bilder hier unscharf gezeigt. Füllen Sie das Formular aus, um detaillierte Ergebnisse zu sehen.'],
["Elif's Transformation Story","Elifs Verwandlungsgeschichte"],
["Murat's Transformation Story","Murats Verwandlungsgeschichte"],
["Zeynep's Transformation Story","Zeyneps Verwandlungsgeschichte"],
["Emre's Transformation Story","Emres Verwandlungsgeschichte"],
['Fill In the Form to See Smile Results','Formular ausfüllen und Lächeln-Ergebnisse sehen'],
// yorumlar
['What Our Patients Say','Was unsere Patientinnen und Patienten sagen'],
['<b>Google rating: 4.8</b> (5 reviews) ·','<b>Google-Bewertung: 4,8</b> (5 Bewertungen) ·'],
['Google rating: 4.8 (5 reviews) —','Google-Bewertung: 4,8 (5 Bewertungen) —'],
['Read All Reviews','Alle Bewertungen lesen'],
['My experience with the Smilegroup team was excellent. My Hollywood Smile treatment turned out exactly as I wanted — thank you so much.','Meine Erfahrung mit dem Smilegroup-Team war ausgezeichnet. Meine Hollywood-Smile-Behandlung wurde genau so, wie ich es wollte — vielen Dank.'],
['I came from Germany for my All-on-4 implant treatment. Thanks to digital anaesthesia I felt almost no pain, and the result is wonderful.','Für meine All-on-4-Implantatbehandlung bin ich aus Deutschland gekommen. Dank der digitalen Anästhesie habe ich fast keinen Schmerz gespürt, und das Ergebnis ist wunderbar.'],
['My veneer treatment was completed in four days. The team were attentive and professional — I would recommend them.','Meine Veneer-Behandlung war in vier Tagen abgeschlossen. Das Team war aufmerksam und professionell — ich empfehle es weiter.'],
['I was monitored remotely for six months during my Invisalign treatment and had no problems at any point. My smile has completely changed.','Während meiner Invisalign-Behandlung wurde ich sechs Monate aus der Ferne begleitet und hatte zu keinem Zeitpunkt Probleme. Mein Lächeln hat sich komplett verändert.'],
['The clinic is very clean and modern, and the staff are extremely friendly. My treatment plan was explained in detail from start to finish.','Die Klinik ist sehr sauber und modern, das Personal äußerst freundlich. Mein Behandlungsplan wurde von Anfang bis Ende ausführlich erklärt.'],
['(5 stars, ','(5 Sterne, '],
['(4 stars, ','(4 Sterne, '],
['2 weeks ago','vor 2 Wochen'],
['3 weeks ago','vor 3 Wochen'],
['1 month ago','vor 1 Monat'],
['2 months ago','vor 2 Monaten'],
['5 days ago','vor 5 Tagen'],
// randevu
['Plan Your Appointment','Planen Sie Ihren Termin'],
['<b>ONLINE CONSULTATION</b> — Choose a date and time that suits you for a one-to-one consultation with our specialist team.','<b>ONLINE-BERATUNG</b> — Wählen Sie Datum und Uhrzeit, die Ihnen passen, für ein persönliches Gespräch mit unserem Spezialistenteam.'],
['Book a One-to-One Consultation with a Specialist Dentist','Buchen Sie ein persönliches Gespräch mit einer Zahnärztin oder einem Zahnarzt'],
['Speak directly with our specialists, weigh up your treatment options and build a plan tailored to you — with no obligation.','Sprechen Sie direkt mit unseren Spezialistinnen und Spezialisten, wägen Sie Ihre Behandlungsoptionen ab und bauen Sie einen auf Sie zugeschnittenen Plan — ganz unverbindlich.'],
['<b>Booking widget fields (the live scheduler is produced by WordPress):</b> date picker (Choose a date · Choose a time · Previous week / Next week), Full Name, Your Concern (optional), “Book an Appointment” button. Time zone: Europe/Istanbul (UTC+3).','<b>Buchungs-Widget-Felder (den Live-Planer erzeugt WordPress):</b> Datumswahl (Datum wählen · Uhrzeit wählen · Vorige Woche / Nächste Woche), Vor- und Nachname, Ihr Anliegen (optional), Schaltfläche „Termin buchen“. Zeitzone: Europe/Istanbul (UTC+3).'],
['<p><strong>Online consultation:</strong> choose a date and time that suits you for a one-to-one consultation with our specialist team.</p>','<p><strong>Online-Beratung:</strong> Wählen Sie Datum und Uhrzeit, die Ihnen passen, für ein persönliches Gespräch mit unserem Spezialistenteam.</p>'],
['<p>Book a one-to-one consultation with a specialist dentist. Speak directly with our specialists, weigh up your treatment options and build a plan tailored to you — with no obligation. Time zone: Europe/Istanbul (UTC+3).</p>','<p>Buchen Sie ein persönliches Gespräch mit einer Zahnärztin oder einem Zahnarzt. Sprechen Sie direkt mit unseren Spezialistinnen und Spezialisten, wägen Sie Ihre Behandlungsoptionen ab und bauen Sie einen auf Sie zugeschnittenen Plan — ganz unverbindlich. Zeitzone: Europe/Istanbul (UTC+3).</p>'],
['<!-- The live booking widget (calendar, time slots, Full Name and Your Concern fields, "Book an Appointment" button) is produced by the WordPress theme. -->','<!-- Das Live-Buchungs-Widget (Kalender, Zeitfenster, Felder Vor- und Nachname / Ihr Anliegen, Schaltfläche „Termin buchen“) erzeugt das WordPress-Theme. -->'],
// ekip
['Our Distinguished Clinical Team','Unser ausgezeichnetes Behandlungsteam'],
['<b>WORLD-CLASS SPECIALISTS</b>','<b>SPEZIALISTEN VON WELTKLASSE</b>'],
['World-class specialists:','Spezialisten von Weltklasse:'],
['View All Doctors →','Alle Zahnärztinnen und Zahnärzte ansehen →'],
['View All Doctors','Alle Zahnärztinnen und Zahnärzte ansehen'],
['— Cosmetic Dentist','— Zahnarzt für ästhetische Zahnmedizin'],
['— Specialist Orthodontist','— Fachzahnärztin für Kieferorthopädie'],
['— Oral &amp; Maxillofacial Surgeon','— Mund-, Kiefer- und Gesichtschirurg'],
['Dr Kadir Can Sakur</a> — Dentist','Dr Kadir Can Sakur</a> — Zahnarzt'],
['Dr İhsan Erik</a> — Dentist','Dr İhsan Erik</a> — Zahnarzt'],
['Dr Zeynep Nas</a> — Dentist','Dr Zeynep Nas</a> — Zahnärztin'],
// krom
['<html lang="en">','<html lang="de">'],
['<span class="sub">Aesthetic &amp; Dental Clinic</span>','<span class="sub">Klinik für Zahnmedizin &amp; Ästhetik</span>'],
['Corporate page · <b>EN edition</b>','Unternehmensseite · <b>DE-Ausgabe</b>'],
['<h2>📋 Import to WordPress</h2>','<h2>📋 In WordPress übernehmen</h2>'],
['Paste the HTML below into the corresponding WordPress page as a <b>Custom HTML</b> block.','Fügen Sie das HTML unten als <b>Custom-HTML</b>-Block in die entsprechende WordPress-Seite ein.'],
['Links inside it already use the <b>/en/…</b> URL scheme.','Die Links darin verwenden bereits das <b>/de/…</b>-URL-Schema.'],
['<span class="lab">Page HTML (body)</span>','<span class="lab">Seiten-HTML (Body)</span>'],
["this.textContent='Copied ✓';var b=this;setTimeout(function(){b.textContent='Copy'},1600)\">Copy</button>","this.textContent='Kopiert ✓';var b=this;setTimeout(function(){b.textContent='Kopieren'},1600)\">Kopieren</button>"],
['<span>Smile Group · EN corporate page preview — internal use.</span>','<span>Smile Group · DE-Unternehmensseiten-Vorschau — interner Gebrauch.</span>'],
['<span><a href="../index.html">← All content</a></span>','<span><a href="../index.html">← Alle Inhalte</a></span>'],
// adlar (en sona yakın; biyografiler zaten çevrildi)
['Dr Yasin','Dr. Yasin'],
['Dr Cemile','Dr. Cemile'],
['Dr Arda','Dr. Arda'],
['Dr Kadir','Dr. Kadir'],
['Dr İhsan','Dr. İhsan'],
['Dr Zeynep','Dr. Zeynep'],
['Dr Uysal','Dr. Uysal'],
['Dr Öztan','Dr. Öztan'],
['Dr Sakur','Dr. Sakur'],
['Dr Erik','Dr. Erik'],
['Dr Nas','Dr. Nas'],
];

const DOSYA = {
'dt-yasin-gokcegozoglu': {
  meta: 'Dr. Yasin Gökcegözoğlu, Zahnarzt für ästhetische Zahnmedizin bei der Smile Group. Absolvent der Erciyes-Universität mit deutschem Master in Zahnmedizin und Ästhetik.',
  ozel: [
    ['<b>Cosmetic Dentist · 20 Years of Clinical Experience</b>','<b>Zahnarzt für ästhetische Zahnmedizin · 20 Jahre klinische Erfahrung</b>'],
    ['<strong>Cosmetic Dentist · 20 Years of Clinical Experience</strong>','<strong>Zahnarzt für ästhetische Zahnmedizin · 20 Jahre klinische Erfahrung</strong>'],
    ["Born in Istanbul in 1990, Dr Yasin Gökcegözoğlu first set his heart on dentistry while at Cağaloğlu Anadolu High School, one of Istanbul's long-established schools, and crowned that ambition with a successful period of study at Erciyes University.","Der 1990 in Istanbul geborene Dr. Yasin Gökcegözoğlu fasste sein Herz für die Zahnmedizin schon am Cağaloğlu Anadolu Lisesi, einer der traditionsreichen Schulen Istanbuls — und krönte diesen Ehrgeiz mit einem erfolgreichen Studium an der Erciyes-Universität."],
    ['He has taken part in scientific work across many areas of dentistry, embracing what he sees as the true mission of the profession.','Er hat an wissenschaftlichen Arbeiten in vielen Bereichen der Zahnmedizin mitgewirkt — im Geist dessen, was er als die eigentliche Mission des Berufs versteht.'],
    ['Through the seminars he gives to hundreds of young people every year, he works to elevate the dental profession in Turkey — explaining what it truly means to feel like a clinician, and teaching hundreds of dentists that their first priority must always be health.','Mit den Seminaren, die er jedes Jahr vor Hunderten junger Menschen hält, arbeitet er daran, den zahnärztlichen Beruf in der Türkei zu heben — er erklärt, was es wirklich heißt, sich als Behandler zu fühlen, und vermittelt Hunderten Zahnärztinnen und Zahnärzten, dass die Gesundheit immer an erster Stelle stehen muss.'],
    ['In addition, he completed an MBA with the aim of building a professional structure — a healthcare facility that holds quality and prestige together — so that he can offer his patients an even better standard of care.','Zusätzlich hat er einen MBA abgeschlossen — mit dem Ziel, eine professionelle Struktur aufzubauen: eine Gesundheitseinrichtung, die Qualität und Ansehen zusammenhält, um seinen Patientinnen und Patienten einen noch besseren Versorgungsstandard zu bieten.'],
    ["He completed a master's programme in Germany in <strong>“International Master School General Dentistry and Aesthetics”</strong>, with the aim of serving his patients in the field of aesthetics. On a personal level, he has immersed himself in the history of philosophy, reading countless books on the subject and writing several essays of his own.","Um seine Patientinnen und Patienten im Feld der Ästhetik zu versorgen, absolvierte er in Deutschland das Masterprogramm <strong>„International Master School General Dentistry and Aesthetics“</strong>. Privat hat er sich in die Geschichte der Philosophie vertieft, unzählige Bücher dazu gelesen und mehrere eigene Essays geschrieben."],
    ['He is a member of the Aesthetic Dentistry Academy Association (EDAD) and the Computer Aided Dentistry Academy (CADA).','Er ist Mitglied der Akademie für Ästhetische Zahnmedizin (EDAD) und der Computer Aided Dentistry Academy (CADA).'],
    ['In both the clinical and the cosmetic care he provides, his aim is always to offer his patients the highest quality and the very best.','In der klinischen wie in der ästhetischen Versorgung ist sein Ziel stets, seinen Patientinnen und Patienten die höchste Qualität und das Beste zu bieten.'],
    ['Every patient who sits in his chair can feel at ease, entirely free of the question marks in their mind, and experience a comfortable course of treatment. Using the very latest technology, he brings the comfort of professionalism and a well-run practice to every treatment his patients need.','Wer in seinem Stuhl Platz nimmt, kann sich entspannen — frei von den Fragezeichen im Kopf — und einen komfortablen Behandlungsverlauf erleben. Mit neuester Technologie bringt er den Komfort von Professionalität und gut geführter Praxis in jede Behandlung, die seine Patientinnen und Patienten brauchen.'],
    ['<p>Erciyes University</p>','<p>Erciyes-Universität</p>'],
  ],
},
'dr-cemile-uysal': {
  meta: 'Dr. Cemile Uysal, Fachzahnärztin für Kieferorthopädie bei der Smile Group. Marmara-Absolventin, Promotion in Kieferorthopädie an der Gazi-Universität.',
  ozel: [
    ['<b>Specialist Orthodontist</b> · 10 Years of Clinical Experience','<b>Fachzahnärztin für Kieferorthopädie</b> · 10 Jahre klinische Erfahrung'],
    ['<strong>Specialist Orthodontist</strong> · 10 Years of Clinical Experience','<strong>Fachzahnärztin für Kieferorthopädie</strong> · 10 Jahre klinische Erfahrung'],
    ['Dr Cemile Uysal graduated from the Faculty of Dentistry at Marmara Üniversitesi (Marmara University) and completed her doctorate in the Department of Orthodontics at the Gazi Üniversitesi (Gazi University) Faculty of Dentistry. Her work centres on the treatment of tooth and jaw irregularities, with a particular focus on clear aligner treatments, fixed orthodontic treatment and early orthodontic care for children.','Dr. Cemile Uysal schloss ihr Studium an der Zahnmedizinischen Fakultät der Marmara Üniversitesi (Marmara-Universität) ab und promovierte in der Abteilung für Kieferorthopädie der Zahnmedizinischen Fakultät der Gazi Üniversitesi (Gazi-Universität). Im Zentrum ihrer Arbeit steht die Behandlung von Zahn- und Kieferfehlstellungen — mit besonderem Fokus auf Aligner-Behandlungen, festsitzender Kieferorthopädie und früher Kieferorthopädie für Kinder.'],
    ["Viewing aesthetics and function as a whole, Dr Uysal builds every treatment plan around each patient's individual tooth, jaw and facial structure. Alongside conventional orthodontic methods, she draws on digitally planned clear aligner treatments, aiming for comfortable, aesthetic and long-lasting results across different age groups.","Ästhetik und Funktion als Ganzes betrachtend, baut Dr. Uysal jeden Behandlungsplan um die individuelle Zahn-, Kiefer- und Gesichtsstruktur der Patientin oder des Patienten. Neben klassischen kieferorthopädischen Methoden greift sie auf digital geplante Aligner-Behandlungen zurück — mit dem Ziel komfortabler, ästhetischer und langlebiger Ergebnisse über die Altersgruppen hinweg."],
    ['<p>Marmara Üniversitesi (Marmara University), Gazi Üniversitesi (Gazi University)</p>','<p>Marmara Üniversitesi (Marmara-Universität), Gazi Üniversitesi (Gazi-Universität)</p>'],
  ],
},
'dr-arda-oztan': {
  meta: 'Dr. Arda Öztan, Facharzt für Mund-, Kiefer- und Gesichtschirurgie bei der Smile Group. Fokus: Implantatchirurgie und fortgeschrittene Eingriffe.',
  ozel: [
    ['<b>Specialist in Oral and Maxillofacial Surgery</b> · 10 Years of Clinical Experience','<b>Facharzt für Mund-, Kiefer- und Gesichtschirurgie</b> · 10 Jahre klinische Erfahrung'],
    ['<strong>Specialist in Oral and Maxillofacial Surgery</strong> · 10 Years of Clinical Experience','<strong>Facharzt für Mund-, Kiefer- und Gesichtschirurgie</strong> · 10 Jahre klinische Erfahrung'],
    ['Dr Arda Öztan graduated from the Faculty of Dentistry at İstanbul Üniversitesi (Istanbul University) and went on to complete his specialty training in Oral and Maxillofacial Surgery at the same university. Bringing together academic knowledge and clinical experience in surgical dentistry, Dr Öztan focuses in particular on implant surgery, advanced surgical procedures and oral and maxillofacial surgery.','Dr. Arda Öztan schloss sein Studium an der Zahnmedizinischen Fakultät der İstanbul Üniversitesi (Universität Istanbul) ab und absolvierte an derselben Universität seine Facharztausbildung in Mund-, Kiefer- und Gesichtschirurgie. Akademisches Wissen und klinische Erfahrung der chirurgischen Zahnmedizin zusammenführend, konzentriert sich Dr. Öztan besonders auf Implantatchirurgie, fortgeschrittene chirurgische Eingriffe und die Mund-, Kiefer- und Gesichtschirurgie.'],
    ['At the centre of his approach to treatment are accurate diagnosis, careful planning and the most comfortable surgical experience possible. Assessing every patient according to their own anatomical and clinical needs, Dr Öztan draws on digital planning and current surgical techniques, aiming for predictable, safe and long-lasting results.','Im Zentrum seines Behandlungsansatzes stehen die genaue Diagnose, die sorgfältige Planung und das komfortabelste chirurgische Erlebnis, das möglich ist. Jede Patientin und jeden Patienten nach den eigenen anatomischen und klinischen Bedürfnissen beurteilend, greift Dr. Öztan auf digitale Planung und aktuelle OP-Techniken zurück — mit dem Ziel vorhersehbarer, sicherer und langlebiger Ergebnisse.'],
    ['<p>İstanbul Üniversitesi (Istanbul University)</p>','<p>İstanbul Üniversitesi (Universität Istanbul)</p>'],
  ],
},
'dr-kadir-can-sakur': {
  meta: 'Dr. Kadir Can Sakur, Zahnarzt bei der Smile Group. Absolvent mit Auszeichnung der İstanbul Yeni Yüzyıl Üniversitesi; Fokus: Ästhetik und Smile Design.',
  ozel: [
    ['<b>Dentist</b><br>','<b>Zahnarzt</b><br>'],
    ['<strong>Dentist</strong>','<strong>Zahnarzt</strong>'],
    ['Dr Kadir Can Sakur graduated with an honours degree from the Faculty of Dentistry at İstanbul Yeni Yüzyıl University. His work combines current treatment approaches with modern clinical practice, with a particular focus on cosmetic dentistry and smile design.','Dr. Kadir Can Sakur schloss sein Studium an der Zahnmedizinischen Fakultät der İstanbul Yeni Yüzyıl Üniversitesi mit Auszeichnung ab. Seine Arbeit verbindet aktuelle Behandlungsansätze mit moderner klinischer Praxis — mit besonderem Fokus auf ästhetischer Zahnmedizin und Smile Design.'],
    ["Believing that every smile should be unique to the individual, Dr Sakur considers more than appearance alone when planning treatment: naturalness, function and harmony with the face are weighed together. He sees a clear understanding of each patient's expectations as an essential part of treatment, and aims for personalised results that last.","Überzeugt, dass jedes Lächeln einzigartig zum Menschen gehören soll, betrachtet Dr. Sakur bei der Planung mehr als das Aussehen allein: Natürlichkeit, Funktion und die Harmonie mit dem Gesicht werden zusammen gewogen. Das klare Verständnis der Erwartungen jeder Patientin und jedes Patienten sieht er als wesentlichen Teil der Behandlung — mit dem Ziel persönlicher Ergebnisse, die halten."],
    ['<p>İstanbul Yeni Yüzyıl University</p>','<p>İstanbul Yeni Yüzyıl Üniversitesi</p>'],
  ],
},
'dr-ihsan-erik': {
  meta: 'Dr. İhsan Erik, Zahnarzt bei der Smile Group. Absolvent der englischsprachigen Zahnmedizin der Bahçeşehir-Universität; Fokus: Ästhetik und Restauration.',
  ozel: [
    ['<b>Dentist</b><br>','<b>Zahnarzt</b><br>'],
    ['<strong>Dentist</strong>','<strong>Zahnarzt</strong>'],
    ['Dr İhsan Erik graduated from the English-language Faculty of Dentistry at Bahçeşehir Üniversitesi (Bahçeşehir University). Focusing on cosmetic and restorative dentistry, Dr Erik follows scientific developments and current treatment approaches closely in his day-to-day practice.','Dr. İhsan Erik schloss sein Studium an der englischsprachigen Zahnmedizinischen Fakultät der Bahçeşehir Üniversitesi (Bahçeşehir-Universität) ab. Mit Fokus auf ästhetischer und restaurativer Zahnmedizin verfolgt Dr. Erik in seiner täglichen Praxis die wissenschaftlichen Entwicklungen und aktuellen Behandlungsansätze aus nächster Nähe.'],
    ['At the heart of his approach is preserving as much natural tooth tissue as possible. Weighing aesthetic expectations alongside oral and dental health, Dr Erik favours a preventive, personalised approach that avoids unnecessary intervention, aiming for natural, functional and long-lasting results.','Das Herz seines Ansatzes: so viel natürliche Zahnsubstanz wie möglich erhalten. Ästhetische Erwartungen gemeinsam mit der Mund- und Zahngesundheit abwägend, bevorzugt Dr. Erik einen vorbeugenden, persönlichen Ansatz ohne unnötige Eingriffe — mit dem Ziel natürlicher, funktioneller und langlebiger Ergebnisse.'],
    ['<p>İstanbul Yeni Yüzyıl Üniversitesi (Istanbul Yeni Yüzyıl University)</p>','<p>İstanbul Yeni Yüzyıl Üniversitesi</p>'],
  ],
},
'dt-zeynep-nas': {
  meta: 'Dr. Zeynep Nas, Zahnärztin bei der Smile Group. Absolventin der İstanbul Medipol Üniversitesi; Fokus: Ästhetik, Komposit- und Veneer-Restaurationen.',
  ozel: [
    ['<b>Dentist</b><br>','<b>Zahnärztin</b><br>'],
    ['<strong>Dentist</strong>','<strong>Zahnärztin</strong>'],
    ['Dr Zeynep Nas graduated from the Faculty of Dentistry at İstanbul Medipol University. Focusing on cosmetic dentistry and composite and veneer (laminate) restorations, Dr Nas keeps a close eye on scientific developments and current treatment approaches in her day-to-day work.','Dr. Zeynep Nas schloss ihr Studium an der Zahnmedizinischen Fakultät der İstanbul Medipol Üniversitesi ab. Mit Fokus auf ästhetischer Zahnmedizin sowie Komposit- und Veneer-Restaurationen behält Dr. Nas in ihrer täglichen Arbeit die wissenschaftlichen Entwicklungen und aktuellen Behandlungsansätze genau im Blick.'],
    ["Her approach to treatment puts naturalness and the preservation of existing tooth tissue first, weighing cosmetic expectations alongside oral and dental health. By planning around each patient's individual needs, she aims to achieve natural, aesthetic and functional results with the most conservative approach possible.","Ihr Behandlungsansatz stellt Natürlichkeit und den Erhalt der vorhandenen Zahnsubstanz an die erste Stelle und wägt ästhetische Erwartungen gemeinsam mit der Mund- und Zahngesundheit ab. Um die individuellen Bedürfnisse jeder Patientin und jedes Patienten herum planend, zielt sie mit dem zurückhaltendsten möglichen Ansatz auf natürliche, ästhetische und funktionelle Ergebnisse."],
    ['<p>İstanbul Medipol University</p>','<p>İstanbul Medipol Üniversitesi</p>'],
  ],
},
};

let toplamSorun = 0;
for (const [ad, veri] of Object.entries(DOSYA)) {
  let s = fs.readFileSync(path.join(ENDIR, ad + '.html'), 'utf8');
  const sorun = [];
  const rep = (a, b) => { if (!s.includes(a)) { sorun.push(a.slice(0, 60)); return; } s = s.split(a).join(b); };
  for (const [a, b] of veri.ozel) rep(a, b);
  for (const [a, b] of ORTAK) { if (s.includes(a)) s = s.split(a).join(b); }
  s = s.replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + veri.meta + '">');
  s = s.split('href="/en/').join('href="/de/');
  fs.writeFileSync(path.join(DEDIR, ad + '.html'), s);
  const enK = /(Corporate page|EN edition|View details|About Dr [^.]|weeks ago|graduated from| the )/.test(s.replace(/TR[-: ][^\n]*/g, ''));
  console.log(ad + ' · ozel sorun: ' + sorun.length + ' · EN kalinti: ' + enK);
  sorun.forEach(x => console.log('   - ' + x));
  toplamSorun += sorun.length;
}
console.log('TOPLAM sorun: ' + toplamSorun);
