const http = require('node:http');
const os = require('node:os');
const { detectLine } = require('./index');

const PORT = Number(process.env.PORT) || 3000;

const page = (ua, r) => `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>LINE UA check</title>
<style>body{font-family:system-ui;margin:16px;line-height:1.5}pre{white-space:pre-wrap;word-break:break-all;background:#f3f3f3;padding:12px;border-radius:8px}
.big{font-size:28px;font-weight:700;color:${r.isLine ? '#06c755' : '#c00'}}</style></head>
<body><div class="big">${r.isLine ? 'อยู่ใน LINE' : 'ไม่ได้อยู่ใน LINE'} (${r.os})</div>
<h3>server (req header)</h3><pre>${JSON.stringify(r, null, 2)}</pre>
<h3>client (navigator.userAgent)</h3><pre id="c"></pre>
<h3>user-agent</h3><pre>${ua.replace(/</g, '&lt;')}</pre>
<script>fetch('/api?ua='+encodeURIComponent(navigator.userAgent)).then(r=>r.json()).then(j=>{document.getElementById('c').textContent=JSON.stringify(j,null,2)})</script>
</body></html>`;

http
  .createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    const headerUa = req.headers['user-agent'] || '';
    if (url.pathname === '/api') {
      res.writeHead(200, { 'content-type': 'application/json' });
      return res.end(JSON.stringify(detectLine(url.searchParams.get('ua') ?? headerUa)));
    }
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(page(headerUa, detectLine(headerUa)));
  })
  .listen(PORT, '0.0.0.0', () => {
    const lan = Object.values(os.networkInterfaces())
      .flat()
      .filter((i) => i && i.family === 'IPv4' && !i.internal)
      .map((i) => `http://${i.address}:${PORT}`);
    console.log(`local: http://localhost:${PORT}`);
    lan.forEach((u) => console.log(`lan:   ${u}`));
  });
