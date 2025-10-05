export interface Place {
  id: string;
  name: string;
  category: string;
  address: string;
  description?: string;
  imageUrl?: string;
  lat: number;
  lng: number;
  rating?: number;
  duration?: number; // 예상 소요 시간 (분)
  tags?: string[];
}

export interface SelectedPlace extends Place {
  order: number; // 방문 순서
  visitDate?: string; // 방문 예정 날짜
  memo?: string; // 메모
}

export interface RouteOptimizationRequest {
  places: string[]; // place IDs
  startLocation?: { lat: number; lng: number };
  endLocation?: { lat: number; lng: number };
  startTime?: string; // HH:mm
  optimizationType?: "distance" | "time" | "popularity"; // 최적화 기준
}

export interface RouteOptimizationResponse {
  optimizedOrder: string[]; // place IDs in optimized order
  totalDistance: number; // km
  totalDuration: number; // 분
  estimatedCost?: number; // 예상 비용
  routes: RouteSegment[];
}

export interface RouteSegment {
  from: string; // place ID
  to: string; // place ID
  distance: number; // km
  duration: number; // 분
  mode: "drive" | "walk" | "transit"; // 이동 수단
}

