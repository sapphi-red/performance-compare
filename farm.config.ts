import { defineFarmConfig } from '@farmfe/core/dist/config';

export default defineFarmConfig({
  compilation: {
    input: {
      index: './index.html',
    },
    resolve: {
      symlinks: true,
      mainFields: ['module', 'main', 'customMain'],
      extensions: ['tsx', 'jsx', 'ts', 'js', 'json']
    },
    output: {
      path: './build',
    },
    sourcemap: true,
  },
  server: {
    hmr: true,
  },
  plugins: ['@farmfe/plugin-react']
});
