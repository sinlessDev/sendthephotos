import { createConfig, type Config } from "./config.ts";
import { createDB, type DB } from "./db.ts";

export type Deps = {
  db: DB;
  config: Config;
};

export function createDeps(): Deps {
  const config = createConfig();
  const db = createDB({ config });

  return Object.freeze({ config, db });
}
