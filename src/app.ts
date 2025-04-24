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

  if (config.serveResources) {
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

  app.use("/api/uploads", createUploadsRouter(config));

  return app;
}
