import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Public pages and the admin session read request-time data from Supabase
  // (or the local preview store). Cache Components would prerender those reads
  // into a static shell and could keep showing stale content after a dashboard
  // edit, so this app uses normal request-time rendering instead.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.in",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
