import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true, // 개발 환경에서 이미지 최적화 비활성화
  },
};

export default nextConfig;
