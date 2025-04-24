import { defineConfig } from "drizzle-kit";
import config from "./src/config.ts";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: config.databaseURL,
  },
});
