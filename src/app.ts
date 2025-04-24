import express from "express";
import { type Deps } from "./deps.ts";
import { createEventsRouter } from "./routers/events.ts";
import { createUploadsRouter } from "./routers/uploads.ts";

export async function createApp(deps: Deps) {
  const app = express();

  app.use(express.json());

  if (deps.config.enableHttpRequestLogging) {
    const { default: morgan } = await import("morgan");

    app.use(morgan("tiny"));
  }

  if (deps.config.serveResources) {
    const path = await import("node:path");
    const { default: compression } = await import("compression");

    app.use(
      express.static(path.join(import.meta.dirname, "..", "resources", "dist"))
    );
    app.use(compression());

    app.get("{*splat}", (req, res) => {
      res.sendFile(
        path.join(import.meta.dirname, "..", "resources", "dist", "index.html")
      );
    });
  }

  app.use("/api/uploads", createUploadsRouter(deps));
  app.use("/api/events", createEventsRouter(deps));

  return app;
}
