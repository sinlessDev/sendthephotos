import { Router } from "express";
import type { Deps } from "../deps.ts";
import { findEventByID } from "../repos/events.ts";

export function createEventsRouter(deps: Deps) {
  const router = Router();

  router.get("/:eventID", async (req, res) => {
    const { eventID } = req.params;

    const event = await findEventByID(deps, eventID);

    res.json(event);
  });

  return router;
}
