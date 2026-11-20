import { STATUS } from '../data';
import { $, esc, idr, fmtDate, mask, findPayment, copyText } from '../util';
import { Sheet } from '../ui/sheet';
import { toast } from '../ui/toast';
import { api } from '../api';
import { Tx, bus } from '../store';
import { Pages, View } from './home';
import { txKV } from './service';

/* Zenvira Digital — Transaksi: daftar + pencarian invoice (#/transaksi) dan detail pesanan (#/transaksi/:id) */
/* Batas waktu pembayaran (jam) sejak pesanan dibuat */
const PAY_WINDOW_HOURS = 24;

/* ================= DAFTAR ================= */
Pages.transaksi = () => {
  const TABS = [['all', 'Semua'], ['pending', 'Menunggu'], ['processing', 'Diproses'], ['success', 'Berhasil'], ['failed', 'Gagal'], ['cancelled', 'Dibatalkan']];
  let filter = 'all';

  return {
    title: 'Transaksi', route: 'transaksi', view: 'page',
    html: `
      <div class="page-head"><h1>Transaksi</h1><p>Masukkan nomor invoice untuk melihat status pesanan, atau telusuri riwayat pesananmu di perangkat ini.</p></div>
      <div class="tx-tools">
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
        <div class="seg" role="tablist" aria-label="Filter status" id="txTabs"></div>
      </div>
      <section class="tx-section" aria-labelledby="tx-mine"><h2 id="tx-mine">Riwayat pesanan <small id="mineCount"></small><span style="flex:1"></span><button class="btn btn--ghost btn--sm" type="button" id="txClear" hidden><i class="fa-regular fa-trash-can" aria-hidden="true"></i> Hapus riwayat</button></h2><div id="txMine"></div></section>`,
    mount(root) {
      const $r = (s) => $(s, root);
      const renderTabs = () => {
        const all = Tx.all(); const c = { all: all.length };
        all.forEach((t) => (c[t.status] = (c[t.status] || 0) + 1));
        $r('#txTabs').innerHTML = TABS.map(([k, l]) => `<button type="button" role="tab" data-tab="${k}" aria-selected="${k === filter}">${l}${c[k] ? ` <span class="muted">${c[k]}</span>` : ''}</button>`).join('');
      };
      const renderList = () => {
        const all = Tx.local(); const mine = all.filter((t) => filter === 'all' || t.status === filter);
        $r('#mineCount').textContent = all.length ? `${all.length} pesanan` : '';
        $r('#txClear').hidden = !all.length;
        $r('#txMine').innerHTML = mine.length
          ? `<ul class="tx-list">${mine.map((t) => `<li>${View.txRow(t)}</li>`).join('')}</ul>`
          : `<div class="empty"><span class="ico"><i class="fa-solid fa-file-invoice" aria-hidden="true"></i></span><h3>${all.length ? 'Tidak ada pesanan dengan status ini' : 'Belum ada pesanan'}</h3><p>${all.length ? 'Pilih filter lain untuk melihat pesanan lainnya.' : 'Pesanan yang kamu buat akan muncul di sini. Mulai dari PPOB atau top up game.'}</p>${all.length ? '' : '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><a class="btn btn--ink" href="#/ppob">Bayar PPOB</a><a class="btn btn--line" href="#/game">Top Up Game</a></div>'}</div>`;
      };
      const refresh = () => { renderTabs(); renderList(); };
      refresh();

      $r('#txTabs').addEventListener('click', (e) => { const b = e.target.closest('[data-tab]'); if (b) { filter = b.dataset.tab; refresh(); } });
      $r('#txClear').addEventListener('click', () => Sheet.confirm({ title: 'Hapus riwayat?', text: 'Semua riwayat pesanan di perangkat ini akan dihapus. Tindakan ini tidak dapat dibatalkan.', label: 'Ya, hapus', onConfirm: () => { Tx.clear(); toast('Riwayat pesanan dihapus.', { type: 'info' }); } }));

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

      const onTx = () => refresh();
      bus.addEventListener('tx', onTx);
      return () => bus.removeEventListener('tx', onTx);
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
        <p>Nomor <code>${esc(id)}</code> tidak ditemukan. Periksa kembali nomor invoice-nya atau cek riwayat pesananmu.</p><a class="btn btn--ink" href="#/transaksi">Kembali ke Transaksi</a></div>`,
    };
  }

  /* Panel pembayaran (status "pending") */
  const payPanel = (tx) => {
    const pay = findPayment(tx.paymentId);
    const deadline = fmtDate(tx.createdAt + PAY_WINDOW_HOURS * 3600 * 1000);
    const qris = tx.paymentId === 'qris' ? `
        <div class="qris-box">
          <div class="qris-box__img"><img src="/qris_barcode_only.png" width="530" height="535" alt="Kode QRIS pembayaran"></div>
          <p class="qris-box__note">Scan kode QRIS di atas dengan e-wallet atau mobile banking, lalu selesaikan pembayaran.</p>
        </div>` : '';
    return `
      <div class="pay-panel">
        <div class="pay-panel__head">
          <span class="pay-logo" style="--pc:${pay ? pay.color : '#121212'}" aria-hidden="true">${esc(pay ? pay.code : '')}</span>
          <div><b>Bayar dengan ${esc(tx.paymentName)}</b><small>Selesaikan pembayaran sebelum ${deadline}</small></div>
        </div>
        <div class="pay-panel__amount"><span>Total pembayaran</span><strong>${idr(tx.total)}</strong></div>${qris}
        <div class="tx-actions">
          <button class="btn btn--accent btn--lg" type="button" data-pay="${esc(tx.id)}"><i class="fa-solid fa-lock" aria-hidden="true"></i> Bayar Sekarang</button>
          <button class="btn btn--line btn--lg" type="button" data-cancel="${esc(tx.id)}">Batalkan Pesanan</button>
        </div>
      </div>`;
  };

  const detailHTML = (tx, isNew) => {
    const s = STATUS[tx.status];
    const aside = tx.status === 'pending' ? payPanel(tx)
      : tx.status === 'processing' ? '<div class="notice notice--info" style="margin:0"><i class="fa-solid fa-circle-info" aria-hidden="true"></i><span>Pembayaran sudah kami terima. Halaman ini diperbarui otomatis saat pesanan selesai diproses.</span></div>'
        : '';
    const title = isNew && tx.status === 'pending' ? 'Pesanan berhasil dibuat' : s.label;
    const desc = isNew && tx.status === 'pending' ? 'Lanjutkan ke pembayaran. Simpan nomor invoice ini untuk mengecek status pesanan.' : s.desc;
    return `
      <section class="tile tx-hero status--${tx.status}${isNew ? ' is-new' : ''}" aria-labelledby="tx-title">
        <div class="tx-hero__top"><span class="tx-hero__ico"><i class="fa-solid ${isNew && tx.status === 'pending' ? 'fa-file-circle-check' : s.icon}" aria-hidden="true"></i></span>
          <div><h1 id="tx-title">${esc(title)}</h1><p>${esc(desc)}</p></div></div>
        <div class="tx-id"><code>${esc(tx.id)}</code><button class="btn btn--line btn--sm" type="button" data-copy="${esc(tx.id)}"><i class="fa-solid fa-copy" aria-hidden="true"></i> Salin</button></div>
        <div><span class="status status--${tx.status}"><i class="fa-solid ${s.icon}" aria-hidden="true"></i> ${s.label}</span></div>
      </section>
      <div class="tx-grid">
        ${aside ? `<section class="tile span-full" aria-label="Pembayaran">${aside}</section>` : ''}
        <section class="tile" aria-labelledby="tx-detail-h"><h2 id="tx-detail-h">Rincian pesanan</h2>${txKV(tx, { masked: true, date: true })}</section>
        <section class="tile" aria-labelledby="tx-hist-h"><h2 id="tx-hist-h">Riwayat status</h2>
          <ol class="timeline">${[...tx.history].reverse().map((h) => `<li class="is-${h.status}"><b>${STATUS[h.status].label}</b><small>${fmtDate(h.at)} · ${esc(h.note || '')}</small></li>`).join('')}</ol></section>
        <section class="tile span-full">
          <div class="tx-actions" style="margin-top:0">
            <a class="btn btn--line" href="#/transaksi"><i class="fa-solid fa-list" aria-hidden="true"></i> Semua Transaksi</a>
            <a class="btn btn--ink" href="#/${tx.kind}/${esc(tx.serviceId)}"><i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Pesan Lagi</a>
          </div>
        </section>
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
      const onTx = (e) => {
        if (e.detail && e.detail !== first.id) return;
        const tx = Tx.find(first.id); if (!tx) return;
        const y = window.scrollY; box.innerHTML = detailHTML(tx, false); window.scrollTo(0, y);
      };
      bus.addEventListener('tx', onTx);
      return () => bus.removeEventListener('tx', onTx);
    },
  };
};
