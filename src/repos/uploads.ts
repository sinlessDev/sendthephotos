import type { DB } from "../db.ts";
import { uploads } from "../db.ts";

type InsertingUpload = typeof uploads.$inferInsert;

export async function insertUpload(db: DB, upload: InsertingUpload) {
  const [insertedUpload] = await db.insert(uploads).values(upload).returning({
    id: uploads.id,
  });

  return insertedUpload.id;
}
