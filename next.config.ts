import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    instantInsights: {
      validationLevel: "warning",
    },
  },
  turbopack: {
    root: process.cwd(),
  },
  images: {
    qualities: [68, 72, 75, 90, 92],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
};

export default nextConfig;
