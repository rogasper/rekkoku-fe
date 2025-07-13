import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["@heroui/react"],
    // Reduce preload warnings by optimizing module loading
    optimizeServerReact: true,
  },
  // Optimize font loading
  optimizeFonts: true,
  // Improve resource preloading
  webpack: (config, { dev, isServer }) => {
    // Only apply in development to prevent preload warnings
    if (dev && !isServer) {
      // Disable module preloading for development utilities
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          // Prevent preloading of development-only utilities
          devUtils: {
            test: /[\\/]utils[\\/](resource-monitor|debug)/,
            name: "dev-utils",
            chunks: "all",
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
  // Disable automatic static optimization if causing preload issues
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
