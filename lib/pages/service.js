import { OPERATORS, activePayments, PROMOS } from '../data';
import { svcIcon } from '../icons';
import { $, esc, idr, fmtDate, mask, reduceMotion, getService, findPayment, feeText, App } from '../util';
import { Pricing, Promos } from '../pricing';
import { Sheet } from '../ui/sheet';
import { toast } from '../ui/toast';
import { api } from '../api';
import { Tx } from '../store';
import { Pages } from './home';

/* Zenvira Digital — Halaman checkout untuk SEMUA game & PPOB (berbasis konfigurasi di data.js)
   Rute: #/game/:id  dan  #/ppob/:id   (opsional ?p=<produk>&promo=<kode>) */
Pages.service = (kind, id, query = {}) => {
  const svc = getService(kind, id);
  if (!svc || svc.kind !== kind) return Pages.notFound('Layanan tidak ditemukan.');

  const st = { values: {}, touched: {}, products: svc.products ? [...svc.products] : [], productId: null, promo: null, payId: null, bill: null };
  if (query.p && st.products.some((p) => p.id === query.p)) st.productId = query.p;

  const fieldById = (fid) => svc.fields.find((f) => f.id === fid);
  const product = () => st.products.find((p) => p.id === st.productId) || null;
  const isFirst = () => Tx.localCount() === 0;

  /* ---------- validasi ---------- */
  function validateField(f, raw) {
    const v = String(raw ?? '').trim();
    if (!v) return f.type === 'select' ? `Pilih ${f.label.toLowerCase()}.` : `${f.label} wajib diisi.`;
    const r = f.rule; if (!r) return '';
    if (r.type === 'digits') {
      if (!/^\d+$/.test(v)) return `${f.label} hanya boleh berisi angka.`;
      if (v.length < r.min || v.length > r.max) return `${f.label} harus ${r.min === r.max ? r.min : `${r.min}–${r.max}`} digit.`;
    }
    if (r.type === 'phone' && !/^08\d{8,12}$/.test(v)) return 'Nomor HP diawali 08 dan terdiri dari 10–14 digit.';
    if (r.type === 'regex' && !r.re.test(v)) return r.msg;
    if (r.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Format email belum benar.';
    return '';
  }

  /* ---------- markup ---------- */
  function fieldHTML(f) {
    const fid = `f-${f.id}`; const desc = `${fid}-hint ${fid}-err`;
    const control = f.type === 'select'
      ? `<select class="input" id="${fid}" name="${f.id}" aria-describedby="${desc}" required><option value="">Pilih ${esc(f.label.toLowerCase())}</option>${f.options.map((o) => `<option>${esc(o)}</option>`).join('')}</select>`
      : `<input class="input" id="${fid}" name="${f.id}" type="${f.type === 'email' ? 'email' : 'text'}" inputmode="${f.inputmode || 'text'}" placeholder="${esc(f.ph || '')}" maxlength="${f.maxlength || 40}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-describedby="${desc}" required>`;
    const btn = svc.inquiry && f.id === 'custId' ? '<button class="btn btn--line" type="button" data-inquiry>Cek Tagihan</button>' : '';
    return `<div class="field"><label for="${fid}">${esc(f.label)}</label>${btn ? `<div class="input-group">${control}${btn}</div>` : control}
      <p class="field__hint" id="${fid}-hint">${esc(f.hint || '')}</p><p class="field__error" id="${fid}-err" role="alert"></p></div>`;
  }
  const productHTML = (p) => `<label class="opt"><input class="opt__input" type="radio" name="product" value="${p.id}"${p.id === st.productId ? ' checked' : ''}>
    <span class="opt__card">${p.tag ? `<span class="opt__tag">${esc(p.tag)}</span>` : ''}<span class="opt__name">${esc(p.label)}</span><span class="opt__price">${idr(p.price)}</span></span></label>`;
  const productsArea = () => (svc.inquiry && !st.products.length
    ? '<p class="field__hint"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> Masukkan nomor pelanggan lalu tekan “Cek Tagihan” untuk menampilkan jumlah yang harus dibayar.</p>'
    : `<div class="opts">${st.products.map(productHTML).join('')}</div>`);

  const headIco = kind === 'game'
    ? `<span class="ico"><img src="${esc(svc.cover)}" width="64" height="64" alt=""></span>`
    : `<span class="ico tone-${svc.tone}">${svcIcon(svc.id)}</span>`;
  const layout = svc.layout ? `field-row field-row--${svc.layout === 'split' ? '2' : 'even'}` : '';

  const html = `
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#/${kind === 'game' ? 'game' : 'ppob'}"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> ${kind === 'game' ? 'Top Up Game' : 'PPOB'}</a></nav>
    <div class="svc-head">${headIco}<div><h1>${esc(svc.name)}</h1><p>${esc(svc.subtitle)}</p></div></div>
    <div class="checkout">
      <form id="orderForm" class="steps" novalidate autocomplete="off">
        <fieldset class="step"><legend><span class="step__n">1</span> ${esc(svc.stepTitle)}</legend>
          <div class="${layout}">${svc.fields.map(fieldHTML).join('')}</div>
          <div id="billBox"></div></fieldset>
        <fieldset class="step"><legend><span class="step__n">2</span> ${svc.inquiry ? 'Tagihan' : kind === 'game' ? `Pilih nominal ${esc(svc.currency)}` : 'Pilih nominal'}</legend>
          <div id="productArea">${productsArea()}</div><p class="field__error" id="err-product" role="alert"></p></fieldset>
        <fieldset class="step"><legend><span class="step__n">3</span> Kode promo</legend>
          <div class="promo-row"><label class="sr-only" for="promoInput">Kode promo</label>
            <input class="input" id="promoInput" type="text" placeholder="Masukkan kode" maxlength="16" autocomplete="off" spellcheck="false" aria-describedby="promoMsg">
            <button class="btn btn--line" type="button" data-apply-promo>Terapkan</button></div>
          <p class="promo-msg" id="promoMsg" role="status" aria-live="polite"></p>
          <div class="suggest" aria-label="Kode promo yang tersedia">${PROMOS.map((p) => `<button class="chip chip--mono" type="button" data-suggest="${p.code}" title="${esc(p.desc)}">${p.code}</button>`).join('')}</div></fieldset>
        <fieldset class="step"><legend><span class="step__n">4</span> Metode pembayaran</legend>
          <div class="pay-list">${activePayments().map((p) => `<label class="opt pay"><input class="opt__input" type="radio" name="payment" value="${p.id}"><span class="opt__card">
            <span class="pay-logo" style="--pc:${p.color}" aria-hidden="true">${esc(p.code)}</span>
            <span class="opt__name">${esc(p.name)}<small>${esc(p.desc)} · ${esc(feeText(p))}</small></span></span></label>`).join('')}</div>
          <div class="qris-box" id="qrisBox" hidden>
            <div class="qris-box__head"><span class="pay-logo" style="--pc:#14241d" aria-hidden="true">QR</span>
              <span><b>Scan QRIS untuk membayar</b><small>Buka aplikasi e-wallet atau mobile banking, lalu pindai kode berikut.</small></span></div>
            <div class="qris-box__img"><img src="/qris_barcode_only.png" width="530" height="535" alt="Kode QRIS pembayaran"></div>
            <p class="qris-box__note">Pastikan nominal di aplikasi pembayaran sama dengan total di ringkasan transaksi.</p>
          </div>
          <p class="field__error" id="err-payment" role="alert"></p></fieldset>
      </form>
      <aside class="summary" aria-label="Ringkasan transaksi">
        <h2>Ringkasan transaksi</h2>
        <dl class="kv">
          <div><dt>Tujuan</dt><dd id="sumTarget">–</dd></div>
          <div><dt>Produk</dt><dd id="sumProduct">Belum dipilih</dd></div>
          <div><dt>Harga</dt><dd id="sumSub">Rp0</dd></div>
          <div class="is-discount" id="sumDiscRow" hidden><dt>Diskon <span id="sumCode"></span></dt><dd id="sumDisc">-Rp0</dd></div>
          <div><dt>Biaya admin</dt><dd id="sumFee">—</dd></div>
          <div><dt>Pembayaran</dt><dd id="sumPay">Belum dipilih</dd></div>
        </dl>
        <div class="summary__total"><span>Total bayar</span><strong id="sumTotal">Rp0</strong></div>
        <button class="btn btn--accent btn--lg btn--block" type="submit" form="orderForm">Lanjutkan Pembayaran <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
        <p class="summary__note"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i><span>Biaya admin menyesuaikan metode pembayaran yang dipilih.</span></p>
      </aside>
    </div>
    <div class="checkout-bar"><div class="checkout-bar__total"><small>Total bayar</small><strong id="barTotal">Rp0</strong></div>
      <button class="btn btn--accent btn--lg" type="submit" form="orderForm">Lanjutkan <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button></div>`;

  /* ---------- perilaku ---------- */
  function mount(root) {
    const $r = (s) => $(s, root);

    function setFieldError(f, msg) {
      const input = $r(`#f-${f.id}`); const err = $r(`#f-${f.id}-err`); if (!input) return;
      err.textContent = msg || '';
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      input.classList.toggle('is-valid', !msg && String(input.value).trim() !== '');
    }
    function calc() {
      const p = product();
      return { p, ...Pricing.compute({ subtotal: p ? p.price : 0, promo: st.promo, kind, payId: st.payId, isFirst: isFirst() }) };
    }
    const targetText = () => svc.fields.map((f) => st.values[f.id]).filter(Boolean).map((v, i) => (i === 1 && svc.id === 'mlbb' ? `(${v})` : v)).join(' ') || '–';
    function setPromoMsg(text, tone, removable = false) {
      const el = $r('#promoMsg');
      el.className = `promo-msg is-${tone}`;
      const icon = { ok: 'fa-circle-check', warn: 'fa-circle-info', err: 'fa-circle-exclamation' }[tone];
      el.innerHTML = text ? `<i class="fa-solid ${icon}" aria-hidden="true"></i><span>${esc(text)}${removable ? ' <button type="button" data-remove-promo>Hapus</button>' : ''}</span>` : '';
    }
    function updateSummary() {
      const c = calc(); const pay = findPayment(st.payId);
      $r('#sumTarget').textContent = targetText();
      $r('#sumProduct').textContent = c.p ? c.p.label : 'Belum dipilih';
      $r('#sumSub').textContent = idr(c.subtotal);
      $r('#sumDiscRow').hidden = !c.discount;
      $r('#sumDisc').textContent = idr(-c.discount);
      $r('#sumCode').textContent = st.promo ? `(${st.promo.code})` : '';
      $r('#sumFee').textContent = pay ? idr(c.fee) : '—';
      $r('#sumPay').textContent = pay ? pay.name : 'Belum dipilih';
      $r('#qrisBox').hidden = st.payId !== 'qris';
      const total = $r('#sumTotal'); const changed = total.textContent !== idr(c.total);
      total.textContent = idr(c.total); $r('#barTotal').textContent = idr(c.total);
      if (changed && !reduceMotion()) { total.classList.add('bump'); setTimeout(() => total.classList.remove('bump'), 250); }
      if (st.promo) { const s = c.promoState; setPromoMsg(s && s.ok ? `Kode ${st.promo.code} dipakai — hemat ${idr(s.amount)}.` : s ? s.reason : '', s && s.ok ? 'ok' : 'warn', true); }
    }
    function applyPromo(raw) {
      const code = String(raw || '').trim().toUpperCase();
      if (!code) { setPromoMsg('Masukkan kode promo terlebih dahulu.', 'err'); return; }
      const promo = PROMOS.find((p) => p.code === code);
      if (!promo) { st.promo = null; setPromoMsg(`Kode “${code}” tidak ditemukan.`, 'err'); updateSummary(); return; }
      const s = Promos.evaluate(promo, { kind, subtotal: calc().subtotal, isFirst: isFirst() });
      if (!s.ok && s.hard) { st.promo = null; setPromoMsg(s.reason, 'err'); updateSummary(); return; }
      st.promo = promo; $r('#promoInput').value = code; updateSummary();
      if (s.ok) toast(`Kode ${code} berhasil dipakai.`, { type: 'success' });
    }
    function validateAll() {
      const bad = [];
      svc.fields.forEach((f) => { const msg = validateField(f, st.values[f.id]); setFieldError(f, msg); if (msg) bad.push($r(`#f-${f.id}`)); });
      if (!product()) { const m = svc.inquiry ? 'Cek tagihan terlebih dahulu.' : 'Pilih nominal terlebih dahulu.'; $r('#err-product').textContent = m; bad.push($r('#productArea input') || $r('#productArea')); }
      if (!st.payId) { $r('#err-payment').textContent = 'Pilih metode pembayaran.'; bad.push($r('.pay input')); }
      return bad;
    }
    async function runInquiry() {
      const f = fieldById('custId'); const btn = $r('[data-inquiry]');
      const msg = validateField(f, st.values.custId); setFieldError(f, msg);
      if (msg) { $r('#f-custId').focus(); return; }
      btn.classList.add('is-loading');
      try {
        const bill = await api.inquireBill(svc, st.values.custId);
        st.bill = bill; st.products = [{ id: 'bill', label: bill.label, price: bill.price, tag: 'Tagihan' }]; st.productId = 'bill';
        $r('#billBox').innerHTML = `<div class="bill" role="status"><b><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Tagihan ditemukan</b>
          <dl><div><dt>Nama pelanggan</dt><dd>${esc(bill.name)}</dd></div><div><dt>Periode</dt><dd>${esc(bill.period)}</dd></div><div><dt>Tagihan</dt><dd>${idr(bill.amount)}</dd></div><div><dt>Biaya layanan</dt><dd>${idr(bill.admin)}</dd></div></dl></div>`;
        $r('#productArea').innerHTML = productsArea(); $r('#err-product').textContent = ''; updateSummary();
      } finally { btn.classList.remove('is-loading'); }
    }
    function clearBill() { if (!svc.inquiry || !st.bill) return; st.bill = null; st.products = []; st.productId = null; $r('#billBox').innerHTML = ''; $r('#productArea').innerHTML = productsArea(); updateSummary(); }

    function payload() {
      const c = calc(); const pay = findPayment(st.payId);
      return {
        kind, serviceId: svc.id, serviceName: svc.name, productLabel: c.p.label,
        fields: svc.fields.map((f) => ({ label: f.label, value: st.values[f.id], secret: f.type !== 'select' })),
        subtotal: c.subtotal, discount: c.discount, promoCode: c.discount && st.promo ? st.promo.code : null, fee: c.fee, total: c.total,
        paymentId: pay.id, paymentName: pay.name,
      };
    }
    function openConfirm() {
      const p = payload();
      const s = Sheet.open({
        title: 'Konfirmasi pesanan',
        body: `<div class="notice"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i><span>Periksa kembali data akun/tujuan. Pesanan yang sudah diproses tidak dapat diubah.</span></div>${txKV(p)}`,
        foot: '<button class="btn btn--line" type="button" data-sheet-close>Ubah pesanan</button><button class="btn btn--ink" type="button" data-go><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Konfirmasi Pesanan</button>',
      });
      $('[data-go]', s.foot).addEventListener('click', async (e) => {
        const btn = e.currentTarget; btn.classList.add('is-loading'); s.locked = true;
        try {
          const tx = await api.createOrder(p);
          s.locked = false; s.close();
          toast('Pesanan dibuat. Lanjutkan ke pembayaran.', { type: 'success' });
          location.hash = `#/transaksi/${tx.id}?baru=1`;
        } catch {
          s.locked = false; btn.classList.remove('is-loading');
          toast('Pesanan gagal dibuat. Coba lagi.', { type: 'error' });
        }
      });
    }

    /* events */
    root.addEventListener('input', (e) => {
      const t = e.target;
      if (t.id === 'promoInput') { if (!st.promo) setPromoMsg('', 'ok'); return; }
      const f = t.name && fieldById(t.name); if (!f) return;
      if (f.type !== 'select' && f.rule && (f.rule.type === 'digits' || f.rule.type === 'phone')) { const c = t.value.replace(/\D/g, ''); if (c !== t.value) t.value = c; }
      st.values[f.id] = t.value;
      if (st.touched[f.id]) setFieldError(f, validateField(f, t.value));
      if (f.detect) { const op = OPERATORS.find(([, re]) => re.test(t.value)); $r(`#f-${f.id}-hint`).innerHTML = op ? `<span class="op-chip"><i class="fa-solid fa-signal" aria-hidden="true"></i> ${op[0]}</span>` : esc(f.hint); }
      if (f.id === 'custId') clearBill();
      updateSummary();
    });
    root.addEventListener('change', (e) => {
      const t = e.target;
      if (t.name === 'product') { st.productId = t.value; $r('#err-product').textContent = ''; updateSummary(); }
      else if (t.name === 'payment') { st.payId = t.value; $r('#err-payment').textContent = ''; updateSummary(); }
      else if (t.tagName === 'SELECT' && t.name) { const f = fieldById(t.name); if (f) { st.values[f.id] = t.value; setFieldError(f, validateField(f, t.value)); updateSummary(); } }
    });
    root.addEventListener('focusout', (e) => { const t = e.target; const f = t.name && fieldById(t.name); if (f && t.tagName !== 'SELECT') { st.touched[f.id] = true; setFieldError(f, validateField(f, t.value)); } });
    root.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.id === 'promoInput') { e.preventDefault(); applyPromo(e.target.value); } });
    root.addEventListener('click', (e) => {
      if (e.target.closest('[data-apply-promo]')) applyPromo($r('#promoInput').value);
      const sug = e.target.closest('[data-suggest]'); if (sug) applyPromo(sug.dataset.suggest);
      if (e.target.closest('[data-remove-promo]')) { st.promo = null; $r('#promoInput').value = ''; setPromoMsg('Kode promo dihapus.', 'warn'); updateSummary(); }
      if (e.target.closest('[data-inquiry]')) runInquiry();
    });
    root.addEventListener('submit', (e) => {
      if (e.target.id !== 'orderForm') return;
      e.preventDefault();
      const bad = validateAll();
      if (bad.length) {
        toast('Periksa kembali data pesananmu.', { type: 'error' });
        const el = bad[0]; if (el) { el.scrollIntoView({ block: 'center', behavior: reduceMotion() ? 'auto' : 'smooth' }); if (el.focus) el.focus({ preventScroll: true }); }
        return;
      }
      openConfirm();
    });

    updateSummary();
    const code = query.promo || App.pendingPromo; App.pendingPromo = null;
    if (code) applyPromo(code);
    if (st.productId && !svc.inquiry) toast(`${product().label} dipilih. Lengkapi data untuk melanjutkan.`, { type: 'info', duration: 2800 });
  }

  return { title: svc.name, route: kind, view: 'checkout', html, mount };
};

/* Daftar rincian pesanan (dipakai konfirmasi & detail transaksi) */
function txKV(p, { masked = false, date = false } = {}) {
  return `<dl class="kv">
    <div><dt>Layanan</dt><dd>${esc(p.serviceName)}</dd></div>
    ${p.fields.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(masked && f.secret ? mask(f.value) : f.value)}</dd></div>`).join('')}
    <div><dt>Produk</dt><dd>${esc(p.productLabel)}</dd></div>
    <div><dt>Metode</dt><dd>${esc(p.paymentName)}</dd></div>
    ${date ? `<div><dt>Dibuat</dt><dd>${fmtDate(p.createdAt)}</dd></div>` : ''}
    <div><dt>Harga</dt><dd>${idr(p.subtotal)}</dd></div>
    ${p.discount ? `<div class="is-discount"><dt>Diskon (${esc(p.promoCode)})</dt><dd>${idr(-p.discount)}</dd></div>` : ''}
    <div><dt>Biaya admin</dt><dd>${idr(p.fee)}</dd></div>
    <div class="is-total"><dt>Total</dt><dd>${idr(p.total)}</dd></div></dl>`;
}

export { txKV };
