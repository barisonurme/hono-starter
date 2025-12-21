import * as HttpStatusCodes from "stoker/http-status-codes";

import type { TRouteHandler } from "@/core/types/app-types";
import type { TLoginRoute } from "@/routes/auth/auth.route";

import { authService } from "@/services/auth.service";

export const login: TRouteHandler<TLoginRoute> = async (c) => {
  const data = c.req.valid("json");
  const { email, passwordHash } = data;

  const user = await authService.validatePassword(email, passwordHash, true);

  return c.json(user, HttpStatusCodes.OK);
};
