import { count, eq } from "drizzle-orm";
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

  return { ...event, uploadAvailable };
}

export async function findEventByID(db: DB, eventID: string) {
  try {
    return await mustFindEventByID(db, eventID);
  } catch (error) {
    return null;
  }
}

type NewEvent = typeof events.$inferInsert;

export async function insertEvent(db: DB, event: NewEvent) {
  const [insertedEvent] = await db.insert(events).values(event).returning({
    id: events.id,
  });

  return insertedEvent.id;
}

export async function findAllEvents(db: DB) {
  return await db.query.events.findMany();
}

export async function getEventForGuest(
  db: DB,
  eventID: string,
  fingerprint: string
) {
  const event = await db.query.events.findFirst({
    where: eq(events.id, eventID),
    columns: {
      name: true,
      paid: true,
    },
    with: {
      uploads: {
        where: eq(uploads.visible, true),
        columns: {
          id: true,
          metadata: true,
          fingerprint: true,
        },
      },
    },
  });

  if (!event) {
    return null;
  }

  const markedUploads = event.uploads
    .map((upload) => {
      return {
        id: upload.id,
        metadata: upload.metadata,
        deletable: upload.fingerprint === fingerprint,
      };
    })
    .toSorted((a, b) => (b.deletable ? 1 : 0) - (a.deletable ? 1 : 0));

  let uploadAvailable: boolean;

  const [count] = await getUniqBatches(db, eventID);

  if (event.paid) {
    uploadAvailable = true;
  } else {
    uploadAvailable = count < 1;
  }

  return {
    name: event.name,
    paid: event.paid,
    uploads: markedUploads,
    uploadAvailable,
  };
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
