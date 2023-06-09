/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["192.168.0.102", "cdn.pixabay.com"],
  },
  env: {
    app_url: process.env.APP_URL,
  },
};

module.exports = nextConfig;
