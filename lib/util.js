import { CONFIG, GAMES, PPOB, PAYMENTS } from './data';

/* Zenvira Digital — Utilitas DOM, format, helper layanan
   Diekstrak dari V1 (logika sudah teruji). Dimuat sebagai <script> klasik: scope top-level dipakai bersama. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const idr = (n) => (n < 0 ? '-' : '') + 'Rp' + Math.abs(Math.round(n)).toLocaleString('id-ID');
const fmtDate = (ts) => new Intl.DateTimeFormat(CONFIG.locale, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(ts);
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const debounce = (fn, ms = 150) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
const wait = (ms) => new Promise((r) => setTimeout(r, reduceMotion() ? Math.min(ms, 40) : ms));
const mask = (v) => {
  const s = String(v);
  if (s.includes('@')) { const [u, d] = s.split('@'); return `${u[0] || ''}•••@${d}`; }
  return s.length <= 4 ? s : s.slice(0, 2) + '•'.repeat(Math.min(s.length - 4, 6)) + s.slice(-2);
};
const getService = (kind, id) => (kind === 'game' ? GAMES : PPOB).find((s) => s.id === id) || null;
const getProduct = (kind, svcId, pid) => getService(kind, svcId)?.products?.find((p) => p.id === pid) || null;
const findPayment = (id) => PAYMENTS.find((p) => p.id === id) || null;
const feeText = (pay) => (pay.fee.type === 'percent' ? `Biaya ${String(pay.fee.value).replace('.', ',')}%` : `Biaya ${idr(pay.fee.value)}`);
const randomCode = (n) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const buf = new Uint32Array(n);
  (window.crypto || { getRandomValues: (a) => a.map(() => Math.random() * 4e9) }).getRandomValues(buf);
  return [...buf].map((x) => chars[x % chars.length]).join('');
};
const newInvoiceId = () => {
  const d = new Date();
  const p = (x) => String(x).padStart(2, '0');
  return `INV-${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${randomCode(5)}`;
};
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch { /* fallback below */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0;top:0';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy'); ta.remove(); return ok;
  } catch { return false; }
}
const App = { pendingPromo: null };

export {
  $, $$, esc, idr, fmtDate, reduceMotion, debounce, wait, mask,
  getService, getProduct, findPayment, feeText, randomCode, newInvoiceId,
  copyText, App,
};
