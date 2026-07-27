import { apiClient } from "@/lib/api-client";
import { FeynmanEvaluationRequest, FeynmanEvaluationResponse } from "./schema";

export const evaluateFeynman = async (data: FeynmanEvaluationRequest): Promise<FeynmanEvaluationResponse> => {
  return apiClient.post("/ai/evaluate-feynman", data);
};
