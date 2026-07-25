import { z } from "zod";

export const loginRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const registerRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  displayName: z.string().min(1, "Display name is required"),
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;

export const authResponseSchema = z.object({
  token: z.string(),          // Backend field name
  refreshToken: z.string(),
  username: z.string(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;
