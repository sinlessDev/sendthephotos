import { Router } from "express";
import type { DB } from "../db.ts";
import { getEventPaid, getUniqBatches } from "../repos/events-repo.ts";
import { deleteUpload, insertUpload } from "../repos/uploads-repo.ts";
import * as v from "valibot";

export const preCreateRequestSchema = v.object({
  Type: v.literal("pre-create"),
  Event: v.object({
    Upload: v.object({
      MetaData: v.object({
        eventID: v.string(),
        batchID: v.string(),
      }),
    }),
  }),
});

export const postCreateRequestSchema = v.object({
  Type: v.literal("post-create"),
  Event: v.object({
    Upload: v.object({
      ID: v.string(),
      MetaData: v.object({
        filename: v.string(),
        mimeType: v.string(),
        eventID: v.string(),
        fingerprint: v.string(),
        batchID: v.string(),
      }),
    }),
  }),
});

export const postTerminateRequestSchema = v.object({
  Type: v.literal("post-terminate"),
  Event: v.object({
    Upload: v.object({
      ID: v.string(),
    }),
  }),
});

export const hookRequestSchema = v.union([
  preCreateRequestSchema,
  postCreateRequestSchema,
  postTerminateRequestSchema,
]);

export function createTusdRouter(db: DB) {
  const router = Router();

  router.post("/hook", async (req, res) => {
    const hookRequest = await v.safeParseAsync(hookRequestSchema, req.body);

    if (!hookRequest.success) {
      res.status(200).json({});
      return;
    }

    if (hookRequest.output.Type === "pre-create") {
      const eventPaid = await getEventPaid(
        db,
        hookRequest.output.Event.Upload.MetaData.eventID,
      );

      if (eventPaid) {
        res.status(200).json({});
        return;
      }

      const [count, batches] = await getUniqBatches(
        db,
        hookRequest.output.Event.Upload.MetaData.eventID,
      );

      if (
        count === 1 &&
        !batches.includes(hookRequest.output.Event.Upload.MetaData.batchID)
      ) {
        res.status(200).json({
          HTTPResponse: {
            StatusCode: 429,
            Body: JSON.stringify({
              error: "You have to activate the event to continue",
            }),
            Header: {
              "Content-Type": "application/json",
            },
          },
          RejectUpload: true,
        });
        return;
      }
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
        batchId: hookRequest.output.Event.Upload.MetaData.batchID,
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
  });

  return router;
}
