import type * as trpcExpress from "@trpc/server/adapters/fastify";

import { db } from "./db.js";

export function createContext({
  req,
  res,
}: trpcExpress.CreateFastifyContextOptions) {
  return {
    db,
    req,
    res,
  };
}
export type Context = Awaited<ReturnType<typeof createContext>>;
