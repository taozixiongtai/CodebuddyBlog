import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    include: ['antd', '@ant-design/icons']
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7222',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
