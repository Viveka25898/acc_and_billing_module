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
      // WHY: Browser blocks cross-origin requests (CORS) to dev-int.ismart.org.
      //      Vite acts as a server-side proxy — Node.js makes the actual request,
      //      so CORS does not apply.
      //
      // WHY .env uses /api/v1 (not full URL):
      //      If axiosInstance.baseURL = full https URL, browser calls it directly
      //      → CORS blocked. With /api/v1, browser calls localhost → Vite proxies.
      //
      // WHY headers override Origin/Referer:
      //      Backend CORS middleware silently returns 404 for unknown origins.
      //      Setting Origin = target domain makes the request look same-origin.
      '/api/v1': {
        target: 'https://dev-int.ismart.org',
        changeOrigin: true,
        secure: false,
        headers: {
          // Make the request look same-origin to the backend's CORS middleware.
          // Postman doesn't send Origin at all — backend trusts it.
          // We spoof Origin to the backend's own domain to get the same behavior.
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

