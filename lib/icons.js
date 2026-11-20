
/* Zenvira Digital — Ikon layanan PPOB (SVG inline, duotone).
   Memakai currentColor → otomatis mengikuti warna `tone-*` dan tema terang/gelap.
   Tanpa dependensi CDN. viewBox 48×48. */
const SVC_ICONS = (() => {
  const T = 'fill="currentColor" fill-opacity=".16"'; // lapisan tint (isi)
  const F = 'fill="currentColor" stroke="none"';      // titik/isi penuh
  return {
    // ponsel dengan tanda tambah (isi pulsa)
    pulsa: `<rect x="13" y="4.5" width="22" height="39" rx="5.5" ${T}/><path d="M21 9.5h6"/><circle cx="24" cy="24" r="7.5"/><path d="M24 20.2v7.6M20.2 24h7.6"/><circle cx="24" cy="38.2" r="1.3" ${F}/>`,
    // sinyal data
    data: `<circle cx="24" cy="24" r="19" ${T} stroke="none"/><path d="M10.5 20.5c7.5-7 19.5-7 27 0"/><path d="M15.5 26c5-4.5 12-4.5 17 0"/><path d="M20.5 31.3c2.2-1.9 4.8-1.9 7 0"/><circle cx="24" cy="36" r="2" ${F}/>`,
    // token listrik: petir dalam koin
    pln: `<circle cx="24" cy="24" r="19" ${T}/><path d="M26.5 8.5 15 26.5h8.3l-1.8 13L33 21.5h-8z" fill="currentColor"/>`,
    // tagihan listrik pascabayar: steker
    listrik: `<path d="M17 5v10M31 5v10"/><rect x="11" y="15" width="26" height="13" rx="4" ${T}/><path d="M17.5 28v1.5a6.5 6.5 0 0 0 13 0V28"/><path d="M24 36v7"/>`,
    // BPJS: hati + denyut
    bpjs: `<path d="M24 41S6.5 30.3 6.5 18.8A10 10 0 0 1 24 13a10 10 0 0 1 17.5 5.8C41.5 30.3 24 41 24 41z" ${T}/><path d="M11 25h7l3-7 4.5 12 3-5H37"/>`,
    // PDAM: tetes air
    pdam: `<path d="M24 5s-13 14.5-13 24a13 13 0 0 0 26 0C37 19.5 24 5 24 5z" ${T}/><path d="M17.5 30a6.5 6.5 0 0 0 6.5 6.5"/>`,
    // internet & TV: layar dengan sinyal
    internet: `<rect x="5" y="9" width="38" height="26" rx="4.5" ${T}/><path d="M17 41h14M24 35v6"/><path d="M16 23c4.7-4.2 11.3-4.2 16 0"/><path d="M20 27.5c2.4-2 5.6-2 8 0"/><circle cx="24" cy="31" r="1.3" ${F}/>`,
    // e-wallet: dompet
    ewallet: `<rect x="5.5" y="13" width="37" height="27" rx="5" ${T}/><path d="M9.5 13l22-7a3 3 0 0 1 4 2.8V13"/><rect x="29" y="22.5" width="13.5" height="10" rx="3" ${T}/><circle cx="34.8" cy="27.5" r="1.5" ${F}/>`,
    // voucher: tiket dengan persen
    voucher: `<path d="M6 14a3 3 0 0 1 3-3h30a3 3 0 0 1 3 3v6.2a4.3 4.3 0 0 0 0 8.6V35a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-6.2a4.3 4.3 0 0 0 0-8.6z" ${T}/><path d="M31 14.5v19" stroke-dasharray="2.5 3.5"/><circle cx="15" cy="20.5" r="2.4"/><circle cx="23" cy="29.5" r="2.4"/><path d="M24 18.5 14 31.5"/>`,
  };
})();

/** SVG inline untuk layanan PPOB. Ukuran mengikuti CSS (.svc-ico). */
function svcIcon(id, cls = '') {
  const inner = SVC_ICONS[id];
  if (!inner) return '<i class="fa-solid fa-receipt" aria-hidden="true"></i>';
  return `<svg class="svc-ico ${cls}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${inner}</svg>`;
}

export { svcIcon };
