// Business logic (no HTTP details)
import bcrypt from "bcryptjs";

import type { UserPublic } from "@/models/user.model";
import type { CreateUserInput } from "@/schemas/user.schema";

import { db } from "@/db";
import { users } from "@/db/schema";

export class UserService {
  async findAll(): Promise<UserPublic[]> {
    const allUsers = await db.query.users.findMany({
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
    return allUsers;
  }

  async findById(id: string): Promise<UserPublic | null> {
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

  async create(data: CreateUserInput): Promise<UserPublic> {
    // Hash the password
    const passwordHash = await bcrypt.hash(data.passwordHash, 10);

    const [user] = await db
      .insert(users)
      .values({
        ...data,
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
}

export const userService = new UserService();
