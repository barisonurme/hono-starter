import type { Context } from "hono";

import { CookieStore, sessionMiddleware } from "hono-sessions";
import { setCookie } from "hono/cookie";

import type { TAppBindings } from "@/core/types/app-types";

import env from "@/core/env";

const store = new CookieStore();

export function createSessionMiddleware() {
  return sessionMiddleware({
    store,
    encryptionKey: env.SESSION_ENCRYPTION_KEY,
    expireAfterSeconds: 900,
    cookieOptions: {
      path: "/",
      httpOnly: true,
    },
  });
}

/**
 * Parse JWT expiration string (e.g., "15m", "7d") to seconds
 */
function parseExpirationToSeconds(expiresIn: string | number | undefined): number {
  if (expiresIn === undefined) {
    throw new Error("JWT expiration is required");
  }

  if (typeof expiresIn === "number") {
    return expiresIn;
  }

  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(`Invalid expiration format: ${expiresIn}`);
  }

  const value = Number.parseInt(match[1]!, 10);
  const unit = match[2]!;

  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  };

  return value * (multipliers[unit] ?? 1);
}

/**
 * Set access token in HTTP-only cookie
 */
export function setAccessTokenCookie(c: Context<TAppBindings>, token: string) {
  const maxAge = parseExpirationToSeconds(env.JWT_ACCESS_EXPIRES_IN);
  setCookie(c, "accessToken", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

/**
 * Set refresh token in HTTP-only cookie
 */
export function setRefreshTokenCookie(c: Context<TAppBindings>, token: string) {
  const maxAge = parseExpirationToSeconds(env.JWT_REFRESH_EXPIRES_IN);
  setCookie(c, "refreshToken", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

/**
 * Clear authentication cookies
 */
export function clearAuthCookies(c: Context<TAppBindings>) {
  setCookie(c, "accessToken", "", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  setCookie(c, "refreshToken", "", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
