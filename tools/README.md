# Documentation build and validation

Markdown in `docs/` is the source of truth. The site offers Docsify hash routes and generated HTML for direct links and browsing without JavaScript.

```sh
node tools/build-seo.js
node tools/check-docs.js
python tools/check-python.py
```

Node.js 24 and Python 3 are used in CI. No npm dependencies are required; marked is vendored. Python checks parse snippets only and never load the SDK or access hardware.

The build generates document HTML, the home fallback, sitemap and robots.txt. It preserves section links and uses Docsify-compatible heading IDs. SFR is Korean; other documents are English. Filesystem timestamps are omitted from the sitemap for reproducible builds.

`doc.css` and `portal.js` are shared by both surfaces. External Docsify, copy-code and Prism versions are pinned in `docs/index.html`. Screenshots retain their original colors in dark mode.

## Local preview

On Windows, double-click `start-local.bat`, `stop-local.bat`, or `restart-local.bat` at the repository root. These use Node.js and need no npm install. The default port is 3103; pass `-Port 3107` to all three scripts to use another port. Start/restart rebuild generated HTML and open the browser unless `-NoBrowser` is supplied.

The managed preview serves only `docs/`, binds to loopback, disables caching and uses an instance token to stop only the preview belonging to this checkout. Existing servers from other tools are not terminated. State and logs are stored in the Windows temp directory. Set `SUPPORT_NO_PAUSE=1` when invoking the batch wrappers in automated checks.

Alternatively, a foreground preview can be started using Python (stop it with Ctrl+C):

```sh
python -m http.server 3103 --bind 127.0.0.1 --directory docs
```

Open http://127.0.0.1:3103/. Reload after editing. Check both `/#/Downloads` and `/Downloads.html`, including section links, mobile navigation, search and theme switching.

## Commit and CI

Include regenerated HTML, index, sitemap and robots with source changes. Enable the optional hook per clone:

```sh
git config core.hooksPath .githooks
```

The hook rebuilds and stages generated files. Stage complete source changes before using it; do not mix partial source edits with generated output. CI independently rebuilds, validates local references and Python syntax, then rejects stale or missing output. CI does not deploy or validate external SharePoint permissions, package compatibility or hardware operation.

Deleting a source removes its generated HTML if it carries the generator marker. Unmarked files, including the Google verification page, are preserved.
