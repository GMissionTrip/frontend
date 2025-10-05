import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface UserState {
  user: User | null;
  loading: boolean;
  setUser: (userData: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
}

// 쿠키 설정 헬퍼 함수
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window === 'undefined') {
    return;
  }
  
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const cookieString = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  document.cookie = cookieString;
};

const deleteCookie = (name: string) => {
  if (typeof window === 'undefined') return;
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      setUser: (userData) => {
        set({ user: userData });
        
        // 사용자 정보를 쿠키에도 저장 (미들웨어에서 사용)
        if (userData) {
          const userString = JSON.stringify(userData);
          setCookie('user', userString);
        } else {
          deleteCookie('user');
        }
      },
      setLoading: (isLoading) => {
        set({ loading: isLoading });
      },
      logout: () => {
        set({ user: null });
        deleteCookie('user');
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

export default useUserStore;
