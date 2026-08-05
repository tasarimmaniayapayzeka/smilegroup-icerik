/* Smile Group BLOG render motoru
   Tek veri kaynağı: window.BLOG = { slug, title, metaDescription, lead, sections[{h2,html}], faqs[{q,a}], closing, editor{date,name} }
   Üretir: (1) makale önizleme  (2) WP'ye yapıştırılacak ham HTML  (3) Article + FAQPage JSON-LD  */
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

  /* ---- üst şerit ---- */
  var band = el("div", "topband");
  band.innerHTML =
    '<div class="in"><a class="brand" href="../index.html">' +
    '<span class="logo">S</span><span><span class="name">SMILE<span> GROUP</span></span><br>' +
    '<span class="sub">Aesthetic &amp; Dental Clinic</span></span></a>' +
    '<span class="tag">Blog önizleme · <b>SEO/GEO uyumlu</b></span></div>';
  document.body.appendChild(band);

  var main = el("main");
  main.appendChild(el("div", "crumb", 'Anasayfa  ›  Blog  ›  <span>' + A.title + '</span>'));
  main.appendChild(el("h1", null, A.title));
  if (A.lead) main.appendChild(el("div", "lead", A.lead));

  /* ---- makale gövdesi + WP HTML ---- */
  var pasteHTML = "";
  (A.sections || []).forEach(function (s) {
    var sec = el("section", "blog-sec");
    sec.appendChild(el("h2", null, s.h2));
    sec.appendChild(el("div", "blog-body", s.html));
    main.appendChild(sec);
    pasteHTML += "<h2>" + s.h2 + "</h2>\n" + s.html.trim() + "\n";
  });

  /* ---- SSS akordiyonları ---- */
  if (A.faqs && A.faqs.length) {
    var sss = el("section", "blog-sec");
    sss.appendChild(el("h2", null, "Sık Sorulan Sorular"));
    var wrap = el("div", "acc-wrap");
    pasteHTML += "<h2>Sık Sorulan Sorular</h2>\n";
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
        "Bilgilendirme: Bu içerik genel bilgilendirme amaçlıdır; teşhis ve tedavi kararı hekim muayenesiyle kişiye özel verilir. " +
        "Son güncelleme: " + A.editor.date + " · İçerik onayı: " + A.editor.name + ".")
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

  /* ---- WP'ye yapıştır kutuları ---- */
  var paste = el("section", "paste");
  paste.innerHTML =
    '<h2>📋 WordPress\'e aktarım</h2>' +
    '<div class="note">1) Aşağıdaki HTML\'i blog yazısına <b>Özel HTML (Custom HTML)</b> bloğu olarak yapıştırın (başlık H1\'i WP kendisi basar). ' +
    '2) Şemaları <b>&lt;head&gt;</b> alanına ya da schema eklentisine ekleyin.</div>';

  function buildBlock(label, value, min) {
    var b = el("div", "block");
    var row = el("div", "row");
    row.appendChild(el("span", "lab", label));
    var btn = el("button", "copybtn", "Kopyala");
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
      btn.textContent = "Kopyalandı ✓";
      btn.classList.add("ok");
      setTimeout(function () { btn.textContent = "Kopyala"; btn.classList.remove("ok"); }, 1600);
    });
    return b;
  }
  paste.appendChild(buildBlock("Yazı HTML (gövde)", pasteHTML.trim(), "240px"));
  paste.appendChild(buildBlock("Article + FAQPage şemaları (JSON-LD)", schemaStr, "160px"));
  main.appendChild(paste);

  document.body.appendChild(main);

  var foot = el("div", "foot",
    "<span>Smile Group · blog önizleme — iç kullanım.</span>" +
    '<span><a href="index.html">← Tüm yazılar</a> · <a href="../index.html">Tedavi içerikleri</a></span>');
  document.body.appendChild(foot);
})();
