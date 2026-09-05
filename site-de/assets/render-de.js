/* Smile Group DE content render engine
   Single source: window.ARTICLE = { slug, deSlug, title, trTitle, breadcrumb[], lead, faqs[{q,a(html)}], closing(html), editor{date,name} }
   Produces: (1) preview accordions  (2) raw HTML to paste into WordPress  (3) FAQPage JSON-LD  */
(function () {
  var A = window.ARTICLE;
  if (!A) return;
  document.title = A.title + " — Smile Group";

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
    '<span class="sub">Klinik f&uuml;r Zahnmedizin &amp; &Auml;sthetik</span></span></a>' +
    '<span class="tag">Inhaltsvorschau · <b>SEO/GEO-fertig</b></span></div>';
  document.body.appendChild(band);

  var main = el("main");

  /* ---- breadcrumb + title + lead ---- */
  if (A.breadcrumb && A.breadcrumb.length) {
    var last = A.breadcrumb.length - 1;
    var cr = A.breadcrumb.map(function (b, i) {
      return i === last ? '<span>' + b + '</span>' : b;
    }).join("  ›  ");
    main.appendChild(el("div", "crumb", cr));
  }
  main.appendChild(el("h1", null, A.title));
  if (A.trTitle) main.appendChild(el("div", "tr-orig", "TR-Original: <em>" + A.trTitle + "</em>"));
  if (A.lead) main.appendChild(el("div", "lead", A.lead));

  /* ---- hero image (if present) ---- */
  var imgSlug = A.deSlug || A.slug;
  var imgBase = A.deSlug ? "../images/" : "../../site/gorseller/";
  var hero = new Image();
  hero.className = "hero";
  hero.src = imgBase + imgSlug + "-detail-880x500.jpg";
  hero.alt = A.title + " — Titelbild der Behandlungsseite bei Smile Group";
  hero.onerror = function () { hero.remove(); };
  main.appendChild(hero);

  /* ---- accordions + paste HTML ---- */
  var wrap = el("div", "acc-wrap");
  var pasteHTML = "";
  (A.faqs || []).forEach(function (f) {
    var d = el("details", "acc");
    d.appendChild(el("summary", null, f.q));
    d.appendChild(el("div", "ans", "<p>" + f.a.trim() + "</p>"));
    wrap.appendChild(d);
    pasteHTML +=
      "<details>\n  <summary>" + f.q + "</summary>\n  <p>" + f.a.trim() + "</p>\n</details>\n";
  });
  main.appendChild(wrap);

  if (A.closing) main.appendChild(el("div", "closing", A.closing));
  if (A.editor)
    main.appendChild(
      el("div", "editor",
        "Hinweis: Diese Inhalte dienen ausschließlich der allgemeinen Information; Diagnose- und Therapieentscheidungen werden individuell nach einer klinischen Untersuchung getroffen. " +
        "Zuletzt aktualisiert: " + A.editor.date + " · Fachlich geprüft von: " + A.editor.name + ".")
    );

  /* ---- FAQPage JSON-LD ---- */
  var schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": (A.faqs || []).map(function (f) {
      return {
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": stripHtml(f.a) }
      };
    })
  };
  var schemaStr = '<script type="application/ld+json">\n' + JSON.stringify(schema, null, 2) + "\n<\/script>";
  var live = document.createElement("script");
  live.type = "application/ld+json";
  live.textContent = JSON.stringify(schema);
  document.head.appendChild(live);

  /* ---- paste-into-WordPress boxes ---- */
  var paste = el("section", "paste");
  paste.innerHTML =
    '<h2>📋 In WordPress übernehmen</h2>' +
    '<div class="note">1) Fügen Sie das folgende HTML als <b>Custom-HTML</b>-Block in die Behandlungsseite ein. ' +
    '2) Hinterlegen Sie das FAQ-Schema im <b>&lt;head&gt;</b> oder über ein Schema-Plugin (für Google Rich Results + Sprachsuche).</div>';

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
  paste.appendChild(buildBlock("Akkordeon-HTML (Seiteninhalt)", pasteHTML.trim(), "220px"));
  paste.appendChild(buildBlock("FAQPage-Schema (JSON-LD)", schemaStr, "160px"));

  /* ---- page images: download + upload to WP media library ---- */
  var imgs = el("div", "imgs");
  imgs.innerHTML =
    '<div class="row"><span class="lab">Seitenbilder</span></div>' +
    '<div class="note">Beide Bilder herunterladen und in die WordPress-Mediathek hochladen: ' +
    '<b>Cover</b> erscheint auf der Karte der Behandlungsliste, <b>Detail</b> oben auf der Seite. ' +
    'Zum Herunterladen aufs Bild klicken (oder Rechtsklick → Speichern unter).</div>' +
    '<div class="grid" style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start">' +
    '<a href="' + imgBase + imgSlug + '-cover-300x400.jpg" download="' + imgSlug + '-cover-300x400.jpg"' +
    ' style="display:inline-block;text-align:center;text-decoration:none">' +
    '<img src="' + imgBase + imgSlug + '-cover-300x400.jpg" alt="' + A.title + ' — Coverbild" loading="lazy"' +
    ' width="120" height="160" style="display:block;width:120px;height:160px;object-fit:cover;border-radius:8px"' +
    ' onerror="this.parentNode.parentNode.parentNode.style.display=\'none\'">' +
    '<span style="display:block;margin-top:7px;font-size:12.5px;font-weight:700;color:#33465f">Cover · 300×400</span></a>' +
    '<a href="' + imgBase + imgSlug + '-detail-880x500.jpg" download="' + imgSlug + '-detail-880x500.jpg"' +
    ' style="display:inline-block;text-align:center;text-decoration:none">' +
    '<img src="' + imgBase + imgSlug + '-detail-880x500.jpg" alt="' + A.title + ' — Detailbild" loading="lazy"' +
    ' width="282" height="160" style="display:block;width:282px;height:160px;object-fit:cover;border-radius:8px">' +
    '<span style="display:block;margin-top:7px;font-size:12.5px;font-weight:700;color:#33465f">Detail · 880×500</span></a>' +
    '</div>';
  paste.appendChild(imgs);
  main.appendChild(paste);

  document.body.appendChild(main);

  var foot = el("div", "foot",
    "<span>Smile Group · DE-Inhaltsvorschau — nur für den internen Gebrauch.</span>" +
    '<span><a href="../index.html">← Alle Behandlungen</a></span>');
  document.body.appendChild(foot);
})();
