// Local preview only: no dependencies, no caching, loopback binding.
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, value, i, all) => {
  if (i % 2 === 0) pairs.push([value.replace(/^--/, ''), all[i + 1]]);
  return pairs;
}, []));
const port = Number(args.port || 3103);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw Error('Invalid port');
const root = path.resolve(__dirname, '..');
const docs = path.join(root, 'docs');
const rootId = crypto.createHash('sha256').update(root.replace(/\\/g, '/').toLowerCase()).digest('hex').slice(0, 16);
const token = args.token || crypto.randomBytes(24).toString('hex');
const status = {app: 'cizentech-support-preview', rootId, port, pid: process.pid};
const mime = {'.html':'text/html; charset=utf-8', '.md':'text/plain; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.svg':'image/svg+xml', '.ico':'image/x-icon', '.pdf':'application/pdf', '.xml':'application/xml', '.txt':'text/plain; charset=utf-8'};
const server = http.createServer((req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname); }
  catch (_) { res.writeHead(400).end('Bad request'); return; }
  if (pathname === '/__preview/status' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(status));
    return;
  }
  if (pathname === '/__preview/stop' && req.method === 'POST') {
    if (req.headers['x-preview-token'] !== token) { res.writeHead(403).end('Forbidden'); return; }
    res.end('Stopping');
    server.close(() => process.exit(0));
    server.closeIdleConnections();
    return;
  }
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405).end('Method not allowed'); return; }
  const target = path.resolve(docs, '.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname));
  if (!target.startsWith(docs + path.sep)) { res.writeHead(403).end('Forbidden'); return; }
  fs.readFile(target, (error, data) => {
    if (error) { res.writeHead(error.code === 'ENOENT' || error.code === 'EISDIR' ? 404 : 500).end('Not found'); return; }
    res.setHeader('Content-Type', mime[path.extname(target).toLowerCase()] || 'application/octet-stream');
    res.end(req.method === 'HEAD' ? undefined : data);
  });
});
server.on('error', error => { console.error(error.message); process.exit(1); });
server.listen(port, '127.0.0.1', () => {
  if (args.state) fs.writeFileSync(args.state, JSON.stringify({...status, token}));
  console.log(`Support preview: http://127.0.0.1:${port}/`);
});
process.on('exit', () => {
  if (!args.state) return;
  try {
    if (JSON.parse(fs.readFileSync(args.state, 'utf8')).pid === process.pid) fs.unlinkSync(args.state);
  } catch (_) {}
});
