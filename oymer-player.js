/* oymer-player - the clean player. See oymer-player.css for WHY each thing is off.

   Markup contract, one div per video:
     <div class="oyp oyp--loop" data-yt="ID"></div>                     ambient, muted, loops
     <div class="oyp" data-yt="ID" data-poster="media/x.jpg"></div>     press-to-play

   A press-to-play video never shows a YouTube surface: the poster is ours, the controls
   are ours, the iframe is covered by a shield, and the poster returns on ENDED so the
   end screen is never on screen. Everything is driven through the IFrame API.

   The 00:00 guard on the guided-tour clip is kept: YouTube ignores start=0, and a
   signed-in viewer is otherwise resumed where they left off. Three guards, as before -
   the nocookie host keeps no watch state, the player is cued with an explicit
   startSeconds 0, and if it still resumes, the first PLAYING event rewinds it. */
(function () {
  "use strict";

  var API_SRC = "https://www.youtube.com/iframe_api";
  var apiReady = false, apiQueue = [];

  function whenAPI(fn) {
    if (apiReady) return fn();
    apiQueue.push(fn);
    if (document.querySelector('script[data-oyp-api]')) return;
    var prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      apiReady = true;
      if (typeof prev === "function") { try { prev(); } catch (e) {} }
      apiQueue.splice(0).forEach(function (f) { f(); });
    };
    var s = document.createElement("script");
    s.src = API_SRC;
    s.setAttribute("data-oyp-api", "1");
    document.head.appendChild(s);
  }

  function params(extra) {
    var base = {
      rel: 0, controls: 0, modestbranding: 1, iv_load_policy: 3,
      playsinline: 1, disablekb: 1, fs: 0, enablejsapi: 1
    };
    var out = [];
    Object.keys(base).forEach(function (k) { out.push(k + "=" + base[k]); });
    Object.keys(extra || {}).forEach(function (k) { out.push(k + "=" + extra[k]); });
    out.push("origin=" + encodeURIComponent(location.origin));
    return out.join("&");
  }

  function frame(box, id, extra, title) {
    var f = document.createElement("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/" + id + "?" + params(extra);
    f.title = title || "";
    f.setAttribute("frameborder", "0");
    f.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");
    box.insertBefore(f, box.firstChild);
    return f;
  }

  function shield(box) {
    var s = document.createElement("div");
    s.className = "oyp__shield";
    s.setAttribute("aria-hidden", "true");
    box.appendChild(s);
    return s;
  }

  function clock(sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  var ICON = {
    play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
    loud: '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 5V4L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z"/></svg>',
    mute: '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 5V4L8 9H4zm15.5 3 2.2-2.2-1.3-1.3-2.2 2.2-2.2-2.2-1.3 1.3 2.2 2.2-2.2 2.2 1.3 1.3 2.2-2.2 2.2 2.2 1.3-1.3z"/></svg>',
    full: '<svg viewBox="0 0 24 24"><path d="M4 9V4h5v2H6v3H4zm11-5h5v5h-2V6h-3V4zM4 15h2v3h3v2H4v-5zm14 0h2v5h-5v-2h3v-3z"/></svg>'
  };

  function button(cls, html, label, fn) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "oyp__btn " + cls;
    b.innerHTML = html;
    b.setAttribute("aria-label", label);
    b.addEventListener("click", fn);
    return b;
  }

  /* ---- an ambient loop: built at once, muted, never interactive ---- */
  function buildLoop(box) {
    var id = box.getAttribute("data-yt");
    frame(box, id, { autoplay: 1, mute: 1, loop: 1, playlist: id }, box.getAttribute("data-title"));
    shield(box);
  }

  /* ---- press to play: our poster, our bar, YouTube never draws ---- */
  function buildPlayer(box) {
    var id = box.getAttribute("data-yt");
    var poster = document.createElement("button");
    poster.type = "button";
    poster.className = "oyp__poster";
    poster.setAttribute("aria-label", box.getAttribute("data-label") || "Play");
    var art = box.getAttribute("data-poster");
    if (art) poster.style.backgroundImage = 'url("' + art + '")';
    poster.innerHTML = '<span class="oyp__play" aria-hidden="true"></span>';
    box.appendChild(poster);

    var started = false;
    poster.addEventListener("click", function () {
      if (started) return;
      started = true;
      poster.hidden = true;
      whenAPI(function () { start(box, id, poster); });
    });
  }

  function start(box, id, poster) {
    var host = document.createElement("div");
    box.insertBefore(host, box.firstChild);
    var sh = shield(box);

    var bar = document.createElement("div");
    bar.className = "oyp__bar";
    var seek = document.createElement("input");
    seek.type = "range"; seek.className = "oyp__seek";
    seek.min = 0; seek.max = 1000; seek.value = 0;
    seek.setAttribute("aria-label", "Seek");
    var time = document.createElement("span");
    time.className = "oyp__time"; time.textContent = "0:00";

    var player, seeking = false, rewound = false;

    var play = button("oyp__toggle", ICON.pause, "Play / pause", function () {
      if (!player) return;
      if (player.getPlayerState() === 1) player.pauseVideo(); else player.playVideo();
    });
    var vol = button("oyp__vol", ICON.loud, "Mute", function () {
      if (!player) return;
      if (player.isMuted()) { player.unMute(); vol.innerHTML = ICON.loud; }
      else { player.mute(); vol.innerHTML = ICON.mute; }
    });
    var full = button("oyp__full", ICON.full, "Fullscreen", function () {
      var el = box;
      if (document.fullscreenElement) document.exitFullscreen();
      else if (el.requestFullscreen) el.requestFullscreen();
    });
    bar.appendChild(play); bar.appendChild(seek); bar.appendChild(time);
    bar.appendChild(vol); bar.appendChild(full);
    box.appendChild(bar);

    seek.addEventListener("input", function () { seeking = true; });
    seek.addEventListener("change", function () {
      seeking = false;
      if (player && player.getDuration()) {
        player.seekTo(player.getDuration() * (seek.value / 1000), true);
      }
    });

    var tick = setInterval(function () {
      if (!player || !player.getDuration || seeking) return;
      var d = player.getDuration(), t = player.getCurrentTime();
      if (!d) return;
      seek.value = Math.round((t / d) * 1000);
      time.textContent = clock(t) + " / " + clock(d);
    }, 250);

    player = new YT.Player(host, {
      videoId: id,
      host: "https://www.youtube-nocookie.com",
      playerVars: {
        rel: 0, controls: 0, modestbranding: 1, iv_load_policy: 3,
        playsinline: 1, disablekb: 1, fs: 0, autoplay: 1
      },
      events: {
        onReady: function (e) {
          /* explicit 0 - YouTube ignores start=0 and would resume a signed-in viewer */
          e.target.loadVideoById({ videoId: id, startSeconds: 0 });
        },
        onStateChange: function (e) {
          if (e.data === 1) {                                   /* PLAYING */
            box.classList.remove("oyp--paused");
            play.innerHTML = ICON.pause;
            if (!rewound) { rewound = true; if (player.getCurrentTime() > 1) player.seekTo(0, true); }
          } else if (e.data === 2) {                            /* PAUSED  */
            box.classList.add("oyp--paused");
            play.innerHTML = ICON.play;
          } else if (e.data === 0) {                            /* ENDED   */
            /* the end screen is drawn AFTER the last frame, so never show the last
               frame: stop, hide the player behind our poster, and start clean. */
            player.stopVideo();
            box.classList.remove("oyp--paused");
            bar.hidden = true; sh.hidden = true;
            poster.hidden = false;
            clearInterval(tick);
            poster.addEventListener("click", function again() {
              poster.removeEventListener("click", again);
              poster.hidden = true; bar.hidden = false; sh.hidden = false;
              rewound = false;
              player.loadVideoById({ videoId: id, startSeconds: 0 });
            });
          }
        }
      }
    });
  }

  function init() {
    var boxes = document.querySelectorAll(".oyp[data-yt]");
    Array.prototype.forEach.call(boxes, function (box) {
      if (box.getAttribute("data-oyp-done")) return;
      box.setAttribute("data-oyp-done", "1");
      if (box.classList.contains("oyp--loop")) buildLoop(box); else buildPlayer(box);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
