import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import useUserStore from "@/stores/userStore";

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
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
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("인증 오류 발생");
    }
    return Promise.reject(error);
  },
);

export default api;
