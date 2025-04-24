import type { Deps } from "../deps.ts";
import { uploads } from "../schema.ts";

type InsertingUpload = typeof uploads.$inferInsert;

export async function insertUpload(
  deps: Pick<Deps, "db">,
  upload: InsertingUpload,
) {
  const [insertedUpload] = await deps.db
    .insert(uploads)
    .values(upload)
    .returning({
      id: uploads.id,
    });

  return insertedUpload.id;
}
