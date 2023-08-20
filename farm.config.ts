import type { UserConfig } from '@farmfe/core'

const config: UserConfig = {
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
    presetEnv: {
      options: {
        targets: 'Chrome >= 87, Firefox >= 78, Safari >= 14, Edge >= 88'
      }
    }
  },
  server: {
    hmr: true,
  },
  plugins: ['@farmfe/plugin-react'],
};
export default config
