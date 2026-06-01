import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "localhost" },
      { hostname: "api.harekrishnavidya.org" },
      { hostname: "images.unsplash.com" },
    ],
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
