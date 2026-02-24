import * as controllers from "@/controllers/auth.controller";
import createRouter from "@/core/app/create-app";

import * as routers from "@/routes/auth/auth.route";

const route = createRouter()
  .openapi(routers.register, controllers.register)
  .openapi(routers.login, controllers.login)
  .openapi(routers.confirmLogin, controllers.confirmLogin)
  .openapi(routers.logout, controllers.logout)
  .openapi(routers.refresh, controllers.refresh);


route.openapi(routers.verifyEmail, controllers.verifyEmail);

export default route;
