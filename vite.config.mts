import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react()
  ],
  server: {
    port: 5173,
    strictPort: true,
  },
  resolve: {
    extensions: ['.tsx', '.jsx', '.ts', '.js', '.json']
  },
  css: {
    devSourcemap: true,
  }
});
