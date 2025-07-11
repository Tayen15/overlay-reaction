import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Handle server-side modules
      config.externals = [...(config.externals || []), 'socket.io'];
    }
    return config;
  },
};

export default nextConfig;
