import * as trpcExpress from "@trpc/server/adapters/express";
import compression from "compression";
import express from "express";
import path from "path";

import { env } from "./config.js";
import { createContext } from "./context.js";
import { appRouter } from "./trpc.js";

function main() {
  const app = express();
  app.use(compression());
  app.use(express.static("public"));

  app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
      createContext,
      router: appRouter,
    }),
  );

  app.get("*", (_, res) => {
    res.sendFile(path.resolve("public/index.html"));
  });

  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`\napi listening on 0.0.0.0:${env.PORT}`);
  });
}

main();
