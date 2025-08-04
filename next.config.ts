import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during builds for GitHub Pages
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during build
  },
  
  // Optimize for static hosting
  experimental: {
    // Static export optimizations
  },
  
  // Environment configuration
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Security headers disabled for static export
  // GitHub Pages will handle basic security headers
};

export default nextConfig;
