import { apiClient } from "@/lib/api-client";
import { ConceptRequest, ConceptResponse } from "./schema";

export const getConcepts = async (
  trackId: string
): Promise<ConceptResponse[]> => {
  return apiClient.get(`/tracks/${trackId}/concepts`);
};

export const createConcept = async ({
  trackId,
  data,
}: {
  trackId: string;
  data: ConceptRequest;
}): Promise<ConceptResponse> => {
  return apiClient.post(`/tracks/${trackId}/concepts`, data);
};

export const updateConcept = async ({
  trackId,
  conceptId,
  data,
}: {
  trackId: string;
  conceptId: string;
  data: ConceptRequest;
}): Promise<ConceptResponse> => {
  return apiClient.patch(`/tracks/${trackId}/concepts/${conceptId}`, data);
};

export const deleteConcept = async ({
  trackId,
  conceptId,
}: {
  trackId: string;
  conceptId: string;
}): Promise<void> => {
  return apiClient.delete(`/tracks/${trackId}/concepts/${conceptId}`);
};
