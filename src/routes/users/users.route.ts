import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { notFoundSchema } from "@/core/constants/constants";
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

export const getOne = createRoute({
  path: "/users/{id}",
  tags: ["Users"],
  summary: "Get User Details",
  description: "Get user details.",
  method: "get",
  requests: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUsersSchema,
      "User details.",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      HttpStatusPhrases.NOT_FOUND,
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id parameter.",
    ),
  },
});

export type TListRoute = typeof list;
export type TCreateRoute = typeof create;
export type TGetOneRoute = typeof getOne;
