/* oYmer VR — website chat widget.
   Opens from the floating chat button (and the nav "צ'אט" link), talks to the
   Cloudflare Worker (AGENT_CONFIG.endpoint). If no endpoint is set yet, it runs
   in PREVIEW mode with canned answers so the look & feel can be reviewed with zero cost. */
(function () {
  var AGENT_CONFIG = {
    // After deploying the Worker, paste its URL here (e.g. "https://oymer-agent.<you>.workers.dev").
    endpoint: "https://oymer-agent.dotanomer.workers.dev",
    title: "העוזר החכם של עומר דותן",
    greeting: "היי! אני העוזר החכם של עומר דותן 👋 אשמח לענות על שאלות בנושא מציאות מדומה לאדריכלות, השירותים והמוצרים שלנו. במה אפשר לעזור?",
    suggestions: ["מה זה VR באדריכלות?", "אילו שירותים אתם מציעים?", "אני רוצה לדבר עם עומר"]
  };

  var SKY = "#0284c7", SKY_DARK = "#0369a1";
  var messages = [];       // {role:'user'|'assistant', content:string}
  var open = false, busy = false, greeted = false;
  var panel, log, input, sendBtn, launcher;

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  ready(init);

  function init() {
    injectStyle();
    buildPanel();
    hijackLaunchers();
  }

  /* ---- launcher ---- */
  function hijackLaunchers() {
    // The site's original floating chat button had its animation stripped (stays
    // invisible), and it sits bottom-LEFT where the accessibility menu lives.
    // So we add our OWN visible launcher on the bottom-RIGHT, clear of both.
    addLauncherButton();
    // Also let the (hidden) original FAB + the nav "צ'אט" links open the chat.
    var fab = document.querySelector('a[aria-label*="עוזר וירטואלי"]');
    if (fab) intercept(fab);
    Array.prototype.forEach.call(document.querySelectorAll('a[href="Contact.html"]'), function (a) {
      if ((a.textContent || "").trim() === "צ'אט") intercept(a);
    });
  }
  function intercept(el) {
    el.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); toggle(true); });
  }
  function addLauncherButton() {
    var b = document.createElement("button");
    b.setAttribute("aria-label", "פתח צ'אט עם העוזר החכם");
    b.className = "oymer-chat-fab";
    b.innerHTML = icon("chat");
    b.addEventListener("click", function () { toggle(!open); });
    document.body.appendChild(b);
    launcher = b;
  }

  /* ---- UI ---- */
  function buildPanel() {
    panel = document.createElement("div");
    panel.className = "oymer-chat";
    panel.setAttribute("dir", "rtl");
    panel.innerHTML =
      '<div class="oymer-chat-head">' +
        '<div class="oymer-chat-title"><span class="oymer-chat-dot"></span>' + esc(AGENT_CONFIG.title) + '</div>' +
        '<button class="oymer-chat-x" aria-label="סגור">' + icon("x") + '</button>' +
      '</div>' +
      '<div class="oymer-chat-log" role="log" aria-live="polite"></div>' +
      '<div class="oymer-chat-suggest"></div>' +
      '<form class="oymer-chat-input">' +
        '<textarea rows="1" placeholder="כתבו הודעה..." aria-label="הודעה"></textarea>' +
        '<button type="submit" class="oymer-chat-send" aria-label="שליחה">' + icon("send") + '</button>' +
      '</form>';
    document.body.appendChild(panel);

    log = panel.querySelector(".oymer-chat-log");
    input = panel.querySelector("textarea");
    sendBtn = panel.querySelector(".oymer-chat-send");
    panel.querySelector(".oymer-chat-x").addEventListener("click", function () { toggle(false); });
    panel.querySelector(".oymer-chat-input").addEventListener("submit", function (e) { e.preventDefault(); send(input.value); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input.value); }
    });
    input.addEventListener("input", function () { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 120) + "px"; });
  }

  function renderSuggestions() {
    var box = panel.querySelector(".oymer-chat-suggest");
    box.innerHTML = "";
    if (messages.length) return; // only show at the start
    AGENT_CONFIG.suggestions.forEach(function (s) {
      var b = document.createElement("button");
      b.className = "oymer-sug"; b.textContent = s;
      b.addEventListener("click", function () { send(s); });
      box.appendChild(b);
    });
  }

  function toggle(o) {
    open = o;
    panel.classList.toggle("is-open", o);
    if (launcher && launcher.classList && launcher.classList.contains("oymer-chat-fab"))
      launcher.style.display = o ? "none" : "flex";
    if (o) {
      if (!greeted) { greeted = true; addBubble("assistant", AGENT_CONFIG.greeting); renderSuggestions(); }
      setTimeout(function () { input.focus(); }, 120);
    }
  }

  function addBubble(role, text) {
    var b = document.createElement("div");
    b.className = "oymer-b oymer-b-" + role;
    b.innerHTML = linkify(esc(text));
    log.appendChild(b);
    log.scrollTop = log.scrollHeight;
    return b;
  }

  function typing(on) {
    var t = log.querySelector(".oymer-typing");
    if (on && !t) {
      t = document.createElement("div");
      t.className = "oymer-b oymer-b-assistant oymer-typing";
      t.innerHTML = '<span></span><span></span><span></span>';
      log.appendChild(t); log.scrollTop = log.scrollHeight;
    } else if (!on && t) { t.remove(); }
  }

  /* ---- send ---- */
  function send(text) {
    text = (text || "").trim();
    if (!text || busy) return;
    input.value = ""; input.style.height = "auto";
    panel.querySelector(".oymer-chat-suggest").innerHTML = "";
    addBubble("user", text);
    messages.push({ role: "user", content: text });
    busy = true; sendBtn.disabled = true; typing(true);

    replyFor(messages).then(function (reply) {
      typing(false);
      addBubble("assistant", reply);
      messages.push({ role: "assistant", content: reply });
    }).catch(function () {
      typing(false);
      addBubble("assistant", "מצטער, הייתה תקלה זמנית. אפשר לנסות שוב, או ליצור קשר עם עומר: 054-466-8800 · dotanomer@gmail.com");
    }).then(function () {
      busy = false; sendBtn.disabled = false; input.focus();
    });
  }

  function replyFor(history) {
    if (AGENT_CONFIG.endpoint) {
      return fetch(AGENT_CONFIG.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history })
      }).then(function (r) { return r.json(); }).then(function (d) {
        if (d && d.reply) return d.reply;
        throw new Error("no reply");
      });
    }
    // PREVIEW mode (no endpoint yet): canned keyword answers so the UX can be reviewed.
    return new Promise(function (res) {
      setTimeout(function () { res(mockReply(history[history.length - 1].content)); }, 650);
    });
  }

  function mockReply(q) {
    q = q || "";
    var has = function (arr) { return arr.some(function (w) { return q.indexOf(w) !== -1; }); };
    if (has(["מחיר", "עלות", "כמה", "מחירון", "תקציב"]))
      return "המחיר תלוי בהיקף ובאופי הפרויקט, ולכן עדיף לתת הצעה אישית מדויקת. אשמח לחבר אתכם לעומר — אפשר בטלפון/וואטסאפ 054-466-8800, במייל dotanomer@gmail.com, או להשאיר פרטים בעמוד \"צור קשר\". (זו הדגמה — הבוט האמיתי יענה בצורה חכמה יותר)";
    if (has(["מה זה", "מהו", "וי אר", "vr", "מציאות מדומה"]))
      return "מציאות מדומה מכניסה אתכם לתוך החלל המתוכנן בקנה מידה 1:1 — כאילו אתם כבר שם, עוד לפני הבנייה. כך קל לזהות בעיות מוקדם, ליישר קו בין כל בעלי העניין, ולהחליט בביטחון. (הדגמה)";
    if (has(["שירות", "מציע", "שירותים", "מה אתם עושים"]))
      return "אנחנו מציעים: הטמעת VR במשרדים, סיורי VR מודרכים, סיורים מוכנים מראש, ו-VR למבנים קיימים — וגם כלים תכנוניים כמו סיור רב-משתתפים בזמן אמת. על איזה מהם תרצו לשמוע? (הדגמה)";
    if (has(["מוצר", "מוצרים", "תוכנה", "אפליקציה", "decisionmaker", "bim"]))
      return "חבילת oYmer כוללת: DecisionMaker (פגישת אישור 1:1 ב-VR), VR Tours (עורך סיורים), BIM Viewer (צפייה במודל), ו-3D Lab. במה תרצו להתמקד? (הדגמה)";
    if (has(["עומר", "ליצור קשר", "לדבר", "טלפון", "צור קשר", "פגישה"]))
      return "בשמחה! אפשר להתקשר או לכתוב לעומר בוואטסאפ: 054-466-8800, במייל dotanomer@gmail.com, או להשאיר פרטים בעמוד \"צור קשר\" ועומר יחזור אליכם. (הדגמה)";
    if (has(["חומרה", "קסדה", "quest", "משקפי", "ציוד"]))
      return "צריך משקפי Meta Quest 3 עם רצועת ראש נוחה וחשבון Meta. אין צורך בידע מוקדם — יש הדרכה פשוטה. (הדגמה)";
    return "שאלה טובה! זו גרסת הדגמה עם תשובות מוכנות, כדי שתראו את המראה והזרימה. לאחר החיבור ל-Claude הבוט יענה על כל שאלה בצורה חכמה ומדויקת. בינתיים — תמיד אפשר לדבר עם עומר: 054-466-8800.";
  }

  /* ---- helpers ---- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function linkify(s) {
    return s
      .replace(/(\b0\d{2}-?\d{3}-?\d{4}\b)/g, '<a href="tel:0544668800">$1</a>')
      .replace(/([\w.+-]+@[\w-]+\.[\w.-]+)/g, '<a href="mailto:$1">$1</a>')
      .replace(/"צור קשר"/g, '<a href="Contact.html">"צור קשר"</a>')
      .replace(/\n/g, "<br>");
  }
  function icon(n) {
    if (n === "x") return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';
    if (n === "send") return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 21.7a.5.5 0 0 0 .94-.02l6.5-19a.5.5 0 0 0-.64-.63l-19 6.5a.5.5 0 0 0-.02.94l7.93 3.18a2 2 0 0 1 1.11 1.11z"/><path d="m21.85 2.15-10.94 10.94"/></svg>';
    return '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>';
  }

  function injectStyle() {
    var css =
    '.oymer-chat-fab{position:fixed;bottom:24px;right:24px;left:auto;z-index:99997;width:60px;height:60px;border:0;border-radius:50%;background:' + SKY + ';color:#fff;box-shadow:0 10px 30px rgba(2,132,199,.4);cursor:pointer;display:flex;align-items:center;justify-content:center}' +
    '.oymer-chat{position:fixed;bottom:24px;right:24px;left:auto;z-index:100000;width:380px;max-width:calc(100vw - 32px);height:560px;max-height:calc(100vh - 48px);background:#fff;border-radius:20px;box-shadow:0 24px 60px rgba(15,23,42,.28);display:flex;flex-direction:column;overflow:hidden;opacity:0;transform:translateY(16px) scale(.98);pointer-events:none;transition:opacity .22s ease,transform .22s ease;font-family:inherit}' +
    '.oymer-chat.is-open{opacity:1;transform:none;pointer-events:auto}' +
    '.oymer-chat-head{background:linear-gradient(135deg,' + SKY + ',' + SKY_DARK + ');color:#fff;padding:16px 18px;display:flex;align-items:center;justify-content:space-between}' +
    '.oymer-chat-title{font-weight:700;font-size:15px;display:flex;align-items:center;gap:8px}' +
    '.oymer-chat-dot{width:9px;height:9px;border-radius:50%;background:#4ade80;box-shadow:0 0 0 3px rgba(74,222,128,.3)}' +
    '.oymer-chat-x{background:transparent;border:0;color:#fff;cursor:pointer;opacity:.85;padding:4px;display:flex}.oymer-chat-x:hover{opacity:1}' +
    '.oymer-chat-log{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:#f8fafc}' +
    '.oymer-b{max-width:82%;padding:10px 13px;border-radius:14px;font-size:14px;line-height:1.6;white-space:normal;word-wrap:break-word}' +
    '.oymer-b a{color:inherit;text-decoration:underline}' +
    '.oymer-b-assistant{align-self:flex-start;background:#fff;color:#1e293b;border:1px solid #e2e8f0;border-bottom-right-radius:4px}' +
    '.oymer-b-user{align-self:flex-end;background:' + SKY + ';color:#fff;border-bottom-left-radius:4px}' +
    '.oymer-b-user a{color:#fff}' +
    '.oymer-typing{display:flex;gap:4px;align-items:center}' +
    '.oymer-typing span{width:7px;height:7px;border-radius:50%;background:#94a3b8;animation:oymerBounce 1.2s infinite ease-in-out}' +
    '.oymer-typing span:nth-child(2){animation-delay:.15s}.oymer-typing span:nth-child(3){animation-delay:.3s}' +
    '@keyframes oymerBounce{0%,60%,100%{transform:translateY(0);opacity:.5}30%{transform:translateY(-5px);opacity:1}}' +
    '.oymer-chat-suggest{display:flex;flex-wrap:wrap;gap:7px;padding:0 16px 4px;background:#f8fafc}' +
    '.oymer-sug{background:#fff;border:1px solid ' + SKY + ';color:' + SKY_DARK + ';border-radius:16px;padding:7px 12px;font-size:12.5px;cursor:pointer;font-family:inherit}' +
    '.oymer-sug:hover{background:#eff6ff}' +
    '.oymer-chat-input{display:flex;align-items:flex-end;gap:8px;padding:12px 14px;border-top:1px solid #e2e8f0;background:#fff}' +
    '.oymer-chat-input textarea{flex:1;resize:none;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;font-size:14px;font-family:inherit;max-height:120px;outline:none}' +
    '.oymer-chat-input textarea:focus{border-color:' + SKY + '}' +
    '.oymer-chat-send{flex:none;width:40px;height:40px;border:0;border-radius:12px;background:' + SKY + ';color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center}' +
    '.oymer-chat-send:disabled{opacity:.5;cursor:default}' +
    '@media(max-width:480px){.oymer-chat{left:8px;right:8px;bottom:8px;width:auto;height:calc(100vh - 16px)}}';
    // keep the two floating buttons clearly apart on small screens too

    var s = document.createElement("style"); s.textContent = css; document.head.appendChild(s);
  }
})();
