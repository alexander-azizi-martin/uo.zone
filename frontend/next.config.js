const { withAxiom } = require('next-axiom');

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
  },
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: '/stats/:match*',
        destination: 'https://analytics.uo.zone/:match*',
        basePath: false,
      },
    ];
  },
};

module.exports = withAxiom(nextConfig);
