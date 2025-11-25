import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Static export for Cloudflare Pages
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
