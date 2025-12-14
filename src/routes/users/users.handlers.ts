import * as HttpStatusCodes from "stoker/http-status-codes";

import type { TRouteHandler } from "@/lib/types/app-types";
import type { TListRoute } from "@/routes/users/users.route";

export const list: TRouteHandler<TListRoute> = (c) => {
  return c.json([
    {
      fistName: "John",
      lastName: "Doe",
      email: "test@test.co",
    },
  ], HttpStatusCodes.OK);
};
