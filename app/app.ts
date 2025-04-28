import express, { Router } from "express";
import { type Config } from "./config.ts";
import type { DB } from "./db.ts";
import { createEventsRouter } from "./routers/events-router.ts";
import { createTusdRouter } from "./routers/tusd-router.ts";
import { createUploadsRouter } from "./routers/uploads-router.ts";
import path from "node:path";
import compression from "compression";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";

function createAPIRouter(db: DB, config: Config) {
  const router = Router();

  router.use(express.json());
  router.use(morgan("tiny"));

  router.use("/events", createEventsRouter(db, config));
  router.use("/uploads", createUploadsRouter(db));
  router.use("/tusd", createTusdRouter(db));

  return router;
}

export async function createApp(config: Config, db: DB) {
  const app = express();

  app.use("/api", createAPIRouter(db, config));
  app.use(
    "/files",
    createProxyMiddleware({
      target: `${config.tusdBaseURL}/files`,
    })
  );
  app.use(
    "/electric",
    createProxyMiddleware({
      target: `${config.electricBaseURL}`,
    })
  );

  app.use(compression());

  if (config.dev) {
    const { createServer } = await import("vite");

    const vite = await createServer({
      root: path.join(import.meta.dirname, "..", "assets"),
      server: {
        middlewareMode: true,
      },
      publicDir: false,
    });

    app.use(vite.middlewares);
  }

  if (config.prod) {
    app.use(
      "/assets",
      express.static(
        path.join(import.meta.dirname, "..", "..", "assets", "dist", "assets")
      )
    );
    app.get("/{*splat}", (req, res) => {
      res.sendFile(
        path.join(
          import.meta.dirname,
          "..",
          "..",
          "assets",
          "dist",
          "index.html"
        )
      );
    });
  }

  return app;
}
