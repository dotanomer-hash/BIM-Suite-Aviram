/*
 * oYmer VR — website AI agent (Cloudflare Worker)
 * -------------------------------------------------
 * Holds the Anthropic API key SECRETLY (never sent to the browser) and proxies
 * chat messages from omerdotan.com to Claude. Deploy on Cloudflare Workers (free).
 *
 * Setup (see README.md for the click-by-click):
 *   1. Create the Worker, paste this file.
 *   2. Add a secret named  ANTHROPIC_API_KEY  (your key from console.anthropic.com).
 *   3. Deploy. Put the Worker URL into agent.js -> AGENT_CONFIG.endpoint.
 *
 * Safety built in: only omerdotan.com may call it, history is capped, each message
 * is length-limited, replies are capped, and the model is Haiku (cheap). Combined
 * with the spending cap you set in the Anthropic console, cost can never surprise you.
 */

const MODEL = "claude-haiku-4-5-20251001";     // cheap + fast; good for a website agent
const MAX_TOKENS = 512;                          // cap reply length (cost control)
const MAX_HISTORY = 12;                          // cap conversation turns sent upstream
const MAX_CHARS = 2000;                           // cap per-message length

// --- Wrong-keyboard-layout decode (Israeli standard QWERTY <-> Hebrew) ---
// The mapping is a DETERMINISTIC per-key table. LLMs are unreliable at running it,
// so we compute the exact decode here in code and hand it to the model as a hint.
const EN2HE = {
  q: "/", w: "'", e: "ק", r: "ר", t: "א", y: "ט", u: "ו", i: "ן", o: "ם", p: "פ",
  a: "ש", s: "ד", d: "ג", f: "כ", g: "ע", h: "י", j: "ח", k: "ל", l: "ך", ";": "ף",
  z: "ז", x: "ס", c: "ב", v: "ה", b: "נ", n: "מ", m: "צ", ",": "ת", ".": "ץ", "/": ".",
};
const HE2EN = Object.fromEntries(Object.entries(EN2HE).map(([k, v]) => [v, k]));
const remapEnToHe = (s) => s.replace(/[a-z;,.\/]/gi, (c) => EN2HE[c.toLowerCase()] || c);
const remapHeToEn = (s) => s.replace(/[֐-׿]/g, (c) => HE2EN[c] || c);

// The editable knowledge file lives on the site. Edit THAT file to update the bot's
// facts next year — no code change, no redeploy. Cached ~1h so it costs almost nothing.
const KNOWLEDGE_URL = "https://omerdotan.com/agent-knowledge.md";
const KNOWLEDGE_TTL = 3600; // seconds

const ALLOWED_ORIGINS = [
  "https://omerdotan.com",
  "https://www.omerdotan.com",
  "http://omerdotan.com",
  "http://www.omerdotan.com",
  "https://dotanomer-hash.github.io", // GitHub Pages origin (fallback during transitions)
];

/* PERSONA + RULES — rarely change, so they stay in code.
   The FACTS come from KNOWLEDGE_URL and are appended at runtime. */
const PERSONA = `את/ה "העוזר/ת החכם/ה של עומר דותן" — עוזר/ת וירטואלי/ת באתר של עומר דותן, שמביא טכנולוגיית מציאות מדומה (VR) לעולם האדריכלות. (oYmer הוא שם חבילת המוצרים של עומר: oYmer DecisionMaker, oYmer VR Tours וכו'.)

## התפקיד שלך
לענות בעברית, בחום ובמקצועיות, על שאלות של אדריכלים, יזמים, קבלנים ולקוחות פוטנציאליים — ולעזור למתעניינים ליצור קשר עם עומר.

## איך לענות
- ענה תמיד בעברית, אלא אם פנו אליך בשפה אחרת (אז ענה באותה שפה).
- ענה ישירות, בביטחון ובחום — בדרך כלל 2 עד 5 משפטים. בלי הצפה.
- **ענה על השאלה שנשאלה.** אם השאלה ברורה — פשוט ענה עליה על סמך הידע. לעולם אל תאמר שההודעה "מעורבלת", "לא ברורה" או "הגיעה מוזר", ואל תבקש מהמשתמש לנסח מחדש שאלה שכבר ברורה.
- בסס את התשובות על "בסיס הידע" שלמטה ועל האתר. אל תמציא עובדות, מחירים, לוחות זמנים או הבטחות שאינם שם. אם פרט מסוים חסר — ענה את מה שכן ידוע, והצע ליצור קשר עם עומר להשלמה.
- כשמורגש עניין אמיתי — הצע בעדינות להשאיר שם וטלפון דרך טופס "צור קשר", או להתקשר/לכתוב לעומר ישירות.
- הישאר בתחום: VR לאדריכלות והשירותים של עומר דותן. לשאלות שאינן קשורות, השב בנימוס שאתה כאן בשביל נושאי ה-VR והאדריכלות.

## מחירים — חשוב
לעולם אל תנקוב במחיר, טווח מחירים או הצעת מחיר. המחיר תלוי בהיקף ובאופי הפרויקט. כשנשאלת על מחיר — הסבר זאת בקצרה, והצע ליצור קשר עם עומר לקבלת הצעה אישית: זו בדיוק הדרך לקבל מענה מדויק.

## פריסת מקלדת שגויה
המערכת מתקנת אוטומטית (בקוד) הודעות שהוקלדו בטעות בפריסת מקלדת שגויה, כך שתקבל טקסט עברי נקי. אם תצורף "הערה" שמנחה אותך לפתוח ב-"(הבנתי שהתכוונת ל: ...)" — עשה זאת, וענה על ההודעה המתוקנת כרגיל וכפי שהיא, גם אם השאלה מפתיעה (למשל "בן כמה עומר?" = שאלה לגיטימית על הגיל/הניסיון של עומר).

## פרטי קשר
- טלפון / וואטסאפ: 054-466-8800
- אימייל: dotanomer@gmail.com
- דרך האתר: עמוד "צור קשר".`;

/* Fallback facts, used only if the knowledge file can't be fetched. */
const KNOWLEDGE_FALLBACK = `## בסיס ידע (גיבוי)
oYmer VR מביא מציאות מדומה לאדריכלות: חוויית החלל המתוכנן בקנה מידה 1:1 לפני הבנייה, לזיהוי בעיות מוקדם, יישור קו בין צוותים ולקוחות, וקיצור זמני החלטה.
שירותים: הטמעת VR במשרדים · סיורי VR מודרכים · סיורי VR מוכנים · VR למבנים קיימים · תכנון אדריכלי ב-VR · סיור רב-משתתפים בזמן אמת.
מוצרים: oYmer DecisionMaker · oYmer VR Tours · oYmer BIM Viewer · oYmer 3D Lab.
חומרה ללקוח: Meta Quest 3 + רצועת ראש + חשבון Meta.`;

// Fetch the knowledge file with Cloudflare edge caching (so it's ~free and fast).
async function loadKnowledge() {
  try {
    const resp = await fetch(KNOWLEDGE_URL, {
      // Cache only successful fetches; never cache a 404/5xx (avoids serving the
      // fallback for an hour if the file was briefly missing during a deploy).
      cf: { cacheTtlByStatus: { "200-299": KNOWLEDGE_TTL, "300-599": 0 }, cacheEverything: true },
    });
    if (resp.ok) {
      const text = (await resp.text()).trim();
      if (text) return text;
    }
  } catch (_) { /* fall through */ }
  return KNOWLEDGE_FALLBACK;
}

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

function jsonResponse(obj, status, origin) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });
}

// One Claude call -> the text reply (throws on error).
async function callClaude(env, { system, messages, max_tokens }) {
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model: MODEL, max_tokens, system, messages }),
  });
  if (!resp.ok) throw new Error("upstream_" + resp.status);
  const data = await resp.json();
  return (data.content || []).filter((c) => c.type === "text").map((c) => c.text).join("\n").trim();
}

// Detect Hebrew-typed-on-an-English-layout and, if a tiny classifier confirms the
// decoded Hebrew is the real message, return it. Only runs on Latin-heavy input,
// so normal Hebrew messages make no extra call. The model then sees clean Hebrew
// and can't hallucinate a different question.
async function resolveLayout(text, env) {
  const latin = (text.match(/[a-z]/gi) || []).length;
  const hebrew = (text.match(/[֐-׿]/g) || []).length;
  if (latin < 2 || latin < hebrew) return { text, corrected: false };
  const decoded = remapEnToHe(text);
  if (decoded === text) return { text, corrected: false };
  let verdict = "";
  try {
    verdict = await callClaude(env, {
      max_tokens: 6,
      system:
        "הכרעה בלבד. מוצגים 'מקורי' ו'פענוח' של הקלדה אפשרית בפריסת מקלדת שגויה. " +
        "אם המקורי הוא טקסט אמיתי וקריא (למשל אנגלית) — השב NO. " +
        "אם הפענוח הוא הטקסט האמיתי והקריא (עברית) — השב YES. השב מילה אחת בלבד: YES או NO.",
      messages: [{ role: "user", content: "מקורי: " + text + "\nפענוח: " + decoded }],
    });
  } catch (_) {
    return { text, corrected: false };
  }
  return /YES/i.test(verdict) ? { text: decoded, corrected: true } : { text, corrected: false };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(origin) });
    }
    if (request.method !== "POST") {
      return jsonResponse({ error: "method_not_allowed" }, 405, origin);
    }
    // Block other websites from spending your key.
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return jsonResponse({ error: "forbidden_origin" }, 403, origin);
    }
    if (!env.ANTHROPIC_API_KEY) {
      return jsonResponse({ error: "server_not_configured" }, 500, origin);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "bad_json" }, 400, origin);
    }

    let messages = Array.isArray(body.messages) ? body.messages : [];
    messages = messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-MAX_HISTORY)
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return jsonResponse({ error: "no_user_message" }, 400, origin);
    }

    const knowledge = await loadKnowledge();

    // Fix wrong-keyboard-layout input IN CODE (deterministic), so the model only
    // ever sees clean Hebrew and can't hallucinate a different question.
    const layout = await resolveLayout(messages[messages.length - 1].content, env);
    let kbNote = "";
    if (layout.corrected) {
      messages[messages.length - 1] = { role: "user", content: layout.text };
      kbNote =
        '\n\n---\n# הערה\nהודעת המשתמש תוקנה אוטומטית מטעות פריסת מקלדת. ' +
        'פתח את תשובתך ב-"(הבנתי שהתכוונת ל: \\"' + layout.text + '\\") —" ואז ענה על ההודעה כרגיל.';
    }

    const system = PERSONA + "\n\n---\n# בסיס הידע\n" + knowledge + kbNote;

    let reply;
    try {
      reply = await callClaude(env, { system, max_tokens: MAX_TOKENS, messages });
    } catch (e) {
      return jsonResponse({ error: "upstream_error", detail: String(e.message).slice(0, 200) }, 502, origin);
    }

    return jsonResponse({ reply: reply || "מצטער, לא הצלחתי לנסח תשובה. אפשר לנסות שוב או ליצור קשר עם עומר." }, 200, origin);
  },
};
