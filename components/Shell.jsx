'use client';

import { useEffect } from 'react';
import { boot } from '@/lib/app';

const LOGO = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByb2xlPSJpbWciIGFyaWEtbGFiZWw9IlplbnZpcmEgRGlnaXRhbCI+CiAgPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMTQiIGZpbGw9IiMxMjEyMTIiLz4KICA8cmVjdCB4PSIuNzUiIHk9Ii43NSIgd2lkdGg9IjQ2LjUiIGhlaWdodD0iNDYuNSIgcng9IjEzLjI1IiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS1vcGFjaXR5PSIuMTYiIHN0cm9rZS13aWR0aD0iMS41Ii8+CiAgPHBhdGggZD0iTTE0LjUgMTUuNWgxNyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjQuNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHBhdGggZD0iTTMxLjUgMTUuNSAxNiAzMi41IiBmaWxsPSJub25lIiBzdHJva2U9IiNGRjVCMkUiIHN0cm9rZS13aWR0aD0iNC42IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8cGF0aCBkPSJNMTUgMzIuNWgxNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjQuNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPGNpcmNsZSBjeD0iMzYuNSIgY3k9IjMyLjUiIHI9IjIuNyIgZmlsbD0iI0ZGNUIyRSIvPgo8L3N2Zz4K';

export default function Shell() {
  useEffect(() => {
    boot();
  }, []);

  return (
    <>
      <a className="skip-link" href="#view">Lewati ke konten utama</a>

      <div className="app">
        <header className="topbar">
          <div className="topbar__inner">
            <a className="brand" href="#/" aria-label="Zenvira Digital — Beranda">
              <img src={LOGO} width="36" height="36" alt="" />
              <span className="brand__name">Zenvira<span className="brand__sub">Digital</span></span>
            </a>

            <nav className="topnav" aria-label="Menu utama">
              <a className="topnav__link" href="#/" data-route="home">Beranda</a>
              <a className="topnav__link" href="#/ppob" data-route="ppob">PPOB</a>
              <a className="topnav__link" href="#/game" data-route="game">Top Up Game</a>
              <a className="topnav__link" href="#/transaksi" data-route="transaksi">Transaksi</a>
              <a className="topnav__link" href="#/bantuan" data-route="bantuan">Bantuan</a>
            </nav>

            <div className="topbar__right">
              <button className="search-trigger" type="button" data-palette aria-label="Cari game, layanan, atau invoice">
                <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                <span>Cari layanan…</span>
                <kbd>Ctrl K</kbd>
              </button>

              <div className="topbar__actions">
                <button className="icon-btn" type="button" data-theme-toggle aria-label="Ganti tema"><i className="fa-solid fa-circle-half-stroke" aria-hidden="true"></i></button>
              </div>
            </div>
          </div>
        </header>

        <main className="view" id="view" tabIndex={-1}></main>

        <footer className="foot">
          <div className="foot__inner">
            <div className="foot__top">
              <div className="foot__brand">
                <a className="brand" href="#/" aria-label="Zenvira Digital — Beranda">
                  <img src={LOGO} width="36" height="36" alt="" />
                  <span className="brand__name">Zenvira<span className="brand__sub">Digital</span></span>
                </a>
                <p>Pulsa, paket data, token listrik, tagihan, e-wallet, dan top up game favoritmu — semua ada di satu tempat.</p>
              </div>
              <nav aria-label="Layanan">
                <h2 className="foot__h">Layanan</h2>
                <ul>
                  <li><a href="#/ppob/pulsa">Pulsa</a></li>
                  <li><a href="#/ppob/data">Paket Data</a></li>
                  <li><a href="#/ppob/pln">Token PLN</a></li>
                  <li><a href="#/ppob/ewallet">Saldo E-Wallet</a></li>
                  <li><a href="#/game">Top Up Game</a></li>
                </ul>
              </nav>
              <nav aria-label="Bantuan">
                <h2 className="foot__h">Bantuan</h2>
                <ul>
                  <li><a href="#/transaksi">Cek Transaksi</a></li>
                  <li><a href="#/bantuan">Pertanyaan Umum</a></li>
                  <li><button type="button" data-info="contact">Hubungi Kami</button></li>
                </ul>
              </nav>
              <nav aria-label="Informasi">
                <h2 className="foot__h">Informasi</h2>
                <ul>
                  <li><button type="button" data-info="terms">Syarat &amp; Ketentuan</button></li>
                  <li><button type="button" data-info="privacy">Kebijakan Privasi</button></li>
                </ul>
              </nav>
            </div>
            <div className="foot__bottom">
              <p>© <span id="year">2026</span> Zenvira Digital. Seluruh hak dilindungi.</p>
              <p className="foot__pay">Pembayaran: QRIS · DANA · OVO · GoPay · ShopeePay · Virtual Account · Transfer Bank</p>
            </div>
          </div>
        </footer>

        <nav className="tabbar" aria-label="Menu utama">
          <a className="tab" href="#/" data-route="home"><i className="fa-solid fa-house" aria-hidden="true"></i><span>Beranda</span></a>
          <a className="tab" href="#/ppob" data-route="ppob"><i className="fa-solid fa-receipt" aria-hidden="true"></i><span>PPOB</span></a>
          <a className="tab" href="#/game" data-route="game"><i className="fa-solid fa-gamepad" aria-hidden="true"></i><span>Game</span></a>
          <a className="tab" href="#/transaksi" data-route="transaksi"><i className="fa-solid fa-clock-rotate-left" aria-hidden="true"></i><span>Transaksi</span></a>
          <a className="tab" href="#/bantuan" data-route="bantuan"><i className="fa-solid fa-circle-question" aria-hidden="true"></i><span>Bantuan</span></a>
        </nav>
      </div>

      <div id="sheets"></div>
      <div className="toasts" id="toasts" role="region" aria-label="Notifikasi" aria-live="polite"></div>
      <noscript><p style={{ padding: '16px' }}>Aktifkan JavaScript untuk menggunakan situs ini.</p></noscript>
    </>
  );
}
