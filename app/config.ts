import * as v from "valibot";

export type Config = {
  host: string;
  port: number;
  enableHTTPRequestLogging: boolean;
  serveAssets: boolean;
  forceShutdownTimeoutSec: number;
  databaseURL: string;
};

const envSchema = v.object({
  HOST: v.string(),
  PORT: v.pipe(v.string(), v.transform(parseInt)),
  ENABLE_HTTP_REQUEST_LOGGING: v.pipe(
    v.union([v.literal("true"), v.literal("false")]),
    v.transform((input) => input === "true")
  ),
  SERVE_ASSETS: v.pipe(
    v.union([v.literal("true"), v.literal("false")]),
    v.transform((input) => input === "true")
  ),
  FORCE_SHUTDOWN_TIMEOUT_SEC: v.pipe(v.string(), v.transform(parseInt)),
  DATABASE_URL: v.string(),
});

export function createConfigFromEnv(
  env: Record<string, string | undefined> = process.env
): Config {
  const safeEnv = v.parse(envSchema, env);

  return Object.freeze({
    host: safeEnv.HOST,
    port: safeEnv.PORT,
    enableHTTPRequestLogging: safeEnv.ENABLE_HTTP_REQUEST_LOGGING,
    serveAssets: safeEnv.SERVE_ASSETS,
    forceShutdownTimeoutSec: safeEnv.FORCE_SHUTDOWN_TIMEOUT_SEC,
    databaseURL: safeEnv.DATABASE_URL,
  });
}
