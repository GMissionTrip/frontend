import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { placeService } from "@/services/placeService";
import { RouteOptimizationRequest } from "@/types/place";

// Query Keys
export const placeKeys = {
  all: ['places'] as const,
  byRegion: (region: string) => [...placeKeys.all, 'region', region] as const,
  search: (keyword: string, region?: string) => [...placeKeys.all, 'search', keyword, region] as const,
};

// 지역별 장소 조회
export function usePlacesByRegion(region: string) {
  return useQuery({
    queryKey: placeKeys.byRegion(region),
    queryFn: () => placeService.getPlacesByRegion(region),
    enabled: !!region,
    staleTime: 10 * 60 * 1000, // 10분
  });
}

// 장소 검색
export function useSearchPlaces(keyword: string, region?: string) {
  return useQuery({
    queryKey: placeKeys.search(keyword, region),
    queryFn: () => placeService.searchPlaces(keyword, region),
    enabled: keyword.length > 0,
    staleTime: 5 * 60 * 1000, // 5분
  });
}

// 경로 최적화 mutation
export function useOptimizeRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: RouteOptimizationRequest) => placeService.optimizeRoute(request),
    onSuccess: () => {
      // 성공 시 캐시 무효화 (필요한 경우)
      queryClient.invalidateQueries({ queryKey: placeKeys.all });
    },
  });
}

