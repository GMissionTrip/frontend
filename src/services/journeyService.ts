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
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error("API 응답 형식이 올바르지 않습니다");
      
    } catch (error) {
      console.error("게시물 조회 실패:", error);
      throw error;
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

}

export const journeyService = new JourneyService();

