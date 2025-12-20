// Database models/DTOs
// These represent the database structure and data transfer objects

import type { users } from "@/db/schema";

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type UserPublic = Omit<User, "passwordHash">;

