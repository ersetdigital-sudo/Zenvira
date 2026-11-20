import { $, $$, esc, reduceMotion } from '../util';

/* Zenvira Digital — Sheet: bottom-sheet (mobile) / dialog (desktop)
   Focus-trap, Esc, kunci scroll, tumpukan (stack), pengembalian fokus. */
const Sheet = (() => {
  const stack = [];
  let uid = 0;
  let scrollLocks = 0;
  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  const isVisible = (el) => el.offsetParent !== null || el.getClientRects().length > 0;

  function lockScroll() {
    if (++scrollLocks === 1) {
      const sbw = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--sbw', sbw + 'px');
      document.documentElement.classList.add('no-scroll');
    }
  }
  function unlockScroll() {
    scrollLocks = Math.max(0, scrollLocks - 1);
    if (!scrollLocks) document.documentElement.classList.remove('no-scroll');
  }

  function open({ title = '', body = '', foot = '', locked = false, className = '', onClose } = {}) {
    const id = `sheet-${++uid}`;
    const el = document.createElement('div');
    el.className = `sheet ${className}`.trim();
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', `${id}-t`);
    el.innerHTML = `
      <div class="sheet__backdrop" data-sheet-close></div>
      <div class="sheet__panel" tabindex="-1">
        <div class="sheet__grab" aria-hidden="true"></div>
        <header class="sheet__head"><h2 id="${id}-t"></h2><button class="icon-btn" type="button" data-sheet-close aria-label="Tutup"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></header>
        <div class="sheet__body"></div>
        <div class="sheet__foot"></div>
      </div>`;
    const titleEl = el.querySelector('h2'); titleEl.textContent = title;
    const bodyEl = el.querySelector('.sheet__body');
    const footEl = el.querySelector('.sheet__foot');
    const setContent = (target, c) => { if (c instanceof Node) { target.replaceChildren(c); } else { target.innerHTML = c; } };
    setContent(bodyEl, body); setContent(footEl, foot);

    const ctl = {
      el, body: bodyEl, foot: footEl, locked,
      setTitle: (t) => { titleEl.textContent = t; },
      setBody: (c) => setContent(bodyEl, c),
      setFoot: (c) => setContent(footEl, c),
      close: () => close(ctl),
      onClose,
    };
    el._ctl = ctl;
    el._ret = document.activeElement;

    const below = stack[stack.length - 1];
    if (below) below.el.setAttribute('inert', '');
    el.style.zIndex = 1000 + stack.length * 10;
    stack.push(ctl);
    $('#sheets').appendChild(el);
    lockScroll();
    setTimeout(() => {
      if (!stack.includes(ctl)) return;
      el.classList.add('is-open');
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      const first = coarse ? null : bodyEl.querySelector('input:not([type=radio]):not([type=checkbox]), select');
      (first || el.querySelector('.sheet__panel')).focus({ preventScroll: true });
    }, 30);
    return ctl;
  }

  function close(ctl) {
    const i = stack.indexOf(ctl);
    if (i < 0) return;
    stack.splice(i, 1);
    const { el } = ctl;
    el.classList.remove('is-open');
    el.removeAttribute('inert');
    const below = stack[stack.length - 1];
    if (below && i === stack.length) below.el.removeAttribute('inert');
    setTimeout(() => el.remove(), reduceMotion() ? 0 : 340);
    unlockScroll();
    if (el._ret && document.contains(el._ret)) el._ret.focus({ preventScroll: true });
    if (ctl.onClose) ctl.onClose();
  }

  function closeAll() { [...stack].reverse().forEach(close); }

  if (typeof document !== 'undefined') {
    document.addEventListener('click', (e) => {
      const c = e.target.closest('[data-sheet-close]');
      if (!c) return;
      const el = c.closest('.sheet');
      if (el && el._ctl && !el._ctl.locked) close(el._ctl);
    });

    document.addEventListener('keydown', (e) => {
      const top = stack[stack.length - 1];
      if (!top) return;
      if (e.key === 'Escape' && !top.locked) { e.preventDefault(); close(top); return; }
      if (e.key !== 'Tab') return;
      const panel = top.el.querySelector('.sheet__panel');
      const items = [...panel.querySelectorAll(FOCUSABLE)].filter(isVisible);
      if (!items.length) { e.preventDefault(); return; }
      const first = items[0]; const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---- helpers siap pakai ---- */
  function confirm({ title, text, label = 'Ya', cancel = 'Batal', onConfirm }) {
    const s = open({
      title,
      body: `<div class="prose"><p>${esc(text)}</p></div>`,
      foot: `<button class="btn btn--line" type="button" data-sheet-close>${esc(cancel)}</button><button class="btn btn--ink" type="button" data-ok>${esc(label)}</button>`,
    });
    s.foot.querySelector('[data-ok]').addEventListener('click', () => { s.close(); if (onConfirm) onConfirm(); });
    return s;
  }

  return { open, close, closeAll, confirm, lockScroll, unlockScroll, get depth() { return stack.length; } };
})();

export { Sheet };
