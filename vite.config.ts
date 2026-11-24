import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/generous-angels/',
  plugins: [vue()],
  server: {
    proxy: {
      '/wp-json': {
        target: 'http://192.168.0.48:9988',
        changeOrigin: true,
      },
    },
  },
})
