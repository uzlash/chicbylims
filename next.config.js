/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      { source: '/heim', destination: '/', permanent: true },
      { source: '/heim/:path*', destination: '/:path*', permanent: true },
      { source: '/kinder', destination: '/', permanent: true },
      { source: '/kinder/:path*', destination: '/:path*', permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

module.exports = nextConfig;
