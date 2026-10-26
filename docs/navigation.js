/* Keep document navigation separate from the current document's contents. */
(() => {
  const wide = matchMedia('(min-width: 1100px)');
  const labels = new Map([
    ['Basics — pixel count = width × height', 'Pixel count basics'],
    ['Resolution ↔ pixel count ↔ common name', 'Resolution & pixel count'],
    ['Pitfalls in the numbers', 'Interpreting specifications'],
    ['In practice — pixel count is bandwidth', 'Bandwidth calculation'],
    ['Frame size and bandwidth by pixel format', 'Pixel formats & frame size'],
    ['Effective interface bandwidth', 'Effective bandwidth'],
    ['MIG boards + GMSL capacity matrix', 'Board & link capacity']
  ]);
  const cleanLabel = title => {
    const plain = title.replace(/^\s*[-–—]?\s*\d+(?:\.\d+)*[.)]?\s+/, '').trim();
    return labels.get(plain) || plain;
  };
  let tracked = [];
  let toc;
  let frame;
  const updateActive = () => {
    frame = null;
    if (!tracked.length) return;
    let current = tracked[0];
    for (const item of tracked) {
      if (item.heading.getBoundingClientRect().top <= 140) current = item;
      else break;
    }
    const collapsed = current.link.closest('.toc-children:not([open])');
    const activeLink = collapsed?.parentElement.querySelector(':scope > a') || current.link;
    tracked.forEach(item => {
      if (item.link === activeLink) item.link.setAttribute('aria-current', 'location');
      else item.link.removeAttribute('aria-current');
    });
  };
  addEventListener('scroll', () => {
    if (!frame && tracked.length) frame = requestAnimationFrame(updateActive);
  }, {passive: true});
  wide.addEventListener('change', () => {
    if (toc) {
      toc.open = wide.matches;
      toc.querySelector(':scope > summary').tabIndex = wide.matches ? -1 : 0;
    }
  });

  function documentMenu() {
    const nav = document.querySelector('.sidebar-nav');
    if (!nav) return;
    const rawRoute = location.hash.split('?')[0];
    const route = !rawRoute || rawRoute === '#/' ? '#/README' : rawRoute;
    nav.setAttribute('aria-label', 'Documentation');
    nav.querySelectorAll('.app-sub-sidebar').forEach(list => list.remove());
    nav.querySelectorAll(':scope > ul > li').forEach(group => {
      let disclosure = group.querySelector(':scope > .nav-group');
      if (!disclosure) {
        const title = group.querySelector(':scope > strong, :scope > p > strong');
        const list = group.querySelector(':scope > ul');
        if (!title || !list) return;
        disclosure = document.createElement('div');
        disclosure.className = 'nav-group';
        const summary = document.createElement('p');
        summary.className = 'nav-group-title';
        summary.textContent = title.textContent;
        disclosure.append(summary, list);
        group.replaceChildren(disclosure);
      }
      disclosure.querySelectorAll('a').forEach(link => {
        const href = (link.getAttribute('href') || '').split('?')[0];
        const selected = href === route || (route === '#/README' && href === '#/');
        if (selected) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
        link.closest('li').classList.toggle('active', selected);
      });
    });
  }

  function pageContents() {
    tracked = [];
    toc?.remove();
    toc = null;
    document.body.classList.remove('has-page-toc');
    const main = document.querySelector('.markdown-section');
    if (!main) return;
    const home = !!main.querySelector('.cz-hero');
    main.querySelectorAll('.doc-toc').forEach(fallback => fallback.remove());
    if (home) return;
    const headings = [...main.querySelectorAll('h2[id], h3[id]')];
    if (!headings.length) return;
    toc = document.createElement('details');
    toc.className = 'page-toc';
    toc.open = wide.matches;
    const summary = document.createElement('summary');
    summary.textContent = document.documentElement.lang === 'ko' ? '이 페이지 목차' : 'On this page';
    summary.tabIndex = wide.matches ? -1 : 0;
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', summary.textContent);
    const list = document.createElement('ul');
    nav.append(list);
    toc.append(summary, nav);
    toc.addEventListener('toggle', () => {
      if (wide.matches && !toc.open) toc.open = true;
      updateActive();
    }, true);
    let parentItem;
    let parentSublist;
    headings.forEach(heading => {
      const title = heading.textContent.trim();
      const child = heading.tagName === 'H3' || /^\s*\d+\.\d+\b/.test(title);
      const link = document.createElement('a');
      link.textContent = cleanLabel(title);
      link.title = title;
      link.href = heading.querySelector('a.anchor')?.getAttribute('href') || '#' + encodeURIComponent(heading.id);
      const li = document.createElement('li');
      li.append(link);
      if (child && parentItem) {
        if (!parentSublist) {
          const details = document.createElement('details');
          details.className = 'toc-children';
          const toggle = document.createElement('summary');
          toggle.setAttribute('aria-label', 'Subsections: ' + parentItem.querySelector('a').textContent);
          toggle.textContent = document.documentElement.lang === 'ko' ? '세부 항목' : 'Subsections';
          parentSublist = document.createElement('ul');
          details.append(toggle, parentSublist);
          parentItem.append(details);
        }
        parentSublist.append(li);
      } else {
        list.append(li);
        parentItem = li;
        parentSublist = null;
      }
      tracked.push({heading, link});
    });
    const h1 = main.querySelector('h1');
    if (h1) h1.after(toc); else main.prepend(toc);
    document.body.classList.add('has-page-toc');
    if (!document.body.classList.contains('portal-app')) document.body.classList.add('doc-static');
    // A deep link can target a collapsed subsection; reveal its TOC group.
    let target = new URLSearchParams(location.hash.split('?')[1] || '').get('id');
    if (!target && !document.body.classList.contains('portal-app')) {
      try { target = decodeURIComponent(location.hash.slice(1)); } catch (_) {}
    }
    const match = tracked.find(item => item.heading.id === target);
    if (match) { const parent = match.link.closest('.toc-children'); if (parent) parent.open = true; }
    updateActive();
  }

  window.SupportNavigation = {refresh() { documentMenu(); pageContents(); }};
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.body.classList.contains('portal-app')) pageContents();
  });
})();
