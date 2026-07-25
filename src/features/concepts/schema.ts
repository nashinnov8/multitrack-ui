import { z } from "zod";

export const conceptStatusSchema = z.enum([
  "NOT_UNDERSTOOD",
  "EXPLAINED_WITH_GAPS",
  "MASTERED",
]);

export type ConceptStatus = z.infer<typeof conceptStatusSchema>;

export const conceptResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  status: conceptStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

export type ConceptResponse = z.infer<typeof conceptResponseSchema>;

export const conceptRequestSchema = z.object({
  name: z.string().min(1, "Concept name is required"),
  status: conceptStatusSchema.default("NOT_UNDERSTOOD"),
});

export type ConceptRequest = z.infer<typeof conceptRequestSchema>;
