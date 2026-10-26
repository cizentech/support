/* Theme and accessible enhancements shared by static and interactive pages. */
(() => {
  let theme;
  try { theme = localStorage.getItem('cizen-support-theme'); } catch (_) {}
  const preference = matchMedia('(prefers-color-scheme: dark)');
  const apply = value => {
    document.documentElement.dataset.theme = value;
    document.querySelectorAll('.theme-toggle').forEach(button => {
      button.textContent = value === 'dark' ? 'Light' : 'Dark';
      button.setAttribute('aria-label', 'Switch to ' + (value === 'dark' ? 'light' : 'dark') + ' theme');
    });
  };
  apply(theme || (preference.matches ? 'dark' : 'light'));
  let imageDialog;
  const openImage = image => {
    if (!imageDialog) {
      imageDialog = document.createElement('dialog');
      imageDialog.className = 'image-viewer';
      imageDialog.setAttribute('aria-labelledby', 'image-viewer-title');
      imageDialog.innerHTML = '<div class="image-viewer-head"><strong id="image-viewer-title">Image preview</strong><button type="button" class="image-viewer-close" aria-label="Close image preview">Close ×</button></div><div class="image-viewer-canvas"><img alt=""></div><p class="image-viewer-caption"></p>';
      document.body.append(imageDialog);
      imageDialog.querySelector('button').addEventListener('click', () => imageDialog.close());
      imageDialog.addEventListener('click', event => { if (event.target === imageDialog) imageDialog.close(); });
    }
    const preview = imageDialog.querySelector('img');
    preview.src = image.currentSrc || image.src;
    preview.alt = image.alt;
    imageDialog.querySelector('.image-viewer-caption').textContent = image.alt || 'Documentation image';
    imageDialog.showModal();
  };
  document.addEventListener('click', event => {
    const imageButton = event.target.closest('.image-preview');
    if (imageButton) openImage(imageButton.querySelector('img'));
    if (event.target.closest('.theme-toggle')) {
      theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      apply(theme);
      try { localStorage.setItem('cizen-support-theme', theme); } catch (_) {}
    }
    if (event.target.closest('.skip-link')) {
      event.preventDefault();
      document.querySelector('.markdown-section')?.focus();
    }
    if (event.target.closest('.sidebar a') && innerWidth <= 768) {
      document.body.classList.remove('close');
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && innerWidth <= 768 && document.body.classList.contains('close')) {
      document.body.classList.remove('close');
      document.querySelector('.sidebar-toggle')?.focus();
    }
  });
  preference.addEventListener('change', event => { if (!theme) apply(event.matches ? 'dark' : 'light'); });
  const enhance = () => {
    const main = document.querySelector('.markdown-section');
    if (main) { main.id = 'main'; main.tabIndex = -1; }
    document.querySelectorAll('.markdown-section table, .markdown-section pre').forEach(el => {
      el.tabIndex = 0;
      el.setAttribute('aria-label', el.tagName === 'TABLE' ? 'Data table; scroll horizontally if needed' : 'Code example; scroll horizontally if needed');
    });
    document.querySelectorAll('.markdown-section img').forEach(img => {
      // Product photos are composed on themed surfaces; reference screenshots
      // retain their original pixels and can be inspected in a modal dialog.
      if (img.closest('.product-media, .image-preview, a, button')) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'image-preview';
      button.setAttribute('aria-label', 'Enlarge image: ' + (img.alt || 'Documentation image'));
      img.before(button);
      button.append(img);
      const label = document.createElement('span');
      label.className = 'image-preview-label';
      label.textContent = 'View full size ↗';
      button.append(label);
    });
    const toggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (toggle && sidebar) {
      sidebar.id = 'documentation-navigation';
      toggle.setAttribute('aria-controls', sidebar.id);
      toggle.setAttribute('aria-label', 'Toggle documentation menu');
      const open = innerWidth <= 768 ? document.body.classList.contains('close') : !document.body.classList.contains('close');
      toggle.setAttribute('aria-expanded', String(open));
      sidebar.inert = !open;
    }
  };
  window.$docsify = window.$docsify || {};
  // Docsify config is defined after this script; register on DOM readiness.
  document.addEventListener('DOMContentLoaded', () => {
    enhance(); apply(document.documentElement.dataset.theme);
    new MutationObserver(enhance).observe(document.body, {childList:true, subtree:true});
    new MutationObserver(enhance).observe(document.body, {attributes:true, attributeFilter:['class']});
    addEventListener('resize', enhance);
  });
})();
