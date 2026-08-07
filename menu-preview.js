/* menu-preview.js - the products menu, SITE-WIDE. The name is historical: it began as a
   mockup-only overlay, and since 2026-08-08 it ships on every page of the bim-suite
   branch. Rename it at go-live if you want; 37 files reference it.
   oymer.js builds the header dropdowns; this rewrites the "המוצרים שלנו" one (desktop
   + mobile) to the approved product structure. Without it a page falls back to the dead
   OYMER_PRODUCTS list inside oymer.js - the old DecisionMaker/VR Tours/BIM Viewer/VR Lab
   menu that was still showing on ~30 pages until this shipped.

   The design, as approved 2026-08-02 in menu-mockup.html:
     - the four suite products gathered into ONE muted-purple block
     - that block runs LTR - the names are English even though the menu is Hebrew
     - "oYmer" is the brand prefix, smaller than the product name (11.5px floor)
     - a copyright mark trails every product name on the right
     - no star on DecisionMaker, no "בפיתוח" pill on Type Studio */
(function () {
  "use strict";

  var GROUP = ["BIM VR Suite", "bimsuite.html"];
  var SUITE = [
    ["DecisionMaker",  "suite-decisionmaker.html"],
    ["Viewer",         "suite-viewer.html"],
    ["Family Creator", "suite-familycreator.html"],
    ["Type Studio",    "suite-typestudio.html"]
  ];
  var REST = [
    ["VR Tours", "suite-vrtours.html"],
    ["VR Lab",   "suite-vrlab.html"]
  ];

  var OY = "font-size:max(11.5px,.68em)";
  var CMARK = "font-size:.62em;font-weight:700;vertical-align:super;line-height:0;" +
              "margin-inline-start:.12em;opacity:.72;direction:ltr;unicode-bidi:isolate";

  /* "oYmer <name>(c)" - prefix smaller, orange Y, mark trailing on the right */
  function wordmark(name, isSuite) {
    return '<span style="' + OY + '">o<span style="color:#ff7a00">Y</span>mer</span> ' +
           (isSuite ? '<b style="font-size:1.24em">BIM VR</b> Suite' : name) +
           '<sup style="' + CMARK + '">©</sup>';
  }

  var ROW = "display:block;border-radius:8px;font-size:14px;text-decoration:none;" +
            "direction:ltr;text-align:left;position:relative;";

  function hover(a, colour) {
    a.addEventListener("mouseenter", function () { a.style.background = colour; });
    a.addEventListener("mouseleave", function () { a.style.background = "transparent"; });
  }

  /* one product line. opts: {head} suite title, {sub} indented suite member, {plain} outside */
  function row(l, opts) {
    opts = opts || {};
    var a = document.createElement("a");
    a.href = l[1];
    a.innerHTML = wordmark(l[0], !!opts.head);
    a.style.cssText = ROW +
      (opts.head ? "padding:9px 12px 6px;font-weight:800;color:#4c2fa8;"
                 : "padding:10px 14px;color:" + (opts.plain ? "#334155;" : "#4a3f6b;")) +
      (opts.sub   ? "padding-left:28px;padding-right:14px;" : "") +
      (opts.plain ? "padding-left:14px;" : "");
    hover(a, opts.plain ? "#f1f5f9" : "rgba(139,108,240,.12)");
    if (opts.sub) {                       /* the indent guide, on the left with the text */
      var tick = document.createElement("span");
      tick.style.cssText = "position:absolute;left:16px;top:0;bottom:0;width:1px;" +
                           "background:rgba(139,108,240,.38);";
      a.appendChild(tick);
    }
    return a;
  }

  function suiteBlock() {
    var box = document.createElement("div");
    box.style.cssText = "direction:ltr;text-align:left;margin:2px 2px 6px;padding:4px;" +
      "border-radius:10px;border:1px solid rgba(139,108,240,.26);" +
      "background:linear-gradient(180deg,rgba(139,108,240,.13),rgba(139,108,240,.05));";
    box.appendChild(row(GROUP, { head: true }));
    SUITE.forEach(function (l) { box.appendChild(row(l, { sub: true })); });
    return box;
  }

  function sep() {
    var d = document.createElement("div");
    d.style.cssText = "height:1px;background:#f1f5f9;margin:8px 10px;";
    return d;
  }

  /* ---- desktop dropdown ---- */
  function rebuildDesktop() {
    var btn = document.querySelector(".oymer-products-btn");
    if (!btn || !btn.parentNode) return false;
    var menu = btn.parentNode.querySelector(".oymer-submenu");
    if (!menu) return false;
    if (menu.getAttribute("data-preview") === "2") return true;
    menu.innerHTML = "";
    menu.style.minWidth = "292px";
    menu.appendChild(suiteBlock());
    menu.appendChild(sep());
    REST.forEach(function (l) { menu.appendChild(row(l, { plain: true })); });
    menu.setAttribute("data-preview", "2");
    return true;
  }

  /* ---- mobile collapsible ---- */
  function rebuildMobile() {
    var menu = document.querySelector(".oymer-mobile");
    if (!menu) return false;
    var target = null;
    Array.prototype.forEach.call(menu.querySelectorAll("button"), function (b) {
      if ((b.textContent || "").indexOf("המוצרים") > -1) target = b;
    });
    if (!target) return false;
    var body = target.nextElementSibling;
    if (!body || body.getAttribute("data-preview") === "2") return !!body;
    body.innerHTML = "";
    var box = suiteBlock();
    box.style.margin = "6px 16px";
    body.appendChild(box);
    REST.forEach(function (l) {
      var a = row(l, { plain: true });
      a.style.cssText += "padding:12px 20px;border-bottom:1px solid #f1f5f9;font-size:16px;";
      body.appendChild(a);
    });
    body.setAttribute("data-preview", "2");
    return true;
  }

  /* the header menu is built by oymer.js on DOMContentLoaded; poll briefly until it exists */
  var tries = 0;
  var t = setInterval(function () {
    var d = rebuildDesktop();
    var m = rebuildMobile();
    if ((d && m) || ++tries > 40) clearInterval(t);
  }, 100);

})();
