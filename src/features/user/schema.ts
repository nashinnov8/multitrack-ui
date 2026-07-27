import { z } from "zod";

export const userResponseSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string(),
  displayName: z.string(),
  totalExp: z.number(),
  level: z.number(),
  globalStreak: z.number(),
  streakFreezeCount: z.number().optional().default(0),
  timezone: z.string().nullable().optional(),
});

export type UserResponse = z.infer<typeof userResponseSchema>;

export const userBadgeResponseSchema = z.object({
  id: z.string().uuid(),
  badgeId: z.string().uuid(),
  badgeName: z.string(),
  iconUrl: z.string().nullable().optional(),
  expReward: z.number(),
  earnedAt: z.string(),
});

export type UserBadgeResponse = z.infer<typeof userBadgeResponseSchema>;

export const badgeResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable().optional(),
  iconUrl: z.string().nullable().optional(),
  expReward: z.number(),
});

export type BadgeResponse = z.infer<typeof badgeResponseSchema>;
