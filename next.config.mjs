/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // กำหนด fallback modules เมื่อไม่ใช่ฝั่ง server
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        tls: false,
        net: false,
        dns: false,
        child_process: false,
        dgram: false,
      };
    }
    return config;
  },
};

export default nextConfig;