import { createMessageObjectSchema } from "stoker/openapi/schemas";

export const notFoundSchema = createMessageObjectSchema("not_found");

export const BCRYPT_ROUNDS = 10;
export const POSTGRES_UNIQUE_VIOLATION_CODE = "23505";
