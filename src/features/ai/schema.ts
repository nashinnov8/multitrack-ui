import { z } from "zod";

export const feynmanEvaluationRequestSchema = z.object({
  conceptName: z.string().optional(),
  explainSimply: z.string().optional(),
  whatLearned: z.string().optional(),
  note: z.string().optional(),
  lang: z.string().optional(),
});

export type FeynmanEvaluationRequest = z.infer<typeof feynmanEvaluationRequestSchema>;

export const feynmanEvaluationResponseSchema = z.object({
  score: z.number(),
  feedback: z.string(),
  jargonWarning: z.string().optional(),
  suggestedGap: z.string().optional(),
});

export type FeynmanEvaluationResponse = z.infer<typeof feynmanEvaluationResponseSchema>;
