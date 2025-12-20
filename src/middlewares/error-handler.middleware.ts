// Auth, logging, error handling
import type { ErrorHandler } from "hono";

import * as HttpStatusCodes from "stoker/http-status-codes";

import { HttpException } from "@/exceptions/http-exceptions";

export const errorHandler: ErrorHandler = (err, c) => {
  // Check if it's our custom HttpException
  // Use both instanceof and property check for better compatibility
  if (err instanceof HttpException || (err && typeof err === "object" && "statusCode" in err && err.constructor.name === "HttpException")) {
    const httpError = err as HttpException;
    return c.json(
      { message: httpError.message },
      httpError.statusCode as typeof HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  // Handle other errors
  console.error("Unhandled error:", {
    name: err?.name,
    message: err?.message,
    stack: err?.stack,
    error: err,
  });
  return c.json(
    { message: "Internal Server Error" },
    HttpStatusCodes.INTERNAL_SERVER_ERROR,
  );
};
