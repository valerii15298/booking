import { relations } from "drizzle-orm";
import * as pgCore from "drizzle-orm/pg-core";

export const assets = pgCore.pgTable("assets", {
  id: pgCore.integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: pgCore.varchar("name").notNull(),
});

export const bookings = pgCore.pgTable("bookings", {
  id: pgCore.integer("id").primaryKey().generatedAlwaysAsIdentity(),
  from: pgCore.timestamp("from").notNull(),
  to: pgCore.timestamp("to").notNull(),
  updatedAt: pgCore.timestamp("updatedAt").notNull().defaultNow(),
  assetId: pgCore
    .integer("assetId")
    .notNull()
    .references(() => assets.id),
});

export const assetsRelations = relations(assets, ({ many }) => ({
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  asset: one(assets, {
    fields: [bookings.assetId],
    references: [assets.id],
  }),
}));
