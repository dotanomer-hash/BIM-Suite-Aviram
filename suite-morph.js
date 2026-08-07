/* suite-morph - the Family Creator window flips into its own page.
   Built for ONE window on purpose (winwrap.c3). If it survives Omer's eye it gets
   generalised to the other three by adding their hue + hero copy to PRODUCTS below.

   The move, in his words: the window enlarges, flips mid-way to become the full page,
   the hero recolours gradually, "BIM VR" rises to its small target size, and the
   product title takes the place it left.

   Why it is built this way:
   - the card's rect is read from getBoundingClientRect, which is viewport-relative by
     definition, so the effect is correct at ANY scroll position - that was the ask.
   - two faces, not one: the FRONT is the card at its natural pixel size (exact at t=0),
     the BACK is the destination hero laid out at full viewport size (exact at t=end).
     Each face is pixel-perfect at the moment that matters, so neither the take-off nor
     the landing pops.
   - the back face is built from the destination's OWN markup and classes, so the browser
     lays it out identically and the final frame is the page we are about to load. */
(function () {
  "use strict";

  var PRODUCTS = {
    "suite-viewer.html": {
      hue: "c2", name: 'Viewer', sub: 'מודל ה-BIM בתוך מציאות מדומה.',
      ix: '02', video: 'media/viewer/reel-1.mp4', poster: 'media/viewer/reel-1.jpg',
      oneline: 'מודל ה BIM בתוך ה VR'
    },
    "suite-decisionmaker.html": {
      hue: "c1",
      name: 'DecisionMaker',
      sub: 'פגישת אישור בקנה מידה 1:1.',
      ix: '01',
      video: 'media/reels/quest.mp4',
      poster: 'media/reels/quest.jpg',
      oneline: 'פגישת אישור בקנה מידה 1:1'
    },
    "suite-familycreator.html": {
      hue: "c3",
      name: 'Family Creator',
      sub: 'יצירת משפחות דינמיות לרוויט.',
      /* what the window looks like back in the suite grid - the back face of the return flip */
      ix: '03',
      video: 'media/lab/kitchen-lab.mp4',
      poster: 'media/lab/kitchen-lab-poster.jpg',
      oneline: 'יצירת משפחות דינמיות לרוויט'
    },
    /* Type Studio was the one product still missing here, so its window navigated flat
       while the other three flipped. Same entry shape, its own teal hue. */
    "suite-typestudio.html": {
      hue: "c4",
      name: 'Type Studio',
      sub: 'יצירת טיפוסים חדשים בתוך רוויט.',
      ix: '04',
      video: 'media/lab/kitchen-revit.mp4',
      poster: 'media/lab/kitchen-revit-poster.jpg',
      oneline: 'יצירת טיפוסים חדשים בתוך רוויט'
    }
  };
  var SUITE = "bimsuite.html";

  /* ================= backdrop mode =================
     This document is being rendered INSIDE the folding page, as the thing you see
     behind it. It shows the suite exactly as the real arrival will, minus the one
     window that is about to turn in - so the fold reveals a suite with a hole in it,
     and the window flies into that hole. Nothing here is interactive, so every handler
     below is skipped.

     The flag is the HASH (#bg), not a query. Measured on the host: with `?bg=c3` the
     backdrop and the navigation that follows are two DIFFERENT urls, so the browser
     cached the backdrop and then refetched the suite for real - transferSize 4574,
     htmlFromCache false, and 865ms of nothing between the fold ending and the window
     turning in. A hash is not part of the cache key and is never sent to the server,
     so the backdrop now warms the EXACT url the navigation asks for. */
  var BG = (location.hash.match(/^#bg=(c[1-4])$/) || [])[1];
  if (BG) {
    document.documentElement.className += " fromproduct bgstage";
    var bgWrap = document.querySelector(".winwrap." + BG);
    if (bgWrap) {
      bgWrap.style.visibility = "hidden";
      /* park the view where the real arrival parks it, or the reveal jumps on navigate */
      var bgH = document.documentElement.clientHeight;
      var bgR = bgWrap.getBoundingClientRect();
      window.scrollTo(0, window.scrollY + bgR.top + bgR.height / 2 - bgH / 2);
    }
    /* a hidden backdrop must not pull four videos down the wire - posters are enough */
    Array.prototype.forEach.call(document.querySelectorAll("video"), function (v) {
      v.removeAttribute("autoplay");
      Array.prototype.forEach.call(v.querySelectorAll("source"), function (s) {
        s.parentNode.removeChild(s);
      });
      v.removeAttribute("src");
      try { v.load(); } catch (e) {}
    });
    return;
  }

  /* The beats OVERLAP on purpose. First pass ran them end to end - flip, then colour,
     then titles - and it read as a queue of separate events instead of one move.
     Each beat now starts while the one before it is still running. */
  var FLIP = 860;      // grow + flip; the faces swap at FLIP/2, edge-on, unseen
  var NAV  = 1500;     // navigate under full cover

  /* The arrival beats used cubic-bezier(.2,.75,.2,1). Measured on the tag rise, that
     curve leaves at 3.75x its own average speed (.75/.2) and the trace agrees: the tag
     covers 93% of its 63px in the first 300ms, then spends the last 320ms crawling the
     remaining 4px. Same curve, same 3.7x, on the title. Dart, then nothing - which is
     the pulse. This one leaves at 1.56x average (.5/.32) and still parks at zero, so
     the beats decelerate into place instead of snapping and waiting. */
  var EASE_SETTLE = "cubic-bezier(.32,.5,.28,1)";

  if (!document.body || !document.body.animate) return;                 // no WAAPI -> plain link
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  /* ================= no media storm at a page swap =================
     Measured on arrival: FOUR videos with preload defaulting to auto, two of them above
     the fold, still fetching 21.6s after navigation. They all begin decoding at exactly
     the moment the hero lands, and each one visibly steps poster -> first frame -> play.
     So: detach every source, let the poster hold the frame, and re-attach only when the
     video is near the viewport - and not until the arrival has had time to settle. */
  (function lazyVideo() {
    var vids = Array.prototype.slice.call(document.querySelectorAll("video[src][poster]"));
    if (!vids.length || !("IntersectionObserver" in window)) return;
    vids.forEach(function (v) {
      v.dataset.lazySrc = v.getAttribute("src");
      v.removeAttribute("src");
      v.preload = "none";
      v.load();                                   // drops the in-flight fetch, keeps the poster
    });
    var n = 0;
    function attach(v) {
      if (!v.dataset.lazySrc) return;
      var wait = (n++) * 140;                     // stagger, so they never land together
      setTimeout(function () {
        v.preload = "auto";
        v.src = v.dataset.lazySrc;
        delete v.dataset.lazySrc;
        var pr = v.play();
        if (pr && pr.catch) pr.catch(function () {});
      }, wait);
    }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        attach(e.target);
      });
    }, {rootMargin: "300px"});
    /* let the page (and any arrival animation) settle before any of this starts */
    setTimeout(function () { vids.forEach(function (v) { io.observe(v); }); }, 480);
  })();

  function plainClick(ev) {
    return ev.button === 0 && !ev.metaKey && !ev.ctrlKey && !ev.shiftKey && !ev.altKey;
  }

  /* ---------- outbound: a suite window flips into its product page ---------- */
  Object.keys(PRODUCTS).forEach(function (href) {
    var link = document.querySelector('a.win[href$="' + href + '"]');
    if (!link) return;
    link.addEventListener("click", function (ev) {
      if (!plainClick(ev)) return;
      ev.preventDefault();
      if (document.getElementById("morph")) return;                     // already flying
      fly(link, href, PRODUCTS[href]);
    });
  });

  /* ---------- return: the product page shrinks back into its window ----------
     bound to BOTH ways back - the suite tag in the hero and the link at the foot of
     the page - so whichever one is reached for, the same move plays. */
  (function () {
    var here = location.pathname.split("/").pop();
    var p = PRODUCTS[here];
    if (!p) return;
    var ways = document.querySelectorAll(
      'a.bs-suitetag[href$="' + SUITE + '"], a.backsuite__link[href$="' + SUITE + '"]');
    Array.prototype.forEach.call(ways, function (a) {
      a.addEventListener("click", function (ev) {
        if (!plainClick(ev)) return;
        ev.preventDefault();
        if (document.getElementById("morph")) return;
        flyBack(p);
      });
    });
  })();

  function heroHTML(p) {
    return '' +
      '<section class="bs bs-hero mh-band" dir="rtl">' +
        '<div class="bs-herobg" aria-hidden="true">' +
          '<span class="p p1"></span><span class="p p3"></span>' +
          '<span class="p p2"></span><span class="p p4"></span>' +
        '</div>' +
        '<span class="mh-wash hue-' + p.hue + '" aria-hidden="true"></span>' +
        '<div class="inner">' +
          '<span class="bs-suitetag mh-suite">o<span class="y">Y</span>mer ' +
            '<b>BIM VR</b> Suite<sup class="oyc">&#169;</sup></span>' +
          '<h1 class="mh-prod"><span class="oy">o<span class="yflash">Y</span>mer</span> ' +
            p.name + '<sup class="oyc">&#169;</sup></h1>' +
          '<p class="sub mh-sub">' + p.sub + '</p>' +
        '</div>' +
      '</section>';
  }

  /* the hue custom properties live on `.suite .c1-.c4`. anything we build inside #morph
     sits outside .suite, so the vars never resolve there - they have to travel inline. */
  var HUES = {
    c1: ["255,122,0", "196,88,0", "#1a0f00"], c2: ["139,108,240", "92,64,190", "#ffffff"],
    c3: ["79,125,255", "44,82,196", "#ffffff"], c4: ["43,179,163", "22,124,113", "#052b27"]
  };
  function paintHue(el, hue) {
    var h = HUES[hue]; if (!h) return;
    el.style.setProperty("--c", h[0]);
    el.style.setProperty("--cd", h[1]);
    el.style.setProperty("--con", h[2]);
  }

  /* the window as it sits in the suite grid - the face the return flip lands on */
  function cardHTML(p) {
    var words = p.oneline.split(" ").map(function (w) { return "<b>" + w + "</b>"; }).join(" ");
    return '' +
      '<div class="winwrap ' + p.hue + ' in">' +
        '<span class="glow" aria-hidden="true"></span>' +
        '<span class="win">' +
          '<span class="wtop"><span class="rname ltr"><span class="oy">oYmer</span> ' +
            p.name + '<sup class="oyc">&#169;</sup></span></span>' +
          '<span class="bezel"><span class="screen">' +
            '<video src="' + p.video + '" poster="' + p.poster + '" muted loop playsinline ' +
              'autoplay preload="metadata" aria-hidden="true"></video>' +
            '<span class="cix ltr">' + p.ix + '</span>' +
            '<span class="center"><span class="oneline">' + words + '</span>' +
            '<span class="uline"></span></span>' +
          '</span></span>' +
          '<span class="wbody"><span class="ribbon"><span class="press">' +
            'לחצו לעמוד המלא <i class="arw ltr">&#8592;</i></span></span></span>' +
        '</span>' +
      '</div>';
  }

  /* ================= the return: the page folds back into its window =================
     The first attempt built two faces - a fake hero plane and a fake card - and animated
     them independently. Measured, that was wrong twice over:
       - at click the page is scrolled (1777px down when the foot link is used), so the
         hero plane covered the viewer with a screen they were not looking at;
       - two separate animations desynced - at t=350 the faces read 113deg and -41deg
         when a flip needs them exactly opposite, so it never turned as one object.

     So: no fake faces, and never two rotations at once. HALF the turn happens here on
     the real document - your actual screen folds away - and the suite page completes
     the SAME turn on the real card. One rotation each side, nothing to desync. */
  /* The two halves are ONE 180deg ease-in-out, cut down the middle - so they must meet
     at the same speed. The first attempt did not: the fold left at 0.238 deg/ms and the
     arrival entered at 0.70, a 3x jump, which read as the card whipping into place and
     then crawling (its last 240ms covered 5 degrees).
     Equal durations, and complementary curves whose slopes match at the seam:
       fold exit   (1-.55)/(1-.75) = 1.8
       arrival in       .45/.25    = 1.8   -> 0.31 deg/ms on both sides. */
  /* TURN_IN is deliberately LONGER than the fold. To hand over at the fold's measured
     exit speed (0.157 deg/ms) and still coast to a stop, the arrival's average speed
     must be below that - and 90deg/520ms averages 0.173, which forced a mid-turn bulge
     (measured 0.207 -> 0.324 -> 0). At 700ms the average is 0.129, so the turn can
     decelerate all the way down without ever speeding back up. */
  var TURN_OUT = 520, TURN_IN = 700;
  /* Measured, not predicted: the fold does NOT exit at the slope its control points
     suggest - it peaks at 0.285 deg/ms mid-turn and hands over at 0.157. So the arrival
     is tuned to enter at that measured number rather than at a theoretical one.
     entry slope .30/.33 = 0.91 -> 0.91 x (90/520) = 0.157 deg/ms, matching the fold. */
  var EASE_OUT_HALF = "cubic-bezier(.4,0,.75,.55)";     // accelerating away
  /* the arrival's easing now lives per-keyframe on the animation itself, because it
     ends in a damped settle rather than a single curve - see the turn-in below */

  function flyBack(p) {
    var W = document.documentElement.clientWidth,
        H = document.documentElement.clientHeight;
    var root = document.querySelector(".min-h-screen") || document.body;

    /* ---------- put the suite behind BEFORE anything turns ----------
       The fold used to end on the body background, and the page it folds toward has
       --ground #f7f5fb - within 3% of white. So tinting the backdrop would still read
       as folding into nothing; only the real page fixes it. This also warms the cache
       for the navigation that follows, so the handover lands on a painted page.
       position:absolute at the current scrollY, NOT fixed: html.morphing puts a
       perspective on <body>, which makes body the containing block for fixed children,
       and inset:0 would then pin the backdrop to the top of a 1782px document instead
       of to the screen. */
    var bg = document.createElement("iframe");
    bg.id = "bgstage";
    bg.setAttribute("aria-hidden", "true");
    bg.setAttribute("tabindex", "-1");
    bg.style.top = window.scrollY + "px";
    bg.style.width = W + "px";
    bg.style.height = H + "px";
    bg.addEventListener("load", function () { bg.classList.add("on"); });
    /* the SAME url the navigation will ask for, with the backdrop flag in the hash -
       so this load populates the cache entry the navigation then hits */
    bg.src = SUITE + "?to=" + p.hue + "#bg=" + p.hue;
    document.body.insertBefore(bg, document.body.firstChild);

    /* the page is taller than the viewport and scrolled, so the pivot has to be the
       centre of what is ON SCREEN, not the centre of the document */
    root.style.transformOrigin = "50% " + Math.round(window.scrollY + H / 2) + "px";
    document.documentElement.classList.add("morphing");

    var target = Math.min(470, Math.round(W * 0.44)) / W;   // shrink toward card width

    root.animate([
      {transform: "scale(1) rotateY(0deg)", opacity: 1},
      {transform: "scale(" + target.toFixed(4) + ") rotateY(90deg)", opacity: .2}
    ], {duration: TURN_OUT, easing: EASE_OUT_HALF, fill: "forwards"});

    setTimeout(function () {
      window.location.href = SUITE + "?to=" + p.hue;
    }, TURN_OUT + 40);
  }

  /* ---------- arrival on the suite page: the same turn, completed ---------- */
  (function () {
    var m = location.search.match(/[?&]to=(c[1-4])/);
    if (!m) return;
    var wrap = document.querySelector(".winwrap." + m[1]);
    if (!wrap) return;
    document.documentElement.className += " fromproduct";   // no reveal cascade, show them all
    /* put the window where the fold left off - the middle of the screen */
    var H = document.documentElement.clientHeight;
    var r = wrap.getBoundingClientRect();
    window.scrollTo(0, window.scrollY + r.top + r.height / 2 - H / 2);
    /* -90 continues the direction the page was turning; .wins already carries the
       perspective, so this reads as the far side of the same rotation */
    /* transform only - .fromproduct pins opacity with !important, and an !important
       author declaration beats an animation, so opacity keyframes here would be dead
       code. it turns in at full strength, which reads cleaner than a fade anyway. */
    /* The turn used to be two keyframes on one long-tailed curve, and measured it
       crawled: 94.4% of the travel in the first half, then 350ms to cover the last
       5.6% - the window arrived and then inched into place, which is what read as
       "not smooth towards the end".
       Omer's suggestion, and it is the right one: give it somewhere to go instead of
       somewhere to creep. It now turns a little PAST flat, comes back short, and
       settles - a damped landing rather than an asymptote. The eye reads weight, and
       the motion ends because it arrives, not because it ran out of curve. */
    wrap.animate([
      { transform: "rotateY(-90deg) scale(.82)",   easing: "cubic-bezier(.30,.45,.30,1)", offset: 0 },
      { transform: "rotateY(9deg) scale(1.028)",   easing: "cubic-bezier(.40,0,.30,1)",   offset: .68 },
      { transform: "rotateY(-3deg) scale(.991)",   easing: "cubic-bezier(.40,0,.30,1)",   offset: .85 },
      { transform: "rotateY(1deg) scale(1.004)",   easing: "ease-out",                    offset: .945 },
      { transform: "none",                                                                offset: 1 }
    ], { duration: TURN_IN });
    if (window.history.replaceState) {
      history.replaceState(null, "", location.pathname);    // don't replay on refresh
    }
  })();

  function fly(link, href, p) {
    var wrap = link.closest(".winwrap") || link.parentNode;
    var r = link.getBoundingClientRect();
    /* clientWidth, NOT innerWidth/100vw: 100vw counts the scrollbar, the destination's
       content box does not. Using vw put the landing 7px off centre. */
    var W = document.documentElement.clientWidth,
        H = document.documentElement.clientHeight;
    var cs = getComputedStyle(wrap);

    var stage = document.createElement("div");
    stage.id = "morph";

    /* ---------- front face: the card itself, at natural size, pinned over itself ---------- */
    var card = document.createElement("div");
    card.className = "mface mcard";
    card.style.left = r.left + "px";
    card.style.top = r.top + "px";
    card.style.width = r.width + "px";
    card.style.height = r.height + "px";
    /* the clone is detached from .winwrap.c3, so its hue custom properties must travel with it */
    ["--c", "--cd", "--con"].forEach(function (v) {
      card.style.setProperty(v, cs.getPropertyValue(v).trim());
    });
    var clone = link.cloneNode(true);
    clone.removeAttribute("href");
    clone.setAttribute("aria-hidden", "true");
    card.appendChild(clone);

    /* ---------- back face: the destination hero, laid out at full size ---------- */
    var hero = document.createElement("div");
    hero.className = "mface mhero";
    hero.style.width = W + "px";
    hero.style.height = H + "px";
    hero.innerHTML = heroHTML(p);

    /* ---------- render the destination BEFORE the fold, not after ----------
       The flip used to end on a fake hero and only THEN navigate, so the browser tore
       down this document, fetched the real page, parsed and painted it - a blank beat
       between the animation finishing and the content appearing, which read as the page
       snapping into existence.
       So the real page is loaded and painted here, at click, behind the stage: it has
       the whole flip (~1.5s) to arrive, decode its images and lay itself out. By the
       time NAV fires it is in cache, warm and already rendered once, and the handover
       lands on a painted page instead of a white one.
       z-index 44 puts it directly under #morph (45) and under the header (50), so it is
       covered for the whole animation. Same idea as the backdrop on the return. */
    var pre = document.createElement("iframe");
    pre.id = "prestage";
    pre.setAttribute("aria-hidden", "true");
    pre.setAttribute("tabindex", "-1");
    pre.style.width = W + "px";
    pre.style.height = H + "px";
    pre.src = href + "?from=suite";
    document.body.appendChild(pre);

    stage.appendChild(card);
    stage.appendChild(hero);
    document.body.appendChild(stage);
    stage.classList.add("on");
    link.style.visibility = "hidden";              // never peek out behind the growing clone

    /* ---------- geometry (measured BEFORE any transform is applied) ---------- */
    var tag = hero.querySelector(".mh-suite"),
        bimvr = tag.querySelector("b"),
        h1 = hero.querySelector(".mh-prod");
    var tr = tag.getBoundingClientRect(), hr = h1.getBoundingClientRect();
    /* how much bigger the hub's title is than the tag it must shrink into */
    var k = parseFloat(getComputedStyle(h1).fontSize) /
            parseFloat(getComputedStyle(bimvr).fontSize);
    /* the vertical distance it has to rise */
    var dy = (hr.top + hr.height / 2) - (tr.top + tr.height / 2);

    var s = Math.max(W / r.width, H / r.height);                 // card -> cover the viewport
    var tx = W / 2 - (r.left + r.width / 2);
    var ty = H / 2 - (r.top + r.height / 2);
    var ease = "cubic-bezier(.55,.06,.24,1)";

    /* ---------- the flip: two faces, mirrored, so exactly one ever faces the viewer ---------- */
    card.animate([
      {transform: "translate(0px,0px) scale(1) rotateY(0deg)"},
      {transform: "translate(" + tx + "px," + ty + "px) scale(" + s + ") rotateY(180deg)"}
    ], {duration: FLIP, easing: ease, fill: "forwards"});

    hero.animate([
      {transform: "translate(" + (-tx) + "px," + (-ty) + "px) scale(" + (1 / s) + ") rotateY(-180deg)"},
      {transform: "translate(0px,0px) scale(1) rotateY(0deg)"}
    ], {duration: FLIP, easing: ease, fill: "forwards"});

    /* ---------- the hero recolours gradually, plum -> the product's own hue ----------
       starts the instant the faces swap, and runs through the back half of the flip,
       so the colour is changing WHILE the panel is still turning. */
    hero.querySelector(".mh-wash").animate(
      [{opacity: 0}, {opacity: 1}],
      {duration: 620, delay: FLIP / 2 - 30, easing: "ease-in-out", fill: "forwards"});

    /* ---------- "BIM VR" rises to its target size ----------
       lifts off 200ms BEFORE the flip lands - the overlap is what makes the two
       read as one movement rather than one waiting for the other. */
    tag.animate([
      {transform: "translateY(" + dy + "px) scale(" + k + ")", opacity: 1},
      {transform: "translateY(0px) scale(1)", opacity: .92}
    ], {duration: 540, delay: FLIP - 200, easing: EASE_SETTLE, fill: "both"});

    /* ---------- and the product title takes the place it left ---------- */
    h1.animate([
      {transform: "translateY(34px) scale(.95)", opacity: 0},
      {transform: "translateY(0px) scale(1)", opacity: 1}
    ], {duration: 500, delay: FLIP + 40, easing: EASE_SETTLE, fill: "both"});

    hero.querySelector(".mh-sub").animate([
      {transform: "translateY(16px)", opacity: 0},
      {transform: "translateY(0px)", opacity: 1}
    ], {duration: 420, delay: FLIP + 180, easing: EASE_SETTLE, fill: "both"});

    /* the page we hand over to is told to skip its own entrance, so the landing is seamless */
    setTimeout(function () {
      window.location.href = href + "?from=suite";
    }, NAV);

    /* if the browser restores this page from bfcache, put the window back */
    window.addEventListener("pageshow", function (e) {
      if (!e.persisted) return;
      link.style.visibility = "";
      if (stage.parentNode) stage.parentNode.removeChild(stage);
      if (pre.parentNode) pre.parentNode.removeChild(pre);   // or Back leaves it stacked
    });
  }
})();
