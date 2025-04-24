import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const uploadsTable = sqliteTable("uploads", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  size: int().notNull(),
  type: text().notNull(),
  url: text().notNull(),
  eventId: text().notNull(),
});
