import { apiClient } from "@/lib/api-client";
import { MilestoneRequest, MilestoneResponse } from "./schema";

export const getMilestones = async (
  trackId: string
): Promise<MilestoneResponse[]> => {
  return apiClient.get(`/tracks/${trackId}/milestones`);
};

export const createMilestone = async ({
  trackId,
  data,
}: {
  trackId: string;
  data: MilestoneRequest;
}): Promise<MilestoneResponse> => {
  return apiClient.post(`/tracks/${trackId}/milestones`, data);
};

export const updateMilestone = async ({
  trackId,
  milestoneId,
  data,
}: {
  trackId: string;
  milestoneId: string;
  data: MilestoneRequest;
}): Promise<MilestoneResponse> => {
  return apiClient.patch(`/tracks/${trackId}/milestones/${milestoneId}`, data);
};

export const deleteMilestone = async ({
  trackId,
  milestoneId,
}: {
  trackId: string;
  milestoneId: string;
}): Promise<void> => {
  return apiClient.delete(`/tracks/${trackId}/milestones/${milestoneId}`);
};
