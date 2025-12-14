import * as HttpStatusCodes from "stoker/http-status-codes";

import type { TRouteHandler } from "@/lib/types/app-types";
import type { TListRoute } from "@/routes/users/users.route";

import { db } from "@/db";

export const list: TRouteHandler<TListRoute> = async (c) => {
  const users = await db.query.users.findMany();
  return c.json(users, HttpStatusCodes.OK);
};
