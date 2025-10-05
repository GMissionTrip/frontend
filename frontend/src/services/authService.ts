import api from "@/api/axiosInstance";

export interface KakaoAuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface MemberInfo {
  id: string;
  nickname: string;
  profileImage?: string;
  email?: string;
}

class AuthService {
  private baseURL = "/api/auth";

  // 카카오 인증 URL 생성
  async getAuthUrl(scope?: string): Promise<string> {
    try {
      const response = await api.get(`${this.baseURL}/authorization`, {
        params: scope ? { scope } : undefined,
      });
      return response.data.authUrl;
    } catch (error) {
      
      throw error;
    }
  }

  // 카카오 로그아웃
  async logout(): Promise<void> {
    try {
      await api.post(`${this.baseURL}/logout`);
    } catch (error) {
      
      throw error;
    }
  }

  // 카카오 계정 연결 해제
  async unlink(): Promise<{ id: string }> {
    try {
      const response = await api.get(`${this.baseURL}/unlink`);
      return response.data;
    } catch (error) {
      
      throw error;
    }
  }

  // 토큰 검증 (JWT 토큰이 유효한지 확인)
  async validateToken(): Promise<boolean> {
    try {
      await api.get(`${this.baseURL}/validate`);
      return true;
    } catch {
      return false;
    }
  }

  // 비밀번호 변경
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await api.put(`${this.baseURL}/password`, {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      
      throw error;
    }
  }
}

export const authService = new AuthService();
