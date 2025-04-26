import { relations } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { boolean, jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";
import type { Conf } from "./conf.ts";

export const events = pgTable("events", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  paid: boolean("paid").notNull(),
});

export const uploads = pgTable("uploads", {
  id: text().primaryKey(),
  metadata: jsonb().$type<{ filename: string; mimeType: string }>().notNull(),
  eventId: uuid("event_id").notNull(),
  fingerprint: text().notNull(),
});

export const uploadsRel = relations(uploads, ({ one }) => ({
  event: one(events, {
    fields: [uploads.eventId],
    references: [events.id],
  }),
}));

export const eventsRel = relations(events, ({ many }) => ({
  uploads: many(uploads),
}));

export function createDB(conf: Conf) {
  const db = drizzle(conf.databaseURL, {
    schema: {
      events,
      uploads,
      eventsRel,
      uploadsRel,
    },
  });

  return db;
}

export type DB = ReturnType<typeof createDB>;
