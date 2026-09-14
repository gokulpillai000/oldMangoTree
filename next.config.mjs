const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

const nextConfig = {
  reactStrictMode: true,
  ...(isGithubActions ? { output: 'export' } : {}),
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  ...(!isGithubActions
    ? {
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
      }
    : {}),
};

export default nextConfig;
