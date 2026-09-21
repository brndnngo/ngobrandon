import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://cdn.sanity.io/images/**"),
      new URL("https://cdn.prod.website-files.com/**"),
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
    ];
  },
  async rewrites() {
    return [
      { source: "/project/wc", destination: "/gated/wc" },
      { source: "/project/alchemy", destination: "/gated/alchemy" },
      { source: "/project/receive", destination: "/gated/receive" },
      { source: "/photo", destination: "/film" },
    ];
  },
};

export default nextConfig;
