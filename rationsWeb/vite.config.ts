import { defineConfig } from 'vite'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
// tsconfigPaths removed to avoid alias conflicts

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.PLATFORM_API_URL || process.env.PLATFORM_BASE_URL || 'http://localhost:6000',
        changeOrigin: true,
      },
    },
    fs: {
      allow: [path.resolve(__dirname, '../../platform')],
      strict: false,
    },
  },
  resolve: {
    alias: [
      { find: /^@shared\/ui/, replacement: fileURLToPath(new URL('../../platform/shared/ui', import.meta.url)) },
      { find: /^@shared\/types/, replacement: fileURLToPath(new URL('../../platform/shared/types', import.meta.url)) },
      { find: /^@shared\/hooks/, replacement: fileURLToPath(new URL('../../platform/shared/hooks', import.meta.url)) },
      { find: /^@shared\b/, replacement: fileURLToPath(new URL('../../platform/shared', import.meta.url)) },
    ],
  },
})
