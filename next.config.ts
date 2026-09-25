import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/about",
        destination: "/info",
        permanent: true,
      },
      {
        source: "/watchclub",
        destination: "/project/wc",
        permanent: true,
      },
      {
        source: "/alchemy",
        destination: "/project/alchemy",
        permanent: true,
      },
      {
        source: "/receive",
        destination: "/project/receive",
        permanent: true,
      },
      {
        source: "/photo",
        destination: "/",
        permanent: false,
      },
      {
        source: "/photo/:path*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/film",
        destination: "/",
        permanent: false,
      },
      {
        source: "/film/:path*",
        destination: "/",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      { source: "/project/wc", destination: "/gated/wc" },
      { source: "/project/alchemy", destination: "/gated/alchemy" },
      { source: "/project/receive", destination: "/gated/receive" },
    ];
  },
};

export default nextConfig;
