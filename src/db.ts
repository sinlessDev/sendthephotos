import { drizzle } from "drizzle-orm/better-sqlite3";
import { type Config } from "./config.ts";
import * as schema from "./schema.ts";

export function createDBConn(config: Config) {
  const db = drizzle(config.databaseURL, { schema });

  return db;
}

export type DB = ReturnType<typeof createDBConn>;
