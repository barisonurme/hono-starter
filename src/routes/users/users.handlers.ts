import bcrypt from "bcryptjs";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { TRouteHandler } from "@/lib/types/app-types";
import type { TCreateRoute, TGetOneRoute, TListRoute } from "@/routes/users/users.route";

import { db } from "@/db";
import { users } from "@/db/schema";

export const list: TRouteHandler<TListRoute> = async (c) => {
  const allUsers = await db.query.users.findMany({
    columns: {
      id: true,
      email: true,
      username: true,
      isActive: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return c.json(allUsers, HttpStatusCodes.OK);
};

export const create: TRouteHandler<TCreateRoute> = async (c) => {
  const data = c.req.valid("json");

  // Hash the password
  const passwordHash = await bcrypt.hash(data.passwordHash, 10);
  data.passwordHash = passwordHash;

  const [user] = await db
    .insert(users)
    .values(data)
    .returning({
      id: users.id,
      email: users.email,
      username: users.username,
      isActive: users.isActive,
      isVerified: users.isVerified,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });

  return c.json(user, HttpStatusCodes.OK);
};

export const getOne: TRouteHandler<TGetOneRoute> = async (c) => {
  const { id } = c.req.param();

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, id),
    columns: {
      id: true,
      email: true,
      username: true,
      isActive: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(user, HttpStatusCodes.OK);
};
