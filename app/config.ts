  import * as v from "valibot";

export type Config = {
  dev: boolean;
  prod: boolean;
  host: string;
  port: number;
  tusdBaseURL: string;
  forceShutdownTimeoutSec: number;
  tusd: {
    port: number;
    host: string;
  };
  databaseURL: string;
  electricBaseURL: string;
};

const envSchema = v.object({
  NODE_ENV: v.optional(
    v.union([v.literal("development"), v.literal("production")])
  ),
  HOST: v.optional(v.string()),
  PORT: v.optional(v.pipe(v.string(), v.transform(parseInt), v.number())),
  FORCE_SHUTDOWN_TIMEOUT_SEC: v.optional(
    v.pipe(v.string(), v.transform(parseInt), v.number())
  ),
  DATABASE_URL: v.string(),
  TUSD_BASE_URL: v.string(),
  ELECTRIC_BASE_URL: v.string(),
  TUSD_PORT: v.optional(v.pipe(v.string(), v.transform(parseInt), v.number())),
  TUSD_HOST: v.optional(v.string()),
});

export function createConfigFromEnv(
  env: Record<string, string | undefined> = process.env
): Config {
  const safeEnv = v.parse(envSchema, env);
  const nodeEnv = safeEnv.NODE_ENV ?? "development";

  return Object.freeze({
    dev: nodeEnv === "development",
    prod: nodeEnv === "production",
    host: safeEnv.HOST ?? "0.0.0.0",
    port: safeEnv.PORT ?? 3000,
    forceShutdownTimeoutSec: safeEnv.FORCE_SHUTDOWN_TIMEOUT_SEC ?? 10,
    databaseURL: safeEnv.DATABASE_URL,
    tusdBaseURL: safeEnv.TUSD_BASE_URL,
    electricBaseURL: safeEnv.ELECTRIC_BASE_URL,
    tusd: {
      port: safeEnv.TUSD_PORT ?? 3001,
      host: safeEnv.TUSD_HOST ?? "0.0.0.0",
    }
  });
}
