import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import env from "@/core/env";

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

/*
*
* JWT Utils
*
*  */

export function jwtGenerateAccessToken(jwtPayload: jwt.JwtPayload, jwtOptions?: jwt.SignOptions) {
  return jwt.sign(
    jwtPayload,
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
      ...jwtOptions,
    },
  );
}

export function jwtGenerateRefreshToken(jwtPayload: jwt.JwtPayload, jwtOptions?: jwt.SignOptions) {
  return jwt.sign(
    jwtPayload,
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
      ...jwtOptions,
    },
  );
}
