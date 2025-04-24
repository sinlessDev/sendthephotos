import { FileStore } from "@tus/file-store";
import { Server } from "@tus/server";
import { Router } from "express";
import { type Config } from "./config.ts";

export function createUploadsRouter(
  config: Pick<Config, "fileStoreDirectoryPath">
) {
  const router = Router();

  const server = new Server({
    path: "/uploads",
    datastore: new FileStore({
      directory: config.fileStoreDirectoryPath,
    }),
  });

  router.all("/{*splat}", server.handle.bind(server));

  return router;
}
