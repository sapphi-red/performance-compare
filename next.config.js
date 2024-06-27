/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      resolveExtensions: ['.tsx', '.jsx', '.ts', '.js', '.json']
    }
  }
};
// TODO: no way to configure sourcemaps? it always contain the sourcesContent field

module.exports = nextConfig;
