import express from "express";
import { type Config } from "./config.ts";
import type { DB } from "./db.ts";
import { createEventsRouter } from "./routers/events.ts";
import { createUploadsRouter } from "./routers/uploads.ts";

export async function createApp({ config, db }: { config: Config; db: DB }) {
  const app = express();

  app.use(express.json());

  if (config.enableHttpRequestLogging) {
    const { default: morgan } = await import("morgan");

    app.use(morgan("tiny"));
  }

  if (config.serveResources) {
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

  app.use("/api/uploads", createUploadsRouter({ config, db }));
  app.use("/api/events", createEventsRouter({ db }));

  return app;
}
