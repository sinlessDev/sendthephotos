import { eq } from "drizzle-orm";
import type { DB } from "../db.ts";
import { events } from "../db.ts";

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

type NewEvent = typeof events.$inferInsert;

export async function upsertEvent(db: DB, event: NewEvent) {
  const [insertedEvent] = await db
    .insert(events)
    .values(event)
    .onConflictDoUpdate({
      target: events.id,
      set: {
        name: event.name,
      },
    })
    .returning({
      id: events.id,
    });

  return insertedEvent.id;
}
