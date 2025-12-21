import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, createMessageObjectSchema } from "stoker/openapi/schemas";

import { loginUserSchema, selectUsersSchema } from "@/schemas/user.schema";

export const login = createRoute({
  tags: ["Authentication"],
  summary: "Login User",
  description: "Login a user.",
  path: "/auth/login",
  method: "post",
  request: {
    body: jsonContentRequired(loginUserSchema, "The user to login."),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUsersSchema,
      "User login successful.",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("Email or username not found"),
      "Not found error - email or username not found.",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(loginUserSchema),
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
      createMessageObjectSchema("Logout successful"),
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
      createMessageObjectSchema("Token refreshed successfully"),
      "Access token refreshed successfully.",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Invalid or expired refresh token"),
      "Unauthorized - invalid or expired refresh token.",
    ),
  },
});

export type TLoginRoute = typeof login;
export type TLogoutRoute = typeof logout;
export type TRefreshRoute = typeof refresh;
