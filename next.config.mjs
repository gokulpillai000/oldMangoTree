/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/magazine-archives',
        destination: '/magazine',
      },
      {
        source: '/app-podcasts',
        destination: '/podcasts',
      },
    ];
  },
};

export default nextConfig;
