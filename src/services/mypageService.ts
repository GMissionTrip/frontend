import api from "@/api/axiosInstance";
import { UserProfile, Badge, TravelStats, PointHistory, TripCalendarEvent } from "@/types/mypage";

class MypageService {
  private baseURL = "/api/mypage";

  // 사용자 프로필 조회
  async getUserProfile(): Promise<UserProfile> {
    try {
      const response = await api.get(`${this.baseURL}/profile`);
      return response.data.data || this.getDummyProfile();
    } catch (error) {
      console.warn("프로필 조회 실패, 더미 데이터 사용:", error);
      return this.getDummyProfile();
    }
  }

  // 배지 목록 조회
  async getBadges(): Promise<Badge[]> {
    try {
      const response = await api.get(`${this.baseURL}/badges`);
      return response.data.data || this.getDummyBadges();
    } catch (error) {
      console.warn("배지 조회 실패, 더미 데이터 사용:", error);
      return this.getDummyBadges();
    }
  }

  // 여행 통계 조회
  async getTravelStats(): Promise<TravelStats> {
    try {
      const response = await api.get(`${this.baseURL}/stats`);
      return response.data.data || this.getDummyStats();
    } catch (error) {
      console.warn("통계 조회 실패, 더미 데이터 사용:", error);
      return this.getDummyStats();
    }
  }

  // 포인트 내역 조회
  async getPointHistory(type?: "earn" | "use"): Promise<PointHistory[]> {
    try {
      const response = await api.get(`${this.baseURL}/points`, {
        params: { type },
      });
      return response.data.data || this.getDummyPointHistory(type);
    } catch (error) {
      console.warn("포인트 내역 조회 실패, 더미 데이터 사용:", error);
      return this.getDummyPointHistory(type);
    }
  }

  // 여행 달력 조회
  async getTripCalendar(year: number, month: number): Promise<TripCalendarEvent[]> {
    try {
      const response = await api.get(`${this.baseURL}/calendar`, {
        params: { year, month },
      });
      return response.data.data || this.getDummyCalendar();
    } catch (error) {
      console.warn("달력 조회 실패, 더미 데이터 사용:", error);
      return this.getDummyCalendar();
    }
  }

  // 프로필 수정
  async updateProfile(data: {
    nickname?: string;
    email?: string;
    bio?: string;
    profileImage?: string;
  }): Promise<UserProfile> {
    try {
      const response = await api.put(`${this.baseURL}/profile`, data);
      return response.data.data;
    } catch (error) {
      
      throw error;
    }
  }

  // 더미 데이터
  private getDummyProfile(): UserProfile {
    return {
      id: "user1",
      nickname: "강주님",
      email: "kangchu@example.com",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      level: 5,
      currentXp: 2450,
      nextLevelXp: 3000,
      totalPoints: 2450,
      earnedPoints: 2450,
      usedPoints: 0,
      createdAt: "2024.01.15",
    };
  }

  private getDummyBadges(): Badge[] {
    return [
      {
        id: "badge1",
        name: "상쾌한 6시 기상",
        description: "아침 일찍 일어나 활동하기",
        icon: "🌅",
        category: "daily",
        earnedAt: "2024.01.15",
        progress: 100,
        requirement: "오전 6시 이전에 여행 시작하기",
      },
      {
        id: "badge2",
        name: "첫 여행",
        description: "첫 번째 여행 완료",
        icon: "🎒",
        category: "milestone",
        earnedAt: "2024.01.20",
        progress: 100,
        requirement: "첫 번째 여행 완료하기",
      },
      {
        id: "badge3",
        name: "사진작가",
        description: "100장의 사진 업로드",
        icon: "📸",
        category: "activity",
        progress: 65,
        requirement: "여행 사진 100장 업로드하기",
      },
      {
        id: "badge4",
        name: "탐험가",
        description: "5번의 여행 완료",
        icon: "🗺️",
        category: "milestone",
        earnedAt: "2024.03.10",
        progress: 100,
        requirement: "5번의 여행 완료하기",
      },
      {
        id: "badge5",
        name: "소셜러",
        description: "여행 10번 공유",
        icon: "👥",
        category: "social",
        progress: 40,
        requirement: "여행 10번 공유하기",
      },
      {
        id: "badge6",
        name: "미식가",
        description: "50개 맛집 방문",
        icon: "🍽️",
        category: "food",
        progress: 20,
        requirement: "50개의 맛집 방문하기",
      },
      {
        id: "badge7",
        name: "마라토너",
        description: "하루 20km 걷기",
        icon: "🏃",
        category: "achievement",
        progress: 0,
        requirement: "하루에 20km 걷기",
      },
      {
        id: "badge8",
        name: "야경러",
        description: "10번의 야경 감상",
        icon: "🌃",
        category: "activity",
        progress: 0,
        requirement: "10번의 야경 감상하기",
      },
      {
        id: "badge9",
        name: "레전드",
        description: "모든 배지 획득",
        icon: "👑",
        category: "master",
        progress: 0,
        requirement: "모든 배지 획득하기",
      },
    ];
  }

  private getDummyStats(): TravelStats {
    return {
      totalTrips: 12,
      totalPlaces: 156,
      totalReviews: 24,
      completedTrips: 8,
      ongoingTrips: 2,
      favoriteRegion: "강원도",
    };
  }

  private getDummyPointHistory(type?: "earn" | "use"): PointHistory[] {
    const allHistory = [
      {
        id: "p1",
        type: "earn" as const,
        points: 150,
        description: "제주도 여행 완료",
        category: "여행 완료",
        createdAt: "2024.01.15",
        relatedTripId: "trip1",
      },
      {
        id: "p2",
        type: "use" as const,
        points: 200,
        description: "스타벅스 아메리카노",
        category: "가볼슬까",
        createdAt: "2024.01.12",
      },
      {
        id: "p3",
        type: "earn" as const,
        points: 80,
        description: "맛집 리뷰 작성완료",
        category: "홍대 파스타집",
        createdAt: "2024.01.10",
      },
      {
        id: "p4",
        type: "use" as const,
        points: 100,
        description: "올빼 주식 팔아",
        category: "투다오월",
        createdAt: "2024.01.08",
      },
      {
        id: "p5",
        type: "earn" as const,
        points: 120,
        description: "부산 해운대 방문",
        category: "부산",
        createdAt: "2024.01.05",
      },
      {
        id: "p6",
        type: "use" as const,
        points: 300,
        description: "제주공항 항공료",
        category: "항공권공",
        createdAt: "2024.01.01",
      },
      {
        id: "p7",
        type: "earn" as const,
        points: 50,
        description: "경복궁 방문",
        category: "서울",
        createdAt: "2024.01.03",
      },
    ];

    if (type === "earn") {
      return allHistory.filter(h => h.type === "earn");
    } else if (type === "use") {
      return allHistory.filter(h => h.type === "use");
    }

    return allHistory;
  }

  private getDummyCalendar(): TripCalendarEvent[] {
    return [
      {
        id: "trip1",
        title: "제주도 여행",
        startDate: "2024-01-15",
        endDate: "2024-01-18",
        region: "제주",
        color: "#3B82F6",
        status: "completed",
      },
      {
        id: "trip2",
        title: "강원도 속초",
        startDate: "2024-01-25",
        endDate: "2024-01-27",
        region: "강원",
        color: "#10B981",
        status: "planned",
      },
    ];
  }
}

export const mypageService = new MypageService();

