/** @type {import('next').NextConfig} */
const nextConfig = {
  // Authorized origins for your current local network (192.168.1.19)
  allowedDevOrigins: ['192.168.1.19', '172.20.10.7', 'localhost:3000'],
  experimental: {
    serverActions: {
      allowedOrigins: ['192.168.1.19', '172.20.10.7', 'localhost:3000'],
    },
  },
};

module.exports = nextConfig;
