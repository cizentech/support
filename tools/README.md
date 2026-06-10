# SEO pre-render tool

The live site (`docs/`) is a [docsify](https://docsify.js.org/) SPA that uses hash
routing (`#/Page`). Google ignores the URL fragment, so subpages are never indexed
as distinct pages. GitHub Pages is a static host with no server-side rewrites, so the
only way to give each page a real URL that returns **HTTP 200** is to emit one
physical `.html` file per page.

`build-seo.js` does that:

- renders every `docs/<name>.md` (except `README.md` and `_sidebar.md`) to
  `docs/<name>.html` — real content, with `<title>`, `<meta description>`, canonical,
  and OpenGraph tags;
- injects the rendered `README.md` into `docs/index.html`'s `#app` (between
  `<!--SEO:HOME:START/END-->` markers) so the homepage also serves real content to
  crawlers; docsify replaces it at runtime;
- writes `docs/sitemap.xml` and `docs/robots.txt`.

The interactive docsify site is untouched for human visitors — these files are the
crawlable surface that search engines index.

## Usage

Re-run after editing any `.md`, then commit the regenerated files:

```bash
node tools/build-seo.js
```

No `npm install` needed — `marked.min.js` is vendored next to the script.

## Submitting to Google

1. Verify ownership in [Search Console](https://search.google.com/search-console)
   (the `google…​.html` file is already in `docs/`).
2. Submit the sitemap: `https://cizentech.github.io/support/sitemap.xml`.
