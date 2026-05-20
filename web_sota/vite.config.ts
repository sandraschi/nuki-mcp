import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 10980,
    strictPort: true,
    proxy: {
      '/mcp': { target: 'http://127.0.0.1:10894', changeOrigin: true },
      '/api': { target: 'http://127.0.0.1:10894', changeOrigin: true },
    },
  },
})
