import { eq } from "drizzle-orm";

// User repository: handles all DB operations for users
import { db } from "@/db";
import { users } from "@/db/user-db-schema";
import { verifyPassword } from "@/utils";

export class UserRepository {
  findAll({ limit, offset, isActive }: { limit?: number; offset?: number; isActive?: boolean } = {}) {
    return db.query.users.findMany({
      columns: {
        id: true,
        email: true,
        username: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
      where: isActive !== undefined ? (users, { eq }) => eq(users.isActive, isActive) : undefined,
      limit,
      offset,
    });
  }

  findById(id: string) {
    return db.query.users.findFirst({
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
  }

  findByEmail(email: string) {
    return db.query.users.findFirst({
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
  }

  findByEmailWithPassword(email: string) {
    return db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
      columns: {
        id: true,
        email: true,
        username: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        passwordHash: true,
      },
    });
  }

  findByUsername(username: string) {
    return db.query.users.findFirst({
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
  }

  checkEmailExists(email: string, excludeUserId?: string) {
    return db.query.users.findFirst({
      where: (users, { eq, and, ne }) => {
        if (excludeUserId) {
          return and(eq(users.email, email), ne(users.id, excludeUserId));
        }
        return eq(users.email, email);
      },
      columns: { id: true },
    });
  }

  checkUsernameExists(username: string, excludeUserId?: string) {
    return db.query.users.findFirst({
      where: (users, { eq, and, ne }) => {
        if (excludeUserId) {
          return and(eq(users.username, username), ne(users.id, excludeUserId));
        }
        return eq(users.username, username);
      },
      columns: { id: true },
    });
  }

  insertUser(data: typeof users.$inferInsert) {
    return db.insert(users).values(data).returning({
      id: users.id,
      email: users.email,
      username: users.username,
      isActive: users.isActive,
      isVerified: users.isVerified,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });
  }

  updateUser(id: string, data: Partial<typeof users.$inferInsert>) {
    return db.update(users).set(data).where(eq(users.id, id)).returning({
      id: users.id,
      email: users.email,
      username: users.username,
      isActive: users.isActive,
      isVerified: users.isVerified,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });
  }

  async validatePasswordWithEmail(email: string, password: string) {
    const user = await this.findByEmailWithPassword(email);
    if (!user) {
      return false;
    }

    return verifyPassword(password, user.passwordHash);
  }

  deleteUser(id: string) {
    return db.delete(users).where(eq(users.id, id));
  }
}

export const userRepository = new UserRepository();
