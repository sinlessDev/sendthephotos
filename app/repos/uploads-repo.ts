import { eq } from "drizzle-orm";
import type { DB } from "../db.ts";
import { uploads } from "../db.ts";

type InsertingUpload = Omit<typeof uploads.$inferInsert, "visible">;

export async function insertUpload(db: DB, upload: InsertingUpload) {
  const [insertedUpload] = await db
    .insert(uploads)
    .values({ ...upload, visible: true })
    .returning({
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

export async function updateUploadVisibility(
  db: DB,
  id: string,
  visible: boolean
) {
  await db
    .update(uploads)
    .set({
      visible,
    })
    .where(eq(uploads.id, id));
}

export async function getUploadVisibility(db: DB, id: string) {
  const upload = await db.query.uploads.findFirst({
    where: eq(uploads.id, id),
    columns: {
      visible: true,
    },
  });

  if (!upload) {
    throw new Error(`Upload ${id} not found`);
  }

  return upload.visible;
}
