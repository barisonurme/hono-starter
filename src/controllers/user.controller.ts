// HTTP handlers (thin layer)
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { TRouteHandler } from "@/core/types/app-types";
import type { TCreateRoute, TGetOneRoute, TListRoute } from "@/routes/users/users.route";

import { NotFoundException } from "@/exceptions/http-exceptions";
import { userService } from "@/services/user.service";

export const list: TRouteHandler<TListRoute> = async (c) => {
  const allUsers = await userService.findAll();
  return c.json(allUsers, HttpStatusCodes.OK);
};

export const create: TRouteHandler<TCreateRoute> = async (c) => {
  const data = c.req.valid("json");
  const user = await userService.create(data);
  return c.json(user, HttpStatusCodes.OK);
};

export const getOne: TRouteHandler<TGetOneRoute> = async (c) => {
  const { id } = c.req.param();

  const user = await userService.findById(id);

  if (!user) {
    throw new NotFoundException();
  }

  return c.json(user, HttpStatusCodes.OK);
};
