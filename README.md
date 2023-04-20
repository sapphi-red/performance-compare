# performance-compare
Benchmarks for Farm, Webpack, Vite, Rspack and Turbopack.
> Using Turbopack's bench cases (1000 React components), see https://turbo.build/pack/docs/benchmarks

Results: https://gist.github.com/sapphi-red/25be97327ee64a3c1dce793444afdf6e

Run benchmarks:
```bash
node benchmark.mjs
```

If you want to start the project with the specified tool, try:
```bash
pnpm i # install dependencies

pnpm run start:farm # Start Farm
pnpm run start:vite # Start Vite with babel
pnpm run start:vite-swc # Start Vite with SWC
pnpm run start:webpack # Start Webpack with babel
pnpm run start:webpack-swc # Start Webpack with SWC
pnpm run start:turbopack # Start Turbopack
pnpm run start:rspack # Start Rspack
pnpm run start:parcel # Start parcel
```
