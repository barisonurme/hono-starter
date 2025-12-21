import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { users } from "@/db/user-db-schema";

// User schemas extracted from db/schema.ts
// These are the Zod schemas used for validation (single source of truth)

export const createUserSchema = createInsertSchema(users, {
  username: schema => schema.min(3),
  email: schema => schema.email(),
  passwordHash: schema => schema.min(8),
}).omit({
  id: true,
  isActive: true,
  isVerified: true,
  createdAt: true,
  updatedAt: true,
});

export const userResponseSchema = createSelectSchema(users).omit({
  passwordHash: true,
});

export const userIdParamsSchema = createSelectSchema(users).pick({
  id: true,
});

export const updateUserSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  passwordHash: z.string().min(8).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update",
});

export const selectUsersSchema = createSelectSchema(users).omit({
  passwordHash: true,
});

export const insertUsersSchema = createInsertSchema(users, {
  username: schema => schema.min(3),
  email: schema => schema.email(),
  passwordHash: schema => schema.min(8),
}).omit({
  id: true,
  isActive: true,
  isVerified: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type UserIdParams = z.infer<typeof userIdParamsSchema>;
