import { eq } from "drizzle-orm";
import type { DB } from "../db.ts";
import { events } from "../db.ts";

export async function findEventByID(db: DB, eventID: string) {
  const event = await db.query.events.findFirst({
    where: eq(events.id, eventID),
    columns: {
      name: true,
    },
    with: {
      uploads: {
        columns: {
          id: true,
          metadata: true,
        },
      },
    },
  });

  if (!event) {
    throw new Error(`Query failed: Event ${eventID} not found`);
  }

  return event;
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
