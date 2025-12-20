// Business logic (no HTTP details)
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import type { PostgresError } from "@/core/types/app-types";
import type { UserPublic } from "@/models/user.model";
import type { CreateUserInput, UpdateUserInput } from "@/schemas/user.schema";

import { BCRYPT_ROUNDS, POSTGRES_UNIQUE_VIOLATION_CODE } from "@/core/constants/constants";
import { db } from "@/db";
import { users } from "@/db/schema";
import { ConflictException, NotFoundException } from "@/exceptions/http-exceptions";

// Type guard for PostgreSQL database errors
function isPostgresError(error: unknown): error is PostgresError {
  return (
    typeof error === "object"
    && error !== null
    && "code" in error
    && typeof (error as PostgresError).code === "string"
  );
}

export type FindAllOptions = {
  limit?: number;
  offset?: number;
  isActive?: boolean;
};

export class UserService {
  /**
   * Find all users with optional pagination and filtering
   */
  async findAll(options: FindAllOptions = {}): Promise<UserPublic[]> {
    const { limit, offset, isActive } = options;

    const query = db.query.users.findMany({
      columns: {
        id: true,
        email: true,
        username: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
      where: isActive !== undefined
        ? (users, { eq }) => eq(users.isActive, isActive)
        : undefined,
      limit,
      offset,
    });

    return query;
  }

  /**
   * Find user by ID, throws NotFoundException if not found
   */
  async findById(id: string): Promise<UserPublic> {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id),
      columns: {
        id: true,
        email: true,
        username: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  /**
   * Find user by ID, returns null if not found (for internal use)
   */
  async findByIdOrNull(id: string): Promise<UserPublic | null> {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id),
      columns: {
        id: true,
        email: true,
        username: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user || null;
  }

  /**
   * Find user by email, returns null if not found
   */
  async findByEmail(email: string): Promise<UserPublic | null> {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
      columns: {
        id: true,
        email: true,
        username: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user || null;
  }

  /**
   * Find user by username, returns null if not found
   */
  async findByUsername(username: string): Promise<UserPublic | null> {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, username),
      columns: {
        id: true,
        email: true,
        username: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user || null;
  }

  /**
   * Check if email exists (optionally excluding a user ID)
   */
  async checkEmailExists(email: string, excludeUserId?: string): Promise<boolean> {
    const existing = await db.query.users.findFirst({
      where: (users, { eq, and, ne }) => {
        if (excludeUserId) {
          return and(eq(users.email, email), ne(users.id, excludeUserId));
        }
        return eq(users.email, email);
      },
      columns: { id: true },
    });

    return !!existing;
  }

  /**
   * Check if username exists (optionally excluding a user ID)
   */
  async checkUsernameExists(username: string, excludeUserId?: string): Promise<boolean> {
    const existing = await db.query.users.findFirst({
      where: (users, { eq, and, ne }) => {
        if (excludeUserId) {
          return and(eq(users.username, username), ne(users.id, excludeUserId));
        }
        return eq(users.username, username);
      },
      columns: { id: true },
    });

    return !!existing;
  }

  /**
   * Create a new user
   * Note: passwordHash field name is misleading - it expects plain password
   */
  async create(data: CreateUserInput): Promise<UserPublic> {
    // Check if email already exists
    const emailExists = await this.checkEmailExists(data.email);
    if (emailExists) {
      throw new ConflictException("Email already registered");
    }

    // Check if username already exists
    const usernameExists = await this.checkUsernameExists(data.username);
    if (usernameExists) {
      throw new ConflictException("Username already taken");
    }

    // Hash the password (field name suggests it's already hashed, but we hash it here)
    const passwordHash = await bcrypt.hash(data.passwordHash, BCRYPT_ROUNDS);

    try {
      const [user] = await db
        .insert(users)
        .values({
          email: data.email,
          username: data.username,
          passwordHash,
        })
        .returning({
          id: users.id,
          email: users.email,
          username: users.username,
          isActive: users.isActive,
          isVerified: users.isVerified,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        });

      return user;
    }
    catch (error) {
      // Handle race condition - database constraint violation
      if (isPostgresError(error) && error.code === POSTGRES_UNIQUE_VIOLATION_CODE) {
        if (error.constraint?.includes("email")) {
          throw new ConflictException("Email already registered");
        }
        if (error.constraint?.includes("username")) {
          throw new ConflictException("Username already taken");
        }
      }
      throw error;
    }
  }

  /**
   * Update an existing user
   */
  async update(id: string, data: UpdateUserInput): Promise<UserPublic> {
    // Check if user exists
    const existingUser = await this.findByIdOrNull(id);
    if (!existingUser) {
      throw new NotFoundException("User not found");
    }

    // Check for email conflicts if email is being updated
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await this.checkEmailExists(data.email, id);
      if (emailExists) {
        throw new ConflictException("Email already registered");
      }
    }

    // Check for username conflicts if username is being updated
    if (data.username && data.username !== existingUser.username) {
      const usernameExists = await this.checkUsernameExists(data.username, id);
      if (usernameExists) {
        throw new ConflictException("Username already taken");
      }
    }

    // Prepare update data
    const updateData: Partial<typeof users.$inferInsert> = {};

    if (data.email) {
      updateData.email = data.email;
    }

    if (data.username) {
      updateData.username = data.username;
    }

    // Hash password if provided (field name suggests it's already hashed, but we hash it here)
    if (data.passwordHash) {
      updateData.passwordHash = await bcrypt.hash(data.passwordHash, BCRYPT_ROUNDS);
    }

    // Only update if there's something to update
    if (Object.keys(updateData).length === 0) {
      return existingUser;
    }

    updateData.updatedAt = new Date();

    try {
      const [user] = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, id))
        .returning({
          id: users.id,
          email: users.email,
          username: users.username,
          isActive: users.isActive,
          isVerified: users.isVerified,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        });

      return user;
    }
    catch (error) {
      // Handle race condition - database constraint violation
      if (isPostgresError(error) && error.code === POSTGRES_UNIQUE_VIOLATION_CODE) {
        if (error.constraint?.includes("email")) {
          throw new ConflictException("Email already registered");
        }
        if (error.constraint?.includes("username")) {
          throw new ConflictException("Username already taken");
        }
      }
      throw error;
    }
  }

  /**
   * Delete a user by ID
   */
  async delete(id: string): Promise<void> {
    const existingUser = await this.findByIdOrNull(id);
    if (!existingUser) {
      throw new NotFoundException("User not found");
    }

    await db.delete(users).where(eq(users.id, id));
  }

  /**
   * Soft delete a user (deactivate)
   */
  async deactivate(id: string): Promise<UserPublic> {
    const _user = await this.findById(id); // This throws if not found

    const [updatedUser] = await db
      .update(users)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        isActive: users.isActive,
        isVerified: users.isVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    return updatedUser;
  }

  /**
   * Activate a user
   */
  async activate(id: string): Promise<UserPublic> {
    const _user = await this.findById(id); // This throws if not found

    const [updatedUser] = await db
      .update(users)
      .set({
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        isActive: users.isActive,
        isVerified: users.isVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    return updatedUser;
  }
}

export const userService = new UserService();
