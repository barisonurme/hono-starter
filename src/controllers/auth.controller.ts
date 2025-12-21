import { getCookie } from "hono/cookie";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { TRouteHandler } from "@/core/types/app-types";
import type { TLoginRoute, TLogoutRoute, TRefreshRoute } from "@/routes/auth/auth.route";

import { clearAuthCookies, setAccessTokenCookie, setRefreshTokenCookie } from "@/core/cookies";
import { UnauthorizedException } from "@/exceptions/http-exceptions";
import { authService } from "@/services/auth.service";

export const login: TRouteHandler<TLoginRoute> = async (c) => {
  const data = c.req.valid("json");
  const { email, passwordHash } = data;

  // Validate credentials - throws exception if invalid (cookies won't be set)
  const { user, accessToken, refreshToken } = await authService.validatePassword(email, passwordHash, true);

  // Set tokens in HTTP-only cookies (only reached if validation succeeds)
  setAccessTokenCookie(c, accessToken);
  setRefreshTokenCookie(c, refreshToken);

  // Return user without tokens
  return c.json(user, HttpStatusCodes.OK);
};

export const logout: TRouteHandler<TLogoutRoute> = async (c) => {
  clearAuthCookies(c);
  return c.json({ message: "Logout successful" }, HttpStatusCodes.OK);
};

export const refresh: TRouteHandler<TRefreshRoute> = async (c) => {
  const refreshToken = getCookie(c, "refreshToken");

  if (!refreshToken) {
    throw new UnauthorizedException("Refresh token not found");
  }

  const { accessToken, refreshToken: newRefreshToken } = await authService.refreshTokens(refreshToken);

  // Set new tokens in HTTP-only cookies
  setAccessTokenCookie(c, accessToken);
  setRefreshTokenCookie(c, newRefreshToken);

  return c.json({ message: "Token refreshed successfully" }, HttpStatusCodes.OK);
};
