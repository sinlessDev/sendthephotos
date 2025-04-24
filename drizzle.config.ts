import { defineConfig } from "drizzle-kit";
import { createEnvConf } from "./src/config.ts";

const conf = createEnvConf();

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: conf.databaseURL,
  },
});
