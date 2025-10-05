// 게시물 타입
export interface JourneyPost {
  id: string;
  userId: string;
  user: {
    id: string;
    nickname: string;
    profileImage?: string;
    level: number;
    gender?: "male" | "female";
  };
  title: string;
  content: string;
  location: string;
  tags: string[];
  images: string[];
  likes: number;
  comments: number;
  views: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  updatedAt: string;
}

// 댓글 타입
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: {
    id: string;
    nickname: string;
    profileImage?: string;
    level: number;
  };
  content: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

// 좋아요 요청
export interface LikeRequest {
  postId: string;
}

// 댓글 작성 요청
export interface CreateCommentRequest {
  postId: string;
  content: string;
}

// 신고 요청
export interface ReportRequest {
  postId: string;
  reason: "inappropriate" | "spam" | "harassment" | "fake" | "other";
  description?: string;
}

// 아카이브 추가 요청
export interface AddToArchiveRequest {
  postId: string;
  archiveId?: string; // 특정 아카이브에 추가 (없으면 기본 아카이브)
}

// 카카오 공유 데이터
// 카카오 공유 옵션 타입
export interface KakaoShareOptions {
  objectType: "feed" | "list" | "location" | "commerce" | "text";
  content: {
    title: string;
    description: string;
    imageUrl: string;
    imageWidth?: number;
    imageHeight?: number;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  itemContent?: {
    profileText?: string;
    profileImageUrl?: string;
    titleImageUrl?: string;
    titleImageText?: string;
    titleImageCategory?: string;
  };
  buttons?: Array<{
    title: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }>;
  buttonTitle?: string;
  installTalk?: boolean;
}

// 간단한 공유용 타입 (호환성 유지)
export interface KakaoShareData {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

