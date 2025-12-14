import env from "@/env";
import index from "@/routes/index.route";
import userIndex from "@/routes/users/users.index";

import createRouter from "./lib/app/create-app";
import { configureOpenAPI } from "./lib/docs/configure-open-api";

const port = Number.parseInt(env.PORT || "3000", 10);

const app = createRouter();

configureOpenAPI(app);

const routes = [index, userIndex];

routes.forEach((route) => {
  app.route("/", route);
});

export default {
  port,
  fetch: app.fetch,
};
