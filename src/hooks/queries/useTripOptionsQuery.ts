import { useQuery } from "@tanstack/react-query";
import { tripOptionsService } from "@/services/tripOptionsService";

// Query Keys
export const tripOptionsKeys = {
  all: ['tripOptions'] as const,
  companions: () => [...tripOptionsKeys.all, 'companions'] as const,
  activities: () => [...tripOptionsKeys.all, 'activities'] as const,
  themes: () => [...tripOptionsKeys.all, 'themes'] as const,
};

// 동행자 옵션 조회
export function useCompanions() {
  return useQuery({
    queryKey: tripOptionsKeys.companions(),
    queryFn: () => tripOptionsService.getCompanions(),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분 (cacheTime -> gcTime in v5)
  });
}

// 활동 옵션 조회
export function useActivities() {
  return useQuery({
    queryKey: tripOptionsKeys.activities(),
    queryFn: () => tripOptionsService.getActivities(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// 테마 옵션 조회
export function useThemes() {
  return useQuery({
    queryKey: tripOptionsKeys.themes(),
    queryFn: () => tripOptionsService.getThemes(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

