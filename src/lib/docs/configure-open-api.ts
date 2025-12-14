import { Scalar } from "@scalar/hono-api-reference";

import type { TOpenApi } from "../types/app-types";

import packageJson from "../../../package.json";

export function configureOpenAPI(app: TOpenApi) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      title: "Hono Starter API",
      version: packageJson.version,
      description: "This is a sample server Hono Starter server.",
    },
  });

  const scalarConfig = {
    defaultHttpClient: {
      targetKey: "javascript",
      clientKey: "fetch",
    },
    theme: "kepler",
    layout: "classic",
    title: "Hono Starter API Reference",
    version: packageJson.version,
    description: "This is a sample server Hono Starter server.",
    spec: {
      url: "/doc",
    },
  };

  app.get("/reference", Scalar(scalarConfig));
}
