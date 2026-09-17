import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/setores",
        destination: "/projetos",
        permanent: true
      },
      {
        source: "/setores/:slug",
        destination: "/projetos/:slug",
        permanent: true
      }
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "host", value: "order2party.vektrum.agency" }],
          destination: "/order2party"
        }
      ]
    };
  }
};

export default nextConfig;
