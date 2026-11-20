import { GAMES, PPOB } from '../data';
import { $, esc, debounce, reduceMotion } from '../util';
import { Pages, View } from './home';

/* Zenvira Digital — Katalog: daftar game (cari, filter, urut) dan daftar layanan PPOB */
Pages.games = (_params, query) => {
  const state = { q: query.q || '', cat: query.kat && ['Semua', ...new Set(GAMES.map((g) => g.category))].includes(query.kat) ? query.kat : 'Semua', sort: 'popular' };
  const cats = ['Semua', ...new Set(GAMES.map((g) => g.category))];
  const minPrice = (g) => Math.min(...g.products.map((p) => p.price));

  const list = () => {
    const q = state.q.trim().toLowerCase();
    const out = GAMES.filter((g) => (state.cat === 'Semua' || g.category === state.cat) && (!q || [g.name, g.short, g.category, ...g.aliases].some((t) => t.toLowerCase().includes(q))));
    if (state.sort === 'price') out.sort((a, b) => minPrice(a) - minPrice(b));
    else if (state.sort === 'name') out.sort((a, b) => a.name.localeCompare(b.name));
    else out.sort((a, b) => a.rank - b.rank);
    return out;
  };

  return {
    title: 'Top Up Game', route: 'game', view: 'catalog',
    html: `
      <div class="page-head"><h1>Top Up Game</h1><p>Masukkan ID akun, pilih nominal, bayar. Cari berdasarkan nama atau filter kategori.</p></div>
      <div class="tools">
        <div class="searchbox"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
          <label class="sr-only" for="gameSearch">Cari game</label>
          <input class="input" id="gameSearch" type="search" placeholder="Cari game, mis. Mobile Legends" autocomplete="off" spellcheck="false" value="${esc(state.q)}">
          <button class="icon-btn" type="button" id="gameClear" aria-label="Hapus pencarian" ${state.q ? '' : 'hidden'}><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></div>
        <label class="sr-only" for="gameSort">Urutkan game</label>
        <select class="input" id="gameSort" style="min-width:170px"><option value="popular">Terpopuler</option><option value="price">Harga terendah</option><option value="name">Nama A–Z</option></select>
        <div class="chip-row" id="gameCats" role="group" aria-label="Filter kategori"></div>
      </div>
      <p class="sr-only" id="gameCount" role="status" aria-live="polite"></p>
      <div class="gcards" id="gameGrid">${View.skeletonCards(10)}</div>
      <div class="empty" id="gameEmpty" hidden><span class="ico"><i class="fa-regular fa-face-frown" aria-hidden="true"></i></span><h2>Game tidak ditemukan</h2><p>Coba kata kunci lain atau tampilkan semua kategori.</p><button class="btn btn--ink" type="button" id="gameReset">Reset pencarian</button></div>`,
    mount(root) {
      const grid = $('#gameGrid', root);
      const renderCats = () => { $('#gameCats', root).innerHTML = cats.map((c) => `<button class="chip" type="button" data-cat="${esc(c)}" aria-pressed="${c === state.cat}">${esc(c)}</button>`).join(''); };
      const render = () => {
        const items = list();
        grid.innerHTML = items.map(View.gcard).join('');
        grid.hidden = !items.length; $('#gameEmpty', root).hidden = items.length > 0;
        $('#gameCount', root).textContent = `${items.length} game ditemukan`;
        $('#gameClear', root).hidden = !state.q;
      };
      renderCats();
      const t = setTimeout(render, reduceMotion() ? 0 : 450);
      $('#gameSearch', root).addEventListener('input', debounce((e) => { state.q = e.target.value; render(); }, 150));
      $('#gameClear', root).addEventListener('click', () => { const i = $('#gameSearch', root); i.value = ''; state.q = ''; render(); i.focus(); });
      $('#gameSort', root).addEventListener('change', (e) => { state.sort = e.target.value; render(); });
      $('#gameCats', root).addEventListener('click', (e) => { const b = e.target.closest('[data-cat]'); if (b) { state.cat = b.dataset.cat; renderCats(); render(); } });
      $('#gameReset', root).addEventListener('click', () => { $('#gameSearch', root).value = ''; state.q = ''; state.cat = 'Semua'; renderCats(); render(); });
      return () => clearTimeout(t);
    },
  };
};

Pages.ppob = () => ({
  title: 'PPOB', route: 'ppob', view: 'catalog',
  html: `
    <div class="page-head"><h1>PPOB</h1><p>Pulsa, data, listrik, BPJS, air, internet, hingga e-wallet — satu form yang sama untuk semuanya.</p></div>
    <div class="svc-grid">${PPOB.map(View.svc).join('')}</div>
`,
});
