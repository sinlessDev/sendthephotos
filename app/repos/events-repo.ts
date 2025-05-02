import { eq } from "drizzle-orm";
import type { DB } from "../db.ts";
import { events, uploads } from "../db.ts";

export async function mustFindEventByID(db: DB, eventID: string) {
  const event = await db.query.events.findFirst({
    where: eq(events.id, eventID),
    columns: {
      name: true,
      paid: true,
    },
    with: {
      uploads: {
        columns: {
          id: true,
          metadata: true,
          visible: true,
        },
      },
    },
  });

  if (!event) {
    throw new Error(`Query failed: Event ${eventID} not found`);
  }

  let uploadAvailable: boolean;

  const [count] = await getUniqBatches(db, eventID);

  if (event.paid) {
    uploadAvailable = true;
  } else {
    uploadAvailable = count < 1;
  }

  const totalUploadsCount = event.uploads.length;
  const videoUploadsCount = event.uploads.filter((upload) =>
    upload.metadata.mimeType.startsWith("video/"),
  ).length;
  const photoUploadsCount = totalUploadsCount - videoUploadsCount;

  return {
    ...event,
    uploadAvailable,
    stats: {
      totalUploadsCount,
      videoUploadsCount,
      photoUploadsCount,
    },
  };
}

type NewEvent = typeof events.$inferInsert;

export async function insertEvent(db: DB, event: NewEvent) {
  const [insertedEvent] = await db.insert(events).values(event).returning({
    id: events.id,
  });

  return insertedEvent.id;
}

export async function getUniqBatches(db: DB, eventID: string) {
  const batchIDs = await db
    .selectDistinctOn([uploads.batchId], {
      batchId: uploads.batchId,
    })
    .from(uploads)
    .where(eq(uploads.eventId, eventID));

  return [batchIDs.length, batchIDs.map((batch) => batch.batchId)] as const;
}

export async function getEventPaid(db: DB, eventID: string) {
  const event = await mustFindEventByID(db, eventID);

  return event.paid;
}

export async function deleteEvent(db: DB, eventID: string) {
  await db.transaction(async (tx) => {
    await tx.delete(uploads).where(eq(uploads.eventId, eventID));
    await tx.delete(events).where(eq(events.id, eventID));
  });
}
