import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's.coze.cn',
        port: '',
        pathname: '/t/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
