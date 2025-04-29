import { relations } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  boolean,
  customType,
  jsonb,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import type { Config } from "./config.ts";

const bytea = customType<{ data: Buffer }>({
  dataType() {
    return "bytea";
  },
});

export const users = pgTable("users", (t) => ({
  id: t.uuid().primaryKey(),
  email: t.text().notNull().unique(),
  salt: bytea().notNull(),
  hashedPassword: bytea().notNull(),
}));

export const events = pgTable("events", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  paid: boolean().notNull(),
});

export const uploads = pgTable("uploads", {
  id: text().primaryKey(),
  metadata: jsonb().$type<{ filename: string; mimeType: string }>().notNull(),
  eventId: uuid("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),
  fingerprint: text().notNull(),
  batchId: text("batch_id").notNull(),
  visible: boolean().notNull(),
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

export function createDB(config: Config) {
  const db = drizzle(config.databaseURL, {
    schema: {
      events,
      uploads,
      eventsRel,
      uploadsRel,
      users,
    },
  });

  return db;
}

export type DB = ReturnType<typeof createDB>;
