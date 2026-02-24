import { getCookie } from "hono/cookie";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { TRouteHandler } from "@/core/types/app-types";
import type { TConfirmLoginRoute, TLoginRoute, TLogoutRoute, TRefreshRoute, TRegisterRoute, TVerifyEmailRoute } from "@/routes/auth/auth.route";

import { clearAuthCookies, setAccessTokenCookie, setRefreshTokenCookie } from "@/core/cookies";
import { UnauthorizedException } from "@/exceptions/http-exceptions";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { verificationService } from "@/services/verification.service";

export const register: TRouteHandler<TRegisterRoute> = async (c) => {
  const data = c.req.valid("json");
  const user = await userService.create(data);
  return c.json(user, HttpStatusCodes.CREATED);
};

export const login: TRouteHandler<TLoginRoute> = async (c) => {
  const { email, passwordHash } = c.req.valid("json");
  await authService.validatePassword(email, passwordHash, true);
  return c.json({ message: "Verification code sent to email" }, HttpStatusCodes.OK);
};

export const confirmLogin: TRouteHandler<TConfirmLoginRoute> = async (c) => {
  const { email, code } = c.req.valid("json");
  const { user, accessToken, refreshToken } = await authService.confirmLogin(email, code);
  setAccessTokenCookie(c, accessToken);
  setRefreshTokenCookie(c, refreshToken);
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


export const verifyEmail: TRouteHandler<TVerifyEmailRoute> = async (c) => {
  const { email, code } = c.req.valid("json");
  await verificationService.verifyCode(email, code);
  return c.json({ message: "Email verified successfully" }, HttpStatusCodes.OK);
};
