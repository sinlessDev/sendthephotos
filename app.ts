import express from "express";
import { type Config } from "./config.ts";
import type { DB } from "./db.ts";
import { createEventsRouter } from "./routers/events-router.ts";
import { createTusdRouter } from "./routers/tusd-router.ts";
import { createUploadsRouter } from "./routers/uploads-router.ts";

export async function createApp(config: Config, db: DB) {
  const app = express();

  app.use(express.json());

  if (config.enableHTTPRequestLogging) {
    const { default: morgan } = await import("morgan");

    app.use(morgan("tiny"));
  }

  app.use("/api/events", createEventsRouter(db));
  app.use("/api/uploads", createUploadsRouter(db));
  app.use("/tusd", createTusdRouter(db));

  return app;
}
