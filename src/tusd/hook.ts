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
