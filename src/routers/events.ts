import { Router } from "express";
import type { DB } from "../db.ts";
import { findEventByID, upsertEvent } from "../repos/events.ts";

export type EventsDeps = {
  db: DB;
};

export function createEventsRouter(deps: EventsDeps) {
  const router = Router();

  router.put("/:eventID", async (req, res) => {
    const { eventID } = req.params;
    const { name } = req.body;

    const event = await upsertEvent(deps.db, { id: eventID, name });

    res.json(event);
  });

  router.get("/:eventID", async (req, res) => {
    const { eventID } = req.params;

    const event = await findEventByID(deps.db, eventID);

    res.json(event);
  });

  return router;
}
