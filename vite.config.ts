import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

const repoBase = '/tesla-delivery-checklist/';

export default defineConfig({
  base: repoBase,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Tesla 納車チェックリスト',
        short_name: 'TeslaDelivery',
        description: 'Tesla Model Y L など、納車受け取り時のチェックリスト。問題項目は写真・動画つきで記録できます。',
        theme_color: '#0B0D0F',
        background_color: '#0B0D0F',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'ja',
        start_url: repoBase,
        scope: repoBase,
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        navigateFallback: `${repoBase}index.html`,
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest,woff2}'],
      },
    }),
  ],
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
});
