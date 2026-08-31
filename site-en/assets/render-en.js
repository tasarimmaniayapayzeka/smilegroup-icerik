/* Smile Group EN content render engine
   Single source: window.ARTICLE = { slug, title, breadcrumb[], lead, faqs[{q,a(html)}], closing(html), editor{date,name} }
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
    '<span class="sub">Aesthetic &amp; Dental Clinic</span></span></a>' +
    '<span class="tag">Content preview · <b>SEO/GEO-ready</b></span></div>';
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
  if (A.trTitle) main.appendChild(el("div", "tr-orig", "TR original: <em>" + A.trTitle + "</em>"));
  if (A.lead) main.appendChild(el("div", "lead", A.lead));

  /* ---- hero image (if present) ---- */
  var imgSlug = A.enSlug || A.slug;
  var imgBase = A.enSlug ? "../images/" : "../../site/gorseller/";
  var hero = new Image();
  hero.className = "hero";
  hero.src = imgBase + imgSlug + "-detail-880x500.jpg";
  hero.alt = A.title + " — Smile Group treatment page hero image";
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
        "Information: this content is for general information only; diagnosis and treatment decisions are made individually following a clinical examination. " +
        "Last updated: " + A.editor.date + " · Clinically reviewed by: " + A.editor.name + ".")
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
    '<h2>📋 Import to WordPress</h2>' +
    '<div class="note">1) Paste the HTML below into the service page as a <b>Custom HTML</b> block. ' +
    '2) Add the FAQ schema to the <b>&lt;head&gt;</b> or a schema plugin (for Google rich results + voice search).</div>';

  function buildBlock(label, value, min) {
    var b = el("div", "block");
    var row = el("div", "row");
    row.appendChild(el("span", "lab", label));
    var btn = el("button", "copybtn", "Copy");
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
      btn.textContent = "Copied ✓";
      btn.classList.add("ok");
      setTimeout(function () { btn.textContent = "Copy"; btn.classList.remove("ok"); }, 1600);
    });
    return b;
  }
  paste.appendChild(buildBlock("Accordion HTML (body)", pasteHTML.trim(), "220px"));
  paste.appendChild(buildBlock("FAQPage schema (JSON-LD)", schemaStr, "160px"));

  /* ---- page images: download + upload to WP media library ---- */
  var imgs = el("div", "imgs");
  imgs.innerHTML =
    '<div class="row"><span class="lab">Page images</span></div>' +
    '<div class="note">Download both and upload to the WP media library: ' +
    '<b>cover</b> is used on the service list card, <b>detail</b> at the top of the page. ' +
    'Click an image to download it (or right-click → Save As).</div>' +
    '<div class="grid" style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start">' +
    '<a href="' + imgBase + imgSlug + '-cover-300x400.jpg" download="' + imgSlug + '-cover-300x400.jpg"' +
    ' style="display:inline-block;text-align:center;text-decoration:none">' +
    '<img src="' + imgBase + imgSlug + '-cover-300x400.jpg" alt="' + A.title + ' — cover image" loading="lazy"' +
    ' width="120" height="160" style="display:block;width:120px;height:160px;object-fit:cover;border-radius:8px"' +
    ' onerror="this.parentNode.parentNode.parentNode.style.display=\'none\'">' +
    '<span style="display:block;margin-top:7px;font-size:12.5px;font-weight:700;color:#33465f">cover · 300×400</span></a>' +
    '<a href="' + imgBase + imgSlug + '-detail-880x500.jpg" download="' + imgSlug + '-detail-880x500.jpg"' +
    ' style="display:inline-block;text-align:center;text-decoration:none">' +
    '<img src="' + imgBase + imgSlug + '-detail-880x500.jpg" alt="' + A.title + ' — detail image" loading="lazy"' +
    ' width="282" height="160" style="display:block;width:282px;height:160px;object-fit:cover;border-radius:8px">' +
    '<span style="display:block;margin-top:7px;font-size:12.5px;font-weight:700;color:#33465f">detail · 880×500</span></a>' +
    '</div>';
  paste.appendChild(imgs);
  main.appendChild(paste);

  document.body.appendChild(main);

  var foot = el("div", "foot",
    "<span>Smile Group · EN content preview — internal use.</span>" +
    '<span><a href="../index.html">← All treatments</a></span>');
  document.body.appendChild(foot);
})();
