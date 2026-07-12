import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  reactCompiler: true,
  allowedDevOrigins: ['10.10.1.9', '10.10.1.10'],
};

export default nextConfig;
