import { Router } from "express";
import type { DB } from "../db.ts";
import { getUploadMetadata } from "../repos/uploads.ts";

export function createUploadsRouter(db: DB) {
  const router = Router();

  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const metadata = await getUploadMetadata(db, id);

    if (!metadata) {
      res.status(404).json({ error: "Upload not found" });
      return;
    }

    res.json({ upload: { metadata } });
  });

  return router;
}
