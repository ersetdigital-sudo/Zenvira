import './globals.css';

export const metadata = {
  title: 'Zenvira Digital — PPOB & Top Up Game',
  description: 'Bayar pulsa, paket data, token PLN, tagihan, e-wallet, dan top up game favoritmu dalam satu tempat. Pembayaran lewat QRIS, e-wallet, virtual account, dan transfer bank.',
  openGraph: {
    type: 'website',
    siteName: 'Zenvira Digital',
    title: 'Zenvira Digital — PPOB & Top Up Game',
    description: 'Semua kebutuhan digital, satu tempat. Pulsa, tagihan, token listrik, e-wallet, dan top up game.',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const THEME_INIT = `(function () {
  try {
    var pref = localStorage.getItem('zenvira.theme') || 'system';
    var dark = pref === 'dark' || (pref === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  } catch (e) { document.documentElement.setAttribute('data-theme', 'light'); }
})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#f5f5f1" id="metaTheme" />
        <link
          rel="icon"
          href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByb2xlPSJpbWciIGFyaWEtbGFiZWw9IlplbnZpcmEgRGlnaXRhbCI+CiAgPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMTQiIGZpbGw9IiMxMjEyMTIiLz4KICA8cmVjdCB4PSIuNzUiIHk9Ii43NSIgd2lkdGg9IjQ2LjUiIGhlaWdodD0iNDYuNSIgcng9IjEzLjI1IiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS1vcGFjaXR5PSIuMTYiIHN0cm9rZS13aWR0aD0iMS41Ii8+CiAgPHBhdGggZD0iTTE0LjUgMTUuNWgxNyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjQuNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHBhdGggZD0iTTMxLjUgMTUuNSAxNiAzMi41IiBmaWxsPSJub25lIiBzdHJva2U9IiNGRjVCMkUiIHN0cm9rZS13aWR0aD0iNC42IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICA8cGF0aCBkPSJNMTUgMzIuNWgxNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjQuNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPGNpcmNsZSBjeD0iMzYuNSIgY3k9IjMyLjUiIHI9IjIuNyIgZmlsbD0iI0ZGNUIyRSIvPgo8L3N2Zz4K"
          type="image/svg+xml"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap"
        />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body data-view="home" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
