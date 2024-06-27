import type { UserConfig } from '@farmfe/core'

const isBuild = process.env.NODE_ENV === "production"

const config: UserConfig = {
  compilation: {
    input: {
      index: './index.html',
    },
    resolve: {
      extensions: ['tsx', 'jsx', 'ts', 'js', 'json']
    },
    output: {
      path: './dist-farm',
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
