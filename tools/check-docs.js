// Validate direct HTML links/assets and fragment destinations without downloading external files.
const fs = require('fs');
const path = require('path');
const docs = path.resolve(__dirname, '../docs');
let failures = 0, checked = 0;
// Docsify treats hash routes inside Markdown links as anchors on the current
// page. Use Page.md#section instead (raw HTML navigation links are unaffected).
for (const file of fs.readdirSync(docs).filter(f => f.endsWith('.md'))) {
  const markdown = fs.readFileSync(path.join(docs, file), 'utf8');
  for (const match of markdown.matchAll(/\]\(#\/[^)]+\)/g)) {
    console.error(`${file}: unsupported Markdown route ${match[0]}; use Page.md#section`);
    failures++;
  }
}
for (const file of fs.readdirSync(docs).filter(f => f.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(docs, file), 'utf8');
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const url = match[1].replace(/&amp;/g, '&');
    if (/^(?:[a-z]+:|\/\/|#\/)/i.test(url)) continue;
    const [pathname, fragment] = url.split('#');
    const target = path.resolve(docs, decodeURIComponent((pathname || file).split('?')[0]));
    if (!target.startsWith(docs + path.sep)) throw new Error(`Outside docs: ${url}`);
    checked++;
    let error;
    if (!fs.existsSync(target)) error = 'missing file';
    else if (fragment && !fragment.startsWith('/') && target.endsWith('.html')) {
      const source = fs.readFileSync(target, 'utf8');
      if (!source.includes(`id="${decodeURIComponent(fragment)}"`)) error = 'missing fragment';
    }
    if (error) { console.error(`${file}: ${url}: ${error}`); failures++; }
  }
}
console.log(`${checked} local references checked; ${failures} errors.`);
process.exitCode = failures ? 1 : 0;
