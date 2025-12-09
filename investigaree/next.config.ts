import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Static export for Cloudflare Pages
  output: "export",
  trailingSlash: true,
  // Extend pageExtensions to include MDX
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Empty turbopack config to use Turbopack (Next.js 16 default)
  turbopack: {},

  // ============================================================================
  // PERFORMANCE OPTIMIZATIONS (Agent 3 - TAREFA 3.14)
  // ============================================================================

  // Compiler optimizations
  compiler: {
    // Remove console.* in production
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },

  // Experimental features for better performance
  experimental: {
    // Optimize package imports (tree-shaking)
    optimizePackageImports: [
      "lucide-react",
      "date-fns",
      "framer-motion",
      "@heroicons/react",
      "recharts",
    ],

    // Optimize server components memory usage
    optimizeCss: true,
  },

  // Production optimizations
  ...(process.env.NODE_ENV === "production" && {
    // Minify output
    compress: true,

    // Generate source maps (can be disabled for smaller builds)
    productionBrowserSourceMaps: false,

    // Strict mode for better error detection
    reactStrictMode: true,

    // Power up compression
    poweredByHeader: false,
  }),
};

export default nextConfig;
