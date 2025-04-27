import express from "express";
import { type Config } from "./config.ts";
import type { DB } from "./db.ts";
import { createEventsRouter } from "./routers/events-router.ts";
import { createTusdRouter } from "./routers/tusd-router.ts";
import { createUploadsRouter } from "./routers/uploads-router.ts";
import path from "node:path";
import compression from "compression";

export async function createApp(config: Config, db: DB) {
  const app = express();

  app.use(express.json());

  if (config.enableHTTPRequestLogging) {
    const { default: morgan } = await import("morgan");

    app.use(
      morgan("tiny", {
        skip(req) {
          if (config.serveAssets) {
            return !["/api", "/tusd"].some((path) =>
              req.originalUrl.startsWith(path)
            );
          }

          return false;
        },
      })
    );
  }

  app.use(compression());
  app.use(
    express.static(path.join(import.meta.dirname, "..", "assets", "dist"))
  );

  app.use("/api/events", createEventsRouter(db));
  app.use("/api/uploads", createUploadsRouter(db));
  app.use("/tusd", createTusdRouter(db));

  if (config.serveAssets) {
    const { createServer } = await import("vite");

    const vite = await createServer({
      root: "./assets",
      server: {
        middlewareMode: true,
      },
      publicDir: false,
    });

    app.use(vite.middlewares);
  }

  app.get("/{*splat}", (req, res) => {
    res.sendFile(
      path.join(import.meta.dirname, "..", "assets", "dist", "index.html")
    );
  });

  return app;
}
