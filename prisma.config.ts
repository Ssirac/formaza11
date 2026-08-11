import "dotenv/config";
import { defineConfig } from "prisma/config";

// NOTE: use process.env directly (not prisma/config's `env()` helper).
// `env()` throws if the variable is missing, which breaks `prisma generate`
// during install/build even though generate doesn't need a database URL.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
