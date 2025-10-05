// 사용자 정보
export interface UserProfile {
  id: string;
  nickname: string;
  email: string;
  profileImage?: string;
  bio?: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  totalPoints: number;
  earnedPoints: number;
  usedPoints: number;
  createdAt: string;
}

// 배지
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  earnedAt?: string;
  progress?: number; // 0-100
  requirement: string;
}

// 여행 통계
export interface TravelStats {
  totalTrips: number;
  totalPlaces: number;
  totalReviews: number;
  completedTrips: number;
  ongoingTrips: number;
  favoriteRegion: string;
}

// 포인트 내역
export interface PointHistory {
  id: string;
  type: "earn" | "use";
  points: number;
  description: string;
  category: string;
  createdAt: string;
  relatedTripId?: string;
}

// 여행 달력 이벤트
export interface TripCalendarEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  region: string;
  color: string;
  status: "planned" | "ongoing" | "completed";
}

