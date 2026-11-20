import { FAQS, LEGAL } from '../data';
import { esc } from '../util';
import { Sheet } from '../ui/sheet';
import { Pages } from './home';

/* Zenvira Digital — Bantuan (FAQ, kontak, dokumen) + dialog dokumen & halaman 404 */
const Info = {
  /* key: 'terms' | 'privacy' | 'contact' (isi di LEGAL, data.js) */
  open(key) {
    const d = LEGAL[key]; if (!d) return;
    Sheet.open({
      title: d.title,
      body: `<div class="prose">${d.body.map(([h, t]) => `<h3>${esc(h)}</h3><p>${esc(t)}</p>`).join('')}</div>`,
    });
  },
};

Pages.help = () => ({
  title: 'Bantuan', route: 'bantuan', view: 'page',
  html: `
    <div class="page-head"><h1>Bantuan</h1><p>Jawaban untuk pertanyaan yang sering diajukan, serta informasi kontak dan dokumen.</p></div>
    <div class="help-grid">
      <div>
        <h2 style="font-size:1.1rem;margin-bottom:12px">Pertanyaan yang sering diajukan</h2>
        <div class="faq">${FAQS.map(([q, a]) => `<details><summary>${esc(q)}</summary><div>${esc(a)}</div></details>`).join('')}</div>
      </div>
      <aside>
        <div class="contact">
          <h2>Butuh bantuan lebih lanjut?</h2>
          <p>Tim kami siap membantu. Sertakan nomor invoice agar pesananmu lebih cepat kami periksa.</p>
          <button class="btn" type="button" data-info="contact"><i class="fa-solid fa-address-book" aria-hidden="true"></i> Hubungi Kami</button>
        </div>
        <div class="legal-links">
          <button type="button" data-info="terms"><span>Syarat &amp; Ketentuan</span><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>
          <button type="button" data-info="privacy"><span>Kebijakan Privasi</span><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>
        </div>
      </aside>
    </div>`,
});

Pages.notFound = (msg = 'Halaman tidak ditemukan.') => ({
  title: 'Tidak ditemukan', route: '', view: 'page',
  html: `<div class="empty"><span class="ico"><i class="fa-solid fa-compass" aria-hidden="true"></i></span><h1 style="font-size:1.6rem">${esc(msg)}</h1><p>Alamat yang kamu buka tidak tersedia. Kembali ke beranda atau cari lewat pencarian cepat.</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><a class="btn btn--ink" href="#/">Ke Beranda</a><button class="btn btn--line" type="button" data-palette>Cari…</button></div></div>`,
});

export { Info };
