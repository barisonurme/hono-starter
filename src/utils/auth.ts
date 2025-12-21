import type { Context } from "hono";

import type { TAppBindings } from "@/core/types/app-types";

import { UnauthorizedException } from "@/exceptions/http-exceptions";

/**
 * Get the authenticated user from the context
 * Throws UnauthorizedException if user is not authenticated
 */
export function getAuthenticatedUser(c: Context<TAppBindings>) {
  const user = c.get("user");
  if (!user) {
    throw new UnauthorizedException("User not authenticated");
  }
  return user;
}
