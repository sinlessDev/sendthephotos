import { eq } from "drizzle-orm";
import type { Deps } from "../deps.ts";
import { events } from "../schema.ts";

export async function findEventByID(deps: Pick<Deps, "db">, eventID: string) {
  const event = await deps.db.query.events.findFirst({
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
