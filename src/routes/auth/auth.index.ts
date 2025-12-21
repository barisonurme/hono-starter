import * as controllers from "@/controllers/auth.controller";
import createRouter from "@/core/app/create-app";
import * as routers from "@/routes/auth/auth.route";

const route = createRouter()
  .openapi(routers.login, controllers.login);

export default route;
