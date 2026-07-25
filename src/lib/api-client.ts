import axios from "axios";
import { tokenStorage } from "./token";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1",
  headers: { "Content-Type": "application/json" },
});

// Attach Bearer token on every request
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Unwrap ApiResponse { message, data } and handle 401 globally
apiClient.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body && typeof body === "object" && "data" in body && "message" in body) {
      return body.data;
    }
    return body;
  },
  (error) => {
    const status = error.response?.status;
    if (status === 401 && typeof window !== "undefined") {
      const isAuthPage = ["/login", "/signup", "/forgot-password"].some((p) =>
        window.location.pathname.startsWith(p)
      );
      if (!isAuthPage) {
        tokenStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
