/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
experimental: {
    allowedDevOrigins: ['http://localhost:3000'], // or any dev origin you're using
  },
}

export default nextConfig
