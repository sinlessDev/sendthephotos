import { Router } from "express";
import type { DB } from "../db.ts";
import {
  mustFindEventByID,
  insertEvent,
  findAllEvents,
  findEventByID,
  getEventForGuest,
  deleteEvent,
} from "../repos/events-repo.ts";
import { toFileStream } from "qrcode";
import ZipStream from "zip-stream";

export function createEventsRouter(db: DB) {
  const router = Router();

  router.post("/", async (req, res) => {
    const { name } = req.body;

    const eventID = await insertEvent(db, { name, paid: false });

    res.json({ event: { id: eventID } });
  });

  router.get("/", async (req, res) => {
    const events = await findAllEvents(db);

    res.json({ events });
  });

  router.get("/:eventID", async (req, res) => {
    const { eventID } = req.params;

    const event = await findEventByID(db, eventID);

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    res.json({ event });
  });

  router.delete("/:eventID", async (req, res) => {
    const { eventID } = req.params;

    await deleteEvent(db, eventID);

    res.status(204).end();
  });

  router.get("/:eventID/qr", async (req, res) => {
    const { eventID } = req.params;

    const event = await mustFindEventByID(db, eventID);

    res.setHeader("Content-Type", "image/png");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${event.name}.png"`,
    );

    toFileStream(res, `http://localhost:5173/${eventID}`, {
      width: 512,
      margin: 0,
      errorCorrectionLevel: "high",
    });
  });

  router.get("/:eventID/:fingerprint", async (req, res) => {
    const { eventID, fingerprint } = req.params;

    const event = await getEventForGuest(db, eventID, fingerprint);

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    res.json({ event });
  });

  router.get("/:eventID/zip", async (req, res) => {
    const { eventID } = req.params;

    const event = await mustFindEventByID(db, eventID);

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${event.name}.zip"`,
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
          },
        ),
      );
    }

    zip.finalize();
  });

  return router;
}
