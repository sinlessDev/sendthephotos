import { FileStore } from "@tus/file-store";
import { Server } from "@tus/server";
import { Router } from "express";
import { randomUUID } from "node:crypto";
import { insertUpload } from "../repos/uploads.ts";
import type { Conf } from "../conf.ts";
import type { DB } from "../db.ts";

const EVENT_ID_HEADER_NAME = "X-Event-ID";

export type UploadsDeps = {
  conf: Conf;
  db: DB;
};

type TusServerHandlerDeps = UploadsDeps;

function createTusServerHandler(deps: TusServerHandlerDeps) {
  const server = new Server({
    path: "/api/uploads",
    relativeLocation: true,
    datastore: new FileStore({
      directory: deps.conf.fileStoreDirPath,
    }),
    allowedHeaders: [EVENT_ID_HEADER_NAME],
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

      const id = upload.id.split("/").at(-1);

      if (!id) {
        throw new Error("File upload failed: ID is missing");
      }

      await insertUpload(deps.db, {
        id,
        name: fileName,
        url: `/api/uploads/${id}`,
        eventId: eventID,
      });

      return { status_code: 204 };
    },
  });

  return server.handle.bind(server);
}

export function createUploadsRouter(deps: UploadsDeps) {
  const router = Router();

  router.all("/{*splat}", createTusServerHandler(deps));

  return router;
}
