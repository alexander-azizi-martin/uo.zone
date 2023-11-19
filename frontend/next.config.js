const { withAxiom } = require('next-axiom');

const serverUrl = new URL('/api/:path*', process.env.SERVER_URL);

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: serverUrl.href,
        basePath: false,
      },
      {
        source: '/stats/:match*',
        destination: 'https://analytics.uo.zone/:match*',
        basePath: false,
      },
    ];
  },
};

module.exports = withAxiom(nextConfig);
