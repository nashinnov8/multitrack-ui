import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTracks,
  getTrack,
  createTrack,
  deleteTrack,
  logActivity,
  getTrackGaps,
  getStaleTracks,
  getActivityLogs,
} from "./api";
import { ActivityLogRequest, TrackCreateRequest } from "./schema";

export const trackKeys = {
  all: ["tracks"] as const,
  lists: () => [...trackKeys.all, "list"] as const,
  list: (page: number, size: number) =>
    [...trackKeys.lists(), { page, size }] as const,
  stale: () => [...trackKeys.all, "stale"] as const,
  details: () => [...trackKeys.all, "detail"] as const,
  detail: (id: string) => [...trackKeys.details(), id] as const,
  gaps: (id: string, page: number, size: number) =>
    [...trackKeys.detail(id), "gaps", { page, size }] as const,
  activityLogs: (id: string, page: number, size: number) =>
    [...trackKeys.detail(id), "activityLogs", { page, size }] as const,
};

export const useTracks = (page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: trackKeys.list(page, size),
    queryFn: () => getTracks(page, size),
  });
};

export const useStaleTracks = () => {
  return useQuery({
    queryKey: trackKeys.stale(),
    queryFn: getStaleTracks,
  });
};

export const useTrack = (id: string) => {
  return useQuery({
    queryKey: trackKeys.detail(id),
    queryFn: () => getTrack(id),
    enabled: !!id,
  });
};

export const useTrackGaps = (
  trackId: string,
  page: number = 0,
  size: number = 10
) => {
  return useQuery({
    queryKey: trackKeys.gaps(trackId, page, size),
    queryFn: () => getTrackGaps(trackId, page, size),
    enabled: !!trackId,
  });
};

export const useActivityLogs = (
  trackId: string,
  page: number = 0,
  size: number = 10
) => {
  return useQuery({
    queryKey: trackKeys.activityLogs(trackId, page, size),
    queryFn: () => getActivityLogs(trackId, page, size),
    enabled: !!trackId,
  });
};

export const useCreateTrack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TrackCreateRequest) => createTrack(data),
    onSuccess: () => {
      // Invalidate tracks list, user profile (EXP/Level), and badges
      queryClient.invalidateQueries({ queryKey: trackKeys.all });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["badges"] });
    },
  });
};

export const useDeleteTrack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTrack(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trackKeys.all });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["badges"] });
    },
  });
};

export const useLogActivity = (trackId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ActivityLogRequest) =>
      logActivity({ trackId, data }),
    onSuccess: () => {
      // Invalidate track details, activity logs, user profile (EXP/Level/Streaks), and badges
      queryClient.invalidateQueries({ queryKey: trackKeys.all });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["badges"] });
    },
  });
};
