import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["1.246.83.86"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
