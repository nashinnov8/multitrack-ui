import { z } from "zod";

export const milestoneResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable().optional(),
  isCompleted: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
});

export type MilestoneResponse = z.infer<typeof milestoneResponseSchema>;

export const milestoneRequestSchema = z.object({
  name: z.string().min(1, "Milestone name is required"),
  description: z.string().optional(),
  isCompleted: z.boolean().default(false),
});

export type MilestoneRequest = z.infer<typeof milestoneRequestSchema>;
