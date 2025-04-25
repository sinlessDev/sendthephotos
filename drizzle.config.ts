import { defineConfig } from "drizzle-kit";
import { createEnvConf } from "./src/config.ts";

const conf = createEnvConf();

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: conf.databaseURL,
  },
});
