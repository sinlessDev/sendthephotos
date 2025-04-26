import type express from "express";
import type { DB } from "../db.ts";
import { postCreateRequestSchema } from "./hook.ts";
import * as v from "valibot";
import { insertUpload } from "../repos/uploads.ts";

export function createHookHandler(db: DB) {
  return async (req: express.Request, res: express.Response) => {
    if (v.is(postCreateRequestSchema, req.body)) {
      await insertUpload(db, {
        id: req.body.Event.Upload.ID,
        metadata: {
          filename: req.body.Event.Upload.MetaData.filename,
          mimeType: req.body.Event.Upload.MetaData.mimeType,
        },
        eventId: req.body.Event.Upload.MetaData.eventID,
      });
    }

    res.status(200).json({});
  };
}
