import { and, eq, gt, isNull } from "drizzle-orm";

import { db } from "@/db";
import { emailVerifications } from "@/db/verification-db-schema";

export class VerificationRepository {
  createCode(userId: string, code: string, expiresAt: Date) {
    return db
      .insert(emailVerifications)
      .values({ userId, code, expiresAt })
      .returning();
  }

  findValidCode(userId: string, code: string) {
    return db.query.emailVerifications.findFirst({
      where: and(
        eq(emailVerifications.userId, userId),
        eq(emailVerifications.code, code),
        isNull(emailVerifications.usedAt),
        gt(emailVerifications.expiresAt, new Date()),
      ),
    });
  }

  markUsed(id: string) {
    return db
      .update(emailVerifications)
      .set({ usedAt: new Date() })
      .where(eq(emailVerifications.id, id));
  }

  deleteByUserId(userId: string) {
    return db
      .delete(emailVerifications)
      .where(eq(emailVerifications.userId, userId));
  }
}

export const verificationRepository = new VerificationRepository();
