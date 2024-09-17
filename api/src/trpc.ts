import { initTRPC } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import superjson from "superjson";

import type { Context } from "./context.js";
import { d, s } from "./db.js";
import type { Types } from "./zod.js";
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
      .mutation(async ({ input, ctx: { db } }) =>
        db
          .insert(s.bookings)
          .values(input)
          .returning()
          .then((r) => r[0]!),
      ),

    update: t.procedure
      .input(zod.booking)
      .mutation(async ({ input: { id, ...b }, ctx: { db, updateBooking } }) => {
        const updatedAt = new Date(
          Math.min(b.updatedAt.getTime(), new Date().getTime()),
        ); // TODO handle on db side, insert current date if updatedAt > now()
        await db
          .update(s.bookings)
          .set(b)
          .where(
            d.and(
              d.eq(s.bookings.id, id),
              d.lt(s.bookings.updatedAt, updatedAt),
            ),
          );
        updateBooking.forEach((emit) => {
          emit.next({ ...b, id });
        });
      }),

    updated: t.procedure.subscription(({ ctx }) =>
      observable<Types.Booking>((emit) => {
        ctx.updateBooking.push(emit);
        return () => {
          ctx.updateBooking.splice(ctx.updateBooking.indexOf(emit), 1);
        };
      }),
    ),

    delete: t.procedure
      .input(zInt)
      .mutation(({ input, ctx: { db } }) =>
        db.delete(s.bookings).where(d.eq(s.bookings.id, input)),
      ),
  },
});

export type AppRouter = typeof appRouter;
