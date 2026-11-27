import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false, // never ship source maps to production
    rollupOptions: { output: { manualChunks(id) {
      if (id.includes('node_modules/gsap')) return 'gsap'
      if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) return 'vendor'
    } } }
  }
})
