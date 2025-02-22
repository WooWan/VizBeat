const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sgfbjtwrqhjzbyuhnknq.supabase.co'
      },
      {
        protocol: 'https',
        hostname: 'rne8imz5p8sjv4yp.public.blob.vercel-storage.com'
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co'
      },
      {
        protocol: 'https',
        hostname: 'vizbeats.s3.ap-northeast-2.amazonaws.com'
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com'
      }
    ]
  }
};

module.exports = withBundleAnalyzer(nextConfig);
