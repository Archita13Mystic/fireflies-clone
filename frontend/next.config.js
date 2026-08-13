/** @type {import('next').NextConfig} */
const nextConfig = {
  // For Render.com dynamic deployment, use default server mode (no static export)
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
