/*
 * build-seo.js — pre-render docsify pages into crawlable, 200-status HTML.
 *
 * Why: the site is a docsify SPA with hash routing (#/Page). Google ignores the
 * URL fragment, so subpages are never indexed as distinct URLs. GitHub Pages is a
 * static host with no server-side rewrites, so the only way to give each page a
 * real URL that returns HTTP 200 is to emit a physical .html file per page.
 *
 * This script:
 *   1. Renders every docs/<name>.md (except README and _sidebar) to docs/<name>.html
 *      with proper <title>, <meta description>, canonical, OpenGraph, and styled body.
 *   2. Injects the rendered README into index.html's #app (between SEO markers) so the
 *      homepage also serves real content/links to crawlers; docsify replaces it at runtime.
 *   3. Writes sitemap.xml and robots.txt.
 *
 * Re-run after editing any .md:  node tools/build-seo.js
 */
const fs = require('fs');
const path = require('path');
const { marked } = require('./marked.min.js');

const DOCS = path.join(__dirname, '..', 'docs');
const BASE = 'https://cizentech.github.io/support/';
const SITE = 'CIZEN TECH · Technical Support';
const EXCLUDE = new Set(['_sidebar.md', 'README.md']);

// --- helpers ---------------------------------------------------------------

const stripTags = (s) => s.replace(/<[^>]+>/g, '');
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const escAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
  .replace(/</g, '&lt;').replace(/>/g, '>');

function rewriteLinks(html) {
  // docsify route -> static page:  href="#/Page" / "#/Page?id=x" -> "Page.html"
  html = html.replace(/href="#\/([^"?#]+)(?:[?#][^"]*)?"/g, 'href="$1.html"');
  // markdown page link:  href="Page.md" / "./Page.md" -> "Page.html"
  html = html.replace(/href="\.?\/?([^":]+?)\.md(#[^"]*)?"/g, 'href="$1.html$2"');
  return html;
}

function titleOf(md, fallback) {
  const m = md.match(/^\s*#\s+(.+?)\s*$/m);
  return m ? decode(stripTags(m[1])).trim() : fallback;
}

function descOf(md) {
  // first reasonably long plain-text paragraph
  const blocks = md.split(/\n\s*\n/);
  for (const b of blocks) {
    const t = decode(stripTags(b))
      .replace(/\\([\\`*_{}\[\]()#+.!~>-])/g, '$1') // markdown escapes
      .replace(/[`*_]/g, '')      // emphasis / code markers
      .replace(/^[\s>#*-]+/, '')  // leading blockquote / heading / list markers
      .replace(/\|/g, ' ')        // table pipes
      .replace(/\s+/g, ' ').trim();
    if (t.length >= 40 && !/^!\[/.test(b)) return t.slice(0, 157).trim() + (t.length > 157 ? '…' : '');
  }
  return 'CIZEN TECH MIG Series frame grabber and CameraMaster documentation.';
}

function page(name, title, desc, bodyHtml) {
  const canonical = BASE + name + '.html';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escAttr(title)} · CIZEN TECH</title>
  <meta name="description" content="${escAttr(desc)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escAttr(title)}">
  <meta property="og:description" content="${escAttr(desc)}">
  <meta property="og:url" content="${canonical}">
  <link rel="icon" type="image/png" sizes="32x32" href="img/cizentech-32x32.png">
  <link rel="stylesheet" href="doc.css">
</head>
<body>
  <header class="doc-top">
    <a class="doc-home" href="index.html"><img src="img/cizentech-logo-195x88-trans.png" alt="CIZEN TECH"></a>
    <a class="doc-app" href="index.html#/${name}">Open in interactive docs →</a>
  </header>
  <main class="markdown-section">
${bodyHtml}
  </main>
  <footer class="doc-foot">
    <strong>CIZEN TECH Co., Ltd.</strong> · <a href="http://cizentech.com/">cizentech.com</a> · <a href="mailto:contact@cizentech.com">contact@cizentech.com</a>
  </footer>
</body>
</html>
`;
}

// --- build pages -----------------------------------------------------------

const mdFiles = fs.readdirSync(DOCS)
  .filter((f) => f.endsWith('.md') && !EXCLUDE.has(f));

const urls = [{ loc: BASE, mtime: fs.statSync(path.join(DOCS, 'README.md')).mtime }];

for (const file of mdFiles) {
  const name = file.replace(/\.md$/, '');
  const md = fs.readFileSync(path.join(DOCS, file), 'utf8');
  const title = titleOf(md, name);
  const desc = descOf(md);
  const body = rewriteLinks(marked.parse(md));
  fs.writeFileSync(path.join(DOCS, name + '.html'), page(name, title, desc, body));
  urls.push({ loc: BASE + name + '.html', mtime: fs.statSync(path.join(DOCS, file)).mtime });
  console.log('  page  ->', name + '.html');
}

// --- inject homepage content into index.html #app --------------------------

const idxPath = path.join(DOCS, 'index.html');
let idx = fs.readFileSync(idxPath, 'utf8');
const home = rewriteLinks(marked.parse(fs.readFileSync(path.join(DOCS, 'README.md'), 'utf8')));
const block = `<!--SEO:HOME:START-->\n${home}\n<!--SEO:HOME:END-->`;
if (/<!--SEO:HOME:START-->[\s\S]*?<!--SEO:HOME:END-->/.test(idx)) {
  idx = idx.replace(/<!--SEO:HOME:START-->[\s\S]*?<!--SEO:HOME:END-->/, block);
} else {
  idx = idx.replace(/<div id="app">[\s\S]*?<\/div>/, `<div id="app">\n${block}\n</div>`);
}
fs.writeFileSync(idxPath, idx);
console.log('  inject-> index.html #app (homepage content)');

// --- sitemap.xml + robots.txt ----------------------------------------------

const iso = (d) => d.toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${iso(u.mtime)}</lastmod></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(DOCS, 'sitemap.xml'), sitemap);

fs.writeFileSync(path.join(DOCS, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${BASE}sitemap.xml\n`);

console.log('  write -> sitemap.xml, robots.txt');
console.log('Done.', urls.length, 'URLs.');
