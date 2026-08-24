import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  optimizeDeps: {
    exclude: ['pdfjs-dist'],
  },

  define: {
    global: 'globalThis',
  },

  server: {
    port: 5173,

    proxy: {
      // ── Proxy all /api/v1/* calls to the real backend ──────────────────────
      '/api/v1': {
        target: 'https://dev-int.ismart.org',
        changeOrigin: true,
        secure: false,
        headers: {
          'origin':  'https://dev-int.ismart.org',
          'referer': 'https://dev-int.ismart.org/',
        },
      },
      // ── Proxy file storage routes ──────────────────────────────────────────
      '/smarterp-accounts': {
        target: 'https://dev-int.ismart.org',
        changeOrigin: true,
        secure: false,
        headers: {
          'origin':  'https://dev-int.ismart.org',
          'referer': 'https://dev-int.ismart.org/',
        },
      },
      '/uploads': {
        target: 'https://dev-int.ismart.org',
        changeOrigin: true,
        secure: false,
        headers: {
          'origin':  'https://dev-int.ismart.org',
          'referer': 'https://dev-int.ismart.org/',
        },
      },
      '/accounts/uploads': {
        target: 'https://dev-int.ismart.org',
        changeOrigin: true,
        secure: false,
        headers: {
          'origin':  'https://dev-int.ismart.org',
          'referer': 'https://dev-int.ismart.org/',
        },
      },
    },
  },
})