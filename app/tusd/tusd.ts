import express from "express";
import * as v from "valibot";
import type { DB } from "../db.ts";
import { getEventPaid, getUniqBatches } from "../repos/events-repo.ts";
import { deleteUpload, insertUpload } from "../repos/uploads-repo.ts";

const preCreateRequestSchema = v.object({
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

const postCreateRequestSchema = v.object({
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

const postTerminateRequestSchema = v.object({
  Type: v.literal("post-terminate"),
  Event: v.object({
    Upload: v.object({
      ID: v.string(),
    }),
  }),
});

const hookRequestSchema = v.union([
  preCreateRequestSchema,
  postCreateRequestSchema,
  postTerminateRequestSchema,
]);

export function createTusd(db: DB) {
  const tusd = express();

  tusd.use(express.json());

  const EMPTY_RESPONSE = {};

  tusd.post("/", async (req, res) => {
    const hookRequest = await v.safeParseAsync(hookRequestSchema, req.body);

    if (!hookRequest.success) {
      console.log("Invalid hook request:", hookRequest.issues);
      res.status(200).json(EMPTY_RESPONSE);
      return;
    }

    if (hookRequest.output.Type === "pre-create") {
      const eventPaid = await getEventPaid(
        db,
        hookRequest.output.Event.Upload.MetaData.eventID
      );

      if (eventPaid) {
        res.status(200).json(EMPTY_RESPONSE);
        return;
      }

      const [count, batches] = await getUniqBatches(
        db,
        hookRequest.output.Event.Upload.MetaData.eventID
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

  return tusd;
}
