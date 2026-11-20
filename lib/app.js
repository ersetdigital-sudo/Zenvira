import { $ } from './util';
import { MockBackend } from './api';
import { Theme } from './ui/theme';
import { Palette } from './ui/palette';
import { Info } from './pages/help';
import { Pages } from './pages/home';
import { Router } from './router';
import './pages/catalog';
import './pages/service';
import './pages/transaksi';
import './pages/help';

let booted = false;

/* Zenvira Digital — Boot aplikasi: daftar rute & inisialisasi modul */
export function boot() {
  if (booted || typeof window === 'undefined' || window.__zenviraBooted) return;
  booted = true;
  window.__zenviraBooted = true;

  $('#year').textContent = new Date().getFullYear();

  MockBackend.settle(); // hapus bersama MockBackend saat backend sungguhan terpasang
  Theme.init();
  Palette.init();

  Router.add('/', () => Pages.home());
  Router.add('/game', (_p, q) => Pages.games(_p, q));
  Router.add('/game/:id', (p, q) => Pages.service('game', p.id, q));
  Router.add('/ppob', () => Pages.ppob());
  Router.add('/ppob/:id', (p, q) => Pages.service('ppob', p.id, q));
  Router.add('/transaksi', () => Pages.transaksi());
  Router.add('/transaksi/:id', (p, q) => Pages.transaksiDetail(p.id, q));
  Router.add('/bantuan', () => Pages.help());

  // dokumen & info (footer, halaman bantuan)
  document.addEventListener('click', (e) => {
    const i = e.target.closest('[data-info]');
    if (i) Info.open(i.dataset.info);
  });

  Router.start();
}
