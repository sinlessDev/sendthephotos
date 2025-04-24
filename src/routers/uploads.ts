import { FileStore } from "@tus/file-store";
import { Server } from "@tus/server";
import { Router } from "express";
import { type Config } from "../config.ts";
import type { DB } from "../db.ts";
import { randomUUID } from "node:crypto";
import { insertUpload } from "../repos/uploads.ts";

const EVENT_ID_HEADER_NAME = "X-Event-ID";

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
    namingFunction(req) {
      const id = randomUUID();
      const eventID = req.headers.get(EVENT_ID_HEADER_NAME);

      if (!eventID) {
        throw new Error("File upload failed: Event ID is missing");
      }

      return `events/${eventID}/${id}`;
    },
    generateUrl(req, { proto, host, path, id }) {
      id = Buffer.from(id, "utf-8").toString("base64url");
      return `${proto}://${host}${path}/${id}`;
    },
    getFileIdFromRequest(req, lastPath) {
      if (!lastPath) {
        throw new Error("File upload failed: Last path is missing");
      }

      return Buffer.from(lastPath, "base64url").toString("utf-8");
    },
    async onUploadFinish(req, upload) {
      const eventID = req.headers.get(EVENT_ID_HEADER_NAME);

      if (!eventID) {
        throw new Error("File upload failed: Event ID is missing");
      }

      const fileName = upload.metadata?.filename;

      if (!fileName) {
        throw new Error("File upload failed: File name is missing");
      }

      await insertUpload(
        { db },
        {
          id: upload.id,
          name: fileName,
          url: `/api/uploads/${upload.id}`,
          eventId: eventID,
        }
      );

      return { status_code: 204 };
    },
  });

  router.all("/{*splat}", server.handle.bind(server));

  return router;
}
