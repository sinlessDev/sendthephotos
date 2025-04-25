import { Router } from "express";
import type { DB } from "../db.ts";
import { findEventByID, insertEvent, findAllEvents } from "../repos/events.ts";

export type EventsDeps = {
  db: DB;
};

export function createEventsRouter(deps: EventsDeps) {
  const router = Router();

  router.post("/", async (req, res) => {
    const { name } = req.body;

    const eventID = await insertEvent(deps.db, { name });

    res.json({ event: { id: eventID } });
  });

  router.get("/", async (req, res) => {
    const events = await findAllEvents(deps.db);

    res.json({ events });
  });

  router.get("/:eventID", async (req, res) => {
    const { eventID } = req.params;

    const event = await findEventByID(deps.db, eventID);

    res.json({ event });
  });

  return router;
}
