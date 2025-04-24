import { FileStore } from "@tus/file-store";
import { Server } from "@tus/server";
import { Router } from "express";
import { type Config } from "../config.ts";
import type { DB } from "../db.ts";
import { uploadsTable } from "../schema.ts";

const eventIdHeaderName = "X-Event-ID";

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
    async onUploadCreate(req, upload) {
      if (!req.headers.get(eventIdHeaderName)) {
        throw {
          status_code: 400,
          body: "Event ID can't be missing",
        };
      }

      return {
        metadata: upload["metadata"],
      };
    },
    async onUploadFinish(req, upload) {
      const eventID = req.headers.get(eventIdHeaderName);

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
