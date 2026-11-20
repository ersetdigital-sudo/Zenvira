import { $, $$ } from './util';
import { Pages } from './pages/home';
import { Sheet } from './ui/sheet';
import { Palette } from './ui/palette';

/* Zenvira Digital — Router hash sederhana.
   Handler halaman: (params, query) => { title, route, view, html, mount?(root) => cleanup? } */
const Router = (() => {
  const routes = [];
  let cleanup = null;
  let titleSeq = 0;

  function add(pattern, handler) {
    const keys = [];
    const re = new RegExp('^' + pattern.replace(/:([a-zA-Z]+)/g, (_, k) => { keys.push(k); return '([^/]+)'; }) + '/?$');
    routes.push({ re, keys, handler });
  }

  function parse() {
    const raw = window.location.hash.replace(/^#/, '') || '/';
    const [path, qs = ''] = raw.split('?');
    return { path: path.startsWith('/') ? path : `/${path}`, query: Object.fromEntries(new URLSearchParams(qs)) };
  }

  function render() {
    if (cleanup) { try { cleanup(); } catch { /* abaikan */ } cleanup = null; }
    Sheet.closeAll(); Palette.close(false);

    const { path, query } = parse();
    let res = null;
    for (const r of routes) {
      const m = r.re.exec(path);
      if (m) {
        const params = {}; r.keys.forEach((k, i) => { params[k] = decodeURIComponent(m[i + 1]); });
        res = r.handler(params, query); break;
      }
    }
    if (!res) res = Pages.notFound();

    // Ganti #view dengan salinan bersih (tanpa listener) agar handler halaman lama tidak menumpuk.
    const old = $('#view');
    const view = old.cloneNode(false);
    old.replaceWith(view);
    view.innerHTML = res.html;
    document.body.dataset.view = res.view || 'page';
    const pageTitle = `${res.title} — Zenvira Digital`;
    document.title = pageTitle;
    const seq = ++titleSeq;
    /* Metadata Next.js bisa menimpa title sekali setelah hidrasi; pasang ulang sesaat. */
    if (seq === 1) {
      [0, 120, 400, 1200].forEach((ms) => setTimeout(() => {
        if (seq === titleSeq && document.title !== pageTitle) document.title = pageTitle;
      }, ms));
    }
    $$('[data-route]').forEach((el) => (el.dataset.route === res.route ? el.setAttribute('aria-current', 'page') : el.removeAttribute('aria-current')));

    view.classList.remove('is-entering'); void view.offsetWidth; view.classList.add('is-entering');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const h1 = $('h1', view);
    if (h1) { h1.setAttribute('tabindex', '-1'); h1.style.outline = 'none'; h1.focus({ preventScroll: true }); } else view.focus({ preventScroll: true });

    if (res.mount) { const c = res.mount(view); if (typeof c === 'function') cleanup = c; }
  }

  return {
    add, refresh: render,
    start() { window.addEventListener('hashchange', render); render(); },
    go(path) { if (window.location.hash === `#${path}`) render(); else window.location.hash = path; },
  };
})();

export { Router };
