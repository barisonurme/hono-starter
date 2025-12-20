// HTTP handlers (thin layer)
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { TRouteHandler } from "@/core/types/app-types";
import type {
  TActivateRoute,
  TCreateRoute,
  TDeactivateRoute,
  TDeleteRoute,
  TGetOneRoute,
  TListRoute,
  TUpdateRoute,
} from "@/routes/users/users.route";

import { userService } from "@/services/user.service";

export const list: TRouteHandler<TListRoute> = async (c) => {
  const query = c.req.valid("query");
  const users = await userService.findAll({
    limit: query.limit,
    offset: query.offset,
    isActive: query.isActive,
  });
  return c.json(users, HttpStatusCodes.OK);
};

export const create: TRouteHandler<TCreateRoute> = async (c) => {
  const data = c.req.valid("json");
  const user = await userService.create(data);
  return c.json(user, HttpStatusCodes.CREATED);
};

export const getOne: TRouteHandler<TGetOneRoute> = async (c) => {
  const { id } = c.req.param();
  const user = await userService.findById(id);
  return c.json(user, HttpStatusCodes.OK);
};

export const update: TRouteHandler<TUpdateRoute> = async (c) => {
  const { id } = c.req.param();
  const data = c.req.valid("json");
  const user = await userService.update(id, data);
  return c.json(user, HttpStatusCodes.OK);
};

export const deleteUser: TRouteHandler<TDeleteRoute> = async (c) => {
  const { id } = c.req.param();
  await userService.delete(id);
  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

export const activate: TRouteHandler<TActivateRoute> = async (c) => {
  const { id } = c.req.param();
  const user = await userService.activate(id);
  return c.json(user, HttpStatusCodes.OK);
};

export const deactivate: TRouteHandler<TDeactivateRoute> = async (c) => {
  const { id } = c.req.param();
  const user = await userService.deactivate(id);
  return c.json(user, HttpStatusCodes.OK);
};
