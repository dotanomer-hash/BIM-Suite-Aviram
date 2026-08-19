/* oYmer VR site - restores interactions lost when Base44's React was stripped:
   services dropdown, FAQ accordion (+open frame), mobile menu, scroll animations,
   and a self-hosted accessibility menu. Vanilla JS, no dependencies. */

window.OYMER_FAQ = [
  "מציאות מדומה (VR) היא טכנולוגיה שמכניסה את המשתמש לתוך סביבה תלת־מימדית \"כאילו הוא נמצא שם\". באדריכלות זה מאפשר לחוות חלל בקנה מידה 1:1, להבין פרופורציות, זרימה ותחושה מרחבית - לפני הבנייה.",
  "היתרון המרכזי הוא מעבר מ\"דמיון מתוך שרטוט\" לחוויה מרחבית אמיתית. כך קל יותר לזהות בזמן: מסדרון צר, חלון גבוה מדי, זרימה לא נכונה, קשרי מבט, פרופורציות ותחושת מרחב כללית. כשזה מתגלה מוקדם - התיקון מהיר וזול יותר.",
  "כי VR מפחית אי־הבנות, \"מיישר קו\" בין צוותי תכנון ובין אדריכל-לקוח, ומקצר זמן החלטות. בנוסף - זו חוויה רגשית חזקה שמעלה אמון וביטחון בהחלטות התכנון.",
  "כמעט בכל פרויקט שבו חשוב להבין חלל לפני ביצוע: דירות ובתים פרטיים, משרדים, מסחר, לובאים, מבני ציבור, וגם פרויקטים יזמיים שבהם נדרש שילוב של תכנון + מכירה/שיווק.",
  "כן. סיור VR (ובעיקר סיור מוכן מראש) הוא כלי מצוין להצגת הפתרון המוצע ללקוח, להמחשה ברורה של ערך הפרויקט וליצירת \"וואו\". מתאים למצגות מכירה, שיווק פרויקטים והדגמות.",
  "אין צורך בידע מוקדם. המערכת פשוטה לתפעול ומלווה בהדרכה ברורה, כך שגם משתמשים חדשים יכולים להתנסות ולחוות סיור וירטואלי בקלות. כמובן שככל שצוברים יותר שעות בתוך סביבת ה-VR כך משתפרת תחושת הנוחות.",
  "לא בהכרח. ניתן לבצע סיור דינמי גם מרחוק ולהצטרף ממחשב/טאבלט/טלפון. יחד עם זאת, החוויה המלאה מתקבלת בתוך החלל הוירטואלי בעת חבישת קסדת VR.",
  "סוג הסיור נגזר מצרכי הפרויקט. מטרתו העיקרית של סיור דינמי - תכנון אדריכלי בחלל וירטואלי, שיתוף פעולה בין אנשי צוות, מציאת בעיות ועוד. מטרתו העיקרית של סיור מוכן מראש - הצגת הפתרון המוצע ללקוח, והוא מיועד להתרשמות ויזואלית מהחלל המתוכנן לפני בנייתו בפועל.",
  "תלוי בסוג הסיור. בסיור מודרך שעה עד שעתיים. בסיור מוכן מראש הלקוח קובע את קצב ההתקדמות.",
  /* --- products block (FAQ.html, same order as the questions there) --- */
  "חבילה של ארבעה מוצרים על קו ייצור אחד - מהמודל ברוויט ועד ההחלטה בתוך ה-VR: oYmer DecisionMaker (פגישת אישור בקנה מידה 1:1), oYmer Viewer (מודל ה-BIM בתוך ה-VR), oYmer Family Creator (יצירת משפחות דינמיות לרוויט) ו-oYmer Type Studio (יצירת טיפוסים חדשים בתוך רוויט). לצידם: oYmer VR Tours (סיורי 360°) ו-oYmer VR Lab (מעבדת המחקר והפיתוח שלנו).",
  "פגישת אישור בקנה מידה 1:1. הלקוח נכנס לאותו חלל שטרם נבנה, בגודל אמיתי - לא מצגת, הוא עומד בפנים - ומחליט מתוך ה-VR: מחליף גימור, מחליף ריהוט, מזיז חלון. אין \"לא הבנתי\" ואין \"לא ראיתי\". ההחלטות חוזרות אל קובץ הרוויט שלכם יחד עם רשומת האישור - לא לענן של אף אחד.",
  "לא. ההחלטות נכתבות לעותק חדש של הקובץ (Save As): הקיר נסגר, החלון זז ורשומת האישור נשמרת - והמקור נשאר בדיוק כפי שהיה. המודל נשאר אצלכם, במשרד.",
  "להיות שם - לראות, להרגיש, להחליט. מייצאים את המודל מרוויט ומסתובבים בתוכו בקנה מידה 1:1 במשקפי VR (ואפשר גם בדפדפן) - בוחנים חלל וחומרים לפני הבנייה. בלי התקנה, חינם.",
  "יצירה אוטומטית של משפחות רוויט דינמיות - מקטלוג יצרן או מתיאור חופשי - ישר לקובץ ‎.rfa‎ אמיתי שנשאר שלכם: פרמטרי, מדיד, מוכן לפרויקט. כל פרמטר מזיז גאומטריה אמיתית (מידות, מגירות, חזיתות, ידיות), והפרמטרים תואמים לסטנדרט BIM. לא צריך יותר לבנות משפחות ידנית.",
  "טיפוס חדש, בלי להקליד פרמטרים. בוחרים משפחה שכבר נמצאת בפרויקט, מזיזים סרגלים ורואים את השינוי חי בתלת-ממד - ובלחיצה אחת נוצר טיפוס חדש ישירות ברוויט. לא צריך לקרוא ולהבין פרמטרים, רק ללחוץ, להזיז ולנסות. הכל רץ על הרוויט שלכם, במחשב שלכם - שום דבר לא עוזב את המשרד. ואפשר גם במציאות מעורבת (Quest 3): השולחן עומד בסלון בגודל אמיתי, ומזיזים לו את הפרמטרים במקום.",
  "Family Creator יוצר משפחה חדשה מאפס - קובץ ‎.rfa‎ חדש מתוך קטלוג או תיאור. Type Studio עובד על משפחה שכבר קיימת בפרויקט ויוצר ממנה טיפוסים חדשים בהזזת סרגלים. האחד יוצר, השני מתאים - ושניהם חוסכים את עבודת הפרמטרים הידנית.",
  "עורך סיורי 360° חינמי: יוצרים סיור מהטלפון או מהמודל, ומציגים אותו בדפדפן או במשקפי Quest בקנה מידה 1:1. שמות החדרים בעברית בתוך הסיור עצמו, חיצי ניווט כדי שהלקוח לא ילך לאיבוד, ואפשרות לסיור מודרך - עוצרים בכל נקודה ומסבירים.",
  "מעבדת המחקר והפיתוח של מוצרי המציאות המדומה שלנו. כל אובייקט - השרביט שמחליף את הבקר ביד, נקודות הניווט והמידע, האובייקטים שמשנים את החדר - נבנה ונבחן במעבדה בכל גודל ובכל מצב, לפני שהוא נכנס לסיור ולמוצרים.",
  "ל-Viewer ול-VR Tours מספיק דפדפן; החוויה המלאה - עם משקפי Meta Quest 3. DecisionMaker, Family Creator ו-Type Studio עובדים יחד עם Revit במשרד - הם יוצאים מהמודל שלכם וחוזרים אליו. אין צורך בידע מוקדם ב-VR, אנחנו מלווים.",
  "Viewer ו-VR Tours - חינם. שאר המוצרים תלויים בהיקף ובאופי הפרויקט, והדרך הנכונה להתחיל היא הדגמה קצרה על פרויקט שלכם. דברו איתי."
];

var OYMER_SERVICES = [
  ["הטמעת VR במשרדים", "VRImplementation.html"],
  ["סיורי VR מודרכים", "GuidedTours.html"],
  ["סיורי VR מוכנים", "PreRecordedTours.html"],
  ["VR למבנים קיימים", "ExistingBuildings.html"]
];

(function () {
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  ready(function () {
    setupReveal();
    setupProductsNav();
    setupServicesDropdown();
    setupClientStoriesNav();
    setupActiveNav();
    setupFAQ();
    setupMobileMenu();
    setupAccessibility();
    setupBrandLockupHeight();
  });

  /* ---- make the OMER DOTAN / VR Solutions block exactly the logo's height,
          top line to the logo top, bottom line to the logo bottom ---- */
  function setupBrandLockupHeight() {
    // Handles every "OMER DOTAN / VR Solutions" lockup on the page (header + footer):
    // make the text block exactly the logo's height, top line to the logo top,
    // bottom line to its bottom, both lines the same width (justify).
    var wraps = document.querySelectorAll('div[dir="ltr"]');
    Array.prototype.forEach.call(wraps, function (wrap) {
      var spans = wrap.querySelectorAll("span");
      if (spans.length < 2 || (spans[0].textContent || "").trim() !== "OMER DOTAN") return;
      var logo = wrap.parentNode && wrap.parentNode.querySelector("img");
      if (!logo) return;
      function apply() {
        var h = logo.getBoundingClientRect().height;
        if (!h) return;
        wrap.style.display = "inline-flex";
        wrap.style.flexDirection = "column";
        wrap.style.justifyContent = "space-between";
        wrap.style.alignItems = "stretch";
        wrap.style.height = (h * 0.96) + "px";   // spans the circle
        Array.prototype.forEach.call(spans, function (s, idx) {
          s.style.lineHeight = "1";
          s.style.transform = idx === 0 ? "translateY(1.2px)" : "translateY(-1.2px)"; // top down, bottom up -> closer
        });
      }
      if (logo.complete && logo.naturalHeight) apply();
      logo.addEventListener("load", apply);
      window.addEventListener("resize", apply);
    });
  }

  /* ---- add "סיפורי לקוחות" nav link (between FAQ and Blog) on every page ---- */
  function setupClientStoriesNav() {
    var blogs = document.querySelectorAll('a[href="Blog.html"]');
    Array.prototype.forEach.call(blogs, function (blog) {
      var prev = blog.previousElementSibling;
      if (prev && prev.getAttribute && prev.getAttribute("href") === "ClientStories.html") return;
      var a = blog.cloneNode(true);           // inherit exact nav styling
      a.setAttribute("href", "ClientStories.html");
      a.textContent = "סיפורי לקוחות";
      blog.parentNode.insertBefore(a, blog);
    });
  }

  /* ---- highlight the nav item that matches the current page ---- */
  function setupActiveNav() {
    var current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    var servicesPages = OYMER_SERVICES.map(function (s) { return s[1].toLowerCase(); });
    var productsPages = OYMER_PRODUCTS.map(function (p) { return p[1].toLowerCase(); });
    var items = document.querySelectorAll('header nav a[href], header nav button[aria-haspopup]');
    Array.prototype.forEach.call(items, function (el) {
      if (el.closest(".oymer-submenu")) return;                  // skip dropdown SUB-items
      el.classList.remove("bg-sky-50", "text-sky-600", "bg-sky-100", "text-sky-700", "font-semibold", "text-slate-700", "hover:bg-slate-100");
      el.style.textDecoration = "none";
      el.style.boxShadow = "";
      el.classList.add("text-slate-700", "hover:bg-slate-100");
      var t = (el.textContent || "").trim();
      var href = (el.getAttribute("href") || "").split("/").pop().toLowerCase();
      var isActive = false;
      if (el.tagName === "A") {
        isActive = !!href && href.charAt(0) !== "#" && href === current && t !== "צ'אט";
      } else {                                                    // dropdown MAIN item (השירותים/המוצרים button)
        if (t.indexOf("השירותים") > -1) isActive = servicesPages.indexOf(current) > -1;
        else if (t.indexOf("המוצרים") > -1) isActive = productsPages.indexOf(current) > -1;
      }
      if (isActive) el.style.boxShadow = "inset 0 -2px 0 #111";   // thin black line, no blue
    });
  }

  /* ---- scroll-in animations (was Base44's fade/slide reveal) ---- */
  function setupReveal() {
    var els = Array.prototype.slice.call(document.querySelectorAll('[style*="opacity: 0"]'))
      .filter(function (e) { return !e.classList.contains("oymer-ans"); });
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (e) { e.style.opacity = 1; e.style.transform = "none"; });
      return;
    }
    /* Phone and tablet: the reveal slides in from the SIDE, and an element still
       holding translateX(50px) below the fold sticks 50px past the right edge -
       that is what makes the whole page scroll sideways on a phone. Vertical on
       narrow screens: same reveal, no horizontal overflow. */
    if (window.innerWidth < 1024) {
      els.forEach(function (e) {
        var t = e.style.transform || "";
        if (/translateX\(/i.test(t)) {
          var px = parseFloat(t.replace(/.*translateX\(\s*(-?[\d.]+)px.*/i, "$1")) || 0;
          e.style.transform = "translateY(" + (Math.abs(px) > 30 ? 30 : Math.abs(px)) + "px)";
        }
      });
    }
    els.forEach(function (e) { e.style.transition = "opacity .7s ease, transform .7s ease"; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.style.opacity = 1; en.target.style.transform = "none"; io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (e) { io.observe(e); });
    setTimeout(function () {
      els.forEach(function (e) { if (getComputedStyle(e).opacity === "0") { e.style.opacity = 1; e.style.transform = "none"; } });
    }, 4000);
  }

  /* ---- products list ---- */
  var OYMER_PRODUCTS = [
    ["oYmer DecisionMaker", "DecisionMaker.html"],
    ["oYmer VR Tours", "VRTours.html"],
    ["oYmer BIM Viewer", "BIMViewer.html"],
    ["oYmer VR Lab", "Lab3D.html"]
  ];

  /* ---- shared dropdown builder ---- */
  function makeDropdown(btn, links) {
    var wrap = btn.parentNode;
    if (!wrap || wrap.querySelector(".oymer-submenu")) return;
    var menu = document.createElement("div");
    menu.className = "oymer-submenu";
    menu.style.cssText = "position:absolute;top:100%;right:0;min-width:230px;background:#fff;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.12);padding:8px;z-index:60;display:none;";
    links.forEach(function (l) {
      var a = document.createElement("a");
      a.href = l[1]; a.textContent = l[0];
      a.style.cssText = "display:block;padding:10px 14px;border-radius:8px;color:#334155;font-size:14px;text-decoration:none;text-align:right;";
      a.addEventListener("mouseenter", function () { a.style.background = "#f1f5f9"; });
      a.addEventListener("mouseleave", function () { a.style.background = "transparent"; });
      menu.appendChild(a);
    });
    wrap.appendChild(menu);
    var open = false;
    function set(o) { open = o; menu.style.display = o ? "block" : "none"; btn.setAttribute("aria-expanded", o); }
    btn.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); set(!open); });
    document.addEventListener("click", function () { if (open) set(false); });
    menu.addEventListener("click", function (e) { e.stopPropagation(); });
  }

  /* ---- services dropdown ---- */
  function setupServicesDropdown() {
    var btn = document.querySelector("button[aria-haspopup]:not(.oymer-products-btn)");
    if (btn) makeDropdown(btn, OYMER_SERVICES);
  }

  /* ---- products dropdown ("המוצרים שלנו") with NEW badge (cloned from services) ---- */
  function setupProductsNav() {
    if (document.querySelector(".oymer-products-btn")) return;
    var svcBtn = document.querySelector("button[aria-haspopup]");
    if (!svcBtn) return;
    var svcWrap = svcBtn.parentNode;
    var wrap = svcWrap.cloneNode(true);
    var btn = wrap.querySelector("button");
    btn.classList.add("oymer-products-btn");
    btn.setAttribute("aria-expanded", "false");
    var svg = btn.querySelector("svg");
    btn.textContent = "המוצרים שלנו ";
    if (svg) btn.appendChild(svg);
    svcWrap.parentNode.insertBefore(wrap, svcWrap.nextSibling);
    makeDropdown(btn, OYMER_PRODUCTS);
  }

  /* ---- FAQ accordion with open-frame highlight ---- */
  function setupFAQ() {
    if (!/FAQ/i.test(location.pathname) && !/FAQ/i.test(document.title)) return;
    if (!window.OYMER_FAQ) return;
    var btns = Array.prototype.slice.call(document.querySelectorAll("section button"))
      .filter(function (b) { return b.querySelector("h3"); });
    if (!btns.length) return;

    function closeAll() {
      btns.forEach(function (b) {
        /* REMOVE the answer, do not collapse it. Every collapsed-box trick -
           max-height:0, height:0, overflow:hidden - asks the engine to lay out
           a box at zero while its content is not zero, and inside a <button>
           WebKit reserved the content height anyway and painted nothing: an
           invisible answer-sized void under every question on iPhone, invisible
           on desktop. An element that is not in the DOM cannot reserve space in
           any engine. That is why this is not another attempt at the same bet. */
        var pnl = b.querySelector(".oymer-ans");
        if (pnl) pnl.parentNode.removeChild(pnl);
        /* The first question ships pre-styled OPEN in the Base44 markup, so the
           closed look has to strip those classes as well: an inline background
           still leaves bg-sky-50 on the element, and clearing the svg transform
           lets the baked-in rotation reassert rather than removing it. */
        b.classList.remove("bg-sky-50", "border-sky-200", "shadow-lg");
        b.style.background = "#fff"; b.style.borderColor = "#e2e8f0"; b.style.boxShadow = "none";
        var h = b.querySelector("h3"); if (h) { h.classList.remove("text-sky-700"); h.style.color = "#0f172a"; }
        var s = b.querySelector("svg"); if (s) s.style.transform = "rotate(0deg)";
      });
    }

    btns.forEach(function (btn, i) {
      var ex = btn.querySelector(".overflow-hidden"); if (ex) ex.remove();
      var ans = window.OYMER_FAQ[i]; if (ans == null) return;
      btn.style.cursor = "pointer";
      btn.addEventListener("click", function () {
        var isOpen = !!btn.querySelector(".oymer-ans");
        closeAll();
        if (!isOpen) {
          /* built on open, removed on close - it exists only while it is read */
          var panel = document.createElement("div");
          panel.className = "oymer-ans";
          /* opacity only. It never affects layout, so the fade cannot leave a
             void behind if an engine disagrees about the transition. */
          panel.style.cssText = "opacity:0;transition:opacity .25s ease;";
          var p = document.createElement("p");
          p.className = "mt-4 text-slate-600 leading-relaxed";
          p.style.cssText = "text-align:right;margin-top:16px;";
          p.textContent = ans;
          panel.appendChild(p);
          btn.appendChild(panel);
          requestAnimationFrame(function () { panel.style.opacity = "1"; });
          btn.style.background = "#f0f9ff"; btn.style.borderColor = "#bae6fd";
          btn.style.boxShadow = "0 10px 15px -3px rgba(2,132,199,.15)";
          var h = btn.querySelector("h3"); if (h) h.style.color = "#0369a1";
          var s = btn.querySelector("svg"); if (s) s.style.transform = "rotate(180deg)";
        }
      });
    });

    /* The first question ships from Base44 with the OPEN styling baked into its
       markup (bg-sky-50, border, shadow, rotated chevron) while the panel we
       build starts closed - so it renders as a highlighted header above an empty
       void with no answer text. Normalise every button to match its real state. */
    closeAll();
  }

  /* ---- mobile hamburger menu ---- */
  function setupMobileMenu() {
    var burger = document.querySelector('button[aria-label="פתח תפריט"]');
    if (!burger || document.querySelector(".oymer-mobile")) return;
    var menu = document.createElement("div");
    menu.className = "oymer-mobile";
    menu.setAttribute("dir", "rtl");
    menu.style.cssText = "position:fixed;top:80px;right:0;left:0;background:#fff;border-bottom:1px solid #e2e8f0;box-shadow:0 10px 30px rgba(0,0,0,.1);padding:8px 24px 16px;z-index:49;display:none;direction:rtl;max-height:calc(100vh - 80px);overflow-y:auto;";
    var curPage = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    function link(l, indent, container) {
      var a = document.createElement("a");
      a.href = l[1]; a.textContent = l[0];
      a.style.cssText = "display:block;padding:11px " + (indent ? "20px" : "8px") + ";color:#334155;font-size:16px;text-decoration:none;border-bottom:1px solid #f1f5f9;text-align:right;";
      if ((l[1] || "").toLowerCase() === curPage) {   // active item: blue highlight
        a.style.background = "#e0f2fe";
        a.style.color = "#0369a1";
        a.style.fontWeight = "700";
      }
      (container || menu).appendChild(a);
    }
    function collapsible(title, rows) {
      var btn = document.createElement("button");
      btn.style.cssText = "display:flex;width:100%;align-items:center;justify-content:space-between;padding:13px 8px;background:none;border:0;border-bottom:1px solid #f1f5f9;font-size:16px;font-weight:700;color:#0f172a;cursor:pointer;font-family:inherit;";
      var label = document.createElement("span"); label.textContent = title;
      var arrow = document.createElement("span"); arrow.textContent = "⌄";
      arrow.style.cssText = "font-size:15px;color:#64748b;transition:transform .2s;";
      btn.appendChild(label); btn.appendChild(arrow);
      var body = document.createElement("div"); body.style.display = "none";
      rows.forEach(function (l) { link(l, true, body); });
      var open = rows.some(function (l) { return (l[1] || "").toLowerCase() === curPage; });  // auto-open the section you're in
      if (open) { body.style.display = "block"; arrow.style.transform = "rotate(180deg)"; }
      btn.addEventListener("click", function (e) {
        e.preventDefault(); e.stopPropagation();
        open = !open;
        body.style.display = open ? "block" : "none";
        arrow.style.transform = open ? "rotate(180deg)" : "";
      });
      menu.appendChild(btn); menu.appendChild(body);
    }
    collapsible("השירותים שלנו", OYMER_SERVICES);
    collapsible("המוצרים שלנו", OYMER_PRODUCTS);
    [["שאלות? תשובות!", "FAQ.html"], ["סיפורי לקוחות", "ClientStories.html"], ["בלוג", "Blog.html"],
     ["אודות", "About.html"], ["צור קשר", "Contact.html"]].forEach(function (l) { link(l, false); });
    document.body.appendChild(menu);
    /* A transparent backdrop under the menu: a tap on the page that shows below
       the menu closes it (and never reaches the page). Lives below the menu
       (z 48 < 49) and below the fixed header (z 50), so the burger stays live. */
    var backdrop = document.createElement("div");
    backdrop.className = "oymer-mobile-backdrop";
    backdrop.style.cssText = "position:fixed;inset:0;z-index:48;display:none;background:transparent;";
    document.body.appendChild(backdrop);
    /* Scroll lock. body{overflow:hidden} alone does not hold on iOS Safari, so
       the body is pinned with position:fixed at the current scroll offset and
       put back (same offset) on close. The header is fixed, so it is unmoved. */
    var open = false, lockedY = 0;
    function set(o) {
      open = o;
      menu.style.display = o ? "block" : "none";
      backdrop.style.display = o ? "block" : "none";
      burger.setAttribute("aria-expanded", o ? "true" : "false");
      var b = document.body.style;
      if (o) {
        lockedY = window.pageYOffset || document.documentElement.scrollTop || 0;
        b.position = "fixed"; b.top = (-lockedY) + "px"; b.left = "0"; b.right = "0";
        b.width = "100%"; b.overflow = "hidden";
      } else {
        b.position = ""; b.top = ""; b.left = ""; b.right = ""; b.width = ""; b.overflow = "";
        window.scrollTo(0, lockedY);
      }
    }
    burger.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); set(!open); });
    backdrop.addEventListener("click", function (e) { e.preventDefault(); set(false); });
    backdrop.addEventListener("touchmove", function (e) { e.preventDefault(); }, { passive: false });
  }

  /* ---- self-hosted accessibility menu (נגישות) ---- */
  function setupAccessibility() {
    var S = {};
    try { S = JSON.parse(localStorage.getItem("oymerA11y") || "{}"); } catch (e) { S = {}; }
    var css = document.createElement("style");
    css.textContent =
      "html.a11y-contrast{filter:contrast(1.35)}" +
      "html.a11y-gray{filter:grayscale(1)}" +
      "html.a11y-contrast.a11y-gray{filter:contrast(1.35) grayscale(1)}" +
      "html.a11y-links a{text-decoration:underline !important;background:#fff3cd !important;color:#7a4d00 !important}" +
      "html.a11y-nomotion *{animation:none !important;transition:none !important}" +
      ".oymer-a11y-btn{position:fixed;bottom:24px;left:24px;z-index:99998;width:56px;height:56px;border-radius:50%;background:#7c3aed;color:#fff;border:none;box-shadow:0 8px 24px rgba(0,0,0,.25);cursor:pointer;display:flex;align-items:center;justify-content:center}" +
      ".oymer-a11y-panel{position:fixed;bottom:90px;left:24px;z-index:99999;width:260px;background:#fff;color:#1e293b;border:1px solid #e2e8f0;border-radius:14px;box-shadow:0 20px 50px rgba(0,0,0,.25);padding:14px;display:none;direction:rtl;text-align:right;font-family:inherit}" +
      ".oymer-a11y-panel h4{margin:0 0 10px;font-size:16px;color:#7c3aed;font-weight:700}" +
      ".oymer-a11y-panel button.opt{display:flex;width:100%;align-items:center;gap:8px;justify-content:flex-start;margin:5px 0;padding:10px 12px;border:1px solid #e2e8f0;border-radius:9px;background:#f8fafc;cursor:pointer;font-size:14px;color:#1e293b}" +
      ".oymer-a11y-panel button.opt.on{background:#ede9fe;border-color:#c4b5fd;color:#6d28d9;font-weight:700}" +
      ".oymer-a11y-row{display:flex;gap:6px}.oymer-a11y-row button{flex:1}";
    document.head.appendChild(css);

    function apply() {
      var h = document.documentElement;
      h.classList.toggle("a11y-contrast", !!S.contrast);
      h.classList.toggle("a11y-gray", !!S.gray);
      h.classList.toggle("a11y-links", !!S.links);
      h.classList.toggle("a11y-nomotion", !!S.nomotion);
      h.style.fontSize = (100 + (S.font || 0) * 12) + "%";
      try { localStorage.setItem("oymerA11y", JSON.stringify(S)); } catch (e) {}
      refresh();
    }

    var btn = document.createElement("button");
    btn.className = "oymer-a11y-btn"; btn.setAttribute("aria-label", "תפריט נגישות");
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="1"></circle><path d="m18 19 1-7-6 1"></path><path d="m5 8 3-3 5.5 3-2.36 3.5"></path><path d="M4.24 14.5a5 5 0 0 0 6.88 6"></path><path d="M13.76 17.5a5 5 0 0 0-6.88-6"></path></svg>';

    var panel = document.createElement("div");
    panel.className = "oymer-a11y-panel";
    panel.innerHTML =
      '<h4>נגישות</h4>' +
      '<div class="oymer-a11y-row"><button class="opt" data-a="font-">א־ טקסט קטן</button><button class="opt" data-a="font+">א+ טקסט גדול</button></div>' +
      '<button class="opt" data-a="contrast">ניגודיות גבוהה</button>' +
      '<button class="opt" data-a="gray">גווני אפור</button>' +
      '<button class="opt" data-a="links">הדגשת קישורים</button>' +
      '<button class="opt" data-a="nomotion">עצירת אנימציות</button>' +
      '<button class="opt" data-a="reset" style="justify-content:center;background:#fee2e2;border-color:#fecaca;color:#b91c1c">איפוס</button>';

    function refresh() {
      panel.querySelectorAll("button.opt").forEach(function (b) {
        var a = b.getAttribute("data-a");
        if (["contrast", "gray", "links", "nomotion"].indexOf(a) > -1) b.classList.toggle("on", !!S[a]);
      });
    }

    panel.addEventListener("click", function (e) {
      var b = e.target.closest("button.opt"); if (!b) return;
      var a = b.getAttribute("data-a");
      if (a === "font+") S.font = Math.min((S.font || 0) + 1, 4);
      else if (a === "font-") S.font = Math.max((S.font || 0) - 1, -1);
      else if (a === "reset") S = {};
      else S[a] = !S[a];
      apply();
    });

    btn.addEventListener("click", function () {
      panel.style.display = panel.style.display === "block" ? "none" : "block";
    });
    document.addEventListener("click", function (e) {
      if (!panel.contains(e.target) && e.target !== btn && !btn.contains(e.target)) panel.style.display = "none";
    });

    document.body.appendChild(btn);
    document.body.appendChild(panel);
    apply();
  }
})();

/* Email links: mailto still fires for anyone with a mail client, but the address is
   also copied to the clipboard and a toast offers a Gmail compose window - so a
   visitor with no mail handler is never left with a dead click. */
(function () {
  function toast(addr) {
    var old = document.getElementById("oymer-mail-toast");
    if (old) old.remove();
    var t = document.createElement("div");
    t.id = "oymer-mail-toast";
    t.setAttribute("dir", "rtl");
    t.style.cssText = "position:fixed;z-index:9999;bottom:26px;left:50%;transform:translateX(-50%);" +
      "background:#0f172a;color:#fff;padding:14px 20px;border-radius:14px;font-size:15px;" +
      "box-shadow:0 10px 30px rgba(0,0,0,.35);display:flex;align-items:center;gap:14px;" +
      "font-family:inherit;max-width:92vw;opacity:0;transition:opacity .25s";
    t.innerHTML = '<span>הכתובת הועתקה: <b dir="ltr" style="unicode-bidi:isolate">' + addr + '</b></span>' +
      '<a href="https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(addr) + '" ' +
      'target="_blank" rel="noopener noreferrer" ' +
      'style="background:#0284c7;color:#fff;padding:7px 14px;border-radius:9px;text-decoration:none;' +
      'font-weight:600;white-space:nowrap">פתח ב-Gmail</a>';
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.style.opacity = "1"; });
    setTimeout(function () {
      t.style.opacity = "0";
      setTimeout(function () { if (t.parentNode) t.remove(); }, 300);
    }, 7000);
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="mailto:"]');
    if (!a) return;
    var addr = a.getAttribute("href").slice(7).split("?")[0];
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(addr).then(function () { toast(addr); }, function () { toast(addr); });
    } else {
      var ta = document.createElement("textarea");
      ta.value = addr;
      ta.style.cssText = "position:fixed;top:-1000px";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (err) {}
      ta.remove();
      toast(addr);
    }
  });
})();
