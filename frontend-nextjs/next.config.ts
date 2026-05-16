import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,

  poweredByHeader: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'dynamic-media-cdn.tripadvisor.com',
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  reactStrictMode: true,

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = {
  allowedDevOrigins: ['10.58.83.132'],
}

export default nextConfig;
