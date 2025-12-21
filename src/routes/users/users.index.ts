import * as controllers from "@/controllers/user.controller";
import createRouter from "@/core/app/create-app";
import { authMiddleware } from "@/middlewares/auth.middleware";
import * as routers from "@/routes/users/users.route";

const route = createRouter();
route.use(routers.create.path, authMiddleware);
route.openapi(routers.create, controllers.create);

route.use(routers.list.path, authMiddleware);
route.openapi(routers.list, controllers.list);

route.use(routers.getOne.path, authMiddleware);
route.openapi(routers.getOne, controllers.getOne);

route.use(routers.update.path, authMiddleware);
route.openapi(routers.update, controllers.update);

route.use(routers.deleteRoute.path, authMiddleware);
route.openapi(routers.deleteRoute, controllers.deleteUser);

route.use(routers.activate.path, authMiddleware);
route.openapi(routers.activate, controllers.activate);

route.use(routers.deactivate.path, authMiddleware);
route.openapi(routers.deactivate, controllers.deactivate);

export default route;
