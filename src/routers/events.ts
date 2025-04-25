import { Router } from "express";
import type { DB } from "../db.ts";
import { findEventByID, insertEvent, findAllEvents } from "../repos/events.ts";
import { toDataURL } from "qrcode";

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

    const qrCodeURL = await toDataURL(`http://localhost:5173/${eventID}`);

    res.json({ event: { ...event, qrCodeURL } });
  });

  return router;
}
