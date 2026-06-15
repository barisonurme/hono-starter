import { getCookie } from "hono/cookie";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { TRouteHandler } from "@/core/types/app-types";
import type { TConfirmLoginRoute, TLoginRoute, TLogoutRoute, TRefreshRoute, TRegisterRoute, TVerifyEmailRoute } from "@/routes/auth/auth.route";

import { clearAuthCookies, setAccessTokenCookie, setRefreshTokenCookie } from "@/core/cookies";
import { UnauthorizedException } from "@/exceptions/http-exceptions";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { verificationService } from "@/services/verification.service";
import { jwtGenerateAccessToken, jwtGenerateRefreshToken } from "@/utils";

export const register: TRouteHandler<TRegisterRoute> = async (c) => {
  const data = c.req.valid("json");
  const user = await userService.create(data);
  return c.json(user, HttpStatusCodes.CREATED);
};

export const login: TRouteHandler<TLoginRoute> = async (c) => {
  const { email, password } = c.req.valid("json");
  await authService.validatePassword(email, password, true);
  return c.json({ message: "verification_code_sent" }, HttpStatusCodes.OK);
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
  return c.json({ message: "logout_successful" }, HttpStatusCodes.OK);
};

export const refresh: TRouteHandler<TRefreshRoute> = async (c) => {
  const refreshToken = getCookie(c, "refreshToken");

  if (!refreshToken) {
    throw new UnauthorizedException("refresh_token_not_found");
  }

  const { accessToken, refreshToken: newRefreshToken } = await authService.refreshTokens(refreshToken);

  // Set new tokens in HTTP-only cookies
  setAccessTokenCookie(c, accessToken);
  setRefreshTokenCookie(c, newRefreshToken);

  return c.json({ message: "token_refreshed" }, HttpStatusCodes.OK);
};

export const verifyEmail: TRouteHandler<TVerifyEmailRoute> = async (c) => {
  const { email, code } = c.req.valid("json");
  const user = await verificationService.verifyCode(email, code);
  const jwtPayload = { id: user.id, email: user.email };

  // Set new tokens in HTTP-only cookies
  setAccessTokenCookie(c, jwtGenerateAccessToken(jwtPayload));
  setRefreshTokenCookie(c, jwtGenerateRefreshToken(jwtPayload));

  return c.json({ message: "email_verified" }, HttpStatusCodes.OK);
};
