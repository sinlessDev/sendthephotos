import { drizzle } from "drizzle-orm/better-sqlite3";
import config from "./config.ts";

const db = drizzle(config.databaseUrl);

export default db;
