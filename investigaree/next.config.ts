import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true, // Disable built-in image optimization for Cloudflare Workers
  },
};

export default nextConfig;
