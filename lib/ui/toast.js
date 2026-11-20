import { $, reduceMotion } from '../util';

/* Zenvira Digital — Toast notifikasi
   Diekstrak dari V1 (logika sudah teruji). Dimuat sebagai <script> klasik: scope top-level dipakai bersama. */
function toast(msg, { type = 'info', icon, duration = 4000 } = {}) {
  const wrap = $('#toasts');
  const icons = { success: 'fa-circle-check', error: 'fa-circle-exclamation', info: 'fa-circle-info' };
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.setAttribute('role', type === 'error' ? 'alert' : 'status');
  el.innerHTML = `<span class="toast__ico"><i class="fa-solid ${icon || icons[type]}" aria-hidden="true"></i></span><p></p><button type="button" aria-label="Tutup notifikasi"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>`;
  $('p', el).textContent = msg;
  const remove = () => { if (!el.isConnected || el.classList.contains('is-leaving')) return; el.classList.add('is-leaving'); setTimeout(() => el.remove(), reduceMotion() ? 0 : 300); };
  $('button', el).addEventListener('click', remove);
  wrap.appendChild(el);
  while (wrap.children.length > 3) wrap.firstElementChild.remove();
  setTimeout(remove, duration);
}

export { toast };
