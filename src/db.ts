import { drizzle } from "drizzle-orm/better-sqlite3";
import type { Conf } from "./config.ts";
import * as schema from "./schema.ts";

type Deps = {
  conf: Conf;
};

export function createDB(deps: Deps) {
  const db = drizzle(deps.conf.databaseURL, { schema });

  return db;
}

export type DB = ReturnType<typeof createDB>;
