import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Standalone for OpenNext/Cloudflare
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Extend pageExtensions to include MDX
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Empty turbopack config to use Turbopack (Next.js 16 default)
  turbopack: {},
};

export default nextConfig;
