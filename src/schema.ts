import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const events = sqliteTable("events", {
  id: text().primaryKey(),
  name: text().notNull(),
});

export const uploads = sqliteTable("uploads", {
  id: text().primaryKey(),
  name: text().notNull(),
  url: text().notNull(),
  eventId: text("event_id").notNull(),
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
