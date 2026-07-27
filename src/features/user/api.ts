import { apiClient } from "@/lib/api-client";
import { BadgeResponse, UserBadgeResponse, UserResponse } from "./schema";

// Decode userId from JWT payload
export function getUserIdFromToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const Cookies = require("js-cookie");
    const token = Cookies.get("mt_access_token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId ?? payload.sub ?? null;
  } catch {
    return null;
  }
}

export const getUserProfile = async (userId?: string): Promise<UserResponse> => {
  const id = userId || getUserIdFromToken();
  if (!id) throw new Error("User ID not found");
  return apiClient.get(`/users/${id}`);
};

export const getUserBadges = async (userId?: string): Promise<UserBadgeResponse[]> => {
  const id = userId || getUserIdFromToken();
  if (!id) throw new Error("User ID not found");
  return apiClient.get(`/users/${id}/badges`);
};

export const getAllBadges = async (): Promise<BadgeResponse[]> => {
  return apiClient.get(`/badges`);
};

export const buyStreakFreeze = async (userId?: string): Promise<UserResponse> => {
  const id = userId || getUserIdFromToken();
  if (!id) throw new Error("User ID not found");
  return apiClient.post(`/users/${id}/buy-streak-freeze`);
};
