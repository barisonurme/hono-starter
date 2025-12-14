import env from "@/env";
import index from "@/routes/index.route";

import { configureOpenAPI } from "./lib/docs/configure-open-api";
import createRouter from "./lib/app/create-app";

const port = Number.parseInt(env.PORT || "3000", 10);

const app = createRouter();

configureOpenAPI(app);

const routes = [index];

routes.forEach((route) => {
  app.route("/", route);
});

export default {
  port,
  fetch: app.fetch,
};
