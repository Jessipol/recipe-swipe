import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['xlsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.themealdb.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
};

export default nextConfig;
