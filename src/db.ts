import { drizzle } from "drizzle-orm/better-sqlite3";
import { type Config } from "./config.ts";

export function createDBConn(config: Config) {
  const db = drizzle(config.databaseURL);

  return db;
}

export type DB = ReturnType<typeof createDBConn>;
