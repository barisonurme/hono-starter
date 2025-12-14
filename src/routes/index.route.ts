import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import createRouter from "@/lib/types/create-app";

const router = createRouter().openapi(createRoute({
  tags: ["System"],
  method: "get",
  path: "/health",
  summary: "Health Check",
  description: "Returns a simple health check response.",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("OK"),
      "A simple health check response indicating the service is operational.",
    ),
  },
}), (c) => {
  return c.json({ message: "OK" }, HttpStatusCodes.OK);
});

export default router;
