import { defineConfig } from 'vite'
import path from 'node:path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: process.env.PLATFORM_API_URL || process.env.PLATFORM_BASE_URL || 'http://localhost:6000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@shared/ui': path.resolve(__dirname, '../shared/ui'),
      '@shared/types': path.resolve(__dirname, '../shared/types'),
      '@shared/hooks': path.resolve(__dirname, '../shared/hooks'),
    },
  },
})