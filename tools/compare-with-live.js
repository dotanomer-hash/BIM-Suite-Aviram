#!/usr/bin/env node
/* compare-with-live - diff the RENDERED bim-suite site against the live site.
 *
 * Why this exists: on 2026-08-08 a comparison that checked "does the page exist and
 * do its assets return 200" reported 17 of 17 pages clean, while every ordinary page
 * on the branch was still rendering the OLD products menu. The menu is built by
 * JavaScript at run time - it is not in the HTML file at all - so no file diff and no
 * status-code sweep could ever have caught it. This tool therefore compares what a
 * VISITOR SEES: it runs the page in a real browser, lets the scripts build the DOM,
 * and then diffs a fingerprint of the result.
 *
 * Zero install on purpose - it has to work on go-live day, not "after npm i".
 * It drives the Chrome already on the machine over the DevTools Protocol, using
 * Node's built-in fetch and WebSocket (Node 22+). No puppeteer, no download.
 *
 *   node tools/compare-with-live.js
 *   node tools/compare-with-live.js --a http://localhost:8099 --b https://omerdotan.com
 *   node tools/compare-with-live.js --pages FAQ.html,index.html
 *   node tools/compare-with-live.js --out report.md
 *
 * READ THE OUTPUT AS A REVIEW LIST, NOT A VERDICT. The branch is SUPPOSED to differ
 * from live - that is the point of the branch. Zero differences is not the goal.
 * The goal is that every difference printed is one you can name as intended.
 */
'use strict';

const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

// ---------------------------------------------------------------- arguments
const argv = process.argv.slice(2);
function opt(name, dflt) {
  const i = argv.indexOf('--' + name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : dflt;
}
const A_BASE = opt('a', 'http://localhost:8099').replace(/\/$/, '');
const B_BASE = opt('b', 'https://omerdotan.com').replace(/\/$/, '');
const ONLY = opt('pages', '').split(',').map(s => s.trim()).filter(Boolean);
const OUT = opt('out', '');
const PORT = parseInt(opt('port', '9333'), 10);

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
].find(p => { try { return fs.existsSync(p); } catch (e) { return false; } });

if (!CHROME) {
  console.error('Chrome not found. Pass --chrome <path> or install Chrome.');
  process.exit(1);
}

// ------------------------------------------------------- the browser, headless
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cmp-chrome-'));
const chrome = spawn(CHROME, [
  '--headless=new',
  '--remote-debugging-port=' + PORT,
  '--user-data-dir=' + profile,
  '--no-first-run', '--no-default-browser-check',
  '--disable-extensions', '--disable-background-networking',
  '--hide-scrollbars', '--mute-audio',
  '--window-size=1440,900',
  'about:blank',
], { stdio: 'ignore' });

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function waitForChrome() {
  for (let i = 0; i < 100; i++) {
    try {
      const r = await fetch('http://127.0.0.1:' + PORT + '/json/version');
      if (r.ok) return;
    } catch (e) { /* not up yet */ }
    await sleep(200);
  }
  throw new Error('Chrome did not open a debugging port');
}

/* One tab, reused for every page. Each render is: open the URL, wait for load,
   then wait a beat for the scripts that build menus and reveal content. */
let ws = null, msgId = 0, pending = new Map();

async function connect() {
  const r = await fetch('http://127.0.0.1:' + PORT + '/json/new?about:blank', { method: 'PUT' });
  const target = await r.json();
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  ws.onmessage = ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  };
  await send('Page.enable');
  await send('Runtime.enable');
}

function send(method, params) {
  const id = ++msgId;
  return new Promise(res => {
    pending.set(id, res);
    ws.send(JSON.stringify({ id, method, params: params || {} }));
  });
}

/* ---------------------------------------------------------------------------
 * THE FINGERPRINT - what a visitor actually sees.
 * Everything here is read AFTER the page's own JavaScript has run, which is the
 * whole point: the products dropdown, the FAQ answers and the reveal animations
 * do not exist in the HTML source.
 * Hrefs and media are reduced to their last path segment so that a page living
 * under a different folder (localhost vs a /repo/ subpath) does not report as a
 * difference - only a genuinely different target does.
 * ------------------------------------------------------------------------- */
const FINGERPRINT = `(() => {
  const leaf = u => {
    if (!u) return '';
    try { u = new URL(u, location.href).pathname; } catch (e) {}
    return decodeURIComponent(u.split('/').filter(Boolean).pop() || '/');
  };
  const txt = el => (el.textContent || '').replace(/\\s+/g, ' ').trim();

  // every menu item, including the ones JS builds, with where it points
  const nav = [...document.querySelectorAll('header a, header button, nav a, nav button, .oymer-submenu a')]
    .map(el => {
      const t = txt(el).slice(0, 40);
      const h = el.tagName === 'A' ? leaf(el.getAttribute('href')) : '';
      return t ? (h ? t + ' -> ' + h : t) : '';
    })
    .filter(Boolean);

  const headings = [...document.querySelectorAll('main h1, main h2, main h3, h1, h2')]
    .map(el => el.tagName + ': ' + txt(el).slice(0, 70)).filter(s => s.length > 4);

  const media = [...document.querySelectorAll('img, video, iframe, source')]
    .map(el => leaf(el.getAttribute('src') || el.getAttribute('data-lazy-src')))
    .filter(Boolean);

  const cta = [...document.querySelectorAll('main a, main button')]
    .map(el => txt(el).slice(0, 34)).filter(s => s.length > 1);

  return {
    title: (document.title || '').trim(),
    nav, headings, media, cta,
    links: [...document.querySelectorAll('a[href]')].map(a => leaf(a.getAttribute('href')))
             .filter(h => h.endsWith('.html'))
  };
})()`;

async function render(url) {
  await send('Page.navigate', { url });
  // Page.loadEventFired without an event listener is awkward over raw CDP, so poll
  for (let i = 0; i < 120; i++) {
    const r = await send('Runtime.evaluate', { expression: 'document.readyState', returnByValue: true });
    if (r.result && r.result.result && r.result.result.value === 'complete') break;
    await sleep(150);
  }
  await sleep(900);                      // let the menu builders and reveals finish
  const r = await send('Runtime.evaluate', { expression: FINGERPRINT, returnByValue: true, awaitPromise: false });
  if (!r.result || !r.result.result || r.result.result.subtype === 'error') return null;
  return r.result.result.value;
}

// --------------------------------------------------------------- page list
async function discover(base) {
  const seen = new Set(['index.html']);
  const out = new Set();
  const queue = ['index.html'];
  while (queue.length) {
    const p = queue.shift();
    out.add(p);
    let html = '';
    try {
      const r = await fetch(base + '/' + p);
      if (!r.ok) continue;
      html = await r.text();
    } catch (e) { continue; }
    for (const m of html.matchAll(/href="([^"]+\.html)"/g)) {
      const u = m[1];
      if (/^(https?:)?\/\//.test(u)) continue;
      const leaf = u.split('/').pop().split('?')[0];
      if (!seen.has(leaf)) { seen.add(leaf); queue.push(leaf); }
    }
  }
  return out;
}

// ------------------------------------------------------------------ diffing
function diffList(a, b) {
  const ca = new Map(), cb = new Map();
  for (const x of a) ca.set(x, (ca.get(x) || 0) + 1);
  for (const x of b) cb.set(x, (cb.get(x) || 0) + 1);
  const onlyA = [], onlyB = [];
  for (const [k, n] of ca) { const d = n - (cb.get(k) || 0); for (let i = 0; i < d; i++) onlyA.push(k); }
  for (const [k, n] of cb) { const d = n - (ca.get(k) || 0); for (let i = 0; i < d; i++) onlyB.push(k); }
  return { onlyA, onlyB };
}

const lines = [];
const say = s => { console.log(s); lines.push(s); };

(async () => {
  await waitForChrome();
  await connect();

  let pages;
  if (ONLY.length) pages = ONLY;
  else {
    const fromB = await discover(B_BASE);
    const fromA = await discover(A_BASE);
    pages = [...new Set([...fromB, ...fromA])].sort();
  }

  say('# Rendered comparison');
  say('');
  say('- A (branch) : ' + A_BASE);
  say('- B (live)   : ' + B_BASE);
  say('- pages      : ' + pages.length);
  say('');
  say('Read this as a review list. The branch is SUPPOSED to differ from live -');
  say('every difference below must be one you can name as intended.');
  say('');

  const FIELDS = ['title', 'nav', 'headings', 'media', 'cta'];
  let identical = 0, differing = 0, onlyOnA = [], onlyOnB = [], failed = [];

  for (const p of pages) {
    const a = await render(A_BASE + '/' + p);
    const b = await render(B_BASE + '/' + p);
    if (!a && !b) { failed.push(p); continue; }
    if (!a) { onlyOnB.push(p); continue; }
    if (!b) { onlyOnA.push(p); continue; }

    const report = [];
    if (a.title !== b.title) report.push('  title\n    A: ' + a.title + '\n    B: ' + b.title);
    for (const f of FIELDS) {
      if (f === 'title') continue;
      const { onlyA, onlyB } = diffList(a[f], b[f]);
      if (!onlyA.length && !onlyB.length) continue;
      const body = [];
      onlyA.slice(0, 12).forEach(x => body.push('    + A only: ' + x));
      onlyB.slice(0, 12).forEach(x => body.push('    - B only: ' + x));
      const extra = (onlyA.length > 12 ? onlyA.length - 12 : 0) + (onlyB.length > 12 ? onlyB.length - 12 : 0);
      if (extra) body.push('    ... and ' + extra + ' more');
      report.push('  ' + f + ' (' + onlyA.length + ' only on A, ' + onlyB.length + ' only on B)\n' + body.join('\n'));
    }

    if (!report.length) { identical++; continue; }
    differing++;
    say('## ' + p);
    say(report.join('\n'));
    say('');
  }

  say('---');
  say('');
  say('| | |');
  say('|---|---|');
  say('| identical | ' + identical + ' |');
  say('| differing | ' + differing + ' |');
  say('| only on the branch | ' + (onlyOnA.join(', ') || 'none') + ' |');
  say('| only on live | ' + (onlyOnB.join(', ') || 'none') + ' |');
  if (failed.length) say('| failed to render | ' + failed.join(', ') + ' |');

  if (OUT) { fs.writeFileSync(OUT, lines.join('\n'), 'utf8'); console.log('\nwritten: ' + OUT); }

  try { ws.close(); } catch (e) {}
  chrome.kill();
  try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) {}
  process.exit(0);
})().catch(err => {
  console.error(err && err.message ? err.message : err);
  try { chrome.kill(); } catch (e) {}
  process.exit(1);
});
