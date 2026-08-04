# -*- coding: utf-8 -*-
# ############################################################################
# ##  STALE - DO NOT RUN.  Verified 2026-08-05 by building and diffing.      ##
# ##                                                                        ##
# ##  This script predates the 2026-08-02 paired-windows work. Running it   ##
# ##  silently DESTROYS, in all four product pages:                         ##
# ##    - the whole oyl-pairs / oyl-panel / oyl-stack layout                ##
# ##    - the <link> to oymer-pairs.css                                     ##
# ##    - the bs-suitetag backlink and the (c) mark in every <h1>           ##
# ##  and in all-mockup.html, ~440 lines of inline CSS incl. the menu.      ##
# ##  It also rolls the stylesheet cache-buster back to v=11.               ##
# ##                                                                        ##
# ##  The built .html files are now the source of truth. Edit them by hand  ##
# ##  (or with a patch script applied to all copies at once), not here.     ##
# ##  Only bimsuite-mockup.body.html is still a live source - it is the     ##
# ##  hub body, mirrored into bimsuite-mockup.html and all-mockup.html.     ##
# ############################################################################
import io, os
raise SystemExit("build-suite-mockups.py is STALE - see the header. Refusing to run.")

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(HERE)

# ---------------------------------------------------------------- the drafting field
BIMBG = """    <div class="bimbg" aria-hidden="true">
      <span class="plan"></span><span class="iso"></span>
      <span class="dots d1"></span><span class="dots d2"></span>
      <svg class="draw" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g class="dg" style="animation-delay:0s">
          <path pathLength="1" d="M90 150h330v210H90Z"/>
          <path pathLength="1" d="M250 150v210"/>
          <path pathLength="1" d="M250 300a60 60 0 0 0 60-60"/>
          <path pathLength="1" d="M90 400h330"/>
          <path pathLength="1" d="M90 390v20M420 390v20M250 392v16"/>
        </g>
        <g class="dg" style="animation-delay:2.3s">
          <path pathLength="1" d="M1180 210 1330 296 1330 468 1180 554 1030 468 1030 296Z"/>
          <path pathLength="1" d="M1180 210v172M1180 382 1330 468M1180 382 1030 468"/>
        </g>
        <g class="dg" style="animation-delay:4.6s">
          <path pathLength="1" d="M690 620h150v150H690Z"/>
          <path pathLength="1" d="M690 645h150M690 670h150M690 695h150M690 720h150M690 745h150"/>
          <path pathLength="1" d="M865 620v150"/>
        </g>
        <g class="dg" style="animation-delay:6.9s">
          <circle pathLength="1" cx="1240" cy="700" r="46"/>
          <path pathLength="1" d="M1240 654v92M1194 700h92"/>
          <path pathLength="1" d="M1286 668 1400 596"/>
        </g>
        <g class="dg" style="animation-delay:9.2s">
          <path pathLength="1" d="M520 90h560"/>
          <path pathLength="1" d="M520 78v24M800 78v24M1080 78v24"/>
          <path pathLength="1" d="M300 470h180v300H300Z"/>
        </g>
      </svg>
    </div>"""

HERO_BG = ('  <div class="bs-herobg" aria-hidden="true">\n'
           '    <span class="p p1"></span><span class="p p3"></span>'
           '<span class="p p2"></span><span class="p p4"></span>\n  </div>')

# ---------------------------------------------------------------- page data
# win: (stage, media, index, badge, oneline, ribbon-name, press, href, chips)
#   media = ("v", src, poster) | ("img", src) | ("mock", strong, label)
#   badge = (class, text) or None
PAGES = {
    "familycreator-mockup.html": dict(
        title="oYmer Family Creator", sub="יצירת משפחות דינמיות לרוויט.", hue="c3", layout="p3",
        no="// FAMILY GENERATOR", h2="משפחות רוויט דינמיות",
        lead="מהאובייקט במעבדה אל משפחת Revit אמיתית - פרמטרית, מדידה, מוכנה לפרויקט.",
        wins=[
            ("STAGE 01", ("v", "media/lab/desk-lab.mp4", "media/lab/desk-lab-poster.jpg"), "01", None,
             "מעצבים בגודל אמיתי", "מעצבים", "בעורך המעבדה", "#", []),
            ("STAGE 02", ("v", "media/lab/kitchen-lab.mp4", "media/lab/kitchen-lab-poster.jpg"), "02", None,
             "מחברים כל פרמטר", "מחברים", "אין מספרים מתים", "#", []),
            ("STAGE 03", ("v", "media/lab/kitchen-revit.mp4", "media/lab/kitchen-revit-poster.jpg"), "03",
             ("free", ".RFA"), "מוסרים קובץ משפחה", "מוסרים", "נכנס לפרויקט", "#", []),
        ]),

    "typestudio-mockup.html": dict(
        title="oYmer Type Studio", sub="יצירת טיפוסים חדשים בתוך רוויט.", hue="c4", layout="p3",
        no="// TYPE STUDIO", h2="טיפוס חדש, בלי להקליד פרמטרים",
        lead="בוחרים משפחה קיימת בפרויקט, מזיזים סרגלים ורואים את השינוי חי - ולחיצה אחת מחייבת אותו.",
        wins=[
            ("STAGE 01", ("v", "media/lab/desk-lab.mp4", "media/lab/desk-lab-poster.jpg"), "01", None,
             "בוחרים משפחה קיימת", "בוחרים", "מתוך הפרויקט", "#", []),
            ("STAGE 02", ("mock", "הסרגלים והתצוגה החיה", "MOCKUP"), "02", ("wip", "מוקאפ"),
             "מזיזים סרגל ורואים", "מכווננים", "בארגז חול", "#", []),
            ("STAGE 03", ("mock", "הקומיט אל הפרויקט", "MOCKUP"), "03", ("wip", "מוקאפ"),
             "לחיצה אחת מחייבת", "מחייבים", "טרנזקציה אחת", "#", []),
        ]),

    "viewer-mockup.html": dict(
        title="oYmer Viewer", sub="המודל של רוויט בדפדפן ובמשקפיים.", hue="c2", layout="p3",
        no="// VIEWER", h2="לפתוח, להסתובב, להחליף",
        lead="המודל נפתח בדפדפן ובמשקפיים בלי רישיון Revit לצופה - ומשם אפשר לבחון משפחה ולהחליף גימור.",
        wins=[
            ("01", ("v", "media/viewer/reel-1.mp4", "media/viewer/reel-1.jpg"), "01", ("free", "פתוח"),
             "צפייה במודל", "View model", "המודל המלא בדפדפן", "#", []),
            ("02", ("v", "media/lab/kitchen-lab.mp4", "media/lab/kitchen-lab-poster.jpg"), "02", None,
             "צפייה במשפחה", "View family", "הארון, מקרוב", "#", []),
            ("03", ("v", "media/viewer/reel-2.mp4", "media/viewer/reel-2.jpg"), "03", None,
             "החלפת חומרים", "Apply materials", "גימור בזמן אמת", "#", []),
        ]),

    "decisionmaker-mockup.html": dict(
        title="oYmer DecisionMaker", sub="פגישת אישור בקנה מידה 1:1.", hue="c1", layout="col",
        no="// DECISION MAKER", h2="מהמודל, אל הפגישה, ובחזרה אל המודל",
        lead="שלושה שלבים על ציר אחד. מה שהוחלט בפגישה לא נשאר במצגת - הוא נכתב בחזרה לתוך Revit.",
        wins=[
            ("STEP 01", ("img", "media/lab/desk-revit.jpg"), "01", None,
             "ייצוא המודל מרוויט", "Export model", "מהריבון של oYmer", "#", []),
            ("STEP 02", ("v", "media/reels/quest.mp4", "media/reels/quest.jpg"), "02", None,
             "הפגישה במשקפיים 1:1", "View in VR 1:1", "הלקוח בפנים", "#",
             ["החלפת חומרים", "החלפת אובייקטים", "הזזת אלמנטים"]),
            ("STEP 03", ("v", "media/lab/kitchen-revit.mp4", "media/lab/kitchen-revit-poster.jpg"), "03",
             ("flag", "Pro"), "כתיבה חזרה לרוויט", "Write back to Revit", "על עותק חדש", "#", []),
        ]),
}


def media_html(m):
    if m[0] == "v":
        return ('<video src="%s" poster="%s" muted loop playsinline autoplay '
                'preload="metadata" aria-hidden="true"></video>' % (m[1], m[2]))
    if m[0] == "img":
        return '<img src="%s" alt="" loading="lazy">' % m[1]
    return ('<span class="mockscreen"><em></em><strong>%s</strong>'
            '<span class="ltr">%s</span></span>' % (m[1], m[2]))


def win_html(w, hue):
    stage, media, ix, badge, oneline, rname, press, href, chips = w
    words = " ".join("<b>%s</b>" % x for x in oneline.split())
    bd = '\n              <span class="wbadge %s">%s</span>' % badge if badge else ""
    ch = ""
    if chips:
        ch = ('\n              <span class="steplist">' +
              "".join("<b>%s</b>" % c for c in chips) + "</span>")
    return """        <div class="winwrap %s rev">
          <span class="stage ltr">%s</span>
          <span class="glow" aria-hidden="true"></span>
          <a class="win" href="%s">
            <span class="bezel"><span class="screen">
              %s
              <span class="cix ltr">%s</span>%s
              <span class="center">
                <span class="oneline">%s</span>%s
                <span class="uline"></span>
              </span>
            </span></span>
            <span class="wbody">
              <span class="ribbon"><span class="rname">%s</span><span class="press">%s <i class="arw ltr">&#8592;</i></span></span>
            </span>
          </a>
        </div>""" % (hue, stage, href, media_html(media), ix, bd, words, ch, rname, press)


def body_html(p):
    arrow = '        <div class="parrow%s rev" aria-hidden="true"></div>' % (
        " down" if p["layout"] == "col" else "")
    parts = []
    for i, w in enumerate(p["wins"]):
        if i:
            parts.append(arrow)
        parts.append(win_html(w, p["hue"]))
    return """<section class="bs bs-hero" dir="rtl" aria-label="%(title)s">
%(herobg)s
  <div class="inner">
    <h1 class="rev">o<span class="yflash">Y</span>mer%(rest)s</h1>
    <p class="sub rev">%(sub)s</p>
  </div>
</section>

<main class="suite bs" dir="rtl">
  <section class="pipesec products %(hue)s" id="pipeline">
%(bimbg)s
    <div class="inner">
      <div class="phead rev">
        <span class="no ltr">%(no)s</span>
        <h2>%(h2)s</h2>
        <p class="lead">%(lead)s</p>
      </div>
      <div class="pipe %(layout)s">
%(pipe)s
      </div>
    </div>
  </section>
</main>
""" % dict(p, herobg=HERO_BG, bimbg=BIMBG,
           rest=p["title"][len("oYmer"):], pipe="\n\n".join(parts))


SCRIPTS = """<script>
  (function () {
    var els = document.querySelectorAll(".rev");
    function showAll() { Array.prototype.forEach.call(els, function (e) { e.classList.add("in"); }); }
    if (!("IntersectionObserver" in window)) { showAll(); return; }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        var d = parseInt(en.target.dataset.i || "0", 10) * 90;
        setTimeout(function () { en.target.classList.add("in"); }, d);
        io.unobserve(en.target);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    Array.prototype.forEach.call(els, function (e, i) { e.dataset.i = (i % 4); io.observe(e); });
    setTimeout(showAll, 3000);
  })();

  (function () {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    var MAXX = 8, MAXY = 10;
    Array.prototype.forEach.call(document.querySelectorAll(".winwrap"), function (wrap) {
      var win = wrap.querySelector(".win"), glow = wrap.querySelector(".glow"), raf = 0;
      if (!win) return;
      wrap.addEventListener("mousemove", function (ev) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = 0;
          var r = wrap.getBoundingClientRect();
          var px = (ev.clientX - r.left) / r.width - 0.5;
          var py = (ev.clientY - r.top) / r.height - 0.5;
          win.style.transform = "translateY(-8px) rotateX(" + (-py * MAXX).toFixed(2) +
            "deg) rotateY(" + (px * MAXY).toFixed(2) + "deg) translateZ(18px)";
          if (glow) glow.style.transform = "translate(" + (px * -28).toFixed(1) + "px," +
            (py * -22 + 12).toFixed(1) + "px) scale(1.08)";
        });
      });
      wrap.addEventListener("mouseleave", function () {
        win.style.transform = ""; if (glow) glow.style.transform = "";
      });
    });
  })();
</script>"""


def page(title, body, pipe_css=True):
    idx = io.open("index.html", encoding="utf-8").read()
    i = idx.find("<header"); j = idx.find("</header>") + 9
    return ('<!doctype html>\n<html lang="he" dir="rtl">\n<head>\n'
            '<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
            '<title>' + title + ' - מוקאפ עיצוב | omerdotan.com</title>\n'
            '<link href="base44.css" rel="stylesheet">\n'
            '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
            '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
            '<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@500;600;700;800'
            '&family=Heebo:wght@400;500;600;700;800&display=swap" rel="stylesheet">\n'
            '<link href="bimsuite-mockup.css?v=11" rel="stylesheet">\n'
            + ('<link href="suite-pipe.css?v=3" rel="stylesheet">\n' if pipe_css else '')
            + '</head>\n<body>\n<div class="min-h-screen" dir="rtl">\n'
            + idx[i:j] + "\n" + body + "\n</div>\n" + SCRIPTS + "\n"
            '<script src="oymer.js?v=19"></script>\n'
            '<script src="menu-preview.js?v=2"></script>\n'
            '</body>\n</html>\n')


for out, p in PAGES.items():
    html = page(p["title"], body_html(p))
    io.open(out, "w", encoding="utf-8").write(html)
    print(out, len(html), "bytes")

# the suite hub keeps its hand-written body
hub = io.open("bimsuite-mockup.body.html", encoding="utf-8").read()
io.open("bimsuite-mockup.html", "w", encoding="utf-8").write(
    page("oYmer BIM VR Suite", hub, pipe_css=False))
print("bimsuite-mockup.html rebuilt")


# ---------------------------------------------------------------- one file with everything
import re

def tours_parts():
    """head <style> blocks + the <main> content of the Tours mockup, minus its old products strip."""
    t = io.open("vrtours-mockup.html", encoding="utf-8").read()
    head = t[:t.find("</head>")]
    styles = "\n".join(m.group(0) for m in re.finditer(r"<style>.*?</style>", head, re.S))
    a = t.find("<main"); a = t.find(">", a) + 1
    b = t.find('<section class="py-24 bg-white"')      # drop the stale 4-product strip
    if b < 0:
        b = t.rfind("</main>")
    return styles, t[a:b]


CHIPS = [
    ("sec-suite", "BIM VR Suite"),
    ("sec-decision", "DecisionMaker"),
    ("sec-viewer", "Viewer"),
    ("sec-family", "Family Creator"),
    ("sec-type", "Type Studio"),
    ("sec-tours", "VR Tours"),
]

SWITCH_CSS = """<style>
.allnav{position:fixed;bottom:0;right:0;left:0;z-index:70;display:flex;gap:8px;align-items:center;
  padding:10px 18px;background:rgba(13,9,28,.94);backdrop-filter:blur(10px);overflow-x:auto;
  box-shadow:0 -6px 24px rgba(0,0,0,.34);direction:rtl;
  font-family:"Rubik",ui-sans-serif,system-ui,sans-serif}
.allnav b{font-size:11px;font-weight:800;letter-spacing:.14em;color:#8f86b5;white-space:nowrap;margin-left:6px}
.allnav a{font-size:12.5px;font-weight:700;color:#d7d0ee;background:rgba(255,255,255,.06);
  border:1px solid rgba(195,179,255,.24);border-radius:999px;padding:7px 15px;white-space:nowrap;
  text-decoration:none;transition:background .18s,color .18s,border-color .18s}
.allnav a:hover{background:#fff;color:#191130;border-color:#fff}
.allnav a.on{background:#ff7a00;color:#1a0f00;border-color:#ff7a00}
.allsec{scroll-margin-top:0}
.allmark{position:relative;z-index:20;background:#0b0818;color:#8f86b5;direction:rtl;
  font-family:"Rubik",sans-serif;font-size:11px;font-weight:800;letter-spacing:.2em;
  padding:12px 28px;border-top:1px solid rgba(195,179,255,.16)}
body{padding-bottom:56px}
</style>"""

SWITCH_JS = """<script>
(function(){
  var links=[].slice.call(document.querySelectorAll(".allnav a"));
  var secs=links.map(function(a){return document.getElementById(a.getAttribute("href").slice(1));});
  function mark(){
    var y=window.scrollY+120,best=0;
    secs.forEach(function(s,i){ if(s && s.offsetTop<=y) best=i; });
    links.forEach(function(a,i){ a.classList.toggle("on", i===best); });
  }
  window.addEventListener("scroll",mark,{passive:true}); mark();
  links.forEach(function(a){
    a.addEventListener("click",function(e){
      e.preventDefault();
      var t=document.getElementById(a.getAttribute("href").slice(1));
      if(t) window.scrollTo({top:t.offsetTop,behavior:"smooth"});
    });
  });
})();
</script>"""

order = [
    ("sec-suite", "01  BIM VR SUITE", io.open("bimsuite-mockup.body.html", encoding="utf-8").read()),
    ("sec-decision", "02  DECISIONMAKER", body_html(PAGES["decisionmaker-mockup.html"])),
    ("sec-viewer", "03  VIEWER", body_html(PAGES["viewer-mockup.html"])),
    ("sec-family", "04  FAMILY CREATOR", body_html(PAGES["familycreator-mockup.html"])),
    ("sec-type", "05  TYPE STUDIO", body_html(PAGES["typestudio-mockup.html"])),
]

tstyles, tbody = tours_parts()

chunks = []
for sid, label, body in order:
    body = body.replace("<main ", "<div ").replace("</main>", "</div>")
    chunks.append('<div class="allmark">%s</div>\n<div class="allsec" id="%s">\n%s\n</div>' % (label, sid, body))
chunks.append('<div class="allmark">06  VR TOURS</div>\n<div class="allsec" id="sec-tours">\n%s\n</div>' % tbody)

nav = ('<nav class="allnav" dir="rtl"><b>' + 'קפיצה' + '</b>' +
       "".join('<a href="#%s">%s</a>' % (i, n) for i, n in CHIPS) + '</nav>')

idx = io.open("index.html", encoding="utf-8").read()
h1 = idx.find("<header"); h2 = idx.find("</header>") + 9

allhtml = ('<!doctype html>\n<html lang="he" dir="rtl">\n<head>\n<meta charset="utf-8">\n'
           '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
           '<title>oYmer - כל העמודים והתפריט | מוקאפ</title>\n'
           '<link href="base44.css" rel="stylesheet">\n'
           '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
           '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
           '<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@500;600;700;800'
           '&family=Heebo:wght@400;500;600;700;800&display=swap" rel="stylesheet">\n'
           '<link href="bimsuite-mockup.css?v=11" rel="stylesheet">\n'
           '<link href="suite-pipe.css?v=3" rel="stylesheet">\n'
           + tstyles + "\n" + SWITCH_CSS + '\n</head>\n<body>\n<div class="min-h-screen" dir="rtl">\n'
           + idx[h1:h2] + "\n" + "\n".join(chunks) + "\n</div>\n" + nav + "\n"
           + SCRIPTS + "\n" + SWITCH_JS + "\n"
           '<script src="oymer.js?v=19"></script>\n'
           '<script src="menu-preview.js?v=2"></script>\n</body>\n</html>\n')

io.open("all-mockup.html", "w", encoding="utf-8").write(allhtml)
print("all-mockup.html", len(allhtml), "bytes")
