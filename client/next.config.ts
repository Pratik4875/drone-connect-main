import type { NextConfig } from "next";
import Analyzer from '@next/bundle-analyzer'
const nextConfig: NextConfig = {
  reactStrictMode: false,
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'avatar.iran.liara.run',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.aceternity.com',
      },
      {
        protocol: 'https',
        hostname: 'ui.aceternity.com',
      },
      {
        protocol: 'https',
        hostname: 'st4.depositphotos.com',
      },
      {
        protocol: 'https',
        hostname: '272c5fb8.rocketcdn.me',
      },
      {
        protocol: 'https',
        hostname: '5.imimg.com',
      },
      {
        protocol: 'https',
        hostname: 'cognizant.scene7.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.dribbble.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn3d.iconscout.com',
      },
    ],
  },
};

const withBundleAnalyzer = Analyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
})
 
module.exports = withBundleAnalyzer(nextConfig)
