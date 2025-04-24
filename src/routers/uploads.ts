import { FileStore } from "@tus/file-store";
import { Server } from "@tus/server";
import { Router } from "express";
import { type Config } from "../config.ts";

export function createUploadsRouter(config: Config) {
  const router = Router();

  const server = new Server({
    path: "/api/uploads",
    relativeLocation: true,
    datastore: new FileStore({
      directory: config.fileStoreDirPath,
    }),
  });

  router.all("/{*splat}", server.handle.bind(server));

  return router;
}
