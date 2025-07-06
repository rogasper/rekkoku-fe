import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["@heroui/react"],
  },
  // Optimize font loading
  optimizeFonts: true,
  // Disable automatic static optimization if causing preload issues
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
