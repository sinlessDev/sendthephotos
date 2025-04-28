import { Router } from "express";
import { toFileStream } from "qrcode";
import ZipStream from "zip-stream";
import type { Config } from "../config.ts";
import type { DB } from "../db.ts";
import {
  deleteEvent,
  insertEvent,
  mustFindEventByID,
} from "../repos/events-repo.ts";

export function createEventsRouter(db: DB, config: Config) {
  const router = Router();

  router.post("/", async (req, res) => {
    const { name } = req.body;

    const eventID = await insertEvent(db, { name, paid: false });

    res.json({ event: { id: eventID } });
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

    const event = await mustFindEventByID(db, eventID);

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${event.name}.zip"`
    );

    const zip = new ZipStream();

    zip.pipe(res);

    for (const upload of event.uploads) {
      const response = await fetch(`${config.tusdBaseURL}/files/${upload.id}`);

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
