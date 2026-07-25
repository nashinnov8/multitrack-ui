import { z } from "zod";

export const trackResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable().optional(),
  currentStreak: z.number(),
  longestStreak: z.number(),
  lastActivityAt: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
  isPublic: z.boolean().nullable().optional(),
});

export type TrackResponse = z.infer<typeof trackResponseSchema>;

export const trackCreateRequestSchema = z.object({
  name: z.string().min(1, "Track name is required"),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
});

export type TrackCreateRequest = z.infer<typeof trackCreateRequestSchema>;

export const conceptResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

export type ConceptResponse = z.infer<typeof conceptResponseSchema>;

export const activityLogResponseSchema = z.object({
  id: z.string().uuid(),
  note: z.string().nullable().optional(),
  whatLearned: z.string().nullable().optional(),
  explainSimply: z.string().nullable().optional(),
  gapsFound: z.string().nullable().optional(),
  expEarned: z.number(),
  concept: conceptResponseSchema.nullable().optional(),
  createdAt: z.string(),
});

export type ActivityLogResponse = z.infer<typeof activityLogResponseSchema>;

export const activityLogRequestSchema = z.object({
  note: z.string().optional(),
  whatLearned: z.string().optional(),
  explainSimply: z.string().optional(),
  gapsFound: z.string().optional(),
  conceptId: z.string().uuid().optional(),
});

export type ActivityLogRequest = z.infer<typeof activityLogRequestSchema>;
