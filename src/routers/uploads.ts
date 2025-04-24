import { FileStore } from "@tus/file-store";
import { Server } from "@tus/server";
import { Router } from "express";
import { type Config } from "../config.ts";
import type { DB } from "../db.ts";
import { uploadsTable } from "../schema.ts";
import util from "node:util";

export function createUploadsRouter({
  config,
  db,
}: {
  config: Config;
  db: DB;
}) {
  const router = Router();

  const server = new Server({
    path: "/api/uploads",
    relativeLocation: true,
    datastore: new FileStore({
      directory: config.fileStoreDirPath,
    }),
    async onUploadFinish(req, upload) {
      console.log(util.inspect(upload, { depth: null, colors: true }));
      const eventID = req.headers.get("X-Event-ID");

      if (!eventID) {
        throw new Error("Event ID can't be missing");
      }

      try {
        await db.insert(uploadsTable).values({
          id: upload.id,
          name: upload.metadata!.filename,
          size: upload.size,
          type: upload.metadata!.filetype,
          url: `/api/uploads/${upload.id}`,
          uploadedAt: upload.creation_date,
          eventId: eventID,
        });
      } catch (error) {
        console.error(error);
      }

      return {};
    },
  });

  router.all("/{*splat}", server.handle.bind(server));

  return router;
}
