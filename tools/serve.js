/* Local preview server for omerdotan.com.
 *
 * Exists because `python -m http.server` ignores the HTTP Range header: video
 * seeking silently does nothing on it, so the tutorial's chapter buttons looked
 * broken locally while working fine on GitHub Pages. This serves 206 Partial
 * Content like the real host does.
 *
 *   node tools/serve.js [port]        (default 8099)
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORT = parseInt(process.argv[2], 10) || 8099;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mp3': 'audio/mpeg',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.glb': 'model/gltf-binary', '.woff2': 'font/woff2'
};

http.createServer(function (req, res) {
  let rel;
  try {
    rel = decodeURIComponent(req.url.split('?')[0]);
  } catch (e) {
    res.writeHead(400).end('bad url');
    return;
  }
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT)) { res.writeHead(403).end('forbidden'); return; }

  fs.stat(file, function (err, st) {
    if (err || !st.isFile()) { res.writeHead(404).end('not found'); return; }
    const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
    const head = { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-store' };
    const range = req.headers.range;
    const m = range && /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    if (m) {
      const start = m[1] ? parseInt(m[1], 10) : 0;
      const end = m[2] ? Math.min(parseInt(m[2], 10), st.size - 1) : st.size - 1;
      if (start > end || start >= st.size) {
        res.writeHead(416, { 'Content-Range': 'bytes */' + st.size }).end();
        return;
      }
      head['Content-Range'] = 'bytes ' + start + '-' + end + '/' + st.size;
      head['Content-Length'] = end - start + 1;
      res.writeHead(206, head);
      if (req.method === 'HEAD') { res.end(); return; }
      fs.createReadStream(file, { start: start, end: end }).pipe(res);
    } else {
      head['Content-Length'] = st.size;
      res.writeHead(200, head);
      if (req.method === 'HEAD') { res.end(); return; }
      fs.createReadStream(file).pipe(res);
    }
  });
}).listen(PORT, function () {
  console.log('omerdotan-site on http://localhost:' + PORT + '  (Range supported)');
});
