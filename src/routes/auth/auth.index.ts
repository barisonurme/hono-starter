import * as controllers from "@/controllers/auth.controller";
import createRouter from "@/core/app/create-app";
import * as routers from "@/routes/auth/auth.route";

const route = createRouter()
  .openapi(routers.login, controllers.login)
  .openapi(routers.logout, controllers.logout)
  .openapi(routers.refresh, controllers.refresh);

export default route;
