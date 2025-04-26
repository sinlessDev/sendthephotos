import { and, eq } from "drizzle-orm";
import type { DB } from "../db.ts";
import { uploads } from "../db.ts";

type InsertingUpload = typeof uploads.$inferInsert;

export async function insertUpload(db: DB, upload: InsertingUpload) {
  const [insertedUpload] = await db.insert(uploads).values(upload).returning({
    id: uploads.id,
  });

  return insertedUpload.id;
}

export async function deleteUpload(db: DB, id: string) {
  await db.delete(uploads).where(eq(uploads.id, id));
}

export async function getUploadMetadata(db: DB, id: string) {
  const upload = await db.query.uploads.findFirst({
    where: eq(uploads.id, id),
    columns: {
      metadata: true,
    },
  });

  if (!upload) {
    return null;
  }

  return upload.metadata;
}
