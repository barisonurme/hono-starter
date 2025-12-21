import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import env from "@/core/env";

import * as userDbSchema from "./user-db-schema";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema: {
    ...userDbSchema,
  },
});
