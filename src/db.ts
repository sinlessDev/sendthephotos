import { drizzle } from "drizzle-orm/better-sqlite3";
import type { Deps } from "./deps.ts";
import * as schema from "./schema.ts";

export function createDB(deps: Pick<Deps, "config">) {
  const db = drizzle(deps.config.databaseURL, { schema });

  return db;
}

export type DB = ReturnType<typeof createDB>;
