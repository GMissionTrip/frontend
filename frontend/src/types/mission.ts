// 미션 타입 정의
export type MissionType =
  | "photo_upload" // 사진 업로드
  | "temperature" // 온도계
  | "text_input" // 텍스트 입력
  | "pose_challenge" // 포즈 챌린지
  | "random_challenge" // 랜덤 챌린지
  | "film_photos" // 필름 사진
  | "roulette"; // 룰렛

export type MissionStatus = "locked" | "unlocked" | "in_progress" | "completed";

// 미션 인터페이스
export interface Mission {
  id: string;
  type: MissionType;
  title: string;
  category: string;
  description: string;
  points: number;
  icon: string;
  status: MissionStatus;
  tripId: string;
  requirements?: MissionRequirement;
  submittedData?: MissionSubmission;
  completedAt?: string;
  gradient?: string; // 헤더 그라디언트 색상
}

// 미션 요구사항
export interface MissionRequirement {
  photoCount?: number; // 필요한 사진 수
  minTextLength?: number; // 최소 텍스트 길이
  maxTextLength?: number; // 최대 텍스트 길이
  temperatureRange?: [number, number]; // 온도 범위
  poseImage?: string; // 포즈 이미지 URL
  challengeOptions?: string[]; // 챌린지 옵션들
}

// 미션 제출 데이터
export interface MissionSubmission {
  photos?: string[]; // 업로드된 사진 URLs
  text?: string; // 입력된 텍스트
  temperature?: number; // 선택된 온도
  selectedOption?: string; // 선택된 옵션
  submittedAt: string;
}

// 여행 카드 뜯기
export interface TripCard {
  id: string;
  title: string;
  coverImage: string;
  isRevealed: boolean;
}

// 룰렛 옵션
export interface RouletteOption {
  id: string;
  text: string;
  color: string;
  percentage: number;
}

