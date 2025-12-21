import type { SignOptions } from "jsonwebtoken";
import type { ZodError } from "zod";

import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

expand(config());

const JwtExpiresInSchema = z.custom<SignOptions["expiresIn"]>(
  val => typeof val === "string" || typeof val === "number",
  { message: "Invalid JWT expiration format" },
);

const EnvSchema = z.object({
  JWT_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: JwtExpiresInSchema,
  JWT_REFRESH_EXPIRES_IN: JwtExpiresInSchema,
  JWT_ISSUER: z.string().default("hono-starter"),
  SESSION_ENCRYPTION_KEY: z.string().min(32),
  DATABASE_URL: z.url(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().optional(),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
});

export type Env = z.infer<typeof EnvSchema>;

let env;

try {
  // eslint-disable-next-line node/no-process-env
  env = EnvSchema.parse(process.env);
}
catch (e) {
  console.error("❌ Invalid environment variables:");
  console.error((e as ZodError).flatten().fieldErrors);
  process.exit(1);
}

export default env!;
