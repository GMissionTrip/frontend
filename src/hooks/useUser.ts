import { useEffect, useState } from "react";
import useUserStore from "@/stores/userStore";
import { User } from "@/types";

interface UseUserReturn {
  user: User | null;
  loading: boolean;
  isLoading: boolean; // hydration 로딩 상태
  setUser: (userData: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
}

const useUser = (): UseUserReturn => {
  const { user, loading, setUser, setLoading, logout } = useUserStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Zustand persist가 localStorage에서 데이터를 복원할 때까지 대기
    const unsubscribe = useUserStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    // 이미 hydration이 완료된 경우
    if (useUserStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    return () => {
      unsubscribe();
    };
  }, []);

  // hydration이 완료되지 않았으면 로딩 상태 반환
  const isLoading = !isHydrated || loading;

  return { user, loading, isLoading, setUser, setLoading, logout };
};

export default useUser;
