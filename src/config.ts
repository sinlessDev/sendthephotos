declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENABLE_HTTP_REQUEST_LOGGING: string;
      DATABASE_URL: string;
      FILE_STORE_DIR_PATH: string;
      SERVE_RESOURCES: string;
      HOST: string;
      PORT: string;
    }
  }
}

export function createConfig() {
  return Object.freeze({
    enableHttpRequestLogging:
      process.env.ENABLE_HTTP_REQUEST_LOGGING === "true",
    databaseURL: process.env.DATABASE_URL,
    fileStoreDirPath: process.env.FILE_STORE_DIR_PATH,
    serveResources: process.env.SERVE_RESOURCES === "true",
    host: process.env.HOST,
    port: parseInt(process.env.PORT, 10),
  });
}

export type Config = ReturnType<typeof createConfig>;
