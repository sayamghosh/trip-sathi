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
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  reactStrictMode: true,

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  allowedDevOrigins: ['10.58.83.132'],

  async redirects() {
    return [
      // Google is indexing the Vercel-assigned preview/production domain
      // instead of the purchased custom domain. A 301 host redirect gives
      // search engines (and anyone with an old link) an unambiguous signal
      // that joytrips.site is canonical - the fix has to happen here AND in
      // Vercel's dashboard (this domain must be attached to the project and
      // the request must actually reach this app for the redirect to fire).
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'joytrips.vastel.app' }],
        destination: 'https://joytrips.site/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
