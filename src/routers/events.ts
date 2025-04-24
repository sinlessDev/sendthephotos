import { Router } from "express";
import type { DB } from "../db.ts";
import { findEventByID } from "../repos/events.ts";

export function createEventsRouter({ db }: { db: DB }) {
  const router = Router();

  router.get("/:eventID", async (req, res) => {
    const { eventID } = req.params;

    const event = await findEventByID({ db }, eventID);

    res.json(event);
  });

  return router;
}
