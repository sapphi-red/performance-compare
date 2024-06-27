import { defineConfig } from 'rolldown'

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
    dir: './dist-rolldown',
    sourcemap: isBuild ? false : 'inline',
  },
})
