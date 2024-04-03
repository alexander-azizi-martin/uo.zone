const { withAxiom } = require('next-axiom');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

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

module.exports = withBundleAnalyzer(withAxiom(nextConfig));
