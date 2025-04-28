import { Router } from "express";
import type { DB } from "../db.ts";
import {
  getUploadVisibility,
  updateUploadVisibility,
} from "../repos/uploads-repo.ts";

export function createUploadsRouter(db: DB) {
  const router = Router();

  router.post("/:id/toggle-visibility", async (req, res) => {
    const { id } = req.params;

    const visibility = await getUploadVisibility(db, id);

    await updateUploadVisibility(db, id, !visibility);

    res.status(204).end();
  });

  return router;
}
