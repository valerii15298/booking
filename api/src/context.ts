import type * as trpcExpress from "@trpc/server/adapters/fastify";
import type { Observer } from "@trpc/server/observable";

import { db } from "./db.js";
import type { Types } from "./zod.js";

const updateBooking: Observer<Types.Booking, unknown>[] = [];
export function createContext({
  req,
  res,
}: trpcExpress.CreateFastifyContextOptions) {
  return {
    db,
    req,
    res,
    updateBooking,
  };
}
export type Context = Awaited<ReturnType<typeof createContext>>;
