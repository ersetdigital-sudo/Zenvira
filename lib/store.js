import { newInvoiceId } from './util';

/* Bersihkan riwayat pesanan lama yang sempat tersimpan di perangkat. */
if (typeof localStorage !== 'undefined') {
  try { localStorage.removeItem('zenvira.tx.v1'); } catch { /* storage diblokir */ }
}

/* Event bus ringan: emit('tx', invoiceId) dipakai halaman invoice untuk render ulang. */
const bus = new EventTarget();
const emit = (name, detail) => bus.dispatchEvent(new CustomEvent(name, { detail }));

/* Pesanan hanya hidup di memori selama sesi (halaman publik tidak menyimpan transaksi).
   INTEGRATION: saat backend tersedia, sumber kebenaran pindah ke API (lihat js/api.js). */
const Tx = (() => {
  let list = [];
  return {
    localCount: () => list.length,
    find: (id) => { const k = String(id || '').trim().toUpperCase(); return list.find((t) => t.id === k) || null; },
    create(payload) {
      const tx = { ...payload, id: newInvoiceId(), createdAt: Date.now(), status: 'pending', history: [{ status: 'pending', at: Date.now(), note: 'Pesanan dibuat. Menunggu pembayaran.' }] };
      list = [tx, ...list].slice(0, 30);
      emit('tx', tx.id); return tx;
    },
    setStatus(id, status, note) {
      const tx = list.find((t) => t.id === id);
      if (!tx) return null;
      tx.status = status; tx.history.push({ status, at: Date.now(), note });
      emit('tx', id); return tx;
    },
  };
})();

export { bus, emit, Tx };
