export type Conf = Readonly<{
  enableHttpRequestLogging: boolean;
  databaseURL: string;
  fileStoreDirPath: string;
  serveResources: boolean;
  host: string;
  port: number;
}>;

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "production"; // Only run in production
      ENABLE_HTTP_REQUEST_LOGGING: "true" | "false";
      DATABASE_URL: string;
      FILE_STORE_DIR_PATH: string;
      SERVE_RESOURCES: "true" | "false";
      HOST: string;
      PORT: string;
    }
  }
}

export function createEnvConf(): Conf {
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
