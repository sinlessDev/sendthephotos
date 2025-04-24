import express from "express";
import { type Conf } from "./config.ts";
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

  if (deps.conf.serveResources) {
    const path = await import("node:path");
    const { default: compression } = await import("compression");

    app.use(
      express.static(path.join(import.meta.dirname, "..", "resources", "dist")),
    );
    app.use(compression());

    app.get("{*splat}", (req, res) => {
      res.sendFile(
        path.join(import.meta.dirname, "..", "resources", "dist", "index.html"),
      );
    });
  }

  app.use("/api/uploads", createUploadsRouter(deps));
  app.use("/api/events", createEventsRouter(deps));

  return app;
}
