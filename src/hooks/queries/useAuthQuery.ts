"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import useUser from "@/hooks/useUser";
import { User } from "@/types";
import { useRouter } from "next/navigation";

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
  validate: (token: string) => [...authKeys.all, 'validate', token] as const,
};

// 현재 사용자 정보 조회
export function useMe() {
  const { user, setUser } = useUser();
  
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      if (!user?.access_token) {
        return null;
      }
      
      // 백엔드에서 사용자 정보 가져오기
      const response = await authService.validateToken();
      return response;
    },
    enabled: !!user?.access_token,
    staleTime: 5 * 60 * 1000, // 5분
  });
}

// 카카오 로그인 (백엔드 연동)
export function useKakaoLoginMutation() {
  const queryClient = useQueryClient();
  const { setUser } = useUser();
  const router = useRouter();

  return useMutation({
    mutationFn: async (tokenData: { accessToken: string; refreshToken: string }) => {
      console.log("🔐 백엔드에서 받은 토큰 처리 중...", tokenData);
      
      // 백엔드에서 받은 JWT 토큰을 사용하여 사용자 정보 생성
      // 실제로는 백엔드에서 사용자 정보를 가져와야 하지만, 
      // 현재는 토큰만으로 데모 사용자 정보 생성
      const userData = {
        id: "user_" + Date.now(),
        name: "카카오 사용자",
        nickname: "여행러",
        email: "kakao@example.com",
        profileImage: "https://via.placeholder.com/100x100/FF6B6B/FFFFFF?text=Kakao",
        access_token: tokenData.accessToken,
        refresh_token: tokenData.refreshToken,
      };

      console.log("✅ 사용자 정보 생성 완료:", userData);
      return userData;
    },
    onSuccess: (userData: User) => {
      console.log("💾 [useAuthQuery] 사용자 정보 저장 중...");
      console.log("💾 [useAuthQuery] userData:", userData);
      
      // Zustand store에 저장 (쿠키도 함께 저장됨)
      console.log("💾 [useAuthQuery] setUser 호출 직전");
      setUser(userData);
      console.log("💾 [useAuthQuery] setUser 호출 완료");
      
      // React Query 캐시에도 저장
      queryClient.setQueryData(authKeys.me(), userData);
      console.log("💾 [useAuthQuery] React Query 캐시 저장 완료");
      
      console.log("✅ [useAuthQuery] 사용자 정보 저장 완료");
      console.log("🏠 [useAuthQuery] 메인 페이지로 이동");
      
      // 작은 딜레이 후 이동 (상태 업데이트 반영 시간 확보)
      setTimeout(() => {
        console.log("🏠 [useAuthQuery] router.push('/main') 실행");
        router.push("/main");
      }, 100);
    },
    onError: (error) => {
      console.error("❌ 로그인 실패:", error);
    },
  });
}

// 로그아웃
export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const { logout } = useUser();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      // 백엔드 로그아웃 API 호출 (선택사항)
      // await authService.logout();
      console.log("👋 로그아웃 처리 중...");
    },
    onSuccess: () => {
      // Zustand store 초기화 (쿠키도 함께 삭제됨)
      logout();
      
      // React Query 캐시 초기화
      queryClient.clear();
      
      console.log("✅ 로그아웃 완료");
      router.push("/");
    },
  });
}

