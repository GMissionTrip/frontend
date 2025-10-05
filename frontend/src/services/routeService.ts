import api from "@/api/axiosInstance";

export interface Coordinate {
  x: number; // longitude
  y: number; // latitude
}

export interface RouteRequest {
  origin: Coordinate;
  destination: Coordinate;
  waypoints: Coordinate[];
}

export interface RouteResponse {
  routes: Route[];
  meta: {
    totalDistance: number;
    totalDuration: number;
  };
}

export interface Route {
  summary: {
    distance: number;
    duration: number;
  };
  sections: Section[];
}

export interface Section {
  distance: number;
  duration: number;
  bounds: {
    min: Coordinate;
    max: Coordinate;
  };
  roads: Road[];
}

export interface Road {
  name: string;
  distance: number;
  duration: number;
  traffic_speed: number;
  traffic_state: number;
  vertexes: number[];
}

class RouteService {
  private baseURL = "/api/route";

  // 다중경유지 길찾기
  async getDirections(request: RouteRequest): Promise<RouteResponse> {
    try {
      const response = await api.post(`${this.baseURL}/directions`, request);
      return response.data.data;
    } catch (error) {
      
      throw error;
    }
  }

  // 다중경유지 최적화 (TSP 알고리즘 적용)
  async optimizeRoute(request: RouteRequest): Promise<RouteResponse> {
    try {
      const response = await api.post(`${this.baseURL}/optimize`, request);
      return response.data.data;
    } catch (error) {
      
      throw error;
    }
  }

  // 좌표를 주소로 변환 (카카오 API 사용)
  async getAddressFromCoordinate(coordinate: Coordinate): Promise<string> {
    try {
      // 실제로는 카카오 API를 직접 호출하거나 백엔드에서 처리
      const response = await api.get(`${this.baseURL}/reverse-geocode`, {
        params: coordinate,
      });
      return response.data.data.address;
    } catch (error) {
      
      throw error;
    }
  }

  // 주소를 좌표로 변환 (카카오 API 사용)
  async getCoordinateFromAddress(address: string): Promise<Coordinate> {
    try {
      const response = await api.get(`${this.baseURL}/geocode`, {
        params: { address },
      });
      return response.data.data.coordinate;
    } catch (error) {
      
      throw error;
    }
  }

  // 강원도 관광지 검색
  async searchTouristSpots(keyword: string): Promise<TouristSpot[]> {
    try {
      const response = await api.get(`${this.baseURL}/tourist-spots`, {
        params: { keyword },
      });
      return response.data.data;
    } catch (error) {
      
      throw error;
    }
  }
}

export interface TouristSpot {
  id: string;
  name: string;
  address: string;
  coordinate: Coordinate;
  category: string;
  description?: string;
  imageUrl?: string;
}

export const routeService = new RouteService();
