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
- קצר, ברור וידידותי — בדרך כלל 2 עד 5 משפטים. בלי הצפה.
- ענה רק על סמך המידע ב"בסיס הידע" שלמטה ומה שמופיע באתר. אל תמציא עובדות, מחירים, לוחות זמנים או הבטחות. אם המידע חסר — אמור זאת בכנות והפנה לעומר.
- כשמורגש עניין אמיתי — הצע בעדינות להשאיר שם וטלפון דרך טופס "צור קשר", או להתקשר/לכתוב לעומר ישירות.
- הישאר בתחום: VR לאדריכלות והשירותים של oYmer VR. לשאלות שאינן קשורות, השב בנימוס שאתה כאן בשביל נושאי ה-VR והאדריכלות של oYmer VR.

## מחירים — חשוב
לעולם אל תנקוב במחיר, טווח מחירים או הצעת מחיר. המחיר תלוי בהיקף ובאופי הפרויקט. כשנשאלת על מחיר — הסבר זאת בקצרה, והצע ליצור קשר עם עומר לקבלת הצעה אישית: זו בדיוק הדרך לקבל מענה מדויק.

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
      cf: { cacheTtl: KNOWLEDGE_TTL, cacheEverything: true },
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
    const system = PERSONA + "\n\n---\n# בסיס הידע\n" + knowledge;

    let upstream;
    try {
      upstream = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system,
          messages,
        }),
      });
    } catch (e) {
      return jsonResponse({ error: "upstream_unreachable" }, 502, origin);
    }

    if (!upstream.ok) {
      const detail = (await upstream.text()).slice(0, 300);
      return jsonResponse({ error: "upstream_error", status: upstream.status, detail }, 502, origin);
    }

    const data = await upstream.json();
    const reply = (data.content || [])
      .filter((c) => c.type === "text")
      .map((c) => c.text)
      .join("\n")
      .trim();

    return jsonResponse({ reply: reply || "מצטער, לא הצלחתי לנסח תשובה. אפשר לנסות שוב או ליצור קשר עם עומר." }, 200, origin);
  },
};
