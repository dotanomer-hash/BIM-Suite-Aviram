/* oYmer VR site — restores interactions lost when Base44's React was stripped:
   services dropdown, FAQ accordion (+open frame), mobile menu, scroll animations,
   and a self-hosted accessibility menu. Vanilla JS, no dependencies. */

window.OYMER_FAQ = [
  "מציאות מדומה (VR) היא טכנולוגיה שמכניסה את המשתמש לתוך סביבה תלת־מימדית \"כאילו הוא נמצא שם\". באדריכלות זה מאפשר לחוות חלל בקנה מידה 1:1, להבין פרופורציות, זרימה ותחושה מרחבית – לפני הבנייה.",
  "היתרון המרכזי הוא מעבר מ\"דמיון מתוך שרטוט\" לחוויה מרחבית אמיתית. כך קל יותר לזהות בזמן: מסדרון צר, חלון גבוה מדי, זרימה לא נכונה, קשרי מבט, פרופורציות ותחושת מרחב כללית. כשזה מתגלה מוקדם — התיקון מהיר וזול יותר.",
  "כי VR מפחית אי־הבנות, \"מיישר קו\" בין צוותי תכנון ובין אדריכל–לקוח, ומקצר זמן החלטות. בנוסף — זו חוויה רגשית חזקה שמעלה אמון וביטחון בהחלטות התכנון.",
  "כמעט בכל פרויקט שבו חשוב להבין חלל לפני ביצוע: דירות ובתים פרטיים, משרדים, מסחר, לובאים, מבני ציבור, וגם פרויקטים יזמיים שבהם נדרש שילוב של תכנון + מכירה/שיווק.",
  "כן. סיור VR (ובעיקר סיור מוכן מראש) הוא כלי מצוין להצגת הפתרון המוצע ללקוח, להמחשה ברורה של ערך הפרויקט וליצירת \"וואו\". מתאים למצגות מכירה, שיווק פרויקטים והדגמות.",
  "אין צורך בידע מוקדם. המערכת פשוטה לתפעול ומלווה בהדרכה ברורה, כך שגם משתמשים חדשים יכולים להתנסות ולחוות סיור וירטואלי בקלות. כמובן שככל שצוברים יותר שעות בתוך סביבת ה-VR כך משתפרת תחושת הנוחות.",
  "לא בהכרח. ניתן לבצע סיור דינמי גם מרחוק ולהצטרף ממחשב/טאבלט/טלפון. יחד עם זאת, החוויה המלאה מתקבלת בתוך החלל הוירטואלי בעת חבישת קסדת VR.",
  "סוג הסיור נגזר מצרכי הפרויקט. מטרתו העיקרית של סיור דינמי — תכנון אדריכלי בחלל וירטואלי, שיתוף פעולה בין אנשי צוות, מציאת בעיות ועוד. מטרתו העיקרית של סיור מוכן מראש — הצגת הפתרון המוצע ללקוח, והוא מיועד להתרשמות ויזואלית מהחלל המתוכנן לפני בנייתו בפועל.",
  "תלוי בסוג הסיור. בסיור מודרך שעה עד שעתיים. בסיור מוכן מראש הלקוח קובע את קצב ההתקדמות."
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
    setupServicesDropdown();
    setupFAQ();
    setupMobileMenu();
    setupAccessibility();
  });

  /* ---- scroll-in animations (was Base44's fade/slide reveal) ---- */
  function setupReveal() {
    var els = Array.prototype.slice.call(document.querySelectorAll('[style*="opacity: 0"]'))
      .filter(function (e) { return !e.classList.contains("oymer-ans"); });
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (e) { e.style.opacity = 1; e.style.transform = "none"; });
      return;
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

  /* ---- services dropdown ---- */
  function setupServicesDropdown() {
    var btns = document.querySelectorAll("button[aria-haspopup]");
    Array.prototype.forEach.call(btns, function (btn) {
      var wrap = btn.parentNode;
      if (!wrap || wrap.querySelector(".oymer-submenu")) return;
      var menu = document.createElement("div");
      menu.className = "oymer-submenu";
      menu.style.cssText = "position:absolute;top:100%;right:0;min-width:230px;background:#fff;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.12);padding:8px;z-index:60;display:none;";
      OYMER_SERVICES.forEach(function (l) {
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
    });
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
        var pnl = b.querySelector(".oymer-ans"); if (pnl) pnl.style.maxHeight = "0px";
        b.style.background = "#fff"; b.style.borderColor = "#e2e8f0"; b.style.boxShadow = "none";
        var h = b.querySelector("h3"); if (h) h.style.color = "#0f172a";
        var s = b.querySelector("svg"); if (s) s.style.transform = "";
      });
    }

    btns.forEach(function (btn, i) {
      var ex = btn.querySelector(".overflow-hidden"); if (ex) ex.remove();
      var ans = window.OYMER_FAQ[i]; if (ans == null) return;
      var panel = document.createElement("div");
      panel.className = "oymer-ans";
      panel.style.cssText = "overflow:hidden;max-height:0;transition:max-height .35s ease;";
      var p = document.createElement("p");
      p.className = "mt-4 text-slate-600 leading-relaxed";
      p.style.cssText = "text-align:right;margin-top:16px;";
      p.textContent = ans;
      panel.appendChild(p);
      btn.appendChild(panel);
      btn.style.cursor = "pointer";
      btn.addEventListener("click", function () {
        var isOpen = panel.style.maxHeight && panel.style.maxHeight !== "0px";
        closeAll();
        if (!isOpen) {
          panel.style.maxHeight = (panel.scrollHeight + 40) + "px";
          btn.style.background = "#f0f9ff"; btn.style.borderColor = "#bae6fd";
          btn.style.boxShadow = "0 10px 15px -3px rgba(2,132,199,.15)";
          var h = btn.querySelector("h3"); if (h) h.style.color = "#0369a1";
          var s = btn.querySelector("svg"); if (s) s.style.transform = "rotate(180deg)";
        }
      });
    });
  }

  /* ---- mobile hamburger menu ---- */
  function setupMobileMenu() {
    var burger = document.querySelector('button[aria-label="פתח תפריט"]');
    if (!burger || document.querySelector(".oymer-mobile")) return;
    var menu = document.createElement("div");
    menu.className = "oymer-mobile";
    menu.style.cssText = "position:fixed;top:80px;right:0;left:0;background:#fff;border-bottom:1px solid #e2e8f0;box-shadow:0 10px 30px rgba(0,0,0,.1);padding:12px 24px;z-index:49;display:none;";
    var links = OYMER_SERVICES.concat([
      ["שאלות? תשובות!", "FAQ.html"], ["בלוג", "Blog.html"],
      ["אודות", "About.html"], ["צור קשר", "Contact.html"]
    ]);
    links.forEach(function (l) {
      var a = document.createElement("a");
      a.href = l[1]; a.textContent = l[0];
      a.style.cssText = "display:block;padding:12px 8px;color:#334155;font-size:16px;text-decoration:none;border-bottom:1px solid #f1f5f9;text-align:right;";
      menu.appendChild(a);
    });
    document.body.appendChild(menu);
    var open = false;
    burger.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); open = !open; menu.style.display = open ? "block" : "none"; });
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
