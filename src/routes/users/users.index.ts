import createRouter from "@/lib/app/create-app";
import * as handlers from "@/routes/users/users.handlers";
import * as routers from "@/routes/users/users.route";

const route = createRouter()
  .openapi(routers.list, handlers.list)
  .openapi(routers.create, handlers.create);

export default route;
