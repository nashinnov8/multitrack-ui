import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getConcepts, createConcept, updateConcept, deleteConcept } from "./api";
import { ConceptRequest } from "./schema";

export const conceptKeys = {
  all: ["concepts"] as const,
  lists: (trackId: string) => [...conceptKeys.all, trackId, "list"] as const,
};

export const useConcepts = (trackId: string) => {
  return useQuery({
    queryKey: conceptKeys.lists(trackId),
    queryFn: () => getConcepts(trackId),
    enabled: !!trackId,
  });
};

export const useCreateConcept = (trackId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConceptRequest) => createConcept({ trackId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conceptKeys.lists(trackId) });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["badges"] });
    },
  });
};

export const useUpdateConcept = (trackId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conceptId,
      data,
    }: {
      conceptId: string;
      data: ConceptRequest;
    }) => updateConcept({ trackId, conceptId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conceptKeys.lists(trackId) });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["badges"] });
    },
  });
};

export const useDeleteConcept = (trackId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conceptId: string) => deleteConcept({ trackId, conceptId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conceptKeys.lists(trackId) });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["badges"] });
    },
  });
};
