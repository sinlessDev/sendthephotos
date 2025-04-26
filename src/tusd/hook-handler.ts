import type express from "express";
import type { DB } from "../db.ts";
import { hookRequestSchema, postCreateRequestSchema } from "./hook.ts";
import * as v from "valibot";
import { deleteUpload, insertUpload } from "../repos/uploads.ts";

export function createHookHandler(db: DB) {
  return async (req: express.Request, res: express.Response) => {
    const hookRequest = await v.safeParseAsync(hookRequestSchema, req.body);

    if (!hookRequest.success) {
      res.status(200).json({});
      return;
    }

    if (hookRequest.output.Type === "post-create") {
      await insertUpload(db, {
        id: hookRequest.output.Event.Upload.ID,
        metadata: {
          filename: hookRequest.output.Event.Upload.MetaData.filename,
          mimeType: hookRequest.output.Event.Upload.MetaData.mimeType,
        },
        eventId: hookRequest.output.Event.Upload.MetaData.eventID,
        fingerprint: hookRequest.output.Event.Upload.MetaData.fingerprint,
      });
      res.status(200).json({});
      return;
    }

    if (hookRequest.output.Type === "post-terminate") {
      await deleteUpload(db, hookRequest.output.Event.Upload.ID);
      res.status(200).json({});
      return;
    }

    res.status(200).json({});
  };
}
