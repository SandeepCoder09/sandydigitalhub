import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sandycoder.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'sandeepcoder09.github.io',
      },
      {
        protocol: 'https',
        hostname: 'portfolio4sandy.vercel.app',
      },
    ],
  },
};

export default nextConfig;
