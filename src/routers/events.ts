import { Router } from "express";
import type { DB } from "../db.ts";
import { findEventByID, insertEvent, findAllEvents } from "../repos/events.ts";
import { toFileStream } from "qrcode";
import ZipStream from "zip-stream";

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

  router.get("/:eventID/qr", async (req, res) => {
    const { eventID } = req.params;

    const event = await findEventByID(deps.db, eventID);

    res.setHeader("Content-Type", "image/png");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${event.name}.png"`
    );

    toFileStream(res, `http://localhost:5173/${eventID}`, {
      width: 512,
      margin: 0,
      errorCorrectionLevel: "high",
    });
  });

  router.get("/:eventID/zip", async (req, res) => {
    const { eventID } = req.params;

    const event = await findEventByID(deps.db, eventID);

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${event.name}.zip"`
    );

    const zip = new ZipStream();

    zip.pipe(res);

    for (const upload of event.uploads) {
      const response = await fetch(`http://localhost:8080/files/${upload.id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch file ${upload.id}`);
      }

      const arrayBuffer = await response.arrayBuffer();

      await new Promise<void>((resolve, reject) =>
        zip.entry(
          Buffer.from(arrayBuffer),
          {
            name: upload.metadata.filename,
          },
          (err) => {
            if (err) {
              reject(err);
            }
            resolve();
          }
        )
      );
    }

    zip.finalize();
  });

  return router;
}
