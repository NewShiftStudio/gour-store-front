/** @type {import('next').NextConfig} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withImages = require('next-images');

const nextConfig = withImages({
  webpack(config) {
    return config;
  },
  images: {
    disableStaticImages: true,
    domains: ['gour-store.devshift.ru', 'gour-static.devshift.ru', 'resizer.mail.ru', 'localhost'],
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
