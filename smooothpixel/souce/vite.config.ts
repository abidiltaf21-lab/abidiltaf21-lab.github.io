import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7273',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    // Raise warning limit — individual chunks will be small due to lazy loading
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        // Split vendor libraries into separate cached chunks
        manualChunks: {
          // Core React runtime — almost never changes, cached forever
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],

          // Animation / UI libs
          'vendor-gsap': ['gsap'],
          'vendor-swiper': ['swiper'],

          // Chart & layout
          'vendor-isotope': ['isotope-layout', 'imagesloaded'],
          'vendor-recharts': ['recharts'],

          // Utilities
          'vendor-axios': ['axios'],
          'vendor-toastify': ['react-toastify'],
        },
      },
    },
  },
});