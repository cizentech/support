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

A **pre-commit hook** rebuilds automatically: whenever a commit touches a
`docs/*.md` file, `.githooks/pre-commit` runs this script and stages the
regenerated `*.html` / `sitemap.xml` / `robots.txt`. You just edit Markdown and
commit as usual.

Enable the hook once per clone (it lives in the committed `.githooks/` dir):

```bash
git config core.hooksPath .githooks
```

To run the build manually (e.g. to preview before committing):

```bash
node tools/build-seo.js
```

No `npm install` needed — `marked.min.js` is vendored next to the script.

## Submitting to Google

1. Verify ownership in [Search Console](https://search.google.com/search-console)
   (the `google…​.html` file is already in `docs/`).
2. Submit the sitemap: `https://cizentech.github.io/support/sitemap.xml`.
