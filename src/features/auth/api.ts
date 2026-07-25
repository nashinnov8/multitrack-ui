import { apiClient } from "@/lib/api-client";
import { AuthResponse, LoginRequest, RegisterRequest } from "./schema";

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  return apiClient.post(`/auth/login`, data);
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  return apiClient.post(`/auth/register`, data);
};

export const verifyEmail = async (token: string): Promise<string> => {
  return apiClient.get(`/auth/verify`, { params: { token } });
};
