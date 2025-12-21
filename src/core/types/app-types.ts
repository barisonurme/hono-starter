import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { PinoLogger } from "hono-pino";

export type TAppBindings = {
  Variables: {
    logger: PinoLogger;
    user?: {
      id: string;
      email: string;
    };
  };
};

export type TOpenApi = OpenAPIHono<TAppBindings>;

export type TRouteHandler<T extends RouteConfig> = RouteHandler<T, TAppBindings>;

export type PostgresError = {
  code?: string;
  constraint?: string;
};
