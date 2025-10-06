import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export", // Disabled for Vercel - uses server-side rendering for dynamic routes
  images: {
    domains: ["localhost", "images.unsplash.com", "d23zwvh2kbhdec.cloudfront.net"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;