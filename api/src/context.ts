import type * as trpcExpress from "@trpc/server/adapters/express";

import { db } from "./db.js";

export function createContext({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) {
  return {
    db,
    req,
    res,
  };
}
export type Context = Awaited<ReturnType<typeof createContext>>;
