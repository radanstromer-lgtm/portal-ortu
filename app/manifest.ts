import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Portal Orang Tua - Rumah Belajar L 253',
    short_name: 'Portal Ortu',
    description: 'Portal Informasi Orang Tua & Pembayaran SPP Rumah Belajar L 253',
    start_url: '/',
    display: 'standalone',
    background_color: '#022c22',
    theme_color: '#047857',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
