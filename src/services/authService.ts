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

  // 아이디/비밀번호 로그인
  async loginWithPassword(username: string, password: string): Promise<any> {
    try {
      const response = await api.post(`${this.baseURL}/login`, {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("아이디/비밀번호 로그인 실패:", error);
      throw error;
    }
  }

  // 비밀번호 변경
  async changePassword(username: string, currentPassword: string, newPassword: string): Promise<any> {
    try {
      const response = await api.post(`${this.baseURL}/change-password`, {
        username,
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error("비밀번호 변경 실패:", error);
      throw error;
    }
  }

  // 회원가입
  async register(username: string, password: string, nickname: string, email: string): Promise<any> {
    try {
      const response = await api.post(`${this.baseURL}/register`, {
        username,
        password,
        nickname,
        email,
      });
      return response.data;
    } catch (error) {
      console.error("회원가입 실패:", error);
      throw error;
    }
  }
}

export const authService = new AuthService();
