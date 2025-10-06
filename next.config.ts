import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // ✅ 이 한 줄 추가! 정적 HTML로 내보내기
  images: {
    domains: ["localhost"],
    unoptimized: true, // S3/CloudFront에서 필요
  },
};

export default nextConfig;