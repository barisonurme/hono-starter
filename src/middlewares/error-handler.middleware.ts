// Auth, logging, error handling
import type { ErrorHandler } from "hono";

import * as HttpStatusCodes from "stoker/http-status-codes";

import { HttpException } from "@/exceptions/http-exceptions";

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof HttpException) {
    return c.json(
      { message: err.message },
      err.statusCode as typeof HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  // Handle other errors
  console.error("Unhandled error:", err);
  return c.json(
    { message: "Internal Server Error" },
    HttpStatusCodes.INTERNAL_SERVER_ERROR,
  );
};
