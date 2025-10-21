import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Ensure DB-related native packages are treated as external on the server
  serverExternalPackages: ["pg", "pg-hstore", "sequelize"],
};

export default nextConfig;