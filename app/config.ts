import * as v from "valibot";

export type Config = {
  dev: boolean;
  prod: boolean;
  host: string;
  port: number;
  forceShutdownTimeoutSec: number;
  databaseURL: string;
};

const envSchema = v.object({
  NODE_ENV: v.union([v.literal("development"), v.literal("production")]),
  HOST: v.string(),
  PORT: v.pipe(v.string(), v.transform(parseInt)),
  FORCE_SHUTDOWN_TIMEOUT_SEC: v.pipe(v.string(), v.transform(parseInt)),
  DATABASE_URL: v.string(),
});

export function createConfigFromEnv(
  env: Record<string, string | undefined> = process.env
): Config {
  const safeEnv = v.parse(envSchema, env);

  return Object.freeze({
    dev: safeEnv.NODE_ENV === "development",
    prod: safeEnv.NODE_ENV === "production",
    host: safeEnv.HOST,
    port: safeEnv.PORT,
    forceShutdownTimeoutSec: safeEnv.FORCE_SHUTDOWN_TIMEOUT_SEC,
    databaseURL: safeEnv.DATABASE_URL,
  });
}
