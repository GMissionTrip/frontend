import api from "@/api/axiosInstance";
import { Mission, MissionSubmission, TripCard } from "@/types/mission";

class MissionService {
  private baseURL = "/api/missions";

  // 여행의 모든 미션 조회
  async getTripMissions(tripId: string): Promise<Mission[]> {
    try {
      const response = await api.get(`${this.baseURL}/trip/${tripId}`);
      return response.data.data;
    } catch (error) {
      
      // 더미 데이터 반환
      return this.getDummyMissions(tripId);
    }
  }

  // 특정 미션 상세 조회
  async getMission(missionId: string): Promise<Mission> {
    try {
      const response = await api.get(`${this.baseURL}/${missionId}`);
      return response.data.data;
    } catch (error) {
      
      // 더미 데이터 반환
      return this.getDummyMissions("1").find((m) => m.id === missionId)!;
    }
  }

  // 미션 제출
  async submitMission(
    missionId: string,
    submission: Omit<MissionSubmission, "submittedAt">
  ): Promise<Mission> {
    try {
      const response = await api.post(`${this.baseURL}/${missionId}/submit`, submission);
      return response.data.data;
    } catch (error) {
      
      throw error;
    }
  }

  // 미션 잠금 해제 (반전 미션)
  async unlockMission(missionId: string): Promise<Mission> {
    try {
      const response = await api.post(`${this.baseURL}/${missionId}/unlock`);
      return response.data.data;
    } catch (error) {
      
      throw error;
    }
  }

  // 여행 카드 뜯기
  async revealTripCard(tripId: string): Promise<TripCard> {
    try {
      const response = await api.post(`${this.baseURL}/trip/${tripId}/reveal`);
      return response.data.data;
    } catch (error) {
      
      throw error;
    }
  }

  // 더미 데이터
  private getDummyMissions(tripId: string): Mission[] {
    return [
      {
        id: "m1",
        type: "photo_upload",
        title: "3컷 여행 요약",
        category: "가벼운",
        description: "오늘 하루를 3장으로 요약해 사진을 업로드해세요!",
        points: 250,
        icon: "📸",
        status: "completed",
        tripId,
        gradient: "linear-gradient(135deg, #2C5F7C 0%, #4A9D8C 100%)",
        requirements: {
          photoCount: 3,
        },
        submittedData: {
          photos: [
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
          ],
          submittedAt: new Date().toISOString(),
        },
      },
      {
        id: "m2",
        type: "temperature",
        title: "감정 온도계",
        category: "가벼운",
        description: "지금 당신의 여행 만족도는 몇 도인가요?",
        points: 120,
        icon: "🌡️",
        status: "completed",
        tripId,
        gradient: "linear-gradient(135deg, #2C5F7C 0%, #4A9D8C 100%)",
        requirements: {
          temperatureRange: [20, 100],
        },
        submittedData: {
          temperature: 80,
          submittedAt: new Date().toISOString(),
        },
      },
      {
        id: "m3",
        type: "photo_upload",
        title: "같이찍Go",
        category: "가벼운",
        description: "사랑하는 가족과 함께 사진을 찍어보세요!",
        points: 150,
        icon: "📷",
        status: "in_progress",
        tripId,
        gradient: "linear-gradient(135deg, #2C5F7C 0%, #4A9D8C 100%)",
        requirements: {
          photoCount: 1,
        },
      },
      {
        id: "m4",
        type: "text_input",
        title: "나의 하루 요약하기",
        category: "가벼운",
        description: "여행 중 있었던 기억 나는 일들을 요약해보세요!",
        points: 100,
        icon: "📝",
        status: "unlocked",
        tripId,
        gradient: "linear-gradient(135deg, #2C5F7C 0%, #4A9D8C 100%)",
        requirements: {
          minTextLength: 10,
          maxTextLength: 500,
        },
      },
      {
        id: "m5",
        type: "random_challenge",
        title: "랜덤 챌린지",
        category: "가벼운",
        description: "오늘의 깜짝 미션을 수행해보세요!",
        points: 180,
        icon: "🎲",
        status: "locked",
        tripId,
        gradient: "linear-gradient(135deg, #2C5F7C 0%, #4A9D8C 100%)",
      },
      {
        id: "m6",
        type: "film_photos",
        title: "여행 베컷 요약",
        category: "가벼운",
        description: "여행 중 찍은 베스트 사진들을 업로드하세요!",
        points: 150,
        icon: "🎞️",
        status: "unlocked",
        tripId,
        gradient: "linear-gradient(135deg, #2C5F7C 0%, #4A9D8C 100%)",
        requirements: {
          photoCount: 3,
        },
      },
      {
        id: "m7",
        type: "pose_challenge",
        title: "따라할 포즈",
        category: "가벼운",
        description: "재시한 포즈를 따라해보세요!",
        points: 200,
        icon: "🤸",
        status: "unlocked",
        tripId,
        gradient: "linear-gradient(135deg, #2C5F7C 0%, #4A9D8C 100%)",
        requirements: {
          poseImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
        },
      },
      {
        id: "m8",
        type: "roulette",
        title: "감쪽 미션 룰렛",
        category: "가벼운",
        description: "룰렛을 돌려 미션을 받아보세요!",
        points: 180,
        icon: "🎯",
        status: "unlocked",
        tripId,
        gradient: "linear-gradient(135deg, #2C5F7C 0%, #4A9D8C 100%)",
        requirements: {
          challengeOptions: [
            "선택 림미션",
            "5초간 춤추기",
            "다음 챌린지 뽑기",
            "미션 수행",
          ],
        },
      },
    ];
  }
}

export const missionService = new MissionService();

