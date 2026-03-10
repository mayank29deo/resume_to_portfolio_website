/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverComponentsExternalPackages: ["pdf-parse", "mammoth", "pg"] },
};
module.exports = nextConfig;
