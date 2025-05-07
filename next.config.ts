import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nkjbzfghksrpbgcvxuyz.supabase.co',
      },
    ],
  }
  
}

export default nextConfig
