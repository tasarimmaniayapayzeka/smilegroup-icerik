/* Smile Group DE BLOG render engine
   Single source: window.BLOG = { slug, title, metaDescription, lead, sections[{h2,html}], faqs[{q,a}], closing, editor{date,name} }
   Produces: (1) article preview  (2) raw HTML to paste into WordPress  (3) Article + FAQPage JSON-LD  */
(function () {
  var A = window.BLOG;
  if (!A) return;
  document.title = A.title + " — Smile Group Blog";

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function stripHtml(h) {
    var t = document.createElement("div");
    t.innerHTML = h;
    return (t.textContent || "").replace(/\s+/g, " ").trim();
  }

  /* ---- top band ---- */
  var band = el("div", "topband");
  band.innerHTML =
    '<div class="in"><a class="brand" href="../index.html">' +
    '<span class="logo">S</span><span><span class="name">SMILE<span> GROUP</span></span><br>' +
    '<span class="sub">Klinik für Zahnmedizin &amp; Ästhetik</span></span></a>' +
    '<span class="tag">Blog-Vorschau · <b>SEO/GEO-fertig</b></span></div>';
  document.body.appendChild(band);

  var main = el("main");
  main.appendChild(el("div", "crumb", 'Startseite  ›  Blog  ›  <span>' + A.title + '</span>'));
  main.appendChild(el("h1", null, A.title));
  if (A.trTitle) main.appendChild(el("div", "tr-orig", "TR-Original: <em>" + A.trTitle + "</em>"));
  if (A.lead) main.appendChild(el("div", "lead", A.lead));

  /* ---- hero image (if present) ---- */
  var imgSlug = A.deSlug || A.slug;
  var imgBase = A.deSlug ? "../images/" : "../../site/gorseller/";
  var hero = new Image();
  hero.className = "hero";
  hero.src = imgBase + imgSlug + "-detail-880x500.jpg";
  hero.alt = A.title + " — Titelbild des Smile-Group-Blogartikels";
  hero.onerror = function () { hero.remove(); };
  main.appendChild(hero);

  /* ---- article body + paste HTML ---- */
  var pasteHTML = "";
  (A.sections || []).forEach(function (s) {
    var sec = el("section", "blog-sec");
    sec.appendChild(el("h2", null, s.h2));
    sec.appendChild(el("div", "blog-body", s.html));
    main.appendChild(sec);
    pasteHTML += "<h2>" + s.h2 + "</h2>\n" + s.html.trim() + "\n";
  });

  /* ---- FAQ accordions ---- */
  if (A.faqs && A.faqs.length) {
    var sss = el("section", "blog-sec");
    sss.appendChild(el("h2", null, "Häufig gestellte Fragen"));
    var wrap = el("div", "acc-wrap");
    pasteHTML += "<h2>Häufig gestellte Fragen</h2>\n";
    A.faqs.forEach(function (f) {
      var d = el("details", "acc");
      d.appendChild(el("summary", null, f.q));
      d.appendChild(el("div", "ans", "<p>" + f.a.trim() + "</p>"));
      wrap.appendChild(d);
      pasteHTML += "<details>\n  <summary>" + f.q + "</summary>\n  <p>" + f.a.trim() + "</p>\n</details>\n";
    });
    sss.appendChild(wrap);
    main.appendChild(sss);
  }

  if (A.closing) {
    main.appendChild(el("div", "closing", A.closing));
    pasteHTML += "<p>" + A.closing.trim() + "</p>\n";
  }
  if (A.editor)
    main.appendChild(
      el("div", "editor",
        "Hinweis: Diese Inhalte dienen ausschließlich der allgemeinen Information; Diagnose- und Therapieentscheidungen werden individuell nach einer klinischen Untersuchung getroffen. " +
        "Zuletzt aktualisiert: " + A.editor.date + " · Fachlich geprüft von: " + A.editor.name + ".")
    );

  /* ---- JSON-LD: Article + FAQPage ---- */
  var artSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": A.title,
    "description": A.metaDescription || "",
    "author": { "@type": "Organization", "name": "Smile Group Aesthetic & Dental Clinic" },
    "publisher": { "@type": "Organization", "name": "Smile Group Aesthetic & Dental Clinic" },
    "dateModified": (A.editor && A.editor.date) || ""
  };
  var faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": (A.faqs || []).map(function (f) {
      return { "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": stripHtml(f.a) } };
    })
  };
  var schemaStr =
    '<script type="application/ld+json">\n' + JSON.stringify(artSchema, null, 2) + "\n<\/script>\n" +
    '<script type="application/ld+json">\n' + JSON.stringify(faqSchema, null, 2) + "\n<\/script>";
  [artSchema, faqSchema].forEach(function (s) {
    var live = document.createElement("script");
    live.type = "application/ld+json";
    live.textContent = JSON.stringify(s);
    document.head.appendChild(live);
  });

  /* ---- paste-into-WordPress boxes ---- */
  var paste = el("section", "paste");
  paste.innerHTML =
    '<h2>📋 In WordPress übernehmen</h2>' +
    '<div class="note">1) Fügen Sie das HTML unten als <b>Custom-HTML</b>-Block in den Blogbeitrag ein (den H1-Titel druckt WordPress selbst). ' +
    '2) Fügen Sie die Schemas in den <b>&lt;head&gt;</b> oder ein Schema-Plugin ein.</div>';

  function buildBlock(label, value, min) {
    var b = el("div", "block");
    var row = el("div", "row");
    row.appendChild(el("span", "lab", label));
    var btn = el("button", "copybtn", "Kopieren");
    row.appendChild(btn);
    b.appendChild(row);
    var ta = document.createElement("textarea");
    ta.readOnly = true;
    ta.value = value;
    if (min) ta.style.minHeight = min;
    b.appendChild(ta);
    btn.addEventListener("click", function () {
      ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      if (navigator.clipboard) navigator.clipboard.writeText(value).catch(function(){});
      btn.textContent = "Kopiert ✓";
      btn.classList.add("ok");
      setTimeout(function () { btn.textContent = "Kopieren"; btn.classList.remove("ok"); }, 1600);
    });
    return b;
  }
  paste.appendChild(buildBlock("Artikel-HTML (Body)", pasteHTML.trim(), "240px"));
  paste.appendChild(buildBlock("Article- + FAQPage-Schemas (JSON-LD)", schemaStr, "160px"));

  /* ---- article images: download + upload to WP media library ---- */
  var imgs = el("div", "imgs");
  imgs.innerHTML =
    '<div class="row"><span class="lab">Artikelbilder</span></div>' +
    '<div class="note">Beide herunterladen und in die WP-Mediathek hochladen: ' +
    '<b>cover</b> wird auf der Bloglisten-Karte / als Beitragsbild verwendet, <b>detail</b> oben im Artikel. ' +
    'Zum Herunterladen aufs Bild klicken.</div>' +
    '<div class="grid" style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start">' +
    '<a href="' + imgBase + imgSlug + '-cover-300x400.jpg" download="' + imgSlug + '-cover-300x400.jpg"' +
    ' style="display:inline-block;text-align:center;text-decoration:none">' +
    '<img src="' + imgBase + imgSlug + '-cover-300x400.jpg" alt="' + A.title + ' — Cover-Bild" loading="lazy"' +
    ' width="120" height="160" style="display:block;width:120px;height:160px;object-fit:cover;border-radius:8px"' +
    ' onerror="this.parentNode.parentNode.parentNode.style.display=\'none\'">' +
    '<span style="display:block;margin-top:7px;font-size:12.5px;font-weight:700;color:#33465f">cover · 300×400</span></a>' +
    '<a href="' + imgBase + imgSlug + '-detail-880x500.jpg" download="' + imgSlug + '-detail-880x500.jpg"' +
    ' style="display:inline-block;text-align:center;text-decoration:none">' +
    '<img src="' + imgBase + imgSlug + '-detail-880x500.jpg" alt="' + A.title + ' — Detailbild" loading="lazy"' +
    ' width="282" height="160" style="display:block;width:282px;height:160px;object-fit:cover;border-radius:8px">' +
    '<span style="display:block;margin-top:7px;font-size:12.5px;font-weight:700;color:#33465f">detail · 880×500</span></a>' +
    '</div>';
  paste.appendChild(imgs);
  main.appendChild(paste);

  document.body.appendChild(main);

  var foot = el("div", "foot",
    "<span>Smile Group · Blog-Vorschau — interner Gebrauch.</span>" +
    '<span><a href="index.html">← Alle Artikel</a> · <a href="../index.html">Behandlungsinhalte</a></span>');
  document.body.appendChild(foot);
})();
