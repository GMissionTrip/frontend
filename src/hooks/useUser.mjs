import useUserStore from "@/stores/userStore";

const useUser = () => {
  const { user, loading, setUser, setLoading, logout } = useUserStore();
  return { user, loading, setUser, setLoading, logout };
};

export default useUser;
