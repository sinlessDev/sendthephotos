import { defineConfig } from "drizzle-kit";
import { createConfigFromEnv } from "./config.ts";

const config = createConfigFromEnv();

export default defineConfig({
  out: "./drizzle",
  schema: "./db.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: config.databaseURL,
  },
});
