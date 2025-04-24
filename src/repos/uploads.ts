import type { DB } from "../db.ts";
import { uploads } from "../schema.js";

type InsertingUpload = typeof uploads.$inferInsert;

export async function insertUpload(
  { db }: { db: DB },
  upload: InsertingUpload
) {
  const [insertedUpload] = await db.insert(uploads).values(upload).returning({
    id: uploads.id,
  });

  return insertedUpload.id;
}
