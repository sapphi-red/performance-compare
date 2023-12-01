import type { UserConfig } from '@farmfe/core'

const isBuild = process.env.IS_BUILD === '1'

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
    sourcemap: !isBuild,
    presetEnv: {
      options: {
        targets: 'Chrome >= 87, Firefox >= 78, Safari >= 14, Edge >= 88'
      }
    }
  },
  server: {
    strictPort: true,
    hmr: true
  },
  plugins: ['@farmfe/plugin-react'],
};
export default config
