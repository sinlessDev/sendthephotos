import { eq } from "drizzle-orm";
import { events } from "../schema.ts";
import type { DB } from "../db.ts";

export async function findEventByID({ db }: { db: DB }, eventID: string) {
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
