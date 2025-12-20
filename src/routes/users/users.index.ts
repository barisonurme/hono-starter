import * as controllers from "@/controllers/user.controller";
import createRouter from "@/core/app/create-app";
import * as routers from "@/routes/users/users.route";

const route = createRouter()
  .openapi(routers.list, controllers.list)
  .openapi(routers.create, controllers.create)
  .openapi(routers.getOne, controllers.getOne);

export default route;
