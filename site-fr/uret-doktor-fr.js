/* site-en/doktor/*.html -> site-fr/doktor/*.html (6 hekim)
 * uret-doktor-de.js'in birebir FR uyarlaması. Sıra: dosyaya özel -> ortak -> linkler. */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const ENDIR = path.join(ROOT, '..', 'site-en', 'doktor');
const FRDIR = path.join(ROOT, 'doktor');
if (!fs.existsSync(FRDIR)) fs.mkdirSync(FRDIR, { recursive: true });

const ORTAK = [
['Home  ›  Our Doctors  ›','Accueil  ›  Nos dentistes  ›'],
['TR original:','Original TR :'],
['View Biography','Voir la biographie'],
['Book an Appointment','Prendre rendez-vous'],
['View Profile','Voir le profil'],
['About Dr','À propos du Dr'],
['Academic Education &amp; Degrees','Formation académique &amp; diplômes'],
['Academic Education and Degrees','Formation académique et diplômes'],
['Clinical Areas of Expertise','Domaines d’expertise clinique'],
['<li>Digital Dentistry</li>','<li>Dentisterie numérique</li>'],
['<li>Cosmetic Dentistry</li>','<li>Dentisterie esthétique</li>'],
['<li>Restorative Treatments</li>','<li>Traitements restaurateurs</li>'],
['<li>Orthodontics</li>','<li>Orthodontie</li>'],
['<li>Clear Aligner Treatments</li>','<li>Traitements par aligneurs</li>'],
['<li>Jaw and Bite Disorders</li>','<li>Troubles des mâchoires et de l’occlusion</li>'],
['<li>Braces Treatments</li>','<li>Traitements par bagues</li>'],
['<li>Implants</li>','<li>Implants</li>'],
['<li>Sinus Lift</li>','<li>Sinus lift</li>'],
['<li>Digital Surgical Planning</li>','<li>Planification chirurgicale numérique</li>'],
['<li>Zirconia</li>','<li>Couronnes en zircone</li>'],
['<li>Porcelain Veneers</li>','<li>Facettes en céramique</li>'],
['<li>Cosmetic Fillings</li>','<li>Plombages esthétiques</li>'],
// mutlu gülüşler
['Happy Patient Smiles','Sourires de patients heureux'],
['Because of patient confidentiality within Turkey, the images shown here are blurred. Fill in the form to see detailed results.','En raison de la confidentialité des patients en Turquie, les images montrées ici sont floutées. Remplissez le formulaire pour voir les résultats détaillés.'],
["Elif's Transformation Story","L’histoire de transformation d’Elif"],
["Murat's Transformation Story","L’histoire de transformation de Murat"],
["Zeynep's Transformation Story","L’histoire de transformation de Zeynep"],
["Emre's Transformation Story","L’histoire de transformation d’Emre"],
['Fill In the Form to See Smile Results','Remplir le formulaire pour voir les résultats de sourire'],
// yorumlar
['What Our Patients Say','Ce que disent nos patients'],
['<b>Google rating: 4.8</b> (5 reviews) ·','<b>Note Google : 4,8</b> (5 avis) ·'],
['Google rating: 4.8 (5 reviews) —','Note Google : 4,8 (5 avis) —'],
['Read All Reviews','Lire tous les avis'],
['View All Reviews','Lire tous les avis'],
['Google rating: <strong>4.8</strong> (5 reviews) —','Note Google : <strong>4,8</strong> (5 avis) —'],
['My experience with the Smilegroup team was excellent. My Hollywood Smile treatment turned out exactly as I wanted — thank you so much.','Mon expérience avec l’équipe Smilegroup a été excellente. Mon traitement Hollywood Smile est devenu exactement ce que je voulais — merci infiniment.'],
['I came from Germany for my All-on-4 implant treatment. Thanks to digital anaesthesia I felt almost no pain, and the result is wonderful.','Je suis venue d’Allemagne pour mon traitement implantaire All-on-4. Grâce à l’anesthésie numérique, je n’ai presque rien senti, et le résultat est magnifique.'],
['My veneer treatment was completed in four days. The team were attentive and professional — I would recommend them.','Mon traitement de facettes s’est terminé en quatre jours. L’équipe a été attentive et professionnelle — je la recommande.'],
['I was monitored remotely for six months during my Invisalign treatment and had no problems at any point. My smile has completely changed.','Pendant mon traitement Invisalign, j’ai été suivie à distance six mois durant, sans le moindre problème. Mon sourire a complètement changé.'],
['The clinic is very clean and modern, and the staff are extremely friendly. My treatment plan was explained in detail from start to finish.','La clinique est très propre et moderne, et le personnel extrêmement chaleureux. Mon plan de traitement m’a été expliqué en détail du début à la fin.'],
['(5 stars, ','(5 étoiles, '],
['(4 stars, ','(4 étoiles, '],
['2 weeks ago','il y a 2 semaines'],
['3 weeks ago','il y a 3 semaines'],
['1 month ago','il y a 1 mois'],
['2 months ago','il y a 2 mois'],
['5 days ago','il y a 5 jours'],
// randevu
['Plan Your Appointment','Planifiez votre rendez-vous'],
['<b>ONLINE CONSULTATION</b> — Choose a date and time that suits you for a one-to-one consultation with our specialist team.','<b>CONSULTATION EN LIGNE</b> — Choisissez la date et l’heure qui vous conviennent pour un entretien individuel avec notre équipe de spécialistes.'],
['Book a One-to-One Consultation with a Specialist Dentist','Réservez un entretien individuel avec un chirurgien-dentiste spécialiste'],
['Speak directly with our specialists, weigh up your treatment options and build a plan tailored to you — with no obligation.','Parlez directement avec nos spécialistes, pesez vos options de traitement et bâtissez un plan taillé pour vous — sans engagement.'],
['<b>Booking widget fields (the live scheduler is produced by WordPress):</b> date picker (Choose a date · Choose a time · Previous week / Next week), Full Name, Your Concern (optional), “Book an Appointment” button. Time zone: Europe/Istanbul (UTC+3).','<b>Champs du widget de réservation (le planificateur réel est généré par WordPress) :</b> choix de date (Choisir une date · Choisir une heure · Semaine précédente / suivante), nom et prénom, votre préoccupation (facultatif), bouton « Prendre rendez-vous ». Fuseau : Europe/Istanbul (UTC+3).'],
['<p><strong>Online consultation:</strong> choose a date and time that suits you for a one-to-one consultation with our specialist team.</p>','<p><strong>Consultation en ligne :</strong> choisissez la date et l’heure qui vous conviennent pour un entretien individuel avec notre équipe de spécialistes.</p>'],
['<p>Book a one-to-one consultation with a specialist dentist. Speak directly with our specialists, weigh up your treatment options and build a plan tailored to you — with no obligation. Time zone: Europe/Istanbul (UTC+3).</p>','<p>Réservez un entretien individuel avec un chirurgien-dentiste spécialiste. Parlez directement avec nos spécialistes, pesez vos options de traitement et bâtissez un plan taillé pour vous — sans engagement. Fuseau : Europe/Istanbul (UTC+3).</p>'],
['<!-- The live booking widget (calendar, time slots, Full Name and Your Concern fields, "Book an Appointment" button) is produced by the WordPress theme. -->','<!-- Le widget de réservation réel (calendrier, créneaux, champs nom et prénom / votre préoccupation, bouton « Prendre rendez-vous ») est généré par le thème WordPress. -->'],
// ekip
['Our Distinguished Clinical Team','Notre équipe soignante d’exception'],
['<b>WORLD-CLASS SPECIALISTS</b>','<b>DES SPÉCIALISTES DE CLASSE MONDIALE</b>'],
['World-class specialists:','Des spécialistes de classe mondiale :'],
['View All Doctors →','Voir tous les dentistes →'],
['View All Doctors','Voir tous les dentistes'],
['— Cosmetic Dentist','— Chirurgien-dentiste esthétique'],
['— Specialist Orthodontist','— Orthodontiste'],
['— Oral &amp; Maxillofacial Surgeon','— Chirurgien oral et maxillo-facial'],
['Dr Kadir Can Sakur</a> — Dentist','Dr Kadir Can Sakur</a> — Chirurgien-dentiste'],
['Dr İhsan Erik</a> — Dentist','Dr İhsan Erik</a> — Chirurgien-dentiste'],
['Dr Zeynep Nas</a> — Dentist','Dr Zeynep Nas</a> — Chirurgienne-dentiste'],
// krom
['<html lang="en">','<html lang="fr">'],
['<span class="sub">Aesthetic &amp; Dental Clinic</span>','<span class="sub">Clinique dentaire &amp; esthétique</span>'],
['Corporate page · <b>EN edition</b>','Page institutionnelle · <b>Édition FR</b>'],
['<h2>📋 Import to WordPress</h2>','<h2>📋 Reprendre dans WordPress</h2>'],
['Paste the HTML below into the corresponding WordPress page as a <b>Custom HTML</b> block.','Collez le HTML ci-dessous comme bloc <b>HTML personnalisé</b> dans la page WordPress correspondante.'],
['Links inside it already use the <b>/en/…</b> URL scheme.','Les liens qu’il contient utilisent déjà le schéma d’URL <b>/fr/…</b>.'],
['<span class="lab">Page HTML (body)</span>','<span class="lab">HTML de la page (corps)</span>'],
["this.textContent='Copied ✓';var b=this;setTimeout(function(){b.textContent='Copy'},1600)\">Copy</button>","this.textContent='Copié ✓';var b=this;setTimeout(function(){b.textContent='Copier'},1600)\">Copier</button>"],
['<span>Smile Group · EN corporate page preview — internal use.</span>','<span>Smile Group · Aperçu des pages institutionnelles FR — usage interne.</span>'],
['<span><a href="../index.html">← All content</a></span>','<span><a href="../index.html">← Tous les contenus</a></span>'],
];

const DOSYA = {
'dt-yasin-gokcegozoglu': {
  meta: 'Dr Yasin Gökcegözoğlu, chirurgien-dentiste esthétique chez Smile Group. Diplômé de l’université Erciyes, master allemand en dentisterie générale et esthétique.',
  ozel: [
    ['<b>Cosmetic Dentist · 20 Years of Clinical Experience</b>','<b>Chirurgien-dentiste esthétique · 20 ans d’expérience clinique</b>'],
    ['<strong>Cosmetic Dentist · 20 Years of Clinical Experience</strong>','<strong>Chirurgien-dentiste esthétique · 20 ans d’expérience clinique</strong>'],
    ["Born in Istanbul in 1990, Dr Yasin Gökcegözoğlu first set his heart on dentistry while at Cağaloğlu Anadolu High School, one of Istanbul's long-established schools, and crowned that ambition with a successful period of study at Erciyes University.","Né à Istanbul en 1990, le Dr Yasin Gökcegözoğlu a donné son cœur à la dentisterie dès le lycée Cağaloğlu Anadolu, l’un des établissements historiques d’Istanbul — et a couronné cette ambition par des études réussies à l’université Erciyes."],
    ['He has taken part in scientific work across many areas of dentistry, embracing what he sees as the true mission of the profession.','Il a pris part à des travaux scientifiques dans de nombreux domaines de la dentisterie — dans l’esprit de ce qu’il considère comme la véritable mission du métier.'],
    ['Through the seminars he gives to hundreds of young people every year, he works to elevate the dental profession in Turkey — explaining what it truly means to feel like a clinician, and teaching hundreds of dentists that their first priority must always be health.','Par les séminaires qu’il donne chaque année devant des centaines de jeunes, il travaille à élever la profession dentaire en Turquie — expliquant ce que signifie vraiment se sentir clinicien, et enseignant à des centaines de dentistes que la santé doit toujours passer en premier.'],
    ['In addition, he completed an MBA with the aim of building a professional structure — a healthcare facility that holds quality and prestige together — so that he can offer his patients an even better standard of care.','Il a en outre achevé un MBA — avec l’objectif de bâtir une structure professionnelle, un établissement de santé qui tienne ensemble qualité et prestige, pour offrir à ses patients un standard de soins encore meilleur.'],
    ["He completed a master's programme in Germany in <strong>“International Master School General Dentistry and Aesthetics”</strong>, with the aim of serving his patients in the field of aesthetics. On a personal level, he has immersed himself in the history of philosophy, reading countless books on the subject and writing several essays of his own.","Pour servir ses patients dans le champ de l’esthétique, il a suivi en Allemagne le programme de master <strong>« International Master School General Dentistry and Aesthetics »</strong>. Sur le plan personnel, il s’est plongé dans l’histoire de la philosophie, lisant d’innombrables ouvrages sur le sujet et écrivant plusieurs essais de sa main."],
    ['He is a member of the Aesthetic Dentistry Academy Association (EDAD) and the Computer Aided Dentistry Academy (CADA).','Il est membre de l’Académie de dentisterie esthétique (EDAD) et de la Computer Aided Dentistry Academy (CADA).'],
    ['In both the clinical and the cosmetic care he provides, his aim is always to offer his patients the highest quality and the very best.','Dans les soins cliniques comme esthétiques qu’il prodigue, son objectif est toujours d’offrir à ses patients la plus haute qualité et le meilleur.'],
    ['Every patient who sits in his chair can feel at ease, entirely free of the question marks in their mind, and experience a comfortable course of treatment. Using the very latest technology, he brings the comfort of professionalism and a well-run practice to every treatment his patients need.','Qui s’assoit dans son fauteuil peut se détendre — libéré des points d’interrogation en tête — et vivre un parcours de traitement confortable. Avec la toute dernière technologie, il apporte le confort du professionnalisme et d’un cabinet bien mené à chaque traitement dont ses patients ont besoin.'],
    ['<p>Erciyes University</p>','<p>Université Erciyes</p>'],
  ],
},
'dr-cemile-uysal': {
  meta: 'Dr Cemile Uysal, orthodontiste chez Smile Group. Diplômée de Marmara, doctorat en orthodontie à l’université Gazi.',
  ozel: [
    ['<b>Specialist Orthodontist</b> · 10 Years of Clinical Experience','<b>Orthodontiste</b> · 10 ans d’expérience clinique'],
    ['<strong>Specialist Orthodontist</strong> · 10 Years of Clinical Experience','<strong>Orthodontiste</strong> · 10 ans d’expérience clinique'],
    ['Dr Cemile Uysal graduated from the Faculty of Dentistry at Marmara Üniversitesi (Marmara University) and completed her doctorate in the Department of Orthodontics at the Gazi Üniversitesi (Gazi University) Faculty of Dentistry. Her work centres on the treatment of tooth and jaw irregularities, with a particular focus on clear aligner treatments, fixed orthodontic treatment and early orthodontic care for children.','La Dr Cemile Uysal est diplômée de la faculté de médecine dentaire de la Marmara Üniversitesi (université de Marmara) et a achevé son doctorat au département d’orthodontie de la faculté de médecine dentaire de la Gazi Üniversitesi (université Gazi). Son travail se centre sur le traitement des irrégularités des dents et des mâchoires — avec un accent particulier sur les traitements par aligneurs, l’orthodontie fixe et l’orthodontie précoce de l’enfant.'],
    ["Viewing aesthetics and function as a whole, Dr Uysal builds every treatment plan around each patient's individual tooth, jaw and facial structure. Alongside conventional orthodontic methods, she draws on digitally planned clear aligner treatments, aiming for comfortable, aesthetic and long-lasting results across different age groups.","Regardant esthétique et fonction comme un tout, la Dr Uysal bâtit chaque plan de traitement autour de la structure dentaire, maxillaire et faciale propre à chaque patiente et patient. Aux côtés des méthodes orthodontiques classiques, elle s’appuie sur des traitements par aligneurs planifiés numériquement — visant des résultats confortables, esthétiques et durables à travers les âges."],
    ['<p>Marmara Üniversitesi (Marmara University), Gazi Üniversitesi (Gazi University)</p>','<p>Marmara Üniversitesi (université de Marmara), Gazi Üniversitesi (université Gazi)</p>'],
  ],
},
'dr-arda-oztan': {
  meta: 'Dr Arda Öztan, chirurgien oral et maxillo-facial chez Smile Group. Focus : chirurgie implantaire et interventions avancées.',
  ozel: [
    ['<b>Specialist in Oral and Maxillofacial Surgery</b> · 10 Years of Clinical Experience','<b>Spécialiste en chirurgie orale et maxillo-faciale</b> · 10 ans d’expérience clinique'],
    ['<strong>Specialist in Oral and Maxillofacial Surgery</strong> · 10 Years of Clinical Experience','<strong>Spécialiste en chirurgie orale et maxillo-faciale</strong> · 10 ans d’expérience clinique'],
    ['Dr Arda Öztan graduated from the Faculty of Dentistry at İstanbul Üniversitesi (Istanbul University) and went on to complete his specialty training in Oral and Maxillofacial Surgery at the same university. Bringing together academic knowledge and clinical experience in surgical dentistry, Dr Öztan focuses in particular on implant surgery, advanced surgical procedures and oral and maxillofacial surgery.','Le Dr Arda Öztan est diplômé de la faculté de médecine dentaire de l’İstanbul Üniversitesi (université d’Istanbul), où il a ensuite achevé sa spécialisation en chirurgie orale et maxillo-faciale. Réunissant savoir académique et expérience clinique de la dentisterie chirurgicale, le Dr Öztan se concentre en particulier sur la chirurgie implantaire, les interventions chirurgicales avancées et la chirurgie orale et maxillo-faciale.'],
    ['At the centre of his approach to treatment are accurate diagnosis, careful planning and the most comfortable surgical experience possible. Assessing every patient according to their own anatomical and clinical needs, Dr Öztan draws on digital planning and current surgical techniques, aiming for predictable, safe and long-lasting results.','Au centre de son approche : le diagnostic juste, la planification soignée et l’expérience chirurgicale la plus confortable possible. Évaluant chaque patiente et patient selon ses propres besoins anatomiques et cliniques, le Dr Öztan s’appuie sur la planification numérique et les techniques chirurgicales actuelles — visant des résultats prévisibles, sûrs et durables.'],
    ['<p>İstanbul Üniversitesi (Istanbul University)</p>','<p>İstanbul Üniversitesi (université d’Istanbul)</p>'],
  ],
},
'dr-kadir-can-sakur': {
  meta: 'Dr Kadir Can Sakur, chirurgien-dentiste chez Smile Group. Diplômé avec mention de l’İstanbul Yeni Yüzyıl Üniversitesi ; focus : esthétique et smile design.',
  ozel: [
    ['<b>Dentist</b><br>','<b>Chirurgien-dentiste</b><br>'],
    ['<strong>Dentist</strong>','<strong>Chirurgien-dentiste</strong>'],
    ['Dr Kadir Can Sakur graduated with an honours degree from the Faculty of Dentistry at İstanbul Yeni Yüzyıl University. His work combines current treatment approaches with modern clinical practice, with a particular focus on cosmetic dentistry and smile design.','Le Dr Kadir Can Sakur est diplômé avec mention de la faculté de médecine dentaire de l’İstanbul Yeni Yüzyıl Üniversitesi. Son travail marie approches de traitement actuelles et pratique clinique moderne — avec un accent particulier sur la dentisterie esthétique et le smile design.'],
    ["Believing that every smile should be unique to the individual, Dr Sakur considers more than appearance alone when planning treatment: naturalness, function and harmony with the face are weighed together. He sees a clear understanding of each patient's expectations as an essential part of treatment, and aims for personalised results that last.","Convaincu que chaque sourire doit appartenir en propre à la personne, le Dr Sakur considère plus que l’apparence seule en planifiant : naturel, fonction et harmonie avec le visage se pèsent ensemble. Il voit la compréhension claire des attentes de chaque patiente et patient comme une part essentielle du traitement — visant des résultats personnels qui durent."],
    ['<p>İstanbul Yeni Yüzyıl University</p>','<p>İstanbul Yeni Yüzyıl Üniversitesi</p>'],
  ],
},
'dr-ihsan-erik': {
  meta: 'Dr İhsan Erik, chirurgien-dentiste chez Smile Group. Diplômé du cursus anglophone de la Bahçeşehir Üniversitesi ; focus : esthétique et restauration.',
  ozel: [
    ['<b>Dentist</b><br>','<b>Chirurgien-dentiste</b><br>'],
    ['<strong>Dentist</strong>','<strong>Chirurgien-dentiste</strong>'],
    ['Dr İhsan Erik graduated from the English-language Faculty of Dentistry at Bahçeşehir Üniversitesi (Bahçeşehir University). Focusing on cosmetic and restorative dentistry, Dr Erik follows scientific developments and current treatment approaches closely in his day-to-day practice.','Le Dr İhsan Erik est diplômé de la faculté de médecine dentaire anglophone de la Bahçeşehir Üniversitesi (université Bahçeşehir). Centré sur la dentisterie esthétique et restauratrice, le Dr Erik suit de près, dans sa pratique quotidienne, les développements scientifiques et les approches de traitement actuelles.'],
    ['At the heart of his approach is preserving as much natural tooth tissue as possible. Weighing aesthetic expectations alongside oral and dental health, Dr Erik favours a preventive, personalised approach that avoids unnecessary intervention, aiming for natural, functional and long-lasting results.','Au cœur de son approche : préserver autant de tissu dentaire naturel que possible. Pesant les attentes esthétiques avec la santé bucco-dentaire, le Dr Erik privilégie une approche préventive et personnelle, sans intervention inutile — visant des résultats naturels, fonctionnels et durables.'],
    ['<p>İstanbul Yeni Yüzyıl Üniversitesi (Istanbul Yeni Yüzyıl University)</p>','<p>İstanbul Yeni Yüzyıl Üniversitesi</p>'],
  ],
},
'dt-zeynep-nas': {
  meta: 'Dr Zeynep Nas, chirurgienne-dentiste chez Smile Group. Diplômée de l’İstanbul Medipol Üniversitesi ; focus : esthétique, restaurations composite et facettes.',
  ozel: [
    ['<b>Dentist</b><br>','<b>Chirurgienne-dentiste</b><br>'],
    ['<strong>Dentist</strong>','<strong>Chirurgienne-dentiste</strong>'],
    ['Dr Zeynep Nas graduated from the Faculty of Dentistry at İstanbul Medipol University. Focusing on cosmetic dentistry and composite and veneer (laminate) restorations, Dr Nas keeps a close eye on scientific developments and current treatment approaches in her day-to-day work.','La Dr Zeynep Nas est diplômée de la faculté de médecine dentaire de l’İstanbul Medipol Üniversitesi. Centrée sur la dentisterie esthétique et les restaurations composite et facettes, la Dr Nas garde un œil attentif, dans son travail quotidien, sur les développements scientifiques et les approches de traitement actuelles.'],
    ["Her approach to treatment puts naturalness and the preservation of existing tooth tissue first, weighing cosmetic expectations alongside oral and dental health. By planning around each patient's individual needs, she aims to achieve natural, aesthetic and functional results with the most conservative approach possible.","Son approche du traitement place en premier le naturel et la préservation du tissu dentaire existant, pesant les attentes esthétiques avec la santé bucco-dentaire. En planifiant autour des besoins propres à chaque patiente et patient, elle vise des résultats naturels, esthétiques et fonctionnels avec l’approche la plus conservatrice possible."],
    ['<p>İstanbul Medipol University</p>','<p>İstanbul Medipol Üniversitesi</p>'],
  ],
},
};

/* Sıralama artıkları: ORTAK içindeki erken değişimler bu anahtarların içini bozar — son geçiş. */
const KUYRUK = [
['<b>Booking widget fields (the live scheduler is produced by WordPress):</b> date picker (Choose a date · Choose a time · Previous week / Next week), Full Name, Your Concern (optional), “Prendre rendez-vous” button. Time zone: Europe/Istanbul (UTC+3).','<b>Champs du widget de réservation (le planificateur réel est généré par WordPress) :</b> choix de date (Choisir une date · Choisir une heure · Semaine précédente / suivante), nom et prénom, votre préoccupation (facultatif), bouton « Prendre rendez-vous ». Fuseau : Europe/Istanbul (UTC+3).'],
['Book a one-to-one consultation with a specialist dentist.','Réservez un entretien individuel avec un chirurgien-dentiste spécialiste.'],
['Time zone: Europe/Istanbul (UTC+3).</p>','Fuseau : Europe/Istanbul (UTC+3).</p>'],
['<!-- The live booking widget (calendar, time slots, Full Name and Your Concern fields, "Prendre rendez-vous" button) is produced by the WordPress theme. -->','<!-- Le widget de réservation réel (calendrier, créneaux, champs nom et prénom / votre préoccupation, bouton « Prendre rendez-vous ») est généré par le thème WordPress. -->'],
// ikinci şablon nesli (arda/cemile/ihsan varyantları)
['Book a One-to-One Consultation with a Specialist Clinician','Réservez un entretien individuel avec une clinicienne ou un clinicien spécialiste'],
['Our images are blurred to protect patient confidentiality within Turkey. To see detailed results, please fill in the form.','Nos images sont floutées pour protéger la confidentialité des patients en Turquie. Pour voir les résultats détaillés, remplissez le formulaire.'],
['Fill in the Form to See Smile Results','Remplir le formulaire pour voir les résultats de sourire'],
["I was followed up remotely for six months during my Invisalign treatment and didn't have a single problem. My smile has completely changed.","Pendant mon traitement Invisalign, j’ai été suivie à distance six mois durant, sans le moindre problème. Mon sourire a complètement changé."],
['Choose a date and time that suits you for a one-to-one consultation with our specialist clinicians.','Choisissez la date et l’heure qui vous conviennent pour un entretien individuel avec nos cliniciens spécialistes.'],
['Speak directly with our specialists, discuss your treatment options and create a plan tailored to you — with no obligation.','Parlez directement avec nos spécialistes, discutez vos options de traitement et créez un plan taillé pour vous — sans engagement.'],
['<b>Booking widget fields (the live scheduler is produced by WordPress):</b> Time zone: Europe/Istanbul (UTC+3) · date selection (Previous week / Next week) · available time slots · Full Name · Your Concern (optional) · Prendre rendez-vous','<b>Champs du widget de réservation (le planificateur réel est généré par WordPress) :</b> fuseau : Europe/Istanbul (UTC+3) · choix de date (Semaine précédente / suivante) · créneaux disponibles · nom et prénom · votre préoccupation (facultatif) · Prendre rendez-vous'],
['<em>Booking widget fields (the live scheduler is produced by WordPress): Time zone: Europe/Istanbul (UTC+3) · date selection (Previous week / Next week) · available time slots · Full Name · Your Concern (optional) · Prendre rendez-vous</em>','<em>Champs du widget de réservation (le planificateur réel est généré par WordPress) : fuseau : Europe/Istanbul (UTC+3) · choix de date (Semaine précédente / suivante) · créneaux disponibles · nom et prénom · votre préoccupation (facultatif) · Prendre rendez-vous</em>'],
['— Specialist in Oral and Maxillofacial Surgery','— Spécialiste en chirurgie orale et maxillo-faciale'],
['Google rating: <b>4.8</b> (5 reviews) —','Note Google : <b>4,8</b> (5 avis) —'],
['Google rating: 4.8 (5 reviews):','Note Google : 4,8 (5 avis) :'],
];

let toplamSorun = 0;
for (const [ad, veri] of Object.entries(DOSYA)) {
  let s = fs.readFileSync(path.join(ENDIR, ad + '.html'), 'utf8');
  const sorun = [];
  const rep = (a, b) => { if (!s.includes(a)) { sorun.push(a.slice(0, 60)); return; } s = s.split(a).join(b); };
  for (const [a, b] of veri.ozel) rep(a, b);
  for (const [a, b] of ORTAK) { if (s.includes(a)) s = s.split(a).join(b); }
  for (const [a, b] of KUYRUK) { if (s.includes(a)) s = s.split(a).join(b); }
  s = s.replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + veri.meta + '">');
  s = s.split('href="/en/').join('href="/fr/');
  s = s.split('href="/fr/hizmet/').join('href="/fr/traitement/');
  s = s.split('href="/fr/doktor/').join('href="/fr/dentiste/');
  s = s.split('/fr/hasta-hikayesi/elif-lamine/').join('/fr/histoire-patient/facettes-avant-apres/');
  s = s.split('/fr/hasta-hikayesi/murat-implant/').join('/fr/histoire-patient/implant-dentaire-avant-apres/');
  s = s.split('/fr/hasta-hikayesi/zeynep-zirkonyum/').join('/fr/histoire-patient/couronnes-zircone-avant-apres/');
  s = s.split('/fr/hasta-hikayesi/emre-beyazlatma/').join('/fr/histoire-patient/blanchiment-avant-apres/');
  s = s.split('href="/fr/hekimlerimiz/').join('href="/fr/nos-dentistes/');
  fs.writeFileSync(path.join(FRDIR, ad + '.html'), s);
  const enK = /(Corporate page|EN edition|View details|weeks ago|graduated from| the )/.test(s.replace(/Original TR[^\n]*|TR original[^\n]*/g, ''));
  console.log(ad + ' · ozel sorun: ' + sorun.length + ' · EN kalinti: ' + enK);
  sorun.forEach(x => console.log('   - ' + x));
  toplamSorun += sorun.length;
}
console.log('TOPLAM sorun: ' + toplamSorun);
