import express from "express";
import { type Conf } from "./conf.ts";
import { createEventsRouter, type EventsDeps } from "./routers/events.ts";
import { createUploadsRouter, type UploadsDeps } from "./routers/uploads.ts";

type AppDeps = {
  conf: Conf;
} & UploadsDeps &
  EventsDeps;

export async function createApp(deps: AppDeps) {
  const app = express();

  app.use(express.json());

  if (deps.conf.enableHttpRequestLogging) {
    const { default: morgan } = await import("morgan");

    app.use(morgan("tiny"));
  }

  app.use("/api/uploads", createUploadsRouter(deps));
  app.use("/api/events", createEventsRouter(deps));

  return app;
}
