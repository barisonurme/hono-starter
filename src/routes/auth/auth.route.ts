import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, createMessageObjectSchema } from "stoker/openapi/schemas";

import { createUserSchema, loginUserSchema, selectUsersSchema } from "@/schemas/user.schema";
import { confirmLoginSchema, verifyEmailSchema } from "@/schemas/verification.schema";

export const register = createRoute({
  tags: ["Authentication"],
  summary: "Register",
  description: "Create a new user account. A verification code will be sent to the provided email.",
  path: "/auth/register",
  method: "post",
  request: {
    body: jsonContentRequired(createUserSchema, "The user to register."),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectUsersSchema,
      "User registered successfully.",
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      createMessageObjectSchema("email_or_username_already_exists"),
      "Conflict error - email or username already registered.",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(createUserSchema),
      "Validation error(s)",
    ),
  },
});

export const login = createRoute({
  tags: ["Authentication"],
  summary: "Login User",
  description: "Validate credentials and send a 6-digit code to the user's email.",
  path: "/auth/login",
  method: "post",
  request: {
    body: jsonContentRequired(loginUserSchema, "The user credentials."),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("verification_code_sent"),
      "Credentials valid — verification code sent.",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("invalid_credentials"),
      "Invalid credentials.",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("email_not_verified"),
      "Email not verified.",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(loginUserSchema),
      "Validation error(s)",
    ),
  },
});

export const confirmLogin = createRoute({
  tags: ["Authentication"],
  summary: "Confirm Login",
  description: "Submit the 6-digit code received by email to complete login and receive auth cookies.",
  path: "/auth/confirm-login",
  method: "post",
  request: {
    body: jsonContentRequired(confirmLoginSchema, "Email and verification code."),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUsersSchema,
      "Login confirmed — auth cookies set.",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("invalid_or_expired_login_code"),
      "Invalid or expired code.",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("invalid_credentials"),
      "User not found.",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(confirmLoginSchema),
      "Validation error(s)",
    ),
  },
});

export const logout = createRoute({
  tags: ["Authentication"],
  summary: "Logout User",
  description: "Logout a user by clearing authentication cookies.",
  path: "/auth/logout",
  method: "post",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("logout_successful"),
      "User logout successful.",
    ),
  },
});

export const refresh = createRoute({
  tags: ["Authentication"],
  summary: "Refresh Access Token",
  description: "Refresh the access token using the refresh token from cookies.",
  path: "/auth/refresh",
  method: "post",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("token_refreshed"),
      "Access token refreshed successfully.",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("invalid_or_expired_refresh_token"),
      "Unauthorized - invalid or expired refresh token.",
    ),
  },
});

export const verifyEmail = createRoute({
  tags: ["Authentication"],
  summary: "Verify Email",
  description: "Verify email address using the 6-digit code sent after registration.",
  path: "/auth/verify-email",
  method: "post",
  request: {
    body: jsonContentRequired(verifyEmailSchema, "Email and verification code."),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("email_verified"),
      "Email verified successfully.",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("invalid_or_expired_verification_code"),
      "Invalid or expired verification code.",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("user_not_found"),
      "User not found.",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(verifyEmailSchema),
      "Validation error(s)",
    ),
  },
});

export type TRegisterRoute = typeof register;
export type TLoginRoute = typeof login;
export type TConfirmLoginRoute = typeof confirmLogin;
export type TLogoutRoute = typeof logout;
export type TRefreshRoute = typeof refresh;

export type TVerifyEmailRoute = typeof verifyEmail;
