import { eq } from "drizzle-orm";
import type { DB } from "../db.ts";
import { events } from "../schema.ts";

export async function findEventByID(db: DB, eventID: string) {
  const event = await db.query.events.findFirst({
    where: eq(events.id, eventID),
    with: {
      uploads: {
        columns: {
          id: true,
          name: true,
          url: true,
        },
      },
    },
  });

  if (!event) {
    throw new Error(`Query failed: Event ${eventID} not found`);
  }

  return event;
}

type InsertingEvent = typeof events.$inferInsert;

export async function insertEvent(db: DB, event: InsertingEvent) {
  const [insertedEvent] = await db.insert(events).values(event).returning({
    id: events.id,
  });

  return insertedEvent.id;
}
