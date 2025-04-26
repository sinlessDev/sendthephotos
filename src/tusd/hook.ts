import * as v from "valibot";

export const postCreateRequestSchema = v.object({
  Type: v.literal("post-create"),
  Event: v.object({
    Upload: v.object({
      ID: v.string(),
      MetaData: v.object({
        filename: v.string(),
        mimeType: v.string(),
        eventID: v.string(),
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
  postCreateRequestSchema,
  postTerminateRequestSchema,
]);
