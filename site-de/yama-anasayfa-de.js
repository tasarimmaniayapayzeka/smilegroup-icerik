/* uret-anasayfa-de.js sonrası kalan İngilizce bölgeleri Almancalar. */
const fs = require('fs');
const path = require('path');
const F = path.join(__dirname, 'kurumsal', 'anasayfa.html');
let s = fs.readFileSync(F, 'utf8');
const eksik = [];
function rep(a, b) {
  if (!s.includes(a)) { eksik.push(a.slice(0, 80)); return; }
  s = s.split(a).join(b);
}

rep("<p><b>Concern cards:</b> I'm Missing a Tooth · I'm Not Happy with My Smile · I Snore · Zahnschmerzen · I Have Mundgeruch (Halitosis) · I've Broken a Tooth · Cosmetic Dentistry · I Have Gum Problems</p>",
    '<p><b>Anliegen-Karten:</b> Mir fehlt ein Zahn · Ich bin mit meinem Lächeln unzufrieden · Ich schnarche · Mein Zahn schmerzt · Ich habe Mundgeruch · Mir ist ein Zahn abgebrochen · Ästhetische Zahnmedizin · Ich habe Zahnfleischprobleme</p>');

rep('<li><b>Treatment Options for Mundgeruch (Halitosis)</b> — Learn about the causes of bad breath and how it\'s treated. Related: <a href="../hizmet/agiz-kokusu.html">Mundgeruch (Halitosis)</a></li>',
    '<li><b>Behandlungsoptionen bei Mundgeruch</b> — Erfahren Sie die Ursachen des Mundgeruchs und wie er behandelt wird. Verwandt: <a href="../hizmet/agiz-kokusu.html">Mundgeruch (Halitosis)</a></li>');

rep('Inlay/Onlay Zahnfüllungen', 'Inlays/Onlays');
rep('Clear Aligners or Braces? A Guide to Kieferorthopädie in Adulthood',
    'Aligner oder Zahnspange? Ein Leitfaden zur Kieferorthopädie im Erwachsenenalter');

rep('&lt;p&gt;&lt;strong&gt;Book a One-to-One Consultation with a Specialist.&lt;/strong&gt;',
    '&lt;p&gt;&lt;strong&gt;Buchen Sie ein persönliches Gespräch mit einer Spezialistin oder einem Spezialisten.&lt;/strong&gt;');
rep('&lt;p&gt;Booking widget: timezone Europe/Istanbul (UTC+3); “Choose a date”; “Choose a time”; Full name; Your concern (optional); “Book Appointment” button.&lt;/p&gt;',
    '&lt;p&gt;Buchungs-Widget: Zeitzone Europe/Istanbul (UTC+3); „Datum wählen“; „Uhrzeit wählen“; Vor- und Nachname; Ihr Anliegen (optional); Schaltfläche „Termin buchen“.&lt;/p&gt;');

/* textarea rehber panelleri (8) */
rep('&lt;li&gt;&lt;strong&gt;Treatment Options for a Missing Tooth&lt;/strong&gt; — Let\'s look at implant and bridge options for your missing teeth together. Related: &lt;a href="/de/hizmet/1-gunde-implant/"&gt;Same-Day Implants&lt;/a&gt;, &lt;a href="/de/hizmet/all-on-4/"&gt;All-on-4-Implantate&lt;/a&gt;, &lt;a href="/de/hizmet/porselen-kron-kopru/"&gt;Crown &amp;amp; Bridge&lt;/a&gt;&lt;/li&gt;',
    '&lt;li&gt;&lt;strong&gt;Behandlungsoptionen beim fehlenden Zahn&lt;/strong&gt; — Sehen wir uns Implantat- und Brückenoptionen für Ihre fehlenden Zähne gemeinsam an. Verwandt: &lt;a href="/de/hizmet/1-gunde-implant/"&gt;Sofortimplantate&lt;/a&gt;, &lt;a href="/de/hizmet/all-on-4/"&gt;All-on-4-Implantate&lt;/a&gt;, &lt;a href="/de/hizmet/porselen-kron-kopru/"&gt;Kronen &amp;amp; Brücken&lt;/a&gt;&lt;/li&gt;');
rep('&lt;li&gt;&lt;strong&gt;Treatment Options if You\'re Not Happy with Your Smile&lt;/strong&gt; — Explore cosmetic solutions with smile design, veneers and zirconia. Related: &lt;a href="/de/hizmet/gulus-tasarimi/"&gt;Smile Design&lt;/a&gt;, &lt;a href="/de/hizmet/porselen-lamina/"&gt;Veneers&lt;/a&gt;, &lt;a href="/de/hizmet/zirkonyum/"&gt;Zirconia&lt;/a&gt;&lt;/li&gt;',
    '&lt;li&gt;&lt;strong&gt;Behandlungsoptionen bei Unzufriedenheit mit dem Lächeln&lt;/strong&gt; — Entdecken Sie ästhetische Lösungen mit Smile Design, Veneers und Zirkon. Verwandt: &lt;a href="/de/hizmet/gulus-tasarimi/"&gt;Smile Design&lt;/a&gt;, &lt;a href="/de/hizmet/porselen-lamina/"&gt;Veneers&lt;/a&gt;, &lt;a href="/de/hizmet/zirkonyum/"&gt;Zirkon&lt;/a&gt;&lt;/li&gt;');
rep('&lt;li&gt;&lt;strong&gt;Treatment Options for Snoring&lt;/strong&gt; — Dentist-led assessment and treatment options for your snoring. Related: &lt;a href="/de/hizmet/horluyorum/"&gt;Snoring Treatment&lt;/a&gt;&lt;/li&gt;',
    '&lt;li&gt;&lt;strong&gt;Behandlungsoptionen beim Schnarchen&lt;/strong&gt; — Zahnärztlich geführte Beurteilung und Behandlungsoptionen für Ihr Schnarchen. Verwandt: &lt;a href="/de/hizmet/horluyorum/"&gt;Schnarchbehandlung&lt;/a&gt;&lt;/li&gt;');
rep('&lt;li&gt;&lt;strong&gt;Treatment Options for Toothache&lt;/strong&gt; — Look into fillings, root canal treatment and clenching care for the conditions behind the pain. Related: &lt;a href="/de/hizmet/dolgu/"&gt;Zahnfüllungen&lt;/a&gt;, &lt;a href="/de/hizmet/kanal-tedavisi/"&gt;Root Canal&lt;/a&gt;, &lt;a href="/de/hizmet/dislerimi-sikiyorum/"&gt;Ich presse die Zähne zusammen&lt;/a&gt;&lt;/li&gt;',
    '&lt;li&gt;&lt;strong&gt;Behandlungsoptionen bei Zahnschmerzen&lt;/strong&gt; — Füllungen, Wurzelbehandlung und die Versorgung des Pressens für die Ursachen hinter dem Schmerz. Verwandt: &lt;a href="/de/hizmet/dolgu/"&gt;Zahnfüllungen&lt;/a&gt;, &lt;a href="/de/hizmet/kanal-tedavisi/"&gt;Wurzelbehandlung&lt;/a&gt;, &lt;a href="/de/hizmet/dislerimi-sikiyorum/"&gt;Ich presse die Zähne zusammen&lt;/a&gt;&lt;/li&gt;');
rep('&lt;li&gt;&lt;strong&gt;Treatment Options for Mundgeruch (Halitosis)&lt;/strong&gt; — Learn about the causes of bad breath and how it\'s treated. Related: &lt;a href="/de/hizmet/agiz-kokusu/"&gt;Mundgeruch (Halitosis)&lt;/a&gt;&lt;/li&gt;',
    '&lt;li&gt;&lt;strong&gt;Behandlungsoptionen bei Mundgeruch&lt;/strong&gt; — Erfahren Sie die Ursachen des Mundgeruchs und wie er behandelt wird. Verwandt: &lt;a href="/de/hizmet/agiz-kokusu/"&gt;Mundgeruch (Halitosis)&lt;/a&gt;&lt;/li&gt;');
rep('&lt;li&gt;&lt;strong&gt;Treatment Options for a Broken Tooth&lt;/strong&gt; — Implant, zirconia and inlay/onlay filling options for broken teeth. Related: &lt;a href="/de/hizmet/zirkonyum/"&gt;Zirconia&lt;/a&gt;, &lt;a href="/de/hizmet/inlay-onlay-dolgular/"&gt;Inlays/Onlays&lt;/a&gt;&lt;/li&gt;',
    '&lt;li&gt;&lt;strong&gt;Behandlungsoptionen beim abgebrochenen Zahn&lt;/strong&gt; — Implantat-, Zirkon- und Inlay/Onlay-Optionen für abgebrochene Zähne. Verwandt: &lt;a href="/de/hizmet/zirkonyum/"&gt;Zirkon&lt;/a&gt;, &lt;a href="/de/hizmet/inlay-onlay-dolgular/"&gt;Inlays/Onlays&lt;/a&gt;&lt;/li&gt;');
rep('&lt;li&gt;&lt;strong&gt;Treatment Options for Cosmetic Dentistry&lt;/strong&gt; — Options for a cosmetic transformation with veneers, smile design and whitening. Related: &lt;a href="/de/hizmet/porselen-lamina/"&gt;Veneers&lt;/a&gt;, &lt;a href="/de/hizmet/gulus-tasarimi/"&gt;Smile Design&lt;/a&gt;, &lt;a href="/de/hizmet/dis-beyazlatma/"&gt;Teeth Whitening&lt;/a&gt;&lt;/li&gt;',
    '&lt;li&gt;&lt;strong&gt;Behandlungsoptionen der ästhetischen Zahnmedizin&lt;/strong&gt; — Optionen für die ästhetische Verwandlung mit Veneers, Smile Design und Bleaching. Verwandt: &lt;a href="/de/hizmet/porselen-lamina/"&gt;Veneers&lt;/a&gt;, &lt;a href="/de/hizmet/gulus-tasarimi/"&gt;Smile Design&lt;/a&gt;, &lt;a href="/de/hizmet/dis-beyazlatma/"&gt;Bleaching&lt;/a&gt;&lt;/li&gt;');
rep('&lt;li&gt;&lt;strong&gt;Treatment Options for Gum Problems&lt;/strong&gt; — A healthy gum line with gum aesthetics and a scale and polish. Related: &lt;a href="/de/hizmet/dis-eti-estetigi/"&gt;Zahnfleischästhetik&lt;/a&gt;, &lt;a href="/de/hizmet/dis-tasi-temizligi/"&gt;Scale and Polish&lt;/a&gt;&lt;/li&gt;',
    '&lt;li&gt;&lt;strong&gt;Behandlungsoptionen bei Zahnfleischproblemen&lt;/strong&gt; — Ein gesunder Zahnfleischverlauf mit Zahnfleischästhetik und professioneller Zahnreinigung. Verwandt: &lt;a href="/de/hizmet/dis-eti-estetigi/"&gt;Zahnfleischästhetik&lt;/a&gt;, &lt;a href="/de/hizmet/dis-tasi-temizligi/"&gt;Professionelle Zahnreinigung&lt;/a&gt;&lt;/li&gt;');

rep('&lt;p&gt;&lt;em&gt;Every treatment starts with the right assessment and a personalised plan.&lt;/em&gt;&lt;/p&gt;',
    '&lt;p&gt;&lt;em&gt;Jede Behandlung beginnt mit der richtigen Beurteilung und einem persönlichen Plan.&lt;/em&gt;&lt;/p&gt;');

/* textarea süreç listesi (ol, numarasız) */
rep('&lt;li&gt;&lt;strong&gt;Send Your Photos&lt;/strong&gt; — Send us your photos and we\'ll carry out a pre-assessment.&lt;/li&gt;',
    '&lt;li&gt;&lt;strong&gt;Senden Sie Ihre Fotos&lt;/strong&gt; — Schicken Sie uns Ihre Fotos, und wir führen eine Voranalyse durch.&lt;/li&gt;');
rep('&lt;li&gt;&lt;strong&gt;Online Consultation&lt;/strong&gt; — Our specialists get in touch and talk you through your options.&lt;/li&gt;',
    '&lt;li&gt;&lt;strong&gt;Online-Beratung&lt;/strong&gt; — Unsere Spezialistinnen und Spezialisten melden sich und gehen Ihre Optionen mit Ihnen durch.&lt;/li&gt;');
rep('&lt;li&gt;&lt;strong&gt;A Personalised Plan&lt;/strong&gt; — A treatment plan is drawn up around what suits you best.&lt;/li&gt;',
    '&lt;li&gt;&lt;strong&gt;Ein persönlicher Plan&lt;/strong&gt; — Der Behandlungsplan entsteht um das, was am besten zu Ihnen passt.&lt;/li&gt;');
rep('&lt;li&gt;&lt;strong&gt;Treatment&lt;/strong&gt; — Your planned treatment is carried out in comfort.&lt;/li&gt;',
    '&lt;li&gt;&lt;strong&gt;Behandlung&lt;/strong&gt; — Ihre geplante Behandlung wird komfortabel durchgeführt.&lt;/li&gt;');
rep('&lt;li&gt;&lt;strong&gt;Your New Smile&lt;/strong&gt; — Enjoy the smile you\'ve been dreaming of.&lt;/li&gt;',
    '&lt;li&gt;&lt;strong&gt;Ihr neues Lächeln&lt;/strong&gt; — Genießen Sie das Lächeln, von dem Sie geträumt haben.&lt;/li&gt;');
rep('&lt;p&gt;&lt;strong&gt;Take the first step!&lt;/strong&gt; &lt;a href="#treatment-journey-widget"&gt;Send a Photo&lt;/a&gt;&lt;/p&gt;',
    '&lt;p&gt;&lt;strong&gt;Machen Sie den ersten Schritt!&lt;/strong&gt; &lt;a href="#treatment-journey-widget"&gt;Foto senden&lt;/a&gt;&lt;/p&gt;');

/* textarea ön-teşhis formu (regex — tırnak/apostrof biçiminden bağımsız) */
const rx = /&lt;p&gt;&lt;strong&gt;Digital pre-assessment form\.&lt;\/strong&gt;[\s\S]*?&lt;\/p&gt;/;
if (rx.test(s)) {
  s = s.replace(rx, '&lt;p&gt;&lt;strong&gt;Digitales Voranalyse-Formular.&lt;/strong&gt; Felder: Röntgen-/Foto-Upload — „Datei auswählen“ (max. 15 MB); Vor- und Nachname; E-Mail-Adresse; Ihr Anliegen — Dropdown („Wählen Sie Ihr Anliegen“): Ich habe Zahnschmerzen; Ich habe einen abgebrochenen oder gerissenen Zahn; Mein Zahnfleisch blutet oder ist geschwollen; Mir fehlt ein Zahn; Ich habe einen lockeren Zahn; Meine Zähne sind heiß-/kaltempfindlich; Ich vermute Karies oder eine schmerzende Füllung; Ich bin mit meiner Zahnfarbe unzufrieden; Meine Zähne stehen schief oder mit Lücken; Ich möchte mein Lächeln schöner machen; Ich habe Weisheitszahnschmerzen oder eine Schwellung; Ich denke über ein Implantat oder festen Zahnersatz nach; Meine Prothese sitzt unbequem oder passt nicht richtig; Ich habe Mundgeruch oder Zahnsteinbildung; Ich habe Kiefergelenkschmerzen oder Kieferblockaden; Sonstiges / Ich bin mir nicht sicher; Einwilligungs-Häkchen: „Die von Ihnen gesendeten Angaben sind durch unseren &lt;a href="/de/kvkk/"&gt;KVKK-Informationstext&lt;/a&gt; und unsere &lt;a href="/de/gizlilik-sozlesmesi/"&gt;Datenschutzerklärung&lt;/a&gt; geschützt.“; Schaltfläche „Bewerbung absenden“.&lt;/p&gt;');
} else eksik.push('REGEX: Digital pre-assessment form');

fs.writeFileSync(F, s);
console.log('eksik: ' + eksik.length);
eksik.forEach(x => console.log('  - ' + x));
