declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENABLE_HTTP_REQUEST_LOGGING: string;
      DATABASE_URL: string;
      FILE_STORE_DIR_PATH: string;
    }
  }
}

const config = Object.freeze({
  enableHttpRequestLogging: process.env.ENABLE_HTTP_REQUEST_LOGGING === "true",
  databaseURL: process.env.DATABASE_URL,
  fileStoreDirPath: process.env.FILE_STORE_DIR_PATH,
});

export type Config = typeof config;

export default config;
