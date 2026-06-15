import type { MiddlewareHandler } from "hono";

import { getCookie } from "hono/cookie";

import type { TAppBindings } from "@/core/types/app-types";

import { UnauthorizedException } from "@/exceptions/http-exceptions";
import { jwtVerifyToken } from "@/utils";

/**
 * Authentication middleware that verifies the access token from cookies
 * and adds user information to the context
 */
export const authMiddleware: MiddlewareHandler<TAppBindings> = async (c, next) => {
  const accessToken = getCookie(c, "accessToken");

  if (!accessToken) {
    throw new UnauthorizedException("access_token_not_found");
  }

  try {
    const decoded = jwtVerifyToken(accessToken);

    if (!decoded.id || !decoded.email) {
      throw new UnauthorizedException("invalid_token_payload");
    }

    // Add user info to context
    c.set("user", {
      id: decoded.id as string,
      email: decoded.email as string,
    });

    await next();
  }
  catch (error) {
    if (error instanceof UnauthorizedException) {
      throw error;
    }
    throw new UnauthorizedException("invalid_or_expired_access_token");
  }
};
