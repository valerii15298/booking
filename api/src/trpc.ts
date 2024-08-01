import { initTRPC } from "@trpc/server";

import type { Context } from "./context.js";
import { s } from "./db.js";
import { zod } from "./zod.js";

// eslint-disable-next-line id-length
const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
  assets: {
    list: t.procedure.query(async ({ ctx: { db } }) =>
      db.query.assets.findMany(),
    ),

    // CRUD
    create: t.procedure
      .input(zod.assetInput)
      .mutation(({ input, ctx: { db } }) => db.insert(s.assets).values(input)),
  },
});

export type AppRouter = typeof appRouter;
