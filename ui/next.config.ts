import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // proxy...
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://desafio-dev-production.up.railway.app/:path*",
      },
    ];
  },
};

export default nextConfig;
