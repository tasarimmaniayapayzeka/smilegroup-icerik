/* Smile Group içerik render motoru
   Tek veri kaynağı: window.ARTICLE = { slug, title, breadcrumb[], lead, faqs[{q,a(html)}], closing(html), editor{date,name} }
   Üretir: (1) önizleme akordiyonları  (2) WP'ye yapıştırılacak ham HTML  (3) FAQPage JSON-LD  */
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

  /* ---- üst şerit ---- */
  var band = el("div", "topband");
  band.innerHTML =
    '<div class="in"><a class="brand" href="../index.html">' +
    '<span class="logo">S</span><span><span class="name">SMILE<span> GROUP</span></span><br>' +
    '<span class="sub">Aesthetic &amp; Dental Clinic</span></span></a>' +
    '<span class="tag">İçerik önizleme · <b>SEO/GEO uyumlu</b></span></div>';
  document.body.appendChild(band);

  var main = el("main");

  /* ---- breadcrumb + başlık + lead ---- */
  if (A.breadcrumb && A.breadcrumb.length) {
    var last = A.breadcrumb.length - 1;
    var cr = A.breadcrumb.map(function (b, i) {
      return i === last ? '<span>' + b + '</span>' : b;
    }).join("  ›  ");
    main.appendChild(el("div", "crumb", cr));
  }
  main.appendChild(el("h1", null, A.title));
  if (A.lead) main.appendChild(el("div", "lead", A.lead));

  /* ---- akordiyonlar + yapıştırılacak html ---- */
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
        "Bilgilendirme: Bu içerik genel bilgilendirme amaçlıdır; teşhis ve tedavi kararı hekim muayenesiyle kişiye özel verilir. " +
        "Son güncelleme: " + A.editor.date + " · İçerik onayı: " + A.editor.name + ".")
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
  // sayfanın kendisi de geçerli schema taşısın
  var live = document.createElement("script");
  live.type = "application/ld+json";
  live.textContent = JSON.stringify(schema);
  document.head.appendChild(live);

  /* ---- WP'ye yapıştır kutuları ---- */
  var paste = el("section", "paste");
  paste.innerHTML =
    '<h2>📋 WordPress\'e aktarım</h2>' +
    '<div class="note">1) Aşağıdaki HTML\'i hizmet sayfasına <b>Özel HTML (Custom HTML)</b> bloğu olarak yapıştır. ' +
    '2) FAQ şemasını <b>&lt;head&gt;</b> alanına ya da bir schema eklentisine ekle (Google zengin sonuç + sesli arama için).</div>';

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
  paste.appendChild(buildBlock("Akordiyon HTML (gövde)", pasteHTML.trim(), "220px"));
  paste.appendChild(buildBlock("FAQPage şeması (JSON-LD)", schemaStr, "160px"));
  main.appendChild(paste);

  document.body.appendChild(main);

  var foot = el("div", "foot",
    "<span>Smile Group · hizmet içerik önizleme — iç kullanım.</span>" +
    '<span><a href="../index.html">← Tüm hizmetler</a></span>');
  document.body.appendChild(foot);
})();
