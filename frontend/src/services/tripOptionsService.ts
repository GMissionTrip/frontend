import api from "@/api/axiosInstance";

export interface TripOption {
  id: string;
  label: string;
  icon: string;
  category: "companion" | "activity" | "theme";
  order: number;
}

class TripOptionsService {
  private baseURL = "/api/trip-options";

  // 동행자 옵션 조회
  async getCompanions(): Promise<TripOption[]> {
    try {
      const response = await api.get(`${this.baseURL}/companions`);
      return response.data.data || this.getDummyCompanions();
    } catch (error) {
      console.warn("동행자 옵션 로드 실패, 더미 데이터 사용:", error);
      return this.getDummyCompanions();
    }
  }

  // 활동 옵션 조회
  async getActivities(): Promise<TripOption[]> {
    try {
      const response = await api.get(`${this.baseURL}/activities`);
      return response.data.data || this.getDummyActivities();
    } catch (error) {
      console.warn("활동 옵션 로드 실패, 더미 데이터 사용:", error);
      return this.getDummyActivities();
    }
  }

  // 여행 테마 옵션 조회
  async getThemes(): Promise<TripOption[]> {
    try {
      const response = await api.get(`${this.baseURL}/themes`);
      return response.data.data || this.getDummyThemes();
    } catch (error) {
      console.warn("테마 옵션 로드 실패, 더미 데이터 사용:", error);
      return this.getDummyThemes();
    }
  }

  // 더미 데이터 - 동행자
  private getDummyCompanions(): TripOption[] {
    return [
      { id: "solo", label: "나홀로", icon: "🧘", category: "companion", order: 1 },
      { id: "couple", label: "연인과", icon: "💑", category: "companion", order: 2 },
      { id: "friend", label: "친구", icon: "👯", category: "companion", order: 3 },
      { id: "family", label: "가족", icon: "👨‍👩‍👧‍👦", category: "companion", order: 4 },
    ];
  }

  // 더미 데이터 - 활동
  private getDummyActivities(): TripOption[] {
    return [
      { id: "eat", label: "먹기", icon: "🍽️", category: "activity", order: 1 },
      { id: "photo", label: "사진", icon: "📸", category: "activity", order: 2 },
      { id: "nature", label: "자연", icon: "🏔️", category: "activity", order: 3 },
      { id: "culture", label: "문화", icon: "🏛️", category: "activity", order: 4 },
      { id: "shopping", label: "쇼핑", icon: "🛍️", category: "activity", order: 5 },
      { id: "relax", label: "휴식", icon: "☕", category: "activity", order: 6 },
    ];
  }

  // 더미 데이터 - 테마
  private getDummyThemes(): TripOption[] {
    return [
      { id: "sports", label: "운동/레저", icon: "⚽", category: "theme", order: 1 },
      { id: "healing", label: "힐링", icon: "🧘‍♀️", category: "theme", order: 2 },
      { id: "adventure", label: "모험", icon: "🏕️", category: "theme", order: 3 },
      { id: "foodie", label: "맛집투어", icon: "🍜", category: "theme", order: 4 },
      { id: "culture", label: "문화체험", icon: "🎨", category: "theme", order: 5 },
      { id: "photo", label: "사진여행", icon: "📷", category: "theme", order: 6 },
      { id: "festival", label: "축제", icon: "🎉", category: "theme", order: 7 },
      { id: "camping", label: "캠핑", icon: "⛺", category: "theme", order: 8 },
    ];
  }
}

export const tripOptionsService = new TripOptionsService();

