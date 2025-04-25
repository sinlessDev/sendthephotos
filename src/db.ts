import { relations } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import type { Conf } from "./config.ts";

export const events = pgTable("events", {
  id: uuid().primaryKey(),
  name: text().notNull(),
});

export const uploads = pgTable("uploads", {
  id: uuid().primaryKey(),
  name: text().notNull(),
  url: text().notNull(),
  eventId: uuid("event_id").notNull(),
});

export const uploadsRelations = relations(uploads, ({ one }) => ({
  event: one(events, {
    fields: [uploads.eventId],
    references: [events.id],
  }),
}));

export const eventsRelations = relations(events, ({ many }) => ({
  uploads: many(uploads),
}));

export function createDB(conf: Conf) {
  const db = drizzle(conf.databaseURL, {
    schema: {
      events,
      uploads,
      eventsRelations,
      uploadsRelations,
    },
  });

  return db;
}

export type DB = ReturnType<typeof createDB>;
