# oYmer VR — website AI agent · deploy guide

The site chat widget (`agent.js`) talks to a tiny **Cloudflare Worker** (`worker.js`) that holds your
Anthropic API key **secretly** and forwards messages to Claude. The page never sees the key.

Right now the widget runs in **PREVIEW mode** (canned answers) because `AGENT_CONFIG.endpoint` in
`agent.js` is empty. Follow the steps below to make it a real Claude agent.

---

## What it costs
- **Cloudflare Worker:** free (100k requests/day).
- **Claude API:** pay-per-use, **not** your Max subscription. Prepay a small amount (e.g. $5) once and set a
  hard **spending cap**. A quiet month = $0. Model is **Haiku** (cheap); a typical chat costs a fraction of a cent.

---

## Step 1 — Anthropic API key (~5 min)
1. Go to **console.anthropic.com** → sign in.
2. **Plans & Billing** → add a payment method → buy **$5** credit.
3. **Limits** → set a monthly **spending cap** (e.g. $5). This is the hard stop; it can never exceed it.
4. **API keys** → **Create Key** → name it `oymer-site` → **copy it** (starts with `sk-ant-...`). You won't see it again.

## Step 2 — Create the Cloudflare Worker (~5 min)
1. Go to **dash.cloudflare.com** → sign up / sign in (free).
2. Left menu → **Workers & Pages** → **Create** → **Create Worker**.
3. Name it `oymer-agent` → **Deploy** (deploys a hello-world placeholder).
4. **Edit code** → delete everything → paste the entire contents of **`worker.js`** → **Deploy**.

## Step 3 — Add the secret key
1. In the Worker → **Settings** → **Variables and Secrets** (or "Variables").
2. **Add** a **Secret** (encrypted, not plaintext):
   - Name: `ANTHROPIC_API_KEY`
   - Value: the `sk-ant-...` key from Step 1.
3. **Save / Deploy**.

## Step 4 — Wire the widget to the Worker
1. Copy your Worker URL — it looks like `https://oymer-agent.<your-subdomain>.workers.dev`.
2. In **`agent.js`**, set:
   ```js
   endpoint: "https://oymer-agent.<your-subdomain>.workers.dev",
   ```
3. Publish the site (push to GitHub). Bump the cache-buster: `agent.js?v=1` → `agent.js?v=2` on all pages.

Done — the chat button now runs a real Claude agent grounded in your content.

---

## Updating the bot's knowledge (no code, no redeploy)
The agent's **facts** live in **`/agent-knowledge.md`** on the site. To change what it knows (new service,
new product, updated story) — **edit that one file and publish.** The Worker re-reads it (cached ~1 hour).
The **persona + rules** (tone, "never quote prices") live in `worker.js` and rarely change.

## Guardrails already built in
- Only **omerdotan.com** may call the Worker (origin allowlist) — other sites can't spend your key.
- History capped (12 turns), each message capped (2000 chars), replies capped (512 tokens).
- Model pinned to **Haiku**. All of this + your spending cap keeps cost tiny and predictable.

### Optional hardening (later, if it ever gets abused)
- Cloudflare dashboard → **Security → WAF → Rate limiting rules** (free tier) to cap requests per IP.
- Add **Cloudflare Turnstile** (free CAPTCHA) if bots ever hammer it.

## Model / behavior knobs (top of `worker.js`)
`MODEL`, `MAX_TOKENS`, `MAX_HISTORY`, `MAX_CHARS`, `KNOWLEDGE_URL`, `KNOWLEDGE_TTL`, `ALLOWED_ORIGINS`.
