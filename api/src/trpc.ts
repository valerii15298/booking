import { initTRPC } from "@trpc/server";
import superjson from "superjson";

import type { Context } from "./context.js";
import { d, s } from "./db.js";
import { zInt, zod } from "./zod.js";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const appRouter = t.router({
  assets: {
    list: t.procedure.query(async ({ ctx: { db } }) =>
      db.query.assets.findMany({ with: { bookings: true } }),
    ),

    // CRUD
    create: t.procedure
      .input(zod.assetInput)
      .mutation(({ input, ctx: { db } }) => db.insert(s.assets).values(input)),

    delete: t.procedure
      .input(zInt)
      .mutation(({ input, ctx: { db } }) =>
        db.delete(s.assets).where(d.eq(s.assets.id, input)),
      ),
  },

  bookings: {
    list: t.procedure.query(async ({ ctx: { db } }) =>
      (await db.select().from(s.bookings).orderBy(d.asc(s.bookings.from))).map(
        (b) => ({
          ...b,
          from: b.from.getTime(),
          to: b.to.getTime(),
        }),
      ),
    ),

    // CRUD
    create: t.procedure
      .input(zod.bookingInput)
      .mutation(({ input, ctx: { db } }) =>
        db.insert(s.bookings).values(input),
      ),

    update: t.procedure
      .input(zod.booking)
      .mutation(({ input: { id, ...input }, ctx: { db } }) =>
        db.update(s.bookings).set(input).where(d.eq(s.bookings.id, id)),
      ),

    delete: t.procedure
      .input(zInt)
      .mutation(({ input, ctx: { db } }) =>
        db.delete(s.bookings).where(d.eq(s.bookings.id, input)),
      ),
  },
});

export type AppRouter = typeof appRouter;
