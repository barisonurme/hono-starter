import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

import { insertUsersSchema, selectUsersSchema } from "@/db/schema";

export const list = createRoute({
  tags: ["Users"],
  summary: "Get Users",
  description: "Retrieve a list of users.",
  path: "/users",
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectUsersSchema),
      "A list of users.",
    ),
  },
});

export const create = createRoute({
  tags: ["Users"],
  summary: "Create User",
  description: "Create a new user.",
  path: "/users",
  method: "post",
  request: {
    body: jsonContentRequired(insertUsersSchema, "The user to create."),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUsersSchema,
      "The created user.",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertUsersSchema),
      "Validation error(s)",
    ),
  },
});

export type TListRoute = typeof list;
export type TCreateRoute = typeof create;
