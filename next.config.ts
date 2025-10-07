import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // ✅ AWS EC2 배포용 (Node.js 서버)
  images: {
    unoptimized: true, // EC2에서는 이미지 최적화 비활성화 (external URL 허용)
  },
  // standalone: EC2에서 pm2로 실행
  // export: S3 정적 배포 (동적 라우트 지원 안됨)
};

export default nextConfig;