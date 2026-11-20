import { idr, findPayment } from './util';

/* Zenvira Digital — Perhitungan harga, diskon & biaya admin
   Diekstrak dari V1 (logika sudah teruji). Dimuat sebagai <script> klasik: scope top-level dipakai bersama. */
// Kebijakan pembulatan diskon (saat ini tanpa pembulatan).
function roundDiscount(amount) {
  return amount;
}

const Promos = {
  evaluate(promo, ctx) {
    if (promo.scope !== 'all' && promo.scope !== ctx.kind) {
      return { ok: false, hard: true, reason: `Kode ${promo.code} hanya berlaku untuk ${promo.scope === 'game' ? 'Top Up Game' : 'layanan PPOB'}.` };
    }
    if (promo.firstOnly && !ctx.isFirst) return { ok: false, hard: true, reason: `Kode ${promo.code} hanya berlaku untuk transaksi pertama.` };
    if (ctx.subtotal < promo.min) return { ok: false, hard: false, reason: `Minimal belanja ${idr(promo.min)} untuk memakai kode ${promo.code}.` };
    let amount = promo.type === 'percent' ? Math.floor((ctx.subtotal * promo.value) / 100) : promo.value;
    if (promo.max) amount = Math.min(amount, promo.max);
    amount = roundDiscount(amount);
    return { ok: true, amount: Math.max(0, Math.min(amount, ctx.subtotal)) };
  },
};

const Pricing = {
  fee(pay, base) {
    if (!pay || base <= 0) return 0;
    return pay.fee.type === 'percent' ? Math.ceil(+((base * pay.fee.value) / 100).toFixed(4)) : pay.fee.value;
  },
  compute({ subtotal, promo, kind, payId, isFirst }) {
    const state = promo ? Promos.evaluate(promo, { kind, subtotal, isFirst }) : null;
    const discount = state && state.ok ? state.amount : 0;
    const fee = Pricing.fee(findPayment(payId), subtotal - discount);
    return { subtotal, discount, fee, total: Math.max(0, subtotal - discount + fee), promoState: state };
  },
};

export { Promos, Pricing };
