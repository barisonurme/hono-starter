import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

// Define Zod schema for users
const usersSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string(),
  passwordHash: z.string(),
  isActive: z.boolean(),
  isVerified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Infer the type from the Zod schema
export type TUser = z.infer<typeof usersSchema>;

export const list = createRoute({
  tags: ["Users"],
  summary: "Get Users",
  description: "Retrieve a list of users.",
  path: "/users",
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(usersSchema),
      "A list of users.",
    ),
  },
});

export type TListRoute = typeof list;
