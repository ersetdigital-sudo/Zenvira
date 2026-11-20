import { GAMES, PPOB } from '../data';
import { svcIcon } from '../icons';
import { $, $$, esc, idr, reduceMotion } from '../util';
import { Theme } from './theme';
import { Sheet } from './sheet';
import { Router } from '../router';

/* Zenvira Digital — Command palette (Ctrl/⌘ + K atau "/"): cari game, layanan, halaman, invoice. */
const Palette = (() => {
  let root = null; let list = null; let input = null;
  let items = []; let sel = 0; let ret = null;

  const PAGES = [
    { title: 'Beranda', sub: 'Ringkasan & promo', icon: 'fa-house', href: '#/' },
    { title: 'PPOB', sub: 'Pulsa, data, listrik, e-wallet', icon: 'fa-receipt', href: '#/ppob' },
    { title: 'Top Up Game', sub: 'Semua game', icon: 'fa-gamepad', href: '#/game' },
    { title: 'Transaksi', sub: 'Cek status invoice', icon: 'fa-clock-rotate-left', href: '#/transaksi' },
    { title: 'Bantuan', sub: 'FAQ & kontak', icon: 'fa-circle-question', href: '#/bantuan' },
  ];

  const minPrice = (g) => Math.min(...g.products.map((p) => p.price));

  function allItems() {
    const out = [];
    PAGES.forEach((p) => out.push({ group: 'Halaman', ...p, keys: [p.title, p.sub] }));
    PPOB.forEach((s) => out.push({ group: 'PPOB', title: s.name, sub: s.desc, svg: svcIcon(s.id), tone: s.tone, href: `#/ppob/${s.id}`, keys: [s.name, s.short, s.desc] }));
    GAMES.forEach((g) => out.push({ group: 'Game', title: g.name, sub: `${g.category} · mulai ${idr(minPrice(g))}`, img: g.cover, href: `#/game/${g.id}`, keys: [g.name, g.short, g.category, ...g.aliases] }));
    out.push({ group: 'Aksi', title: 'Ganti tema', sub: 'Sistem → Terang → Gelap', icon: 'fa-circle-half-stroke', run: () => Theme.cycle(), keys: ['tema', 'gelap', 'terang', 'dark', 'light'] });
    return out;
  }

  function filter(q) {
    const all = allItems();
    const query = q.trim().toLowerCase();
    let res;
    if (!query) {
      const cap = { Halaman: 5, PPOB: 5, Game: 4, Aksi: 2 };
      const used = {};
      res = all.filter((i) => (used[i.group] = (used[i.group] || 0) + 1) <= cap[i.group]);
    } else {
      res = all
        .map((i) => {
          const hay = i.keys.map((k) => String(k).toLowerCase());
          const score = hay.some((k) => k.startsWith(query)) ? 2 : hay.some((k) => k.includes(query)) ? 1 : 0;
          return { i, score };
        })
        .filter((x) => x.score).sort((a, b) => b.score - a.score).map((x) => x.i);
      if (/^inv-[a-z0-9-]+$/i.test(query) && !res.some((i) => i.title.toLowerCase() === query)) {
        res.unshift({ group: 'Transaksi', title: `Buka invoice ${query.toUpperCase()}`, sub: 'Cek status transaksi', icon: 'fa-magnifying-glass', href: `#/transaksi/${query.toUpperCase()}` });
      }
    }
    return res.slice(0, 24);
  }

  const iconHTML = (i) => (i.svg ? `<span class="ico tone-${i.tone}">${i.svg}</span>` : i.img ? `<span class="ico"><img src="${esc(i.img)}" alt="" width="36" height="36"></span>` : `<span class="ico ${i.tone ? 'tone-' + i.tone : ''}"><i class="${i.icon.includes(' ') ? i.icon : 'fa-solid ' + i.icon}" aria-hidden="true"></i></span>`);

  function render() {
    if (!items.length) {
      list.innerHTML = '<div class="palette__empty"><i class="fa-regular fa-face-frown" aria-hidden="true"></i><p>Tidak ada hasil untuk pencarian ini.</p></div>';
      input.removeAttribute('aria-activedescendant');
      return;
    }
    let html = ''; let last = '';
    items.forEach((it, idx) => {
      if (it.group !== last) { html += `<div class="palette__group" role="presentation">${esc(it.group)}</div>`; last = it.group; }
      html += `<button class="palette__item" type="button" role="option" tabindex="-1" id="pal-${idx}" data-idx="${idx}" aria-selected="${idx === sel}">${iconHTML(it)}<span><b>${esc(it.title)}</b><small>${esc(it.sub || '')}</small></span></button>`;
    });
    list.innerHTML = html;
    input.setAttribute('aria-activedescendant', `pal-${sel}`);
  }

  function select(n, scroll = true) {
    if (!items.length) return;
    sel = (n + items.length) % items.length;
    $$('.palette__item', list).forEach((b) => b.setAttribute('aria-selected', String(Number(b.dataset.idx) === sel)));
    input.setAttribute('aria-activedescendant', `pal-${sel}`);
    if (scroll) $(`#pal-${sel}`, list)?.scrollIntoView({ block: 'nearest' });
  }

  function activate(idx) {
    const it = items[idx]; if (!it) return;
    close(false);
    if (it.run) it.run(); else if (it.href) { if (location.hash === it.href) Router.refresh(); else location.hash = it.href; }
  }

  function open() {
    if (root) return;
    ret = document.activeElement;
    root = document.createElement('div');
    root.className = 'palette';
    root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-label', 'Pencarian cepat');
    root.innerHTML = `<div class="palette__backdrop"></div>
      <div class="palette__panel">
        <div class="palette__bar"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
          <input class="palette__input" type="text" role="combobox" aria-expanded="true" aria-controls="palList" aria-autocomplete="list" placeholder="Cari game, layanan, halaman, invoice…" autocomplete="off" spellcheck="false" aria-label="Pencarian cepat">
          <kbd>Esc</kbd></div>
        <div class="palette__list" id="palList" role="listbox" aria-label="Hasil"></div>
        <div class="palette__foot"><span><kbd>↑</kbd> <kbd>↓</kbd> pilih</span><span><kbd>Enter</kbd> buka</span></div>
      </div>`;
    $('#sheets').appendChild(root);
    list = $('.palette__list', root); input = $('.palette__input', root);
    Sheet.lockScroll();
    items = filter(''); sel = 0; render();
    setTimeout(() => { root.classList.add('is-open'); input.focus(); }, 20);

    input.addEventListener('input', () => { items = filter(input.value); sel = 0; render(); });
    root.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); select(sel + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); select(sel - 1); }
      else if (e.key === 'Enter') { e.preventDefault(); activate(sel); }
      else if (e.key === 'Tab') { e.preventDefault(); }
    });
    root.addEventListener('click', (e) => {
      const b = e.target.closest('.palette__item');
      if (b) activate(Number(b.dataset.idx));
      else if (e.target.classList.contains('palette__backdrop')) close();
    });
    root.addEventListener('mousemove', (e) => { const b = e.target.closest('.palette__item'); if (b && Number(b.dataset.idx) !== sel) select(Number(b.dataset.idx), false); });
  }

  function close(restore = true) {
    if (!root) return;
    const r = root; root = null;
    r.classList.remove('is-open');
    setTimeout(() => r.remove(), reduceMotion() ? 0 : 260);
    Sheet.unlockScroll();
    if (restore && ret && document.contains(ret)) ret.focus({ preventScroll: true });
  }

  function init() {
    document.addEventListener('click', (e) => { if (e.target.closest('[data-palette]')) { e.preventDefault(); open(); } });
    document.addEventListener('keydown', (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); root ? close() : open(); }
      else if (e.key === '/' && !typing && !root && Sheet.depth === 0) { e.preventDefault(); open(); }
    });
  }

  /* dipakai juga oleh pencarian di hero: hasil terfilter (opsional dibatasi grup) */
  function search(q, { groups, limit = 7 } = {}) {
    return filter(q).filter((i) => !groups || groups.includes(i.group)).slice(0, limit);
  }

  return { init, open, close, search, iconHTML };
})();

export { Palette };
