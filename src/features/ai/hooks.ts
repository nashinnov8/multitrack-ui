import { useMutation } from "@tanstack/react-query";
import { evaluateFeynman } from "./api";
import { FeynmanEvaluationRequest } from "./schema";

export const useEvaluateFeynman = () => {
  return useMutation({
    mutationFn: (data: FeynmanEvaluationRequest) => evaluateFeynman(data),
  });
};
