import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound, serveEmojiFavicon } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";

import type { TAppBindings } from "@/core/types/app-types";

import { createSessionMiddleware } from "@/core/cookies";
import { logger } from "@/core/logger";
import { errorHandler } from "@/middlewares/error-handler.middleware";

export default function createRouter() {
  return new OpenAPIHono<TAppBindings>({
    strict: false,
    defaultHook,
  });
}

export function CreateApp() {
  const app = createRouter();
  app.use(logger());
  app.use(createSessionMiddleware());
  app.use(serveEmojiFavicon("🚀"));

  app.onError(errorHandler);
  app.notFound(notFound);

  return app;
}
