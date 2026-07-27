/* oYmer VR site — restores the interactions lost when Base44's React was stripped:
   services dropdown, FAQ accordion, mobile menu. Vanilla JS, no dependencies. */

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
    setupServicesDropdown();
    setupFAQ();
    setupMobileMenu();
  });

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

  function setupFAQ() {
    if (!/FAQ/i.test(location.pathname) && !/FAQ/i.test(document.title)) return;
    if (!window.OYMER_FAQ) return;
    var btns = Array.prototype.slice.call(document.querySelectorAll("section button"))
      .filter(function (b) { return b.querySelector("h3"); });
    if (!btns.length) return;
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
      var chev = btn.querySelector("svg");
      btn.addEventListener("click", function () {
        var isOpen = panel.style.maxHeight && panel.style.maxHeight !== "0px";
        Array.prototype.forEach.call(document.querySelectorAll(".oymer-ans"), function (pp) { pp.style.maxHeight = "0px"; });
        Array.prototype.forEach.call(document.querySelectorAll("section button h3 ~ svg, section button svg"), function (s) { s.style.transform = ""; });
        if (!isOpen) {
          panel.style.maxHeight = (panel.scrollHeight + 40) + "px";
          if (chev) chev.style.transform = "rotate(180deg)";
        }
      });
    });
  }

  function setupMobileMenu() {
    var burger = document.querySelector('button[aria-label="פתח תפריט"]');
    if (!burger || document.querySelector(".oymer-mobile")) return;
    var menu = document.createElement("div");
    menu.className = "oymer-mobile";
    menu.style.cssText = "position:fixed;top:80px;right:0;left:0;background:#fff;border-bottom:1px solid #e2e8f0;box-shadow:0 10px 30px rgba(0,0,0,.1);padding:12px 24px;z-index:49;display:none;";
    var links = OYMER_SERVICES.concat([
      ["שאלות? תשובות!", "FAQ.html"],
      ["בלוג", "Blog.html"],
      ["אודות", "About.html"],
      ["צור קשר", "Contact.html"]
    ]);
    links.forEach(function (l) {
      var a = document.createElement("a");
      a.href = l[1]; a.textContent = l[0];
      a.style.cssText = "display:block;padding:12px 8px;color:#334155;font-size:16px;text-decoration:none;border-bottom:1px solid #f1f5f9;text-align:right;";
      menu.appendChild(a);
    });
    document.body.appendChild(menu);
    var open = false;
    burger.addEventListener("click", function (e) {
      e.preventDefault(); e.stopPropagation();
      open = !open; menu.style.display = open ? "block" : "none";
    });
  }
})();
