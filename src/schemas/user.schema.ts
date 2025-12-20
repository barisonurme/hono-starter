import { z } from "zod";

// User schemas extracted from db/schema.ts
// These are the Zod schemas used for validation (single source of truth)

export const createUserSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  passwordHash: z.string().min(8),
});

export const userResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string(),
  username: z.string(),
  isActive: z.boolean(),
  isVerified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const userIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const updateUserSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  passwordHash: z.string().min(8).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update",
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type UserIdParams = z.infer<typeof userIdParamsSchema>;


