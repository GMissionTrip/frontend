import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mypageService } from "@/services/mypageService";

// Query Keys
export const mypageKeys = {
  all: ['mypage'] as const,
  profile: () => [...mypageKeys.all, 'profile'] as const,
  badges: () => [...mypageKeys.all, 'badges'] as const,
  stats: () => [...mypageKeys.all, 'stats'] as const,
  points: (type?: "earn" | "use") => [...mypageKeys.all, 'points', type] as const,
  calendar: (year: number, month: number) => [...mypageKeys.all, 'calendar', year, month] as const,
};

// 사용자 프로필 조회
export function useUserProfile() {
  return useQuery({
    queryKey: mypageKeys.profile(),
    queryFn: () => mypageService.getUserProfile(),
    staleTime: 5 * 60 * 1000, // 5분
  });
}

// 배지 목록 조회
export function useBadges() {
  return useQuery({
    queryKey: mypageKeys.badges(),
    queryFn: () => mypageService.getBadges(),
    staleTime: 10 * 60 * 1000, // 10분
  });
}

// 여행 통계 조회
export function useTravelStats() {
  return useQuery({
    queryKey: mypageKeys.stats(),
    queryFn: () => mypageService.getTravelStats(),
    staleTime: 5 * 60 * 1000, // 5분
  });
}

// 포인트 내역 조회
export function usePointHistory(type?: "earn" | "use") {
  return useQuery({
    queryKey: mypageKeys.points(type),
    queryFn: () => mypageService.getPointHistory(type),
    staleTime: 2 * 60 * 1000, // 2분
  });
}

// 여행 달력 조회
export function useTripCalendar(year: number, month: number) {
  return useQuery({
    queryKey: mypageKeys.calendar(year, month),
    queryFn: () => mypageService.getTripCalendar(year, month),
    staleTime: 5 * 60 * 1000, // 5분
  });
}

// 프로필 수정
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      nickname?: string;
      email?: string;
      bio?: string;
      profileImage?: string;
    }) => mypageService.updateProfile(data),
    onSuccess: () => {
      // 프로필 캐시 무효화
      queryClient.invalidateQueries({ queryKey: mypageKeys.profile() });
    },
  });
}
