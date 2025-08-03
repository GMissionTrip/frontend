import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      loading: false,
      setUser: (userData) => set({ user: userData }),
      setLoading: (isLoading) => set({ loading: isLoading }),
      logout: () => set({ user: null }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

export default useUserStore;
