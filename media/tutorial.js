/* oYmer tutorial window - shared by Editor.html and VRTours.html.
 *
 * Self-contained on purpose: it injects its own CSS and markup so the editor's
 * 11k-line file only ever gains one <script> tag and one <button>. First of the
 * in-editor help items, so keep it generic - the chapter list is the only
 * clip-specific part.
 *
 * The window grows out of whatever button opened it (FLIP: place it at its final
 * size, transform it back onto the button, then release the transform).
 */
(function () {
  'use strict';

  var SRC = 'media/tour-tutorial.mp4';
  var POSTER = 'media/tutorial-poster.jpg';
  var TITLE = 'איך בונים סיור';

  // marketing cut - short chip labels, not a manual's table of contents.
  // every time below was read off the encoded clip, not off the source recording:
  // 0:00 file dialog · 0:06 scenes start appearing · 0:50 first hotspot selected
  // 2:54 image picker · 3:22 save dialog · 3:36 floor-plan modal · 4:04 film modal
  // 4:20 export dialog (the exported tour then runs from 4:26)
  var CHAPTERS = [
    [0, 'פנורמות'],
    [6, 'סצנות'],
    [50, 'נקודות מעבר'],
    [172, 'מדיה'],
    [202, 'שמירה'],
    [215, 'תוכנית קומה'],
    [243, 'סרט אוטומטי'],
    [258, 'ייצוא']
  ];

  var CSS = [
    '.oyt-back{position:fixed;inset:0;z-index:9000;background:rgba(6,8,18,.82);',
    '  backdrop-filter:blur(5px);opacity:0;transition:opacity .26s ease;pointer-events:none}',
    '.oyt-back.is-on{opacity:1;pointer-events:auto}',
    /* the window: same neon frame as the tour demo on the site */
    /* 1020px is the width the 8 chapter chips need to sit on ONE line (945px of
       chips + padding). Narrow it and the strip wraps to two rows. */
    '.oyt-win{position:fixed;z-index:9001;width:min(1020px,94vw);',
    '  background:linear-gradient(160deg,#12122a 0%,#0c182b 100%);',
    '  border:1px solid rgba(2,242,255,.55);',
    '  box-shadow:inset 0 0 0 1px rgba(2,242,255,.10),0 0 38px rgba(2,242,255,.28),',
    '             0 22px 60px rgba(6,8,18,.65);',
    '  opacity:0;transform-origin:top left;pointer-events:none;',
    '  font-family:"Rajdhani","Assistant","Segoe UI",system-ui,sans-serif}',
    '.oyt-win.is-on{opacity:1;pointer-events:auto}',
    '.oyt-head{display:flex;align-items:center;gap:12px;padding:11px 14px;',
    '  border-bottom:1px solid rgba(2,242,255,.22)}',
    '.oyt-title{flex:1;font-size:1.02rem;font-weight:700;letter-spacing:.04em;color:#02f2ff;',
    '  text-shadow:0 0 14px rgba(2,242,255,.5)}',
    '.oyt-x{width:30px;height:30px;flex-shrink:0;background:transparent;',
    '  border:1px solid rgba(2,242,255,.4);color:#02f2ff;font-size:1rem;line-height:1;',
    '  cursor:pointer;padding:0}',
    '.oyt-x:hover{background:rgba(2,242,255,.15)}',
    /* aspect-ratio reserves the box BEFORE the file loads - without it the window
       measures itself short, so it opens off-centre and grows out of frame */
    '.oyt-win video{display:block;width:100%;aspect-ratio:1280/583;max-height:58vh;',
    '  object-fit:contain;background:#04060f}',
    /* chapters: player-style buttons in a strip under the video */
    '.oyt-chaps{display:flex;flex-wrap:wrap;gap:7px;padding:12px 14px 14px}',
    '.oyt-chap{display:flex;align-items:baseline;gap:7px;padding:6px 12px;cursor:pointer;',
    '  white-space:nowrap;',
    '  background:linear-gradient(160deg,#171733 0%,#101f34 100%);',
    '  border:1px solid rgba(2,242,255,.28);color:#dbe6f5;font:inherit;font-size:.86rem;',
    '  letter-spacing:.02em;transition:border-color .15s ease,background .15s ease}',
    '.oyt-chap:hover{background:rgba(2,242,255,.13);border-color:rgba(2,242,255,.55)}',
    '.oyt-chap b{font-weight:600}',
    '.oyt-chap i{font-style:normal;font-size:.76rem;color:#ff9a3c;',
    '  font-variant-numeric:tabular-nums}',
    '.oyt-chap.is-on{background:rgba(2,242,255,.2);border-color:#02f2ff;color:#fff;',
    '  box-shadow:0 0 14px rgba(2,242,255,.3)}',
    '.oyt-chap.is-on i{color:#ffc38a}',
    /* tighten the chips before letting them wrap on smaller screens */
    '@media (max-width:1090px){.oyt-chap{font-size:.8rem;padding:5px 8px;gap:5px}',
    '  .oyt-chaps{gap:5px;padding:10px 10px 12px}}',
    '@media (max-width:640px){.oyt-chap{font-size:.76rem;padding:4px 7px}',
    '  .oyt-title{font-size:.92rem}}'
  ].join('\n');

  var win, back, video, chips = [], active = -1, opener = null, wasOpen = false;

  function stamp(s) {
    return Math.floor(s / 60) + ':' + ('0' + Math.floor(s % 60)).slice(-2);
  }

  function build() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    back = document.createElement('div');
    back.className = 'oyt-back';
    back.addEventListener('click', close);

    win = document.createElement('div');
    win.className = 'oyt-win';
    win.setAttribute('dir', 'rtl');
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-modal', 'true');
    win.setAttribute('aria-label', TITLE);

    var head = document.createElement('div');
    head.className = 'oyt-head';
    var t = document.createElement('span');
    t.className = 'oyt-title';
    t.textContent = TITLE;
    var x = document.createElement('button');
    x.className = 'oyt-x';
    x.type = 'button';
    x.innerHTML = '&#10005;';
    x.setAttribute('aria-label', 'סגירה');
    x.addEventListener('click', close);
    head.appendChild(t);
    head.appendChild(x);

    video = document.createElement('video');
    video.src = SRC;
    video.poster = POSTER;
    video.controls = true;
    video.playsInline = true;
    video.preload = 'none';
    video.dir = 'ltr';   // the window is RTL; leave the native controls unmirrored
    video.addEventListener('timeupdate', follow);

    var strip = document.createElement('div');
    strip.className = 'oyt-chaps';
    chips = CHAPTERS.map(function (c, i) {
      var b = document.createElement('button');
      b.className = 'oyt-chap';
      b.type = 'button';
      var time = document.createElement('i');
      time.textContent = stamp(c[0]);
      var label = document.createElement('b');
      label.textContent = c[1];
      b.appendChild(time);
      b.appendChild(label);
      b.addEventListener('click', function () {
        // a chapter clicked before the file has metadata would have its seek
        // dropped, so queue it instead of setting currentTime into the void
        if (video.readyState < 1) {
          video.addEventListener('loadedmetadata', function () {
            video.currentTime = c[0];
          }, { once: true });
        } else {
          video.currentTime = c[0];
        }
        video.play().catch(function () {});
        mark(i);
      });
      strip.appendChild(b);
      return b;
    });

    win.appendChild(head);
    win.appendChild(video);
    win.appendChild(strip);
    document.body.appendChild(back);
    document.body.appendChild(win);
  }

  function mark(i) {
    if (i === active) return;
    if (chips[active]) chips[active].classList.remove('is-on');
    if (chips[i]) chips[i].classList.add('is-on');
    active = i;
  }

  function follow() {
    var t = video.currentTime, i = 0;
    for (var k = 0; k < CHAPTERS.length; k++) {
      if (t >= CHAPTERS[k][0] - 0.25) i = k;
    }
    mark(i);
  }

  // centre the window, then compute the transform that lays it back over the
  // opening button - releasing that transform is the grow animation.
  function place(from) {
    win.style.transition = 'none';
    win.style.transform = 'none';
    win.style.left = '0px';
    win.style.top = '0px';
    var w = win.offsetWidth, h = win.offsetHeight;
    var left = Math.max(12, (window.innerWidth - w) / 2);
    var top = Math.max(12, (window.innerHeight - h) / 2);
    win.style.left = left + 'px';
    win.style.top = top + 'px';
    if (!from) return '';
    var sx = Math.max(from.width / w, 0.02);
    var sy = Math.max(from.height / h, 0.02);
    return 'translate(' + (from.left - left) + 'px,' + (from.top - top) + 'px) scale(' +
           sx.toFixed(4) + ',' + sy.toFixed(4) + ')';
  }

  function recentre() {
    if (!wasOpen) return;
    win.style.left = Math.max(12, (window.innerWidth - win.offsetWidth) / 2) + 'px';
    win.style.top = Math.max(12, (window.innerHeight - win.offsetHeight) / 2) + 'px';
  }

  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  function open(btn) {
    if (!win) build();
    opener = btn || null;
    var from = opener && !REDUCED ? opener.getBoundingClientRect() : null;
    var start = place(from);
    win.style.transform = start || 'none';
    win.style.opacity = start ? '0' : '';
    back.classList.add('is-on');
    // force a reflow so the start transform is committed before the transition
    void win.offsetWidth;
    win.style.transition = 'transform .34s cubic-bezier(.16,.9,.3,1),opacity .2s ease';
    win.style.transform = 'none';
    win.style.opacity = '';
    win.classList.add('is-on');
    wasOpen = true;
    document.addEventListener('keydown', onKey, true);
    window.addEventListener('resize', recentre);
    video.play().catch(function () {});
  }

  function close() {
    if (!wasOpen) return;
    wasOpen = false;
    video.pause();
    document.removeEventListener('keydown', onKey, true);
    window.removeEventListener('resize', recentre);
    var from = opener && !REDUCED ? opener.getBoundingClientRect() : null;
    back.classList.remove('is-on');
    if (from) {
      var w = win.offsetWidth, h = win.offsetHeight;
      var r = win.getBoundingClientRect();
      win.style.transition = 'transform .26s cubic-bezier(.4,0,.9,.5),opacity .26s ease';
      win.style.transform = 'translate(' + (from.left - r.left) + 'px,' + (from.top - r.top) +
        'px) scale(' + Math.max(from.width / w, 0.02).toFixed(4) + ',' +
        Math.max(from.height / h, 0.02).toFixed(4) + ')';
    }
    win.classList.remove('is-on');
    if (opener && opener.focus) opener.focus();
  }

  // Capture phase, and stopImmediatePropagation: the editor binds Delete / Escape /
  // Ctrl+S / H on document too, and a bubble-phase listener could not stop those from
  // firing while the window is open (Delete would eat the selected hotspot).
  // Keys aimed at the player itself are left alone so its native controls still work.
  function onKey(e) {
    if (win && win.contains(e.target)) {
      if (e.key === 'Escape') { e.stopImmediatePropagation(); close(); }
      return;
    }
    e.stopImmediatePropagation();
    if (e.key === 'Escape') close();
  }

  function attach(btn) {
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      open(btn);
    });
  }

  window.oYmerTutorial = { attach: attach, open: open, close: close };

  // any button carrying data-oymer-tutorial opens it - nothing else to wire up
  function auto() {
    var list = document.querySelectorAll('[data-oymer-tutorial]');
    for (var i = 0; i < list.length; i++) attach(list[i]);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', auto);
  } else {
    auto();
  }
})();
