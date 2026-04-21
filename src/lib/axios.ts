import { secureStorage } from "@/src/lib/secureStorage";
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Attach token to every request
client.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await secureStorage.getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;

    if (__DEV__) {
      console.log(
        "[API]",
        config.method?.toUpperCase(),
        `${config.baseURL ?? ""}${config.url ?? ""}`,
        { params: config.params, data: config.data },
      );
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 401 → clear session and let app redirect via store
client.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(
        "[API RESPONSE]",
        response.config.url,
        response.status,
        response.data,
      );
    }
    return response;
  },
  async (error: AxiosError) => {
    if (__DEV__) {
      console.log(
        "[API ERROR]",
        error.config?.url,
        error.response?.status,
        error.response?.data || error.message,
      );
    }

    if (error.response?.status === 401) {
      await secureStorage.clearAll();
      const { useAuthStore } = await import("@/src/features/auth/auth.store");
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  },
);

export default client;
