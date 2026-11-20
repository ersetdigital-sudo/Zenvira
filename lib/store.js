import { CONFIG } from './data';
import { newInvoiceId } from './util';

/* Zenvira Digital — Penyimpanan lokal (localStorage aman) dan cache riwayat pesanan di perangkat.
   Dimuat sebagai <script> klasik: scope top-level dipakai bersama. */
const Store = (() => {
  const mem = {};
  let ok = true;
  try { localStorage.setItem('__kt', '1'); localStorage.removeItem('__kt'); } catch { ok = false; }
  return {
    get(k, d) { try { const v = ok ? localStorage.getItem(k) : mem[k]; return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { const s = JSON.stringify(v); try { if (ok) localStorage.setItem(k, s); else mem[k] = s; } catch { mem[k] = s; } },
    remove(k) { try { if (ok) localStorage.removeItem(k); else delete mem[k]; } catch { delete mem[k]; } },
  };
})();

/* Event bus ringan: emit('tx', invoiceId) dipakai halaman Transaksi untuk render ulang. */
const bus = new EventTarget();
const emit = (name, detail) => bus.dispatchEvent(new CustomEvent(name, { detail }));

/* Riwayat pesanan di perangkat ini.
   INTEGRATION: saat backend tersedia, sumber kebenaran pindah ke API (lihat js/api.js).
   Modul ini cukup menyimpan daftar pesanan terakhir sebagai cache/riwayat lokal. */
const Tx = (() => {
  const read = () => Store.get(CONFIG.storageKey, []);
  const write = (list) => Store.set(CONFIG.storageKey, list);
  return {
    local: read,
    localCount: () => read().length,
    all: () => read(),
    find: (id) => { const k = String(id || '').trim().toUpperCase(); return read().find((t) => t.id === k) || null; },
    create(payload) {
      const tx = { ...payload, id: newInvoiceId(), createdAt: Date.now(), status: 'pending', history: [{ status: 'pending', at: Date.now(), note: 'Pesanan dibuat. Menunggu pembayaran.' }] };
      const list = read(); list.unshift(tx); write(list.slice(0, 30));
      emit('tx', tx.id); return tx;
    },
    setStatus(id, status, note) {
      const list = read(); const tx = list.find((t) => t.id === id);
      if (!tx) return null;
      tx.status = status; tx.history.push({ status, at: Date.now(), note }); write(list);
      emit('tx', id); return tx;
    },
    clear() { write([]); emit('tx', null); },
  };
})();

export { Store, bus, emit, Tx };
