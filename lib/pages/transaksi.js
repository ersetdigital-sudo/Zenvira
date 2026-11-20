import { STATUS } from '../data';
import { $, $$, esc, idr, fmtDate, mask, findPayment, copyText } from '../util';
import { Sheet } from '../ui/sheet';
import { toast } from '../ui/toast';
import { api } from '../api';
import { Tx, bus } from '../store';
import { Pages } from './home';
import { txKV } from './service';

/* Zenvira Digital — Transaksi: daftar + pencarian invoice (#/transaksi) dan detail pesanan (#/transaksi/:id) */
/* Batas waktu pembayaran (jam) sejak pesanan dibuat */
const PAY_WINDOW_HOURS = 24;

/* ================= CEK STATUS ================= */
Pages.transaksi = () => {
  return {
    title: 'Transaksi', route: 'transaksi', view: 'page',
    html: `
      <div class="page-head"><h1>Transaksi</h1><p>Masukkan nomor invoice untuk melihat status pesanan.</p></div>
      <div class="tile tx-check">
        <form class="tx-search" id="txSearch" novalidate>
          <div class="field" style="margin:0">
            <label class="sr-only" for="txInput">Nomor invoice</label>
            <div class="searchbox"><i class="fa-solid fa-file-invoice" aria-hidden="true"></i>
              <input class="input" id="txInput" type="text" placeholder="Nomor invoice, mis. INV-250101-AB12C" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-describedby="txError">
            </div>
            <p class="field__error" id="txError" role="alert"></p>
          </div>
          <button class="btn btn--ink btn--lg" type="submit" id="txBtn" style="align-self:start"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i> Cek Status</button>
        </form>
        <p class="tx-check__note"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i><span>Demi keamanan, riwayat transaksi tidak disimpan di perangkat ini. Catat nomor invoice untuk referensi atau bantuan.</span></p>
      </div>`,
    mount(root) {
      const $r = (s) => $(s, root);
      const input = $r('#txInput'); const err = $r('#txError');
      const setError = (m) => { err.textContent = m || ''; input.setAttribute('aria-invalid', m ? 'true' : 'false'); };
      input.addEventListener('input', () => setError(''));
      $r('#txSearch').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = input.value.trim().toUpperCase(); input.value = id;
        if (!id) { setError('Masukkan nomor invoice terlebih dahulu.'); input.focus(); return; }
        if (!/^INV-[A-Z0-9]+(-[A-Z0-9]+)*$/.test(id)) { setError('Format nomor invoice tidak valid. Contoh: INV-250101-AB12C.'); return; }
        setError('');
        const btn = $r('#txBtn'); btn.classList.add('is-loading');
        try {
          const tx = await api.getOrder(id);
          if (tx) location.hash = `#/transaksi/${tx.id}`;
          else setError(`Invoice ${id} tidak ditemukan. Periksa kembali nomor invoice-nya.`);
        } finally { btn.classList.remove('is-loading'); }
      });
    },
  };
};

/* ================= DETAIL PESANAN ================= */
Pages.transaksiDetail = (id, query = {}) => {
  const first = Tx.find(id);
  if (!first) {
    return {
      title: 'Invoice tidak ditemukan', route: 'transaksi', view: 'page',
      html: `<nav class="crumbs" aria-label="Breadcrumb"><a href="#/transaksi"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Transaksi</a></nav>
        <div class="empty"><span class="ico"><i class="fa-solid fa-circle-question" aria-hidden="true"></i></span><h1 style="font-size:1.5rem">Invoice tidak ditemukan</h1>
        <p>Nomor <code>${esc(id)}</code> tidak ditemukan. Periksa kembali nomor invoice-nya.</p><a class="btn btn--ink" href="#/transaksi">Kembali ke Transaksi</a></div>`,
    };
  }

  /* Panel pembayaran (status "pending") */
  const payPanel = (tx) => {
    const pay = findPayment(tx.paymentId);
    const deadlineTs = tx.createdAt + PAY_WINDOW_HOURS * 3600 * 1000;
    const deadline = fmtDate(deadlineTs);
    const qris = tx.paymentId === 'qris'
      ? `<div class="qris-box">
          <div class="qris-box__img"><img src="/qris_barcode_only.png" width="530" height="535" alt="Kode QRIS pembayaran"></div>
          <p class="qris-box__note">Scan dengan e-wallet atau m-banking.</p>
        </div>`
      : '';
    const info = `
      <div class="pay-panel__side">
        <div class="pay-panel__amount"><span>Total pembayaran</span><strong>${idr(tx.total)}</strong></div>
        <div class="pay-timer" data-countdown="${deadlineTs}" role="timer">
          <span><i class="fa-regular fa-clock" aria-hidden="true"></i> Sisa waktu pembayaran</span>
          <b class="mono" data-timer>--:--:--</b>
        </div>
        <p class="pay-panel__hint"><i class="fa-solid fa-circle-info" aria-hidden="true"></i><span>${qris ? 'Scan kode QRIS, lalu pastikan nominal di aplikasi pembayaran sama dengan total di atas.' : 'Selesaikan pembayaran sesuai instruksi metode yang dipilih sebelum waktu habis.'}</span></p>
        <div class="tx-actions">
          <button class="btn btn--accent btn--lg" type="button" data-pay="${esc(tx.id)}"><i class="fa-solid fa-lock" aria-hidden="true"></i> Bayar Sekarang</button>
          <button class="btn btn--line btn--lg" type="button" data-cancel="${esc(tx.id)}">Batalkan Pesanan</button>
        </div>
      </div>`;
    return `
      <div class="pay-panel__head">
        <span class="pay-logo" style="--pc:${pay ? pay.color : '#121212'}" aria-hidden="true">${esc(pay ? pay.code : '')}</span>
        <div class="pay-panel__title"><b>Bayar dengan ${esc(tx.paymentName)}</b><small>Selesaikan pembayaran sebelum ${deadline}</small></div>
      </div>
      ${qris ? `<div class="pay-panel__grid"><div class="pay-panel__qr">${qris}</div>${info}</div>` : info}`;
  };

  const detailHTML = (tx, isNew) => {
    const s = STATUS[tx.status];
    const title = isNew && tx.status === 'pending' ? 'Pesanan berhasil dibuat' : s.label;
    const desc = isNew && tx.status === 'pending' ? 'Lanjutkan ke pembayaran. Simpan nomor invoice ini untuk mengecek status pesanan.' : s.desc;
    const hero = `
      <section class="tile tx-hero status--${tx.status}${isNew ? ' is-new' : ''}" aria-labelledby="tx-title">
        <div class="tx-hero__top"><span class="tx-hero__ico"><i class="fa-solid ${isNew && tx.status === 'pending' ? 'fa-file-circle-check' : s.icon}" aria-hidden="true"></i></span>
          <div class="tx-hero__copy"><h1 id="tx-title">${esc(title)}</h1><p>${esc(desc)}</p></div></div>
        <div class="tx-hero__meta">
          <div class="tx-id"><code>${esc(tx.id)}</code><button class="btn btn--line btn--sm" type="button" data-copy="${esc(tx.id)}"><i class="fa-solid fa-copy" aria-hidden="true"></i> Salin</button></div>
          <span class="status status--${tx.status}"><i class="fa-solid ${s.icon}" aria-hidden="true"></i> ${s.label}</span>
        </div>
      </section>`;
    const detailCard = `<section class="tile" aria-labelledby="tx-detail-h"><h2 id="tx-detail-h">Rincian pesanan</h2>${txKV(tx, { masked: true, date: true })}</section>`;
    const historyCard = `<section class="tile" aria-labelledby="tx-hist-h"><h2 id="tx-hist-h">Riwayat status</h2>
          <ol class="timeline">${[...tx.history].reverse().map((h) => `<li class="is-${h.status}"><b>${STATUS[h.status].label}</b><small>${fmtDate(h.at)} · ${esc(h.note || '')}</small></li>`).join('')}</ol></section>`;
    const actions = `<div class="tx-actions" style="margin-top:0">
            <a class="btn btn--line" href="#/transaksi"><i class="fa-solid fa-list" aria-hidden="true"></i> Semua Transaksi</a>
            <a class="btn btn--ink" href="#/${tx.kind}/${esc(tx.serviceId)}"><i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Pesan Lagi</a>
          </div>`;

    if (tx.status === 'pending') {
      return `${hero}
        <div class="tx-detail">
          <section class="tile pay-panel" aria-label="Pembayaran">${payPanel(tx)}</section>
          <div class="tx-detail__side">${detailCard}${historyCard}<section class="tile">${actions}</section></div>
        </div>`;
    }

    const aside = tx.status === 'processing' ? '<div class="notice notice--info" style="margin:0"><i class="fa-solid fa-circle-info" aria-hidden="true"></i><span>Pembayaran sudah kami terima. Halaman ini diperbarui otomatis saat pesanan selesai diproses.</span></div>' : '';
    return `${hero}
      <div class="tx-grid">
        ${aside ? `<section class="tile span-full" aria-label="Pembayaran">${aside}</section>` : ''}
        ${detailCard}${historyCard}
        <section class="tile span-full">${actions}</section>
      </div>`;
  };

  return {
    title: `Invoice ${first.id}`, route: 'transaksi', view: 'page',
    html: `<nav class="crumbs" aria-label="Breadcrumb"><a href="#/transaksi"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Transaksi</a></nav><div id="txRoot">${detailHTML(first, !!query.baru)}</div>`,
    mount(root) {
      const box = $('#txRoot', root);
      root.addEventListener('click', async (e) => {
        const c = e.target.closest('[data-copy]');
        if (c) copyText(c.dataset.copy).then((ok) => toast(ok ? 'Nomor invoice disalin.' : 'Tidak dapat menyalin otomatis. Salin manual ya.', { type: ok ? 'success' : 'error' }));

        const p = e.target.closest('[data-pay]');
        if (p) {
          p.classList.add('is-loading');
          try { await api.payOrder(p.dataset.pay); toast('Pembayaran diterima. Pesanan sedang diproses.', { type: 'success' }); }
          catch { toast('Pembayaran belum berhasil. Coba lagi.', { type: 'error' }); p.classList.remove('is-loading'); }
        }

        const x = e.target.closest('[data-cancel]');
        if (x) Sheet.confirm({ title: 'Batalkan pesanan?', text: 'Pesanan yang dibatalkan tidak akan diproses dan tidak dapat dipulihkan.', label: 'Ya, batalkan', cancel: 'Kembali', onConfirm: async () => { await api.cancelOrder(x.dataset.cancel); toast('Pesanan dibatalkan.', { type: 'info' }); } });
      });
      const pad = (n) => String(n).padStart(2, '0');
      const tickTimers = () => {
        $$('[data-countdown]', box).forEach((el) => {
          const end = Number(el.dataset.countdown);
          const out = $('[data-timer]', el);
          if (!end || !out) return;
          const left = end - Date.now();
          if (left <= 0) {
            el.classList.add('is-expired');
            out.textContent = 'Waktu habis';
            return;
          }
          el.classList.remove('is-expired');
          const sec = Math.floor(left / 1000);
          out.textContent = `${pad(Math.floor(sec / 3600))}:${pad(Math.floor((sec % 3600) / 60))}:${pad(sec % 60)}`;
        });
      };
      tickTimers();
      const timerId = setInterval(tickTimers, 1000);

      const onTx = (e) => {
        if (e.detail && e.detail !== first.id) return;
        const tx = Tx.find(first.id); if (!tx) return;
        const y = window.scrollY; box.innerHTML = detailHTML(tx, false); window.scrollTo(0, y);
        tickTimers();
      };
      bus.addEventListener('tx', onTx);
      return () => { bus.removeEventListener('tx', onTx); clearInterval(timerId); };
    },
  };
};
