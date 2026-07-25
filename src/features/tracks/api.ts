import { apiClient } from "@/lib/api-client";
import { PaginatedResponse } from "@/types";
import {
  ActivityLogRequest,
  ActivityLogResponse,
  TrackCreateRequest,
  TrackResponse,
} from "./schema";

// Decode userId from JWT payload (client-side)
function getUserIdFromToken(): string | null {
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

export const getTracks = async (
  page: number = 0,
  size: number = 10
): Promise<PaginatedResponse<TrackResponse>> => {
  const userId = getUserIdFromToken();
  if (!userId) throw new Error("Not authenticated");
  return apiClient.get(`/tracks/user/${userId}/paged`, {
    params: { page, size },
  });
};

export const getStaleTracks = async (): Promise<TrackResponse[]> => {
  return apiClient.get(`/tracks/stale`);
};

export const getTrack = async (id: string): Promise<TrackResponse> => {
  return apiClient.get(`/tracks/${id}`);
};

export const createTrack = async (
  data: TrackCreateRequest
): Promise<TrackResponse> => {
  return apiClient.post(`/tracks`, data);
};

export const deleteTrack = async (id: string): Promise<void> => {
  return apiClient.delete(`/tracks/${id}`);
};

export const logActivity = async ({
  trackId,
  data,
}: {
  trackId: string;
  data: ActivityLogRequest;
}): Promise<ActivityLogResponse> => {
  return apiClient.post(`/tracks/${trackId}/checkin`, data);
};

export const getTrackGaps = async (
  trackId: string,
  page: number = 0,
  size: number = 10
): Promise<PaginatedResponse<ActivityLogResponse>> => {
  return apiClient.get(`/tracks/${trackId}/gaps/paged`, {
    params: { page, size },
  });
};

export const getActivityLogs = async (
  trackId: string,
  page: number = 0,
  size: number = 10
): Promise<PaginatedResponse<ActivityLogResponse>> => {
  return apiClient.get(`/tracks/${trackId}/activity-logs`, {
    params: { page, size },
  });
};
