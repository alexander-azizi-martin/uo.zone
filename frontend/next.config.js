const { withAxiom } = require('next-axiom');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
  },
  async rewrites() {
    return [
      {
        source: '/stats/:match*',
        destination: 'https://analytics.uo.zone/:match*',
        basePath: false,
      },
    ];
  },
  experimental: {
    swcPlugins: [
      [
        '@lingui/swc-plugin',
        {
          // the same options as in .swcrc
        },
      ],
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.po/,
      use: [
        {
          loader: '@lingui/loader',
        },
      ],
    });
    return config;
  },
};

module.exports = withBundleAnalyzer(withAxiom(nextConfig));
