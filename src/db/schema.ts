import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    email: varchar("email", { length: 255 }).notNull().unique(),
    username: varchar("username", { length: 50 }).notNull().unique(),

    passwordHash: text("password_hash").notNull(),

    isActive: boolean("is_active").default(true).notNull(),
    isVerified: boolean("is_verified").default(false).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  t => [
    index("users_email_idx").on(t.email),
    index("users_username_idx").on(t.username),
  ],
);

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
