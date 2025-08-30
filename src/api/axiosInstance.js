import axios from "axios";
import useUserStore from "@/stores/userStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
});

api.interceptors.request.use(
  (config) => {
    const { user } = useUserStore.getState();
    const token = user?.access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("인증 오류 발생");
    }
    return Promise.reject(error);
  },
);

export default api;
