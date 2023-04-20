import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [
    react()
  ],
  server: {
    port: 5174,
    strictPort: true,
  },
  resolve: {
    extensions: ['.tsx', '.jsx', '.ts', '.js', '.json']
  },
  css: {
    devSourcemap: true,
  },
  cacheDir: 'node_modules/.vite-swc'
});
