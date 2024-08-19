import fastifyCompress from "@fastify/compress";
import fastifyStatic from "@fastify/static";
import type { FastifyTRPCPluginOptions } from "@trpc/server/adapters/fastify";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import path from "path";

import { env } from "./config.js";
import { createContext } from "./context.js";
import type { AppRouter } from "./trpc.js";
import { appRouter } from "./trpc.js";

function main() {
  const server = fastify({ logger: true });

  server.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: {
      router: appRouter,
      createContext,
      onError({ path, error }) {
        // report to error monitoring
        // eslint-disable-next-line no-console
        console.error(`Error in tRPC handler on path '${path}':`, error);
      },
    } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
  });

  server.register(fastifyCompress);

  server.register(fastifyStatic, {
    root: path.resolve("public"),
    prefix: "/",
    wildcard: false,
  });

  server.get("*", (_, res) => {
    res.sendFile("index.html");
  });

  server.listen({ port: env.PORT, host: "0.0.0.0" }, (err, url) => {
    if (err !== null) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    // eslint-disable-next-line no-console
    console.log(`\napi listening on ${url}`);
  });
}

main();
