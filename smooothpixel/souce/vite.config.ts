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
    outDir: 'dist', // Ensure it generates the 'dist' folder
    emptyOutDir: true,
    sourcemap: false,
    chunkSizeWarningLimit: 2000
  }
});