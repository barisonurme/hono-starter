import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";

import type { TAppBindings } from "@/lib/types/app-types";

import { pinoLog } from "@/middleware/pino-logger";

export default function createRouter() {
  return new OpenAPIHono<TAppBindings>({
    strict: false,
    defaultHook,
  });
}

export function CreateApp() {
  const app = createRouter();
  app.use(pinoLog());
  app.use(serveEmojiFavicon("🚀"));

  app.onError(onError);
  app.notFound(notFound);

  return app;
}
