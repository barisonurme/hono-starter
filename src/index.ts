import env from "@/core/env";
import index from "@/routes/index.route";
import userIndex from "@/routes/users/users.index";

import type { PostgresError } from "./core/types/app-types";

import { CreateApp } from "./core/app/create-app";
import { configureOpenAPI } from "./core/docs/configure-open-api";

const port = Number.parseInt(env.PORT || "3000", 10);

const app = CreateApp();

configureOpenAPI(app);

const routes = [index, userIndex];

routes.forEach((route) => {
  app.route("/", route);
});

export default {
  port,
  fetch: app.fetch,
};

export function isPostgresError(error: unknown): error is PostgresError {
  return (
    typeof error === "object"
    && error !== null
    && "code" in error
    && typeof (error as PostgresError).code === "string"
  );
}
