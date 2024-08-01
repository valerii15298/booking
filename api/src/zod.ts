import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { assets, bookings } from "./schema.js";

export const zStr = z.string().min(1);
const MAX_INTEGER = 2 ** 31 - 1;
export const zInt = z.coerce.number().int().min(1).max(MAX_INTEGER);

// bookings
const bookingInput = createInsertSchema(bookings);
const booking = createSelectSchema(bookings);

// assets
const assetInput = createInsertSchema(assets);
const asset = createSelectSchema(assets);

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Types {
  export type BookingInput = z.infer<typeof bookingInput>;
  export type Booking = z.infer<typeof booking>;
  export type AssetInput = z.infer<typeof assetInput>;
  export type Asset = z.infer<typeof asset>;
}

export const zod = {
  bookingInput,
  booking,
  assetInput,
  asset,
};
