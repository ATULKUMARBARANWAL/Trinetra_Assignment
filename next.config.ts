import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // 🔥 important for chunk loading issue
  experimental: {
    optimizePackageImports: ["react-pdf"],
  },
};

export default nextConfig;