import { CONFIG } from './data';
import { wait, reduceMotion } from './util';
import { Tx } from './store';
import { toast } from './ui/toast';

/* Zenvira Digital — Lapisan API
   ==========================================================================
   SATU-SATUNYA tempat UI berbicara dengan "server". Saat ini diisi implementasi
   MOCK (berjalan di browser, data di localStorage) supaya aplikasi bisa dipakai
   sebelum backend siap. Untuk go-live: ganti isi setiap fungsi dengan fetch() ke
   backend — tanda tangan fungsi & bentuk datanya (lihat @typedef) jangan diubah,
   maka UI tidak perlu disentuh.

   @typedef {Object} OrderPayload   input createOrder (dibuat oleh halaman checkout)
     kind          'game' | 'ppob'
     serviceId     string            id layanan (mis. 'mlbb', 'pln')
     serviceName   string
     productLabel  string
     fields        {label, value, secret}[]   data akun/tujuan (ID, zona, nomor, dsb.)
     subtotal, discount, fee, total   number (Rupiah)
     promoCode     string | null
     paymentId     string            id metode (lihat PAYMENTS di data.js)
     paymentName   string

   @typedef {Object} Order          dikembalikan createOrder / getOrder
     id            string            nomor invoice
     status        'pending' | 'processing' | 'success' | 'failed' | 'cancelled'
     createdAt     number (ms epoch)
     history       {status, at, note}[]
     ...semua field OrderPayload
     paymentUrl?   string            (produksi) URL halaman bayar dari payment gateway
   ========================================================================== */
const api = {
  /* ---- Tagihan (PPOB pascabayar) ----
     INTEGRATION: GET /bills/inquiry?service={id}&customerId={no}
     → { name, period, amount, admin, price, label } */
  async inquireBill(svc, customerId) {
    await wait(850);
    const sum = [...customerId].reduce((a, c) => a + (Number(c) || 0) * 7 + 13, 0);
    const names = ['A*** S****', 'B*** W******', 'D*** P*****', 'R*** H*****'];
    const amount = Math.round((60000 + ((sum * 917) % 340000)) / 100) * 100;
    const admin = 2500;
    const period = new Intl.DateTimeFormat(CONFIG.locale, { month: 'long', year: 'numeric' }).format(new Date());
    return { name: names[sum % names.length], period, amount, admin, price: amount + admin, label: `${svc.billLabel} ${period}` };
  },

  /* ---- Buat pesanan ----
     INTEGRATION: POST /orders  (body: OrderPayload) → Order (status 'pending') */
  async createOrder(payload) { await wait(1100); return Tx.create(payload); },

  /* ---- Ambil satu pesanan ----
     INTEGRATION: GET /orders/{invoice} → Order | 404 */
  async getOrder(id) { await wait(600); return Tx.find(id); },

  /* ---- Mulai pembayaran ----
     INTEGRATION: POST /orders/{invoice}/pay → { paymentUrl }  lalu `location.href = paymentUrl`.
     Status berubah lewat webhook gateway di server; UI cukup membaca getOrder() / polling.
     MOCK: langsung menandai dibayar → diproses → selesai. */
  async payOrder(id) {
    await wait(900);
    MockBackend.pay(id);
  },

  /* ---- Batalkan pesanan (hanya status 'pending') ----
     INTEGRATION: POST /orders/{invoice}/cancel */
  async cancelOrder(id) { await wait(500); MockBackend.cancel(id); },
};

/* ==========================================================================
   MOCK BACKEND — hapus blok ini saat backend sungguhan dipasang.
   Meniru perilaku webhook payment gateway dan provider di sisi server.
   ========================================================================== */
const MockBackend = (() => {
  const timers = {};
  const PROCESS_MS = 3500;

  function pay(id) {
    const tx = Tx.find(id);
    if (!tx || tx.status !== 'pending') return;
    Tx.setStatus(id, 'processing', 'Pembayaran diterima. Pesanan sedang diproses.');
    clearTimeout(timers[id]);
    timers[id] = setTimeout(() => {
      if (Tx.find(id)?.status === 'processing') {
        Tx.setStatus(id, 'success', 'Pesanan selesai diproses.');
        toast('Pesanan berhasil diproses.', { type: 'success' });
      }
    }, reduceMotion() ? 800 : PROCESS_MS);
  }

  function cancel(id) {
    const tx = Tx.find(id);
    if (tx && tx.status === 'pending') Tx.setStatus(id, 'cancelled', 'Dibatalkan oleh pengguna.');
  }

  /* Dipanggil saat aplikasi dimuat: pesanan "diproses" yang sudah melewati waktu proses dianggap selesai
     (agar status tetap konsisten bila halaman dimuat ulang). */
  function settle() {
    const list = Tx.local();
    list.filter((t) => t.status === 'processing' && Date.now() - t.history[t.history.length - 1].at > PROCESS_MS)
      .forEach((t) => Tx.setStatus(t.id, 'success', 'Pesanan selesai diproses.'));
  }

  return { pay, cancel, settle };
})();

export { api, MockBackend };
