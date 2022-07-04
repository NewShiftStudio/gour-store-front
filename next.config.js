/** @type {import('next').NextConfig} */

const withImages = require('next-images');
const nextConfig = withImages({
  webpack(config) {
    return config;
  },
  images: {
    disableStaticImages: true,
    domains: ['gour-store.devshift.ru', 'localhost'],
  },
  pageExtensions: ['tsx'],
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://gour-store.devshift.ru/api/:path*', // Proxy to Backend
      },
    ];
  },
  i18n: {
    locales: ['en', 'ru'],
    defaultLocale: 'ru',
    localeDetection: false,
  },
});

module.exports = nextConfig;
