/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/nvidia-repo-dashboard' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/nvidia-repo-dashboard' : '',
  
  // Disable server-side features for static export
  experimental: {
    runtime: undefined
  }
}

module.exports = nextConfig