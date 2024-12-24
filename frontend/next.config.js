const { withAxiom } = require('next-axiom');
const urlJoin = import('url-join');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: '/stats/:match*',
        destination: 'https://analytics.uo.zone/:match*',
        basePath: false,
      },
      {
        source: '/docs',
        destination: await (
          await urlJoin
        ).default(process.env.SERVER_URL, '/docs/api'),
        basePath: false,
      },
      {
        source: '/docs/api.json',
        destination: await (
          await urlJoin
        ).default(process.env.SERVER_URL, '/docs/api.json'),
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
};

module.exports = withBundleAnalyzer(withAxiom(nextConfig));
