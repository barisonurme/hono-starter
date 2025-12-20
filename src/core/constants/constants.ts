import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

export const notFoundSchema = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND);

export const BCRYPT_ROUNDS = 10;
export const POSTGRES_UNIQUE_VIOLATION_CODE = "23505";
