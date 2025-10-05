import api from "@/api/axiosInstance";
import { Place, RouteOptimizationRequest, RouteOptimizationResponse } from "@/types/place";

class PlaceService {
  private baseURL = "/api/places";

  // 지역별 추천 장소 조회
  async getPlacesByRegion(region: string): Promise<Place[]> {
    try {
      const response = await api.get(`${this.baseURL}/region/${region}`);
      return response.data.data || this.getDummyPlaces(region);
    } catch (error) {
      console.warn("장소 조회 실패, 더미 데이터 사용:", error);
      return this.getDummyPlaces(region);
    }
  }

  // 장소 검색
  async searchPlaces(keyword: string, region?: string): Promise<Place[]> {
    try {
      const response = await api.get(`${this.baseURL}/search`, {
        params: { keyword, region },
      });
      return response.data.data || [];
    } catch (error) {
      console.warn("장소 검색 실패:", error);
      return [];
    }
  }

  // 경로 최적화
  async optimizeRoute(request: RouteOptimizationRequest): Promise<RouteOptimizationResponse> {
    try {
      const response = await api.post(`${this.baseURL}/optimize-route`, request);
      return response.data.data;
    } catch (error) {
      console.warn("경로 최적화 실패, 더미 데이터 사용:", error);
      return this.getDummyOptimizedRoute(request);
    }
  }

  // 더미 장소 데이터
  private getDummyPlaces(region: string): Place[] {
    const places: Place[] = [
      {
        id: "place1",
        name: "속초 해수욕장",
        category: "자연",
        address: "강원도 속초시 해수욕장길 190",
        description: "동해안 최고의 해변, 맑은 물과 깨끗한 모래사장",
        imageUrl: "https://picsum.photos/seed/sokcho-beach/400/300",
        lat: 38.207,
        lng: 128.591,
        rating: 4.5,
        duration: 120,
        tags: ["해변", "사진", "수영"],
      },
      {
        id: "place2",
        name: "낙산사",
        category: "문화",
        address: "강원도 양양군 강현면 낙산사로 100",
        description: "관동팔경 중 하나, 동해를 바라보는 아름다운 사찰",
        imageUrl: "https://picsum.photos/seed/naksansa/400/300",
        lat: 38.122,
        lng: 128.627,
        rating: 4.7,
        duration: 90,
        tags: ["사찰", "문화", "전망"],
      },
      {
        id: "place3",
        name: "중앙시장",
        category: "먹거리",
        address: "강원도 속초시 중앙로 147",
        description: "속초의 대표 전통시장, 신선한 해산물과 먹거리 천국",
        imageUrl: "https://picsum.photos/seed/sokcho-market/400/300",
        lat: 38.204,
        lng: 128.589,
        rating: 4.3,
        duration: 60,
        tags: ["시장", "먹거리", "해산물"],
      },
      {
        id: "place4",
        name: "아바이마을",
        category: "관광",
        address: "강원도 속초시 청호동",
        description: "속초의 숨은 명소, 갯배를 타고 가는 독특한 마을",
        imageUrl: "https://picsum.photos/seed/abai-village/400/300",
        lat: 38.212,
        lng: 128.597,
        rating: 4.4,
        duration: 90,
        tags: ["마을", "갯배", "체험"],
      },
      {
        id: "place5",
        name: "설악산 국립공원",
        category: "자연",
        address: "강원도 속초시 설악산로 1091",
        description: "대한민국 대표 명산, 사계절 아름다운 자연경관",
        imageUrl: "https://picsum.photos/seed/seoraksan/400/300",
        lat: 38.119,
        lng: 128.465,
        rating: 4.8,
        duration: 240,
        tags: ["산", "등산", "자연"],
      },
      {
        id: "place6",
        name: "영금정",
        category: "자연",
        address: "강원도 속초시 영랑동",
        description: "바위와 바다가 어우러진 절경, 일출 명소",
        imageUrl: "https://picsum.photos/seed/younggeumjeong/400/300",
        lat: 38.186,
        lng: 128.601,
        rating: 4.6,
        duration: 45,
        tags: ["바다", "일출", "산책"],
      },
      {
        id: "place7",
        name: "속초 등대전망대",
        category: "관광",
        address: "강원도 속초시 영랑동 64-6",
        description: "속초 앞바다를 한눈에, 낭만적인 등대",
        imageUrl: "https://picsum.photos/seed/sokcho-lighthouse/400/300",
        lat: 38.204,
        lng: 128.603,
        rating: 4.2,
        duration: 30,
        tags: ["등대", "전망", "야경"],
      },
      {
        id: "place8",
        name: "청초호 스카이워크",
        category: "관광",
        address: "강원도 속초시 청호동",
        description: "호수 위를 걷는 특별한 경험",
        imageUrl: "https://picsum.photos/seed/cheongcho-skywalk/400/300",
        lat: 38.209,
        lng: 128.591,
        rating: 4.1,
        duration: 40,
        tags: ["호수", "산책", "스카이워크"],
      },
    ];

    return places;
  }

  // 더미 경로 최적화 결과
  private getDummyOptimizedRoute(request: RouteOptimizationRequest): RouteOptimizationResponse {
    const placeIds = request.places;
    
    // 간단한 최적화 시뮬레이션 (거리 기반)
    const optimizedOrder = [...placeIds];
    
    // 더미 경로 세그먼트 생성
    const routes = optimizedOrder.slice(0, -1).map((fromId, index) => ({
      from: fromId,
      to: optimizedOrder[index + 1],
      distance: Math.random() * 10 + 2, // 2~12km
      duration: Math.random() * 30 + 10, // 10~40분
      mode: "drive" as const,
    }));

    const totalDistance = routes.reduce((sum, route) => sum + route.distance, 0);
    const totalDuration = routes.reduce((sum, route) => sum + route.duration, 0);

    return {
      optimizedOrder,
      totalDistance: Math.round(totalDistance * 10) / 10,
      totalDuration: Math.round(totalDuration),
      estimatedCost: Math.round(totalDistance * 150), // km당 150원 가정
      routes,
    };
  }
}

export const placeService = new PlaceService();

