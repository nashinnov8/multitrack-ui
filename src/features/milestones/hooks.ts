import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMilestones, createMilestone, updateMilestone, deleteMilestone } from "./api";
import { MilestoneRequest } from "./schema";

export const milestoneKeys = {
  all: ["milestones"] as const,
  lists: (trackId: string) => [...milestoneKeys.all, trackId, "list"] as const,
};

export const useMilestones = (trackId: string) => {
  return useQuery({
    queryKey: milestoneKeys.lists(trackId),
    queryFn: () => getMilestones(trackId),
    enabled: !!trackId,
  });
};

export const useCreateMilestone = (trackId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MilestoneRequest) => createMilestone({ trackId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: milestoneKeys.lists(trackId) });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["badges"] });
    },
  });
};

export const useUpdateMilestone = (trackId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      milestoneId,
      data,
    }: {
      milestoneId: string;
      data: MilestoneRequest;
    }) => updateMilestone({ trackId, milestoneId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: milestoneKeys.lists(trackId) });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["badges"] });
    },
  });
};

export const useDeleteMilestone = (trackId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (milestoneId: string) => deleteMilestone({ trackId, milestoneId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: milestoneKeys.lists(trackId) });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["badges"] });
    },
  });
};
