import express from "express";
import { type Conf } from "./conf.ts";
import { createEventsRouter, type EventsDeps } from "./routers/events.ts";
import { createHookHandler } from "./tusd/hook-handler.ts";
import { createUploadsRouter } from "./routers/uploads.ts";

type AppDeps = {
  conf: Conf;
} & EventsDeps;

export async function createApp(deps: AppDeps) {
  const app = express();

  app.use(express.json());

  if (deps.conf.enableHttpRequestLogging) {
    const { default: morgan } = await import("morgan");

    app.use(morgan("tiny"));
  }

  app.post("/tusd-hook", createHookHandler(deps.db));
  app.use("/api/events", createEventsRouter(deps));
  app.use("/api/uploads", createUploadsRouter(deps.db));

  return app;
}
