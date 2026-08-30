/**
 * Static file server for the prerendered build.
 *
 * The app builds with `outputMode: 'static'` (see angular.json) — every route is
 * prerendered to HTML at build time, so there is no Angular server at runtime.
 * A CDN host serves `dist/` directly and needs nothing else; Railway runs a
 * container, so it needs a process listening on $PORT. That is all this is.
 *
 * Deliberately dependency-free: adding an HTTP framework to hand back files that
 * are already on disk would be more to install, audit and upgrade than to write.
 */
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';
import { createGzip } from 'node:zlib';

const ROOT = resolve(import.meta.dirname, 'dist/bwg-v1/browser');
const PORT = Number(process.env.PORT) || 8080;

/** Shell Angular emits for the `**` route; boots client-side and renders NotFoundPage. */
const NOT_FOUND = join(ROOT, 'index.csr.html');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

const COMPRESSIBLE = /^(?:text\/|application\/(?:json|manifest\+json)|image\/svg)/;

/** `main-AQ4VH6GX.js`, `styles-MAEQ7CS4.css` — content-hashed by outputHashing, safe to pin forever. */
const HASHED = /-[A-Za-z0-9]{8,}\.(?:js|css)$/;

/**
 * Map a URL path to a file on disk, mirroring how the prerenderer laid it out:
 * `/leadership` was written as `leadership/index.html`. Returns null for anything
 * outside ROOT or not on disk, so the caller can fall back to the 404 shell.
 */
async function locate(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null; // malformed percent-encoding
  }

  const target = resolve(ROOT, `.${decoded}`);
  if (target !== ROOT && !target.startsWith(ROOT + sep)) return null;

  for (const candidate of [target, `${target}.html`, join(target, 'index.html')]) {
    try {
      const stats = await stat(candidate);
      if (stats.isFile()) return { path: candidate, stats };
    } catch {
      // try the next shape
    }
  }
  return null;
}

const send = (req, res, file, stats, status) => {
  const type = MIME[extname(file).toLowerCase()] ?? 'application/octet-stream';
  const etag = `W/"${stats.size.toString(16)}-${stats.mtimeMs.toString(16)}"`;

  res.setHeader('Content-Type', type);
  res.setHeader('ETag', etag);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader(
    'Cache-Control',
    HASHED.test(file) ? 'public, max-age=31536000, immutable' : 'no-cache',
  );

  if (req.headers['if-none-match'] === etag) {
    res.writeHead(304).end();
    return;
  }

  const gzip = COMPRESSIBLE.test(type) && /\bgzip\b/.test(req.headers['accept-encoding'] ?? '');

  if (gzip) {
    res.setHeader('Content-Encoding', 'gzip');
    res.setHeader('Vary', 'Accept-Encoding');
  } else {
    res.setHeader('Content-Length', stats.size);
  }

  res.writeHead(status);
  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  const body = createReadStream(file);
  body.on('error', () => res.destroy());
  if (gzip) body.pipe(createGzip()).pipe(res);
  else body.pipe(res);
};

const server = createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }

  const { pathname } = new URL(req.url, 'http://localhost');

  try {
    const hit = await locate(pathname);
    if (hit) {
      send(req, res, hit.path, hit.stats, 200);
      return;
    }
    // Unknown URL: hand back the CSR shell, but tell crawlers the truth.
    send(req, res, NOT_FOUND, await stat(NOT_FOUND), 404);
  } catch (error) {
    console.error(`500 ${pathname}`, error);
    if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Serving ${ROOT} on http://0.0.0.0:${PORT}`);
});
