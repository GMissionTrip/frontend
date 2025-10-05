import api from "@/api/axiosInstance";
import {
  JourneyPost,
  Comment,
  LikeRequest,
  CreateCommentRequest,
  ReportRequest,
  AddToArchiveRequest,
} from "@/types/journey";

class JourneyService {
  private baseURL = "/api/journey";

  // 게시물 목록 조회
  async getPosts(type: "feed" | "popular" = "feed", page = 1, limit = 10): Promise<JourneyPost[]> {
    try {
      const response = await api.get(`${this.baseURL}/posts`, {
        params: { type, page, limit },
      });
      return response.data.data || this.getDummyPosts();
    } catch (error) {
      console.warn("게시물 조회 실패, 더미 데이터 사용:", error);
      return this.getDummyPosts();
    }
  }

  // 게시물 상세 조회 (조회수 증가)
  async getPost(postId: string): Promise<JourneyPost> {
    try {
      const response = await api.get(`${this.baseURL}/posts/${postId}`);
      return response.data.data;
    } catch (error) {
      
      throw error;
    }
  }

  // 좋아요 토글
  async toggleLike(postId: string): Promise<{ isLiked: boolean; likes: number }> {
    try {
      const response = await api.post(`${this.baseURL}/posts/${postId}/like`);
      return response.data.data;
    } catch (error) {
      
      throw error;
    }
  }

  // 북마크 토글
  async toggleBookmark(postId: string): Promise<{ isBookmarked: boolean }> {
    try {
      const response = await api.post(`${this.baseURL}/posts/${postId}/bookmark`);
      return response.data.data;
    } catch (error) {
      
      throw error;
    }
  }

  // 댓글 목록 조회
  async getComments(postId: string): Promise<Comment[]> {
    try {
      const response = await api.get(`${this.baseURL}/posts/${postId}/comments`);
      return response.data.data || [];
    } catch (error) {
      console.warn("댓글 조회 실패:", error);
      return [];
    }
  }

  // 댓글 작성
  async createComment(data: CreateCommentRequest): Promise<Comment> {
    try {
      const response = await api.post(`${this.baseURL}/comments`, data);
      return response.data.data;
    } catch (error) {
      
      throw error;
    }
  }

  // 댓글 삭제
  async deleteComment(commentId: string): Promise<void> {
    try {
      await api.delete(`${this.baseURL}/comments/${commentId}`);
    } catch (error) {
      
      throw error;
    }
  }

  // 댓글 좋아요 토글
  async toggleCommentLike(commentId: string): Promise<{ isLiked: boolean; likes: number }> {
    try {
      const response = await api.post(`${this.baseURL}/comments/${commentId}/like`);
      return response.data.data;
    } catch (error) {
      
      throw error;
    }
  }

  // 게시물 신고
  async reportPost(data: ReportRequest): Promise<void> {
    try {
      await api.post(`${this.baseURL}/reports`, data);
    } catch (error) {
      
      throw error;
    }
  }

  // 내 아카이브에 추가
  async addToArchive(data: AddToArchiveRequest): Promise<void> {
    try {
      await api.post(`${this.baseURL}/archive/add`, data);
    } catch (error) {
      
      throw error;
    }
  }

  // 더미 데이터
  private getDummyPosts(): JourneyPost[] {
    return [
      {
        id: "1",
        userId: "user1",
        user: {
          id: "user1",
          nickname: "Liam",
          profileImage: undefined,
          level: 27,
          gender: "male",
        },
        title: "제주도 3박 4일 완벽 가이드",
        content: "제주도에서 정말 즐거운 시간을 보냈습니다. 추천 코스와 맛집을 공유합니다!",
        location: "제주도 완산읍",
        tags: ["제주도", "섬산입을봄", "맛집"],
        images: ["https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?fit=crop&w=600&q=80"],
        likes: 127,
        comments: 23,
        views: 1542,
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "2",
        userId: "user2",
        user: {
          id: "user2",
          nickname: "Emma",
          profileImage: undefined,
          level: 15,
          gender: "female",
        },
        title: "강원도 겨울 여행 추천 코스",
        content: "눈 내리는 강원도의 겨울은 정말 아름다워요. 속초와 강릉을 다녀왔습니다.",
        location: "강원도 속초시",
        tags: ["강원도", "속초", "겨울여행"],
        images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?fit=crop&w=600&q=80"],
        likes: 89,
        comments: 15,
        views: 892,
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "3",
        userId: "user3",
        user: {
          id: "user3",
          nickname: "Noah",
          profileImage: undefined,
          level: 42,
          gender: "male",
        },
        title: "부산 맛집 투어 완전 정복",
        content: "부산의 숨은 맛집들을 찾아다니며 먹방 투어를 했습니다. 해운대는 역시 최고!",
        location: "부산 해운대구",
        tags: ["부산", "맛집투어", "해운대"],
        images: ["https://images.unsplash.com/photo-1528127269322-539801943592?fit=crop&w=600&q=80"],
        likes: 256,
        comments: 48,
        views: 3241,
        isLiked: true,
        isBookmarked: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }
}

export const journeyService = new JourneyService();

