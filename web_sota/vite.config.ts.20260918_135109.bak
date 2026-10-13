import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['goliath'],
    port: 10785,
    strictPort: true,
    proxy: {
      '/mcp': { target: 'http://127.0.0.1:10786', changeOrigin: true },
      '/api': { target: 'http://127.0.0.1:10786', changeOrigin: true },
    },
  },
})
