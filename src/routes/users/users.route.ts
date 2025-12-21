import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, createMessageObjectSchema, IdUUIDParamsSchema } from "stoker/openapi/schemas";

import { notFoundSchema } from "@/core/constants/constants";
import { insertUsersSchema, selectUsersSchema, updateUserSchema } from "@/schemas/user.schema";

// Query parameters schema for list endpoint
const listUsersQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
  offset: z.coerce.number().int().min(0).default(0).optional(),
  isActive: z.coerce.boolean().optional(),
});

export const list = createRoute({
  tags: ["Users"],
  summary: "Get Users",
  description: "Retrieve a paginated list of users with optional filtering.",
  path: "/users",
  method: "get",
  request: {
    query: listUsersQuerySchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectUsersSchema),
      "A paginated list of users.",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(listUsersQuerySchema),
      "Invalid query parameters.",
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
    [HttpStatusCodes.CREATED]: jsonContent(
      selectUsersSchema,
      "The created user.",
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      createMessageObjectSchema("Email or username already exists"),
      "Conflict error - email or username already registered.",
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
  request: {
    params: IdUUIDParamsSchema,
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
      createErrorSchema(IdUUIDParamsSchema),
      "Invalid id parameter.",
    ),
  },
});

export const update = createRoute({
  tags: ["Users"],
  summary: "Update User",
  description: "Update an existing user by ID.",
  path: "/users/{id}",
  method: "patch",
  request: {
    params: IdUUIDParamsSchema,
    body: jsonContentRequired(updateUserSchema, "The user data to update."),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUsersSchema,
      "The updated user.",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      HttpStatusPhrases.NOT_FOUND,
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      createMessageObjectSchema("Email or username already exists"),
      "Conflict error - email or username already registered.",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(z.object({ params: IdUUIDParamsSchema, body: updateUserSchema })),
      "Validation error(s)",
    ),
  },
});

export const deleteRoute = createRoute({
  tags: ["Users"],
  summary: "Delete User",
  description: "Permanently delete a user by ID.",
  path: "/users/{id}",
  method: "delete",
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "User successfully deleted.",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      HttpStatusPhrases.NOT_FOUND,
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdUUIDParamsSchema),
      "Invalid id parameter.",
    ),
  },
});

export const activate = createRoute({
  tags: ["Users"],
  summary: "Activate User",
  description: "Activate a user account by setting isActive to true.",
  path: "/users/{id}/activate",
  method: "patch",
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUsersSchema,
      "The activated user.",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      HttpStatusPhrases.NOT_FOUND,
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdUUIDParamsSchema),
      "Invalid id parameter.",
    ),
  },
});

export const deactivate = createRoute({
  tags: ["Users"],
  summary: "Deactivate User",
  description: "Deactivate a user account by setting isActive to false.",
  path: "/users/{id}/deactivate",
  method: "patch",
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUsersSchema,
      "The deactivated user.",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      HttpStatusPhrases.NOT_FOUND,
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdUUIDParamsSchema),
      "Invalid id parameter.",
    ),
  },
});

export type TListRoute = typeof list;
export type TCreateRoute = typeof create;
export type TGetOneRoute = typeof getOne;
export type TUpdateRoute = typeof update;
export type TDeleteRoute = typeof deleteRoute;
export type TActivateRoute = typeof activate;
export type TDeactivateRoute = typeof deactivate;
