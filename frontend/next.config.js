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
    ];
  },
};

module.exports = nextConfig;
