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

export type TLoginRoute = typeof login;
