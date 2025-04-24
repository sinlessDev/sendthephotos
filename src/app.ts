import express from "express";
import { type Config } from "./config.ts";
import { createUploadsRouter } from "./routers/uploads.ts";
import type { DB } from "./db.ts";

export async function createApp(config: Config, deps: { db: DB }) {
  const app = express();

  app.use(express.json());

  if (config.enableHttpRequestLogging) {
    const { default: morgan } = await import("morgan");

    app.use(morgan("tiny"));
  }

  app.use("/uploads", createUploadsRouter(config));

  return app;
}
