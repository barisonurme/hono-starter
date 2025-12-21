import bcrypt from "bcryptjs";

import type { PostgresError } from "../core/types/app-types";

import { BCRYPT_ROUNDS } from "../core/constants/constants";

/*
*
* Postgres Error Type Guard
*
*/
export function isPostgresError(error: unknown): error is PostgresError {
  return (
    typeof error === "object"
    && error !== null
    && "code" in error
    && typeof (error as PostgresError).code === "string"
  );
}

/*
*
* Password Hashing and Verification
*
*/
export async function hashPassword(plainPassword: string) {
  const passwordHash = await bcrypt.hash(plainPassword, BCRYPT_ROUNDS);
  return passwordHash;
}

export function verifyPassword(plainPassword: string, passwordHash: string) {
  return bcrypt.compare(plainPassword, passwordHash);
}
