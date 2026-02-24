import { defineConfig } from "drizzle-kit";
import "dotenv/config";

import env from "@/core/env";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
});
