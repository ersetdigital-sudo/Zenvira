import { $, $$ } from '../util';
import { toast } from './toast';

/* Zenvira Digital — Tema terang / gelap / sistem. Kunci localStorage cocok dengan skrip di <head>. */
const Theme = (() => {
  const KEY = 'zenvira.theme';
  const MODES = ['system', 'light', 'dark'];
  const LABEL = { system: 'Sistem', light: 'Terang', dark: 'Gelap' };
  const ICON = { system: 'fa-circle-half-stroke', light: 'fa-sun', dark: 'fa-moon' };
  let mq = null;
  const getMq = () => (mq ?? (mq = window.matchMedia('(prefers-color-scheme: dark)')));
  let mode = 'system';
  try { mode = localStorage.getItem(KEY) || 'system'; } catch { /* storage diblokir */ }
  if (!MODES.includes(mode)) mode = 'system';

  const resolved = () => (mode === 'system' ? (getMq().matches ? 'dark' : 'light') : mode);

  function apply() {
    const r = resolved();
    document.documentElement.setAttribute('data-theme', r);
    const meta = document.getElementById('metaTheme');
    if (meta) meta.setAttribute('content', r === 'dark' ? '#0d0d0e' : '#f5f5f1');
    $$('[data-theme-toggle]').forEach((b) => {
      b.setAttribute('aria-label', `Ganti tema (sekarang: ${LABEL[mode]})`);
      const i = $('i', b); if (i) i.className = `fa-solid ${ICON[mode]}`;
      const s = $('span', b); if (s) s.textContent = `Tema: ${LABEL[mode]}`;
    });
  }

  function set(next) {
    mode = next;
    try { localStorage.setItem(KEY, mode); } catch { /* abaikan */ }
    apply();
  }

  function cycle() {
    set(MODES[(MODES.indexOf(mode) + 1) % MODES.length]);
    toast(`Tema: ${LABEL[mode]}`, { type: 'info', icon: ICON[mode], duration: 1800 });
  }

  function init() {
    apply();
    getMq().addEventListener('change', () => { if (mode === 'system') apply(); });
    document.addEventListener('click', (e) => { if (e.target.closest('[data-theme-toggle]')) cycle(); });
  }

  return { init, set, cycle, get mode() { return mode; }, get resolved() { return resolved(); } };
})();

export { Theme };
