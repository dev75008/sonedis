import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/sonedis/',
  plugins: [react()],
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          animation: ['gsap', '@gsap/react', 'lenis'],
          i18n: ['i18next', 'react-i18next'],
        },
      },
    },
  },
})
