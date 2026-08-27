const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf'
};

const server = http.createServer((req, res) => {
  try {
    const rawUrl = req.url.split('?')[0];
    const cleanUrl = decodeURIComponent(rawUrl);
    const relativePath = cleanUrl === '/' ? 'index.html' : cleanUrl.replace(/^\/+/, '');
    const filePath = path.join(__dirname, relativePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 Not Found');
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('500 Internal Server Error');
        }
      } else {
        res.writeHead(200, { 
          'Content-Type': contentType,
          'Cache-Control': 'no-cache'
        });
        res.end(content);
      }
    });
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('400 Bad Request');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
