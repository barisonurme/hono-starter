import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

export const list = createRoute({
  tags: ["Users"],
  summary: "Get Users",
  description: "Retrieve a list of users.",
  path: "/users",
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(z.object({
        fistName: z.string(),
        lastName: z.string(),
        email: z.email(),
      })),
      "A list of users.",
    ),
  },
});

export type TListRoute = typeof list;
