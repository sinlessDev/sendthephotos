import * as v from "valibot";

const literallyBoolean = v.custom((value) => {
  if (value !== "true" && value !== "false") {
    throw new Error("Value must be true or false");
  }
  return value === "true";
});

const envSchema = v.object({
  ENABLE_HTTP_REQUEST_LOGGING: literallyBoolean,
  DATABASE_URL: v.string(),
});

const env = v.parse(envSchema, process.env);

const config = Object.freeze({
  enableHttpRequestLogging: env.ENABLE_HTTP_REQUEST_LOGGING,
  databaseUrl: env.DATABASE_URL,
});

export default config;
