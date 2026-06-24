import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  optimizeDeps: {
    exclude: ['pdfjs-dist']
  },

  // Add this to handle PDF.js worker correctly
  define: {
    global: 'globalThis',
  },

  // ─── Development Server Configuration ────────────────────────────────────
  server: {
    // Proxy API requests to backend to bypass CORS issues in development
    // Routes /api/* requests to http://dev-int.ismart.org/api
    proxy: {
      '/api': {
        target: 'http://dev-int.ismart.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      }
    }
  }
})