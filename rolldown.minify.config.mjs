import { defineConfig } from 'rolldown'
import esbuild from 'esbuild'

const isBuild = true

export default defineConfig({
  input: './src/index.tsx',
  // NOTE: Rolldown doesn't support CSS yet
  external: ['./main.css'],
  resolve: {
    conditionNames: ['import', 'browser'],
    extensions: ['.tsx', '.jsx', '.ts', '.js', '.json'],
    mainFields: ['module', 'main'],
  },
  // NOTE: Rolldown doesn't support lowering syntaxes yet
  output: {
    dir: './dist-rolldown-minify',
    sourcemap: isBuild ? false : 'inline',
  },
  plugins: [
    {
      // NOTE: use esbuild's minify/syntax lowering feature for now
      name: 'esbuild-minify',
      async renderChunk(code) {
        const result = await esbuild.transform(code, {
          minify: true,
          target: ['chrome87', 'firefox78', 'safari14', 'edge88'],
          format: 'esm',
          sourcemap: isBuild ? false : true,
        })
        return { code: result.code, map: result.map }
      },
    },
  ],
})
