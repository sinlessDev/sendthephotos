import { Router } from "express";
import type { DB } from "../db.ts";
import { uploadsTable } from "../schema.ts";
import { eq } from "drizzle-orm";

export function createEventsRouter({ db }: { db: DB }) {
  const router = Router();

  router.get("/:eventID", async (req, res) => {
    const { eventID } = req.params;

    const uploads = await db
      .select({
        name: uploadsTable.name,
        size: uploadsTable.size,
        type: uploadsTable.type,
        url: uploadsTable.url,
        id: uploadsTable.id,
      })
      .from(uploadsTable)
      .where(eq(uploadsTable.eventId, eventID));

    res.json({
      uploads,
    });
  });

  return router;
}
