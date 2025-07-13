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
  },
  // Optimize font loading
  optimizeFonts: true,
  // Disable automatic static optimization if causing preload issues
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
