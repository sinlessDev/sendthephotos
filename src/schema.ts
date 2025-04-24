import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const uploadsTable = sqliteTable("uploads", {
  id: text().primaryKey(),
  name: text().notNull(),
  size: int().notNull(),
  type: text().notNull(),
  url: text().notNull(),
  uploadedAt: text(),
  eventId: text().notNull(),
});
