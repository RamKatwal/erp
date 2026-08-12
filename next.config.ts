import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dev.radianos.com",
        pathname: "/blocks/**",
      },
    ],
  },
}

export default nextConfig
