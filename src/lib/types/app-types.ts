import type { OpenAPIHono } from "@hono/zod-openapi";
import type { PinoLogger } from "hono-pino";

export type TAppBindings = {
  Variables: {
    logger: PinoLogger;
  };
};

export type TOpenApi = OpenAPIHono<TAppBindings>;
