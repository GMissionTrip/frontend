"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";
import { Loading } from "@/components/atoms/Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true면 로그인 필요, false면 비로그인만 접근 가능
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // 로딩 중에는 아무것도 하지 않음

    if (requireAuth && !user) {
      // 로그인이 필요한 페이지인데 로그인하지 않은 경우
      console.log("🔒 인증 필요 - 로그인 페이지로 이동");
      router.push("/login");
    } else if (!requireAuth && user) {
      // 비로그인 전용 페이지인데 로그인한 경우
      console.log("✅ 이미 로그인됨 - 메인 페이지로 이동");
      router.push("/main");
    }
  }, [user, isLoading, requireAuth, router]);

  // 로딩 중
  if (isLoading) {
    return <Loading fullScreen text="사용자 정보 확인 중..." />;
  }

  // 인증 체크
  if (requireAuth && !user) {
    return <Loading fullScreen text="로그인 페이지로 이동 중..." />;
  }

  if (!requireAuth && user) {
    return <Loading fullScreen text="메인 페이지로 이동 중..." />;
  }

  // 정상적인 경우 children 렌더링
  return <>{children}</>;
}

