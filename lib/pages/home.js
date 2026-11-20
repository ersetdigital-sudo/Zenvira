import { BEST, DEALS, GAMES, PPOB, PROMOS, PROMO_SLIDES, QUICK, STATUS } from '../data';
import { svcIcon } from '../icons';
import { $, $$, esc, idr, reduceMotion, debounce, copyText, App, getService, getProduct } from '../util';
import { Pricing } from '../pricing';
import { Palette } from '../ui/palette';
import { toast } from '../ui/toast';

/* Zenvira Digital — Beranda: grid "bento" (hero, promo, akses cepat, game, transaksi terakhir, PPOB, terlaris, penawaran) */
const Pages = {};

/* ---------- potongan tampilan yang dipakai ulang ---------- */
const View = {
  thumb(kind, s) {
    return kind === 'game'
      ? `<span class="prow__thumb"><img src="${esc(s.cover)}" width="44" height="44" alt="" loading="lazy"></span>`
      : `<span class="prow__thumb ico tone-${s.tone}">${svcIcon(s.id)}</span>`;
  },
  gcard(g) {
    const min = Math.min(...g.products.map((p) => p.price));
    return `<a class="gcard" href="#/game/${g.id}" aria-label="Top up ${esc(g.name)}, mulai ${idr(min)}">
      <span class="gcard__cover"><img src="${esc(g.cover)}" width="400" height="400" alt="" loading="lazy">${g.popular ? '<span class="badge badge--accent"><i class="fa-solid fa-fire" aria-hidden="true"></i> Populer</span>' : ''}</span>
      <span class="gcard__body"><b>${esc(g.name)}</b><small>${esc(g.category)} · mulai <strong>${idr(min)}</strong></small></span></a>`;
  },
  svc(s) {
    return `<a class="svc tone-${s.tone}" href="#/ppob/${s.id}"><span class="ico">${svcIcon(s.id)}</span>
      <div><h3>${esc(s.name)}</h3><p>${esc(s.desc)}</p></div><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>`;
  },
  txRow(t) {
    const s = STATUS[t.status]; const svc = getService(t.kind, t.serviceId);
    const ico = svc && t.kind === 'game' ? `<span class="ico"><img src="${esc(svc.cover)}" width="44" height="44" alt="" loading="lazy"></span>` : `<span class="ico tone-${svc?.tone || 'blue'}">${svc ? svcIcon(svc.id) : '<i class="fa-solid fa-receipt" aria-hidden="true"></i>'}</span>`;
    return `<a class="tx-row" href="#/transaksi/${esc(t.id)}">${ico}
      <span><b>${esc(t.productLabel)}</b><small>${esc(t.serviceName)}</small><small class="mono">${esc(t.id)}</small></span>
      <span class="tx-row__end"><strong>${idr(t.total)}</strong><span class="status status--${t.status}"><i class="fa-solid ${s.icon}" aria-hidden="true"></i> ${s.label}</span></span></a>`;
  },
  skeletonCards(n) {
    return Array.from({ length: n }, () => '<div class="sk-card" aria-hidden="true"><div class="skeleton"></div><div class="skeleton sk-line"></div><div class="skeleton sk-line w60"></div></div>').join('');
  },
};

/* ---------- carousel promo ---------- */
function mountPromo(root) {
  const track = $('#promoTrack', root); const dots = $('#promoDots', root);
  const slides = $$('.promo__slide', track);
  let active = 0; let hover = false; let paused = false; let timer = null;
  const left = (s) => s.offsetLeft - track.offsetLeft;
  const go = (i) => { i = (i + slides.length) % slides.length; track.scrollTo({ left: left(slides[i]), behavior: reduceMotion() ? 'auto' : 'smooth' }); };
  const update = () => {
    let idx = 0; let best = Infinity;
    slides.forEach((s, i) => { const d = Math.abs(left(s) - track.scrollLeft); if (d < best) { best = d; idx = i; } });
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 2) idx = slides.length - 1;
    active = idx;
    $$('.dot', dots).forEach((d, i) => (i === idx ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')));
  };
  const start = () => { clearInterval(timer); if (reduceMotion() || paused) return; timer = setInterval(() => { if (!hover && !document.hidden) go(active + 1); }, 5500); };
  dots.innerHTML = slides.map((_, i) => `<button class="dot" type="button" aria-label="Ke promo ${i + 1}"></button>`).join('');
  dots.addEventListener('click', (e) => { const d = e.target.closest('.dot'); if (d) go($$('.dot', dots).indexOf(d)); });
  track.addEventListener('scroll', debounce(update, 40), { passive: true });
  root.addEventListener('mouseenter', () => (hover = true)); root.addEventListener('mouseleave', () => (hover = false));
  root.addEventListener('focusin', () => (hover = true)); root.addEventListener('focusout', () => (hover = false));
  $('#promoPause', root).addEventListener('click', (e) => {
    paused = !paused; const b = e.currentTarget;
    b.setAttribute('aria-label', paused ? 'Putar promo otomatis' : 'Jeda promo otomatis');
    $('i', b).className = `fa-solid ${paused ? 'fa-play' : 'fa-pause'}`; start();
  });
  update(); start();
  return () => clearInterval(timer);
}

/* ---------- rail (scroll horizontal + tombol) ---------- */
function mountRails(root) {
  const offs = [];
  $$('[data-rail]', root).forEach((wrap) => {
    const track = $('.rail', wrap); const prev = $('[data-rail-prev]', wrap); const next = $('[data-rail-next]', wrap);
    const sync = () => { prev.disabled = track.scrollLeft <= 2; next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2; };
    prev.addEventListener('click', () => track.scrollBy({ left: -track.clientWidth * 0.8, behavior: reduceMotion() ? 'auto' : 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: track.clientWidth * 0.8, behavior: reduceMotion() ? 'auto' : 'smooth' }));
    track.addEventListener('scroll', debounce(sync, 40), { passive: true });
    const onResize = debounce(sync, 120);
    window.addEventListener('resize', onResize);
    offs.push(() => window.removeEventListener('resize', onResize));
    sync();
  });
  return () => offs.forEach((f) => f());
}

async function usePromo(code) {
  App.pendingPromo = code;
  const copied = await copyText(code);
  toast(`Kode ${code} ${copied ? 'disalin dan ' : ''}disimpan — otomatis terpasang saat checkout.`, { type: 'success', icon: 'fa-ticket' });
  location.hash = '#/game';
}

/* ---------- pencarian di hero (combobox dengan hasil langsung) ---------- */
function mountHeroSearch(root) {
  const input = $('#heroSearch', root); const list = $('#heroList', root);
  const HINTS = ['Cari Pulsa semua operator…', 'Cari Token PLN 100rb…', 'Cari Paket Data…', 'Cari tagihan BPJS…', 'Cari Mobile Legends…'];
  let items = []; let sel = 0; let hint = 0; let timer = null;

  const isOpen = () => !list.hidden;
  const show = () => { list.hidden = false; input.setAttribute('aria-expanded', 'true'); };
  const hide = () => { list.hidden = true; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); };
  const go = (it) => { if (!it) return; hide(); input.blur(); if (it.href) location.hash = it.href; };

  function render() {
    const q = input.value.trim();
    if (!items.length) { list.innerHTML = `<div class="palette__empty">Tidak ada hasil untuk “${esc(q)}”.</div>`; input.removeAttribute('aria-activedescendant'); return; }
    let html = `<div class="palette__group" role="presentation">${q ? 'Hasil' : 'Populer'}</div>`;
    items.forEach((it, i) => {
      html += `<button class="palette__item" type="button" role="option" tabindex="-1" id="hs-${i}" data-i="${i}" aria-selected="${i === sel}">${Palette.iconHTML(it)}<span><b>${esc(it.title)}</b><small>${esc(it.sub || '')}</small></span></button>`;
    });
    list.innerHTML = html;
    input.setAttribute('aria-activedescendant', `hs-${sel}`);
  }
  function update() { items = Palette.search(input.value, { groups: ['PPOB', 'Game'], limit: 7 }); sel = 0; render(); show(); }
  function select(n) {
    if (!items.length) return;
    sel = (n + items.length) % items.length;
    $$('.palette__item', list).forEach((b) => b.setAttribute('aria-selected', String(Number(b.dataset.i) === sel)));
    input.setAttribute('aria-activedescendant', `hs-${sel}`);
    $(`#hs-${sel}`, list)?.scrollIntoView({ block: 'nearest' });
  }

  input.addEventListener('focus', update);
  input.addEventListener('click', () => { if (!isOpen()) update(); });
  input.addEventListener('input', update);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (!isOpen()) update(); else select(sel + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); select(sel - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); go(items[sel]); }
    else if (e.key === 'Escape') { if (isOpen()) { e.stopPropagation(); hide(); } }
  });
  list.addEventListener('mousedown', (e) => e.preventDefault()); // jaga fokus input saat klik item
  list.addEventListener('click', (e) => { const b = e.target.closest('.palette__item'); if (b) go(items[Number(b.dataset.i)]); });
  list.addEventListener('mousemove', (e) => { const b = e.target.closest('.palette__item'); if (b && Number(b.dataset.i) !== sel) select(Number(b.dataset.i)); });
  const onDoc = (e) => { if (!e.target.closest('.hero-search')) hide(); };
  document.addEventListener('click', onDoc);

  // teks petunjuk berganti-ganti (dimatikan jika reduced-motion / sedang dipakai)
  if (!reduceMotion()) {
    timer = setInterval(() => {
      if (document.activeElement === input || input.value) return;
      hint = (hint + 1) % HINTS.length; input.placeholder = HINTS[hint];
    }, 2600);
  }
  return () => { clearInterval(timer); document.removeEventListener('click', onDoc); };
}

/* ---------- halaman ---------- */
Pages.home = () => {
  const promos = PROMO_SLIDES.map((s, i) => `
    <article class="promo__slide promo__slide--${i + 1}" role="group" aria-roledescription="slide" aria-label="${i + 1} dari ${PROMO_SLIDES.length}">
      <div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>
      <div class="promo__foot"><span class="promo__code">${esc(s.code)}</span><button class="btn btn--sm" type="button" data-use-promo="${esc(s.code)}"><i class="fa-solid fa-copy" aria-hidden="true"></i> Pakai Kode</button></div>
    </article>`).join('');
  const quick = QUICK.map(([kind, id]) => {
    const s = getService(kind, id);
    const href = kind === 'game' ? `#/game/${id}` : `#/ppob/${id}`;
    const ico = kind === 'game' ? `<span class="ico"><img src="${esc(s.cover)}" width="54" height="54" alt="" loading="lazy"></span>` : `<span class="ico tone-${s.tone}">${svcIcon(s.id)}</span>`;
    return `<li><a class="quick__item" href="${href}">${ico}<span>${esc(s.short)}</span></a></li>`;
  }).join('');
  const rows = (list, withPromo) => list.map(([kind, sid, pid, code]) => {
    const s = getService(kind, sid); const p = getProduct(kind, sid, pid);
    let price = `<span class="prow__price">${idr(p.price)}</span>`;
    if (withPromo) {
      const c = Pricing.compute({ subtotal: p.price, promo: PROMOS.find((x) => x.code === code), kind, payId: null, isFirst: true });
      price = `<span class="prow__price"><s>${idr(p.price)}</s>${idr(p.price - c.discount)}<em>Kode ${esc(code)}</em></span>`;
    }
    const q = `?p=${pid}${withPromo ? `&promo=${code}` : ''}`;
    return `<a class="prow" href="#/${kind}/${sid}${q}">${View.thumb(kind, s)}<span><b>${esc(s.short)}</b><small>${esc(p.label)}</small></span>${price}</a>`;
  }).join('');
  const topGames = GAMES.filter((g) => g.popular).sort((a, b) => a.rank - b.rank).slice(0, 7);

  // pintasan di bawah kolom cari hero
  const heroChips = [['ppob', 'pulsa'], ['ppob', 'data'], ['ppob', 'pln'], ['ppob', 'ewallet'], ['game', 'mlbb']].map(([kind, id]) => {
    const s = getService(kind, id);
    const lead = kind === 'game' ? `<img src="${esc(s.cover)}" width="28" height="28" alt="">` : `<span class="ico-s tone-${s.tone}">${svcIcon(s.id)}</span>`;
    return `<a class="hero-chip" href="#/${kind}/${id}">${lead}${esc(s.short)}</a>`;
  }).join('');
  // "poster wall": daftar diduplikasi agar animasi geser -50% terlihat mulus
  const rep3 = (arr) => [...arr, ...arr, ...arr];
  const wallServices = rep3(PPOB).map((p) => `<span class="wall__tile wall__tile--svc tone-${p.tone}">${svcIcon(p.id)}<b>${esc(p.short)}</b></span>`).join('');
  const wallGames = rep3([...GAMES].reverse()).map((g) => `<span class="wall__tile"><img src="${esc(g.cover)}" width="150" height="150" alt=""></span>`).join('');

  return {
    title: 'Beranda', route: 'home', view: 'home',
    html: `<div class="bento">
      <section class="hero span-12" aria-labelledby="hero-title">
        <div class="hero__copy">
          <span class="eyebrow"><i class="fa-solid fa-bolt" aria-hidden="true"></i> PPOB &amp; Top Up Game</span>
          <h1 class="hero__title" id="hero-title">Semua Kebutuhan Digital, <span class="hl">Satu Tempat.</span></h1>
          <p class="hero__sub">Top up game, bayar tagihan, dan beli produk digital dengan mudah, cepat, dan praktis.</p>
          <div class="hero-search" role="search">
            <i class="fa-solid fa-magnifying-glass lead" aria-hidden="true"></i>
            <input class="hero-search__input" id="heroSearch" type="text" role="combobox" aria-expanded="false" aria-controls="heroList" aria-autocomplete="list" placeholder="Cari Pulsa semua operator…" autocomplete="off" spellcheck="false" aria-label="Cari game atau layanan">
            <div class="hero-search__list" id="heroList" role="listbox" aria-label="Hasil pencarian" hidden></div>
          </div>
          <div class="hero__chips" aria-label="Pintasan populer">${heroChips}</div>
        </div>
        <div class="wall" aria-hidden="true"><div class="wall__stage">
          <div class="wall__row">${wallServices}</div>
          <div class="wall__row wall__row--b">${wallGames}</div>
        </div></div>
      </section>

      <section class="tile span-12" aria-label="Akses cepat"><div class="tile__head"><h2>Akses cepat</h2></div><ul class="quick">${quick}</ul></section>

      <section class="tile span-12" aria-labelledby="home-ppob">
        <div class="tile__head"><h2 id="home-ppob">Layanan PPOB</h2><a class="tile__link" href="#/ppob">Semua layanan</a></div>
        <div class="svc-grid">${PPOB.map(View.svc).join('')}</div>
      </section>

      <section class="tile tile--promo span-12" aria-label="Promo spesial">
        <div class="tile__head"><h2>Promo spesial</h2>
          <button class="icon-btn" type="button" id="promoPause" aria-label="Jeda promo otomatis" style="width:38px;height:38px"><i class="fa-solid fa-pause" aria-hidden="true"></i></button></div>
        <div class="promo" role="region" aria-roledescription="carousel" aria-label="Promo spesial">
          <div class="promo__track" id="promoTrack" tabindex="0">${promos}</div>
          <div class="promo__bar"><div class="dots" id="promoDots"></div></div>
        </div>
      </section>

      <section class="tile span-12" aria-labelledby="home-games" data-rail>
        <div class="tile__head"><h2 id="home-games">Top up game populer</h2>
          <div class="rail-ctrl"><button type="button" data-rail-prev aria-label="Geser ke kiri"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button><button type="button" data-rail-next aria-label="Geser ke kanan"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button></div></div>
        <div class="rail" tabindex="0" aria-label="Daftar game populer">${topGames.map(View.gcard).join('')}</div>
        <a class="tile__link" href="#/game">Lihat semua game <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
      </section>

      <section class="tile span-7" aria-labelledby="home-best"><div class="tile__head"><h2 id="home-best">Produk terlaris</h2></div>${rows(BEST, false)}</section>
      <section class="tile span-5" aria-labelledby="home-deals"><div class="tile__head"><h2 id="home-deals">Penawaran terbaru</h2><span class="badge badge--accent">Baru</span></div>${rows(DEALS, true)}</section>
    </div>`,
    mount(root) {
      const stopPromo = mountPromo(root); const stopRails = mountRails(root); const stopHero = mountHeroSearch(root);
      root.addEventListener('click', (e) => { const b = e.target.closest('[data-use-promo]'); if (b) usePromo(b.dataset.usePromo); });
      return () => { stopPromo(); stopRails(); stopHero(); };
    },
  };
};

export { Pages, View };
