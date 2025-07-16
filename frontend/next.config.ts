import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // <== ESSENCIAL
  experimental: {
    middlewarePrefetch: "strict",
  },
};

export default nextConfig;
