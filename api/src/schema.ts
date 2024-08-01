import * as pgCore from "drizzle-orm/pg-core";

export const assets = pgCore.pgTable("assets", {
  id: pgCore.integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: pgCore.varchar("name").notNull(),
});

export const bookings = pgCore.pgTable("bookings", {
  id: pgCore.integer("id").primaryKey().generatedAlwaysAsIdentity(),
  from: pgCore.timestamp("from").notNull(),
  to: pgCore.timestamp("to").notNull(),
  assetId: pgCore
    .integer("assetId")
    .notNull()
    .references(() => assets.id),
});
