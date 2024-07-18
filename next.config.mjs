/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    turbo: {
      resolveAlias: {
        canvas: './src/empty-module.ts'
      }
    },
    serverActions: {
      bodySizeLimit: '50mb',
    }
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
